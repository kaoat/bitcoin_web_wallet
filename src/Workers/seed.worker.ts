import bitcoin from "../Libraries/Bitcoin";
const ctx: Worker = self as any;
ctx.addEventListener("message", (event) => {
  postMessage(
    bitcoin
      .mnemonicToSeed(event.data.value, event.data.passphrase)
      .toString("hex")
  );
});
export default null as any;
