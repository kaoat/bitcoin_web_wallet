import React, { useState } from "react";
import { ReactDOM } from "react";
import { SingleWallet } from "./SingleWallet";
import { MultisigWallet } from "./MultiWallet";

export const GenerateWallet=()=>{
    const [walletMode,setWalletMode]=useState("single");
    
    return (
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-row gap-x-4">
          <button className={walletMode=="single"?"text-white bg-gray-500 px-4 py-4 rounded border border-solid":
          "text-black px-4 py-4 rounded border border-solid"} onClick={()=>{
            setWalletMode("single");
          }}>Singlesig</button>
          <button className={walletMode=="single"?"text-black px-4 py-4 rounded border border-solid":
          "text-white bg-gray-500 px-4 py-4 rounded border border-solid"} onClick={()=>{
            setWalletMode("multi");
          }}>Multisig</button>
        </div>
        {walletMode=="single"?<SingleWallet />:<MultisigWallet />}
      </div>
    );
};