//import * as BIP84 from "bip84";
import * as BIP39 from "bip39";
import { address } from "bitcoinjs-lib";
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
        language,
        value: BIP39.generateMnemonic(bitlength),
      });
    }
    return mnemonics;
  }
  public entropyToMnemonic(entropy: string) {
    let mnemonics = [];
    for (let language of this.languages) {
      BIP39.setDefaultWordlist(language);
      mnemonics.push({
        language,
        value: BIP39.entropyToMnemonic(entropy),
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
  public generateSegwitWallet(
    zprivOrZPub: string,
    startIndex: number,
    endIndex: number,
    accountIndex: number
  ) {
    let purpose = 84;
    let wallet = [];
    if (zprivOrZPub.startsWith("zprv")) {
      let zprv = new BIP84.fromZPrv(zprivOrZPub);
      for (let i = startIndex; i < endIndex; i++) {
        wallet.push({
          address: zprv.getAddress(i, false, purpose),
          path: `m/${purpose}'/0/${accountIndex}'/0/${i}`,
          privateKey: zprv.getPrivateKey(i, false, purpose),
          publicKey: zprv.getPublicKey(i, false, purpose),
        });
      }
    } else {
      let zpub = new BIP84.fromZPub(zprivOrZPub);
      for (let i = startIndex; i < endIndex; i++) {
        wallet.push({
          address: zpub.getAddress(i, false, purpose),
          path: `m/${purpose}'/0/${accountIndex}'/0/${i}`,
          publicKey: zpub.getPublicKey(i, false, purpose),
        });
      }
    }
    return wallet;
  }
}
const bitcoin: Bitcoin = new Bitcoin();
export default bitcoin;
