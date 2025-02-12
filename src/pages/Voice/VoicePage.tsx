import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSamplePlayer from "@/hooks/useSamplePlayer";
import useScreenSize from "@/hooks/useScreenSize";
import { Voice } from "@/types/Voice";
import { keepPreviousData, QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios } from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaCirclePlay, FaCircleStop, FaPlus, FaRegPenToSquare, FaTrashCan } from "react-icons/fa6";
import { Link, Location, NavigateFunction, useLocation, useNavigate } from "react-router";

function VoicePage() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const size = useScreenSize();
    const {indexPlaying, playSample, stopSample} = useSamplePlayer();
    const queryClient = useQueryClient()
    const { isPending, data: voices } = useQuery<Voice[]>({
        queryKey: ['voices'],
        queryFn: () => getVoices(navigate, location, queryClient, axiosPrivate),
        staleTime: 2 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
    const [filtered, setFiltered] = useState<Voice[]>([]);
    const [filteredAndPaginated, setFilteredAndPaginated] = useState<Voice[]>([]);
    const [filters, setFilters] = useState({
        provider: "",
        description: "",
        name: ""
    })
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        totalPages: 1,
        pageSize: 10,

    })

    const providers = [...new Set(voices?.map(voice => voice.Provider))]

    const getVoices = async (navigate: NavigateFunction, location: Location<any>, queryClient: QueryClient, axiosPrivate: Axios) => {

        try {
            const res = await axiosPrivate.get('/api/voice', {
                validateStatus: (status) => { return status <= 400 }
            })

            setPagination(prev => ({ ...prev, totalPages: res.data.length / prev.pageSize }))
            return res.data
        } catch (error: any) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem loading the Voices. Please try again.",
            })
            if (error.response?.status === 401) {
                queryClient.invalidateQueries({ queryKey: ['voices'] })
                navigate("/login", { state: { from: location }, replace: true });
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "You must be logged in",
                });
            }
        }
    }


    const filterVoices = useCallback(() => {
        let filteredVoices = [...voices || []];

        // Apply filters
        if (filters.provider && filters.provider !== "all") {
            filteredVoices = filteredVoices.filter((voice) => voice.Provider === filters.provider);
        }
        if (filters.description) {
            filteredVoices = filteredVoices.filter((voice) =>
                voice.Description.toLowerCase().includes(filters.description.toLowerCase())
            );
        }
        if (filters.name && filters.name !== "all") {
            filteredVoices = filteredVoices.filter((voice) => voice.Name === filters.name);
        }

        // Update filtered list
        setFiltered(filteredVoices);

        // Calculate pagination values
        const totalPages = Math.ceil(filteredVoices.length / pagination.pageSize);
        setPagination((prev) => ({
            ...prev,
            totalPages: totalPages,
            pageIndex: 0
        }));
    }, [filters, voices, pagination.pageSize, setFiltered, setPagination]);

    useEffect(() => {
        filterVoices();
    }, [filterVoices]);

    useEffect(() => {
        const index = pagination.pageIndex * pagination.pageSize;
        const end = Math.min(index + pagination.pageSize, filtered.length);
        setFilteredAndPaginated(filtered.slice(index, end));
    }, [filtered, pagination.pageIndex, pagination.pageSize]);


    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/api/voice/${id}`, {
                validateStatus: (status) => { return status <= 400 }
            });

            console.log(`Issue ${id} deleted`);
        } catch (error) {
            console.error("Error deleting voice:", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem deleting the voice. Please try again.",
            })
        }
    };

    const deleteMutation = useMutation({
        mutationFn: (id: string) => handleDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['voices'] as any);
        }
    })



    if (isPending) {
        return <Spinner />;
    }

    return (
        <>
  <audio id={`audioPlayer`} />
            <div className="w-11/12 mx-auto m-4">
                <div className="flex flex-wrap justify-start py-4 gap-4 ">
                    {auth?.roles?.includes("staff") || auth?.roles?.includes("superUser") && (
                        <Link to="/voices/add" className="">
                            <Button>
                                {" "}
                                {size.width > 640 ? "Add New" : "Add"}
                                <FaPlus />
                            </Button>
                        </Link>
                    )
                    }
                    <div className="flex flex-col sm:flex-row  items-center gap-2 order-1">

                        <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">Provider</p>
                        <Select
                            value={filters.provider}
                            onValueChange={(value) => {
                                setFilters((prev) => ({ ...prev, provider: value }))
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
                                    providers.map((provider, index) => (
                                        <SelectItem key={index} value={provider}>
                                            {provider}
                                        </SelectItem>
                                    ))}

                            </SelectContent>
                        </Select>
                    </div>
                    <Input
                        placeholder="Search description..."
                        value={filters.description || ""}
                        onChange={(e) =>
                            setFilters((prev) => ({ ...prev, description: e.target.value }))
                        }
                        className="max-w-sm order-3 md:order-2"
                    />

                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableCaption>{filtered.length === 0 ? "No voices found." : null}</TableCaption>
                        <TableHeader >
                            <TableRow>

                                <TableHead className="pl-10">Name</TableHead>
                                <TableHead className="">Provider</TableHead>
                                <TableHead className="">Description</TableHead>
                                <TableHead className="">Voice ID</TableHead>
                                <TableHead className="">Sample</TableHead>
                                <TableHead className="text-center">Edit</TableHead>
                                <TableHead className=" text-center w-">Remove</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndPaginated.map((voice: Voice, index: number) => {
                                return (
                                    <TableRow key={index} className="text-stone-950 dark:text-stone-50">

                                        <TableCell className="pl-10">{voice.Name}</TableCell>

                                        <TableCell>{voice.Provider}</TableCell>

                                        <TableCell><p className="overflow-y-clip max-h-20 cursor-pointer" onClick={(e) => {
                                            let classnames = e.currentTarget.className;
                                            if (classnames === "") { classnames = "overflow-y-clip max-h-20 cursor-pointer"; } else { classnames = "" };
                                            e.currentTarget.className = classnames;
                                        }}>{voice.Description}</p></TableCell>
                                        <TableCell>{voice.VoiceId}</TableCell>

                                        <TableCell >

                                            {indexPlaying !== index
                                                ? <FaCirclePlay className="text-qub-red cursor-pointer hover:text-qub-darkred" size={32} onClick={() => playSample(voice, index)} />
                                                : <FaCircleStop className="text-qub-red cursor-pointer hover:text-qub-darkred" size={32} onClick={() => stopSample()} />
                                            }




                                        </TableCell>
                                      

                                        <TableCell >
                                            <Link to={{ pathname: `/voices/edit/${voice._id}` }} >
                                                <FaRegPenToSquare className='h-6 w-6 cursor-pointer justify-self-center' />
                                            </Link>
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
                                                            This action cannot be undone. This will permanently delete the voice
                                                            and remove your data from our servers.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter className="sm:justify-center">
                                                        <DialogClose asChild>
                                                            <Button type="button" variant="outline" className='mb-1 px-8 mx-2'>Close</Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button type="button" variant="destructive" className='mb-1 px-8 mx-2' onClick={() => deleteMutation.mutate(voice._id)}>Delete</Button>
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
                            setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: Number(value), totalPages: voices?.length ? voices.length / Number(value) : 1 }))
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


export default VoicePage