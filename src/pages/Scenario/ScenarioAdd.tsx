import React from 'react'
import ScenarioForm from './ScenarioForm'

function ScenarioAdd() {
    return (
        <div className="flex-grow flex-col bg-stone-50 dark:bg-stone-900">
            <h1 className="text-black dark:text-white text-2xl m-6 font-semibold ">Create a new Role-Play Scenario</h1>
            <div className='md:w-8/12 '>
            <ScenarioForm/>
            </div>
            
        </div>
    )
}

export default ScenarioAdd