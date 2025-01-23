
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaPersonCircleQuestion, FaPlus } from "react-icons/fa6";
import { Link } from 'react-router';
import CardSkeleton from './CardSkeleton';
import ScenarioCard from './ScenarioCard';

const ScenariosHeader = () => {
    return (
        <div className='relative p-4 mx-4 mb-4 '>
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
                description: "There was a problem loading the Scenarios. Please try again.",
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
                        scenarios.map((scenario, index) => {
                            return <ScenarioCard key={index} scenario={scenario} onScenarioDeleted={fetchScenarios} />
                        })}

        </div>
    )

}

export default Scenarios