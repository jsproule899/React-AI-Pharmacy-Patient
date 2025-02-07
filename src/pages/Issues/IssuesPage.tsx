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
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Issue } from "@/types/issue";
import { keepPreviousData, QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios } from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaListCheck, FaRegPenToSquare, FaTrashCan } from "react-icons/fa6";
import { Link, Location, NavigateFunction, useLocation, useNavigate } from "react-router";


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
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient()
    const { isPending, error, isError, data: issues } = useQuery<Issue[]>({
        queryKey: ['issues'],
        queryFn: () => getIssues(navigate, location, queryClient, axiosPrivate),
        staleTime: 2 * 60 * 1000,
        placeholderData: keepPreviousData,

    })
    const [filtered, setFiltered] = useState<Issue[]>([]);
    const [filteredAndPaginated, setFilteredAndPaginated] = useState<Issue[]>([]);
    const [selectedStatus, setSelectedStatus] = useState("NEW");
    const [filters, setFilters] = useState({
        category: "",
        status: "",
        detail: ""
    })
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        totalPages: 1,
        pageSize: 10,

    })

    const categories = [...new Set(issues?.map(issue => issue.Category))]

    const getIssues = async (navigate: NavigateFunction, location: Location<any>, queryClient: QueryClient, axiosPrivate: Axios) => {

        try {
            const res = await axiosPrivate.get('/api/issue', {
                validateStatus: (status) => { return status <= 400 }
            })

            setPagination(prev => ({ ...prev, totalPages: res.data.length / prev.pageSize }))
            return res.data
        } catch (error: any) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem loading the issues. Please try again.",
            })
            if (error.response?.status === 401) {
                queryClient.invalidateQueries({ queryKey: ['issues'] })
                navigate("/login", { state: { from: location }, replace: true });
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "You must be logged in",
                });
            }
        }
    }


    const filterIssues = useCallback(() => {
        let filteredIssues = [...issues || []];

        // Apply filters
        if (filters.category && filters.category !== "all") {
            filteredIssues = filteredIssues.filter((issue) => issue.Category === filters.category);
        }
        if (filters.detail) {
            filteredIssues = filteredIssues.filter((issue) =>
                issue.Details.toLowerCase().includes(filters.detail.toLowerCase())
            );
        }
        if (filters.status && filters.status !== "all") {
            filteredIssues = filteredIssues.filter((issue) => issue.Status === filters.status);
        }

        // Update filtered list
        setFiltered(filteredIssues);

        // Calculate pagination values
        const totalPages = Math.ceil(filteredIssues.length / pagination.pageSize);
        setPagination((prev) => ({
            ...prev,
            totalPages: totalPages,
            pageIndex: 0
        }));
    }, [filters, issues, pagination.pageSize, setFiltered, setPagination]);

    useEffect(() => {
        filterIssues();
    }, [filterIssues]);

    useEffect(() => {
        const index = pagination.pageIndex * pagination.pageSize;
        const end = Math.min(index + pagination.pageSize, filtered.length);
        setFilteredAndPaginated(filtered.slice(index, end));
    }, [filtered, pagination.pageIndex, pagination.pageSize]);




    const handleStatusUpdate = async (id: String | undefined) => {
        if (!id) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem updating the issue. Please try again.",
            })
        }

        try {
            await axiosPrivate.put(`/api/issue/${id}`, { Status: selectedStatus }, {
                validateStatus: (status) => { return status <= 400 }
            });

        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem updating the issue. Please try again.",
            })
        }
    }

    const updateStatusMutation = useMutation({
        mutationFn: (id: string) => handleStatusUpdate(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['issues'] as any);
        }
    })

    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/api/issue/${id}`, {
                validateStatus: (status) => { return status <= 400 }
            });

            console.log(`Issue ${id} deleted`);
        } catch (error) {
            console.error("Error deleting issue:", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem deleting the issue. Please try again.",
            })
        }
    };

    const deleteMutation = useMutation({
        mutationFn: (id: string) => handleDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['issues'] as any);
        }
    })

    if (isPending) {
        return <Spinner />;
    }

    return (
        <>
            <div className="w-11/12 mx-auto m-4">
                <div className="flex flex-wrap justify-start py-4 gap-4 ">
                    <div className="flex flex-col sm:flex-row  items-center gap-2 order-1">
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
                        className="max-w-sm order-3 md:order-2"
                    />
                    <div className="flex flex-col sm:flex-row  items-center order-2 md:order-3  gap-2">
                        <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">Status</p>
                        <Select
                            value={filters.status}
                            onValueChange={(value) => {
                                setFilters((prev) => ({ ...prev, status: value }))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[140px]">
                                <SelectValue placeholder="Select" />
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
                        <TableCaption>{filtered.length === 0 ? "No issues found." : null}</TableCaption>
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
                            {filteredAndPaginated.map((issue: Issue, index: number) => {
                                return (
                                    <TableRow key={index} className="text-stone-950 dark:text-stone-50">
                                        <TableCell className="font-medium">#{issues?.indexOf(issue) || 0 + 1}</TableCell>

                                        <TableCell>{issue.Category}</TableCell>
                                        <TableCell><p className="overflow-y-clip max-h-20 cursor-pointer" onClick={(e) => {
                                            let classnames = e.currentTarget.className;
                                            if (classnames === "") { classnames = "overflow-y-clip max-h-20 cursor-pointer"; } else { classnames = "" };
                                            e.currentTarget.className = classnames;
                                        }}>{issue.Details}</p></TableCell>
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
                                                            <Button className="m-2 w-full" onClick={() => { updateStatusMutation.mutate(issue._id) }}>Save</Button>
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
                                                            <Button type="button" variant="destructive" className='mb-1 px-8 mx-2' onClick={() => deleteMutation.mutate(issue._id)}>Delete</Button>
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

                <div className="flex items-center justify-end gap-2">
                    <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">Rows</p>
                    <Select
                        value={`${pagination.pageSize}`}
                        onValueChange={(value) => {
                            setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: Number(value), totalPages: issues?.length ? issues.length / Number(value) : 1 }))
                            setPagination((prev) => ({ ...prev, }))
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[1, 10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="space-x-2 my-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPagination(((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 })))}
                            disabled={pagination.pageIndex - 1 === -1}
                        >
                            Previous
                        </Button>
                        <p className="text-xs inline dark:text-stone-50 ">Page: {pagination.pageIndex + 1} of {pagination.totalPages === 0 ? 1 : Math.ceil(pagination.totalPages)}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPagination(((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 })))}
                            disabled={pagination.pageIndex + 1 >= pagination.totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default IssuesPage