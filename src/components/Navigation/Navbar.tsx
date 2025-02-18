import useAuth from '@/hooks/useAuth';
import useLogout from '@/hooks/useLogout';
import { Suspense, useState } from 'react';
import { FaArrowRightToBracket, FaTriangleExclamation, FaUserGraduate, FaUserGroup } from 'react-icons/fa6';
import { LuAudioLines } from "react-icons/lu";
import { Link, NavLink, useNavigate } from 'react-router';
import logoDark from '../../assets/QUB SoP Logo-dark.png';
import logoLight from '../../assets/QUB SoP Logo.png';
import { ModeToggle } from '../Theme/mode-toggle';
import { useTheme } from '../Theme/theme-provider';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';


const NavLinks = ({ toggleMenu }: any) => {
    return (
        <>
            <NavLink to="/" end className={({ isActive }) =>
                isActive ? "text-qub-red" : " text-black hover:text-qub-red dark:text-white dark:hover:text-qub-red"
            } onClick={toggleMenu}>
                Home
            </NavLink>
            <NavLink to="/scenarios" className={({ isActive }) =>
                isActive ? "text-qub-red" : "text-black hover:text-qub-red dark:text-white dark:hover:text-qub-red "
            } onClick={toggleMenu}>
                Scenarios
            </NavLink>
            <NavLink to="/transcripts" className={({ isActive }) =>
                isActive ? "text-qub-red" : "text-black hover:text-qub-red dark:text-white dark:hover:text-qub-red "
            } onClick={toggleMenu}>
                Transcripts
            </NavLink>
        </>
    )
}

const NavUserMenu = ({ auth, isPopOpen, setIsPopOpen, handleLogout, small }: any) => {
    return (
        <div className='flex justify-end gap-2 items-center'>
            {auth?.isAuthenticated || auth.isAuthenticating
                ? <Popover open={isPopOpen}>
                    <PopoverTrigger onClick={() => small && setIsPopOpen(true)}>
                        <Avatar className='cursor-pointer hover:ring-2 ring-qub-red'>
                            <Suspense fallback={<Skeleton className='relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full' />}>
                                {auth.email
                                    ? <AvatarImage src={`https://ui-avatars.com/api/?name=${auth.email?.replace('.', '').charAt(0)}+${auth.email?.replace('.', '').charAt(1)}&background=random`} alt="User Avatar" />
                                    : <AvatarFallback>
                                        {auth.email ?
                                            auth.email?.replace('.', '').substring(0, 2).toUpperCase() :

                                            <Skeleton className='relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full justify-center items-center'>
                                                <FaUserGraduate size={20} />
                                            </Skeleton>
                                        }
                                    </AvatarFallback>
                                }
                            </Suspense>
                        </Avatar>
                    </PopoverTrigger>
                    <PopoverContent className='rounded-none w-screen md:w-fit md:rounded-md bg-stone-100 p-1 relative data-[state=closed]:animate-none data-[state=closed]:opacity-0' onMouseLeave={() => small && setIsPopOpen(false)}>


                        <Label className='font-semibold mx-4 text-lg md:text-sm'>My Account</Label>
                        <Separator className='my-1' />
                        <Link to='/profile'>
                            <div className='flex items-center hover:bg-stone-200 dark:hover:bg-stone-700 px-2 py-1.5 rounded-md cursor-pointer' >
                                <Label className='flex items-center gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-md md:text-sm cursor-pointer'>
                                    <FaUserGraduate className='cursor-auto' />
                                    Profile
                                </Label>


                            </div>
                        </Link>

                        {auth?.roles?.some((role: string) => role === "staff" || role === "admin") &&
                            <>
                                <Separator className='my-1' />
                                <Label className='font-semibold mx-4 text-lg md:text-sm'>Staff</Label>
                                <Separator className='my-1' />
                                <Link to='/issues'>
                                    <div className='flex items-center hover:bg-stone-200 dark:hover:bg-stone-700  px-2 py-1.5 rounded-md cursor-pointer' >
                                        <Label className='flex items-center gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-md md:text-sm cursor-pointer'>
                                            <FaTriangleExclamation  className='cursor-auto' />
                                            Issues
                                        </Label>
                                    </div>
                                </Link>
                                <Link to='/voices'>
                                    <div className='flex items-center hover:bg-stone-200 dark:hover:bg-stone-700  px-2 py-1.5 rounded-md cursor-pointer' >
                                        <Label className='flex items-center gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-md md:text-sm cursor-pointer'>
                                            <LuAudioLines className='cursor-auto' />
                                            Voices
                                        </Label>
                                    </div>
                                </Link>
                                <Link to='/users'>
                                    <div className='flex items-center hover:bg-stone-200 dark:hover:bg-stone-700  px-2 py-1.5 rounded-md cursor-pointer' >
                                        <Label className='flex items-center gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-md md:text-sm cursor-pointer'>
                                            <FaUserGroup   className='cursor-auto' />
                                            Users
                                        </Label>
                                    </div>
                                </Link>
                            </>
                        }
                        <Separator className='my-1' />
                        <Link to='/' onClick={handleLogout}>
                            <div className='flex items-center hover:bg-stone-200 dark:hover:bg-stone-700  px-2 py-1.5 rounded-md cursor-pointer' >
                                <Label className='flex items-center gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-md md:text-sm cursor-pointer'>
                                    <FaArrowRightToBracket className='cursor-auto' />
                                    Log Out
                                </Label>
                            </div>

                        </Link>
                    </PopoverContent>
                </Popover>


                : <Link to='/login'>
                    <Button>
                        Log in
                    </Button>
                </Link>
            }

            <ModeToggle />
        </div>
    )
}


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme } = useTheme()
    const { auth } = useAuth();
    const { logout } = useLogout();
    const navigate = useNavigate();
    const [isPopOpen, setIsPopOpen] = useState(false);

    const toggleMenu = () => {
        setIsPopOpen(false);
        setIsOpen(!isOpen); // Set isPopOpen to false after 1 second
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    return (
        <header className='p-3 sticky flex justify-between bg-stone-50 dark:bg-stone-900 border-b border-stone-900/10 dark:border-stone-50/10 z-30 gap-4'
            onMouseLeave={isOpen ? toggleMenu : () => { }}>

            <a href="/" className=' flex flex-shrink-0 items-center gap-1'>
                <img className='h-14 w-auto' src={theme == 'dark' ? logoDark : logoLight} alt="" />

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

            {/* Navbar Links (Visible on large screens) */}

            <div className='hidden md:flex flex-grow'>
                <nav className='flex-grow space-x-4 lg:space-x-6 p-4 font-bold text-md '>
                    <NavLinks auth={auth} toggleMenu={toggleMenu} />
                </nav>
                <NavUserMenu auth={auth} handleLogout={handleLogout} />

            </div>

            {/* Mobile Menu (Visible on small screens) */}
            <div
                className={`md:hidden absolute left-0 top-20 w-full z-20 bg-stone-50 dark:bg-stone-900 shadow-md transition-all duration-300 ${isOpen ? "block" : "hidden"
                    }`}
            >
                <div className='flex flex-col sm:flex-row text-center justify-between p-4 font-bold  gap-2'>
                    <nav className='flex flex-col sm:space-x-6 sm:flex-row text-left text-2xl sm:text-lg font-bold gap-2 mx-4 '>
                        <NavLinks auth={auth} toggleMenu={toggleMenu} />
                    </nav>
                    <NavUserMenu auth={auth} isPopOpen={isPopOpen} setIsPopOpen={setIsPopOpen} handleLogout={handleLogout} small={true} />

                </div>
            </div >

        </header >
    )
}

export default Navbar;