import React from "react";

const HistorySection: React.FC = () => (
  <div className="bg-cover bg-center bg-no-repeat bg-[#0B1B35] h-full p-4 rounded-lg shadow-md mb-3 w-full mt-3 items-center">
    <div className="flex items-center justify-between w-full">
      <div>
        <p className="text-[#ff0000c0]">-990</p>
        <p className="text-gray-400">Оплата подписки</p>
      </div>
        <div>
          <p className="text-white">Сегодня</p>
          <p className="text-gray-400">23:43</p>
        </div>
    </div>
    <img src="/images/white_line.png" className="w-full mt-1 mb-3"/>
    <div className="flex items-center justify-between w-full">
      <div>
        <p className="text-[#3cff00c0]">+990</p>
        <p className="text-gray-400">Пополнение счёта</p>
      </div>
      <div>
        <p className="text-white">Сегодня</p>
        <p className="text-gray-400">23:43</p>
      </div>
    </div>
  </div>
);

export default HistorySection;
