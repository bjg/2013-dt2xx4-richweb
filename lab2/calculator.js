/**
 * Calculator front-end
 */
function Calculator() {
  this.output = document.getElementById("output");
  this.evaluator = new Evaluator();
  registerButtons.call(this);

  function registerButtons() {
    var that = this;
    var keyPressed = function() {
      var symbol = this.innerHTML;
      var expr;
      switch (symbol) {
        case "C":
          that.output.value = that.evaluator.reset();
          break;
        case "=":
          that.output.value = that.evaluator.run();
          break;
        default:
          expr = that.evaluator.append(symbol);
          if (expr) {
            that.output.value = expr;
          }
          break;
      }
    };
    var addEvent = function(element, name, handler) {
      try {
        if (element.attachEvent) {
          return element.attachEvent('on'+name, handler);
        } else {
          return element.addEventListener(name, handler, false);
        }
      } catch (ex) {
        console.log(element, name);
      }
    };
    var buttons = document.getElementsByTagName("button");
    var i;
    for (i in buttons) {
      addEvent(buttons[i], 'click', keyPressed);
    }
  }
}
