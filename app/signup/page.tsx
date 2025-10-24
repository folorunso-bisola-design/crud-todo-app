"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUp } from "@/actions/auth";
import { Spinner } from "@/components/ui/spinner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
});

export default function SignUpPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      await signUp(values.email, values.password, values.username, {
        onRequest: () => {
          setIsLoading(true);
          toast.loading("Signing up...");
        },
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Sign up successful!");
          window.location.href = "/";
        },
        onError: (ctx: { error: { message?: string } }) => {
          setIsLoading(false);
          toast.error(ctx.error.message || "Sign up failed!");
        },
      });
    } catch (err) {
      setIsLoading(false);
      toast.error(
        err instanceof Error ? err.message : "Unknown error occurred"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-[5%] w-[5%] " />
      </div>
    );
  }

  return (
    <div className="bg-white bg-[url('/background.jpg')] bg-center bg-cover text-black min-h-screen flex items-center justify-center">
      <div className="md:h-fit md:w-[50%] w-fit h-fit flex flex-col gap-12 md:gap-32 bg-[#161D2F] rounded-3xl p-12">
        <h1 className="text-4xl md:text-6xl text-white font-semibold">
          Sign Up
        </h1>

        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8 md:gap-12"
            >
              <div className="flex flex-col gap-10 md:gap-12">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel className="">Email</FormLabel> */}
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel className="">Email</FormLabel> */}
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Password</FormLabel> */}
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...field}
                          />
                          {showPassword ? (
                            <Eye
                              className="text-white"
                              onClick={() => setShowPassword(false)}
                            />
                          ) : (
                            <EyeOff
                              className="text-white"
                              onClick={() => setShowPassword(true)}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className="self-center bg-white hover:bg-[#161D2F] text-[#161D2F] hover:text-white mt-8 md:w-[150px] md:h-[50px] md:text-xl text-md w-[100px] h-[40px]"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>

              <div className="flex text-white justify-center">
                <Link
                  href="/signin"
                  className="text-sm text-white hover:underline"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
