import React, { useContext, useState } from 'react';
import { TaskContext } from '../../components/contexts/TaskContext';

const Page4 = ({ setCurrentPage }: { setCurrentPage: React.Dispatch<React.SetStateAction<number>> }) => {
    const { taskData, updateTaskData } = useContext(TaskContext)!;
    const [selectedEnhancement, setSelectedEnhancement] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const enhancements = [
        {
            id: 'pinTop',
            title: 'Закрепить задание сверху',
            description: ['Ваше задание увидят на 80% больше', 'исполнителей.'],
            cost: 149,
            image: '/images/pin_top.png',
        },
        {
            id: 'topPerformers',
            title: 'Только топовые исполнители',
            description: ['Эффективно, чтобы быстро найти лучших', 'исполнителей.'],
            cost: 99,
            image: '/images/top.png',
        },
        {
            id: 'beginners',
            title: 'Только новичкам',
            description: ['Новички быстрее соглашаются на', 'задание с небольшим бюджетом.'],
            cost: 49,
            image: '/images/beginner.png',
        },
    ];

    const handleEnhancementSelect = (enhancementId: string) => {
        setSelectedEnhancement(enhancementId === selectedEnhancement ? null : enhancementId);
    };

    const handleSubmit = async () => {
        setIsModalOpen(true); // Open the modal
    };

    const confirmSubmission = async () => {
        setIsModalOpen(false); // Close the modal

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...taskData, enhancement: selectedEnhancement }),
            });
            if (response.ok) {
                alert('Task submitted successfully!');
                setCurrentPage(1); // Reset to Page 1
            } else {
                alert('Failed to submit task');
            }
        } catch (error) {
            console.error('Error submitting task:', error);
            alert('An error occurred');
        }
    };

    return (
        <main className="relative pt-24 pb-24 w-full bg-cover bg-center bg-no-repeat min-h-full bg-[url('/images/background/background.png')] bg-cover bg-[#5200FF64]">
            <nav className="fixed pt-5 pb-5 w-full bg-cover bg-center bg-no-repeat top-0 left-0 right-0 bg-[url('/images/background/header_bg.png')] rounded-b-3xl">
                <div className="flex justify-center">
                    <h1 className="text-white font-bold text-2xl">Улучшить задание</h1>
                </div>
                <div className="flex justify-center">
                    <p className="text-gray-600 text-xl">Вернуться назад</p>
                </div>
            </nav>

            <div className="px-4 mt-10">
                {enhancements.map((enhancement) => (
                    <div
                        key={enhancement.id}
                        className={`bg-[#0066FF] mt-3 p-3 rounded-lg flex justify-center cursor-pointer transition-all duration-200 ${
                            selectedEnhancement === enhancement.id ? 'ring-4 ring-white' : ''
                        }`}
                        onClick={() => handleEnhancementSelect(enhancement.id)}
                    >
                        <div className="w-1/6 ml-1">
                            <img src={enhancement.image} alt={enhancement.title} />
                        </div>
                        <div className='w-5/6'>
                            <p className="text-white font-bold">{enhancement.title}</p>
                            {enhancement.description.map((line, index) => (
                                <p key={index} className="text-[#FFFFFF80]">
                                    {line}
                                </p>
                            ))}
                            <p className="text-white font-bold">Стоимость: {enhancement.cost}</p>
                        </div>
                    </div>
                ))}

                {/* Navigation Buttons */}
                <div className="flex mt-8">
                    <button
                        className="w-1/2 rounded-lg bg-white m-1 text-blue-600 h-12"
                        onClick={() => setCurrentPage(3)} // Navigate back to Page 3
                    >
                        Назад
                    </button>
                    <button
                        className="w-1/2 rounded-lg bg-blue-600 m-1 text-white h-12"
                        onClick={handleSubmit} // Open modal
                        disabled={!selectedEnhancement} // Disable if no selection
                    >
                        Продолжить
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-1/3">
                        <h2 className="text-lg font-bold mb-4">Создание задания не завершено</h2>
                        <p className="mb-4">При выходе из этой формы все данные будут потеряны. Покинуть форму без сохранения данных?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                                onClick={confirmSubmission}
                            >
                                Ок
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Page4;
