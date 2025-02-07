import { axiosPrivate } from "@/components/api/axios";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken"
import { useEffect, useRef } from "react";


const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const interceptorsSet = useRef(false); // Track if interceptors are set


    useEffect(() => {
        if (interceptorsSet.current) return; // Skip if already set


        const requestIntecept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            responnse => responnse,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        interceptorsSet.current = true; // Mark interceptors as set

        return () => {
            axiosPrivate.interceptors.response.eject(requestIntecept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
            interceptorsSet.current = false; // Reset on cleanup
        }

    }, [auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate