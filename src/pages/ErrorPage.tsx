import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from "react-router";

function ErrorPage() {
   let navigate = useNavigate();
  return (
    <div className="flex-grow bg-stone-50 dark:bg-stone-900">
         <section className=" text-stone-950 dark:text-stone-50 text-center py-32">
                <div>
                    <h1 className="text-4xl font-extrabold mb-6">404 - PAGE NOT FOUND</h1>
                    <p className="text-xl mb-8">
                        The page you are loking for might have been removed, had its name changed or is temporarily unavailable.
                    </p>
                    <Button variant="default" onClick={()=>navigate("/")}>
                        Return Home
                    </Button>
                </div>
            </section>
    </div>
  )
}

export default ErrorPage