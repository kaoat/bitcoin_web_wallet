export const NavigationBar=()=>{
    return (
        <nav style={{
            display:"flex",
            flexDirection:"row",
            backgroundColor:"yellow",
            columnGap:"10px",
            padding:"20px",
        }}>
            <div>Bitcoin</div>
            <div>Generate Wallet</div>
            <div>Make Transactions</div>
            <div>Watch Wallet</div>
        </nav>
    )
};