import { Button } from '@/components/ui/button';
import { FaMagnifyingGlassLocation } from 'react-icons/fa6';
import { useNavigate } from "react-router";

function ErrorPage() {
   let navigate = useNavigate();
  return (
    <div className="flex-grow bg-stone-50 dark:bg-stone-900">
         <section className="flex flex-col items-center justify-center gap-4 text-stone-950 dark:text-stone-50 text-center py-32">
                
                    <FaMagnifyingGlassLocation className='text-qub-red' size={120}/>
                    <h1 className="text-4xl font-extrabold mb-6">404 - PAGE NOT FOUND</h1>
                    <p className="text-xl mb-8">
                        The page you are looking for might have been removed, had its name changed or is temporarily unavailable.
                    </p>
                    <Button variant="default" onClick={()=>navigate("/")}>
                        Return Home
                    </Button>
             
            </section>
    </div>
  )
}

export default ErrorPage