export const NavigationBar=()=>{
    return (
        <nav className="flex items-center justify-between flex-wrap bg-yellow-400 p-6">
  <div className="flex items-center flex-shrink-0 text-white mr-6">
    <img src="./assets/svg/bitcoin-btc-logo.svg" alt="bitcoin logo" className="fill-current h-8 w-8 mr-2" />
    <span className="font-semibold text-xl tracking-tight hover:text-black">Bitcoin</span>
  </div>
  <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
    <div className="text-sm lg:flex-grow">
      <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-black mr-4">
        Generate Wallet
      </a>
      <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-black mr-4">
        Make Transactions
      </a>
      <a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-black">
        Watch Only Wallet
      </a>
    </div>
  </div>
</nav>
    )
};