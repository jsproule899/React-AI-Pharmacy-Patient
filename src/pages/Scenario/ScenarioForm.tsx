"use client"

import React, { Fragment, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Navigate, useNavigate} from "react-router";
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'


const AIProviders = ["OpenAI", "Claude"]

const openAIModels = ["o1", "o1-mini", "gpt-4o", "gpt-4o-mini", "chatgpt-4o-latest"]

const claudeModels = ["claude-3-haiku-20240307", "claude-3-sonnet-20240229", "claude-3-5-haiku-20241022", "claude-3-5-sonnet-20241022", "claude-3-opus-20240229"]

const voiceProviders = ["Unreal Speech", "Eleven Labs"]

const unrealSpeechVoices = [
    {
        name: "Dan",
        description: "(Young Male)",
        voice: "Dan",
    },
    {
        name: "Will",
        description: "(Mature Male)",
        voice: "Will"
    },
    {
        name: "Scarlett",
        description: "(Young Female)",
        voice: "Scarlett"
    },
    {
        name: "Liv",
        description: "(Young Female)",
        voice: "Liv"
    },
    {
        name: "Amy",
        description: "(Mature Female)",
        voice: "Amy"
    }]

const elevenLabsVoices = [
    {
        name: "Peter",
        description: "(NI Male)",
        voice: "E8tAm6nkbW2yKYAJLVXH"
    },
    {
        name: "Michael",
        description: "(Mature Irish Male)",
        voice: "8SNzJpKT62Cqqqe8Injx"
    },
    {
        name: "Connor",
        description: "(Young Irish Male)",
        voice: "bCwW7dMszE8OyqvhCaQY"
    },
    {
        name: "Chris",
        description: "(Young Male)",
        voice: "iP95p4xoKVk53GoZ742B"
    },
    {
        name: "Megan",
        description: "(Young NI Female)",
        voice: "wYiPSnV1DhrUtMgJiRr1"
    },
    {
        name: "Niamh",
        description: "(Young Irish Female)",
        voice: "1e9Gn3OQenGu4rjQ3Du1"
    },
    {
        name: "Shannon",
        description: "(Mature Irish Female)",
        voice: "tlKpUDfYaDGG10tLVOrH"
    }]


const otherPersonSchema = z.object({
    Name: z.string().optional(),
    Age: z.string().optional(),
    Gender: z.string().optional(),
    Relationship: z.string().optional(),
});


const formSchema = z.object({
    context: z.string().min(2).max(250),
    name: z.string().min(2).max(50),
    age: z.string({
        required_error: "Age is required",
        invalid_type_error: "Age must be a number between 1-110",
    }),
    gender: z.string(),
    self: z.boolean(),
    other_person: otherPersonSchema,
    medicines: z.string(),
    additional_meds: z.string(),
    history: z.string(),
    symptoms: z.string(),
    allergies: z.string(),
    time: z.string(),
    outcome: z.string(),
    AI: z.string(),
    model: z.string(),
    TTS: z.string(),
    voice: z.string(),
})





function ScenarioForm() {

    const [voiceProvider, setVoiceProvider] = useState('');
    const [AIProvider, setAIProvider] = useState('');
    const [patientIsSelf, setpatientIsSelf] = useState(true);
    let navigate = useNavigate();
    
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            context: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    const renderVoiceOptions = () => {
        if (voiceProvider === voiceProviders[0]) {
            return unrealSpeechVoices;
        } else if (voiceProvider === voiceProviders[1]) {
            return elevenLabsVoices;
        } else {
            return []; // Default to an empty array if no provider is selected
        }
    };


   const renderModelOptions= () => {
        if (AIProvider === AIProviders[0]) {
            return openAIModels;
        } else if (AIProvider === AIProviders[1]) {
            return claudeModels;
        } else {
            return []; // Default to an empty array if no provider is selected
        }
    };

    return (



        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 mx-10">
                <FormField
                    control={form.control}
                    name="context"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50'>Scenario Context</FormLabel>
                            <FormDescription>
                                This is the single sentence statement for the scenario.
                            </FormDescription>
                            <FormControl>
                                <Input type="text" className='text-stone-950 dark:text-stone-50' placeholder="Miss Richardson would like 'something good' to get rid of the flu." {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50' >Name</FormLabel>
                            <FormControl>
                                <Input className=" lg:w-96" placeholder="John Doe..." {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50'>Age</FormLabel>
                            <FormControl>
                                <Input type="number" className='lg:w-16 text-stone-950 dark:text-stone-50' min="1" max="120" placeholder="18" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50' >Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-[100px] text-stone-950 dark:text-stone-50">
                                        <SelectValue className='text-stone-950 dark:text-stone-50' placeholder="Gender" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>

                                    <SelectItem className='text-stone-950 dark:text-stone-50' value="Male">Male</SelectItem>
                                    <SelectItem className='text-stone-950 dark:text-stone-50' value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>


                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="self"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                                <Checkbox
                                    checked={field.value ?? true}
                                    onCheckedChange={(value) => { field.onChange(value); setpatientIsSelf(!patientIsSelf) }}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none ">
                                <FormLabel className='text-stone-950 dark:text-stone-50'>
                                    They are the patient?
                                </FormLabel>

                            </div>
                        </FormItem>
                    )}
                />

                {!patientIsSelf && (
                    <Fragment>
                        <FormField
                            control={form.control}
                            name='other_person.Name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-stone-950 dark:text-stone-50' >Patients Name</FormLabel>
                                    <FormControl>
                                        <Input className=" lg:w-96" placeholder="John Doe..." {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="other_person.Age"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-stone-950 dark:text-stone-50'>Patients Age</FormLabel>
                                    <FormControl>
                                        <Input type="number" className='lg:w-16 text-stone-950 dark:text-stone-50' min="1" max="120" placeholder="18" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="other_person.Gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-stone-950 dark:text-stone-50' >Patients Gender</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-[100px] text-stone-950 dark:text-stone-50">
                                                <SelectValue className='text-stone-950 dark:text-stone-50' placeholder="Gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>

                                            <SelectItem className='text-stone-950 dark:text-stone-50' value="Male">Male</SelectItem>
                                            <SelectItem className='text-stone-950 dark:text-stone-50' value="Female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>


                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="other_person.Relationship"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-stone-950 dark:text-stone-50' >Relationship to Patient</FormLabel>
                                    <FormControl>
                                        <Input className=" lg:w-96" placeholder="Son..." {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </Fragment>
                )}

                <FormField
                    control={form.control}
                    name="medicines"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50'>Medicines</FormLabel>
                            <FormControl>
                                <Textarea className="resize-none" placeholder="Paracetamol" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='additional_meds'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50'>Additional Medication</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Wifes antibiotic" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="history"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50'>History</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="woke up feeling awful" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="symptoms"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50'>Patients Symptoms</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="cough..." {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50'>Patients Allergies</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="No allergies" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50'>Duration of Illness</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="3 days" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="outcome"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50'>Correct Outcome</FormLabel>
                            <FormControl>
                                <RadioGroup defaultValue="option-one" onValueChange={field.onChange}
                                    className='flex flex-row'>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-one" id="option-one" />
                                        <Label className='text-stone-950 dark:text-stone-50' htmlFor="option-one">Treat</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="option-two" id="option-two" />
                                        <Label className='text-stone-950 dark:text-stone-50' htmlFor="option-two">Refer</Label>
                                    </div>
                                </RadioGroup></FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="AI"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50' >AI Provider</FormLabel>
                            <Select onValueChange={(value) => { setAIProvider(value); form.resetField("model"); field.onChange(value) }} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-[100px] text-stone-950 dark:text-stone-50">
                                        <SelectValue className='text-stone-950 dark:text-stone-50' placeholder="AI" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {AIProviders.map((ai,i) => {
                                        return <SelectItem key={i} className='text-stone-950 dark:text-stone-50' value={ai}>{ai}</SelectItem>
                                    }
                                    )}
                                </SelectContent>
                            </Select>


                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50' >AI Model</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-[180px]  text-stone-950 dark:text-stone-50">
                                        <SelectValue placeholder="Model" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectContent>
                                    {renderModelOptions().map((v, i) => {
                                        return <SelectItem key={i} id={"voice-" + i} className='text-stone-950 dark:text-stone-50' value={v}>{v}</SelectItem>
                                    })}
                                </SelectContent>
                                </SelectContent>
                            </Select>


                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="TTS"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50' >AI Voice Provider</FormLabel>
                            <Select onValueChange={(value) => { setVoiceProvider(value); form.resetField("voice"); field.onChange(value) }} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-[200px] text-stone-950 dark:text-stone-50">
                                        <SelectValue className='text-stone-950 dark:text-stone-50' placeholder="Provider" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {voiceProviders.map((v,i) => {
                                        return <SelectItem key={i} className='text-stone-950 dark:text-stone-50' value={v}>{v}</SelectItem>
                                    }
                                    )}
                                </SelectContent>
                            </Select>


                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="voice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50' >Voice</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-[200px] text-stone-950 dark:text-stone-50">
                                        <SelectValue className='text-stone-950 dark:text-stone-50' placeholder="AI Voice" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {renderVoiceOptions().map((v, i) => {
                                        return <SelectItem key={i} id={"voice-" + i} className='text-stone-950 dark:text-stone-50' value={v.voice}>{v.name} {v.description}</SelectItem>
                                    })}
                                </SelectContent>
                            </Select>


                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className=''>
                    <Button className="self-end m-4" type="submit">Create</Button>
                    <Button variant="destructive" className="self-end m-4" type='button' onClick={()=>navigate(-1)}>Cancel</Button>
                </div>

            </form>
        </Form>


    )
}

export default ScenarioForm