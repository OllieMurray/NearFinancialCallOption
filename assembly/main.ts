import { PostedMessage, messages } from "./model";
import {
  context,
  u128,
  PersistentVector,
  RNG,
  u256,
  math,
  storage,
  logging,
} from "near-sdk-as";

// --- contract code goes below

// The maximum number of latest messages the contract returns.
const MESSAGE_LIMIT = 10;

//begin storage functions
//store option details in storage
export function storeNewOptionDetails(
  _spotPrice: string,
  _strikePrice: string,
  _volatility: string,
  _maturity: string,
  _interest: string,
  _price: string
): void {
  //set values in storage
  storage.set<f64>("spotPrice", <f64>parseFloat(_spotPrice));
  storage.set<f64>("strikePrice", <f64>parseFloat(_strikePrice));
  storage.set<f64>("volatility", <f64>parseFloat(_volatility));
  storage.set<f64>("maturity", <f64>parseFloat(_maturity));
  storage.set<f64>("interest", <f64>parseFloat(_interest));
  storage.set<f64>("price", <f64>parseFloat(_price));

  //return values from storage
  //included defaults but they should not be reached given they are set above
  const newSpotPrice = storage.getPrimitive<f64>("spotPrice", <f64>100.0);
  const newStrikePrice = storage.getPrimitive<f64>("strikePrice", <f64>99.5);
  const newVolatility = storage.getPrimitive<f64>("volatility", <f64>0.07);
  const newMaturity = storage.getPrimitive<f64>("maturity", <f64>0.25);
  const newInterest = storage.getPrimitive<f64>("interest", <f64>0.05);
  const newPrice = storage.getPrimitive<f64>("price", <f64>2.419685696445768);

  //log values in storage
  logging.log("spot price is now: " + newSpotPrice.toString());
  logging.log("strike price is now: " + newStrikePrice.toString());
  logging.log("volatility is now: " + newVolatility.toString());
  logging.log("maturity is now: " + newMaturity.toString());
  logging.log("interest is now: " + newInterest.toString());
  logging.log("price is now: " + newPrice.toString());
}

//future version should use a map instead of an array...
//return option details currently in storage
export function getOptionDetails(): Array<f64> {
  const optionDetails = new Array<f64>(6);
  //note, arrays start with index 0 according to https://www.assemblyscript.org/stdlib/array.html

  //return option details to array, return default values if they have not been set by function storeNewOptionDetails
  optionDetails[0] = storage.getPrimitive<f64>("spotPrice", <f64>100.0);
  optionDetails[1] = storage.getPrimitive<f64>("strikePrice", <f64>99.5);
  optionDetails[2] = storage.getPrimitive<f64>("volatility", <f64>0.07);
  optionDetails[3] = storage.getPrimitive<f64>("maturity", <f64>0.25);
  optionDetails[4] = storage.getPrimitive<f64>("interest", <f64>0.05);
  optionDetails[5] = storage.getPrimitive<f64>("price", <f64>2.419685696445768);
  return optionDetails;
}

//reset option details to defaults
export function resetOptiontoDefault(): void {
  storage.set<f64>("spotPrice", <f64>100.0);
  storage.set<f64>("strikePrice", <f64>99.5);
  storage.set<f64>("volatility", <f64>0.07);
  storage.set<f64>("maturity", <f64>0.25);
  storage.set<f64>("interest", <f64>0.05);
  storage.set<f64>("price", <f64>2.419685696445768);

  const newSpotPrice = storage.getPrimitive<f64>("spotPrice", <f64>100.0);
  const newStrikePrice = storage.getPrimitive<f64>("strikePrice", <f64>99.5);
  const newVolatility = storage.getPrimitive<f64>("volatility", <f64>0.07);
  const newMaturity = storage.getPrimitive<f64>("maturity", <f64>0.25);
  const newInterest = storage.getPrimitive<f64>("interest", <f64>0.05);
  const newPrice = storage.getPrimitive<f64>("price", <f64>2.419685696445768);

  logging.log("spot price is now (default value): " + newSpotPrice.toString());
  logging.log(
    "strike price is now (default value): " + newStrikePrice.toString()
  );
  logging.log("volatility is now (default value): " + newVolatility.toString());
  logging.log("maturity is now (default value): " + newMaturity.toString());
  logging.log("interest is now (default value): " + newInterest.toString());
  logging.log("price is now (default value): " + newPrice.toString());
}

//return the profits/losses that would have been realized on option purchase...
export function buyOption(): void {
  //pull the option details from the storage...
  const optionDetails = getOptionDetails();
  //simulate the option outcome...
  var optionPayOff = calcOptionPayoff(
    optionDetails[0], //spot price
    optionDetails[1], //strike price
    optionDetails[2], //volatility
    optionDetails[3] //maturity
  );
  //the profit/loss is the payoff minus the original option price...
  var investmentpayoff = optionPayOff - optionDetails[5]; //position 5 in optionDetails corresponds with price
  investmentpayoff.toString();

  //donation comment
  //looking for a better way to do conversions in AS...
  //currently using 'string' as a pivot point - i.e. convert from type u128 to string and from string to f64...
  //having trouble convertin directly from u128 to f64
  var donationComment = ". No donation was made =(.";
  var donationtest = context.attachedDeposit.toString();
  var donationtest2 = <f64>parseFloat(donationtest);

  if (context.attachedDeposit >= u128.from("10000000000000000000000")) {
    //let donation2: f64 = context.attachedDeposit as unknown as f64;
    var donation = donationtest2 / Math.pow(10, 24);
    //context.attachedDeposit.toString()
    donationComment =
      ". Thank you for supporting our work with a donation of: " +
      donation.toString() +
      " Ⓝ.";
  }

  //report the contract details and hypothetical transaction outcome to the message stack
  const message = new PostedMessage(
    "The investment in the option with contract details: spot price = " +
      optionDetails[0].toString() +
      ", strike price =" +
      optionDetails[1].toString() +
      ", volatility = " +
      optionDetails[2].toString() +
      ", maturity = " +
      optionDetails[3].toString() +
      ", interest rate = " +
      optionDetails[4].toString() +
      ".  That cost : " +
      optionDetails[5].toString() +
      " has resulted in a pay off of " +
      investmentpayoff.toString() +
      donationComment
  );
  messages.push(message);
}

//evaluate the price of the entered option
//ideally the method signature should take in <f64> as inputs
//however, I had issues converting from the front end to type f64
//I was able to convert from the input type (number in js) to string
//and to then convert the string to type f64 in the backend
//I would love to know what the best practices are here.
export function callOption(
  _spotPrice: string,
  _strikePrice: string,
  _volatility: string,
  _maturity: string,
  _interest: string
): void {
  // Generate a random number between 0 and 1
  const randomNumberGen = new RNG<u32>(1, u32.MAX_VALUE);
  var randomTemp = <f64>randomNumberGen.next();
  var randomTemp0to1 = randomTemp / <f64>u32.MAX_VALUE;

  var spotPrice = <f64>parseFloat(_spotPrice);
  var strikePrice = <f64>parseFloat(_strikePrice);
  var volatility = <f64>parseFloat(_volatility);
  var maturity = <f64>parseFloat(_maturity);
  var interest = <f64>parseFloat(_interest);

  //assert that the inputs are compatible with the assumptions of Black-Scholes
  assert(spotPrice > 0, "The spot price must be greater than 0");
  assert(strikePrice > 0, "The strike price must be greater than 0");
  assert(volatility >= 0, "The volatility cannot be negative");
  assert(maturity > 0, "The maturity must be greater than 0");
  assert(maturity >= 0, "The interest cannot be negative");

  var optionPrice = callOptionPrice(
    spotPrice,
    strikePrice,
    volatility,
    maturity,
    interest
  );

  storeNewOptionDetails(
    _spotPrice,
    _strikePrice,
    _volatility,
    _maturity,
    _interest,
    optionPrice
  );

  const message = new PostedMessage(
    "The price of the option with contract details : spot price = " +
      _spotPrice +
      ", strike price =" +
      _strikePrice +
      ", volatility = " +
      _volatility +
      ", maturity = " +
      _maturity +
      ", interest rate = " +
      _interest +
      " is equal to " +
      optionPrice
  );
  // Adding the message to end of the persistent collection
  messages.push(message);
  //store the option details in storage...
}

/**
 * Returns an array of last N messages.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */
export function getMessages(): PostedMessage[] {
  const numMessages = min(MESSAGE_LIMIT, messages.length);
  const startIndex = messages.length - numMessages;
  const result = new Array<PostedMessage>(numMessages);
  for (let i = 0; i < numMessages; i++) {
    result[i] = messages[i + startIndex];
  }
  return result;
}

//calculate the option price using the Black-Scholes Formulation
export function callOptionPrice(
  _spotPrice: f64,
  _strikePrice: f64,
  _volatility: f64,
  _maturity: f64,
  _interest: f64
): string {
  //refer to readme file for documentation links and explanations of Black-Scholes
  var d1 = calculateD1(_spotPrice, _strikePrice, _volatility, _maturity);
  var d2 = d1 - _volatility * sqrt(_maturity);
  var callPrice =
    normalCDF(d1) * _spotPrice -
    normalCDF(d2) * _strikePrice * Math.exp(-0.05 * _maturity);
  return callPrice.toString();
}

//calculate D1 term used in black-scholes
export function calculateD1(
  _spotPrice: f64,
  _strikePrice: f64,
  _volatility: f64,
  _time: f64
): f64 {
  var d1 =
    (1 / (_volatility * Math.sqrt(_time))) *
    (Math.log(_spotPrice / _strikePrice) +
      (0.05 + 0.5 * Math.pow(_volatility, 2)) * _time);
  return d1;
}

//simulate terminal price using GBM formulation
//refer to readme file for documentation links and explanations of GBM
export function GBM(_spotPrice: f64, _volatility: f64, _time: f64): f64 {
  var price = <f64>10.0;
  const randomNumberGen = new RNG<u32>(1, u32.MAX_VALUE);
  var randomTemp = <f64>randomNumberGen.next();
  var randomTemp0to1 = randomTemp / <f64>u32.MAX_VALUE;
  var normRandDeviate = normalCDFInv(randomTemp0to1);
  price =
    _spotPrice *
    Math.exp(
      0.05 - Math.pow(_volatility, 2) / 2 + _volatility * normRandDeviate
    );

  assert(
    price >= 0,
    "There may be an issue with the implementation, the simulated price has gone negative!"
  );

  return price;
}

//calculate the option payoff
export function calcOptionPayoff(
  _spotPrice: f64,
  _strikePrice: f64,
  _volatility: f64,
  _time: f64
): f64 {
  var terminalPrice = GBM(_spotPrice, _volatility, _time);

  if (terminalPrice >= _strikePrice) {
    return terminalPrice - _strikePrice;
  } else {
    return 0.0;
  }
}

//Approximations to Standard Normal Distribution
//Function
//Ramu Yerukala and Naveen Kumar Boiroju
//model #9 - Lin 1990
//a very good approximation, though some error from true normal
export function normalCDF(_x: f64): f64 {
  var prob = <f64>0.0;
  var step1 = <f64>0.0;
  var const1 = <f64>9.0;
  var Pi = Math.PI;
  if (_x > 9.0) {
    prob = 1.0;
  } else if (_x >= 0) {
    step1 = 4.2 * Pi * (_x / (const1 - _x));
    prob = 1.0 - 1.0 / (1.0 + Math.exp(step1));
  } else if (_x > -9) {
    _x = -1.0 * _x;
    step1 = 4.2 * Pi * (_x / (const1 - _x));
    prob = 1.0 - 1.0 / (1.0 + Math.exp(step1));
    prob = 1.0 - prob;
  } else {
    prob = 0.0;
  }
  return prob;
}

//inverse normal CDF, a world class approxmation
//https://stackedboxes.org/2017/05/01/acklams-normal-quantile-function/
export function normalCDFInv(_prob: f64): f64 {
  var x = <f64>1.0;
  var q = <f64>0.0;
  var r = <f64>0.0;
  var a1 = -3.969683028665376e1;
  var a2 = 2.209460984245205e2;
  var a3 = -2.759285104469687e2;
  var a4 = 1.38357751867269e2;
  var a5 = -3.066479806614716e1;
  var a6 = 2.506628277459239;

  var b1 = -5.447609879822406e1;
  var b2 = 1.615858368580409e2;
  var b3 = -1.556989798598866e2;
  var b4 = 6.680131188771972e1;
  var b5 = -1.328068155288572e1;

  var c1 = -7.784894002430293e-3;
  var c2 = -3.223964580411365e-1;
  var c3 = -2.400758277161838;
  var c4 = -2.549732539343734;
  var c5 = 4.374664141464968;
  var c6 = 2.938163982698783;

  var d1 = 7.784695709041462e-3;
  var d2 = 3.224671290700398e-1;
  var d3 = 2.445134137142996;
  var d4 = 3.754408661907416;

  if (_prob <= 0.02425) {
    q = Math.sqrt(-2 * Math.log(_prob));
    x =
      (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1.0);
  } else if (_prob <= 1.0 - 0.02425) {
    q = _prob - 0.5;
    r = q * q;
    x =
      ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
      (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1.0);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - _prob));
    x =
      -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) /
      ((((d1 * q + d2) * q + d3) * q + d4) * q + 1.0);
  }
  return x;
}
