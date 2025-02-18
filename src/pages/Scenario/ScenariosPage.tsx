import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useScreenSize from "@/hooks/useScreenSize";
import { Scenario } from "@/types/Scenario";
import { keepPreviousData, QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Axios } from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaPersonCircleQuestion, FaPlus } from "react-icons/fa6";
import { Link, Location, NavigateFunction, useLocation, useNavigate } from "react-router";
import CardSkeleton from "./CardSkeleton";
import ScenarioCard from "./ScenarioCard";

const ScenariosHeader = ({ props }: any) => {
    const size = useScreenSize();

    return (
        <div className="flex flex-wrap justify-start py-4 gap-4 items-center mx-4">
            {props.auth?.roles?.some((role: string) => role === "staff" || role === "admin") && (
                <Link to="/scenarios/add" className="">
                    <Button>
                        {" "}
                        {size.width > 640 ? "Create New" : "New"}
                        <FaPlus />
                    </Button>
                </Link>
            )
            }
            <div className="flex items-center gap-2 order-1">
                <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">
                    Theme
                </p>
                <Select
                    value={props.filters.theme}
                    onValueChange={(value) => {
                        props.setFilters((prev: any) => ({ ...prev, theme: value }));
                    }}
                >
                    <SelectTrigger className="h-8 w-[160px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={"all"}>All</SelectItem>

                        {props.themes.map((theme: string, index: number) => (
                            <SelectItem key={index} value={theme}>
                                {theme}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Input
                placeholder="Search..."
                value={props.filters.search || ""}
                onChange={(e) =>
                    props.setFilters((prev: any) => ({ ...prev, search: e.target.value }))
                }
                className="flex items-center gap-2 max-w-sm order-3 md:order-2"
            />
        </div>
    );
};

const getScenarios = async (navigate: NavigateFunction, location: Location<any>, queryClient: QueryClient, axiosPrivate: Axios) => {

    try {
        const res = await axiosPrivate.get(`/api/scenario`, {
            validateStatus: (status) => { return status <= 400 }
        });

        return res.data;
    } catch (err: any) {
        if (!err?.response) {

        } else if (err.response?.status === 401) {
            queryClient.invalidateQueries({ queryKey: ['scenarios'] })
            navigate("/login", { state: { from: location }, replace: true });
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "You must be logged in",
            });
        }
    }
};


function ScenariosPage() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient()
    const { isPending, data: scenarios } = useQuery<Scenario[]>({
        queryKey: ['scenarios'],
        queryFn: () => getScenarios(navigate, location, queryClient, axiosPrivate),
        staleTime: 2 * 60 * 1000,
        placeholderData: keepPreviousData,

    })
    const [filtered, setFiltered] = useState<Scenario[]>([]);
    const [filteredAndPaginated, setFilteredAndPaginated] = useState<Scenario[]>([]);
    const [filters, setFilters] = useState({
        theme: "",
        search: "",
    });
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        totalPages: 1,
        pageSize: 12,
    });

    const themes = [...new Set(scenarios?.map((scenario) => scenario.Theme) || [])];


    const onScenarioDeleted = (id: string) => {
        try {
            deleteScenarioMutation.mutate(id)
        } catch (error) {
            console.error("Error deleting scenario:", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem deleting the scenario. Please try again.",
            })
        }
    };

    const deleteScenarioMutation = useMutation<void, Error, string>({
        mutationFn: async (id: string) => {
            const res = await axiosPrivate.delete(`/api/scenario/${id}`, {
                validateStatus: (status) => { return status <= 400 }
            });
            return res.data;

        },
        onSuccess: (_, id) => {
            queryClient.setQueryData<Scenario[]>(["scenarios"], (oldScenarios = []) =>
                oldScenarios.filter((scenario) => scenario._id !== id)
            );
        },
    });

    const filterScenarios = useCallback(() => {
        let filteredScenarios = [...scenarios || []];

        // Apply filters
        if (filters.theme && filters.theme !== "all") {
            filteredScenarios = filteredScenarios.filter(
                (scenario) => scenario.Theme === filters.theme,
            );
        }
        if (filters.search) {
            filteredScenarios = filteredScenarios.filter(
                (scenario) =>
                    scenario.Context.toLowerCase().includes(
                        filters.search.toLowerCase(),
                    ) ||
                    scenario.Theme.toLowerCase().includes(filters.search.toLowerCase()) ||
                    scenario.Name.toLowerCase().includes(filters.search.toLowerCase()),
            );
        }

        // Update filtered list
        setFiltered(filteredScenarios);

        // Calculate pagination values
        const totalPages = Math.ceil(filteredScenarios.length / pagination.pageSize);
        setPagination((prev) => ({
            ...prev,
            totalPages: totalPages,
            pageIndex: 0,
        }));
    }, [filters, scenarios, pagination.pageSize, setFiltered, setPagination]);

    useEffect(() => {
        filterScenarios();
    }, [filterScenarios]);

    useEffect(() => {
        const index = pagination.pageIndex * pagination.pageSize;
        const end = Math.min(index + pagination.pageSize, filtered.length);
        setFilteredAndPaginated(filtered.slice(index, end));
    }, [filtered, pagination.pageIndex, pagination.pageSize]);

    return (
        <>
            <ScenariosHeader props={{ themes, filters, setFilters, auth }} />
            {isPending ? <CardSkeleton /> :
                scenarios?.length !== 0 ? (
                    <div className="flex flex-wrap mb-16">
                        {filteredAndPaginated.map((scenario, index) => {
                            return (
                                <ScenarioCard
                                    key={index}
                                    scenario={scenario}
                                    onScenarioDeleted={onScenarioDeleted}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col justify-center justify-self-center m-4 my-8">
                        <FaPersonCircleQuestion className="w-24 h-24 m-auto text-stone-950 dark:text-stone-50" />
                        <h2 className="text-2xl font-bold text-stone-950 dark:text-stone-50 my-2 text-center">
                            No Scenarios found... Please
                            <Link to="/scenarios/add">
                                <Button
                                    variant="link"
                                    className="text-2xl font-extrabold  m-0 px-2 "
                                >
                                    create
                                </Button>
                            </Link>
                            one or try again later.
                        </h2>
                    </div>
                )
            }

            <div className="flex flex-grow items-center justify-center gap-2 bottom-16 left-0 right-0">
                <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">
                    Rows
                </p>
                <Select
                    value={`${pagination.pageSize}`}
                    onValueChange={(value) => {
                        setPagination((prev) => ({
                            ...prev,
                            pageIndex: 0,
                            pageSize: Number(value),
                            totalPages: scenarios?.length ? scenarios.length / Number(value) : 0,
                        }));
                        setPagination((prev) => ({ ...prev }));
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={pagination.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[4, 12, 24, 48].map((pageSize) => (
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
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: prev.pageIndex - 1,
                            }))
                        }
                        disabled={pagination.pageIndex - 1 === -1}
                    >
                        Previous
                    </Button>
                    <p className="text-xs inline dark:text-stone-50 ">
                        Page: {pagination.pageIndex + 1} of{" "}
                        {pagination.totalPages === 0 ? 1 : Math.ceil(pagination.totalPages)}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex: prev.pageIndex + 1,
                            }))
                        }
                        disabled={pagination.pageIndex + 1 >= pagination.totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
}

export default ScenariosPage;
