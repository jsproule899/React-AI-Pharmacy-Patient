import React from 'react'
import { useTheme } from '../Theme/theme-provider'
import { MoonLoader } from 'react-spinners'

function Spinner() {

    const { theme } = useTheme()
    return (

        <div className="flex flex-grow justify-center items-center bg-stone-50 dark:bg-stone-900">
            {theme == 'dark' ? <MoonLoader color={'red'} /> : <MoonLoader />}
            <p className="flex m-4 font-semibold  dark:text-white">Loading...</p>
        </div>

    )
}

export default Spinner