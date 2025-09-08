"use client"

import { axiosPrivate } from "@/components/api/axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from '@/components/ui/Spinner';
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";


const formSchema = z.object({
    StudentNo: z.string().max(100).min(1, "Required"),
    Email: z.string().email()
        .max(250, { message: "Email must be no longer than 250 characters" })
        .min(11, { message: "Email must be at least 11 characters." })
        .endsWith("qub.ac.uk", { message: "Invalid QUB email, must end with qub.ac.uk " }),
    AcademicYear: z.string().max(50).min(1, "Required"),
    Roles: z.enum(["student", "staff", "admin"]).array().refine((value) => value.some((item) => item), {
        message: "You have to select at least one role.",
    }),
})



type FormValues = z.infer<typeof formSchema>;

function UserForm() {
    const queryClient = useQueryClient();
    const { auth } = useAuth();
    const { id } = useParams<{ id?: string }>(); // The id parameter will be undefined if it's an add form
    const [userData, setUserData] = useState<FormValues | null>(null);

    const { toast } = useToast()

    const navigate = useNavigate();

    // 1. Define your form.
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            StudentNo: "",
            Email: "",
            AcademicYear: "",
            Roles: ["student"]
        },
    })

    // Fetch the existing User data if editing
    useEffect(() => {
        if (id) {
            axiosPrivate
                .get(`/api/user/${id}`)
                .then((response) => {
                    setUserData(response.data);
                    form.reset(response.data); // Pre-fill the form with the fetched data
                })
                .catch((error) => {
                    console.error("Error fetching User data", error);
                });
        }

    }, [id]);

    useLayoutEffect(() => {
        var adminRoleBox = (document.getElementById('role-2') as HTMLButtonElement)
        if (adminRoleBox)
            !auth.roles?.includes('admin') ? adminRoleBox.disabled = true : adminRoleBox.disabled = false
    })


    // Handle form submission
    const onSubmit = async (values: FormValues) => {
        try {
            if (id) {
                // Update the existing user
                axiosPrivate.put(`/api/user/${id}`, values).then((res) => {
                    if (res.status.toString().startsWith("20")) {
                        toast({
                            description: "Account successfully updated."
                        })
                    }
                });
                toast({
                    description: "Account updating..."
                })
            } else {
                // Create a new user
                axiosPrivate.post('/api/auth/register', values, {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if (res.status.toString().startsWith("20")) {
                        queryClient.invalidateQueries(['users'] as any);
                        navigate("/users"); // Navigate to the users list after successful submission
                        toast({
                            description: "User successfully added."
                        })
                    }
                }).catch((err) => {
                    toast({
                        variant: "destructive",
                        description: "Failed. " + err.response.data.message
                    })
                })
                toast({
                    description: "Adding User..."
                })

            }

        } catch (error) {
            console.error("Error saving User", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request. Please try again.",

            })
        }
    };

    if (id && !userData) {
        return <Spinner />;
    }

    return (



        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 mb-4">
                <FormField
                    control={form.control}
                    name="StudentNo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Student Number</FormLabel>
                            <FormControl>
                                <Input className=" lg:w-96 bg-stone-50 dark:bg-stone-900 " type="text" placeholder="00000000" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="Email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Addresss</FormLabel>
                            <FormControl>
                                <Input className=" lg:w-96  bg-stone-50 dark:bg-stone-900 " type="text" placeholder="student@qub.ac.uk" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="AcademicYear"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel >Academic Year</FormLabel>
                            <FormControl>
                                <Input className=" lg:w-96  bg-stone-50 dark:bg-stone-900 " placeholder="2024/25" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="Roles"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Roles</FormLabel>
                                <FormDescription>
                                    Select the users roles.
                                </FormDescription>
                            </div>
                            {["student", "staff", "admin"].map((role, index) => (
                                <FormField
                                    key={index}
                                    control={form.control}
                                    name="Roles"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={index}
                                                className="flex flex-row roles-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        id={`role-${index}`}
                                                        checked={field.value?.includes(role as any)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, role])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                        (value) => value !== role
                                                                    )
                                                                )
                                                        }}

                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                    {role.charAt(0).toUpperCase() + role.substring(1)}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />





                <div className='flex-col flex md:flex-row gap-x-2 items-center'>
                    <Button className="flex min-w-full md:min-w-24 mx-12 my-2 md:mx-2" type="submit">{id ? "Update" : "Create"}</Button>
                    <Button variant="destructive" className="flex min-w-full md:min-w-24 my-2 mx-12 md:mx-2" type='button' onClick={() => navigate(-1)}>Cancel</Button>
                </div>

            </form>


        </Form>
    )
}

export default UserForm