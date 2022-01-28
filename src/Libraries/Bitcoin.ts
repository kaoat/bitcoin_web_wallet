//import * as BIP84 from "bip84";
import * as BIP39 from "bip39";
const BIP84 = require("bip84");
class Bitcoin {
  public readonly languages: string[];
  public readonly words: { length: number; bit: number }[];

  constructor() {
    this.languages = [];
    for (let language in BIP39.wordlists) {
      this.languages.push(language);
    }
    this.words = [
      {
        length: 12,
        bit: 128,
      },
      {
        length: 15,
        bit: 160,
      },
      {
        length: 18,
        bit: 192,
      },
      {
        length: 21,
        bit: 224,
      },
      {
        length: 24,
        bit: 256,
      },
    ];
  }

  public generateMnemonic(bitlength: number) {
    let mnemonics = [];
    for (let language of this.languages) {
      BIP39.setDefaultWordlist(language);
      mnemonics.push({
        language: language,
        value: BIP39.generateMnemonic(bitlength),
      });
    }
    return mnemonics;
  }

  public mnemonicToEntropy(mnemonic: string) {
    return BIP39.mnemonicToEntropy(mnemonic);
  }
  public mnemonicToSeed(mnemonic: string, passPhrase: string) {
    passPhrase = passPhrase || "";
    return BIP39.mnemonicToSeedSync(mnemonic, passPhrase);
  }

  public validateMnemonic(mnemonic: string) {
    return BIP39.validateMnemonic(mnemonic);
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
const bitcoin: Bitcoin = new Bitcoin();
export default bitcoin;
