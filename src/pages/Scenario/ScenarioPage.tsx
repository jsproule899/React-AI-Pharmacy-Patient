import Spinner from "@/components/ui/Spinner";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useCallback, useEffect, useState } from "react";
import { FaExpand } from "react-icons/fa6";
import { useLocation } from "react-router";
import { Unity, useUnityContext } from "react-unity-webgl";


function ScenarioPage() {

    const location = useLocation();
    const [isUploading, setIsUploading] = useState(false);
    const isEmbeddedRoute = location.pathname.startsWith('/embedded');
    const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();


    const { unityProvider, isLoaded, UNSAFE__unityInstance, requestFullscreen, sendMessage, addEventListener, removeEventListener } = useUnityContext({

        loaderUrl: "/unity/Build/Build.loader.js",
        dataUrl: "/unity/Build/Build.data.unityweb",
        frameworkUrl: "/unity/Build/Build.framework.js.unityweb",
        codeUrl: "/unity/Build/Build.wasm.unityweb",
        streamingAssetsUrl: '/unity/StreamingAssets',

    });

    const handleTranscriptUpload = useCallback((filename: string, data: string) => {
        let paths = location.pathname.split("/");
        let scenarioId = paths[paths.length - 1];
        setIsUploading(true);
        try {
            axiosPrivate.post('/api/transcript', { Filename: filename, Data: data, Scenario: scenarioId }).then(() => {
                setIsUploading(false);
            })
        } catch (error) {
            console.log(error);
            setIsUploading(false);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem uploading the transcript.",
            })
        }
    }, [])


    useEffect(() => {
        (window as any).myInstance = UNSAFE__unityInstance as any
    }, [UNSAFE__unityInstance]);

    useEffect(() => {
        if (isLoaded) {
            sendMessage("ConfigController", "SetApiBaseUrl", import.meta.env.VITE_API_BASEURL)
            sendMessage("ConfigController", "SetAuthToken", auth.accessToken || "")

        }
    }, [isLoaded])

    const unloadUnity = async () => {
        const canvas = (window as any).myInstance?.Module.canvas as HTMLCanvasElement;
        document.body.appendChild(canvas);
        canvas.style.display = "none";
        await (window as any).myInstance.Quit();
        await UNSAFE__unityInstance?.Quit();
        unityProvider.setUnityInstance(null);
        (window as any).myInstance = null;
        canvas.remove();
    }

    useEffect(() => {
        return () => {
            unloadUnity();

        };
    }, []);

    useEffect(() => {
        addEventListener("UploadTranscript", handleTranscriptUpload as any);
        return () => {
            removeEventListener("UploadTranscript", handleTranscriptUpload as any);
        };
    }, [addEventListener, removeEventListener, handleTranscriptUpload]);

    function handleFullscreen() {
        requestFullscreen(true);
    }

    window.onbeforeunload = function () {
        if (isUploading) {
            return "Your transcript is not completely uploaded...";
        }
    }

    return (

        <>
            {!isLoaded && (
                <Spinner />
            )}
            <div className="flex-grow flex justify-center items-center bg-stone-50 dark:bg-stone-900 relative" style={{ display: isLoaded ? "flex" : "none" }}>
                <Unity unityProvider={unityProvider} devicePixelRatio={window.devicePixelRatio} className={`w-full ${isEmbeddedRoute ? 'h-dvh' : 'h-[calc(100dvh-5rem)]'}`} tabIndex={1} />
                <button onClick={handleFullscreen}><FaExpand className="w-6 h-6 m-1 text-white hover:scale-110 transition-transform absolute bottom-0 right-0 z-50" /></button>
            </div>

        </>

    )
}

export default ScenarioPage;
