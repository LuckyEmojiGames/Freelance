import React from "react";

interface TaskCardProps {
  ton_amount: number;
  usdt_amount: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ ton_amount, usdt_amount }) => {
  return (
    <div className="bg-cover bg-center bg-no-repeat bg-[#0B1B35] h-full p-4 rounded-lg shadow-md mb-3 w-full mt-5">
      <p className="text-white">Мой баланс</p>
      <div className="flex mt-1 items-center">
        <img className="pr-2 h-6" src="/images/ton.png" alt="TON Icon" />
        <p className="text-[22px] text-white">{ton_amount.toFixed(2)} TON</p>
      </div>
      <div className="flex mt-3 items-center">
        <img className="pr-2 h-6" src="/images/usdt.png" alt="USDT Icon" />
        <p className="text-[22px] text-white">{usdt_amount.toFixed(2)} USDT</p>
      </div>
    </div>
  );
};

export default TaskCard;
