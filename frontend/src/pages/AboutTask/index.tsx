import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const About = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task; // Retrieve the task data
  
  if (!task) {
    return <p className="text-white text-center">Task details not found</p>;
  }

  const handleClientClick = () => {
    navigate("/chat", { state: { clientId: task.clientId, freelancerId: task.freelancerId } });
  };
  return (
    <main className="relative pt-24 pb-24 w-full bg-cover bg-center bg-no-repeat min-h-full bg-[url('/images/background/background.png')] bg-cover bg-[#5200FF64]">
      <nav className="fixed pt-8 pb-8 w-full bg-cover bg-center bg-no-repeat top-0 left-0 right-0 bg-[url('/images/background/header_bg.png')] rounded-b-3xl">
        <div className="flex justify-center">
          <h1 className="text-white font-bold text-[24px]">О задании</h1>
        </div>
        <div className="flex justify-center">
          <p className="text-gray-600 text-[18px]">Вернуться назад</p>
        </div>
      </nav>
      <div className="px-4 mt-10">
        <div className="bg-[#FFFFFF1A] mt-16 p-3 rounded-lg">
          <div className="flex justify-center items-center">
            <div>
              <img src="/images/tab/money.png" />
            </div>
            <div className="ml-3">
              <p className="text-white">{task.price || 0}</p>
              <p className="text-[#FFFFFF80]">С учетом комиссии вы </p>
              <p className="text-[#FFFFFF80]">получите {task.price * 0.9 || 0}</p>
            </div>
            <div className="ml-8">
              <img src="/images/timer.png" />
            </div>
            <p className="ml-3 text-white">{task.deadline || "Не указано"}</p>
          </div>
          <img className="w-full" src="/images/white_line.png" />
          <div className="items-center mt-3">
            <p className="text-white text-[14px] font-bold">{task.description || "No Title"}</p>
            <p className="text-[#FFFFFF80] text-[12px]">
              {task.details || "No additional details provided."}
            </p>
          </div>
          <img className="w-full mt-3" src="/images/white_line.png" />
          <div className="flex justify-between mt-3">
            <p className="text-[14px] text-white font-bold">Город</p>
            <p className="text-[12px] text-[#FFFFFF80]">{task.city || "N/A"}</p>
          </div>
          <img className="w-full mt-3" src="/images/white_line.png" />
          <div className="flex justify-between mt-3">
            <p className="text-[14px] text-white font-bold">Статус</p>
            <p className="text-[12px] text-[#FFFFFF80]">{task.status || "N/A"}</p>
          </div>
        </div>
        <div className="flex justify-center mt-3">
          <button className="rounded-lg bg-[#0B1B35] font-bold p-3 text-white text-[15px] w-1/2 mr-2">
            <p>О заказчике</p>
          </button>
          <button className="rounded-lg bg-[#9B2D2D] font-bold p-3 text-white text-[15px] w-1/2">
            <p>Пожаловаться</p>
          </button>
        </div>
        <div className="flex justify-center mt-16">
          <button className="rounded-lg bg-white p-3 h-16 text-[#0066FF] text-[18px] font-bold w-1/2 mr-2">
            <p>Отказаться</p>
          </button>
          <button className="rounded-lg bg-[#0066FF] p-3 text-white text-[18px] font-bold w-1/2">
            <p>Согласиться</p>
          </button>
        </div>
      </div>
    </main>
  );
};

export default About;
