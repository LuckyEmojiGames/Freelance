import { useState, useEffect } from "react";
import axios from "axios";
import Cad from "./cad";
import { useNavigate } from "react-router-dom";
import OngoingTask from "./ongoing";

const Home = () => {
  const [currentTab, setCurrentTab] = useState("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [tasks, setTasks] = useState<any[]>([]); // Ensure tasks is always an array
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [isZeroJobs, setIsZeroJobs] = useState(false);

  useEffect(() => {
    setCurrentTab(currentTab);

    // Fetch tasks only when the active tab is "New" (index 0)
    if (activeIndex === 0) {
      fetchTasks();
    }
  }, [activeIndex]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const res = await axios.get(`http://localhost:4000/api/v1/freelancer/getAllTasks`);
      console.log("Fetched data:", res.data.jobs);

      if (res.data.jobs.length === 0) {
        setIsZeroJobs(true);
      } else {
        setIsZeroJobs(false);
      }
      setTasks(res.data.jobs);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (index: number) => {
    setActiveIndex(index);
    setCurrentTab(index === 0 ? "" : index === 1 ? "" : "");
  };

  let navigate = useNavigate();
  const handleAddClick = () => {
    let path = "/task";
    navigate(path);
  };

  const handleTaskClick = (task: any) => {
    navigate("/abouttask", { state: { task } });
  };

  return (
    <main className="relative pt-24 pb-24 w-full bg-cover bg-center bg-no-repeat min-h-full bg-[url('/images/background/background.png')] bg-cover bg-[#5200FF64]">
      <nav className="fixed pt-5 pb-5 w-full bg-cover bg-center bg-no-repeat top-0 left-0 right-0 bg-[url('/images/background/header_bg.png')] rounded-b-3xl">
        {/* Tab Buttons */}
        <div className="flex justify-center items-center mt-3">
          <div className="ml-[30px]">
            <img src="/images/alert.png" />
          </div>
          <div className="flex justify-center h-10 bg-[#1a1f36] rounded-[10px] overflow-hidden w-fit mx-auto border-dark-blue border-[1px]">
            <button
              className={`px-5 py-2 text-white text-[13px] transition-all duration-300 ${
                activeIndex === 0
                  ? "bg-[#314e89] rounded-[10px]"
                  : "hover:bg-[rgba(255,255,255,0.1)]"
              }`}
              onClick={() => handleButtonClick(0)}
            >
              Новые
            </button>
            <button
              className={`px-5 py-2 text-white text-sm transition-all duration-300 ${
                activeIndex === 1
                  ? "bg-[#314e89] rounded-[10px]"
                  : "hover:bg-[rgba(255,255,255,0.1)]"
              }`}
              onClick={() => handleButtonClick(1)}
            >
              В процессе
            </button>
            <button
              className={`px-5 py-2 text-white text-sm transition-all duration-300 ${
                activeIndex === 2
                  ? "bg-[#314e89] rounded-[10px]"
                  : "hover:bg-[rgba(255,255,255,0.1)]"
              }`}
              onClick={() => handleButtonClick(2)}
            >
              История
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-2">
          <h1 className="text-white font-bold text-2xl">Задания</h1>
        </div>
      </nav>

      {/* Tab Content */}
      <div className="flex flex-col px-4">
        <div className="text-sm text-[#ffffffc0] font-semibold mt-10">
          {activeIndex === 0 && (
            <div className="items-center">
              {loading ? (
                <p className="text-center text-white">Loading...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : isZeroJobs ? (
                <p className="text-center text-white">No tasks available</p>
              ) : (
                tasks.map((task, index) => (
                  <div key={index} onClick={() => handleTaskClick(task)}>
                    <Cad
                      key={index}
                      title={task.description || "No Title"}
                      description={task.description || "No Description"}
                      reward={task.price || 0}
                      timeLeft={task.deadline || "None"} // Adjust to show meaningful values
                    />
                  </div>
                ))
              )}
            </div>
          )}
          {activeIndex === 1 && (
            <div className="items-center">
                <OngoingTask
                  imageSrc="/images/avatars/avatar1.png"
                  title="Перевести на английский договор"
                  reward={1500}
                  author="Илья Краснов"
                />
                <OngoingTask
                  imageSrc="/images/avatars/avatar2.png"
                  title="Разработка дизайна логоти..."
                  reward={1000}
                  author="Андрей Васатов"
                />
                <OngoingTask
                  imageSrc="/images/avatars/avatar3.png"
                  title="Создание сайта-визитки"
                  reward={10000000}
                  author="Вася Центр"
                />
                <OngoingTask
                  imageSrc="/images/avatars/avatar4.png"
                  title="Разработка дизайна логоти..."
                  reward={1000}
                  author="Скубиду Сафронов"
                />
              </div>
          )}
          {activeIndex === 2 && (
            <div className="items-center">
              <div>
                <OngoingTask
                  imageSrc="/images/avatars/avatar1.png"
                  title="Перевести на английский договор"
                  reward={1500}
                  author="Илья Краснов"
                />
                <OngoingTask
                  imageSrc="/images/avatars/avatar2.png"
                  title="Разработка дизайна логоти..."
                  reward={1000}
                  author="Андрей Васатов"
                />
                <OngoingTask
                  imageSrc="/images/avatars/avatar3.png"
                  title="Создание сайта-визитки"
                  reward={10000000}
                  author="Вася Центр"
                />
                <OngoingTask
                  imageSrc="/images/avatars/avatar4.png"
                  title="Разработка дизайна логоти..."
                  reward={1000}
                  author="Скубиду Сафронов"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Absolute "+" Button */}
      <button
        onClick={handleAddClick}
        className="fixed bottom-28 right-4 bg-blue-600 text-white rounded-lg w-10 h-10 flex items-center justify-center shadow-lg hover:bg-blue transition duration-100"
      >
        <p className="text-white zoom-[1.5]">+</p>
      </button>
    </main>
  );
};

export default Home;
