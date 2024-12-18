import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Chat: React.FC = () => {
    const location = useLocation();
    const { clientUsername, clientFirstName, clientLastName, clientPhotoUrl } = location.state || {}; // Retrieve Telegram user info

    // State for messages and input
    const [messages, setMessages] = useState<
        { sender: string; text?: string; file?: { name: string; url: string } }[]
    >([]);
    const [input, setInput] = useState("");

    // Handle message sending
    const handleSendMessage = () => {
        if (input.trim() === "") return; // Prevent sending empty messages

        // Add the new message to the state
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "You", text: input }, // Add sender as "You" for the user
        ]);

        // Clear the input field
        setInput("");
    };

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);

            // Add the file message to the state
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "You", file: { name: file.name, url: fileUrl } },
            ]);
        }
    };

    if (!clientUsername) {
        return <p className="text-white text-center">Telegram user info not found</p>;
    }

    return (
        <main className="relative pt-24 pb-24 w-full bg-cover bg-center bg-no-repeat min-h-full bg-[url('/images/background/background.png')] bg-cover bg-[#5200FF64]">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 pt-6 pb-6 bg-cover bg-center bg-no-repeat bg-[url('/images/background/header_bg.png')] rounded-b-3xl z-10">
                <div className="flex items-center px-4">
                    {clientPhotoUrl ? (
                        <img
                            src={clientPhotoUrl}
                            alt="Client Avatar"
                            className="w-12 h-12 rounded-full mr-3"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-lg">
                                {clientFirstName?.charAt(0)}
                            </span>
                        </div>
                    )}
                    <div>
                        <h1 className="text-white font-bold text-[20px] leading-5">
                            {clientFirstName} {clientLastName}
                        </h1>
                        <p className="text-gray-400 text-sm">@{clientUsername}</p>
                    </div>
                </div>
            </nav>

            {/* Chat Area */}
            <div className="px-4 pt-20 pb-[160px] overflow-y-scroll max-h-[calc(100vh-240px)]">
                {messages.length === 0 && (
                    <p className="text-gray-400 text-center mt-5">Start a conversation!</p>
                )}

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.sender === "You" ? "justify-end" : "justify-start"
                        } mb-2`}
                    >
                        <div
                            className={`p-3 rounded-lg max-w-[70%] ${
                                message.sender === "You"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-black"
                            }`}
                        >
                            {message.text && <p className="text-sm">{message.text}</p>}
                            {message.file && (
                                <div className="mt-2">
                                    <a
                                        href={message.file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs underline text-white"
                                    >
                                        {message.file.name}
                                    </a>
                                    <img
                                        src={message.file.url}
                                        alt="Preview"
                                        className="mt-2 rounded-lg max-w-full"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="fixed bottom-[84px] left-0 right-0 bg-gray-800 py-4 px-4 z-10">
                <div className="flex items-center">
                    {/* File Upload Icon */}
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-gray-700 p-2 rounded-full text-white mr-3"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5V6a3 3 0 013-3h12a3 3 0 013 3v10.5M16 20.5a4 4 0 01-8 0m4-5.5v5.5"
                            />
                        </svg>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileUpload}
                    />

                    {/* Input Field */}
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-grow px-4 py-2 rounded-lg focus:outline-none text-black"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendMessage();
                        }}
                    />
                    <button
                        className="ml-1 bg-blue-600 text-white py-2 rounded-lg"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Chat;
