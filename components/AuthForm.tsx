"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    DefaultValues,
    FieldValues,
    Path,
    SubmitHandler,
    useForm,
    UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import { Input } from "./ui/input";
import ImageUpload from "./ImageUpload";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props<T extends FieldValues> {
    type: "SIGN_IN" | "SIGN_UP";
    schema: ZodType<T>;
    defaultValues: T;
    onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
}

const AuthForm = <T extends FieldValues>({
    type,
    schema,
    defaultValues,
    onSubmit,
}: Props<T>) => {
    const isSignIn = type === "SIGN_IN";
    const { toast } = useToast();
    const router = useRouter();

    const form: UseFormReturn<T> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<T>,
    });

    const submitHandler: SubmitHandler<T> = async (data) => {
        const result = await onSubmit(data);
        if (result.success) {
            toast({
                title: "Success",
                description: isSignIn
                    ? "You've successfully signed in"
                    : "You've successfully signed up",
            });
            router.push("/");
        } else {
            toast({
                variant: "destructive",
                title: `Error ${isSignIn ? "signing in" : "signing up"}`,
                description: result.error ?? "An error occured",
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-white">
                {isSignIn
                    ? "Welcome back to BookWise"
                    : "Create your library account"}
            </h1>
            <p className="text-light-100">
                {isSignIn
                    ? "Access the vast collection of resources, and stay updated"
                    : "Please complete all fields and upload a valid university ID to gain access to the library"}
            </p>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(submitHandler)}
                    className="space-y-6 w-full"
                >
                    {Object.keys(defaultValues).map((field) => (
                        <FormField
                            control={form.control}
                            name={field as Path<T>}
                            key={field}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="capitalize">
                                        {
                                            FIELD_NAMES[
                                                field.name as keyof typeof FIELD_NAMES
                                            ]
                                        }
                                    </FormLabel>
                                    <FormControl>
                                        {field.name === "universityCard" ? (
                                            <ImageUpload
                                                onFileChange={field.onChange}
                                            />
                                        ) : (
                                            <Input
                                                required
                                                {...field}
                                                className="form-input"
                                                type={
                                                    FIELD_TYPES[
                                                        field.name as keyof typeof FIELD_TYPES
                                                    ]
                                                }
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button type="submit" className="form-btn">
                        {isSignIn ? "Sign in" : "Sign up"}
                    </Button>
                </form>
            </Form>
            <p className="text-center text-base font-medium">
                {isSignIn ? "New to Bookwise? " : "Already have an account? "}
                <Link
                    href={isSignIn ? "/sign-up" : "/sign-in"}
                    className="font-bold text-primary"
                >
                    {isSignIn ? "Create an account" : "Sign in"}
                </Link>
            </p>
        </div>
    );
};

export default AuthForm;
