import useAuth from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import useRefreshToken from '../../hooks/useRefreshToken';

const PersistAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist } = useAuth();
    const ref = useRef<LoadingBarRef>(null);


    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                auth.isAuthenticating = true;
                await refresh();
            } catch (err) {
                console.log(err);

            } finally {
                setIsLoading(false);
                auth.isAuthenticating = false;
            }

        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);


    }, [isLoading])

    useEffect(() => {
        if (isLoading) { ref.current?.continuousStart() } else { ref.current?.complete() }

    }, [isLoading])

    return (
        <>
            {!persist ?
                <Outlet />
                : isLoading ?
                    <div>
                        <LoadingBar color="red" ref={ref} shadow={true} height={2} />
                    </div>
                    :
                    <Outlet />
            }
        </>
    )

}

export default PersistAuth