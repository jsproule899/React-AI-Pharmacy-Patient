
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { Link } from 'react-router';
import CardSkeleton from './CardSkeleton';
import ScenarioCard from './ScenarioCard';


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
        }
    };

    useEffect(() => {
        fetchScenarios(); // Call the fetch function when component mounts
    }, []); // Empty dependency array to run once when the component mounts
    // Show loading spinner while fetching data
    if (isLoading) {
        return <CardSkeleton />;
    }

    return (
        <div className="flex-grow bg-stone-50 dark:bg-stone-900 ">
            <div className='relative p-4'>
                <Link to="/scenarios/add" className='absolute m-4 left-0 top-0'>
                    <Button>
                        Create New
                        <FaPlus />
                    </Button>
                </Link>

            </div>
            <div className='flex justify-start  flex-wrap m-4'>
                {scenarios.map((scenario, index) => {
                    return <ScenarioCard key={index} scenario={scenario} onScenarioDeleted={fetchScenarios} />;
                })}
            </div>
        </div>
    )

}

export default Scenarios