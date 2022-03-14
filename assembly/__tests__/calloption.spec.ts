import { calcOptionPayoff, callOptionPrice } from "../main";
import { PostedMessage } from "../model";

function createMessage(text: string): PostedMessage {
  return new PostedMessage(text);
}

const message = createMessage("hello world");

describe("call option price test", () => {
  it("calculate value of call option using verified inputs - because callOptionPrice is dependent on calculateD1 and normalCDF this is aslo test of those functions", () => {
    var price = <f64>parseFloat(callOptionPrice(100.0, 99.5, 0.07, 0.25, 0.05));
    expect(price - 2.42182).toBeLessThan(
      0.2,
      "the output price should be close to the excel benchmark"
    );
  });
});

describe("pay off test", () => {
  it("verifies that the payoff funciton is working as expected - stock price > K ", () => {
    calcOptionPayoff(100.0, 50.0, 0, 0.25);
    var payoff = calcOptionPayoff(100.0, 50.0, 0, 0.25);
    expect(payoff).toBeGreaterThan(0, "the payoff should be positive");
  });
  it("verifies that the payoff funciton is working as expected - stock price < K ", () => {
    var payoff = calcOptionPayoff(50.0, 100.0, 0, 0.25);
    expect(payoff).toBe(0, "the payoff should be zero");
  });
});
