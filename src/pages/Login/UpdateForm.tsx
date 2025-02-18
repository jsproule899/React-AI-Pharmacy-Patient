import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import useAuth from "@/hooks/useAuth"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router"
import PasswordInput from "./PasswordInput"
import useLogout from "@/hooks/useLogout"


const formSchema = z
    .object({
        password: z.string(),
        confirmPassword: z.string(),
    })
    .superRefine(({ password }, ctx) => {
        const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
        const containsLowercase = (ch: string) => /[a-z]/.test(ch);
        const containsSpecialChar = (ch: string) =>
            /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
        let countOfUpperCase = 0,
            countOfLowerCase = 0,
            countOfNumbers = 0,
            countOfSpecialChar = 0;

        for (let i = 0; i < password.length; i++) {
            let ch = password.charAt(i);
            if (!isNaN(+ch)) countOfNumbers++;
            else if (containsUppercase(ch)) countOfUpperCase++;
            else if (containsLowercase(ch)) countOfLowerCase++;
            else if (containsSpecialChar(ch)) countOfSpecialChar++;
        }

        let errorMessage = '';

        if (password.length < 8) {
            errorMessage += 'Must be at least 8 characters long. \n';
        }
        if (countOfLowerCase < 1) {
            errorMessage += 'Must contain at least one lowercase letter. \n';
        }
        if (countOfUpperCase < 1) {
            errorMessage += 'Must contain at least one uppercase letter. \n';
        }
        if (countOfNumbers < 1) {
            errorMessage += 'Must contain at least one number. \n';
        }
        if (countOfSpecialChar < 1) {
            errorMessage += 'Must contain at least one special character. \n';
        }

        if (errorMessage) {
            ctx.addIssue({
                code: 'custom',
                path: ['password'],
                message: errorMessage,
            });
        }
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                path: ['confirmPassword'],
                message: 'The passwords do not match.',
            });
        }
    });


function UpdateForm() {
    const axiosPrivate = useAxiosPrivate();
    const [errMsg, setErrMsg] = useState("");
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"
    const [searchParams] = useSearchParams();
    const { logout } = useLogout();
    const updateButton = useRef<HTMLButtonElement | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    })

    useEffect(() => {
        auth.isTempPassword ? setErrMsg("You are using a tempory password, please change your password.") : ""
    }, [])

    useEffect(() => {

        if (auth.isTempPassword) {
            navigate('/update-password', { state: { from: location }, replace: true });
        } else if (auth.isAuthenticated) {
            navigate(from, { replace: true });
        }

        const handleBeforeUnload = (event: Event) => {
            const shouldBlock = auth.isTempPassword;
            if (shouldBlock) {
                event.preventDefault();
                logout();
            }
        };

        // Add the event listener
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Clean up the event listener
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [auth.isTempPassword, auth.isAuthenticated, navigate, location, from]);




    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            updateButton.current!.innerHTML = "Updating"
            updateButton.current!.disabled = true;
            const userId = searchParams.get("id")
            const resetToken = searchParams.get("token")

            const res = await axiosPrivate.put('/api/auth/update', {
                resetToken: resetToken,
                email: auth.email,
                userId: userId,
                password: values.password
            },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })

            if (res.status === 200) {
                toast({
                    variant: "success",
                    description: "Password successfully updated."
                })
                navigate(from, { replace: true });

                setAuth((prev) => ({ ...prev, isTempPassword: false }))
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
            updateButton.current!.innerHTML = "Update Password"
            updateButton.current!.disabled = false;
        }


    }


    return (
        <div className="flex flex-col gap-6">
            <Card className="px-10 py-5 w-screen sm:max-w-md ">

                <CardHeader className="pt-4">
                    {errMsg && <Label className="font-semibold text-qub-red dark:text-qub-red border-qub-red border rounded-lg bg-qub-red/10 p-4 animate-in">{errMsg}</Label>}
                    <CardTitle className="text-2xl pt-2">Change Password</CardTitle>
                    <CardDescription className="">
                        To change your password, please complete both password fields.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                control={form.control}
                                name="password"
                                render={({ field, fieldState: { error } }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="password">Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                className={error && "border-qub-red focus-visible:ring-qub-red dark:border-qub-darkred dark:focus-visible:ring-qub-darkred"}
                                                id="password"
                                                {...field}
                                                onSelect={() => { form.trigger("password") }}
                                            />

                                        </FormControl>
                                        {error && <FormMessage className="my-0 whitespace-pre-line">{error.message}</FormMessage>}
                                    </FormItem>

                                )}
                            />

                            <Controller
                                control={form.control}
                                name="confirmPassword"
                                render={({ field, fieldState: { error } }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                className={error && "border-qub-red focus-visible:ring-qub-red dark:border-qub-darkred dark:focus-visible:ring-qub-darkred"}
                                                id="confirmPassword"
                                                {...field}
                                                onSelect={() => { form.trigger("confirmPassword") }}
                                            />
                                        </FormControl>
                                        {error && <FormMessage className="my-0 whitespace-pre-line">{error.message}</FormMessage>}
                                    </FormItem>
                                )}
                            />


                            <Button type="submit" className="w-full" ref={updateButton}>Update Password</Button>

                        </form>
                    </Form>
                </CardContent>
            </Card>

        </div>
    )
}

export default UpdateForm;