import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useEffect, useRef, useState } from 'react';
import { FaCirclePlay, FaCode, FaRegCopy, FaRegPenToSquare, FaTrashCan } from "react-icons/fa6";

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

import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";
import { Scenario } from "@/types/Scenario";
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router';





interface ScenarioProps {
  scenario: Scenario;
  onScenarioDeleted: (id: string) => void; // Callback to re-fetch the scenarios
}


function ScenarioCard({ scenario, onScenarioDeleted }: ScenarioProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [iframeWidth, setIframeWidth] = useState("100%");
  const [iframeAspect, setIframeAspect] = useState("16/9");
  const [isCopied, setIsCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { auth } = useAuth();

  const iframeCode = `<iframe src="${window.location.origin}/embedded/scenarios/${scenario._id}" style="width:${iframeWidth};aspect-ratio:${iframeAspect};display:block; margin:auto;" allow="camera; microphone" allowfullscreen title="Pharmacy-Roleplay"></iframe>`


  const TimeAgo = ({ date }: { date: Date }) => {
    // Get the formatted string for time difference
    // Validate the date before using it
    if (isNaN(date.getTime())) {
      return <div>Invalid Date</div>; // Handle invalid date
    }

    const timeAgo = formatDistanceToNow(date, { addSuffix: true });
    return <div>Added {timeAgo}</div>;
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.select();
    }, 0);
  }, [iframeCode, isCopyDialogOpen]);

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
      const input = event.target;
      const isTextSelected = input.selectionStart !== input.selectionEnd;

      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && isTextSelected) {
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
      onScenarioDeleted(scenario._id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting scenario:", error);
    }
  };

  return (
    <Card className='inline-block m-4  '>
      <CardHeader className='relative text-xl m-a'>
        <CardTitle className="mb-1">{scenario.Name}</CardTitle>
        <Badge className="w-fit">{scenario.Theme}</Badge>
        <Link to={{ pathname: "/scenarios/" + scenario._id }} className=" absolute top-4 right-8 z-10 p-1" ><FaCirclePlay className='w-12 h-12  text-qub-red hover:text-qub-darkred dark:hover:text-red-50 ' /></Link>


        <div className=" md:flex justify-center relative overflow-hidden rounded-lg">
          <img src={`/img/avatar_${scenario.Avatar}.png`} alt="Image" className="rounded-lg object-cover h-96" />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-stone-800 from-2% to-30%" />
        </div>


        <CardDescription className="max-w-96 h-12 text-base overflow-hidden text-ellipsis line-clamp-2">{scenario.Context}</CardDescription>
      </CardHeader>

      <CardFooter className='text-sm self-end flex flex-grow justify-between '>
        <TimeAgo date={new Date(scenario.createdAt)} />

        {auth?.roles?.includes("staff") || auth?.roles?.includes("superUser") &&
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

                <div className="flex flex-col gap-2 ">


                  <div className="flex gap-2 flex-grow">
                    <div className="flex-col">
                      <Label className="text-xs font-light  text-stone-950 dark:text-stone-50">Aspect Ratio</Label>

                      <Select onValueChange={setIframeAspect}>

                        <SelectTrigger className="w-20  text-stone-950 dark:text-stone-50">

                          <SelectValue placeholder={iframeAspect.replace('/', ':')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="16/9">16:9</SelectItem>
                          <SelectItem value="4/3">4:3</SelectItem>
                          <SelectItem value="9/16">9:16</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-col">
                      <Label className="text-xs font-light text-stone-950 dark:text-stone-50"> Width</Label>
                      <Select onValueChange={setIframeWidth}>
                        <SelectTrigger className="w-20  text-stone-950 dark:text-stone-50">
                          <SelectValue placeholder={iframeWidth} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100%">100%</SelectItem>
                          <SelectItem value="80%">80%</SelectItem>
                          <SelectItem value="50%">50%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    <Label htmlFor={`link-${scenario._id}`} className="sr-only">
                      Link
                    </Label>
                    <Input
                      id={`link-${scenario._id}`}
                      value={iframeCode}
                      readOnly
                      ref={inputRef}
                      autoFocus
                      onClick={() => inputRef.current?.select()}
                    />

                    <DialogClose asChild>
                      <Button type="submit" size="sm" className="px-3" onClick={() => { handleCopyEmbedLink(scenario._id) }}>
                        {isCopied ? (
                          <p id="copy-icon" className="inline">Copied!</p>
                        ) : (
                          <>
                            <span className="sr-only">Copy</span>
                            <FaRegCopy id="copy-icon" className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </DialogClose>
                  </div>
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
        }
      </CardFooter>
    </Card>
  )
}

export default ScenarioCard