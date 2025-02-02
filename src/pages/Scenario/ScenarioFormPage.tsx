import { useLocation } from 'react-router';
import ScenarioForm from './ScenarioForm'

function ScenarioFormPage() {

    const location = useLocation();
    return (
        <div className="flex-grow flex-col bg-stone-50 dark:bg-stone-900">
            <h1 className="text-black dark:text-white text-2xl mx-10 my-6 font-semibold ">{location.pathname.includes("add") ? "Create a new ": "Update the"} Role-Play Scenario</h1>
            <div className='md:w-8/12'>
                <ScenarioForm />
            </div>

        </div>
    )
}

export default ScenarioFormPage