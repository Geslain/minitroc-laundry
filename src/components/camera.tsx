import Webcam from "react-webcam";
import {ForwardedRef, useCallback, useRef, useState} from "react";
import {CameraIcon, TrashIcon, CircleCheckBig} from "lucide-react";
import Button from "@/components/button";
import Image from "next/image";

type CameraProps = {
    onCapture: (imageSrc: Blob | undefined) => void;
    takePhotoRef: ForwardedRef<HTMLButtonElement>;
    clearPhotoRef: ForwardedRef<HTMLButtonElement>;
}

const Camera = ({onCapture, takePhotoRef, clearPhotoRef}: Readonly<CameraProps>) => {
    const [photo, setPhoto] = useState<Blob | undefined>()
    const webcamRef = useRef<Webcam>(null);

    // Configuration vidéo avec une meilleure résolution
    const videoConstraints = {
        width: 1920,
        height: 1080,
        facingMode: "user"
    };

    const handleCapture = useCallback(
        async () => {
            const imageSrc = webcamRef?.current?.getScreenshot({
                width: 1920,
                height: 1080,
            });
            if (imageSrc) {
                const blob = await (await fetch(imageSrc)).blob();
                setPhoto(blob)
                onCapture(blob)
            }
        },
        [onCapture]
    );

    const handleDelete = () => {
        setPhoto(undefined)
        onCapture(undefined)
    }

    return <div className={"flex lg:flex-col flex-row-reverse gap-4 items-center justify-evenly"}>
        <div className={"relative max-w-[65%]"}>
            <Webcam
                audio={false}
                height={1080}
                width={1920}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className={"rounded-md m-auto w-full"}
            />
            {photo &&
                <div>
                    <Image src={URL.createObjectURL(photo)} alt="webcam screen" width={1280} height={720} className={"rounded-md absolute top-0 left-0"}/>
                    <CircleCheckBig className={"absolute bottom-0 right-0 mr-4 mb-4 text-green-500 w-12 h-12"}/>
                </div>
            }
        </div>
        <div className={"flex lg:flex-row flex-col gap-2 lg:self-center self-start justify-center"}>
            <Button onClick={handleCapture} icon={CameraIcon} label={"Prendre photo"} ref={takePhotoRef}/>
            <Button onClick={handleDelete} icon={TrashIcon} variant={"danger"} ref={clearPhotoRef} label={"Supprimer photo"}/>
        </div>
    </div>
}

export default Camera;