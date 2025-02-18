import { useLocation } from 'react-router';
import UserForm from './UserForm';



function UserFormPage() {

    const location = useLocation();
    return (
        <div className="flex-grow flex-col bg-stone-50 dark:bg-stone-900">
            <h1 className="text-black dark:text-white text-2xl mx-10 my-6 font-semibold ">{location.pathname.includes("add") ? "Add a new " : "Update the"} User</h1>
            <div className='md:w-8/12'>
                <UserForm />
            </div>

        </div>
    )
}

export default UserFormPage