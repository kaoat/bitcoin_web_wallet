import React, { useEffect, useState } from "react";
import { ReactDOM } from "react";
import { Button } from "react-bootstrap/lib/InputGroup";
import bitcoin from "../Libraries/Bitcoin";
import MyWorker from "../Workers/Bitcoin.worker";
const MnemonicComponent=()=>{
    const [mnemonics,setMnemonics]=useState<{ language: string; value: string; }[]>([]);
    const [bitlength,setBitLength]=useState(128);
    const [entropy,setEntropy]=useState("");
    const [passphrase,setPassphrase]=useState("");
    const [language,setLanguage]=useState(bitcoin.languages[0]);
    const [mnemonic,setMnemonic]=useState("");
    const [seed,setSeed]=useState("");

    useEffect(()=>{
       if(mnemonics.length!=0){
        for(let mnemonic of mnemonics){
            if(mnemonic.language==language){
                setMnemonic(mnemonic.value);
            }
        }
       }
    },[language,mnemonics]);

    useEffect(()=>{
        if(mnemonics.length!=0){
            for(let mnemonic of mnemonics ){
                if(mnemonic.language=="english"){
                    setEntropy(bitcoin.mnemonicToEntropy(mnemonic.value));
                    break;
                }
            }
        }
    },[mnemonics]);

    useEffect(()=>{
        if(mnemonics.length!=0){
            for(let mnemonic of mnemonics){
                if(mnemonic.language=="english"){
                    let ss=new MyWorker();
                    ss.postMessage({value:mnemonic.value,passphrase});
                    ss.onmessage=function(e:any){
                        setSeed(e.data);
                        ss.terminate();
                    }
                }
            }
        }
    },[mnemonics,passphrase]);

    return (
        <div style={{
            display:"flex",
            flexDirection:"column",
            rowGap:"15px"
        }}>
            <h1 className="text-3xl">Single Wallet</h1>
            <div style={{
            display:"flex",
            flexDirection:"row",
            columnGap:"10px"
            }}>
                <select className="form-select px-3 py-1.5 text-base font-normal text-gray-700
                    border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 
                    focus:bg-white focus:border-blue-600 focus:outline-none"
                    onChange={(e)=>{
                        setLanguage(e.target.value);
                    }}>
                    {bitcoin.languages.map(languages=>{
                        return <option value={languages} key={languages}>{languages}</option>
                    })}
                </select>
                <span className="py-1.5">
                    Language:
                </span>
                <span className="py-1.5">
                    Word:
                </span>
                <select className="form-select px-3 py-1.5 text-base font-normal text-gray-700
                    border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 
                    focus:bg-white focus:border-blue-600 focus:outline-none"
                    onChange={(e)=>{
                        setBitLength(Number(e.target.value));
                    }}>
                    {bitcoin.words.map(word=>{
                        return <option value={word.bit} key={word.bit}>{word.length}</option>
                    })}
                </select>
                <button onClick={()=>{
                    setMnemonics(bitcoin.generateMnemonic(bitlength));
                }} className="border border-solid border-gray-300 rounded px-3 py-1.5">Generate</button>
            </div>
            <div style={{
            display:"flex",
            flexDirection:"column",
            rowGap:"5px"
            }}>
                <span>Passphrase</span>
                <textarea onChange={(e)=>{
                    setPassphrase(e.target.value);
                }} rows={3} className="px-3 py-1 border border-solid border-gray-300 rounded w-full" ></textarea>
            </div>
            <div style={{
            display:"flex",
            flexDirection:"column",
            rowGap:"5px"
            }}>
                <span>Seed</span>
                <textarea value={seed} rows={3} className="px-3 py-1 border border-solid border-gray-300 rounded w-full" ></textarea>
            </div>
            <div style={{
            display:"flex",
            flexDirection:"column",
            rowGap:"5px"
            }}>
                <span>Entropy</span>
                <textarea value={entropy} rows={3} className="px-3 py-1 border border-solid border-gray-300 rounded w-full" ></textarea>
            </div>
            <div style={{
            display:"flex",
            flexDirection:"column",
            rowGap:"5px"
            }}>
                <span>Mnemonic Phrase</span>
                <textarea onChange={(e)=>{
                    if(bitcoin.validateMnemonic(e.target.value)){
                        
                    }
                }} value={mnemonic} rows={3} className="px-3 py-1 border border-solid border-gray-300 rounded w-full" ></textarea>
            </div>
        </div>
    );
}

export const SingleWallet=()=>{
    return (
    <div>
        <MnemonicComponent />
    </div>)
}