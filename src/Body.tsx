import { useState } from "react";
import { GenerateWallet } from "./Components/GenerateWallet";

const MODE=[
    {
        mode:"generateWallet",
        component:<GenerateWallet />
    },
    {
        mode:"makeTransaction",
        component:<GenerateWallet />
    }
];

export const BodyContent=()=>{
    const [mode,setMode]=useState(MODE[0]);
    return (
        <div className="container mx-auto px-8">
            {mode.component}
        </div>
    )
};