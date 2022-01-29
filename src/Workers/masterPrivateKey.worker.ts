import bitcoin from "../Libraries/Bitcoin";
const ctx: Worker = self as any;
ctx.addEventListener("message", (event) => {
  postMessage(
    bitcoin.getMasterPrivateKey(
      event.data.value,
      event.data.passphrase,
      event.data.accountIndex
    )
  );
});
export default null as any;
