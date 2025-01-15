import { MoonLoader } from 'react-spinners'
import { useTheme } from '../Theme/theme-provider'

function Spinner() {

    const { theme } = useTheme()
    return (

        <div className="flex flex-grow flex-col justify-center items-center bg-stone-50 dark:bg-stone-900">
            {theme == 'dark' ? <MoonLoader color={'red'} /> : <MoonLoader />}
            <p className="flex m-4 font-semibold  dark:text-white">Loading...</p>
        </div>

    )
}

export default Spinner