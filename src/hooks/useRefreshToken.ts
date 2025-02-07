import axios from "@/components/api/axios";
import useAuth from "./useAuth"
import { jwtDecode } from "jwt-decode";
import { AuthJwtPayload } from "@/components/Auth/RequireAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const res = await axios.get('/api/auth/refresh',
                {
                    withCredentials: true
                })

            const decoded = jwtDecode<AuthJwtPayload>(res.data.accessToken);
            setAuth((prev) => {

                return {
                    ...prev,
                    accessToken: res.data?.accessToken || null,
                    email: decoded?.email || null,
                    studentNo: decoded?.studentNo || null,
                    roles: decoded?.roles || null,
                    isAuthenticated: (res.data.accessToken ? true : false),
                    isAuthenticating:false
                }
            });
            return res.data.accessToken;
        } catch (err: any) {
            if (!err.repsonse) {
                console.log("no response from server");
            }

            if(err.response.status>400){
                setAuth((prev) => {

                    return {
                        ...prev,
                        accessToken: null,
                        email:  null,
                        studentNo: null,
                        roles:null,
                        isAuthenticated: false,
                        isAuthenticating:false
                    }
                });
            }
            }
        }
        return refresh;
    }

    export default useRefreshToken;