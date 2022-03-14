import React from "react";
import PropTypes from "prop-types";
import Big from "big.js";

export default function Form2({ onSubmit, currentUser }) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        <p>
          <label htmlFor="donation">
            Buy Most Recently Valued Option (optional):
          </label>
          <input
            autoComplete="off"
            defaultValue={"0"}
            id="donation"
            max={Big(currentUser.balance).div(10 ** 24)}
            min="0"
            step="0.01"
            type="number"
          />
          <span title="NEAR Tokens">Ⓝ</span>
        </p>
        <button type="submit">Simulate Buy Option</button>
      </fieldset>
    </form>
  );
}

Form2.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }),
};
