import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function HomePage() {
    return (
        <div className="flex-grow bg-stone-50 dark:bg-stone-900">

            <section className="bg-[url(assets/Hero.png)] bg-cover text-white py-24 md:min-h-[calc(100dvh-5rem)]">
                <div className=" flex flex-col text-left md:mx-28 mx-4 w-fit">
                    <h1 className="text-2xl md:text-6xl font-semibold text-stone-900 bg-white w-fit p-3">Welcome to QAIRx</h1>
                    <p className="text-sm max-w-44 md:max-w-none md:text-xl mb-4  bg-stone-900 p-3 w-fit">
                        Enhance your pharmacy education through AI-driven roleplays and
                        simulations.
                    </p>
                    <Link to='/scenarios' className="">
                        <Button variant="primary" className="md:mx-60 mt-4" size={"responsive"}>
                            Get Started
                        </Button>
                    </Link>
                </div>


            </section>
            <section className="py-24 text-center max-w-full">
               <h2 className="text-3xl font-bold mb-10 text-black dark:text-gray-100">How It Works</h2>
                <div className="flex justify-center gap-12 flex-wrap">
                <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-md w-80">
                        <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">Step 1: Choose a Scenario</h3>
                          <p className="text-gray-600 dark:text-gray-100">
                            Select from a range of pharmacy-related scenarios and roles to
                            simulate.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-md w-80">
                        <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">Step 2: Interact with AI</h3>
                          <p className="text-gray-600 dark:text-gray-100">
                            Engage in realistic dialogue with the AI-powered patient.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-md w-80">
                        <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">Step 3: Receive Feedback</h3>
                          <p className="text-gray-600 dark:text-gray-100">
                            Decide to treat or refer the patient. Get instant feedback on your choice. Review your transcript.
                        </p>
                    </div>
                </div>
            </section>
            <section className="pb-24 text-center max-w-full">
                <h2 className="text-3xl font-bold mb-10 text-black dark:text-gray-100" >Why Choose QAIRx?</h2>
                <div className="flex justify-center gap-12 flex-wrap">
                    <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-md w-80">
                        <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">Realistic Simulations</h3>
                        <p className="text-gray-600 dark:text-gray-100">
                            Practice realistic patient interactions, prescription analysis, and
                            drug counseling with AI simulations.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-md w-80">
                        <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">Instant Feedback</h3>
                        <p className="text-gray-600 dark:text-gray-100">
                            Get instant feedback on your communication skills and knowledge,
                            helping you improve continuously.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-stone-800 p-8 rounded-lg shadow-md w-80">
                        <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">Flexible Learning</h3>
                        <p className="text-gray-600 dark:text-gray-100">
                            Learn at your own pace, anytime, anywhere. The platform adapts to
                            your learning needs and schedule.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-[url(assets/Capsules.jpg)] bg-cover text-center py-36">
                <h2 className="text-3xl font-bold mb-8 text-stone-900">
                    Start Your AI Pharmacy Education Journey Today!
                </h2>
                <Link to='/login'>
                    <Button variant="default">
                        Sign Up Now
                    </Button>
                </Link>
            </section>





        </div>

    )
}

export default HomePage;