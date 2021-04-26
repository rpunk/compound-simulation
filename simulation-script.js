const { Command } = require('commander');
var bigInt = require("big-integer");
const program = new Command();
program.version('0.0.1');
const Web3 = require("web3")
let web3 = new Web3();
web3.setProvider("http://localhost:8545");

const COMPAccount = "0x7587caefc8096f5f40acb83a09df031a018c66ec";
const ETHFounder = "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8";
const COMP = "0xc00e94Cb662C3520282E6f5717214004A7f26888"
const cCOMP = "0x70e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4"
const governanceContract = "0xc0da02939e1441f497fd74f78ce7decb17b66529"; //previous 0xc0da01a04c3f3e0be433606045bb7017a7323e38
const timelockContract = "0x6d903f6003cca6255d85cca4d3b5e5146dc33925";
const cTUSD = "0x12392f67bdf24fae0af363c24ac620a2f67dad86";
const comtroller = "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b";

const tusdFounder = "0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be"; 
const tusdContract = "0x0000000000085d4780B73119b644AE5ecd22b376"
const newOracle = "0x4007b71e01424b2314c020fb0344b03a7c499e1a"


/**
 *   Propose init and excute proposal:
 * 
 *   1. initAndPropose()
 *   // wait several minutes until the vote time is open. block produce rate is 0.01
 *   2. castVote()
 *   // wait several minutes until the vote time is open. block produce rate is 0.01
 *   3. queue()
 *   4. increaseTime()
 *   5. execute()
 * 
 *   getVotePower()
 *   state()
 *   getProposal()
 *   getblock()
 * 
 *  Test:
 *  1. getOracle()  => 0x0000000000000000000000004007b71e01424b2314c020fb0344b03a7c499e1a
 *  2. markets()
 *  0000000000000000000000000000000000000000000000000000000000000001  approved
 *  0000000000000000000000000000000000000000000000000000000000000000  can't be collateral
 *  0000000000000000000000000000000000000000000000000000000000000000  dont receive comp
 *  3. reserveFactorMantissa()
 *  000000000000000000000000000000000000000000000000010a741a46278000
 *  // Do
 *  4. unlock()  //unlock tusdFounder (mandatory to do if not unlock)
 *  5. approveTUSDtocTUSD() // tusdFounder approve TUSD to cTUSD contract
 *  5. mint_cTUSD() // tusdFounder provide TUSD to the market
 *  6. approveCOMPtocCOMP() //COMPFounder approve COMP to cCOMP contract
 *  7. mint_cCOMP()// COMPFounder supply COMP for itself
 *  8. enterMarketcCOMP() //COMPFounder enter the market
 *  9. borrowTUSD()// COMPFounder use COMP as colleterall to borrow TUSD
 * 
 *  //Check
 *  10. balanceOfcComp()
 *  11. getExchangeRateStored()
 *  12. balanceOfTUSDInCTUSDcontract()
 *  13. getAccountLiquidity()
 */



const sendETH = async () => {
    web3.eth.sendTransaction({ from: ETHFounder, to: COMPAccount, value: "1000000000000000000000" },function(err, result){
        console.log("0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8 sends Eth at: " + result);
    });
}

const approveCOMP = async () => {

    web3.eth.sendTransaction({from:COMPAccount, to: COMP, data: "0x095ea7b3000000000000000000000000B5212a2fa63c1863b9e8670e2A6D420d0309c50200000000000000000000000000000000000000000000152d02c7e14af6800000"});
}



const check = async () => {
    //web3.eth.getAccounts(console.log);
    web3.eth.getBalance("0x7587caefc8096f5f40acb83a09df031a018c66ec").then(console.log);
}

const getTransaction = async(id) => {
    web3.eth.getTransaction(id).then(console.log)
}

const allowance= async() => {
    const abi = ["function allowance(address,address) view returns (uint256)",];
    var a = await web3.eth.call({
        to:COMP,
        data: "0xdd62ed3e0000000000000000000000007587caefc8096f5f40acb83a09df031a018c66ec00000000000000000000000070e36f6BF80a52b3B46b3aF8e106CC0ed743E8e4"
    })
    console.log(a)
}

const allowanceTUSD= async() => {
    const abi = ["function allowance(address,address) view returns (uint256)",];
    var a = await web3.eth.call({
        to:tusdContract,
        data: "0xdd62ed3e0000000000000000000000003f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be00000000000000000000000012392f67bdf24fae0af363c24ac620a2f67dad86"
    })
    console.log(a)
}
const balanceOf = async () => {

    const abi = ["function balanceOf(address) view returns (uint256)",];
    var a = await web3.eth.call({
        to:COMP,
        data: "0x70a08231000000000000000000000000cfbd6abfdd61b79c8d1ddaa3fe6170246a4b3849"
    })
    console.log(a)
}

const getCurrentVotes = async () => {

    const abi = ["function getCurrentVotes(address) view returns (uint256)",];
    var a = await web3.eth.call({
        to:COMP,
        data: "0xb4b5ea570000000000000000000000007587caefc8096f5f40acb83a09df031a018c66ec"
    })
    console.log(a)
}
    
const checkReceipt = async(id) => {
    web3.eth.getTransactionReceipt(id).then(console.log)
}


const delegate = async() => {
    web3.eth.sendTransaction({from:COMPAccount, to: COMP, data: "0x5c19a95c0000000000000000000000007587caefc8096f5f40acb83a09df031a018c66ec",gas:web3.utils.toHex('3000000'),
    gasprice:1}, function(err, result){
        console.log("0x7587caefc8096f5f40acb83a09df031a018c66ec Delegate all vote to 0x7587caefc8096f5f40acb83a09df031a018c66ec at: " + result);
    });
}

const propose = async() => {
    web3.eth.sendTransaction({from:COMPAccount, to: governanceContract, data: "0xda95691a00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000002e0000000000000000000000000000000000000000000000000000000000000042000000000000000000000000000000000000000000000000000000000000000030000000000000000000000003d9819210a31b4961b30ef54be2aed79b9c9cd3b0000000000000000000000003d9819210a31b4961b30ef54be2aed79b9c9cd3b00000000000000000000000012392f67bdf24fae0af363c24ac620a2f67dad8600000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000185f73657450726963654f7261636c65286164647265737329000000000000000000000000000000000000000000000000000000000000000000000000000000175f737570706f72744d61726b6574286164647265737329000000000000000000000000000000000000000000000000000000000000000000000000000000001a5f73657452657365727665466163746f722875696e74323536290000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000200000000000000000000000004007b71e01424b2314c020fb0344b03a7c499e1a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000012392f67bdf24fae0af363c24ac620a2f67dad860000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000010a741a4627800000000000000000000000000000000000000000000000000000000000000000052261626322000000000000000000000000000000000000000000000000000000",gas:web3.utils.toHex('3000000'),
    gasprice:1}, function(err, result){
        console.log("0x7587caefc8096f5f40acb83a09df031a018c66ec call propose in governance contract at: " + result)
    });
}

const state = async () => {

    const abi = ["function state(uint256) view returns (ProposalState)",];
    var result = await web3.eth.call({
        to:governanceContract,
        data: "0x3e4f49e6000000000000000000000000000000000000000000000000000000000000002c"
    })
    console.log(result)
}

const getVotePower = async () => {

    const abi = ["function getCurrentVotes(address) view returns (uint96)",];
//const COMPAccount = "0x7587caefc8096f5f40acb83a09df031a018c66ec";

    var a = await web3.eth.call({
        to:COMP,
        data: "0xb4b5ea570000000000000000000000007587caefc8096f5f40acb83a09df031a018c66ec"
    })
    console.log(a)
}

const getblock = async() => {
    web3.eth.getBlockNumber().then(result=>web3.eth.getBlock(result).then(console.log))
    
}

const increaseTime = () => {
    web3.currentProvider.send({
        jsonrpc: "2.0", 
        method: "evm_increaseTime", 
        params: [60*60*24*2], id: 1337
    }, function(err, result){
        console.log(result)
    })
}

const unlock = () => {
    web3.currentProvider.send({
        jsonrpc: "2.0", 
        method: "evm_unlockUnknownAccount", 
        params: ["0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be"], id: 1337
    })
}

const advanceBlockAtTime = (time) => {
    return new Promise((resolve, reject) => {
      web3.currentProvider.send(
        {
          jsonrpc: "2.0",
          method: "evm_setIntervalMining",
          params: [2],
          id: 1337,
        },
        (err, _) => {
          if (err) {
            return reject(err);
          }
          const newBlockHash = web3.eth.getBlock("latest").hash;
  
          return resolve(newBlockHash);
        },
      );
    });
  };


 const queue = async() => {
    
    web3.eth.sendTransaction({from:COMPAccount, to: governanceContract, data: "0xddf0b009000000000000000000000000000000000000000000000000000000000000002c",gas:web3.utils.toHex('3000000'),
    gasprice:1},function(err, result){
        console.log("err: " + err);
        console.log("0x7587caefc8096f5f40acb83a09df031a018c66ec call propose in governance contract at: " + result)
    });
}

const execute = async() => {
    
    web3.eth.sendTransaction({from:COMPAccount, to: governanceContract, data: "0xfe0d94c1000000000000000000000000000000000000000000000000000000000000002c",gas:web3.utils.toHex('3000000'),
    gasprice:1});
}



const checkTimelock = async()=>{
    
    a = await web3.eth.call({
        to:timelockContract,
        data: "0xf851a4400000000000000000000000000000000000000000000000000000000000000001"
    })
    console.log(a)
}

function sleep(timeout = 1000){
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

const initAndPropose = async()=> {
    await sendETH()
    await sleep();
    await delegate();
    await sleep();
    await propose();
    await sleep();
}

const castVote = async() => {
    
    web3.eth.sendTransaction({from:COMPAccount, to: governanceContract, data: "0x56781388000000000000000000000000000000000000000000000000000000000000002c0000000000000000000000000000000000000000000000000000000000000001",gas:web3.utils.toHex('3000000'),
    gasprice:1}, function(err, result){
        console.log("err: " + err);
        console.log("cast vote number 44 at: " + result);
    });
}

const getProposal = async() =>{
    //const abi = ["function proposals(uint256) view returns (Proposal)",];
    var result = await web3.eth.call({
        to:governanceContract,
        data: "0x013cf08b000000000000000000000000000000000000000000000000000000000000002c"
    })
    console.log(result)
}


/**
 *  TUSD Borrow Test method
 */


 const getOracle = async () => {
    var result = await web3.eth.call({
        to:comtroller,
        data: "0x7dc0d1d0"
    })
    console.log("new Oracle get from comtroller: " + result)
}

const markets = async () => {
    var result = await web3.eth.call({
        to:comtroller,
        data: "0x8e8f294b00000000000000000000000012392f67bdf24fae0af363c24ac620a2f67dad86"
    })
    console.log("markets info get from comtroller: " + result)
}

const reserveFactorMantissa = async () => {
    var result = await web3.eth.call({
        to:cTUSD,
        data: "0x173b9904"
    })
    console.log("reserveFactorMantissa get from comtroller: " + result)
}


const balanceOfTUSD = async () => {

    const abi = ["function balanceOf(address) view returns (uint256)",];
    var result = await web3.eth.call({
        to:tusdContract,
        data: "0x70a082310000000000000000000000007587caefc8096f5f40acb83a09df031a018c66ec"
    })
    console.log(result)
}


const balanceOfTUSDInCTUSDcontract = async () => {

    const abi = ["function balanceOf(address) view returns (uint256)",];
    var result = await web3.eth.call({
        to:tusdContract,
        data: "0x70a0823100000000000000000000000012392f67bdf24fae0af363c24ac620a2f67dad86"
    })
    console.log("balanceOfTUSDInCTUSDcontract is " + result)
}

const approveTUSDtocTUSD = async () => {

    web3.eth.sendTransaction({from:tusdFounder, to: tusdContract, data: "0x095ea7b300000000000000000000000012392f67bdf24fae0af363c24ac620a2f67dad86ff000000000000000000000000000000000000000000152d02c7e14af6800000"},function(err, result){
        console.log("err: " + err);
        if(err == null){
            console.log("tusdFounder approved " + convertToDecimal('000000000000000000000000000000000000000000152d02c7e14af6800000') + " TUSD to the cTUSD contract");
        }
       
    });
    
}

function convertToDecimal(amount){
    amount = amount.replace(/^0+/, '');
    var bignumber = BigInt('0x'+amount).toString(10);
    return bignumber;
}
// input format: 00000000000000000000000000000000000000000000043c33c1937564800000
const mint_cTUSD = async (amount) => {
    var d = "0xa0712d68" + amount
        //0xa0712d6800000000000000000000000000000000000000000000043c33c1937564800000
        web3.eth.sendTransaction({from:tusdFounder, to: cTUSD, data: d,gas:web3.utils.toHex('3000000'),
        gasprice:1}, function(err, result){
            console.log("err: " + err);
            if(err == null){
                console.log("tusdFounder deposit " + convertToDecimal(amount) + " TUSD to the market");
            }
           
        })
        
}


const approveCOMPtocCOMP = async (amount) => {
        web3.eth.sendTransaction({from:COMPAccount, to: COMP, data: "0x095ea7b300000000000000000000000070e36f6BF80a52b3B46b3aF8e106CC0ed743E8e40000000000000000000000000000000000000000f000f52d02c7e14af6800000",gas:web3.utils.toHex('3000000'),
        gasprice:1}, function(err, result){
            console.log("err: " + err);
            if(err == null){
                console.log("COMPFounder approve " + convertToDecimal('0000000000000000000000000000000000000000f000f52d02c7e14af6800000') + " COMP for cCOMP");
            }
           
        })
        
}

//0000000000000000000000000000000000000000000000022b1c8c1227a00000
const mint_cCOMP = async (amount) => {
    var d =  "0xa0712d68" + amount;
    web3.eth.sendTransaction({from:COMPAccount, to: cCOMP, data: d,gas:web3.utils.toHex('3000000'),
    gasprice:1}, function(err, result){
        console.log("err: " + err);
        if(err == null){
            console.log("COMPFounder supply " + convertToDecimal(amount) + " COMP for cCOMP");
        }
       
    })
}

const enterMarketcCOMP = async () => {
    web3.eth.sendTransaction({from:COMPAccount, to: comtroller, data: "0xc29982380000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000070e36f6bf80a52b3b46b3af8e106cc0ed743e8e4",gas:web3.utils.toHex('3000000'),
    gasprice:1}, function(err, result){
        console.log("err: " + err);
        if(err == null){
            console.log("COMPFounder enter the market with comp");
        }
       
    })
    
}

const borrowTUSD= async (amount) => {
    //0000000000000000000000000000000000000000000000000091000000000001
    var d = "0xc5ebeaec" + amount
    web3.eth.sendTransaction({from:COMPAccount, to: cTUSD, data: d ,gas:web3.utils.toHex('3000000'),
    gasprice:1}, function(err, result){
        console.log("err: " + err);
        if(err == null){
            console.log("COMPFounder borrowed " + amount + " TUSD from the market");
        }
       
    })
}

// need to test
const getExchangeRateStored = async () => {
    var result = await web3.eth.call({
        to:cCOMP,
        data: "0x182df0f5"
    })
    console.log("ExchangeRateStored for cCOMP is " + result)
}

const balanceOfcComp = async (address='0000000000000000000000007587caefc8096f5f40acb83a09df031a018c66ec') => {
    //0000000000000000000000007587caefc8096f5f40acb83a09df031a018c66ec
    var d = "0x70a08231" + address
    var result = await web3.eth.call({
        to:cCOMP,
        data: d
    })
    console.log("balanceOf cCOMP for " + address + " is " +  result)
}

const compPriceFromOracle = async () => {
    var result = await web3.eth.call({
        to:newOracle,
        data:"0xfe2c619800000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000004434f4d5000000000000000000000000000000000000000000000000000000000"
    })
    console.log(result)
}

const getAccountLiquidity =async ()=>{
    var result = await web3.eth.call({
        to:comtroller,
        data: "0x5ec88c790000000000000000000000007587caefc8096f5f40acb83a09df031a018c66ec"
    })
    console.log("Account Liquidity for Comp founder is " + result)
   
}


const TUSDBorrowTest=async() =>{
    approveTUSDtocTUSD().then(
        mint_cTUSD("00000000000000000000000000000000000000000000043c33c1937564800000")).then(
            approveCOMPtocCOMP()
        ).then(mint_cCOMP("0000000000000000000000000000000000000000000000022b1c8c1227a00000")).then(
            enterMarketcCOMP()
        ).then(borrowTUSD("0000000000000000000000000000000000000000000000000091000000000001"))
}


//checkReceipt("0x077470af4ffcae335d195b9f38d659204c5a1231e0add9e5e742425168c9620b")



/**
 *  Command Line
 */

program
  .command('init')
  .description('send ETH, approve COMP, delegate vote power to specific account and init the TUSD proposal ')
  .action((env, options) => {
    env = env || 'all';
    initAndPropose()
  });

program
  .command('checkReceipt')
  .option('-i <id>')
  .description('check receipt result ')
  .action((env, options) => {
    env = env || 'all';
    checkReceipt(options._optionValues.i)
  });

program
  .command('castVote')
  .description('cast vote ')
  .action((env, options) => {
    env = env || 'all';
    castVote()
  });

program
  .command('queue')
  .description('queue the proposal')
  .action((env, options) => {
    env = env || 'all';
    queue()
  });

program
  .command('execute')
  .description('execute the proposal')
  .action((env, options) => {
    env = env || 'all';
    execute()
  });


program
  .command('getProposal')
  .description('getProposal 44')
  .action((env, options) => {
    env = env || 'all';
    getProposal()
  });

program
  .command('state')
  .description('check proposal 44 state')
  .action((env, options) => {
    env = env || 'all';
    state()
  });

program
  .command('increaseTime')
  .description('increaseTime to pass timelock')
  .action((env, options) => {
    env = env || 'all';
    increaseTime()
  });


program
  .command('checkTUSDMarket')
  .description('checkTUSDMarket')
  .action((env, options) => {
    env = env || 'all';
    getOracle();
    markets();
    reserveFactorMantissa();
  });

program
  .command('unlock')
  .description('unlock TUSDFounder')
  .action((env, options) => {
    env = env || 'all'; 
    unlock()
  });

program
  .command('TUSDBorrowTest')
  .description('TUSDBorrowTest')
  .action((env, options) => {
    env = env || 'all';
    TUSDBorrowTest()
  });

program
  .command('checkTx')
  .option('-i <id>')
  .description('check receipt result ')
  .action((env, options) => {
    env = env || 'all';
    getTransaction(options._optionValues.i)
  });

program
  .command('checkBorrowStatus')
  .description('checkBorrowStatus')
  .action((env, options) => {
    env = env || 'all';
    balanceOfcComp()
    getExchangeRateStored()
    balanceOfTUSDInCTUSDcontract()
    getAccountLiquidity()
  });

program
  .command('allowance')
  .description('allowance comp')
  .action((env, options) => {
    env = env || 'all';
    allowance()
  });


program
  .command('approveTUSDtocTUSD')
  .description('tusd Founder approve enough TUSD to cTUSD')
  .action((env, options) => {
    env = env || 'all';
    approveTUSDtocTUSD();
  });

program
  .command('mint_cTUSD')
  .option('-a <amount>')
  .description('tusd founder deposit TUSD and get cTUSD from the market')
  .action((env, options) => {
    env = env || 'all';
    mint_cTUSD(options._optionValues.a)
  });

program
  .command('approveCOMPtocCOMP')
  .description('tusd founder deposit TUSD and get cTUSD from the market')
  .action((env, options) => {
    env = env || 'all';
    approveCOMPtocCOMP()
  });


  
program
  .command('mint_cCOMP')
  .option('-a <amount>')
  .description('comp founder deposit COMP and get cCOMP from the market ')
  .action((env, options) => {
    env = env || 'all';
    mint_cCOMP(options._optionValues.a)
  });

program
  .command('enterMarketcCOMP')
  .description('comp founder let COMP to enter the market ')
  .action((env, options) => {
    env = env || 'all';
    enterMarketcCOMP();
  });

program
  .command('borrowTUSD')
  .option('-a <amount>')
  .description('comp founder borrow TUSD from the market ')
  .action((env, options) => {
    env = env || 'all';
    borrowTUSD(options._optionValues.a);
  });
 
  program.parse(process.argv);

