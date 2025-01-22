import Spinner from "@/components/ui/Spinner";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaFileArrowDown, FaFileLines, FaTrashCan } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router";
import { Scenario } from "../Scenario/ScenarioCard";


export interface Transcript {
  _id: string;
  Filename: string;
  Data: string;
  Scenario: Scenario;
  createdAt: Date;
  updatedAt: Date;

}


function Transcripts() {
  const [transcripts, setTranscripts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const fetchTranscripts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASEURL}/api/transcript`)
      setTranscripts(res.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem loading the transcripts. Please try again.",
      })
    }
  }

  useEffect(() => {
    fetchTranscripts();
  }, []);


  const handleDownload = (transcript: Transcript) => {
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

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASEURL}/api/transcript/${id}`);
      console.log(`Transcript ${id} deleted`);
      setTranscripts(transcripts.filter((t: Transcript) => t._id != id ))
    } catch (error) {
      console.error("Error deleting transcript:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem deleting the transcript. Please try again.",
      })
    }
  };


  if (isLoading) {
    return <Spinner />;
  }

  return (

    <div className="flex-grow bg-stone-50 dark:bg-stone-900">

      <Table>
        <TableCaption>{transcripts.length === 0 ? "No transcripts logged." : "A list of the logged transcripts."}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/12">Transcript</TableHead>
            <TableHead>Student No.</TableHead>
            <TableHead>Scenario</TableHead>
            <TableHead>Logged</TableHead>
            <TableHead className="w-1/12 text-center">View Transcript</TableHead>
            <TableHead className="w-1/12 text-center">Download Transcript</TableHead>
            <TableHead className="w-1/12 text-center">Remove</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {transcripts.map((transcript: Transcript, index: number) => {
            return (
              <TableRow key={index} className="text-stone-950 dark:text-stone-50">
                <TableCell className="font-medium">#{index + 1}</TableCell>
                <TableCell>{transcript.Filename.split('_')[0]}</TableCell>
                <TableCell>{transcript.Scenario?.Context}</TableCell>
                <TableCell>{new Date(transcript.createdAt).toUTCString()}</TableCell>

                <TableCell ><Link to={{ pathname: `/transcripts/${transcript._id}` }} >
                  <FaFileLines className='h-6 w-6 mx-6 cursor-pointer justify-self-center' />
                </Link></TableCell>

                <TableCell >
                  <FaFileArrowDown className='h-6 w-6 mx-6 cursor-pointer justify-self-center' onClick={() => handleDownload(transcript)} />
                </TableCell>

                <TableCell >
                  <Dialog>
                    <DialogTrigger asChild >
                      <button className="w-full"><FaTrashCan className='h-6 w-6 mx-6 cursor-pointer justify-self-center' /></button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className='text-black dark:text-white'>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete the transcript
                          and remove your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-center">
                        <DialogClose asChild>
                          <Button type="button" variant="outline" className='mb-1 px-8 mx-2'>Close</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button type="button" variant="destructive" className='mb-1 px-8 mx-2' onClick={() => { handleDelete(transcript._id) }}>Delete</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>

            )
          })}

        </TableBody>
      </Table>

    </div >
  )
}

export default Transcripts