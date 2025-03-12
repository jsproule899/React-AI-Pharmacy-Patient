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
    VoiceId: z.string().max(50).min(1, "Required"),
    Provider: z.enum(["Unreal Speech", "Eleven Labs", "OpenAI"])

})



type FormValues = z.infer<typeof formSchema>;

function VoiceForm() {
    const queryClient = useQueryClient()
    const { id } = useParams<{ id?: string }>(); // The `id` parameter will be undefined if it's an add form
    const [voiceData, setVoiceData] = useState<FormValues | null>(null);

    const { toast } = useToast()

    const navigate = useNavigate();

    // 1. Define your form.
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Name: "",
            Description: "",
            VoiceId: "",
            Provider: undefined,

        },
    })

    // Fetch the existing Voice data if editing
    useEffect(() => {
        if (id) {
            axiosPrivate
                .get(`/api/voice/${id}`)
                .then((response) => {
                    setVoiceData(response.data);
                    form.reset(response.data); // Pre-fill the form with the fetched data
                })
                .catch((error) => {
                    console.error("Error fetching Voice data", error);
                });
        }
    }, [id]);




    // Handle form submission
    const onSubmit = async (values: FormValues) => {
        try {
            if (id) {
                // Update the existing voice
                axiosPrivate.put(`/api/voice/${id}`, values).then((res) => {
                    if (res.status.toString().startsWith("20")) {
                        toast({
                            variant:"success",
                            description: "Voice successfully updated."
                        })
                    }
                });
                toast({
                    description: "Voice updating..."
                })
            } else {
                // Create a new voice
                axiosPrivate.post('/api/voice', values, {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if (res.status.toString().startsWith("20")) {
                        toast({
                            variant:"success",
                            description: "Voice successfully added."
                        })
                    }
                })
                toast({
                    description: "Adding Voice..."
                })

            }
            queryClient.invalidateQueries(['voices'] as any);
            navigate("/voices"); // Navigate to the voices list after successful submission

        } catch (error) {
            console.error("Error saving Voice", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request. Please try again.",

            })
        }
    };

    if (id && !voiceData) {
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
                                <Input className=" lg:w-96" type="text" placeholder="Voice Name" {...field} />
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
                            <FormLabel>Voice Description</FormLabel>
                            <FormDescription>
                                This is a short description for the voice.
                            </FormDescription>
                            <FormControl>
                                <Input className=" lg:w-96" type="text" placeholder="Male with Local accent" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="VoiceId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel >Voice ID</FormLabel>
                            <FormControl>
                                <Input className=" lg:w-96" placeholder="Unique token" {...field} />
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

                                    <SelectItem value="Unreal Speech">Unreal Speech</SelectItem>
                                    <SelectItem value="Eleven Labs">Eleven Labs</SelectItem>
                                    <SelectItem value="OpenAI">OpenAI</SelectItem>
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

export default VoiceForm