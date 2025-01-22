import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Spinner from "@/components/ui/Spinner";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { DialogClose } from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaListCheck, FaRegPenToSquare, FaTrashCan } from "react-icons/fa6";
import { Link } from "react-router";
import { Scenario } from "../Scenario/ScenarioCard";

export interface Issue {
    _id: string;
    Status: string;
    Category: string;
    Details: String;
    Scenario: Scenario;
    createdAt: Date;
    updatedAt: Date;

}
function styleStatusColour(status: string | undefined) {

    let colour;

    switch (status) {
        case "NEW": colour = "bg-red-600 text-stone-50";
            break;
        case "IN-PROGRESS": colour = "bg-yellow-600 text-stone-50";
            break;
        case "RESOLVED": colour = "bg-green-600 text-stone-50";
            break;
        default: colour = "bg-gray-600 text-stone-50";
    }

    return <p className={`rounded-lg ${colour} text-center p-1`}>{status}</p>
}

function IssuesPage() {
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("NEW");

    const fetchIssues = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASEURL}/api/issue`)
            setIssues(res.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem loading the issues. Please try again.",
            })
        }
    }

    useEffect(() => {
        fetchIssues();
    }, []);



    const handleStatusUpdate = async (id: String | undefined) => {
        if (!id) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem updating the issue. Please try again.",
            })
        }

        try {
            axios.put(`${import.meta.env.VITE_API_BASEURL}/api/issue/${id}`, { Status: selectedStatus }).then(() => fetchIssues())
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem updating the issue. Please try again.",
            })
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASEURL}/api/issue/${id}`);
            console.log(`Issue ${id} deleted`);
            setIssues(issues.filter((i: Issue) => i._id != id ))
        } catch (error) {
            console.error("Error deleting issue:", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem deleting the issue. Please try again.",
            })
        }
    };


    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="flex-grow bg-stone-50 dark:bg-stone-900">
            <Table>
                <TableCaption>{issues.length === 0 ? "No issues logged." : "A list of the logged issues."}</TableCaption>
                <TableHeader >
                    <TableRow>
                        <TableHead>Issue</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="w-6/12">Details</TableHead>
                        <TableHead className="1/12 text-center">Edit Scenario</TableHead>
                        <TableHead>Logged</TableHead>
                        <TableHead className="w-1/12 text-center">Status</TableHead>
                        <TableHead className="w-1/12 text-center">Update</TableHead>
                        <TableHead className="w-1/12 text-center w-">Remove</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {issues.map((issue: Issue, index: number) => {
                        return (
                            <TableRow key={index} className="text-stone-950 dark:text-stone-50">
                                <TableCell className="font-medium">#{index + 1}</TableCell>

                                <TableCell>{issue.Category}</TableCell>
                                <TableCell>{issue.Details}</TableCell>
                                <TableCell >
                                    <Link to={{ pathname: `/scenarios/edit/${issue.Scenario._id}` }} >
                                        <FaRegPenToSquare className='h-6 w-6 mx-6 cursor-pointer justify-self-center' />
                                    </Link>
                                </TableCell>
                                <TableCell>{new Date(issue.createdAt).toDateString()}</TableCell>
                                <TableCell>{styleStatusColour(issue.Status)}</TableCell>

                                <TableCell >
                                    <Dialog>
                                        <DialogTrigger asChild className="text-stone-950 dark:text-stone-50">
                                            <button className="align-middle w-full"><FaListCheck className='h-6 w-6 mx-6 cursor-pointer justify-self-center' /></button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] w-80">
                                            <DialogHeader className="text-stone-950 dark:text-stone-50 items-center">
                                                <DialogTitle>Issue Status</DialogTitle>
                                                <DialogDescription>
                                                    Update the status of this issue.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4 text-stone-950 dark:text-stone-50">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        Status
                                                    </Label>
                                                    <Select onValueChange={setSelectedStatus}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue id="status-select" placeholder={issue.Status} />
                                                        </SelectTrigger>
                                                        <SelectContent className="text-stone-950 dark:text-stone-50">
                                                            <SelectItem value="NEW">New</SelectItem>
                                                            <SelectItem value="IN-PROGRESS">In-Progress</SelectItem>
                                                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                            </div>
                                            <DialogFooter className="text-center justify-self-center w-full sm:w-auto flex-col">
                                                <DialogClose asChild>
                                                    <Button className="m-2 w-full" onClick={() => { handleStatusUpdate(issue._id) }}>Save</Button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <Button className="m-2 w-full" variant="secondary">Cancel</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
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
                                                    <Button type="button" variant="destructive" className='mb-1 px-8 mx-2' onClick={() => { handleDelete(issue._id) }}>Delete</Button>
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
        </div>
    )
}

export default IssuesPage