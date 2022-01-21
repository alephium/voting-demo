# Voting dApp on Alephium

This project is a simple voting dApp built on the Alephium blockchain.

It implements a very simple token-based voting protocol where each voter receives a single token that he can spend to vote `yes` or `no` to a proposal. Once the voting period is over, the administrator closes the voting and votes will no longer be accepted.

> *Disclaimer: The code and protocol provided in this project are intended to be run on the **testnet** and are for educational purposes only. We are not responsible for any loss of **ALPH** tokens by running it on the mainnet.*

If you want to learn how to build dApps on Alephium, we provide you a tutorial to guide you through the process of building a minimalist version of this voting app [here](https://github.com/alephium/voting-tutorial).

## Installation

### Local node setup

Please install and run locally a node on the **testnet** following [this guide](https://wiki.alephium.org/Testnet-Guide.html). Then create a miner wallet as described [here](https://wiki.alephium.org/GPU-Miner-Guide.html) if you don't have one yet. Miner wallets have one address per group, hence 4 addresses. You can easily obtain coins on the testnet by running [the CPU miner](https://wiki.alephium.org/CPU-Miner-Guide.html) with the addresses of one of your wallets.

> **WARNING: Make sure your node is running on the TESTNET before going any further.**


### Running

Install the dApp frontend with

```
$ npm install
```

Run it with:
```
$ npm run start
```
Open [http://localhost:3000](http://localhost:3000) to view the following app  in the browser

<img title="demo" src="./assets/full-app.JPG" alt="Full application screenshot" >

## Usage

### Setup your wallet

Click on the settings button and enter your wallet name and password.

### As an administrator

In the homepage, fill the inputs with a voting title the address of the administrator. The administrator is the person responsible for allocating the voting tokens to each voter and to close the voting. Then enter the address of each voter (the administrator can also be in the list of voters). Their addresses must be in the same group as the administrator address. Click submit to deploy the voting contract on the blockchain. When the transaction is confirmed, you can allocate the tokens or close the voting in the administrate section. Once the token allocation is done, you can share obtained voting link to the voters.

### As a voter

Open the voting link sent by the administrator, it should redirect you to the `Vote` section with the page input pre-filled. Click on the button `Load Contract`. You will be able to vote if the administrator did not close the voting.Otherwise you will see the voting results.

## Testing

Run the test suite with:

```
$ npm test
```

