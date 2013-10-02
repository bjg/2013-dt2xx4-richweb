/**
 * Encapsulation of an aritmethic operator
 */
var Operator = (function () {
  var tokens = {'(': 0, ')': 0, '+': 1, '-': 1, 'x': 2, '÷': 2};

  // Constructor
  function Operator(symbol) {
    if (!Operator.isOp(symbol)) {
      throw Error("Not a valid operator token: " + symbol);
    }
    this._op = symbol;
  }

  Operator.isOp = function (symbol) {
    return Object.keys(tokens).indexOf(symbol) !== -1;
  };
  Operator.Multiply = new Operator('x');
  Operator.Divide = new Operator('÷');
  Operator.Add = new Operator('+');
  Operator.Subtract = new Operator('-');
  Operator.Lparen = new Operator('(');
  Operator.Rparen = new Operator(')');
  Operator.isArithmetic = function (op) {
    return (op.equals(Operator.Multiply) ||
      op.equals(Operator.Divide) ||
      op.equals(Operator.Add) ||
      op.equals(Operator.Subtract));
  };

  Operator.prototype.toString = function () {
    return this._op;
  };
  Operator.prototype.isLower = function (other) {
    if (!other instanceof Operator) {
      throw Error("Argument is not an operator: " + other);
    }
    return tokens[this._op] < tokens[other._op];
  };
  Operator.prototype.equals = function (other) {
    return other instanceof Operator && this._op === other._op;
  };

  return Operator;
})();

/**
 * A Stack abstract data structure
 */
var Stack = (function () {
  function Stack() {
    this._storage = [];
  }

  var check = function () {
    if (this.isEmpty()) {
      throw Error("Stack is empty");
    }
  }
  Stack.prototype.isEmpty = function () {
    return this._storage.length === 0;
  };

  Stack.prototype.push = function (item) {
    this._storage.push(item);
  };
  Stack.prototype.pop = function () {
    check.call(this);
    return this._storage.pop();
  };
  Stack.prototype.peek = function () {
    check.call(this);
    return this._storage[this._storage.length - 1];
  };

  return Stack;
})();

/**
 * Infix expression evaluator
 */
function Evaluator() {
  var S = {
    START_OPERAND: 1,
    IN_OPERAND: 2,
    AFTER_RPAREN: 3
  };

  Evaluator.prototype.append = function (symbol) {
    switch (this.state) {
      case S.START_OPERAND:
        if (symbol === "±") {
          // The sign may be toggled at the beginning of an operand
          if (this.operand[0] === "-") {
            this.operand = "";
          } else {
            this.operand = "-";
          }
        } else if (symbol.match(/\d/)) {
          // A digit is a valid start of an operand
          this.state = S.IN_OPERAND;
          this.operand += symbol;
        } else if (symbol === "(") {
          // A left parenthesis is a valid start of operand
          ++this.nesting;
          this.infix.push(symbol);
        } else if (Operator.isOp(symbol)) {
          if (this.infix.length !== 0 &&
            !Operator.isOp(this.infix[this.infix.length - 1])) {
            // We're terminating a previous operand with an operator
            this.infix.push(symbol);
          } else if (this.lastResult > 0) {
            // If there result from a previous calculation, allow this
            // as the first operand and accept an operator now
            this.infix.push(this.lastResult);
            this.infix.push(symbol);
            this.state = S.IN_OPERAND;
          } else {
            // Can't accept an operator without a prior operand
            return null;
          }
        } else if (symbol === ".") {
          // A decimal point is a valid start of operand
          this.floatingPoint = true;
          this.operand = "0.";
          this.state = S.IN_OPERAND;
        } else {
          // Illegal symbol for this state
          return null;
        }
        break;
      case S.IN_OPERAND:
        if (symbol === "±") {
          // The sign may be toggled in the middle of an operand
          if (this.operand[0] === "-") {
            // If we're already negative, toggle to positive
            this.operand = this.operand.slice(1);
          } else {
            // If positive, then toggle to negative
            this.operand = "-" + this.operand;
          }
        } else if (symbol.match(/\d/)) {
          // A digit is valid in an operand
          this.operand += symbol;
        } else if (symbol === ".") {
          if (this.floatingPoint) {
            // Can't accept more than one decimal point
            return null;
          } else {
            // A decimal point is valid provided it's the first one
            this.floatingPoint = true;
            this.operand += symbol;
          }
        } else if (symbol === ")") {
          if (this.nesting--) {
            // A right parenthesis is valid if there is a matching left
            operandEnd.call(this, symbol);
          } else {
            // Unbalanced right parenthesis
            return null;
          }
        } else if (symbol === "(") {
          // Not a valid operand termination
          return null;
        } else if (Operator.isOp(symbol)) {
          // Operand is ended and an operator is being inserted
          operandEnd.call(this, symbol);
        } else {
          // Illegal symbol for this state
          return null;
        }
        break;
      case S.AFTER_RPAREN:
        if (Operator.isOp(symbol)) {
          // The only legal symbol after a right parenthesis is an operator
          this.infix.push(symbol);
        } else {
          return null;
        }
        break;
    }
    // Returning this allows for call chaining on #append()
    return this;
  };

  Evaluator.prototype.run = function () {
    operandEnd.call(this);
    var postfix = toPostfix.call(this);
    var stack = new Stack();
    postfix.forEach(function(symbol) {
      var op, op2;
      if (!Operator.isOp(symbol)) {
        stack.push(parseFloat(symbol, 10));
      } else {
        op = new Operator(symbol);
        if (op.equals(Operator.Multiply)) {
          stack.push(stack.pop() * stack.pop());
        } else if (op.equals(Operator.Divide)) {
          op2 = stack.pop();
          stack.push(stack.pop() / op2);
        } else if (op.equals(Operator.Add)) {
          stack.push(stack.pop() + stack.pop());
        } else if (op.equals(Operator.Subtract)) {
          op2 = stack.pop();
          stack.push(stack.pop() - op2);
        }
      }
    });
    this.reset(true);
    return this.lastResult = stack.pop();
  };

  Evaluator.prototype.reset = function (full) {
    this.state = S.START_OPERAND;
    this.operand = "";
    this.floatingPoint = false;
    if (full) {
      this.nesting = 0;
      this.infix = [];
      this.lastResult = null;
    }
    return "0";
  };

  Evaluator.prototype.toString = function() {
    return this.infix.join("") + this.operand;
  };

  function operandEnd(symbol) {
    if (this.operand) {
      this.infix.push(this.operand);
    }
    if (symbol) {
      this.infix.push(symbol);
    }
    this.reset(false);
  }

  /**
   * Infix to posfix using Dijkstra's shunting-yard algorithm
   */
  function toPostfix() {
    var stack = new Stack();
    var symbol, i;
    var postfix = [];
    var op;
    for (i in this.infix) {
      symbol = this.infix[i];
      if (!Operator.isOp(symbol)) {
        postfix.push(symbol);
      } else {
        op = new Operator(symbol);
        if (Operator.isArithmetic(op)) {
          while (!stack.isEmpty() && op.isLower(stack.peek())) {
            if (!stack.peek().equals(Operator.Lparen)) {
              postfix.push(stack.pop().toString());
            }
          }
        } else if (op.equals(Operator.Rparen)) {
          while (!stack.peek().equals(Operator.Lparen)) {
            postfix.push(stack.pop().toString());
          }
          stack.pop();
        }
        if (!op.equals(Operator.Rparen)) {
          stack.push(op);
        }
      }
    }
    while (!stack.isEmpty()) {
      postfix.push(stack.pop().toString());
    }
    return postfix;
  }

  this.reset(true);
}