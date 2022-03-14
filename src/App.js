import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Big from "big.js";
import Form from "./components/Form";
import Form2 from "./components/Form2";
import SignIn from "./components/SignIn";
import Messages from "./components/Messages";

const SUGGESTED_DONATION = "0";
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // TODO: don't just fetch once; subscribe!
    contract.getMessages().then(setMessages);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const {
      fieldset,
      message,
      Strike,
      Volatility,
      Maturity,
      Interest,
      // donation,
    } = e.target.elements;

    fieldset.disabled = true;

    contract
      .callOption(
        {
          _spotPrice: message.value.toString(),
          _strikePrice: Strike.value.toString(),
          _volatility: Volatility.value.toString(),
          _maturity: Maturity.value.toString(),
          _interest: Interest.value.toString(),
        },
        BOATLOAD_OF_GAS /* 
        Big(donation.value || "0")
          .times(10 ** 24)
          .toFixed() */
      )
      .then(() => {
        contract.getMessages().then((messages) => {
          setMessages(messages);
          //message.value = "";
          donation.value = SUGGESTED_DONATION;
          fieldset.disabled = false;
          message.focus();
        });
      });
  };

  const onSubmit2 = (e2) => {
    e2.preventDefault();
    const { donation } = e2.target.elements;
    fieldset.disabled = true;
    contract
      .buyOption(
        {},
        BOATLOAD_OF_GAS,
        Big(donation.value || "0")
          .times(10 ** 24)
          .toFixed()
      )
      .then(() => {
        contract.getMessages().then((messages) => {
          setMessages(messages);
          //message.value = "";
          donation.value = SUGGESTED_DONATION;
          fieldset.disabled = false;
          message.focus();
        });
      });
  };

  const signIn = () => {
    wallet.requestSignIn(
      {
        contractId: nearConfig.contractName,
        methodNames: [contract.callOption.name],
      }, //contract requesting access
      "NEAR Option Pricer and Outcome Simulator", //optional name
      null, //optional URL to redirect to if the sign in was successful
      null //optional URL to redirect to if the sign in was NOT successful
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header>
        <h1>NEAR Option Pricer</h1>
        {currentUser ? (
          <button onClick={signOut}>Log out</button>
        ) : (
          <button onClick={signIn}>Log in</button>
        )}
      </header>
      {currentUser ? (
        <div>
          <Form onSubmit={onSubmit} currentUser={currentUser} />
          <Form2 onSubmit={onSubmit2} currentUser={currentUser} />
        </div>
      ) : (
        <SignIn />
      )}
      {!!currentUser && !!messages.length && <Messages messages={messages} />}
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    callOption: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired,
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
  }).isRequired,
};

export default App;
