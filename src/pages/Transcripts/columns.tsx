import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ColumnDef } from "@tanstack/react-table"
import { FaArrowsUpDown, FaFileArrowDown, FaFileLines, FaSpinner, FaTrashCan } from "react-icons/fa6"
import { Link } from "react-router"
import { Transcript } from "@/types/Transcript"
import { useTableContext } from "./Table"


export const columns: ColumnDef<Transcript>[] = [
    {
        accessorKey: "student_no",
        accessorFn: (transcript) => transcript.Filename.split('_')[0],
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="px-2"
                >
                    Student No.
                    <FaArrowsUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="text-stone-950 dark:text-stone-50 px-2">{row.getValue("student_no")}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: "scenario",
        accessorFn: (transcript) => transcript.Scenario.Context,
        header: "Scenario",
        cell: ({ row }) => <div className="text-stone-950 dark:text-stone-50 overflow-ellipsis  max-h-10 overflow-y-clip">{row.getValue("scenario")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {

            return (
                <Button
                    variant="ghost"
                    className="px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Logged
                    <FaArrowsUpDown />
                </Button>
            )
        },
        enableSorting: true,
        sortDescFirst: true,
        cell: ({ row }) => {


            return <div className="text-stone-950 dark:text-stone-50">{new Date(row.getValue("createdAt")).toLocaleString()}</div>
        },
    },
    {
        id: "view",
        accessorKey: "_id",
        header: () => {

            return (
                <div className="text-center">View</div>
            )
        },
        cell: ({ row }) => {
            return <Link to={{ pathname: `/transcripts/${row.getValue("view")}` }} >
                <FaFileLines className='h-6 w-6  cursor-pointer justify-self-center text-stone-950 dark:text-stone-50' />
            </Link>
        },
    },
    {
        id: "download",
        accessorKey: "_id",
        header: () => {

            return (
                <div className="text-center">Download</div>
            )
        },
        cell: ({ row }) => {
            const { downloadLoadingId, handleDownload } = useTableContext();
            return (
                <>
                    {downloadLoadingId === row.getValue("download") ? (
                        <FaSpinner className='h-6 w-6  cursor-wait justify-self-center animate-spin text-stone-950 dark:text-stone-50' />
                    ) : (
                        <FaFileArrowDown className='h-6 w-6 cursor-pointer justify-self-center text-stone-950 dark:text-stone-50' onClick={() => handleDownload(row.original)} />
                    )
                    }
                </>
            )

        },
    },
    {
        id: "remove",
        accessorKey: "_id",
        header: () => {

            return (
                <div className="text-center">Remove</div>
            )
        },
        cell: ({ row }) => {
            const { handleDelete } = useTableContext();
            return (<Dialog>
                <DialogTrigger asChild >
                    <button className="w-full"><FaTrashCan className='h-6 w-6  cursor-pointer justify-self-center text-stone-950 dark:text-stone-50' /></button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-black dark:text-white'>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the transcript
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-center ">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className='mb-1 px-8 mx-2 '>Close</Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="button" variant="destructive" className='mb-1 px-8 mx-2' onClick={() => { handleDelete(row.getValue("remove")) }}>Delete</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>)
        },
    },
]