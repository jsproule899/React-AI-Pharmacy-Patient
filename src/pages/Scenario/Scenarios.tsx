
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { Link } from 'react-router';
import CardSkeleton from './CardSkeleton';
import ScenarioCard from './ScenarioCard';
import { toast } from '@/hooks/use-toast';

const ScenariosHeader = () => {
    return (
        <div className='relative p-4 mx-4'>
            <Link to="/scenarios/add" className='absolute my-3 mx-4 left-0 top-0'>
                <Button>
                    Create New
                    <FaPlus />
                </Button>
            </Link>

        </div>
    )
}

function Scenarios() {

    const [scenarios, setScenarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                description: "There was a problem loading the issues. Please try again.",
            })
        }
    };

    useEffect(() => {
        fetchScenarios();
    }, []);


    return (
        <div className="flex-grow bg-stone-50 dark:bg-stone-900 ">
            <ScenariosHeader />
            {
                isLoading ? <CardSkeleton /> :
                    scenarios.length == 0 ?
                        <div className='flex justify-center m-4'>
                            <h2 className='text-2xl font-bold text-stone-950 dark:text-stone-50'>No Scenarios found... Please create one or try again later.</h2>
                        </div>
                        :
                        scenarios.map((scenario, index) => {

                            return (

                                <div className='inline-block m-4'>
                                        <ScenarioCard key={index} scenario={scenario} onScenarioDeleted={fetchScenarios} />
                                </div>
                            )
                        })}

        </div>
    )

}

export default Scenarios