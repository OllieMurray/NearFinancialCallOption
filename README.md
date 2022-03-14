# NearFinancialCallOption
The Near Financial Call Option in this demo package is a clone of the famous near guest-book example found here: https://examples.near.org/guest-book.  The code has been heavily extended to utilize additional features of the NEAR protocol and to perform complex financial evaluation and simulation.  The code is written in AS and is not intended to serve financial transactions. 

The READ-ME file details from that project have been heavily reproduced below for the purposes of standing up this project locally.


# Details on Submitted Package...
The package uses several critical features of NEAR.  These include:
Persistent Collections - Interactions with the contract in the  form of option evaluations and simulations are stored on the blockchain.
Storage - Previously evaluated option contracts are stored on the blockchain and referenced when subsequent option purchases are made.
Assert Statements - Checks are performed on option input details to ensure they conform to the assumptions of the [Black-Scholes] model for option pricing.
Context - Retreives the deposited amount and reports it to the message stack.


Sign in with [NEAR] and Evaluate a Call Option! A starter app built with an [AssemblyScript] backend and a [React] frontend.

The contract is currently deployed on test net as calloption.testnet and can be interacted with there through the [near-cli].

The backend of the contract uses approximations for the [inverse normal] and for the [normal-CDF] (Model #10 - Lin 1990).

The [inverse normal] is a world class approximation.  The [normal-CDF] results in some error, a benchmark test was performed in the excel file accompanying the project.

# Intent
The overall intent of this package is to show that NEAR is capable of performing complex simulations and mathematical operations with relatively high speed and precision.  It could be possible to use the code developed in here for the creation of an option market.  The code would need to be extended to make oracle calls to return prices of crypto assets and their volatilities (from a market data provider which calculated these based on historical data) to act as a market maker using the [Black-Scholes] price as reference.  Markets could open with [Black-Scholes] prices and then be driven by market forces.

Alternatively, markets could be open to purely to the forces of supply and demand from which the [Black-Scholes] formula could be used to back out the [implied volatility] which acts as a critical reference point for making financial decisions when compared against realized and historical volatilities [realized vs implied vs historical volatility].

Extending the project in this direction require porting the code base to [RUST] as [AS] is [not currently intended for financial purposes].

# Quick Start

To run this project locally:

1. Prerequisites: Make sure you have Node.js ≥ 12 installed (https://nodejs.org), then use it to install [yarn]: `npm install --global yarn` (or just `npm i -g yarn`)
2. Run the local development server: `yarn && yarn dev` (see `package.json` for a
   full list of `scripts` you can run with `yarn`)

Now you'll have a local development environment backed by the NEAR TestNet! Running `yarn dev` will tell you the URL you can visit in your browser to see the app.

# Exploring The Code

1. The backend code lives in the `/assembly` folder. This code gets deployed to
   the NEAR blockchain when you run `yarn deploy:contract`. This sort of
   code-that-runs-on-a-blockchain is called a "smart contract" – [learn more
   about NEAR smart contracts][smart contract docs].
2. The frontend code lives in the `/src` folder.
   [/src/index.html](/src/index.html) is a great place to start exploring. Note
   that it loads in `/src/index.js`, where you can learn how the frontend
   connects to the NEAR blockchain.
3. Tests: there are currently only tests for the backend.  The project could be updated to include tests for the front end.

Both contract and client-side code will auto-reload as you change source files.

# Deploy

Every smart contract in NEAR has its [own associated account][near accounts]. When you run `yarn dev`, your smart contracts get deployed to the live NEAR TestNet with a throwaway account. When you're ready to make it permanent, here's how.

## Step 0: Install near-cli

You need near-cli installed globally. Here's how:

    npm install --global near-cli

This will give you the `near` [CLI] tool. Ensure that it's installed with:

    near --version

## Step 1: Create an account for the contract

Visit [NEAR Wallet] and make a new account. You'll be deploying these smart contracts to this new account.

Now authorize NEAR CLI for this new account, and follow the instructions it gives you:

    near login

## Step 2: set contract name in code

Modify the line in `src/config.js` that sets the account name of the contract. Set it to the account id you used above.
a few more points on this here..
we need to have the config file in place...
steps to generate that config file with the name we want it to have ...

    const CONTRACT_NAME = process.env.CONTRACT_NAME || 'your-account-here!'

## Step 3: change remote URL if you cloned this repo

Unless you forked this repository you will need to change the remote URL to a repo that you have commit access to. This will allow auto deployment to GitHub Pages from the command line.

1. go to GitHub and create a new repository for this project
2. open your terminal and in the root of this project enter the following:

   $ `git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git`

## Step 4: deploy!

One command:

    yarn deploy

As you can see in `package.json`, this does two things:

1. builds & deploys smart contracts to NEAR TestNet
2. builds & deploys frontend code to GitHub using [gh-pages]. This will only work if the project already has a repository set up on GitHub. Feel free to modify the `deploy` script in `package.json` to deploy elsewhere.



[near]: https://near.org/
[yarn]: https://yarnpkg.com/
[assemblyscript]: https://www.assemblyscript.org/introduction.html
[react]: https://reactjs.org
[smart contract docs]: https://docs.near.org/docs/develop/contracts/overview
[asp]: https://www.npmjs.com/package/@as-pect/cli
[jest]: https://jestjs.io/
[near accounts]: https://docs.near.org/docs/concepts/account
[near wallet]: https://wallet.near.org
[near-cli]: https://github.com/near/near-cli
[cli]: https://www.w3schools.com/whatis/whatis_cli.asp
[create-near-app]: https://github.com/near/create-near-app
[gh-pages]: https://github.com/tschaub/gh-pages
[Black-Scholes]: https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model
[inverse normal]:https://stackedboxes.org/2017/05/01/acklams-normal-quantile-function/
[normal-CDF]:https://www.researchgate.net/publication/275885986_Approximations_to_Standard_Normal_Distribution_Function
[implied volatility]: https://en.wikipedia.org/wiki/Implied_volatility
[realized vs implied vs historical volatility]: https://www.macroption.com/implied-vs-realized-vs-historical-volatility/
[RUST]: https://github.com/near/near-sdk-rs
[AS]: https://near.github.io/near-sdk-as/
[not currently intended for financial purposes]:https://docs.near.org/docs/develop/contracts/as/intro#:~:text=The%20NEAR%20platform%20supports%20writing,AssemblyScript%20on%20the%20NEAR%20platform.
