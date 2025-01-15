"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from '@/components/ui/checkbox';
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Spinner from '@/components/ui/Spinner';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";


const AIProviders = ["OpenAI", "Claude"]

const openAIModels = ["gpt-4o", "gpt-4o-mini", "chatgpt-4o-latest"]

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
    Relationship: z.string().optional()
});


const formSchema = z.object({
    Context: z.string().max(250).min(1, "Required"),
    Name: z.string().max(50).min(1, "Required"),
    Age: z.string({
        required_error: "Age is required",
        invalid_type_error: "Age must be a number between 1-110",
    }).min(1, "Required"),
    Gender: z.string().min(1, "Required"),
    Self: z.boolean(),
    Other_Person: otherPersonSchema,
    Medicines: z.string().min(1, "Required"),
    AdditionalMeds: z.string().min(1, "Required"),
    History: z.string().min(1, "Required"),
    Symptoms: z.string().min(1, "Required"),
    Allergies: z.string().min(1, "Required"),
    Time: z.string().min(1, "Required"),
    Outcome: z.string().min(1, "Required"),
    AI: z.string(),
    Model: z.string(),
    TTS: z.string(),
    Voice: z.string(),
}).superRefine(
    ({ Self, Other_Person }, refinementContext) => {
        if (!Self) {
            const fieldsToCheck = [
                "Other_Person.Name",
                "Other_Person.Age",
                "Other_Person.Gender",
                "Other_Person.Relationship"

            ];
            for (const field of fieldsToCheck) {
                if (eval(field) === "") {
                    refinementContext.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `Required`,
                        path: [field],
                    });
                }
            }
        }
    })



type FormValues = z.infer<typeof formSchema>;

function ScenarioForm() {

    const { id } = useParams<{ id?: string }>(); // The `id` parameter will be undefined if it's an add form
    const [scenarioData, setScenarioData] = useState<FormValues | null>(null);
    const [voiceProvider, setVoiceProvider] = useState('');
    const [AIProvider, setAIProvider] = useState('');
    const [patientIsSelf, setpatientIsSelf] = useState(true);

    const navigate = useNavigate();

    // 1. Define your form.
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Context: "",
            Self: true,
            Name: "",
            Age: "",
            Medicines: "",
            AdditionalMeds: "",
            History: "",
            Symptoms: "",
            Allergies: "",
            Time: "",
            Outcome: "Treat",
            Other_Person: {
                Name: "",
                Age: "",
                Gender: "",
                Relationship: ""
            }

        },
    })

    // Fetch the existing scenario data if editing
    useEffect(() => {
        if (id) {
            axios
                .get(`${import.meta.env.VITE_API_BASEURL}/api/scenario/${id}`)
                .then((response) => {
                    setScenarioData(response.data);
                    form.reset(response.data); // Pre-fill the form with the fetched data
                    setAIProvider(response.data.AI)
                    setVoiceProvider(response.data.TTS)
                    setpatientIsSelf(response.data.Self)



                })
                .catch((error) => {
                    console.error("Error fetching scenario data", error);
                });
        }
    }, [id, form]);




    // Handle form submission
    const onSubmit = async (values: FormValues) => {
        try {
            if (id) {
                // Update the existing scenario
                await axios.put(`${import.meta.env.VITE_API_BASEURL}/api/scenario/${id}`, values);
            } else {
                // Create a new scenario
                await axios.post(`${import.meta.env.VITE_API_BASEURL}/api/scenario`, values, {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    }
                });
            }
            navigate("/scenarios"); // Navigate to the scenarios list after successful submission
        } catch (error) {
            console.error("Error saving scenario", error);
        }
    };

    const renderVoiceOptions = () => {
        if (voiceProvider === voiceProviders[0]) {
            return unrealSpeechVoices;
        } else if (voiceProvider === voiceProviders[1]) {
            return elevenLabsVoices;
        } else {
            return []; // Default to an empty array if no provider is selected
        }
    };


    const renderModelOptions = () => {
        if (AIProvider === AIProviders[0]) {
            return openAIModels;
        } else if (AIProvider === AIProviders[1]) {
            return claudeModels;
        } else {
            return []; // Default to an empty array if no provider is selected
        }
    };

    if (id && !scenarioData) {
        return <Spinner />;
    }

    return (



        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 mx-10">
                <FormField
                    control={form.control}
                    name="Context"
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
                <div className='flex'>
                    <FormField
                        control={form.control}
                        name="Name"
                        render={({ field }) => (
                            <FormItem className='mr-2'>
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
                        name="Age"
                        render={({ field }) => (
                            <FormItem className='mr-2'>
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
                        name="Gender"
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
                </div>
                <FormField
                    control={form.control}
                    name="Self"
                    render={({ field }) => (
                        <FormItem className=" w-64 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
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
                    <div className='flex flex-col flex-start items-start rounded-md border p-4 shadow'>
                        <FormLabel className='text-stone-950 dark:text-stone-50 mb-1' >Patients Details</FormLabel>
                        <div className='flex flex-row mb-2'>

                            <FormField
                                control={form.control}
                                name='Other_Person.Name'
                                render={({ field }) => (
                                    <FormItem className='mr-2'>
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
                                name="Other_Person.Age"
                                render={({ field }) => (
                                    <FormItem className='mr-2'>
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
                                name="Other_Person.Gender"
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
                        </div>
                        <div className='flex-row'><FormField
                            control={form.control}
                            name="Other_Person.Relationship"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-stone-950 dark:text-stone-50' >Relationship to Patient</FormLabel>
                                    <FormControl>
                                        <Input className=" lg:w-96" placeholder="Son..." {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        /></div>


                    </div>
                )}

                <FormField
                    control={form.control}
                    name="Medicines"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50'>Medicines</FormLabel>
                            <FormControl>
                                <Textarea className="resize-none text-stone-950 dark:text-stone-50" placeholder="Paracetamol" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='AdditionalMeds'
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
                    name="History"
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
                    name="Symptoms"
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
                    name="Allergies"
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
                    name="Time"
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
                    name="Outcome"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-stone-950 dark:text-stone-50'>Correct Outcome</FormLabel>
                            <FormControl>
                                <RadioGroup defaultValue="Treat" onValueChange={field.onChange}
                                    className='flex flex-row'>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Treat" id="Treat" />
                                        <Label className='text-stone-950 dark:text-stone-50' htmlFor="Treat">Treat</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Refer" id="Refer" />
                                        <Label className='text-stone-950 dark:text-stone-50' htmlFor="Refer">Refer</Label>
                                    </div>
                                </RadioGroup></FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <section className='flex flex-col sm:flex-row'>
                    <FormField
                        control={form.control}
                        name="AI"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-stone-950 dark:text-stone-50' >AI Provider</FormLabel>
                                <Select onValueChange={(value) => { setAIProvider(value); form.resetField("Model"); field.onChange(value) }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="min-w-[100px] text-stone-950 dark:text-stone-50">
                                            <SelectValue className='text-stone-950 dark:text-stone-50' placeholder="AI" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {AIProviders.map((ai, i) => {
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
                        name="Model"
                        render={({ field }) => (
                            <FormItem className='my-2 sm:mx-2 sm:my-0'>
                                <FormLabel className='text-stone-950 dark:text-stone-50' >AI Model</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="min-w-[180px]  text-stone-950 dark:text-stone-50">
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
                </section>

                <section className='flex flex-col sm:flex-row'>
                    <FormField
                        control={form.control}
                        name="TTS"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-stone-950 dark:text-stone-50' >AI Voice Provider</FormLabel>
                                <Select onValueChange={(value) => { setVoiceProvider(value); form.resetField("Voice"); field.onChange(value) }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="min-w-[140px] text-stone-950 dark:text-stone-50">
                                            <SelectValue className='text-stone-950 dark:text-stone-50' placeholder="Provider" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {voiceProviders.map((v, i) => {
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
                        name="Voice"
                        render={({ field }) => (
                            <FormItem className='my-2 sm:mx-2 sm:my-0'>
                                <FormLabel className='text-stone-950 dark:text-stone-50' >Voice</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className=" min-w-[100px] flex text-stone-950 dark:text-stone-50">
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
                </section>
                <div className='flex-col flex md:flex-row '>
                    <Button className="flex min-w-24 mx-24 my-2 md:mx-2" type="submit">{id ? "Update" : "Create"}</Button>
                    <Button variant="destructive" className="flex mx-24  min-w-24  my-2 md:mx-2" type='button' onClick={() => navigate(-1)}>Cancel</Button>
                </div>

            </form>
        </Form>


    )
}

export default ScenarioForm