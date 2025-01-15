"use client";

import config from "@/lib/config";
import { IKImage, ImageKitProvider } from "imagekitio-next";

const CardImage = ({ imgUrl }: { imgUrl?: string }) => {
    return (
        <ImageKitProvider
            publicKey={config.env.imageKit.publicKey}
            urlEndpoint={config.env.imageKit.urlEndpoint}
        >
            <IKImage
                path={imgUrl}
                alt="university card"
                width={500}
                height={300}
            />
        </ImageKitProvider>
    );
};

export default CardImage;
