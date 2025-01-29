import Spinner from "@/components/ui/Spinner";
import { toast } from "@/hooks/use-toast";
import { Transcript } from "@/types/Transcript";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { columns } from "./columns";
import { TranscriptTable } from "./Table";


const getTranscripts = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_BASEURL}/api/transcript`);
  return res.data;
}

function TranscriptsPage() {
  const queryClient = useQueryClient()
  const { isPending, error, isError, data: transcripts } = useQuery({
    queryKey: ['transcripts'],
    queryFn: () => getTranscripts(),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,

  })

  const [downloadLoadingId, setDownloadLoadingId] = useState<string | null>(null);


  const handleDownload = (transcript: Transcript) => {
    setDownloadLoadingId(transcript._id);
    const blob = new Blob([transcript.Data], { type: 'text/plain' });

    // Create an Object URL for the Blob
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = transcript.Filename;

    // Trigger the download by simulating a click
    link.click();

    // Clean up the Object URL after download
    setTimeout(() => {
      URL.revokeObjectURL(url);
      setDownloadLoadingId(null);
    }, 2000); // 5-second delay (adjust as needed)



  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASEURL}/api/transcript/${id}`);
      console.log(`Transcript ${id} deleted`);

    } catch (error) {
      console.error("Error deleting transcript:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem deleting the transcript. Please try again.",
      })
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => handleDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['transcripts'] as any);
    }
  })


  if (isPending) {
    return <Spinner />;
  }

  if (error) {
    console.log(error);
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem loading the transcripts. Please try again.",
    })
  }

  return (
    <div className='flex flex-col flex-grow bg-stone-50 dark:bg-stone-900'>
      {isError ?  <h2 className='text-2xl font-bold text-stone-950 dark:text-stone-50 my-2 text-center'>No Transcripts found... {error.message} Please try again later.</h2>
      :<TranscriptTable columns={columns} data={transcripts} handleDownload={handleDownload} handleDelete={deleteMutation.mutate} downloadLoadingId={downloadLoadingId}  />
      }
    </div>

  )
}

export default TranscriptsPage