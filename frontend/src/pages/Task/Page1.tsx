import React, { useContext, useState } from 'react';
import { TaskContext } from '../../components/contexts/TaskContext';

const Page1 = ({ setCurrentPage }: { setCurrentPage: React.Dispatch<React.SetStateAction<number>> }) => {
  const { updateTaskData } = useContext(TaskContext)!;
  const [description, setDescription] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setAttachedFile(file); // Store the file in state
      updateTaskData({ file }); // Update the task data context with the file
    }
  };

  return (
    <main className="relative pt-24 pb-24 w-full bg-cover bg-center bg-no-repeat min-h-full bg-[url('/images/background/background.png')] bg-cover bg-[#5200FF64]">
      <nav className="fixed pt-5 pb-5 w-full bg-cover bg-center bg-no-repeat top-0 left-0 right-0 bg-[url('/images/background/header_bg.png')] rounded-b-3xl">
        <div className="flex justify-center">
          <h1 className="text-white font-bold text-2xl">Описание</h1>
        </div>
        <div className="flex justify-center">
          <p className="text-gray-600 text-xl">Отмена</p>
        </div>
      </nav>
      <div className="px-4 mt-10">
        <div className="bg-dark-blue mt-3 p-3 rounded-lg">
          <p className="text-[20px] text-white font-bold">Что указывать в задании?</p>
          <p className="text-sm text-white mt-3">
            Саму суть задания, чем понятнее и подробнее описание, тем больше шансов на успех.
          </p>
        </div>
        <textarea
          placeholder="Подробно опишите задание"
          className="w-full text-white h-60 bg-[#0B1B35] mt-3 p-3 rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label
            htmlFor="fileInput"
            className="w-full flex justify-center rounded-lg bg-blue-600 text-white h-12 mt-3 items-center"
          >
            <img className="px-3" src="/images/index.png" />
            Прикрепить файл
          </label>
          <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileAttach} />
          {attachedFile && (
            <p className="text-sm text-white mt-2">
              Прикреплено: <strong>{attachedFile.name}</strong>
            </p>
          )}
          <button
            className="w-full rounded-lg bg-blue-600 text-white h-12 mt-1"
            onClick={() => {
              updateTaskData({ description, file: attachedFile }); // Include file in task data
              setCurrentPage(2); // Navigate to Page 2
            }}
          >
            Продолжить
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page1;
