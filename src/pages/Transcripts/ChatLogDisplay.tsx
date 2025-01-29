import Spinner from '@/components/ui/Spinner';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import { useEffect, useState } from 'react';
import { FaFileArrowDown, FaFilePdf, FaSpinner } from 'react-icons/fa6';
import { useParams } from 'react-router';
import { Transcript } from './Transcripts';

const ChatLogDisplay = () => {
    const { id } = useParams<{ id?: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [file, setFile] = useState<File>();
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
        setFile(file);
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
        setIsGeneratingPdf(true);
        try {
            var content = document.getElementById("chatlog-window")
            if (!content) throw new Error("No content found!");

            const quality = 2; // Higher the better but larger file
            const a4Width = 210; // A4 width in mm
            const a4Height = 297; // A4 height in mm
            html2canvas(content, {
                scale: quality,
                width: content.offsetWidth,
                height: content.offsetHeight,
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4'); // Create a PDF in A4 size
                const imgProps = pdf.getImageProperties(imgData);

                // Define the maximum width for the content on each page
                const maxContentWidth = a4Width

                // Calculate the aspect ratio of the content
                const contentAspectRatio = imgProps.width / imgProps.height;

                // Calculate the scaled width and height based on the maximum width
                let imgWidth = maxContentWidth;
                let imgHeight = maxContentWidth / contentAspectRatio;

                // // If the scaled height exceeds the A4 page height, adjust the dimensions
                if (imgHeight > a4Height) {
                    imgHeight = a4Height;
                    imgWidth = a4Height * contentAspectRatio;
                }

                // Calculate the total height of the content in pixels
                const totalContentHeight = canvas.height;


                let currentY = 0; // Track the current Y position in the content

                while (currentY < totalContentHeight) {
                    // Create a new page if it's not the first page
                    if (currentY > 0) {
                        pdf.addPage();
                    }

                    // Calculate the crop area for the current page
                    const cropY = currentY;
                    const cropHeight = totalContentHeight - currentY;

                    // Create a temporary canvas to crop the current page
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = cropHeight;

                    // Draw the cropped section onto the temporary canvas
                    tempCtx?.drawImage(
                        canvas,
                        0, cropY, canvas.width, cropHeight, // Source rectangle
                        0, 0, canvas.width, cropHeight // Destination rectangle
                    );

                    // Convert the cropped canvas to an image
                    const croppedImgData = tempCanvas.toDataURL('image/png');

                    // Calculate the x and y offsets to center the content
                    const xOffset = (a4Width - imgWidth) / 2; // Center horizontally
                    const yOffset = (a4Height - imgHeight) / 2; // Center vertically

                    // Add the cropped image to the PDF
                    pdf.addImage(croppedImgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

                    // Move to the next section
                    currentY += cropHeight;
                }

                pdf.save(transcript?.Filename.replace(".txt", ".pdf"));
                setIsGeneratingPdf(false)
            });




        } catch (error) {
            console.log(error)
            alert('Failed to download chatlog as PDF, please open a valid chatlog.');
            setIsGeneratingPdf(false)
        }


    }

    const handleDownload = () => {
        setIsDownloading(true);

        if (transcript) {
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
        } else if (file) {
            const blob = new Blob([file], { type: 'text/plain' });

            // Create an Object URL for the Blob
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;

            // Trigger the download by simulating a click
            link.click();

            // Clean up the Object URL after download
            URL.revokeObjectURL(url);
        }
        setTimeout(()=>setIsDownloading(false),2000);
        

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
            <h1 className="text-4xl font-bold mb-4 mx-auto text-stone-950 dark:text-stone-50">Scenario Transcript</h1>
            {messages.length === 0 ? <input type="file" accept=".txt" onChange={handleFileUpload} className="mb-4 p-2 border rounded max-w-96  text-stone-950 dark:text-stone-50" />
                : (<>
                    <div id='chatlog-download' className='flex justify-center text-stone-950 dark:text-stone-50'>
                        {isDownloading ? <FaSpinner className='h-9 w-9 mx-6 cursor-wait justify-self-center animate-spin' /> : <FaFileArrowDown className='h-9 w-9 mx-6 cursor-pointer justify-self-center ' onClick={() => handleDownload()} />}
                        {isGeneratingPdf ? <FaSpinner className='h-9 w-9 mx-6 cursor-wait justify-self-center animate-spin' /> : <FaFilePdf className='h-9 w-9 mx-6 cursor-pointer justify-self-center ' onClick={() => generatePdf()} />}
                    </div>
                    <div id="chatlog-window" className="mt-4 border border-gray-300 dark:border-stone-700 rounded-lg p-4 max-w-5xl mx-auto bg-gray-50 dark:bg-stone-800 shadow-md">
                        {messages.map((message, index) => (
                            <div key={index} className="mb-2">
                                <div className="flex items-start">
                                    {!message.includes("Patient:") && !message.includes("Pharmacist:") && (message.length > 0) && (
                                        <div className="mx-auto text-stone-950 dark:text-stone-50">
                                            <div className="font-semibold">
                                                {message}
                                            </div>
                                        </div>
                                    )}
                                    {message.includes("Patient:") && (
                                        <div className="ml-2 max-w-96 mb-2">
                                            <div className="bg-stone-200 dark:bg-stone-700 p-2 rounded-lg shadow-sm text-gray-800 dark:text-stone-200 mr-auto">
                                                <p className='text-xs text-gray-800/80 dark:text-stone-200/80'>Patient</p>
                                                {message.replace("Patient:", "")}
                                            </div>
                                        </div>
                                    )}
                                    {message.includes("Pharmacist:") && (
                                        <div className="ml-auto max-w-96 mb-2 ">
                                            <div className="bg-red-400 dark:bg-red-900 p-2 rounded-lg shadow-sm text-gray-950 mr-auto dark:text-stone-200">
                                                <p className='text-xs text-gray-950/80 dark:text-stone-200/80'>Pharmacist</p>
                                                {message.replace("Pharmacist:", "")}
                                            </div>
                                        </div>
                                    )}


                                </div>
                            </div>
                        ))}
                    </div>
                </>
                )}
        </div>

    );
}
export default ChatLogDisplay;
