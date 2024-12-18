import React, { useCallback, useEffect, useState } from "react";
import { SendTransactionRequest, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { TonConnectButton } from "@tonconnect/ui-react";
import { TonConnect } from "@tonconnect/sdk"; 
import HistorySection from "./HistorySection";
import StatsSection from "./StatsSection";
import TonCard from "./toncard"

type TabName = "Пополнить" | "Вывести" | "История" | "Статистика";

const TAB_NAMES: TabName[] = ["Пополнить", "Вывести", "История", "Статистика"];

const Agent: React.FC = () => {
  // State declarations
  const [currentTab, setCurrentTab] = useState<TabName>("Пополнить");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [address, setAddress] = useState<string | null>(null);
  // const [isConnected, setIsConnected] = useState<boolean>(false);
  const [tonBalance, setTonBalance] = useState<number>(0);
  const [usdtBalance, setUsdtBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [toAddress, setToAddress] = useState<string>("");
  const [selectedCurrency, setSelectedCurrency] = useState<"ton" | "usdt">("ton"); 

  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();
  const tonConnect = new TonConnect();

  // Restore wallet connection and subscribe to status changes
  useEffect(() => {
    setToAddress;
    tonConnect.restoreConnection();
    tonConnect.onStatusChange((wallet) => {
      if (wallet) {
        // setIsConnected(true);
        setAddress(wallet.account.address);
      } else {
        // setIsConnected(false);
        setAddress(null);
      }
    });
  }, [tonConnect]);

  // Fetch balances when wallet address changes
  useEffect(() => {
    if (address) {
      fetchTonBalance(address);
      fetchUsdtBalance(address);
    }
  }, [address]);

  const fetchTonBalance = async (walletAddress: string): Promise<void> => {
    try {
      const response = await fetch(`https://toncenter.com/api/v2/getAddressInformation?address=${walletAddress}`);
      const data = await response.json();
      if (data.ok) {
        setTonBalance(data.result.balance / 1e9); // Convert from nanoTON
      } else {
        console.error("Failed to fetch TON balance");
      }
    } catch (error) {
      console.error("Error fetching TON balance:", error);
    }
  };

  const fetchUsdtBalance = async (walletAddress: string): Promise<void> => {
    try {
      // Replace this with the actual USDT Jetton contract address for TON
      const usdtJettonAddress = "EQDez1pR4uhEMkK4c9a0EZJQpujBhoGdN2kRCh5vA2O1YsRW"; // Example address
  
      const endpoint = `https://tonapi.io/v1/jettons/getBalances?account=${walletAddress}`;
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer YOUR_TONAPI_KEY`, // Use your TonAPI key
        },
      });
  
      const data = await response.json();
  
      if (data.balances && Array.isArray(data.balances)) {
        const usdtBalanceEntry = data.balances.find(
          (jetton: any) => jetton.jetton_address === usdtJettonAddress
        );
  
        if (usdtBalanceEntry) {
          setUsdtBalance(parseFloat(usdtBalanceEntry.balance) / 1e9); // USDT uses 9 decimals
        } else {
          setUsdtBalance(0); // No USDT balance found
        }
      } else {
        console.error("Invalid response for USDT balance:", data);
        setUsdtBalance(0);
      }
    } catch (error) {
      console.error("Error fetching USDT balance:", error);
      setUsdtBalance(0); // Fallback to zero balance in case of errors
    }
  };
  
  // Handle tab switching
  const handleTabChange = useCallback((index: number): void => {
    setActiveIndex(index);
    setCurrentTab(TAB_NAMES[index]);
  }, []);

  // Handle input presets
  const handlePresetClick = useCallback((value: number): void => {
    setInputValue(value.toString());
  }, []);

  const handleTopUpBalance = async () => {
    try {
      const amountToSend = Number(inputValue) * 1e9; // Convert TON to nanoTON
      if (!amountToSend || amountToSend <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
  
      const transactionRequest: SendTransactionRequest = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // Valid for 10 minutes
        messages: [
          {
            address: "EQBCdMGRh21RZttSyNuzkFatXMb4Bad17eQ2nxDfeQpO8KP8", // Smart contract address
            amount: amountToSend.toString(), // Amount in nanoTON
            payload: "", // Optional payload if required by the contract
          },
        ],
      };
  
      await tonConnectUi.sendTransaction(transactionRequest);
      console.log("Transaction sent successfully!");
      alert("Transaction sent! Check your wallet.");
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Failed to send the transaction. Please try again.");
    }
  };

  const handleWithdraw = async () => {
    try {
      const amountNano = Math.floor(Number(amount) * 1e9); // Convert TON to nanoTON
      if (amountNano <= 0) {
        alert("Invalid input. Please enter a valid amount and address.");
        return;
      }

      if (selectedCurrency === "ton") {
        // TON Withdrawal
        const transactionRequest: SendTransactionRequest = {
          validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes validity
          messages: [
            {
              address: "UQD_JRfUhS9heihr7m2uKMqT739qa4ySDpRHcTvqjkCUU_Zm", // Destination address
              amount: amountNano.toString(), // Amount in nanoTON
              payload: "", // No additional payload
            },
          ],
        };

        await tonConnectUi.sendTransaction(transactionRequest);
        alert("TON withdrawal transaction sent successfully!");
      } else if (selectedCurrency === "usdt") {
        // USDT Withdrawal
        const usdtContractAddress = "USDT_CONTRACT_ADDRESS"; // Replace with actual USDT contract address

        const transactionRequest: SendTransactionRequest = {
          validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes validity
          messages: [
            {
              address: usdtContractAddress, // USDT contract address
              amount: "0", // No TON sent
              payload: createUSDTTransferPayload(toAddress, amountNano), // Custom payload for USDT transfer
            },
          ],
        };

        await tonConnectUi.sendTransaction(transactionRequest);
        alert("USDT withdrawal transaction sent successfully!");
      }
    } catch (error) {
      console.error("Withdrawal Error:", error);
      alert("Withdrawal failed. Please try again.");
    }
  };

  const createUSDTTransferPayload = (to: string, amountNano: number): string => {
    // Encode the USDT transfer payload (adjust according to the USDT contract)
    const transferMethodId = "0x67A0B6FA"; // Replace with actual method ID for "transfer" in the USDT contract
    return (
      transferMethodId +
      to.padStart(64, "0") +
      amountNano.toString(16).padStart(64, "0")
    );
  };

  return (
    <main className="relative pt-24 pb-24 w-full bg-cover bg-center bg-no-repeat min-h-full bg-[url('/images/background/background.png')] bg-[#5200FF64]">
      <nav className="fixed top-0 w-full pt-5 pb-5 bg-cover bg-[url('/images/background/header_bg.png')] rounded-b-3xl">
        <div className="flex justify-center items-center mt-3">
          <div className="flex h-10 bg-[#1a1f36] rounded-[10px] overflow-hidden border-dark-blue border-[1px]">
            {TAB_NAMES.map((tab, index) => (
              <button
                key={tab}
                className={`px-5 py-2 text-white text-sm transition-all duration-300 ${
                  activeIndex === index ? "bg-[#314e89] rounded-[10px]" : "hover:bg-[rgba(255,255,255,0.1)]"
                }`}
                onClick={() => handleTabChange(index)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <h1 className="text-white font-bold text-2xl text-center mt-2">Финансы</h1>
      </nav>
      <div className="px-4 mt-10">
        {currentTab === "Пополнить" && (
          <div className="">
            <div className="flex justify-center mt-16">
              <TonConnectButton />
            </div>
            {address && (
            <div className="">
              <TonCard
                ton_amount={parseFloat(tonBalance.toFixed(2))}
                usdt_amount={parseFloat(usdtBalance.toFixed(2))}
              />
              <div className="flex bg-cover bg-center bg-no-repeat bg-[#0B1B35] h-full p-4 rounded-lg shadow-md mb-3 w-full mt-3 items-center">
                <div>
                  <p className="text-white">Укажите сумму пополнения</p>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-gray-600 rounded-[5px] w-1/2 h-5 mt-2 text-white"
                  />
                </div>
                <div className="flex ml-4 space-x-3">
                  <p
                    className="text-gray-400 cursor-pointer hover:text-white"
                    onClick={() => handlePresetClick(700)}
                  >
                    700
                  </p>
                  <p
                    className="text-gray-400 cursor-pointer hover:text-white"
                    onClick={() => handlePresetClick(1000)}
                  >
                    1000
                  </p>
                  <p
                    className="text-gray-400 cursor-pointer hover:text-white"
                    onClick={() => handlePresetClick(1500)}
                  >
                    1500
                  </p>
                </div>
              </div>
              <div className="flex bg-cover bg-center bg-no-repeat bg-dark-blue h-full p-4 flex justify-center rounded-lg shadow-md mb-3 w-full mt-3 items-center">
                <div>
                  <img src="/images/wallet.png" />
                </div>
                <p className="text-white text-center items-center ml-2">
                  <span className="text-gray-400 text-[10px] truncate">{address}</span>
                </p>
              </div>
              {wallet ? (
                <div className="flex justify-center">
                  <button
                    onClick={handleTopUpBalance}
                    className="rounded-lg p-3 flex justify-center bg-blue-600 w-full"
                  >
                    <p className="text-white">Пополнить баланс</p>
                  </button>
                </div>
              ) : (
                <button onClick={() => tonConnectUi.openModal()}>
                  Connect wallet to send the transaction
                </button>
              )}
            </div>   
            )}
          </div>
        )}
        {currentTab === "Вывести" && (
          <div className="items-center">
          <TonCard
            ton_amount={parseFloat(tonBalance.toFixed(2))}
            usdt_amount={parseFloat(usdtBalance.toFixed(2))}
          />
          <div className="flex bg-cover bg-center bg-no-repeat bg-dark-blue h-full p-4 rounded-lg shadow-md mb-3 w-full mt-3 items-center">
            <div>
              <p className="text-white">Укажите сумму вывода</p>
                <input
                  type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-gray-600 rounded-[5px] w-1/2 h-5 mt-1 text-white"
                  />
                  <p className="text-white mt-2">Выберите криптовалюту</p>
                  <div className="flex mt-1">
                      <button
                      className={`rounded-[5px] p-1 px-2 flex justify-center items-center ${
                          selectedCurrency === "ton"
                          ? "bg-blue-600"
                          : "bg-gray-600"
                      }`}
                      onClick={() => setSelectedCurrency("ton")}
                      >
                          <div>
                              <img src="/images/ton.png" />
                          </div>
                          <p className="text-white text-lg">TON</p>
                      </button>
                      <button
                          className={`rounded-[5px] p-1 px-2 flex justify-center items-center ml-1 ${
                            selectedCurrency === "usdt"
                              ? "bg-blue-600"
                              : "bg-gray-600"
                          }`}
                          onClick={() => setSelectedCurrency("usdt")}
                      >
                          <div>
                            <img src="/images/usdt.png" />
                          </div>
                          <p className="text-white text-lg">USDT</p>
                      </button>
                  </div>
                  <p className="text-gray-400 mt-3">Минимальная сумма вывода составляет 5 USDT или 10 TON. Удерживается комиссия блокчейна и комиссия платформы 2%.</p>
              </div>
          </div>
          <div className="flex bg-cover bg-center bg-no-repeat bg-dark-blue h-full p-4 flex justify-center rounded-lg shadow-md mb-3 w-full mt-3 items-center">
              <div>
                <img src="/images/wallet.png" />
              </div>
              <p className="text-white text-center items-center ml-2">
                <span className="text-gray-400 text-[12px]">UQD_JRfUhS9heihr7m2uKMqT739qa4ySDpRHcTvqjkCUU_Zm</span>
              </p>
          </div>
          <button className="bg-blue-600 text-white text-lg w-full h-30 p-5 rounded-lg" onClick={handleWithdraw}>
              Запросить вывод
          </button>
      </div>
        )}
        {currentTab === "История" && <HistorySection />}
        {currentTab === "Статистика" && <StatsSection />}
      </div>
    </main>
  );
};

export default Agent;
