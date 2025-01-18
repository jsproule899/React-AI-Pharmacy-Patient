import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function HomePage() {
    return (
        <div className="flex-grow bg-stone-50 dark:bg-stone-900">

            <section className="bg-gradient-to-r from-red-600 to-red-400 text-white text-center py-32 min-h-[calc(100dvh-5rem)]">
                <div>
                    <h1 className="text-4xl font-extrabold mb-6">Welcome to AI Pharmacy Patient</h1>
                    <p className="text-xl mb-8">
                        Enhance your pharmacy education through AI-driven roleplays and
                        simulations.
                    </p>
                    <Link to='/scenarios'>
                    <Button variant="secondary">
                        Get Started
                    </Button>
                    </Link>
                </div>

                <section className="py-24 text-center max-w-full">
                <h2 className="text-3xl font-bold mb-10">How It Works</h2>
                <div className="flex justify-center gap-12 flex-wrap">
                    <div className="bg-white p-8 rounded-lg shadow-md w-80">
                        <h3 className="text-xl font-semibold mb-4 text-black">Step 1: Choose a Scenario</h3>
                        <p className="text-gray-600">
                            Select from a range of pharmacy-related scenarios and roles to
                            simulate.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md w-80">
                        <h3 className="text-xl font-semibold mb-4 text-black" >Step 2: Interact with AI</h3>
                        <p className="text-gray-600">
                            Engage in realistic dialogue with the AI-powered patient.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md w-80">
                        <h3 className="text-xl font-semibold mb-4 text-black">Step 3: Receive Feedback</h3>
                        <p className="text-gray-600">
                            Decide to treat or refer the patient. Get instant feedback on your choice. Review your transcript.
                        </p>
                    </div>
                </div>
            </section>
            </section>

            <section className="py-24 text-center max-w-full">
                <h2 className="text-3xl font-bold mb-10 text-black dark:text-gray-100" >Why Choose AI Pharmacy Patient?</h2>
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

            <section className="bg-red-600 text-white text-center py-24">
            <h2 className="text-3xl font-bold mb-8 text-black dark:text-gray-100">
                    Start Your Pharmacy Education Journey Today!
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