//import * as BIP84 from "bip84";
import * as BIP39 from "bip39";
const BIP84 = require("bip84");
class BitcoinWallet {
  public readonly languages: string[];

  constructor() {
    this.languages = [];
    for (let language in BIP39.wordlists) {
      this.languages.push(language);
    }
  }

  public generateMnemonic(bitlength: number) {
    return BIP39.generateMnemonic(bitlength);
  }

  public getMasterPrivateKey(
    mnemonic: string,
    passPhrase: string,
    index: number,
    purpose?: number
  ) {
    purpose = purpose || 84;
    if (passPhrase == "") {
      return new BIP84.fromMnemonic(mnemonic).deriveAccount(index, purpose);
    }
    return new BIP84.fromMnemonic(mnemonic, passPhrase).deriveAccount(
      index,
      purpose
    );
  }

  public getAccountMasterPrivateKey(zprv: string) {
    return new BIP84.fromZPrv(zprv).getAccountPrivateKey();
  }
  public getAccountMasterPublicKey(zprv: string) {
    return new BIP84.fromZPrv(zprv).getAccountPublicKey();
  }
  public generateSegwitSingleSigAddresses(
    zprivOrZPub: string,
    startIndex: number,
    endIndex: number,
    purpose?: number
  ) {
    purpose = purpose || 84;
    let addresses = [];
    if (zprivOrZPub.startsWith("zprv")) {
      for (let i = startIndex; i < endIndex; i++) {
        addresses.push(
          new BIP84.fromZPrv(zprivOrZPub).getAddress(i, false, purpose)
        );
      }
    } else {
      for (let i = startIndex; i < endIndex; i++) {
        addresses.push(
          new BIP84.fromZPub(zprivOrZPub).getAddress(i, false, purpose)
        );
      }
    }
    return addresses;
  }
  public generateSegwitSingleSigPublicKeys(
    zprivOrZPub: string,
    startIndex: number,
    endIndex: number
  ) {
    let publicKeys = [];
    if (zprivOrZPub.startsWith("zprv")) {
      for (let i = startIndex; i < endIndex; i++) {
        publicKeys.push(new BIP84.fromZPrv(zprivOrZPub).getPublicKey(i, false));
      }
    } else {
      for (let i = startIndex; i < endIndex; i++) {
        publicKeys.push(new BIP84.fromZPub(zprivOrZPub).getPublicKey(i, false));
      }
    }
    return publicKeys;
  }

  public generateSegwitSingleSigPrivateKeys(
    zpriv: string,
    startIndex: number,
    endIndex: number
  ) {
    let privateKeys = [];
    for (let i = startIndex; i < endIndex; i++) {
      privateKeys.push(new BIP84.fromZPrv(zpriv).getPrivateKey(i, false));
    }
    return privateKeys;
  }
}
const bitcoinWallet: BitcoinWallet = new BitcoinWallet();
export default bitcoinWallet;
