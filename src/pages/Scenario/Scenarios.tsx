
import { Button } from '@/components/ui/button';
import ScenarioCard from './ScenarioCard';
import { FaPlus } from "react-icons/fa6";
import { Link } from 'react-router';


const scenarios = [
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
        img: "avatar_male_01.png",
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
                    return <ScenarioCard key={index} scenario={scenario} />;
                })}
            </div>
        </div>
    )
}

export default Scenarios