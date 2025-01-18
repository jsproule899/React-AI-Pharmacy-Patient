import { Link, NavLink } from 'react-router';
import logo from '../../assets/QUB SoP Logo.png';
import logoDark from '../../assets/QUB SoP Logo-dark.png';
import { Button } from '../ui/button';
import { ModeToggle } from '../Theme/mode-toggle';
import { useTheme } from '../Theme/theme-provider';
import { useState } from 'react';



const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme } = useTheme()

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className='p-3 sticky flex justify-between bg-stone-50 dark:bg-stone-900 border-b border-stone-900/10 dark:border-stone-50/10 z-30' 
    onMouseLeave={ isOpen ? toggleMenu: ()=>{}}>

            <a href="/" className=' flex flex-shrink-0 items-center gap-1'>
                <img className='h-14 w-auto' src={theme == 'dark' ? logoDark : logo} alt="" />
            </a>

            {/* Burger Menu Button */}
            <button
                className="md:hidden flex flex-col space-y-1.5 justify-center items-center  "
                onClick={toggleMenu}
            >
                <div
                    className={`w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : ""
                        }`}
                ></div>
                <div
                    className={`w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""
                        }`}
                ></div>
                <div
                    className={`w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : ""
                        }`}
                ></div>

            </button>

            {/* Navbar Links (Visible on medium screens) */}

            <div className='hidden md:flex flex-grow '>
                <nav className='flex-grow space-x-6 p-4 font-bold text-lg '>
                    <NavLink to="/" end className={({ isActive }) =>
                        isActive ? "text-red-600 text "  : " text-black hover:text-red-600 dark:text-white dark:hover:text-red-600"
                    }>
                        Home
                    </NavLink>
                    <NavLink to="/scenarios" className={({ isActive }) =>
                        isActive ? "text-red-600" : "text-black hover:text-red-600 dark:text-white dark:hover:text-red-600 "
                    }>
                        Scenarios
                    </NavLink>
                    <NavLink to="/transcripts" className={({ isActive }) =>
                        isActive ? "text-red-600" : "text-black hover:text-red-600 dark:text-white dark:hover:text-red-600 "
                    }>
                        Transcripts
                    </NavLink>
                    <NavLink to="/issues" className={({ isActive }) =>
                        isActive ? "text-red-600" : "text-black hover:text-red-600 dark:text-white dark:hover:text-red-600 "
                    }>
                        Issues
                    </NavLink>
                </nav>

                <div className='flex justify-between self-center mx-3'>
                    <Link to='/login'>
                        <Button>
                            Log in
                        </Button>
                    </Link>

                </div>

                <div className="flex self-center mx-1">
                    <ModeToggle />
                </div>
            </div>

            {/* Mobile Menu (Visible on small screens) */}
            <div
                className={`md:hidden absolute left-0 top-20 w-full z-20 bg-stone-50 dark:bg-stone-900 shadow-md transition-all duration-300 ${isOpen ? "block" : "hidden"
                    }`}
                 >
                <div className='flex flex-wrap space-x-6 p-4 font-bold '>
                    <nav className='block md:flex space-x-6 p-4 font-bold '>
                        <NavLink to="/" end className={({ isActive }) =>
                            isActive ? "text-red-600" : "text-black hover:text-red-600 dark:text-white dark:hover:text-red-600"
                        } onClick={toggleMenu}>
                            Home
                        </NavLink>
                        <NavLink to="/scenarios" className={({ isActive }) =>
                            isActive ? "text-red-600" : "text-black hover:text-red-600 dark:text-white dark:hover:text-red-600 "
                        } onClick={toggleMenu}>
                            Scenarios
                        </NavLink>
                        <NavLink to="/transcripts" className={({ isActive }) =>
                            isActive ? "text-red-600" : "text-black hover:text-red-600 dark:text-white dark:hover:text-red-600 "
                        } onClick={toggleMenu}>
                            Transcripts
                        </NavLink>
                        <NavLink to="/issues" className={({ isActive }) =>
                        isActive ? "text-red-600" : "text-black hover:text-red-600 dark:text-white dark:hover:text-red-600 "
                    } onClick={toggleMenu}>
                        Issues
                    </NavLink>
                    </nav>

                    <div className='flex justify-between self-center mx-3'>

                        <Link to='/login' onClick={toggleMenu}>
                            <Button>
                                Log in
                            </Button>
                        </Link>


                    </div>

                    <div className="flex flex-end self-center mx-1">
                        <ModeToggle />
                    </div>
                </div>

            </div>

        </header>
    )
}

export default Navbar;