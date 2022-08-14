import "./styles/App.css";
import videoBackgroud from "./assets/2background.mp4";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import SR from "./utils/SR.json";
import imgSr from "./assets/logo.png";

// Constants
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Certifique-se que você tem a MetaMask instalada!");
      return;
    } else {
      console.log("Temos o objeto ethereum!", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Encontrou uma conta autorizada:", account);
      setCurrentAccount(account);
    } else {
      console.log("Nenhuma conta autorizada foi encontrada");
    }
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Conectado à rede " + chainId);
    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      alert("Você não está conectado a rede Rinkeby de teste!");
    }
  };
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Baixe a MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0xad99c3E60a6e8f1394A748c8B84b5B9ef4555D36";
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          SR.abi,
          signer
        );

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Olá pessoal! Já cunhamos seu NFT. Pode ser que esteja branco agora. Demora no máximo 10 minutos para aparecer no OpenSea. Aqui está o link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`
          );
        });

        console.log("Vai abrir a carteira agora para pagar o gás...");
        let nftTxn = await connectedContract.makeAnEpicNFT();
        console.log("Cunhando...espere por favor.");
        await nftTxn.wait();
        console.log(
          `Cunhado, veja a transação: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Objeto ethereum não existe!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Conectar Carteira
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          width: "100%",
          left: "50%",
          top: "50%",
          height: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%)",
          zIndex: "-1",
          filter: "blur(1.7px)",
        }}
      >
        <source src={videoBackgroud} type="video/mp4" />
      </video>
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Primeira Coleção NFT da SR</p>
          <div className="sub-text">
            <text>
              Fala pessoal segue o passo a Passo:
              <p className="sub-text">
                <strong>Primeiro devemos conectar a Metamask no site</strong>
              </p>
              <p className="sub-text">
                Depois é só clicar em Mint para pegar a NFT`
              </p>
            </text>
          </div>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={askContractToMintNft}
              className="cta-button connect-wallet-button"
            >
              Mintar NFT_
            </button>
          )}
        </div>
        <div className="logo">
          <img src={imgSr} />
        </div>
        <div className="footer-container">
          <a className="footer-text" target="_blank" rel="noreferrer">
            {`Feito com ❤️ pelo estágiario`}
          </a>
        </div>
      </div>
    </div>
  );
};
export default App;
