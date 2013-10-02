var expect = chai.expect;

describe('Evaluator', function() {
  var e, digits, operators;

  before(function() {
    // This is run before all the tests (once)
    digits = _.map(_.range(10), function(n) {
      return n + "";
    });
    operators = ['+', '-', 'x', '÷'];
  });
  beforeEach(function() {
    // This is run before each test
    e = new Evaluator();
  });

  function inject(e, expr) {
    // Helper function to build chained #append() calls from
    // a whitespace-separated string of symbols
    var i, r;
    var symbols = expr.split(/\s/);
    for (i = 0; i < symbols.length; i++) {
      r = e.append(symbols[i]);
      if (r != e) {
        return r;
      }
    }
    return e;
  };

  describe("#reset()", function() {
    it("should return a zero", function() {
      expect(e.reset().toString()).to.equal("0");
    });
  });

  describe("#append()", function() {
    describe("at the start of an expression", function() {
      it("should allow a digit", function() {
        digits.forEach(function(d) {
          e = new Evaluator();
          expect(e.append(d).toString()).to.equal(d);
        });
      });
      it("should allow a decimal point", function() {
        expect(e.append(".").toString()).to.equal("0.");
      });
      it("should allow a left parenthesis", function() {
        expect(e.append("(").toString()).to.equal("(");
      });
      it("should toggle sign from positive to negative", function() {
        expect(e.append("±").toString()).to.equal("-");
      });
      it("should toggle sign from negative to positive", function() {
        expect(inject(e, "± ±").toString()).to.equal("");
      });
      it("should toggle sign from negative to negative through positive", function() {
        expect(inject(e, "± ± ±").toString()).to.equal("-");
      });
    });
    describe("within an operand input", function() {
      it("should allow a digit after a digit", function() {
        digits.forEach(function(d) {
          e = new Evaluator();
          expect(inject(e, "1 " + d).toString()).to.equal("1" + d);
        });
      });
      it("should allow one decimal point", function() {
        expect(inject(e, "1 .").toString()).to.equal("1.");
      });
      it("should not allow more than one decimal point", function() {
        expect(inject(e, "1 . .")).to.equal(null);
      });
      it("should allow a digit to follow a decimal point", function() {
        expect(inject(e, "1 . 0").toString()).to.equal("1.0");
      });
      it("should allow multiple digits to follow a decimal point", function() {
        expect(inject(e, "3 . 1 4").toString()).to.equal("3.14");
      });
      it("should toggle sign from positive to negative", function() {
        expect(inject(e, "1 ±").toString()).to.equal("-1");
      });
      it("should toggle sign from negative to positive", function() {
        expect(inject(e, "1 ± ±").toString()).to.equal("1");
      });
      it("should toggle sign from negative to negative through positive", function() {
        expect(inject(e, "1 ± ± ±").toString()).to.equal("-1");
      });
      it("should allow an operator to terminate an operand", function() {
        operators.forEach(function(o) {
          e = new Evaluator();
          expect(inject(e, "1 " + o).toString()).to.equal("1" + o);
        });
      });
      it("should not allow more than one contiguous operator", function() {
        expect(inject(e, "1 + +")).to.equal(null);
      });
    });
  });
  describe("#run()", function() {
    describe("simple expressions", function() {
      it("should add two integers", function() {
        expect(inject(e, "1 + 1").run().toString()).to.equal("2");
      });
      it("should add two floats", function() {
        expect(inject(e, "3 . 1 4 + 2 . 7 1").run().toString()).to.equal("5.85");
      });
      it("should subtract two integers", function() {
        expect(inject(e, "1 - 1").run().toString()).to.equal("0");
      });
      it("should subtract two floats", function() {
        // Note that we need to slice the answer to handle possible rounding errors
        expect(inject(e, "3 . 1 4 - 2 . 7 1").run().toString().slice(0,4)).to.equal("0.43");
      });
      it("should multiply two integers", function() {
        expect(inject(e, "1 0 x 1 0").run().toString()).to.equal("100");
      });
      it("should multiply two floats", function() {
        // Note that we need to slice the answer to handle possible rounding errors
        expect(inject(e, "3 . 1 4 x 2 . 7 1").run().toString().slice(0,3)).to.equal("8.5");
      });
      it("should divide two integers", function() {
        expect(inject(e, "1 0 ÷ 5").run().toString()).to.equal("2");
      });
      it("should divide two floats", function() {
        // Note that we need to slice the answer to handle possible rounding errors
        expect(inject(e, "3 . 3 3 ÷ 1 . 1 1").run().toString()).to.equal("3");
      });
    });
  });
});