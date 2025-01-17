"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
    const router = useRouter();

    return (
        <Button
            onClick={() => router.back()}
            className="flex items-center w-20 !bg-white"
        >
            <ArrowLeft className="size-6 transition-all duration-200 hover:size-8" />
            Back
        </Button>
    );
};

export default BackButton;
