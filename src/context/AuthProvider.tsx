import { createContext, useState } from "react";

type Auth = {
    email: string | null;
    studentNo?: string | null;
    roles: string[] | null;
    accessToken: string | null;
    isTempPassword: boolean;
    isAuthenticated: boolean;
    isAuthenticating: boolean;
};

type AuthProviderProps = {
    children: React.ReactNode;
};

type AuthProviderState = {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
    persist: boolean
    setPersist: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultAuth: Auth = {
    email: null,
    roles: null,
    accessToken: null,
    isAuthenticated:false,
    isAuthenticating:true,
    isTempPassword:false
};

const AuthContext = createContext<AuthProviderState>({
    auth: defaultAuth,
    setAuth: () => { },
    persist: false,
    setPersist: () => {}
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<Auth>(defaultAuth);
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist") || "false") || false);

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthContext;