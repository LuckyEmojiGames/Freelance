import React, { useContext, useState } from 'react';
import { TaskContext } from '../../components/contexts/TaskContext';

const Page2 = ({ setCurrentPage }: { setCurrentPage: React.Dispatch<React.SetStateAction<number>> }) => {
  const { taskData, updateTaskData } = useContext(TaskContext)!;
  const [price, setPrice] = useState<number | undefined>(taskData.price || 0);
  const [currency, setCurrency] = useState<'TON' | 'USDT'>('TON');

  return (
    <main className="relative pt-24 pb-24 w-full bg-cover bg-center bg-no-repeat min-h-full bg-[url('/images/background/background.png')] bg-cover bg-[#5200FF64]">
      <nav className="fixed pt-5 pb-5 w-full bg-cover bg-center bg-no-repeat top-0 left-0 right-0 bg-[url('/images/background/header_bg.png')] rounded-b-3xl">
        <div className="flex justify-center">
          <h1 className="text-white font-bold text-2xl">Стоимость</h1>
        </div>
        <div className="flex justify-center">
            <p className="text-gray-600 text-xl ">Вернуться назад</p>
        </div>
      </nav>
      <div className="px-4 mt-10">
        <div className="bg-dark-blue mt-3 p-3 rounded-lg">
          <p className="text-[20px] text-white font-bold">Как назначить стоимость?</p>
          <p className="text-sm text-[#FFFFFF80] mt-3">Установите цену, которую вы готовы заплатить за выполнение задания.</p>
        </div>
        <p className='text-sm text-[#FFFFFF80] mt-2'>Ваш баланс 0 TON, 0 USDT.</p>
        <input 
            type='number'
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))} 
            placeholder='Введите цену' 
            className='w-full text-white bg-[#0B1B35] mt-1 h-8 rounded-lg'
        />
        <p className='text-sm text-white mt-3'>Выберите криптовалюту</p>
        <div className="flex mt-1">
            <button
                className={`rounded-[5px] p-1 px-2 flex justify-center items-center ${
                    currency === "TON"
                    ? "bg-blue-600"
                    : "bg-gray-600"
                }`}
                onClick={() => setCurrency("TON")}
            >
                <div>
                    <img src="/images/ton.png" />
                </div>
                <p className="text-white text-lg">TON</p>
            </button>
            <button
                className={`rounded-[5px] p-1 px-2 flex justify-center items-center ml-1 ${
                    currency === "USDT"
                        ? "bg-blue-600"
                        : "bg-gray-600"
                    }`}
                    onClick={() => setCurrency("USDT")}
            >
                <div>
                    <img src="/images/usdt.png" />
                </div>
                <p className="text-white text-lg">USDT</p>
            </button>
        </div>
        <div className='flex mt-60'>
            <button 
                className="w-1/2 rounded-lg bg-white m-1 text-white h-12 flex justify-center items-center"
                 onClick={() => {
                  setCurrentPage(1); // Navigate to Page 1
                }}>
              <p className='text-blue-600'>Назад</p>
            </button>
            <button 
                className="w-1/2 rounded-lg bg-blue-600 m-1 text-white h-12"
                 onClick={() => {
                  updateTaskData({ price, currency });
                  setCurrentPage(3); // Navigate to Page 3
                }}>
              <p className='text-white'>Продолжить</p>
            </button>
        </div>
      </div>
    </main>
  );
};

export default Page2;
