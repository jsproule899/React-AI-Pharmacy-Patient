import Spinner from '@/components/ui/Spinner';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaFileArrowDown, FaFilePdf } from 'react-icons/fa6';
import { useParams } from 'react-router';
import { Transcript } from './Transcripts';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

const ChatLogDisplay = () => {
    const { id } = useParams<{ id?: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [transcript, setTranscript] = useState<Transcript>();
    const [messages, setMessages] = useState<string[]>([]);

    const fetchTranscript = async () => {
        try {
            await axios.get(`${import.meta.env.VITE_API_BASEURL}/api/transcript/${id}`).then(async (res) => {
                if (res.data) {
                    setTranscript(res.data)
                    const chatMessages = res.data.Data.split('\n'); // Assuming each line is a separate message
                    setMessages(chatMessages);
                } else {
                    alert('Please upload a valid .txt file');
                }
            })
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem loading the transcript. try uploading the file.",
            })
        }
    }

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

    const generatePdf = () => {
        try {
            // var doc = new jsPDF({
            //     orientation: 'portrait', // or 'landscape' depending on your need
            //     unit: 'mm', // unit for dimensions (mm is default)
            //     format: 'a4', // A4 paper size
            //     compress: true,
            // });
            var content = document.getElementById("chatlog-window")
            if (!content) throw new Error("No content found!");

            // const pageWidth = doc.internal.pageSize.getWidth(); // A4 width in mm
            // const pageHeight = doc.internal.pageSize.getHeight(); // A4 height in mm

            const contentWidth = content.scrollWidth; // Full width of content
            const contentHeight = content.scrollHeight; // Full height of content

            // const scaleFactor = Math.min(pageWidth / contentWidth, pageHeight / contentHeight);

            // doc.html(content, {

            //     callback: function (doc) {
            //         doc.save(transcript?.Filename.replace(".txt", ".pdf"));
            //     },
            //     x: 0, // x position on the page
            //     y: 0, // y position on the page
            //     width: contentWidth * scaleFactor, // Scaled width of the content
            //     windowWidth: contentWidth, // Original width to help with scaling
            //     autoPaging: true,

            // });

            const quality = 1 // Higher the better but larger file
            html2canvas(content,
                { scale: quality, width: contentWidth, height: contentHeight }
            ).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (contentHeight * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(transcript?.Filename.replace(".txt", ".pdf"));
            });




        } catch (error) {
            console.log(error)
            alert('Failed to download chatlog as PDF, please open a valid chatlog.');
        }


    }

    const handleDownload = (transcript: Transcript | undefined) => {
        if (!transcript) return
        const blob = new Blob([transcript.Data], { type: 'text/plain' });

        // Create an Object URL for the Blob
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = transcript.Filename;

        // Trigger the download by simulating a click
        link.click();

        // Clean up the Object URL after download
        URL.revokeObjectURL(url);
    }

    useEffect(() => {
        if (id) {
            fetchTranscript()
        }
    }, []);

    if (isLoading) {
        return <Spinner />;
    }


    return (
        <div className="md:p-6 flex flex-col flex-grow md:mx-10">
            <h2 className="text-xl font-semibold mb-4  text-stone-950 dark:text-stone-50">Chat Log Display</h2>
            {messages.length === 0 ? <input type="file" accept=".txt" onChange={handleFileUpload} className="mb-4 p-2 border rounded max-w-96  text-stone-950 dark:text-stone-50" />
                : (
                    <div id="chatlog-window" className="mt-4 border border-gray-300 rounded-lg p-4 max-h-[calc(100dvh-5rem)] overflow-y-auto bg-gray-50 shadow-md over">
                        <FaFileArrowDown className='h-6 w-6 mx-6 cursor-pointer justify-self-center ' onClick={() => handleDownload(transcript)} />
                        <FaFilePdf className='h-6 w-6 mx-6 cursor-pointer justify-self-center ' onClick={() => generatePdf()} />
                        {messages.map((message, index) => (
                            <div key={index} className="mb-2">
                                <div className="flex items-start">
                                    {!message.includes("Patient:") && !message.includes("Pharmacist:") && (message.length > 0) && (
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
                                                {message.replace("Patient:", "")}
                                            </div>
                                        </div>
                                    )}
                                    {message.includes("Pharmacist:") && (
                                        <div className="ml-auto max-w-96 mb-2 ">
                                            <div className="bg-red-400 p-2 rounded-lg shadow-sm text-gray-950 mr-auto">
                                                <p className='text-xs text-gray-950/80'>Pharmacist</p>
                                                {message.replace("Pharmacist:", "")}
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
