import React from 'react'
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


type Scenario = {
  id: number,
  name: string
}


const TimeAgo = ({ date }: { date: Date }) => {
  // Get the formatted string for time difference
  const timeAgo = formatDistanceToNow(new Date(date), { addSuffix: true });

  return <div>Added {timeAgo}</div>;
};

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <Card className='m-4'>
      <CardHeader className='relative'>
        <CardTitle>{scenario.Name}</CardTitle>
        <Link to={{ pathname: "/scenarios/" + scenario.id }} className=" absolute top-4 right-8 z-30" ><FaCirclePlay className='w-12 h-12  text-red-600 hover:text-red-900 dark:hover:text-red-50 ' /></Link>
        <div className=" md:flex justify-center relative overflow-hidden rounded-lg">
          <img src={"src/assets/" + scenario.img} alt="Image" className="rounded-lg object-cover h-96" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-stone-800 from-2% to-30%" />
        </div>

        <CardDescription className="max-w-96">{scenario.Context}</CardDescription>
      </CardHeader>

      <CardFooter className='text-sm flex flex-grow justify-between '>
        <TimeAgo date={new Date(scenario.createdAt)} />
        <div className='flex justify-between'>
          <Link to={{ pathname: "/scenarios/edit/" + scenario.id }} >
            <FaRegPenToSquare className='h-6 w-6 mx-2 cursor-pointer' />
          </Link>
          <Dialog>
            <DialogTrigger asChild><FaTrashCan className='h-6 w-6 mx-2 cursor-pointer' /></DialogTrigger>
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
              <Button type="button" variant="destructive"  className='mb-1 px-8 mx-2'>
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