"use client";

import AuthForm from "@/components/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth";
import { signinSchema } from "@/lib/validations";
import React from "react";

const SignIn = () => {
    return (
        <AuthForm
            type="SIGN_IN"
            schema={signinSchema}
            defaultValues={{ email: "", password: "" }}
            onSubmit={signInWithCredentials}
        />
    );
};

export default SignIn;
