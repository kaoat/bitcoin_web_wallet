import React from "react";
import { ReactDOM } from "react";
import { NavigationBar } from "./NavigationBar";
import { BodyContent } from "./Body";
import { FooterBar } from "./Footer";
export const App=()=>{
    return (
        <div style={{
            display:"flex",
            flexDirection:"column",
            rowGap:"15px"
        }}>
            <NavigationBar />
            <BodyContent />
            <FooterBar />
        </div>
    )
};