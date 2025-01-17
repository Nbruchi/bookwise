"use client";

import config from "@/lib/config";
import { IKVideo, ImageKitProvider } from "imagekitio-next";

interface Props {
    videoUrl: string;
    className?: string;
}

const BookVideo = ({ videoUrl, className }: Props) => {
    return (
        <ImageKitProvider
            publicKey={config.env.imageKit.publicKey}
            urlEndpoint={config.env.imageKit.urlEndpoint}
        >
            <IKVideo
                path={videoUrl}
                controls
                className={`w-full rounded-xl ${className}`}
            />
        </ImageKitProvider>
    );
};

export default BookVideo;
