"use client"

import { axiosPrivate } from "@/components/api/axios";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Spinner from '@/components/ui/Spinner';
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";


const formSchema = z.object({
    Name: z.string().max(100).min(1, "Required"),
    Description: z.string().max(250).min(1, "Required"),
    ModelId: z.string().max(50).min(1, "Required"),
    Provider: z.enum(["DeepSeek", "Claude", "OpenAI"])

})



type FormValues = z.infer<typeof formSchema>;

function ModelForm() {
    const queryClient = useQueryClient()
    const { id } = useParams<{ id?: string }>(); // The `id` parameter will be undefined if it's an add form
    const [modelData, setModelData] = useState<FormValues | null>(null);

    const { toast } = useToast()

    const navigate = useNavigate();

    // 1. Define your form.
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Name: "",
            Description: "",
            ModelId: "",
            Provider: undefined,

        },
    })

    // Fetch the existing Model data if editing
    useEffect(() => {
        if (id) {
            axiosPrivate
                .get(`/api/model/${id}`)
                .then((response) => {
                    setModelData(response.data);
                    form.reset(response.data); // Pre-fill the form with the fetched data
                })
                .catch((error) => {
                    console.error("Error fetching Model data", error);
                });
        }
    }, [id]);




    // Handle form submission
    const onSubmit = async (values: FormValues) => {
        try {
            if (id) {
                // Update the existing Model
                axiosPrivate.put(`/api/model/${id}`, values).then((res) => {
                    if (res.status.toString().startsWith("20")) {
                        toast({
                            variant:"success",
                            description: "Model successfully updated."
                        })
                    }
                });
                toast({
                    description: "Model updating..."
                })
            } else {
                // Create a new Model
                axiosPrivate.post('/api/model', values, {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if (res.status.toString().startsWith("20")) {
                        toast({
                            variant:"success",
                            description: "Model successfully added."
                        })
                    }
                })
                toast({
                    description: "Adding Model..."
                })

            }
            queryClient.invalidateQueries(['models'] as any);
            navigate("/models"); // Navigate to the Models list after successful submission

        } catch (error) {
            console.error("Error saving Model", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request. Please try again.",

            })
        }
    };

    if (id && !modelData) {
        return <Spinner />;
    }

    return (



        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 mx-10 mb-4">
                <FormField
                    control={form.control}
                    name="Name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input className=" lg:w-96" type="text" placeholder="Model Name" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="Description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Model Description</FormLabel>
                            <FormDescription>
                                This is a short description for the Model.
                            </FormDescription>
                            <FormControl>
                                <Input className=" lg:w-96" type="text" placeholder="Balanced for intelligence, speed, and cost" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="ModelId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel >Model ID</FormLabel>
                            <FormControl>
                                <Input className=" lg:w-96" placeholder="Full model version" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="Provider"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel >Provider</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-[140px] ">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                                    <SelectItem value="Claude">Claude</SelectItem>
                                    <SelectItem value="DeepSeek">DeepSeek</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />





                <div className='flex-col flex md:flex-row gap-x-2 items-center'>
                    <Button className="flex min-w-24 mx-12 my-2 md:mx-2" type="submit">{id ? "Update" : "Create"}</Button>
                    <Button variant="destructive" className="flex min-w-24 my-2 mx-12 md:mx-2" type='button' onClick={() => navigate(-1)}>Cancel</Button>
                </div>

            </form>


        </Form>
    )
}

export default ModelForm