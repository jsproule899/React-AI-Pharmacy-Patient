import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import useAuth from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { jwtDecode } from "jwt-decode"
import React, { useMemo, useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import { useLocation, useNavigate } from "react-router"
import { axiosPrivate } from "./api/axios"
import { AuthJwtPayload } from "./Auth/RequireAuth"
import { Checkbox } from "./ui/checkbox"

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    interface FormElements extends HTMLFormControlsCollection {
        email: HTMLInputElement
        password: HTMLInputElement
    }
    interface LoginFormElement extends HTMLFormElement {
        readonly elements: FormElements
    }

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errMsg, setErrMsg] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"
    var { auth, setAuth, persist, setPersist } = useAuth();
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent<LoginFormElement>) => {
        e.preventDefault();

        try {
            const res = await axiosPrivate.post('/api/auth/login', {
                email: e.currentTarget.elements.email.value,
                password: e.currentTarget.elements.password.value
            },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })
            if (res.status === 200) {

                const accessToken = res?.data?.accessToken;
                const decoded = jwtDecode<AuthJwtPayload>(accessToken);
                const role = decoded.roles;
                const email = decoded.email;
                const studentNo = decoded.studentNo;


                setAuth({ email: email || null, studentNo, roles: role || null, accessToken, isAuthenticated: true, isAuthenticating: false })
                navigate(from, { replace: true })
                console.log(res.data);
            } else {

                toast({
                    variant: "destructive",
                    description: res.data.message
                })
            }
        } catch (err: any) {
            if (err.response?.data) {
                setErrMsg(err.response.data.message)
            } else {
                toast({
                    variant: "destructive",
                    description: err.message
                })
            }
        }
    }

    const togglePassword = () => {
        let password = document.getElementById("password") as HTMLInputElement;
        passwordVisible ? password.type = "password" : password.type = "text";
        setPasswordVisible(!passwordVisible);
    }

    const togglePersist = () => {
        setPersist(prev => !prev)
    }

    useMemo(() => {
        localStorage.setItem('persist', persist as unknown as string)
    }, [persist])

    useMemo(() => {
        if (auth.isAuthenticated) navigate(from, { replace: true })

    }, [auth])
    auth.isAuthenticated

    return (

        !auth.isAuthenticated &&
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="px-10 py-5 w-max max-w-md ">

                <CardHeader className="pt-4">
                    {errMsg && <Label className="font-semibold text-qub-red dark:text-qub-red border-qub-red border rounded-lg bg-qub-red/10 p-4 animate-in">{errMsg}</Label>}
                    <CardTitle className="text-2xl pt-2">Login</CardTitle>
                    <CardDescription className="w-72">
                        To sign into your profile, please enter your email address and password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    className="dark:border-1 dark:border-stone-50"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input className="dark:border-1 dark:border-stone-50 pr-8" id="password" type="password" required />
                                    <Button variant="link" className="absolute top-0 right-0 p-3" type="button" onClick={togglePassword}>
                                        {!passwordVisible ?
                                            <FaRegEye /> :
                                            <FaRegEyeSlash />
                                        }
                                    </Button>

                                </div>

                            </div>

                            <div className="flex items-center gap-2 space-y-1 leading-none pr-24">
                                <Checkbox
                                    checked={persist}
                                    onCheckedChange={togglePersist}
                                />
                                <Label className="" onClick={togglePersist} >
                                    Trust this device?
                                </Label>
                            </div>

                            <Button type="submit" className="w-full">
                                Login
                            </Button>

                        </div>
                    </form>

                </CardContent>
            </Card>

        </div>

    )
}
