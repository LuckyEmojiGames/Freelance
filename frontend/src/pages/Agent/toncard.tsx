import React from "react";

interface TaskCardProps {
  ton_amount:number;
  usdt_amount:number;
}

const TaskCard: React.FC<TaskCardProps> = ({ ton_amount, usdt_amount }) => {
  return (
    <div className="bg-cover bg-center bg-no-repeat bg-[#0B1B35] h-full p-4 rounded-lg shadow-md mb-3 w-full mt-5">
      <p className="text-grey">Мой баланс</p>
      <div className="flex mt-1">
        <img className="pr-3" src="/images/ton.png" />
        <p className="text-[30px] text-white">{ton_amount} TON</p>
      </div>
      <div className="flex mt-3">
        <img className="pr-3" src="/images/usdt.png" />
        <p className="text-[30px] text-white">{usdt_amount} USDT</p>
      </div>
    </div>
  );
};

export default TaskCard;
