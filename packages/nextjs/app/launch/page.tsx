"use client";

import { useState } from "react";
import Link from "next/link";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { parseEther } from "ethers/lib/utils";
import type { NextPage } from "next";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { sendTransaction } from "~~/lib/dynamic";

// This is the launch page used to launch a new meme token
// it will receive the URL of the meme token as a query parameter
// It should present the user with a form to create a new meme token
// The form should have the following fields:
// - URL (pre-filled with the URL query parameter
// It should also have a Launch button that will call the smart contract to create the meme token
// The page should display the address of the connected wallet
// The user can only click the Launch button if they are connected to a wallet

const Launch: NextPage = () => {
  const { primaryWallet, networkConfigurations } = useDynamicContext();
  const [messageSignature] = useState<string>("");
  const [transactionSignature, setTransactionSignature] = useState<string>("");
  const connectedAddress = primaryWallet?.address;

  // const handleSignMesssage = async () => {
  //   try {
  //     const signature = await signMessage("Hello World", primaryWallet);
  //     setMessageSignature(signature);

  //     setTimeout(() => {
  //       setMessageSignature("");
  //     }, 10000);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const handleSendTransaction = async () => {
    try {
      const isTestnet = await primaryWallet?.connector?.isTestnet();
      if (!isTestnet) {
        alert("You're not on a testnet, proceed with caution.");
      }
      const hash = await sendTransaction(connectedAddress, "0.0001", primaryWallet, networkConfigurations);
      setTransactionSignature(hash);

      setTimeout(() => {
        setTransactionSignature("");
      }, 10000);
    } catch (e) {
      console.error(e);
    }
  };

  const getUrlFromQueryParams = () => {
    const params = new URLSearchParams(document.location.search);
    const url = params.get("url");
    return url;
  };

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Launch a new meme token</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          {primaryWallet && !transactionSignature && (
            <div className="flex justify-center items-center space-x-2 flex-col sm:flex-col">
              <input className="w-96 mt-4 mb-4" type="text" value={getUrlFromQueryParams()} />

              <button
                className="btn btn-primary"
                onClick={async () => {
                  try {
                    await writeYourContractAsync({
                      functionName: "setGreeting",
                      args: ["The value to set"],
                      value: parseEther("0.1"),
                    });
                  } catch (e) {
                    console.error("Error setting greeting:", e);
                  }
                }}
              >
                Set Greeting
              </button>

              <button onClick={() => handleSendTransaction()} className="btn btn-primary">
                Launch the meme token!
              </button>
            </div>
          )}
          {primaryWallet && messageSignature && (
            <p className="text-center-text-lg">Message signed! {messageSignature}</p>
          )}
          {primaryWallet && transactionSignature && (
            <p className="text-center-text-lg">Transaction processed! {transactionSignature}</p>
          )}
          <p className="text-center text-lg" style={{ width: "400px", textAlign: "left" }}>
            The Schellinglayer protocol reserves an ERC20 token for each and every URL. Only one ERC20 token can exist
            per URL and anyone can launch it. The person launching the token is rewarded for paying the gas with 0.5% of
            the token supply. The rest of the supply is distributed according to protocol rules.{" "}
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Blockscout Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Launch;
