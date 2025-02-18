import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";



const PasswordInput = forwardRef(({ className, id, onChange, onBlur, onSelect }: { className?: string, id: string, onChange?: () => void, onBlur?: () => void, onSelect?: () => void }, ref: any) => {
    const password = useRef<HTMLInputElement | null>(null)
    const [passwordVisible, setPasswordVisible] = useState(false);

    useImperativeHandle(ref, () => password.current);


    const togglePassword = () => {

        let password = document.getElementById(id) as HTMLInputElement;
        passwordVisible ? password.type = "password" : password.type = "text";
        setPasswordVisible(!passwordVisible);
    }

    return (
        <div className="relative">
            <Input className={cn("dark:border-1 dark:border-stone-50 pr-8", className)} id={id} type="password" ref={password} onChange={onChange}
                onBlur={onBlur} onSelect={onSelect} />
            <Button variant="link" className="absolute top-0 right-0 p-3" type="button" onClick={togglePassword} tabIndex={-1}>
                {!passwordVisible ?
                    <FaRegEye /> :
                    <FaRegEyeSlash />
                }
            </Button>

        </div>
    )
})

export default PasswordInput