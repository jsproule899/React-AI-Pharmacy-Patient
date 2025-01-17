
import Spinner from "@/components/ui/Spinner";
import { useEffect } from "react";
import { FaExpand } from "react-icons/fa6";
import { useLocation } from "react-router";
import { Unity, useUnityContext } from "react-unity-webgl";


function ScenarioPage() {

    const location = useLocation();
    const isEmbeddedRoute = location.pathname.startsWith('/embedded');

    const { unityProvider, isLoaded, UNSAFE__unityInstance, UNSAFE__detachAndUnloadImmediate, requestFullscreen, sendMessage,  } = useUnityContext({
        loaderUrl: "/unity/Build/Build.loader.js",
        dataUrl: "/unity/Build/Build.data",
        frameworkUrl: "/unity/Build/Build.framework.js",
        codeUrl: "/unity/Build/Build.wasm",
        streamingAssetsUrl: '/unity/StreamingAssets',
    });


    useEffect(
        () => { (window as any).myInstance = UNSAFE__unityInstance as any },
        [UNSAFE__unityInstance]
    );

    useEffect(
        () => {
            if(isLoaded){
                sendMessage("ConfigController", "SetApiBaseUrl", import.meta.env.VITE_API_BASEURL)
            }
           
        }, [isLoaded]
    )

    useEffect(() => {
        return () => {
          UNSAFE__detachAndUnloadImmediate();
        };
      }, [location]);

    function handleFullscreen() {
        requestFullscreen(true);
    }


    return (

        <>
            {!isLoaded && (
                <Spinner />
            )}
            <div className="flex-grow flex justify-center items-center bg-stone-50 dark:bg-stone-900 relative" style={{ display: isLoaded ? "flex" : "none" }}>
                <Unity unityProvider={unityProvider} devicePixelRatio={window.devicePixelRatio} className={`w-full ${isEmbeddedRoute ? 'h-dvh' : 'h-[calc(100dvh-5rem)]'}`} tabIndex={1} />
                <button onClick={handleFullscreen}><FaExpand className="w-8 h-8 m-1 text-white hover:scale-110 transition-transform absolute bottom-0 right-0 z-50" /></button>
            </div>

        </>

    )
}

export default ScenarioPage;
