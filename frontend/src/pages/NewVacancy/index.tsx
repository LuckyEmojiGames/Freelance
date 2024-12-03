import React, { useState } from "react";
import axios from "axios";

const VacancyOpen: React.FC = () => {

    const [jobTitle, setJobTitle] = useState<string>("");
    const [Resp, setResp] = useState<string>("");
    const [Email, SetEmail] = useState<string>("");
    const [Telegram, SetTelegram] = useState<string>("");
    const [Phone, SetPhone] = useState<string>("");
    const [Info, SetInfo] = useState<string>("");
    const [Requirement, SetRequirement] = useState<string>("");
    const [Condition, SetCondition] = useState<string>("");
    const [Note, SetNote] = useState<string>("");

    const data = [
        { label: "Other", value: "1"},
        { label: "Sales", value: "2"},
        { label: "Marketing", value: "3"},
        { label: "Design", value: "4"},
        { label: "Development", value: "5"},
        { label: "Management", value: "6"},
        { label: "Content", value: "7"},
        { label: "Analytics", value: "8"},
    ];

    const postProject = async () => {
        const projData = {
          jobTitle,
          Resp,
          Email,
          Telegram,
          Phone,
          Info,
          Requirement,
          Condition,
          Note
        };
    
        try {
          const response = await axios.post(`http://localhost:4000/api/v1/client/postjob`, projData);
          console.log("Project posted:", response.data);
          alert("Project posted successfully!");
        } catch (error) {
          console.error("Error posting project:", error);
          alert("Failed to post project. Check console for details.");
        }
      };
    
  return (
    <main className="relative pt-24 pb-24 w-full bg-cover bg-center bg-no-repeat min-h-full bg-[url('/images/background/background.png')] bg-cover bg-[#5200FF64]">
      <nav className="fixed pt-5 pb-5 w-full bg-cover bg-center bg-no-repeat top-0 left-0 right-0 bg-[url('/images/background/header_bg.png')] rounded-b-3xl">
        <div className="flex justify-center">
          <h1 className="text-white font-bold text-2xl">Новая вакансия</h1>
        </div>
        <div className="flex justify-center">
            <p className="text-gray-600 text-xl ">Отмена</p>
        </div>
      </nav>
      <div className="flex-col px-4">
        <div className="text-sm flex justify-between text-[#ffffffc0] bg-dark-blue rounded-lg p-2 font-semibold mt-10 ">
            <p className="text-white text-sm">Город</p>
            <p className="text-gray text-sm">Удалённая работа</p>
        </div>
        <div className="flex justify-between mt-10">
            <div className="w-1/2 bg-dark-blue rounded-lg pt-2 m-1">
                <div className="flex justify-center">
                    <input style={{zoom:2.5}} type="checkbox" />
                </div>
                <div className="flex justify-center">
                    <p className="text-white">Другое</p>
                </div>
            </div>
            <div className="w-1/2 bg-dark-blue rounded-lg pt-2 m-1">
                <div className="flex justify-center">
                    <input style={{zoom:2.5}} type="checkbox" />
                </div>
                <div className="flex justify-center">
                    <p className="text-white">Продажи</p>
                </div>
            </div>
        </div>
        <div className="flex justify-between mt-1">
            <div className="w-1/2 bg-dark-blue rounded-lg pt-2 m-1">
                <div className="flex justify-center">
                    <input style={{zoom:2.5}} type="checkbox" />
                </div>
                <div className="flex justify-center">
                    <p className="text-white">Маркетинг</p>
                </div>
            </div>
            <div className="w-1/2 bg-dark-blue rounded-lg pt-2 m-1">
                <div className="flex justify-center">
                    <input style={{zoom:2.5}} type="checkbox" />
                </div>
                <div className="flex justify-center">
                    <p className="text-white">Дизайн</p>
                </div>
            </div>
        </div>
        <div className="flex justify-between mt-1">
            <div className="w-1/2 bg-dark-blue rounded-lg pt-2 m-1">
                <div className="flex justify-center">
                    <input style={{zoom:2.5}} type="checkbox" />
                </div>
                <div className="flex justify-center">
                    <p className="text-white">Разработка</p>
                </div>
            </div>
            <div className="w-1/2 bg-dark-blue rounded-lg pt-2 m-1">
                <div className="flex justify-center">
                    <input style={{zoom:2.5}} type="checkbox" />
                </div>
                <div className="flex justify-center">
                    <p className="text-white">Менеджмент</p>
                </div>
            </div>
        </div>
        <div className="flex justify-between mt-1">
            <div className="w-1/2 bg-dark-blue rounded-lg pt-2 m-1">
                <div className="flex justify-center">
                    <input style={{zoom:2.5}} type="checkbox" />
                </div>
                <div className="flex justify-center">
                    <p className="text-white">Контент</p>
                </div>
            </div>
            <div className="w-1/2 bg-dark-blue rounded-lg pt-2 m-1">
                <div className="flex justify-center">
                    <input style={{zoom:2.5}} type="checkbox" />
                </div>
                <div className="flex justify-center">
                    <p className="text-white">Аналитика</p>
                </div>
            </div>
        </div>
        <div className="mt-5">
            <p className="text-white text-sm">Осталось 50 знаков</p>
            <p className="text-gray-500 text-sm pt-1">Укажите в названии вакансии должность, для которой открыта вакансия, или кратко сформулируйте суть предлагаемой работы.</p>
            <input className="text-sm w-full h-20 flex justify-between text-[#ffffffc0] bg-dark-blue rounded-lg p-2 font-semibold mt-1" placeholder="Введите название" type="textarea">{jobTitle}</input>
        </div>
        <div className="mt-5">
            <p className="text-gray-500 text-sm pt-1">Пожалуйста, опишите основные задачи сотрудника.</p>
            <input className="text-sm w-full h-20 flex justify-between text-[#ffffffc0] bg-dark-blue rounded-lg p-2 font-semibold mt-1" placeholder="Опишите основные обязанности" type="textarea">{Resp}</input>
        </div>
        <div className="mt-5">
            <p className="text-gray-500 text-sm pt-1">Укажите хотя бы один контакт, по которому соискатели смогут с вами связаться: телефон или Telegram</p>
            <input className="text-sm w-full h-10 flex justify-between text-[#ffffffc0] bg-dark-blue rounded-lg p-2 font-semibold mt-2" placeholder="Email" type="text">{Email}</input>
            <input className="text-sm w-full h-10 flex justify-between text-[#ffffffc0] bg-dark-blue rounded-lg p-2 font-semibold mt-2" placeholder="Telegram" type="text">{Telegram}</input>
            <input className="text-sm w-full h-10 flex justify-between text-[#ffffffc0] bg-dark-blue rounded-lg p-2 font-semibold mt-2" placeholder="Номер телефона" type="text">{Phone}</input>
        </div>
        <div className="mt-5">
            <p className="text-gray-500 text-sm pt-1">Эти данные не обязательны к заполнению, но подробно описанная вакансия привлекает внимание большего количества соискателей</p>
            <p className="text-gray-500 text-sm pt-1">Описание компании, рода деятельности</p>                                                                                                                                                                                                                                                                                                                                                                                                                                                             
            <input className="text-sm w-full h-10 flex justify-between text-[#ffffffc0] bg-dark-blue rounded-lg p-2 font-semibold mt-1" placeholder="Информация о работодателе" type="text">{Info}</input>
            <p className="text-gray-500 text-sm pt-1">Основные требования к кандидату: необходимые навыки, умения, качества</p>
            <input className="text-sm w-full h-10 flex justify-between text-[#ffffffc0] bg-dark-blue rounded-lg p-2 font-semibold mt-1" placeholder="Требования к кандидату" type="text">{Requirement}</input>
            <p className="text-gray-500 text-sm pt-1">Условия работы: заработная плата, режим работы</p>
            <input className="text-sm w-full h-10 flex justify-between text-[#ffffffc0] bg-dark-blue rounded-lg p-2 font-semibold mt-1" placeholder="Условия работы: заработная плата, режим работы" type="text"></input>
            <p className="text-gray-500 text-sm pt-1">Дополнительные сведения о вакансии</p>
            <input className="text-sm w-full h-10 flex justify-between text-[#ffffffc0] bg-dark-blue rounded-lg p-2 font-semibold mt-1" placeholder="Примечания" type="text"></input>
        </div>
      </div>
    </main>

  );
};

export default VacancyOpen;