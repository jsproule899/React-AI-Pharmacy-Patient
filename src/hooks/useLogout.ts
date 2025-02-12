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
            isAuthenticating: false
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


    return logout
}

export default useLogout






