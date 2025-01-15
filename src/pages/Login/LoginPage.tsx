import { LoginForm } from '@/components/login-form'

function LoginPage() {
    return (

        <div className="flex-grow bg-stone-50 dark:bg-stone-900">
            <div className='flex justify-center items-center my-10'>
            <LoginForm />
            </div>          
        </div>
    )
}

export default LoginPage