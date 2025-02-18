import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import useAuth from "@/hooks/useAuth"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { User } from "@/types/User"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import PasswordInput from "../Login/PasswordInput"
import useLogout from "@/hooks/useLogout"
import { useNavigate } from "react-router"


const formSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine(({ password }, ctx) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }

    let errorMessage = '';

    if (password.length < 8) {
      errorMessage += 'Must be at least 8 characters long. \n';
    }
    if (countOfLowerCase < 1) {
      errorMessage += 'Must contain at least one lowercase letter. \n';
    }
    if (countOfUpperCase < 1) {
      errorMessage += 'Must contain at least one uppercase letter. \n';
    }
    if (countOfNumbers < 1) {
      errorMessage += 'Must contain at least one number. \n';
    }
    if (countOfSpecialChar < 1) {
      errorMessage += 'Must contain at least one special character. \n';
    }

    if (errorMessage) {
      ctx.addIssue({
        code: 'custom',
        path: ['password'],
        message: errorMessage,
      });
    }
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'The passwords do not match.',
      });
    }
  });


const ProfilePage = () => {

  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState<User | null>();
  const [errMsg, setErrMsg] = useState("");
  const { auth, setAuth } = useAuth();
  const { logout, logoutEverywhere } = useLogout();
  const navigate = useNavigate();
  const savePassword = useRef<HTMLButtonElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const confirmPassword = useRef<HTMLInputElement | null>(null); 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    },
  })

  const [tab, setTab] = useState("account");

  const onTabChange = (value:string) => {
    setTab(value);
  }

  useEffect(() => {
    axiosPrivate
      .post(`/api/user/email`, { Email: auth.email })
      .then((response) => {
        setUser(response.data);

      })
      .catch((error) => {
        console.error("Error fetching User data", error);
      });

  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  }

  const handleLogoutEverywhere = async () => {
    await logoutEverywhere();
    navigate('/');
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setErrMsg("");
      savePassword.current!.innerHTML = "Saving"
      savePassword.current!.disabled = true;

      const res = await axiosPrivate.put('/api/auth/update', {
        email: auth.email,
        password: values.password
      },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        })

      if (res.status === 200) {
        toast({
          variant: "success",
          description: "Password successfully updated."
        })
        setAuth((prev) => ({ ...prev, isTempPassword: false }))
      }
    } catch (err: any) {
      if (err.response?.data) {
        setErrMsg(err.response.data.message)
      } else {
        toast({
          variant: "destructive",
          description: err.message
        })
      }
    } finally {
      password.current!.value = "";
      confirmPassword.current!.value = "";
      savePassword.current!.innerHTML = "Save Password"
      savePassword.current!.disabled = false;
    }


  }

  return (
    <div className="md:p-6 flex flex-grow md:mx-10 justify-center">
      <Tabs value={tab} onValueChange={onTabChange} className="w-[400px] my-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="logOut">Log out</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Your account details are below. Contact an admin for changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Student Number</Label>
                <Input id="studentNo" value={user?.StudentNo} readOnly />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Email Address</Label>
                <Input id="email" value={user?.Email} readOnly />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Academic Year</Label>
                <Input id="academicYear" value={user?.AcademicYear} readOnly />
              </div>
            </CardContent>
            <CardFooter>

            </CardFooter>
          </Card>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              {errMsg && <Label className="font-semibold text-qub-red dark:text-qub-red border-qub-red border rounded-lg bg-qub-red/10 p-4 animate-in mb-2">{errMsg}</Label>}
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <CardContent className="space-y-2">
                  {/* Password input */}
                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            className={error && "border-qub-red focus-visible:ring-qub-red dark:border-qub-darkred dark:focus-visible:ring-qub-darkred"}
                            id="password"
                            {...field}
                            ref={password}
                            onSelect={() => { form.trigger("password") }}
                          />

                        </FormControl>
                        {error && <FormMessage className="my-0 whitespace-pre-line">{error.message}</FormMessage>}
                      </FormItem>

                    )}
                  />
                  {/* Confirm password input */}
                  <Controller
                    control={form.control}
                    name="confirmPassword"
                    render={({ field, fieldState: { error } }) => (
                      <FormItem>
                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            className={error && "border-qub-red focus-visible:ring-qub-red dark:border-qub-darkred dark:focus-visible:ring-qub-darkred"}
                            id="confirmPassword"
                            {...field}
                            ref={confirmPassword}
                            onSelect={() => { form.trigger("confirmPassword") }}
                          />
                        </FormControl>
                        {error && <FormMessage className="my-0 whitespace-pre-line">{error.message}</FormMessage>}
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button type="submit" ref={savePassword}>Save password</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* Sign out tab */}
        <TabsContent value="logOut">
          <Card>
            <CardHeader>
              <CardTitle>Log Out</CardTitle>
              <CardDescription>
                Log out of this session.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button type="button" onClick={handleLogout}>Log Out</Button>
            </CardContent>
            <CardHeader>
              <CardTitle>Log Out Everywhere</CardTitle>
              <CardDescription>
              Log you out of all sessions. If you believe your account has been compromised, we recommend you 
                <p className="hover:underline text-qub-red cursor-pointer w-fit inline mx-1" onClick={()=>{setTab("password")}}>
                  change your password.
                </p>


              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="" type="button" onClick={handleLogoutEverywhere}>Log Out Everywhere</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs >
    </div >
  )
}

export default ProfilePage