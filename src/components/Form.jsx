import React from "react";
import PropTypes from "prop-types";

export default function Form({ onSubmit, currentUser }) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>
          Enter The Option Contract Details to Generate Price and Evaluate
          Outcome, {currentUser.accountId}!
        </p>
        <p className="highlight">
          <label htmlFor="message">Spot Price (must be g.t. 0):</label>
          <input
            autoComplete="off"
            autoFocus
            id="message"
            required
            type="number"
            step="0.01"
          />
        </p>
        <p className="highlight">
          <label htmlFor="Strike">Strike (must be g.t. 0):</label>
          <input
            autoComplete="off"
            autoFocus
            id="Strike"
            required
            type="number"
            step="0.01"
          />
        </p>
        <p className="highlight">
          <label htmlFor="Volatility">Volatility (must be g.t. 0):</label>
          <input
            autoComplete="off"
            autoFocus
            id="Volatility"
            required
            type="number"
            step="0.01"
          />
        </p>
        <p className="highlight">
          <label htmlFor="Maturity">
            Maturity (must be g.t. 0, express as days/365):
          </label>
          <input
            autoComplete="off"
            autoFocus
            id="Maturity"
            required
            type="number"
            step="0.01"
          />
        </p>
        <p className="highlight">
          <label htmlFor="Interest">
            Interest Rate (must be g.t. or equal to 0):
          </label>
          <input
            autoComplete="off"
            autoFocus
            id="Interest"
            required
            type="number"
            step="0.01"
          />
        </p>
        <button type="submit">Evaluate Option</button>
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }),
};
