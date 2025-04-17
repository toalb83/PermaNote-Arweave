let bundlr;

async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new Web3(window.ethereum);
    bundlr = new Bundlr.default("https://node1.bundlr.network", "ethereum", provider);
    await bundlr.ready();
    alert("✅ Wallet connected!");
  } else {
    alert("❌ MetaMask not detected.");
  }
}

async function uploadNote() {
  const text = document.getElementById("note").value.trim();
  if (!text) return alert("Please write something first.");

  if (!bundlr) return alert("Connect your wallet first.");

  try {
    const data = new TextEncoder().encode(text);
    const tx = bundlr.createTransaction(data, {
      tags: [{ name: "Content-Type", value: "text/plain" }]
    });
    await tx.sign();
    await tx.upload();

    const url = `https://arweave.net/${tx.id}`;
    document.getElementById("link").innerHTML = `✅ <a href="${url}" target="_blank">View your note on Arweave</a>`;
  } catch (e) {
    console.error(e);
    alert("❌ Upload failed!");
  }
}

document.getElementById("connect").onclick = connectWallet;
document.getElementById("save").onclick = uploadNote;
