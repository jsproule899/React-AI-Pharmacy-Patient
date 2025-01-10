
import { Fragment, useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { Unity, useUnityContext } from "react-unity-webgl";
import { FaExpand } from "react-icons/fa6";
import { UnityInstance } from "react-unity-webgl/declarations/unity-instance";
import Spinner from "@/components/ui/Spinner";



function ScenarioPage() {



    const { unityProvider, isLoaded, UNSAFE__unityInstance, requestFullscreen } = useUnityContext({
        loaderUrl: "../../../unity/Build/Build.loader.js",
        dataUrl: "../../../unity/Build/Build.data",
        frameworkUrl: "../../../unity/Build/Build.framework.js",
        codeUrl: "../../../unity/Build/Build.wasm",
        streamingAssetsUrl: '../../../unity/StreamingAssets',
    });




    useEffect(
        () => { (window as any).myInstance = UNSAFE__unityInstance as any },
        [UNSAFE__unityInstance]
    );

    function handleFullscreen() {
        requestFullscreen(true);
    }


    return (

        <>
            {!isLoaded && (
                // We'll conditionally render the loading overlay if the Unity
                // Application is not loaded.
                <Spinner />
            )}
            <div className="flex-grow flex justify-center items-center bg-stone-50 dark:bg-stone-900 static" style={{ visibility: isLoaded ? "visible" : "hidden" }}>
                <Unity unityProvider={unityProvider} devicePixelRatio={window.devicePixelRatio} className="w-full h-[calc(100dvh-5rem)]" />
                <button onClick={handleFullscreen}><FaExpand className="w-8 h-8 m-1 text-white hover:scale-110 transition-transform absolute bottom-0 right-0 z-50" /></button>
            </div>

        </>

    )
}

export default ScenarioPage;
