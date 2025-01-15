"use client"

import config from "@/lib/config";
import { IKVideo, ImageKitProvider } from "imagekitio-next";

interface Props {
    videoUrl: string;
}

const BookVideo = ({ videoUrl }: Props) => {
    return (
        <ImageKitProvider
            publicKey={config.env.imageKit.publicKey}
            urlEndpoint={config.env.imageKit.urlEndpoint}
        >
            <IKVideo path={videoUrl} controls className="w-full rounded-xl" />
        </ImageKitProvider>
    );
};

export default BookVideo;
