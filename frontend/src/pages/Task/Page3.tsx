import React, { useContext, useState } from 'react';
import { TaskContext } from '../../components/contexts/TaskContext';

const Page3 = ({ setCurrentPage }: { setCurrentPage: React.Dispatch<React.SetStateAction<number>> }) => {
  const { taskData, updateTaskData } = useContext(TaskContext)!;
  const [description, setDescription] = useState(taskData.description || '');

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      updateTaskData({ file: event.target.files[0] });
    }
  };

  return (
    <main className="relative pt-24 pb-24 w-full bg-cover bg-center bg-no-repeat min-h-full bg-[url('/images/background/background.png')] bg-cover bg-[#5200FF64]">
      <nav className="fixed pt-5 pb-5 w-full bg-cover bg-center bg-no-repeat top-0 left-0 right-0 bg-[url('/images/background/header_bg.png')] rounded-b-3xl">
        <div className="flex justify-center">
          <h1 className="text-white font-bold text-2xl">Создание задания</h1>
        </div>
        <div className="flex justify-center">
            <p className="text-gray-600 text-xl ">Вернуться назад</p>
        </div>
      </nav>

      <div className="px-4 mt-10">

        {/* Description Input */}
        <textarea
          placeholder="Опишите задание"
          className="w-full text-white h-60 bg-[#0B1B35] mt-3 p-3 rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* File Attachment */}
        <div>
          <label
            htmlFor="fileInput"
            className="w-full flex justify-center rounded-lg bg-blue-600 text-white h-12 mt-3 items-center cursor-pointer"
          >
            <img className="px-3" src="/images/index.png" alt="Attach file" />
            Прикрепить файл
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileAttach}
          />
        </div>

        {/* Display dynamic price and deadline */}
        <div className="bg-[#0B1B35] mt-3 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-white font-bold">Стоимость</p>
            <p className="text-gray-300">
              {taskData.price || "0"} {taskData.currency || ""}
            </p>
          </div>
          <img src="/images/white_line.png" className="w-full mt-1"/>
          <div className="flex items-center justify-between mt-2">
            <p className="text-white font-bold">Выполнить до</p>
            <div className='flex justify-between items-center'>
                <div className='flex justify-center items-center'>
                    <p className="text-gray-300">{taskData.deadline || "Не указано"}</p>
                </div>
                <div className='flex justify-center items-center ml-1'>
                    <img src='/images/add.png' />
                </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex mt-8">
          <button
            className="w-1/2 rounded-lg bg-white m-1 text-blue-600 h-12"
            onClick={() => setCurrentPage(2)} // Navigate back to Page 2
          >
            Назад
          </button>
          <button
            className="w-1/2 rounded-lg bg-blue-600 m-1 text-white h-12"
            onClick={() => {
              updateTaskData({ description });
              setCurrentPage(4); // Navigate to Page 4
            }}
          >
            Продолжить
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page3;
