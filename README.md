# compound-simulation

## Fork

prepare a alchemyapi key

Forking on height 12269785 with a block producing rate 0.01

ganache-cli -f https://eth-mainnet.alchemyapi.io/v2/{alchemyapikey}@12269785 -b 0.01 -m "{any bip39 mnemonic phrase}" -i 1337 -u 0x7587caefc8096f5f40acb83a09df031a018c66ec -u  0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8 -u 0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be

## execute the proposal

1. run `node simulation-script.js init` to initialize the proposal
2. You can check the proposal by run `node simulation-script.js getProposal`
3. wait serveral minutes and run `node simulation-script.js castVote`
You have to wait serveral minutes to reach specific block height to vote for the proposal
4. wait serveral minutes and run `node simulation-script.js queue`
You have to wait serveral minutes to reach specific block height to queue the proposal
5. run `node simulation-script.js increaseTime` to skip two days.
6. run `node simulation-script.js execute` to execute the proposal

## New market Testing

1. check the comtroller changes after execute the proposal `node simulation-script.js checkTUSDMarket`
2. Quick Borrow Test run `node simulation-script.js TUSDBorrowTest`

    - TUSD Founder supply TUSD to the market
    - COMP Founder supply COMP
    - COMP Founder borrow TUSD using COMP as colleteral

3. Check testing result run `node simulation-script.js checkBorrowStatus`

4. Borrow more TUSD by using `node simulation-script.js borrowTUSD -a 0000000000000000000000000000000000000000000000000091000000000001` to check other value.

## Note

COMP price is 489.655 in the oracle

TUSD price is 1