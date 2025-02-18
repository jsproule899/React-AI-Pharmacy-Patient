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
import useScreenSize from "@/hooks/useScreenSize";
import { User } from "@/types/User";
import { keepPreviousData, QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios } from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaPlus, FaUserMinus, FaUserPen } from "react-icons/fa6";
import { Link, Location, NavigateFunction, useLocation, useNavigate } from "react-router";

function UsersPage() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const size = useScreenSize();
    const queryClient = useQueryClient()
    const { isPending, data: users } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => getUsers(navigate, location, queryClient, axiosPrivate),
        staleTime: 2 * 60 * 1000,
        placeholderData: keepPreviousData,
    })
    const [filtered, setFiltered] = useState<User[]>([]);
    const [filteredAndPaginated, setFilteredAndPaginated] = useState<User[]>([]);
    const [filters, setFilters] = useState({
        studentNo: "",
        email: "",
        role: "",
        academicYear: "",
        search: ""
    })
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        totalPages: 1,
        pageSize: 10,

    })

    const academicYears = [...new Set(users?.map(user => user.AcademicYear))]
    const roles = [...new Set(users?.flatMap(user => user.Roles))]

    const getUsers = async (navigate: NavigateFunction, location: Location<any>, queryClient: QueryClient, axiosPrivate: Axios) => {

        try {
            const res = await axiosPrivate.get('/api/user', {
                validateStatus: (status) => { return status <= 400 }
            })

            setPagination(prev => ({ ...prev, totalPages: res.data.length / prev.pageSize }))
            return res.data
        } catch (error: any) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem loading the Users. Please try again.",
            })
            if (error.response?.status === 401) {
                queryClient.invalidateQueries({ queryKey: ['users'] })
                navigate("/login", { state: { from: location }, replace: true });
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "You must be logged in",
                });
            }
        }
    }


    const filterUsers = useCallback(() => {
        let filteredUsers = [...users || []];

        // Apply filters
        if (filters.academicYear && filters.academicYear !== "all") {
            filteredUsers = filteredUsers.filter((user) => user.AcademicYear === filters.academicYear);
        }
        if (filters.search) {
            filteredUsers = filteredUsers.filter((user) => {
                var studentNum = user.StudentNo ? user.StudentNo : ""
                return studentNum.toLowerCase().includes(filters.search.toLowerCase()) ||
                    user.Email.toLowerCase().includes(filters.search.toLowerCase())
            });
        }

        if (filters.role && filters.role !== "all") {
            filteredUsers = filteredUsers.filter((user) =>
                user.Roles.includes(filters.role)
            );
        }

        // Update filtered list
        setFiltered(filteredUsers);

        // Calculate pagination values
        const totalPages = Math.ceil(filteredUsers.length / pagination.pageSize);
        setPagination((prev) => ({
            ...prev,
            totalPages: totalPages,
            pageIndex: 0
        }));
    }, [filters, users, pagination.pageSize, setFiltered, setPagination]);

    useEffect(() => {
        filterUsers();
    }, [filterUsers]);

    useEffect(() => {
        const index = pagination.pageIndex * pagination.pageSize;
        const end = Math.min(index + pagination.pageSize, filtered.length);
        setFilteredAndPaginated(filtered.slice(index, end));
    }, [filtered, pagination.pageIndex, pagination.pageSize]);


    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/api/user/${id}`, {
                validateStatus: (status) => { return status <= 400 }
            });

            console.log(`User ${id} removed`);
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem deleting the user. Please try again.",
            })
        }
    };

    const deleteMutation = useMutation({
        mutationFn: (id: string) => handleDelete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['users'] as any);
        }
    })



    if (isPending) {
        return <Spinner />;
    }

    return (

        <div className="w-11/12 mx-auto m-4">
            <div className="flex flex-wrap justify-start py-4 gap-4 ">
                {auth?.roles?.some(role => role === "staff" || role === "admin") && (
                    <Link to="/users/add" className="">
                        <Button>
                            {" "}
                            {size.width > 640 ? "Add Users" : "Add"}
                            <FaPlus />
                        </Button>
                    </Link>
                )
                }
                <Input
                    placeholder="Search for a user..."
                    value={filters.search || ""}
                    onChange={(e) =>
                        setFilters((prev) => ({ ...prev, search: e.target.value }))
                    }
                    className="w-72 order-1 md:order-2"
                />
                <div className="flex flex-col sm:flex-row  items-center gap-2 order-2">
                    <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">Academic Year:</p>
                    <Select
                        value={filters.academicYear}
                        onValueChange={(value) => {
                            setFilters((prev) => ({ ...prev, academicYear: value }))
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
                                academicYears.map((year, index) => (
                                    year
                                    && <SelectItem key={index} value={year}>
                                        {year}
                                    </SelectItem>

                                ))}

                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col sm:flex-row  items-center gap-2 order-3">
                    <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">Role: </p>
                    <Select
                        value={filters.role}
                        onValueChange={(value) => {
                            setFilters((prev) => ({ ...prev, role: value }))
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
                                roles.map((role, index) => (
                                    <SelectItem key={index} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}

                        </SelectContent>
                    </Select>
                </div>

            </div>



            <div className="rounded-md border">
                <Table>
                    <TableCaption>{filtered.length === 0 ? "No users found." : null}</TableCaption>
                    <TableHeader >
                        <TableRow>
                            <TableHead className="pl-10 w-60">Student Number</TableHead>
                            <TableHead className="w-2/12">Email</TableHead>
                            <TableHead className="w-72">Academic Year</TableHead>
                            <TableHead className="">Roles</TableHead>
                            <TableHead className="text-center">Edit</TableHead>
                            <TableHead className=" text-center w-">Remove</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndPaginated.map((user: User, index: number) => {
                            return (
                                <TableRow key={index} className="text-stone-950 dark:text-stone-50">

                                    <TableCell className="pl-10">{user.StudentNo ? user.StudentNo : "-"}</TableCell>

                                    <TableCell>{user.Email}</TableCell>

                                    <TableCell>{user.AcademicYear ? user.AcademicYear : "N/A"}</TableCell>
                                    <TableCell>{user.Roles.map((role, index) => {
                                        if (index === (user.Roles.length - 1))
                                            return role.charAt(0).toUpperCase() + role.substring(1)
                                        return `${role.charAt(0).toUpperCase() + role.substring(1)}, `
                                    })}</TableCell>


                                    <TableCell >
                                        <Link to={{ pathname: `/users/edit/${user._id}` }} >
                                            <FaUserPen  className='h-6 w-6 cursor-pointer justify-self-center' />
                                        </Link>
                                    </TableCell>

                                    <TableCell >
                                        <Dialog>
                                            <DialogTrigger asChild >
                                                <button className="w-full"><FaUserMinus  className='h-6 w-6 cursor-pointer justify-self-center' /></button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle className='text-black dark:text-white'>Are you absolutely sure?</DialogTitle>
                                                    <DialogDescription>
                                                        This action cannot be undone. This will permanently delete this user
                                                        and remove their data from our servers.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter className="sm:justify-center">
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="outline" className='mb-1 px-8 mx-2'>Close</Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="destructive" className='mb-1 px-8 mx-2' onClick={() => deleteMutation.mutate(user._id)}>Delete</Button>
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
                        setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: Number(value), totalPages: users?.length ? users.length / Number(value) : 1 }))
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
        </div >
    )
}


export default UsersPage