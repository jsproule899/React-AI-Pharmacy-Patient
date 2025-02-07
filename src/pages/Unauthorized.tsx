import { Button } from "@/components/ui/button";
import { FaCircleExclamation } from "react-icons/fa6";
import { useNavigate } from "react-router"

const Unauthorized = () => {
    const navigate = useNavigate();



    return (

        <div className="flex-grow bg-stone-50 dark:bg-stone-900">
            <section className="flex flex-col items-center justify-center gap-4 text-stone-950 dark:text-stone-50 text-center py-32">

                <FaCircleExclamation className='text-qub-red' size={120} />
                <h1 className="text-4xl font-extrabold mb-6">Unauthorized</h1>
                <p className="text-xl mb-8">
                    You do not have access to the requested page.
                </p>
                <Button variant="default" onClick={() => navigate(-1)}>
                    Go Back
                </Button>

            </section>
        </div>
    )
}

export default Unauthorized