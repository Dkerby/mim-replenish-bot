var nodemailer = require('nodemailer');
const ethers = require('ethers');
const master = require('./contracts/master.js');
require('dotenv').config();

const MIM_ADDRESS = "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3";
const POOL_ADDRESS = "0x59e9082e068ddb27fc5ef1690f9a9f22b32e573f";
const RPC_URL = process.env.RPC_URL;

let oldValue = 0;

const sendEmail = (amount) => {
    const roundedAmount = amount.toString().split(".")[0];

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
      
      var mailOptions = {
        from: process.env.FROM,
        to: process.env.TO,
        subject: roundedAmount + ' MIM Available on Abracadabra!',
        text: `${roundedAmount} MIM are available to borrow in the UST Degenbox strategy!`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

const checkForMim = async () => {
    setTimeout(checkForMim, 60 * 1000);

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    const chainMasterContract = master.masterContractInfo.find(
        (contract) => contract.contractChain === "0x1"
    );

    const masterContract = new ethers.Contract(
        "0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce",
        JSON.stringify(chainMasterContract.abi),
        provider
    );

    const maxBorrow = await getMaxBorrow(masterContract,POOL_ADDRESS,MIM_ADDRESS);
    
    const percentDiff = calculatePercentChange(oldValue, maxBorrow);

    if(maxBorrow > 50000 && percentDiff > 25) {
        sendEmail(maxBorrow);
        oldValue = maxBorrow;
    }
}

const getMaxBorrow = async (bentoContract, poolAddr, tokenAddr) =>{
    try {
      const poolBalance = await bentoContract.balanceOf(tokenAddr, poolAddr, {
        gasLimit: 1000000,
      });

      const toAmount = await bentoContract.toAmount(
        tokenAddr,
        poolBalance,
        false
      );

      const parsedAmount = ethers.utils.formatUnits(toAmount, 18);

      console.log("Max Borrow: ", parsedAmount);
      return parsedAmount;
    } catch (e) {
      console.log("getMaxBorrow err:", e);
      return false;
    }
}

const calculatePercentChange = (oldVal, newVal) => {
    const difference = newVal - oldVal;
    return (Math.abs(difference) / oldVal) * 100.00;
}

checkForMim();
