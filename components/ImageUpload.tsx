"use client";

import config from "@/lib/config";
import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

const authenticator = async () => {
    try {
        const response = await fetch(`${config.env.apiEndpoint}/api/imageKit`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`
            );
        }
        const data = await response.json();
        const { signature, expire, token } = data;
        return { token, expire, signature };
    } catch (error: any) {
        throw new Error(`Authentication request failed ${error.message}`);
    }
};

const {
    env: {
        imageKit: { publicKey, urlEndpoint },
    },
} = config;

interface ImageUploadProps {
    onFileChange: (filePath: string) => void;
}

const ImageUpload = ({ onFileChange }: ImageUploadProps) => {
    const { toast } = useToast();
    const ikUploadRef = useRef(null);
    const [file, setFile] = useState<{ filePath: string } | null>(null);

    const onError = (error: any) => {
        console.log(error);
        toast({
            variant: "destructive",
            title: "Image upload failed",
            description: "Your image couldn't be uploaded",
        });
    };

    const onSuccess = (res: any) => {
        setFile(res);
        onFileChange(res.filePath);
        toast({
            title: "File uploaded successfully!",
            description: `${res.filePath} uploaded successfully!`,
        });
    };

    return (
        <ImageKitProvider
            authenticator={authenticator}
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
        >
            <IKUpload
                ref={ikUploadRef}
                onError={onError}
                onSuccess={onSuccess}
                fileName="test-upload.png"
                className="hidden"
            />
            <Button
                className="upload-btn"
                onClick={(e) => {
                    e.preventDefault();
                    if (ikUploadRef.current) {
                        // @ts-ignore
                        ikUploadRef.current?.click();
                    }
                }}
            >
                <Image
                    src="/icons/upload.svg"
                    alt="upload"
                    width={20}
                    height={20}
                    className="object-contain"
                />
            </Button>
            {file && (
                <IKImage
                    alt={file.filePath}
                    path={file.filePath}
                    width={500}
                    height={500}
                />
            )}
        </ImageKitProvider>
    );
};

export default ImageUpload;
