import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaArrowLeft, FaCheck, FaXmark } from "react-icons/fa6";
import { Link } from "react-router";
import UserForm from "./UserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";


interface ImportResult {
    user: string;
    status: string;
    message: string
}

function AddUsersPage() {
    return (
        <div className="md:p-6 flex flex-col flex-grow md:mx-10">
            <Link to="/users" className='w-fit'>
                <Button variant={"link"}>
                    <FaArrowLeft />
                    Back
                </Button>
            </Link>
            <Tabs defaultValue="individual" className="flex flex-col mx-auto mb-10">
                <TabsList className="flex justify-around w-full sm:w-[28rem] mx-auto">
                    <TabsTrigger className="w-6/12" value="individual">Individual</TabsTrigger>
                    <TabsTrigger className="w-6/12" value="multiple">Multiple</TabsTrigger>
                </TabsList>
                <TabsContent value="individual">
                    <Card className="w-svw sm:w-[28rem]">
                        <CardHeader>
                            <CardTitle>Add a single user</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UserForm />
                        </CardContent>

                    </Card>

                </TabsContent>
                <TabsContent value="multiple">
                    <Label className="w-svw sm:w-[28rem] text-center text-lg font-bold block m-2"> Add Users from CSV</Label>
                    <ImportUsersCSV />
                </TabsContent>
            </Tabs>
        </div>
    )
}

const ImportUsersCSV = () => {

    const [file, setFile] = useState<File>();
    const queryClient = useQueryClient()
    const axiosPrivate = useAxiosPrivate();
    const [importResults, setImportResults] = useState<ImportResult[]>([]);

    const handleFileUpload = (e: any) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/csv') {
            setFile(file);
            setImportResults([]);
            const reader = new FileReader();
            reader.onload = () => {
                const fileContent = reader.result as string;
                var rows = fileContent.split('\n')
                if (rows[0].includes("email")) rows.shift();
                rows = rows.filter(row => row !== "")
                rows.forEach(async row => {
                    const col = row.split(',', -1)
                    console.log(col);
                    try {


                        const res = await axiosPrivate.post('/api/auth/register', { Email: col[0].trim(), StudentNo: col[1].trim(), Staff: !!col[2].trim() },
                            {
                                headers: { 'Content-Type': 'application/json' },
                                withCredentials: true
                            });

                        if (res.status === 200) {
                            setImportResults(prev => [...prev, { user: col[1].trim(), status: "Imported", message: "Account created, welcome email successfully sent." }])
                        }
                    } catch (err: any) {
                        setImportResults(prev => [...prev, { user: col[1].trim(), status: "Failed", message: err.response.data.message }])
                    }
                })

            };

            reader.readAsText(file);
            queryClient.invalidateQueries(['users'] as any);
        } else {
            alert('Please upload a valid .csv file');
        }
    };

    return (
        <>
            <Input className="mb-4 p-2 border rounded max-w-96 mx-auto " type="file" accept=".csv" onChange={handleFileUpload} ></Input>

            {importResults.length !== 0 && (
                <>
                    <h2 className="font-bold text-center  text-stone-950 dark:text-stone-50" >CSV import results</h2>
                    {file && <h2 className="font-bold text-center  text-stone-950 dark:text-stone-50" >from: {file?.name}</h2>}
                    <div className="mt-4 border border-gray-300 dark:border-stone-700 rounded-lg p-4 max-w-5xl mx-auto bg-gray-50 dark:bg-stone-800 shadow-md">
                        <Table>
                            <TableHeader>
                                <TableRow >
                                    <TableHead className="px-6">
                                        User
                                    </TableHead>
                                    <TableHead className="px-6">
                                        Status
                                    </TableHead>
                                    <TableHead className="px-6">
                                        Message
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {importResults.map((result, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="px-6 text-stone-950 dark:text-stone-50">
                                            {result.user}
                                        </TableCell>
                                        <TableCell className="flex items-center gap-1 px-6 text-stone-950 dark:text-stone-50">
                                            {result.status === "Imported"
                                                ? <FaCheck color="green" />
                                                : <FaXmark color="red" />
                                            }
                                            {result.status}
                                        </TableCell>
                                        <TableCell className="px-6 text-stone-950 dark:text-stone-50">
                                            {result.message}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>



                    </div>
                </>
            )
            }


        </>
    )
}

export default AddUsersPage