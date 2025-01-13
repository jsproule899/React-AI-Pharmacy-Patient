
import { Button } from '@/components/ui/button';
import ScenarioCard from './ScenarioCard';
import { FaPlus } from "react-icons/fa6";
import { Link } from 'react-router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/Spinner';


let scenarios = [
    {
        id: 1,
        Context: "Mr Richardson would like 'something good' to get rid of the flu.",
        Name: "Mr Richardson",
        Self: false,
        Other_Person: {
            Name: "Keith",
            Age: "35",
            Gender: "Male",
            Relationship: "Son"
        },
        Age: "62",
        Gender: "Female",
        Medicines: "a white tablet for blood pressure",
        AdditionalMeds: "Tried wifes benylin to help get a good night sleep",
        History: "Nasal congestion, sore head",
        Symptoms: "Sneezed and had a runny nose initially, now it is blocked. Also have a sore head. No cough or high temperature",
        Allergies: "penicillin",
        Time: "3 days",
        Outcome: "treat",
        AI: "OpenAI",
        Model: "gpt-4o-mini",
        TTS: "Unreal Speech",
        Voice: "Liv",
        Avatar: "male_01",
        createdAt: "2024-12-25 11:13:00"
    },
    {
        id: 2,
        Context: "scenario 2",
        createdAt: "2022-03-25 11:13:00"
    },
    {
        id: 3,
        Context: "scenario 3",
        createdAt: "2022-03-25 11:13:00"
    }
]



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
        return <Spinner />;
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
            <div className='flex justify-start  flex-wrap p m-4'>
                {scenarios.map((scenario, index) => {
                    return <ScenarioCard key={index} scenario={scenario} onScenarioDeleted={fetchScenarios}  />;
                })}
            </div>
        </div>
    )

}

export default Scenarios