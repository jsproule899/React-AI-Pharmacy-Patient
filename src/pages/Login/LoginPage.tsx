import { LoginForm } from '@/pages/Login/login-form'
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router';

function LoginPage() {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"
    useEffect(() => {
      
        if (auth.isTempPassword) {
            // Redirect to update password page if the user has a temporary password
            navigate("/update-password", { state: { from: location }, replace: true });
        } else if (auth.isAuthenticated) {
            // Redirect to the intended page if the user is authenticated
            navigate(from, { replace: true });
        }

    }, [auth.isTempPassword, auth.isAuthenticated, navigate, location, from])
    return (

        <div className="flex-grow bg-stone-50 dark:bg-stone-900">
            <div className='flex flex-col gap-8 justify-center items-center my-10'>
                <LoginForm />
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

export default LoginPage