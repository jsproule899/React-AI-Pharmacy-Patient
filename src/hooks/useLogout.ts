import axios from "@/components/api/axios";
import useAuth from "./useAuth";
import { useQueryClient } from "@tanstack/react-query";

const useLogout = () => {

    const queryClient = useQueryClient()
    const { setAuth } = useAuth();

    const logout = async () => {
        setAuth({
            email: null,
            roles: null,
            accessToken: null,
            isAuthenticated: false,
            isAuthenticating: false,
            isTempPassword: false
        });


        queryClient.clear();
        try {
            await axios.get('/api/auth/logout', {
                withCredentials: true,
                validateStatus: (status) => { return status <= 400 }
            })
        } catch (err) {

        }
    }

    const logoutEverywhere = async () => {
        setAuth({
            email: null,
            roles: null,
            accessToken: null,
            isAuthenticated: false,
            isAuthenticating: false,
            isTempPassword: false
        });


        queryClient.clear();
        try {
            await axios.get('/api/auth/logout-everywhere', {
                withCredentials: true,
                validateStatus: (status) => { return status <= 400 }
            })
        } catch (err) {

        }
    }


    return {logout, logoutEverywhere}
}

export default useLogout






