import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Issue } from "@/types/issue";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaListCheck, FaRegPenToSquare, FaTrashCan } from "react-icons/fa6";
import { Link } from "react-router";


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
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filtered, setFiltered] = useState<Issue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("NEW");
    const [filters, setFilters] = useState({
        category: "",
        status: "",
        detail: ""
    })

    const categories = [...new Set(issues?.map(issue => issue.Category))]

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

    useEffect(() => {
        
        const filterIssues = () => {
            setFiltered(issues);
            let filteredIssues = [...issues];

            // Apply category filter
            if (filters.category  && filters.category !== "all") {
                filteredIssues = filteredIssues.filter((issue) => issue.Category === filters.category);
            }

            // Apply details filter (case-insensitive)
            if (filters.detail) {
                filteredIssues = filteredIssues.filter((issue) =>
                    issue.Details.toLowerCase().includes(filters.detail.toLowerCase())
                );
            }

            // Apply status filter
            if (filters.status && filters.status !== "all") {
                filteredIssues = filteredIssues.filter((issue) => issue.Status === filters.status);
            }

            // Update the filtered state
            setFiltered(filteredIssues);
        };

        filterIssues();
    }, [filters, setFiltered, issues])



    const handleStatusUpdate = async (id: String | undefined) => {
        if (!id) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem updating the issue. Please try again.",
            })
        }

        try {
            await axios.put(`${import.meta.env.VITE_API_BASEURL}/api/issue/${id}`, { Status: selectedStatus }).then(() => fetchIssues())
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
            setIssues(issues.filter((i: Issue) => i._id !== id))
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
        <div className="flex-grow bg-stone-50 dark:bg-stone-900 ">
            <div className="w-11/12 mx-auto m-4">
                <div className="flex items-center justify-start py-4 gap-4 ">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">Category</p>
                        <Select
                            value={filters.category}
                            onValueChange={(value) => {
                                setFilters((prev) => ({ ...prev, category: value }))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[100px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"all"}>
                                    All
                                </SelectItem>

                                {
                                    categories.map((cat, index) => (
                                        <SelectItem key={index} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}

                            </SelectContent>
                        </Select>
                    </div>
                    <Input
                        placeholder="Search details..."
                        value={filters.detail || ""}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, detail: e.target.value }))
                        }
                        className="max-w-sm"
                    />
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">Status</p>
                        <Select
                            value={filters.status}
                            onValueChange={(value) => {
                                setFilters((prev) => ({ ...prev, status: value }))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"all"}>
                                    All
                                </SelectItem>

                                {
                                    ["NEW", "IN-PROGRESS", "RESOLVED"].map((status, index) => (
                                        <SelectItem key={index} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}

                            </SelectContent>
                        </Select>
                    </div>

                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableCaption>{issues.length === 0 ? "No issues logged." : "A list of the logged issues."}</TableCaption>
                        <TableHeader >
                            <TableRow>
                                <TableHead className="">Issue</TableHead>
                                <TableHead >Category</TableHead>
                                <TableHead className="w-6/12">Details</TableHead>
                                <TableHead className="text-center">Edit Scenario</TableHead>
                                <TableHead>Logged</TableHead>
                                <TableHead className=" text-center">Status</TableHead>
                                <TableHead className=" text-center">Update</TableHead>
                                <TableHead className=" text-center w-">Remove</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((issue: Issue, index: number) => {
                                return (
                                    <TableRow key={index} className="text-stone-950 dark:text-stone-50">
                                        <TableCell className="font-medium">#{index + 1}</TableCell>

                                        <TableCell>{issue.Category}</TableCell>
                                        <TableCell>{issue.Details}</TableCell>
                                        <TableCell >
                                            <Link to={{ pathname: `/scenarios/edit/${issue.Scenario._id}` }} >
                                                <FaRegPenToSquare className='h-6 w-6 cursor-pointer justify-self-center' />
                                            </Link>
                                        </TableCell>
                                        <TableCell>{new Date(issue.createdAt).toDateString()}</TableCell>
                                        <TableCell>{styleStatusColour(issue.Status)}</TableCell>

                                        <TableCell >
                                            <Dialog>
                                                <DialogTrigger asChild className="text-stone-950 dark:text-stone-50">
                                                    <button className="align-middle w-full"><FaListCheck className='h-6 w-6 cursor-pointer justify-self-center' /></button>
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
                                                    <button className="w-full"><FaTrashCan className='h-6 w-6 cursor-pointer justify-self-center' /></button>
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
            </div>
        </div>
    )
}

export default IssuesPage