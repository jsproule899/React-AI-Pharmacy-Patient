import { useCallback, useRef, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import { Voice } from "@/types/Voice";
import { toast } from "./use-toast";



const useSamplePlayer = () => {
    const axiosPrivate = useAxiosPrivate();
    const [indexPlaying, setIndexPlaying] = useState(-1);
    const [isSampleLoading, setIsSampleLoading] = useState(false);
    const apiCache = useRef(new Map());


    const playSample = useCallback(async (voice: Voice | undefined, index: number) => {
        const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement | null;
        setIndexPlaying(index);
        if (audioPlayer) {
            try {
                setIsSampleLoading(true);
                let url = `/api/tts/${voice?.Provider.replace(' ', '').toLowerCase().trim()}`              
                let sampleText = "The quick brown fox jumps over the lazy dog."

                // Create a unique key for the cache based on the URL and request payload
                const cacheKey = JSON.stringify({ url, text: sampleText, voice: voice?.VoiceId });

                // Check if the result is already in the cache
                if (apiCache.current.has(cacheKey)) {
                    const cachedSampleURL = apiCache.current.get(cacheKey);
                    audioPlayer.src = cachedSampleURL;
                    audioPlayer.addEventListener('ended', () => {
                        setIndexPlaying(-1);
                    }, { once: true });
                    setIsSampleLoading(false);
                    await audioPlayer.play();
                    return;
                }

                // If not in the cache, make the API request
                const res = await axiosPrivate.post<ArrayBuffer>(url, { text: sampleText, voice: voice?.VoiceId, mode:"stream"}, {
                    validateStatus: (status: number) => status <= 400,
                    responseType: 'arraybuffer'
                });

                const sample = new Blob([res.data], { type: 'audio/mpeg' });
                const sampleURL = URL.createObjectURL(sample);

                // Store the result in the cache
                apiCache.current.set(cacheKey, sampleURL);

                audioPlayer.src = sampleURL;
                audioPlayer.addEventListener('ended', () => {
                    setIndexPlaying(-1);
                }, { once: true });
                setIsSampleLoading(false);
                await audioPlayer.play();

            } catch (error) {
                console.error("Error playing sample:", error);
                setIndexPlaying(-1);
                setIsSampleLoading(false);
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: `There was a problem playing the sample. Please try again.`,
                })

            }

        }
    }, [indexPlaying, apiCache])

    const stopSample = useCallback(() => {
        const audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement | null;
        audioPlayer?.pause()
        audioPlayer!.currentTime = 0
        setIndexPlaying(-1);

    }, [])

    return {
        indexPlaying,
        isSampleLoading,
        setIsSampleLoading,
        playSample,
        stopSample
    };
}
export default useSamplePlayer;