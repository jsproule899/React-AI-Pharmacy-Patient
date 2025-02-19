import { Link, useLocation } from 'react-router';
import UserForm from './UserForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaArrowLeft } from 'react-icons/fa6';



function UserFormPage() {

    const location = useLocation();
    return (
        <div className="md:p-6 flex flex-col flex-grow md:mx-10">
            <Link to="/users" className='w-fit'>
                <Button variant={"link"}>
                    <FaArrowLeft />
                    Back
                </Button>
            </Link>
            <div className="flex flex-col mx-auto mb-10">
                <Card className="w-svw sm:w-[28rem]">
                    <CardHeader>
                        <CardTitle>{location.pathname.includes("add") ? "Add a new " : "Update the"} User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UserForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default UserFormPage