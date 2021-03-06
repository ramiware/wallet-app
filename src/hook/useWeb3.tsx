import { useState } from "react";
import Web3 from "web3";

export const useWeb3 = () => {
  const [web3, setWeb3] = useState<Web3>();
  const [address, setAddress] = useState("");

  const [accounts, setAccounts] = useState("");

  const connectKardiaChainExtension = async () => {
    if (!window.kardiachain) {
      console.log("useWeb3: KardiaChain extension is not installed!");
      return;
    }

    await window.kardiachain.enable();
    const web3 = new Web3(window.kardiachain);
    const [accounts] = await web3.eth.getAccounts();
    const accountsChecksum = web3.utils.toChecksumAddress(accounts);
    setAccounts(accounts);
    setAddress(accountsChecksum);
    setWeb3(web3);
    console.log("useWeb3: KardiaChain extension is installed!");
  };

  const connectMetamask = async () => {
    if (!window.ethereum) {
      console.log("useWeb3: MetaMask is not installed!");
      return;
    }

    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    // const [accounts] = await window.ethereum.send("ethh_requestAccounts");)
    const [accounts] = await web3.eth.getAccounts();
    const accountsChecksum = web3.utils.toChecksumAddress(accounts);
    setAccounts(accounts);
    setAddress(accountsChecksum);
    setWeb3(web3);
    console.log("useWeb3: MetaMask is installed!");
  };

  const disconnect = async () => {
    setWeb3(new Web3());
    setAccounts("");
    setAddress("");
  };

  return {
    web3,
    address,
    accounts,
    connectKardiaChainExtension,
    connectMetamask,
    disconnect,
  };
};
