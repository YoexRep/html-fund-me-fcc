//Recoradar que el front end, no se puede hacer uso del require(para ethers)

//se debe de crear un archivo, con la libreria del front end para ethers, y luego importarlo, eso si queremos hacerlo de forma manual, tambien se puede hacer con el gestor
//de paquetes yarn, con "yarn add"

import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");

const balanceButton = document.getElementById("balanceButton");

const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;

balanceButton.onclick = getBalance;

withdrawButton.onclick = withDrawFunds;

console.log(ethers);
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Conectado wallet";
  } else {
    fundButton.innerHTML = "Por favor instala metamask";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;

  console.log("Funding with " + ethAmount);
  if (typeof window.ethereum !== "undefined") {
    //provider / connection to the blockchain
    //signer / wallet / someone with gas
    //contract con el que estamos interactuando
    //ABI y ADDRESS

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      //Aqui nos esperamos hata que la transaction termine

      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);

  //aqui escucharemos hasta que la transaccion termine, usando la libreia de "ETHERS"

  return new Promise((resolve, reject) => {
    //Aqui recibo el transaccionResponse. hash, el cual tiene un transaccion recibo, este lo paso a mi funcion anonima, e imprimo por pantalla el mismo
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );

      resolve();
    });
  });
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    //provider / connection to the blockchain
    //signer / wallet / someone with gas
    //contract con el que estamos interactuando
    //ABI y ADDRESS

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);

    alert(`El balance del contrato es ${ethers.utils.formatEther(balance)}`);
  }
}

async function withDrawFunds() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.cheaperwithdraw();

      await listenForTransactionMine(transactionResponse, provider);

      alert(`Withdraw terminado `);
    } catch (error) {
      console.log(error);
    }
  }
}
