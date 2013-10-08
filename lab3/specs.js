var expect = chai.expect;

describe("Messages", function() {
  var textArea, counter, startCount, submit, messages, ready = false;

  before(function(done) {
    var body, iFrame;

    /*
     * Let's use a dynamically-created iframe to load the markup
     * and code under test. Because element loading will be asynchronous
     * with respect to this runner code, we need to use an on-load
     * callback to signal to the runner when we're done and then wait
     * until this happens
     */
    iFrame = document.createElement('iframe');
    iFrame.src = "/index.html";
    iFrame.style.display = "none";
    iFrame.onload = function() {
      var doc = iFrame.contentWindow || iFrame.contentDocument;
      if (doc.document) {
        doc = doc.document;
      }
      textArea = doc.getElementById('messageText');
      counter = doc.getElementById('messageCounter');
      startCount = parseInt(counter.innerHTML, 10);
      submit = doc.getElementById('submit');
      messages = doc.getElementById('messageList');
      ready = true;
      done();
    };
    body = document.getElementsByTagName('body')[0];
    body.appendChild(iFrame);
  });

  beforeEach(function() {
    textArea.value = "";
    counter.innerHTML = startCount;
    messages.innerHTML = "";
  });

  function _debug(msg) {
    console.log(msg);
  }

  function _triggerKeyboardEvent(el, keyCode) {
    var ev = ("createEventObject" in document) ?
      document.createEventObject() : document.createEvent("Events");
    if(ev.initEvent){
      ev.initEvent("keyup", true, true);
    }
    ev.keyCode = keyCode;
    ev.which = keyCode;
    return el.dispatchEvent ? el.dispatchEvent(ev) : el.fireEvent("onkeyup", ev);
  }

  function _triggerClickEvent(el) {
    var ev = ("createEventObject" in document) ?
      document.createEventObject() : document.createEvent("MouseEvents");
    if(ev.initEvent){
      ev.initEvent("click", true, true);
    }
    return el.dispatchEvent ? el.dispatchEvent(ev) : el.fireEvent("onclick", ev);
  }

  function _simulateInput(el, ch) {
    el.value += ch;
    _triggerKeyboardEvent(el, ch.charCodeAt(0));
  }

  // XXX Hack Alert
  // First test synchronises with the page load before continuing
  it("Waits for application page to load...", function(done) {
    var waitUntilLoaded = function(nAttempts) {
      if (ready) {
        done();
      } else if (nAttempts-- === 0) {
        done(Error("Timed out waiting for application page to load"));
      } else {
        setTimeout(function() {
          // Wait one second and try again
          waitUntilLoaded();
        }, 1000);
      }
    };
    waitUntilLoaded(10);
  });

  describe("elements under test should include the", function() {
    it("input field", function() {
      expect(textArea).to.not.equal(null);
    });
    it("character remaining counter", function() {
      expect(counter).to.not.equal(null);
    });
    it("submit button", function() {
      expect(submit).to.not.equal(null);
    });
    it("messages list", function() {
      expect(messages).to.not.equal(null);
    });
  });

  describe("input field", function() {
    it("is blank when nothing has been entered", function() {
      expect(textArea.value.length).to.equal(0);
    });
    it("is blank after a message has been submitted", function() {
      _simulateInput(textArea, "A");
      _triggerClickEvent(submit);
      expect(textArea.value.length).to.equal(0);
    });
  });

  describe("character remaining counter", function() {
    var _i;

    it("shows 140 when the input is empty", function() {
      expect(counter.innerHTML).to.equal(startCount + "");
    });
    it("shows 0 when the input is full", function() {
      for (_i = 0; _i < startCount; _i++) {
        _simulateInput(textArea, "A");
      }
      expect(counter.innerHTML).to.equal("0");
    });
    it("is correct for all other inputs", function() {
      _simulateInput(textArea, "A");
      for (_i = 1; _i < startCount - 1; _i++) {
        _simulateInput(textArea, "A");
        expect(counter.innerHTML).to.equal(startCount - 1 - _i + "");
      }
    });
    it("shows 140 after a message has been submitted", function() {
      _simulateInput(textArea, "A");
      _triggerClickEvent(submit);
      expect(counter.innerHTML).to.equal(startCount + "");
    });
  });

  describe("messages list", function() {
    it("should be empty when no messages have been entered", function() {
      expect(messages.childNodes.length).to.equal(0);
    });
    it("should be updated when a message is submitted", function() {
      _simulateInput(textArea, "A");
      _triggerClickEvent(submit);
      expect(messages.childNodes.length).to.equal(1);
    });
    it("should show most recent message at the top", function() {
      _simulateInput(textArea, "message 1");
      _triggerClickEvent(submit);
      _simulateInput(textArea, "message 2");
      _triggerClickEvent(submit);
      expect(messages.childNodes.length).to.equal(2);
      expect(messages.childNodes[0].innerHTML).to.equal("message 2");
    });
  });
});