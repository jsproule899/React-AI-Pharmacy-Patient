import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import useAuth from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { jwtDecode } from "jwt-decode"
import React, { useMemo, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router"
import { axiosPrivate } from "../../components/api/axios"
import { AuthJwtPayload } from "../../components/Auth/RequireAuth"
import { Checkbox } from "../../components/ui/checkbox"
import PasswordInput from "./PasswordInput"

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {

    interface FormElements extends HTMLFormControlsCollection {
        identifier: HTMLInputElement
        password: HTMLInputElement
    }
    interface LoginFormElement extends HTMLFormElement {
        readonly elements: FormElements
    }

    const [errMsg, setErrMsg] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"
    var { auth, setAuth, persist, setPersist } = useAuth();
    const { toast } = useToast()
    const LoginButton = useRef<HTMLButtonElement | null>(null)

    const handleSubmit = async (e: React.FormEvent<LoginFormElement>) => {
        e.preventDefault();
        LoginButton.current!.innerHTML = "Logging in..."
        LoginButton.current!.disabled = true;
        try {
            const res = await axiosPrivate.post('/api/auth/login', {
                identifier: e.currentTarget.elements.identifier.value.toString().toLowerCase(),
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
                const tempPassword = decoded.tempPassword;
               


                setAuth({ email: email || null, studentNo, roles: role || null, accessToken, isAuthenticated: true, isAuthenticating: false, isTempPassword: tempPassword || false})
                if (tempPassword) {navigate("/update-password", { state: { from: location }, replace: true })}
                else {
                    navigate(from, { replace: true })
                }
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
        } finally {
            LoginButton.current!.innerHTML = "Log in"
            LoginButton.current!.disabled = false;
        }
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
            <Card className="px-10 py-5 w-screen sm:max-w-md ">

                <CardHeader className="pt-4">
                    {errMsg && <Label className="font-semibold text-qub-red dark:text-qub-red border-qub-red border rounded-lg bg-qub-red/10 p-4 animate-in">{errMsg}</Label>}
                    <CardTitle className="text-2xl pt-2">Login</CardTitle>
                    <CardDescription className="">
                        To sign into your profile, please enter your email address or student number and password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="identifier">Email or Student No.</Label>
                                <Input
                                    id="identifier"
                                    className="dark:border-1 dark:border-stone-50"

                                    placeholder="jdoe@qub.ac.uk"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <PasswordInput id="password" />

                            </div>

                            <div className="flex items-center gap-2 space-y-1 leading-none pr-24">
                                <Checkbox
                                    checked={persist}
                                    onCheckedChange={togglePersist}
                                />
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <Label className="hover:underline" onClick={togglePersist} >
                                            Trust this device?
                                        </Label>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="dark:bg-stone-900">
                                        <p className="text-xs">
                                            Reduces the number of times you're asked to sign in on this device.
                                            To keep your account secure, use this option only on your personal computer or device.
                                        </p>

                                    </HoverCardContent>
                                </HoverCard>

                            </div>

                            <Button type="submit" className="w-full" ref={LoginButton}>
                                Login
                            </Button>

                        </div>
                    </form>

                </CardContent>
            </Card>

        </div>

    )
}
