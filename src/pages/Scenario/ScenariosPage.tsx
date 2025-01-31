
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import useScreenSize from '@/hooks/useScreenSize';
import { Scenario } from '@/types/Scenario';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { FaPersonCircleQuestion, FaPlus } from "react-icons/fa6";
import { Link } from 'react-router';
import CardSkeleton from './CardSkeleton';
import ScenarioCard from './ScenarioCard';

const ScenariosHeader = ({ props }: any) => {
    const size = useScreenSize()

    return (
        <div className="flex flex-wrap justify-start py-4 gap-4 items-center mx-4">
            <Link to="/scenarios/add" className=''>
                <Button>  {
                    size.width > 640 ? "Create New" : "New"
                }
                    <FaPlus />
                </Button>
            </Link>

            <div className="flex items-center gap-2 order-1">
                <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">Theme</p>
                <Select
                    value={props.filters.theme}
                    onValueChange={(value) => {
                        props.setFilters((prev: any) => ({ ...prev, theme: value }))
                    }}
                >
                    <SelectTrigger className="h-8 w-[160px]">
                        <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={"all"}>
                            All
                        </SelectItem>

                        {
                            props.themes.map((theme: string, index: number) => (
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


    )
}

function ScenariosPage() {

    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [filtered, setFiltered] = useState<Scenario[]>([]);
    const [filteredAndPaginated, setFilteredAndPaginated] = useState<Scenario[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        theme: "",
        search: ""

    })
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        totalPages: 1,
        pageSize: 12,

    })

    const themes = [...new Set(scenarios?.map(scenario => scenario.Theme))]

    // Fetch scenarios when the component mounts
    const fetchScenarios = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASEURL}/api/scenario`);
            setScenarios(res.data);
            setIsLoading(false); // Data loaded, set loading to false
        } catch (error) {
            console.log(error);
            setIsLoading(false); // Stop loading on error
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem loading the Scenarios. Please try again.",
            })
        }
    };

    useEffect(() => {
        fetchScenarios();
    }, []);

    const filterIssues = useCallback(() => {
        let filteredIssues = [...scenarios];

        // Apply filters
        if (filters.theme && filters.theme !== "all") {
            filteredIssues = filteredIssues.filter((scenario) => scenario.Theme === filters.theme);
        }
        if (filters.search) {
            filteredIssues = filteredIssues.filter((scenario) =>
            (scenario.Context.toLowerCase().includes(filters.search.toLowerCase()) ||
                scenario.Theme.toLowerCase().includes(filters.search.toLowerCase()) ||
                scenario.Name.toLowerCase().includes(filters.search.toLowerCase())
            ))
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
    }, [filters, scenarios, pagination.pageSize, setFiltered, setPagination]);

    useEffect(() => {
        filterIssues();
    }, [filterIssues]);

    useEffect(() => {
        const index = pagination.pageIndex * pagination.pageSize;
        const end = Math.min(index + pagination.pageSize, filtered.length);
        setFilteredAndPaginated(filtered.slice(index, end));
    }, [filtered, pagination.pageIndex, pagination.pageSize]);



    return (
        <div className="flex-grow bg-stone-50 dark:bg-stone-900 relative">
            <ScenariosHeader props={{ themes, filters, setFilters }} />
            {
                isLoading ? <CardSkeleton /> :
                    scenarios.length == 0 ?
                        <div className='flex flex-col justify-center justify-self-center m-4 my-8'>
                            <FaPersonCircleQuestion className='w-24 h-24 m-auto text-stone-950 dark:text-stone-50' />
                            <h2 className='text-2xl font-bold text-stone-950 dark:text-stone-50 my-2 text-center'>No Scenarios found... Please
                                <Link to="/scenarios/add" >
                                    <Button variant="link" className='text-2xl font-extrabold  m-0 px-2 '>
                                        create
                                    </Button>
                                </Link>
                                one or try again later.</h2>
                        </div>
                        :
                        filteredAndPaginated.map((scenario, index) => {
                            return <ScenarioCard key={index} scenario={scenario} onScenarioDeleted={fetchScenarios} />
                        })}

            <div className="flex flex-grow items-center justify-center gap-2 absolute bottom-4 left-0 right-0">
                <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">Rows</p>
                <Select
                    value={`${pagination.pageSize}`}
                    onValueChange={(value) => {
                        setPagination((prev) => ({ ...prev, pageIndex: 0, pageSize: Number(value), totalPages: scenarios.length / Number(value) }))
                        setPagination((prev) => ({ ...prev, }))
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



    )

}

export default ScenariosPage
