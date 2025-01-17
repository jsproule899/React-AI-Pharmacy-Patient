import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
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
function IssueTable() {
    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
        fetchIssues(); // Call the fetch function when component mounts
    }, []); // Empty dependency array to run once when the component mounts
    // Show loading spinner while fetching data
    if (isLoading) {
        return <Spinner />;
    }

    const handleStatusUpdate = (id: String | undefined) => {
        if(!id){

        }

        try {
            axios.put(`${import.meta.env.VITE_API_BASEURL}/api/issue/`)
            setIssues(issues);
            ;
        
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem loading the issues. Please try again.",
            })
        }


    }

    return (
        <Table>
            <TableCaption>A list of your the logged issues.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px]">Issue</TableHead>
                    <TableHead className="w-[200px]">Status</TableHead>
                    <TableHead className="w-[200px]">Category</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="">Edit Scenario</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {issues.map((issue: Issue, index: number) => {
                    return (
                        <TableRow key={index} className="text-stone-950 dark:text-stone-50">
                            <TableCell className="font-medium">#{index + 1}</TableCell>
                            <TableCell>{issue.Status}</TableCell>
                            <TableCell>{issue.Category}</TableCell>
                            <TableCell>{issue.Details}</TableCell>
                            <TableCell ><Link to={{ pathname: `/scenarios/edit/${issue.Scenario}` }} >
                                <FaRegPenToSquare className='h-6 w-6 mx-2 cursor-pointer' />
                            </Link></TableCell>

                            <TableCell >
                                <Dialog>
                                    <DialogTrigger asChild className="text-stone-950 dark:text-stone-50">
                                        <Button variant="ghost">Edit Status</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] w-80">
                                        <DialogHeader className="text-stone-950 dark:text-stone-50 items-center">
                                            <DialogTitle>Issue Status</DialogTitle>

                                        </DialogHeader>
                                        <div className="grid gap-4 py-4 text-stone-950 dark:text-stone-50">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">
                                                    Status
                                                </Label>
                                                <Select  >
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
                                        <DialogFooter className="text-center">
                                            <Button type="submit" onClick={() => { handleStatusUpdate(issue._id) }}>Save</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    )
                })}

            </TableBody>
        </Table>
    )
}

export default IssueTable