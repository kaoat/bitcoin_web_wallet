import React, { useState } from "react";
import { ReactDOM } from "react";
import { SingleWallet } from "./SingleWallet";

export const GenerateWallet=()=>{
    const [mnemonic,setMnemonic]=useState("");
    
    return (
      <div>
        <SingleWallet />
      </div>
    );
};