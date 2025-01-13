import React, { useState } from 'react'
import { FaCirclePlay, FaRegPenToSquare, FaTrashCan } from "react-icons/fa6";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Link } from 'react-router'
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import axios from 'axios';



export interface Scenario {
  _id: string;
  id: number;
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

const TimeAgo = ({ date }: { date: Date }) => {
  // Get the formatted string for time difference
   // Validate the date before using it
   if (isNaN(date.getTime())) {
     return <div>Invalid Date</div>; // Handle invalid date
   }

  const timeAgo = formatDistanceToNow(date, { addSuffix: true }); 
  return <div>Added {timeAgo}</div>;
};



function ScenarioCard({ scenario, onScenarioDeleted }: ScenarioProps) {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASEURL}/api/scenario/${scenario._id}`);
      console.log(`Scenario ${scenario._id} deleted`);
      onScenarioDeleted(); // Trigger the callback to re-fetch scenarios
      setIsDialogOpen(false); // Close the dialog after deletion
    } catch (error) {
      console.error("Error deleting scenario:", error);
    }
  };

  return (
    <Card className='m-4'>
      <CardHeader className='relative'>
        <CardTitle>{scenario.Name}</CardTitle>
        <Link to={{ pathname: "/scenarios/" + scenario._id }} className=" absolute top-4 right-8 z-30" ><FaCirclePlay className='w-12 h-12  text-red-600 hover:text-red-900 dark:hover:text-red-50 ' /></Link>
        <div className=" md:flex justify-center relative overflow-hidden rounded-lg">
          <img src={`src/assets/avatar_${scenario.Avatar}.png`} alt="Image" className="rounded-lg object-cover h-96" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-stone-800 from-2% to-30%" />
        </div>

        <CardDescription className="max-w-96 h-8">{scenario.Context}</CardDescription>
      </CardHeader>

      <CardFooter className='text-sm self-end flex flex-grow justify-between '>
        <TimeAgo date={new Date(scenario.createdAt)} />
        <div className='flex justify-between'>
          <Link to={{ pathname: "/scenarios/edit/" + scenario._id }} >
            <FaRegPenToSquare className='h-6 w-6 mx-2 cursor-pointer' />
          </Link>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><div><FaTrashCan className='h-6 w-6 mx-2 cursor-pointer' /></div></DialogTrigger>
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
                <Button type="button" variant="destructive" className='mb-1 px-8 mx-2' onClick={()=>{handleDelete()}}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>


        </div>
      </CardFooter>
    </Card>
  )
}

export default ScenarioCard