import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";

export interface AuthJwtPayload extends Partial<JwtPayload> {
    email?: string;
    studentNo?: string;
    roles?: string[];
}

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const { auth, setAuth } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const loadingBar = useRef<LoadingBarRef>(null);

    const decoded = useMemo(() => {
        if (!auth.accessToken) return null;
        try {
            return jwtDecode<AuthJwtPayload>(auth.accessToken);
        } catch (error) {
            console.error("Failed to decode JWT:", error);
            return null;
        }
    }, [auth.accessToken]);

    useEffect(() => {
        const verifyAccessToken = async () => {
            auth.isAuthenticating = true;
            try {
                if (!auth.accessToken)
                    return setAuth((prev) => {
                        return {
                            ...prev,
                            email: null,
                            studentNo: null,
                            roles: null,
                            accessToken: null,
                            isAuthenticated: false,
                            isAuthenticating: false
                        }
                    });


                if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
                    console.log("access token expired")
                    await refresh();
                    await verifyAccessToken();
                } else {
                    setAuth((prev) => {
                        return {
                            ...prev,
                            email: decoded?.email || null,
                            studentNo: decoded?.studentNo || null,
                            roles: decoded?.roles || null,
                            isAuthenticated: true,
                            isAuthenticating: false
                        }
                    });
                }
            } catch (err) {
                await refresh();

            } finally {
                setIsLoading(false);
                auth.isAuthenticating = false;
            }
        }

        !auth?.accessToken ? verifyAccessToken() : setIsLoading(false);

    }, [isLoading, auth.accessToken, setAuth,])

    useEffect(() => {
        if (isLoading) { loadingBar.current?.continuousStart() } else { loadingBar.current?.complete() }

    }, [isLoading])

    return (
        isLoading
            ? <LoadingBar color="red" ref={loadingBar} shadow={true} height={2} />
            : !auth?.isAuthenticated
                ? <Navigate to="/login" state={{ from: location }} replace />
                : auth.roles?.find(role => allowedRoles.includes(role))
                    ? <Outlet />
                    : <Navigate to="/unauthorized" state={{ from: location }} replace />

    )
}

export default RequireAuth;