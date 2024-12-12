import React from "react";

const StatsSection: React.FC = () => (
    <div className="items-center mt-5">
    <div className="bg-[#0B1B35] rounded-lg w-full p-3 h-10 flex justify-between items-center">
      <p className="text-white">Статистика</p>
      <div className="flex items-center">
        <p className="text-bg-gray-400">за 7 дней</p>
        <div className="ml-2">
          <img src="/images/right_arrow.png" />
        </div>
      </div>
    </div>
    <div className="bg-cover bg-center bg-no-repeat bg-[#0B1B35] h-full p-4 rounded-lg shadow-md mb-3 w-full mt-3 items-center">
      <div className="flex items-center justify-between w-full">
        <p className="text-gray-400">Пополнено</p>
        <p className="text-gray-400">1990</p>
      </div>
      <img src="/images/white_line.png" className="w-full mt-3 mb-3"/>
      <div className="flex items-center justify-between w-full">
        <p className="text-gray-400">Выведено</p>
        <p className="text-gray-400">0</p>
      </div>
      <img src="/images/white_line.png" className="w-full mt-3 mb-3"/>
      <div className="flex items-center justify-between w-full">
        <p className="text-gray-400">Заработано</p>
        <p className="text-gray-400">0</p>
      </div>
      <img src="/images/white_line.png" className="w-full mt-3 mb-3"/>
      <div className="flex items-center justify-between w-full">
        <p className="text-gray-400">Оплачено</p>
        <p className="text-gray-400">1980</p>
      </div>
    </div>
  </div>
);

export default StatsSection;
