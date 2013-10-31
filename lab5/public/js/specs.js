var expect = chai.expect;

describe("Messages", function() {
  var _$, textArea, counter, startCount, submit, messages, ready = false, asyncExpection = null;

  before(function(done) {
    var body, iFrame;

    /*
     * Let's use a dynamically-created iframe to load the markup
     * and code under test.
     */
    iFrame = document.createElement('iframe');
    iFrame.src = "/";
    iFrame.style.display = "none";
    /*
     * Because element loading will be asynchronous with respect to this
     * runner code, we need to use an on-load callback to signal to the
     * runner when we're done. We wait until this happens before proceeding
     * with any tests
     */
    iFrame.onload = function() {
      var doc;
      /*
       * Note that, here, we are using the copy of JQuery being loaded
       * in the page under test and not the JQuery instance from this
       * test runner script
       */
      _$ = iFrame.contentWindow.jQuery;
      textArea = _$('#messageText');
      counter = _$('#messageCounter');
      startCount = parseInt(counter.html(), 10);
      submit = _$('#submit');
      messages = _$('#messageList');
      doc = iFrame.contentWindow || iFrame.contentDocument;
      if (doc.document) {
        doc = doc.document;
      }
      _$(doc).bind('ajaxComplete', function(e) {
        /*
         * JQuery will raise this event on AJAX completions. We can hook our
         * expectations in at that point because the DOM will have been fully
         * updated. We maintain a single event handler but dynamically rebind
         * the individual tests
         */
        if (asyncExpection) {
          asyncExpection();
          asyncExpection = null;
        }
      });
      ready = true;
      done();
    };
    // iFrame only loads when we append it to our DOM
    body = document.getElementsByTagName('body')[0];
    body.appendChild(iFrame);
  });

  beforeEach(function() {
    textArea.val("");
    counter.html(startCount);
  });

  function _debug(msg) {
    console.log(msg);
  }

  function _triggerClickEvent(el) {
    return el.trigger("click");
  }

  function _simulateInput(el, ch) {
    el.val(el.val() + ch);
    return el.trigger("keyup");
  }

  function asyncExpect(expectation, done) {
    if (typeof expectation !== "function") {
      throw Error("asyncExpect: " + expectation + " is not a function!");
    }
    if (typeof done !== "function") {
      throw Error("asyncExpect: " + done + " is not a function!");
    }
    // Temporarily bind to the ajaxComplete handler
    asyncExpection = function() {
      expectation();
      done();
    };
  }

  // XXX Hack Alert
  // First "test" synchronises with the page load before continuing
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
      expect(textArea.val()).to.equal("");
    });
    it("is blank after a message has been submitted", function(done) {
      asyncExpect(function() {
        expect(textArea.val()).to.equal("");
      }, done);
      _simulateInput(textArea, "A");
      _triggerClickEvent(submit);
    });
  });

  describe("character remaining counter", function() {
    var _i;

    it("shows 140 when the input is empty", function() {
      expect(counter.html()).to.equal(startCount + "");
    });
    it("shows 0 when the input is full", function() {
      for (_i = 0; _i < startCount; _i++) {
        _simulateInput(textArea, "B");
      }
      expect(counter.html()).to.equal("0");
    });
    it("is correct for all other inputs", function() {
      _simulateInput(textArea, "C");
      for (_i = 1; _i < startCount - 1; _i++) {
        _simulateInput(textArea, "C");
        expect(counter.html()).to.equal(startCount - 1 - _i + "");
      }
    });
    it("shows 140 after a message has been submitted", function(done) {
      asyncExpect(function() {
        expect(counter.html()).to.equal(startCount + "");
      }, done);
      _simulateInput(textArea, "DDDD");
      _triggerClickEvent(submit);
    });
  });

  describe("entered list", function() {
    it("should be updated when a message is submitted", function(done) {
      asyncExpect(function() {
        expect(messages.find(".messageEntry").length).to.be.above(0);
      }, done);
      _simulateInput(textArea, "EEEEE");
      _triggerClickEvent(submit);
    });
    it("entries should include an edit link", function(done) {
      asyncExpect(function() {
        expect(messages.find(".messageEdit").length).to.not.equal(0);
      }, done);
      _simulateInput(textArea, "FFFFFF");
      _triggerClickEvent(submit);
    });
    it("entries should include a remove link", function(done) {
      asyncExpect(function() {
        expect(messages.find(".messageRemove").length).to.not.equal(0);
      }, done);
      _simulateInput(textArea, "GGGGGGG");
      _triggerClickEvent(submit);
    });
    it("should show most recent message at the top", function(done) {
      asyncExpect(function() {
        var latest = messages.find(".messageEntry:first");
        expect(latest.html()).to.equal("HHHHHHHH");
      }, done);
      _simulateInput(textArea, "HHHHHHHH");
      _triggerClickEvent(submit);
    });
    it("entry should be removed when the trash icon is clicked", function(done) {
      var remove = messages.find(".messageEntry:last").parent();
      remove.addClass("removeMe");
      asyncExpect(function() {
        expect(messages.find(".removeMe").length).to.equal(0);
      }, done);
      _triggerClickEvent(remove.find(".messageRemove"));
    });
    it("entry text is updated when the edit icon is clicked", function(done) {
      var edit = messages.find(".messageEntry:last").parent();
      var count = messages.find(".messageEntry").length;
      expect(messages.find('.editing').length).to.equal(0);
      _triggerClickEvent(edit.find(".messageEdit"));
      expect(textArea.val()).to.equal(edit.find('.messageEntry').html());
      expect(edit.hasClass('editing')).to.equal(true);
      asyncExpect(function() {
        expect(messages.find('.editing').length).to.equal(0);
        expect(messages.find(".messageEntry").length).to.equal(count);
      }, done);
      _triggerClickEvent(submit);
    });
  });
});