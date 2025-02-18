import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { useRef, useState } from "react"
import { Link } from "react-router"
import { toast } from "@/hooks/use-toast"




const formSchema = z.object({
    identifier: z.string().email().endsWith("qub.ac.uk", { message: "Invalid QUB email, must end with qub.ac.uk " }).min(2, {
        message: "Email must be at least 2 characters.",
    }),
})

interface ResetFormProps {
    setEmailSent: (bool: boolean) => void;
}

function ForgotForm({ setEmailSent }: ResetFormProps) {
    const [errMsg, setErrMsg] = useState();
    const axiosPrivate = useAxiosPrivate();
    const resetButton = useRef<HTMLButtonElement | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: "",
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            resetButton.current!.innerHTML = "Sending..."
            resetButton.current!.disabled = true;

            const res = await axiosPrivate.post('api/auth/reset', { identifier: values.identifier },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                })

            if (res.status === 200) {
                toast({
                    variant:"success",
                    description: "Email successfully sent."
                })
                setEmailSent(true);

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
            resetButton.current!.innerHTML = "Reset Password"
            resetButton.current!.disabled = false;
        }
    }


    return (
        <div className="flex flex-col gap-6">
            <Card className="px-10 py-5 w-screen sm:max-w-md ">

                <CardHeader className="pt-4">
                    {errMsg && <Label className="font-semibold text-qub-red dark:text-qub-red border-qub-red border rounded-lg bg-qub-red/10 p-4 animate-in">{errMsg}</Label>}
                    <CardTitle className="text-2xl pt-2">Reset Password</CardTitle>
                    <CardDescription className="">
                        To reset your password, please enter your email address.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel htmlFor="identifier">Email address</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="identifier"
                                                className="dark:border-1 dark:border-stone-50"

                                                placeholder="jdoe@qub.ac.uk"

                                                {...field}
                                            />

                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" ref={resetButton}>Reset Password</Button>

                        </form>
                    </Form>
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

        </div>
    )
}

export default ForgotForm;