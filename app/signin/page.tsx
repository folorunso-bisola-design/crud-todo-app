"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "@/actions/auth";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

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
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function SignInPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await signIn(values.email, values.password, {
        onRequest: () => {
          setIsLoading(true);
          isLoading ? toast.loading("Signing in...") : null;
        },
        onSuccess: (ctx: any) => {
          setIsLoading(false);
          toast.success("Sign in successful!");
          // console.log("onSuccess callback - Sign in successful!", ctx);
          window.location.href = "/";
        },
        onError: (ctx: any) => {
          setIsLoading(false);
          toast.error("Sign in failed!");
          // console.error("onError callback - Sign in failed:", ctx);
          // console.error("Error details:", JSON.stringify(ctx.error, null, 2));
          setError(ctx.error.message || "Sign in failed");
        },
      });
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
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
        <h1 className="text-4xl md:text-6xl text-white font-semibold">Login</h1>

        <div className="">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8 md:gap-12"
            >
              <div className="flex flex-col gap-14 md:gap-12">
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
              >
                Sign In
              </Button>

              <div className="flex text-white justify-center">
                <Link
                  href="/signup"
                  className="text-sm text-white hover:underline"
                >
                  Don&apos;t have an account? Sign up
                </Link>
                {/* <Link
                  href="/forgot-password"
                  className="text-sm text-white hover:underline"
                >
                  Forgot password?
                </Link> */}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
