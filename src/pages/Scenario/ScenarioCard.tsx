import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useEffect, useState } from 'react';
import { FaCirclePlay, FaCode, FaRegPenToSquare, FaTrashCan } from "react-icons/fa6";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Copy } from 'lucide-react';
import { Link } from 'react-router';



export interface Scenario {
  _id: string;
  id: Number;
  Context: string;
  Name: string;
  Self: boolean;
  Other_Person: OtherPerson;
  Age: string;
  Gender: string;
  Medicines: string;
  AdditionalMeds: string;
  History: string;
  Symptoms: string;
  Allergies: string;
  Time: string;
  Outcome: string;
  AI: string;
  Model: string;
  TTS: string;
  Voice: string;
  Avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OtherPerson {
  Name: string;
  Age: string;
  Gender: string;
  Relationship: string;
}

interface ScenarioProps {
  scenario: Scenario;
  onScenarioDeleted: () => void; // Callback to re-fetch the scenarios
}


function ScenarioCard({ scenario, onScenarioDeleted }: ScenarioProps) {

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);

  const [isCopied, setIsCopied] = useState(false);

  const TimeAgo = ({ date }: { date: Date }) => {
    // Get the formatted string for time difference
    // Validate the date before using it
    if (isNaN(date.getTime())) {
      return <div>Invalid Date</div>; // Handle invalid date
    }

    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    return <div>Added {timeAgo}</div>;
  };

  const handleCopyEmbedLink = async (id: string | undefined) => {
    let link = (document.getElementById(`link-${id}`) as HTMLInputElement)?.value

    if (link) {
      try {
        await navigator.clipboard.writeText(link);

      } catch (error: any) {
        console.error(error.message);
      }
    }
  }

  useEffect(() => {

    const handleKeyDown = (event: any) => {
      if (event.ctrlKey && event.key === 'c') {
        setIsCopied(true);

        // Reset the "Copied!" state after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);

      }
    };


    document.addEventListener('keydown', handleKeyDown);

    return () => {

      document.removeEventListener('keydown', handleKeyDown);

    };
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASEURL}/api/scenario/${scenario._id}`);
      console.log(`Scenario ${scenario._id} deleted`);
      onScenarioDeleted(); // Trigger the callback to re-fetch scenarios
      setIsDeleteDialogOpen(false); // Close the dialog after deletion
    } catch (error) {
      console.error("Error deleting scenario:", error);
    }
  };

  return (
    <Card className='inline-block m-4 '>
      <CardHeader className='relative text-xl text--f'>
        <CardTitle>{scenario.Name}</CardTitle>
        <Link to={{ pathname: "/scenarios/" + scenario._id }} className=" absolute top-4 right-8 z-10" ><FaCirclePlay className='w-12 h-12  text-red-600 hover:text-red-900 dark:hover:text-red-50 ' /></Link>
        <div className=" md:flex justify-center relative overflow-hidden rounded-lg">
          <img src={`/img/avatar_${scenario.Avatar}.png`} alt="Image" className="rounded-lg object-cover h-96" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-stone-800 from-2% to-30%" />
        </div>

        <CardDescription className="max-w-96 h-8 text-base">{scenario.Context}</CardDescription>
      </CardHeader>

      <CardFooter className='text-sm self-end flex flex-grow justify-between '>
        <TimeAgo date={new Date(scenario.createdAt)} />
        <div className='flex justify-between'>
          <Link to={{ pathname: "/scenarios/edit/" + scenario._id }} >
            <FaRegPenToSquare className='h-6 w-6 mx-2 cursor-pointer' />
          </Link>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild><button><FaTrashCan className='h-6 w-6 mx-2 cursor-pointer' /></button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='text-black dark:text-white'>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the scenario
                  and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="sm:justify-center">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className='mb-1 px-8 mx-2'>
                    Close
                  </Button>
                </DialogClose>
                <Button type="button" variant="destructive" className='mb-1 px-8 mx-2' onClick={() => { handleDelete() }}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
            <DialogTrigger asChild>
              <button><FaCode className='h-6 w-6 mx-2 cursor-pointer' /></button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className='text-black dark:text-white'>Embed link</DialogTitle>
                <DialogDescription>
                  Place this iframe onto your web page.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor={`link-${scenario._id}`} className="sr-only">
                    Link
                  </Label>
                  <Input
                    id={`link-${scenario._id}`}
                    defaultValue={`<iframe src="${window.location.origin}/embedded/scenarios/${scenario._id}" style="width:720px;height:405px;" allow="camera; microphone" allowfullscreen title=""></iframe>`
                    }
                    readOnly
                  />
                </div>
                <DialogClose asChild>
                  <Button type="submit" size="sm" className="px-3" onClick={() => { handleCopyEmbedLink(scenario._id) }}>
                    {isCopied ? (
                      <p id="copy-icon" className="inline">Copied!</p>
                    ) : (
                      <>
                        <span className="sr-only">Copy</span>
                        <Copy id="copy-icon" className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </DialogClose>
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>


        </div>
      </CardFooter>
    </Card>
  )
}

export default ScenarioCard