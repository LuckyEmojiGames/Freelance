import React, { useContext, useState, useEffect } from 'react';
import { TaskContext } from '../../components/contexts/TaskContext';

const Page4 = ({ setCurrentPage }: { setCurrentPage: React.Dispatch<React.SetStateAction<number>> }) => {
    const { taskData } = useContext(TaskContext)!;
    const [selectedEnhancement, setSelectedEnhancement] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [telegramUser, setTelegramUser] = useState<any | null>(null); // Telegram user info state

    // Enhancements data
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

    // Telegram WebApp Initialization
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            try {
                const user = tg.initDataUnsafe?.user;
                if (user) {
                    setTelegramUser(user);
                } else {
                    alert('Telegram user information is missing. Please open this app inside Telegram.');
                }
            } catch (error) {
                console.error('Error initializing Telegram WebApp:', error);
            }
        } else {
            alert('Telegram WebApp is not available. Make sure to open this app inside Telegram.');
        }
    }, []);

    const handleEnhancementSelect = (enhancementId: string) => {
        setSelectedEnhancement(enhancementId === selectedEnhancement ? null : enhancementId);
    };

    const handleSubmit = async () => {
        if (!telegramUser) {
            alert('Please open the app through Telegram to proceed.');
            return;
        }
        setIsModalOpen(true); // Open the modal
    };

    const confirmSubmission = async () => {
        setIsModalOpen(false); // Close the modal

        try {
            if (!telegramUser) {
                alert('Telegram user info is required to submit the task.');
                return;
            }

            const requestData = {
                ...taskData,
                telegramUser: {
                    id: telegramUser.id,
                    first_name: telegramUser.first_name,
                    last_name: telegramUser.last_name || '',
                    username: telegramUser.username || '',
                    language_code: telegramUser.language_code || '',
                },
            };

            const response = await fetch('http://localhost:4000/api/v1/client/task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
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
                        className={`bg-[#0066FF] mt-3 p-3 rounded-lg flex justify-between items-end cursor-pointer transition-all duration-200 ${
                            selectedEnhancement === enhancement.id ? 'ring-4 ring-white' : ''
                        }`}
                        onClick={() => handleEnhancementSelect(enhancement.id)}
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-12 mr-4">
                                <img src={enhancement.image} alt={enhancement.title} />
                            </div>
                            <div>
                                <p className="text-white font-bold">{enhancement.title}</p>
                                {enhancement.description.map((line, index) => (
                                    <p key={index} className="text-[#FFFFFF80] text-sm">
                                        {line}
                                    </p>
                                ))}
                                <p className="text-white font-bold mt-1">Стоимость: {enhancement.cost}</p>
                            </div>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="enhancement"
                                checked={selectedEnhancement === enhancement.id}
                                onChange={() => handleEnhancementSelect(enhancement.id)}
                                className="w-6 h-6"
                            />
                        </div>
                    </div>
                ))}

                {/* Navigation Buttons */}
                <div className="flex mt-8">
                    <button
                        className="w-1/2 rounded-lg bg-white m-1 text-blue-600 h-12"
                        onClick={() => setCurrentPage(3)}
                    >
                        Назад
                    </button>
                    <button
                        className="w-1/2 rounded-lg bg-blue-600 m-1 text-white h-12"
                        onClick={handleSubmit}
                        disabled={!selectedEnhancement}
                    >
                        Продолжить
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-[#FFFFFFE5] rounded-lg p-6 w-10/12 md:w-1/3">
                        <h2 className="text-lg font-bold mb-2 text-center">Создание задания не завершено</h2>
                        <p className="text-center">При выходе из этой формы все данные будут потеряны.</p>
                        <div className="mt-3 flex justify-between">
                            <button
                                className="bg-white w-full text-gray-800 px-4 py-2 rounded-lg mr-2 text-blue-600"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className="bg-white w-full text-gray-800 px-4 py-2 rounded-lg text-blue-600"
                                onClick={confirmSubmission}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Page4;
