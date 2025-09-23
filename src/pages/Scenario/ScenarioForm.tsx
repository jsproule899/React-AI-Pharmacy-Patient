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
import { useToast } from "@/hooks/use-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSamplePlayer from "@/hooks/useSamplePlayer";
import { Model } from "@/types/Model";
import { Voice } from "@/types/Voice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { FaCircleNotch, FaCirclePlay, FaCircleStop } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";


const AVATARS = ["female_01", "female_02", "female_03", "female_04", "female_05", "female_06", "female_07", "male_01", "male_02", "male_03", "male_04", "male_05", "nonbinary_01", "nonbinary_02", "nonbinary_03"] as const;


const otherPersonSchema = z.object({
    Name: z.string().optional(),
    Age: z.string().optional(),
    Gender: z.string().optional(),
    Relationship: z.string().optional()
});


const formSchema = z.object({
    Theme: z.string().max(100).min(1, "Required"),
    Anonymize: z.boolean().optional(),
    Visible: z.boolean().optional(),
    Context: z.string().max(250).min(1, "Required"),
    Name: z.string().max(50).min(1, "Required"),
    Age: z.string({
        required_error: "Age is required",
        invalid_type_error: "Age must be a number between 1-110",
    }).min(1, "Required"),
    Gender: z.string().min(1, "Required"),
    Self: z.boolean().optional(),
    Other_Person: otherPersonSchema,
    Pregnant: z.boolean().optional(),
    Breastfeeding: z.boolean().optional(),
    Medicines: z.string().min(1, "Required"),
    AdditionalMeds: z.string().min(1, "Required"),
    Time: z.string().min(1, "Required"),
    History: z.string().min(1, "Required"),
    Symptoms: z.string().min(1, "Required"),
    Allergies: z.string().min(1, "Required"),
    Emotion: z.string().optional(),
    AdditionalInfo: z.string().optional(),
    Outcome: z.string().min(1, "Required"),
    AI: z.string().min(1, "Required"),
    Model: z.string().min(1, "Required"),
    TTS: z.string().min(1, "Required"),
    Voice: z.string().min(1, "Required"),
    Avatar: z.enum(AVATARS)
}).superRefine(
    ({ Self, Other_Person }, refinementContext) => {
        if (!Self && Other_Person) {
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
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate()
    const { id } = useParams<{ id?: string }>(); // The `id` parameter will be undefined if it's an add form
    const [scenarioData, setScenarioData] = useState<FormValues | null>(null);
    const [voices, setVoices] = useState<Voice[]>([]);
    const [voiceProviders, setVoiceProviders] = useState<string[]>([]);
    const [voiceProvider, setVoiceProvider] = useState("");
    const [models, setModels] = useState<Model[]>([]);
    const [AIProviders, setAIProviders] = useState<string[]>([]);
    const [AIProvider, setAIProvider] = useState("");
    const [patientIsSelf, setpatientIsSelf] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState("female_01")
    const { indexPlaying, isSampleLoading, playSample, stopSample } = useSamplePlayer();


    const { toast } = useToast()

    const navigate = useNavigate();

    // 1. Define your form.
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Theme: "",
            Anonymize: false,
            Visible: true,
            Context: "",
            Name: "",
            Age: "",
            Self: true,
            Other_Person: {
                Name: "",
                Age: "",
                Gender: "",
                Relationship: ""
            },
            Pregnant: false,
            Breastfeeding: false,
            Medicines: "",
            AdditionalMeds: "",
            Time: "",
            History: "",
            Symptoms: "",
            Allergies: "",
            Emotion: "",
            AdditionalInfo: "",
            Outcome: "Treat",
            Avatar: "female_01"
        },
    })

    useEffect(() => {

        axiosPrivate.get('/api/voice/')
            .then((response) => {
                const fetchedVoices: Voice[] = response.data
                setVoices(fetchedVoices)
                setVoiceProviders([...new Set(fetchedVoices?.map(voice => voice.Provider))])
            }).catch((err) => {
                console.log(err.message);
            })

        axiosPrivate.get('/api/model/')
            .then((response) => {
                const fetchedModels: Model[] = response.data
                setModels(fetchedModels)
                setAIProviders([...new Set(fetchedModels?.map(model => model.Provider))])
            }).catch((err) => {
                console.log(err.message);
            })

    }, [])

    // Fetch the existing scenario data if editing
    useEffect(() => {
        if (id) {
            axiosPrivate
                .get(`/api/scenario/${id}`)
                .then((response) => {
                    setScenarioData(response.data);
                    form.reset(response.data); // Pre-fill the form with the fetched data
                    setAIProvider(response.data.AI)
                    setVoiceProvider(response.data.TTS)
                    setpatientIsSelf(response.data.Self)
                    setSelectedAvatar(response.data.Avatar)
                })
                .catch((error) => {
                    console.error("Error fetching scenario data", error);
                });
        }
    }, [id]);




    // Handle form submission
    const onSubmit = async (values: FormValues) => {
        try {
            if (id) {
                // Update the existing scenario
                axiosPrivate.put(`/api/scenario/${id}`, values).then((res) => {
                    if (res.status.toString().startsWith("20")) {
                        toast({
                            variant: "success",
                            description: "Scenario successfully updated."
                        })
                    }
                });
                toast({
                    description: "Scenario updating..."
                })
            } else {
                // Create a new scenario
                axiosPrivate.post('/api/scenario', values, {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded'
                    }
                }).then((res) => {
                    if (res.status.toString().startsWith("20")) {
                        toast({
                            variant: "success",
                            description: "Scenario successfully added."
                        })
                    }
                })
                toast({
                    description: "Adding Scenario..."
                })

            }
            queryClient.invalidateQueries(['scenarios'] as any);
            navigate("/scenarios"); // Navigate to the scenarios list after successful submission

        } catch (error) {
            console.error("Error saving scenario", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request. Please try again.",

            })
        }
    };


    if (id && !scenarioData) {
        return <Spinner />;
    }

    return (



        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4 mx-10 mb-4 justify-center">

                <div className='flex flex-wrap gap-4 items-end'>
                    <FormField
                        control={form.control}
                        name="Theme"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Theme</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Coughs & Colds" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='flex items-center w-fit h-fit gap-4 rounded-md border bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 p-2.5 shadow'>
                        <FormField
                            control={form.control}
                            name="Visible"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 ">
                                    <div className="space-y-1 leading-none ">
                                        <FormLabel>
                                            Visible?
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value ?? false}
                                            onCheckedChange={(value) => { field.onChange(value); }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='flex items-center w-fit h-fit gap-4 rounded-md border bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 p-2.5 shadow'>
                        <FormField
                            control={form.control}
                            name="Anonymize"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 ">
                                    <div className="space-y-1 leading-none ">
                                        <FormLabel>
                                            Anonymize?
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value ?? false}
                                            onCheckedChange={(value) => { field.onChange(value); }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <FormField
                    control={form.control}
                    name="Context"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Scenario Context</FormLabel>
                            <FormDescription>
                                This is the single sentence statement for the scenario.
                            </FormDescription>
                            <FormControl>
                                <Input type="text" placeholder="Miss Richardson would like 'something good' to get rid of the flu." {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='flex flex-wrap gap-2'>
                    <FormField
                        control={form.control}
                        name="Name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel >Name</FormLabel>
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
                            <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                    <Input type="number" className='w-20 ' min="1" max="120" placeholder="18" {...field} />
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
                                <FormLabel >Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-[140px] ">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>

                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Trans-Male">Trans-Male</SelectItem>
                                        <SelectItem value="Trans-Female">Trans-Female</SelectItem>
                                        <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                                    </SelectContent>
                                </Select>


                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className='flex flex-shrink flex-col flex-start w-fit items-start rounded-md border bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 p-4 shadow'>
                    <FormField
                        control={form.control}
                        name="Self"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value ?? true}
                                        onCheckedChange={(value) => { field.onChange(value); setpatientIsSelf(!patientIsSelf) }}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none  pr-24">
                                    <FormLabel>
                                        Visiting for self?
                                    </FormLabel>

                                </div>
                            </FormItem>
                        )}
                    />


                    {!patientIsSelf && (
                        <>
                            <FormLabel className='flex mt-4 mb-1' >Patient Details</FormLabel>

                            <div className='flex flex-wrap gap-2'>
                                <FormField
                                    control={form.control}
                                    name='Other_Person.Name'
                                    render={({ field }) => (
                                        <FormItem className='mr-2'>
                                            <FormLabel >Name</FormLabel>
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
                                            <FormLabel>Age</FormLabel>
                                            <FormControl>
                                                <Input type="number" className='w-20 ' min="1" max="120" placeholder="18" {...field} />
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
                                            <FormLabel >Gender</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-[140px]">
                                                        <SelectValue placeholder="Gender" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>

                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Trans-Male">Trans-Male</SelectItem>
                                                    <SelectItem value="Trans-Female">Trans-Female</SelectItem>
                                                    <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                                                </SelectContent>
                                            </Select>


                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="Other_Person.Relationship"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel >Relationship to Patient</FormLabel>
                                            <FormControl>
                                                <Input className=" lg:w-96" placeholder="Son..." {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className='flex flex-wrap flex-start w-fit gap-4 items-start rounded-md border bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 p-4 shadow'>
                    <FormField
                        control={form.control}
                        name="Pregnant"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                                <div className="space-y-1 leading-none ">
                                    <FormLabel>
                                        Pregnant?
                                    </FormLabel>

                                </div>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value ?? false}
                                        onCheckedChange={(value) => { field.onChange(value); }}
                                    />
                                </FormControl>

                            </FormItem>
                        )}
                    />
                    <Label className="space-y-1 leading-none "> or</Label>


                    <FormField
                        control={form.control}
                        name="Breastfeeding"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                                <div className="space-y-1 leading-none ">
                                    <FormLabel>
                                        Breastfeeding?
                                    </FormLabel>
                                </div>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value ?? false}
                                        onCheckedChange={(value) => { field.onChange(value); }}
                                    />
                                </FormControl>

                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="Medicines"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Medicines or Medical Conditions</FormLabel>
                            <FormControl>
                                <Textarea className="resize-y " placeholder="Paracetamol" {...field} />
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
                            <FormLabel>Extra Medication</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Wifes antibiotic" {...field} />
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
                            <FormLabel>Time persisting</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="3 days" {...field} />
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
                            <FormLabel>History</FormLabel>
                            <FormControl>
                                <Textarea className="resize-y" placeholder="woke up feeling awful" {...field} />
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
                            <FormLabel>Symptoms</FormLabel>
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
                            <FormLabel>Allergies or Intolerances</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="No allergies or intolerances" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex items-center w-fit h-fit rounded-md border bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 p-3 shadow'>
                    <FormField
                        control={form.control}
                        name="Outcome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correct Outcome</FormLabel>
                                <FormControl>
                                    <RadioGroup defaultValue={field.value} onValueChange={field.onChange}
                                        className='flex flex-row'>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Treat" id="Treat" />
                                            <Label htmlFor="Treat">Treat</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="Refer" id="Refer" />
                                            <Label htmlFor="Refer">Refer</Label>
                                        </div>
                                    </RadioGroup></FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>



                <FormField
                    control={form.control}
                    name="Emotion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Emotion</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Optional emotional tone" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="AdditionalInfo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Additional Information</FormLabel>
                            <FormControl>
                                <Textarea className="resize-y " placeholder="Optional additional information for prompt" {...field} />
                            </FormControl>

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
                                <FormLabel >AI Provider</FormLabel>
                                <Select onValueChange={(value) => { setAIProvider(value); form.setValue("Model", ""); field.onChange(value) }} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="min-w-[100px] ">
                                            <SelectValue placeholder="AI" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {AIProviders.map((ai, i) => {
                                            return <SelectItem key={i} value={ai}>{ai}</SelectItem>
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
                                <FormLabel >AI Model</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="min-w-[180px]">
                                            <SelectValue placeholder="Model" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectContent>
                                            {
                                                AIProvider ?
                                                    models.filter(model => model.Provider == AIProvider).map((m, i) => {
                                                        return <SelectItem key={i} id={"model-" + i} value={m.ModelId}>{m.Name} ({m.Description})</SelectItem>
                                                    })
                                                    : <SelectItem value="placeholder">Select Provider</SelectItem>
                                            }
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
                                <FormLabel >AI Voice Provider</FormLabel>
                                <Select onValueChange={(value) => { setVoiceProvider(value); form.setValue("Voice", ""); field.onChange(value) }} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="min-w-[140px] ">
                                            <SelectValue placeholder="Provider" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            voiceProviders.map((p, i) => {
                                                return <SelectItem key={i} value={p}>{p}</SelectItem>
                                            })
                                        }
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
                                <FormLabel >Voice</FormLabel>
                                <div id='voice' className="flex flex-row gap-2 items-center">
                                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className=" min-w-[100px] flex ">
                                                <SelectValue placeholder="AI Voice" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                voiceProvider ?
                                                    voices.filter(voice => voice.Provider == voiceProvider).map((v, i) => {
                                                        return <SelectItem key={i} id={"voice-" + i} value={v.VoiceId}>{v.Name} ({v.Description})</SelectItem>
                                                    })
                                                    : <SelectItem value="placeholder">Select Provider</SelectItem>

                                            }
                                        </SelectContent>
                                    </Select>

                                    <audio id={`audioPlayer`} />
                                    {
                                        indexPlaying === -1
                                            ? <FaCirclePlay className="text-qub-red cursor-pointer hover:text-qub-darkred" size={38} onClick={() =>
                                                voices
                                                    ? playSample(voices.find(v => v.VoiceId == field.value), 0)
                                                    : toast({
                                                        variant: "destructive",
                                                        title: "Uh oh! Something went wrong.",
                                                        description: "There was a problem loading the voice. Please try again.",
                                                    })
                                            } />
                                            : isSampleLoading
                                                ? <FaCircleNotch className="text-qub-red cursor-pointer hover:text-qub-darkred animate-spin" size={38} />
                                                : <FaCircleStop className="text-qub-red cursor-pointer hover:text-qub-darkred" size={38} onClick={() => stopSample()} />
                                    }




                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                </section>
                <section>
                    <FormField
                        control={form.control}
                        name="Avatar"
                        render={({ field }) => (
                            <FormItem className='my-2 sm:mx-2'>
                                <FormLabel >Avatar</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={selectedAvatar}
                                        defaultValue={selectedAvatar}
                                        className="flex flex-wrap justify-center space-y-1" >
                                        {AVATARS.map((avatar, i) => {
                                            return (
                                                <FormItem key={i} className="flex items-center space-x-3 space-y-0 cursor-pointer">
                                                    <FormControl>
                                                        <RadioGroupItem value={avatar} className="hidden" />
                                                    </FormControl>
                                                    <div id="img-container" className={`rounded-full h-24 w-24 overflow-hidden bg-white dark:bg-stone-800 border-solid border-2 hover:border-qub-red ${selectedAvatar === avatar ? "border-qub-red dark:border-qub-darkred border-4" : "border-stone-500"}`} onClick={() => { setSelectedAvatar(avatar); form.setValue("Avatar", avatar) }}>
                                                        <img src={`/img/avatar_${avatar}.png`} alt="Image" className="h-44 p-1 object-cover" />
                                                    </div>
                                                </FormItem>
                                            )
                                        })}
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </section>


                <div className='flex-col flex md:flex-row gap-x-2 justify-center'>
                    <Button className="flex min-w-24 mx-12 my-2 md:mx-2" type="submit">{id ? "Update" : "Create"}</Button>
                    <Button variant="destructive" className="flex min-w-24 my-2 mx-12 md:mx-2" type='button' onClick={() => navigate(-1)}>Cancel</Button>
                </div>

            </form>
        </Form >



    )
}

export default ScenarioForm