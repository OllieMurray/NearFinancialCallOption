import React from "react";

export default function SignIn() {
  return (
    <>
      <p>
        This app demonstrates how NEAR can be used for complex mathematical
        operations such as pricing financial options (on real or crypto
        assets!). Option contract details can be entered to return the option
        price according the Black-Scholes formulation. The most recently entered
        option evaluated can also simulated and the pay-off that would occur is
        reported.
      </p>
      <p>
        If you do add a donation, then NEAR will double-check that you’re ok
        with sending money to this app. Context will be used to format the
        resulting message box with a blue colouring.
      </p>
      <p>
        Please click the Log in button, you will be prompted for your NEAR
        address and password to login.
      </p>
    </>
  );
}
