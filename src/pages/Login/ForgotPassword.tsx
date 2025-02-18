import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ForgotForm from './ForgotForm';
import { useState } from 'react';
import { Link } from 'react-router';

function EmailSent() {
    return (
        <div className="flex flex-col gap-6">
            <Card className="px-10 py-5 w-screen sm:max-w-md ">

                <CardHeader className="pt-4">
                    <CardTitle className="text-2xl pt-2 text-center">We've sent you an email to reset your password</CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col gap-4'>
                    <p>
                        You will receive an email from us in the next few minutes. Click on the link in the email to change your password.
                    </p>
                    <p>
                        If you can't see an email from us in your inbox, please check your junk mail folder as it may have been mistakenly categorised as spam or try a different email address.
                    </p>
                    <div className="flex mt-4 justify-center">
                        <Link
                            to="/login"
                            className="mx-auto text-sm underline-offset-4 hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

function ForgotPassword() {
    const [emailSent, setEmailSent] = useState(false);

    return (

        <div className="flex-grow bg-stone-50 dark:bg-stone-900">
            <div className='flex flex-col gap-8 justify-center items-center my-10'>
                {
                    !emailSent ? <ForgotForm setEmailSent={setEmailSent} /> : <EmailSent />
                }

                <div className='max-w-xl bg-stone-100 dark:bg-stone-800/60 rounded-lg py-8 px-4 border-stone-200 dark:border-stone-900 border shadow-sm'>
                    <h2 className='font-bold text-md dark:text-stone-50 mb-2'>QUB Security Notice</h2>
                    <p className='text-sm dark:text-stone-50'>
                        This system is for the use of authorized personnel only. All QUB systems are subject to monitoring for unauthorized access, misuse, or violations of QUB policy. Access or use of this system by any person constitutes consent to these terms.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword