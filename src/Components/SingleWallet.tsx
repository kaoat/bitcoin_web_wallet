import React, { useEffect, useState } from "react";
import { ReactDOM } from "react";
import { Button } from "react-bootstrap/lib/InputGroup";
import bitcoin from "../Libraries/Bitcoin";
import seedGenerator from "../Workers/seed.worker";
import masterPrivateKeyWorker from "../Workers/masterPrivateKey.worker";
import QRcode from "qrcode";

var seedTimeout=setTimeout(()=>{

},500);

var masterPrivateKeyTimeout=setTimeout(()=>{

},500);

var accountMasterPrvKeyTimeout=setTimeout(()=>{

},500);

export const SingleWallet=()=>{
    const [mnemonics,setMnemonics]=useState<{ language: string; value: string; }[]>([]);
    const [bitlength,setBitLength]=useState(128);
    const [entropy,setEntropy]=useState("");
    const [passphrase,setPassphrase]=useState("");
    const [language,setLanguage]=useState(bitcoin.languages[10]);
    const [mnemonic,setMnemonic]=useState("");
    const [seed,setSeed]=useState("");
    const [isSeedGenerating,setIsSeedGenerating]=useState(false);
    const [isMasterPrvKeyGenerating,setIsMasterPrvKeyGenerating]=useState(false);
    const [wallet,setWallet]=useState<any[]>();
    const [accountIndex,setAccountIndex]=useState(0);
    const [masterPrivateKey,setMasterPrivateKey]=useState("");
    const [accountMasterPrvKey,setAccountMasterPrvKey]=useState("");
    const [accountMasterPubKey,setAccountMasterPubKey]=useState("");
    const [isPrivateMode,setIsPrivateMode]=useState(false);
    const [addressStartIndex,setAddressStartIndex]=useState(0);
    const [addressEndIndex,setAddressEndIndex]=useState(20);

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
        if(seed!=""){
            setIsSeedGenerating(false);
        }
    },[seed]);

    useEffect(()=>{
        if(mnemonics.length!=0){
            setIsSeedGenerating(true);
            for(let mnemonic of mnemonics){
                if(mnemonic.language=="english"){
                    clearTimeout(seedTimeout);
                    seedTimeout=setTimeout(()=>{
                    let worker=new seedGenerator();
                    worker.postMessage({value:mnemonic.value,passphrase});
                    worker.onmessage=function(e:any){
                        setSeed(e.data);
                        worker.terminate();
                    }
                    },500);
                }
            }
        }
    },[mnemonics,passphrase]);

    useEffect(()=>{
        if(mnemonics.length!=0&&accountIndex>=0){
            setIsMasterPrvKeyGenerating(true);
            for(let mnemonic of mnemonics){
                if(mnemonic.language=="english"){
                    clearTimeout(masterPrivateKeyTimeout);
                    masterPrivateKeyTimeout=setTimeout(()=>{
                        let worker=new masterPrivateKeyWorker();
                        worker.postMessage({value:mnemonic.value,passphrase,accountIndex});
                        worker.onmessage=function(e:any){
                            setMasterPrivateKey(e.data);
                            worker.terminate();
                        }
                    },500);
                }
            }
        }
    },[mnemonics,passphrase,accountIndex]);

    useEffect(()=>{
        if(masterPrivateKey!=""){
            clearTimeout(accountMasterPrvKeyTimeout);
            accountMasterPrvKeyTimeout=setTimeout(()=>{
                setAccountMasterPrvKey(bitcoin.getAccountMasterPrivateKey(masterPrivateKey));
            },500);
        }
    },[masterPrivateKey]);

    useEffect(()=>{
        if(masterPrivateKey!=""){
            setIsMasterPrvKeyGenerating(false);
        }
    },[masterPrivateKey]);

    useEffect(()=>{
        if(masterPrivateKey!=""){
            setAccountMasterPubKey(bitcoin.getAccountMasterPublicKey(masterPrivateKey));
        }
    },[masterPrivateKey]);

    useEffect(()=>{
        if(masterPrivateKey!=""){
            setWallet(bitcoin.generateSegwitWallet(masterPrivateKey,addressStartIndex,addressEndIndex,accountIndex));
        }
    },[masterPrivateKey])

    useEffect(()=>{
        if(addressEndIndex>addressStartIndex&&addressStartIndex>0&&addressEndIndex>0&&masterPrivateKey!=""){
            setWallet(bitcoin.generateSegwitWallet(masterPrivateKey,addressStartIndex,addressEndIndex,accountIndex));
        }
    },[addressEndIndex])

    useEffect(()=>{
        if(addressEndIndex>addressStartIndex&&addressStartIndex>0&&addressEndIndex>0&&masterPrivateKey!=""){
            setWallet(bitcoin.generateSegwitWallet(masterPrivateKey,addressStartIndex,addressEndIndex,accountIndex));
        }
    },[addressStartIndex])

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="text-3xl">Single Wallet</h1>
            <div className="flex md:flex-row md:gap-x-4 sm:flex-col sm:gap-y-4">
                <span className="py-1.5">
                    Language:
                </span>
                <select className="form-select px-3 py-1.5 text-base font-normal text-gray-700
                    border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 
                    focus:bg-white focus:border-blue-600 focus:outline-none"
                    onChange={(e)=>{
                        setLanguage(e.target.value);
                    }}>
                    {bitcoin.languages.map(languagez=>{
                        let isSelected=languagez==language;
                        return <option selected={isSelected} value={languagez} key={languagez}>{languagez}</option>
                    })}
                </select>
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
                }} className="hover:bg-indigo-800 hover:text-white border border-solid border-gray-300 rounded px-3 py-1.5">Generate</button>
                <button className={isPrivateMode?"bg-green-600 text-white border border-solid border-gray-300 rounded px-3 py-1.5":"text-white bg-red-600 border border-solid border-gray-300 rounded px-3 py-1.5"} onClick={()=>{
                    if(isPrivateMode)setIsPrivateMode(false)
                    else setIsPrivateMode(true);
                }}>{isPrivateMode?"Current: Privacy Mode":"Current: Public Mode"}</button>
            </div>
            <div className="flex flex-col gap-y-4">
                <span>Passphrase</span>
                <textarea onChange={(e)=>{
                    setPassphrase(e.target.value);
                }} rows={3} className="px-3 py-1 border border-solid border-gray-300 rounded w-full" ></textarea>
            </div>
            <div className={isSeedGenerating||isPrivateMode?"flex flex-col gap-y-4 blur-[2px] animate-pulse":"flex flex-col gap-y-4"}>
                <span>Seed</span>
                <textarea onClick={(e:any)=>{
                    //console.log(QRcode.toString(e.target.value));
                }} readOnly={true} value={isPrivateMode?"":seed} rows={3} 
                className="bg-gray-100 px-3 py-1 border border-solid border-gray-300 rounded w-full"></textarea>
            </div>
            <div className={isMasterPrvKeyGenerating||isPrivateMode?"flex flex-col gap-y-4 blur-[2px] animate-pulse":"flex flex-col gap-y-4"}>
                <span>Entropy</span>
                <textarea readOnly={true} value={isPrivateMode?"":entropy} rows={3} 
                className="bg-gray-100 px-3 py-1 border border-solid border-gray-300 rounded w-full" ></textarea>
            </div>
            <div className={isMasterPrvKeyGenerating||isPrivateMode?"flex flex-col gap-y-4 blur-[2px] animate-pulse":"flex flex-col gap-y-4"}>
                <span>Mnemonic Phrase</span>
                <textarea onChange={(e)=>{
                    setMnemonic(e.target.value);
                    if(bitcoin.validateMnemonic(e.target.value)){
                        let tempEntropy=bitcoin.mnemonicToEntropy(e.target.value);
                        let tempMnemonics=bitcoin.entropyToMnemonic(tempEntropy);
                        setMnemonics(tempMnemonics);
                    }
                }} value={isPrivateMode?"":mnemonic} rows={3} 
                className="px-3 py-1 border border-solid border-gray-300 rounded w-full" ></textarea>
            </div>
            <div className={isMasterPrvKeyGenerating?"flex flex-col gap-y-4 blur-[2px] animate-pulse":"flex flex-col gap-y-4"}>
                <h2 className="text-2xl">BIP84</h2>
                <div className="flex flex-col gap-y-4">
                    <span>Account Index</span>
                    <input value={accountIndex} className="px-3 py-1 border border-solid border-gray-300 rounded w-full" type="number" min={0} onChange={((e)=>{
                        setAccountIndex(Number(e.target.value));
                    })}  />
                </div>
                <div className={isPrivateMode?"flex flex-col gap-y-4 blur-[2px]":"flex flex-col gap-y-4"}>
                    <span>Master Private Key</span>
                    <textarea readOnly={true} value={isPrivateMode?"":masterPrivateKey} rows={3} 
                    className="bg-gray-100 px-3 py-1 border border-solid border-gray-300 rounded w-full"></textarea>
                </div>
                <div className={isPrivateMode?"flex flex-col gap-y-4 blur-[2px]":"flex flex-col gap-y-4"}>
                    <span>Account Master Private Key</span>
                    <textarea readOnly={true} value={isPrivateMode?"":accountMasterPrvKey} rows={3} 
                    className="bg-gray-100 px-3 py-1 border border-solid border-gray-300 rounded w-full" ></textarea>
                </div>
                <div className="flex flex-col gap-y-4">
                    <span>Account Master Public Key</span>
                    <textarea readOnly={true} value={accountMasterPubKey} rows={3} 
                    className="bg-gray-100 px-3 py-1 border border-solid border-gray-300 rounded w-full" ></textarea>
                </div>
                <div className="flex flex-col gap-y-4">
                    <span>Segwit Addresses</span>
                    <div className="flex flex-row gap-x-4">
                        <span>Start Index</span>
                        <input onChange={(e)=>{
                            setAddressStartIndex(Number(e.target.value));
                        }} value={addressStartIndex} type="number" min={0}
                        className="border border-solid border-gray-300 rounded px-3 py-1" />
                        <span>End Index</span>
                        <input onChange={(e)=>{
                            console.log(e.target.value);
                            setAddressEndIndex(Number(e.target.value));
                        }} value={addressEndIndex} type="number" min={0}
                        className="border border-solid border-gray-300 rounded px-3 py-1" />
                    </div>
                    <table className="table-fixed border-collapse border border-slate-600">
                        <thead className="bg-yellow-200">
                            <tr>
                                <th className="border border-slate-600">Path</th>
                                <th className="border border-slate-600">Address</th>
                                <th className="border border-slate-600">Public Key</th>
                                <th className={isPrivateMode?"border border-slate-600 blur-[2px]":"border border-slate-600"}>Private Key</th>
                            </tr>
                        </thead>
                        <tbody>
                        {wallet?.map(derivedAddress=>{
                            return (
                                <tr>
                                    <td className="px-3 py-1 border border-slate-600">{derivedAddress.path}</td>
                                    <td className="px-3 py-1 border border-slate-600">{derivedAddress.address}</td>
                                    <td className="px-3 py-1 border border-slate-600">{derivedAddress.publicKey}</td>
                                    <td className={isPrivateMode?"px-3 py-1 border border-slate-600 blur-[2px]":"px-3 py-1 border border-slate-600"}>
                                        {isPrivateMode?"":derivedAddress.privateKey}
                                        </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}