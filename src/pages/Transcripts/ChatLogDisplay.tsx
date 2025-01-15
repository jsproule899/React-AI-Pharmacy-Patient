import { useState } from 'react';

const ChatLogDisplay = () => {
    const [messages, setMessages] = useState<string[]>([]);

    const handleFileUpload = (e: any) => {
        const file = e.target.files[0];

        if (file && file.type === 'text/plain') {
            const reader = new FileReader();

            reader.onload = () => {
                const fileContent = reader.result as string;
                const chatMessages = fileContent.split('\n'); // Assuming each line is a separate message
                setMessages(chatMessages);
            };

            reader.readAsText(file);
        } else {
            alert('Please upload a valid .txt file');
        }
    };

    return (
        <div className="md:p-6 flex flex-col flex-grow md:mx-10">
            <h2 className="text-xl font-semibold mb-4  text-stone-950 dark:text-stone-50">Chat Log Display</h2>
            <input type="file" accept=".txt" onChange={handleFileUpload} className="mb-4 p-2 border rounded max-w-96  text-stone-950 dark:text-stone-50" />

            {messages.length > 0 && (
                <div className="mt-4 border border-gray-300 rounded-lg p-4 max-h-[calc(100dvh-5rem)] overflow-y-auto bg-gray-50 shadow-md">
                    {messages.map((message, index) => (
                        <div key={index} className="mb-2">
                            <div className="flex items-start">
                            {!message.includes("Patient:") && !message.includes("Pharmacist:") && (message.length>0) && (
                                    <div className="mx-auto">
                                        <div className="font-semibold">
                                            {message}
                                        </div>
                                    </div>
                                )}
                                {message.includes("Patient:") && (
                                    <div className="ml-2 max-w-96 mb-2">
                                        <div className="bg-stone-200 p-2 rounded-lg shadow-sm text-gray-800 mr-auto">
                                            <p className='text-xs text-gray-800/80'>Patient</p>
                                            {message.replace("Patient:","")}
                                        </div>
                                    </div>
                                )}
                                 {message.includes("Pharmacist:") && (
                                    <div className="ml-auto max-w-96 mb-2 ">
                                        <div className="bg-red-400 p-2 rounded-lg shadow-sm text-gray-950 mr-auto">
                                        <p className='text-xs text-gray-950/80'>Pharmacist</p>
                                        {message.replace("Pharmacist:","")}
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default ChatLogDisplay;
