import Webcam from "react-webcam";
import {ForwardedRef, useCallback, useMemo, useRef, useState} from "react";
import {CameraIcon, TrashIcon, CircleCheckBig, RotateCwIcon} from "lucide-react";
import Button from "@/components/button";
import Image from "next/image";
import {useRotateImage} from "@/hooks/use-rotate-image";

type CameraAngle =  0 | 90 | 180 | 270

const PREFERRED_ANGLE_KEY = "camera.angle.preference"

type CameraProps = {
    onCapture: (imageSrc: Blob | undefined) => void;
    takePhotoRef: ForwardedRef<HTMLButtonElement>;
    clearPhotoRef: ForwardedRef<HTMLButtonElement>;
}

const Camera = ({onCapture, takePhotoRef, clearPhotoRef}: Readonly<CameraProps>) => {
    const [photo, setPhoto] = useState<Blob | undefined>()
    const webcamRef = useRef<Webcam>(null);
    const [angle, setAngle] = useState<CameraAngle>(parseInt(window?.localStorage?.getItem(PREFERRED_ANGLE_KEY) || "0") as CameraAngle);
    const { rotate } = useRotateImage()

    function setPersistentAngle(angle: number) {
        setAngle(angle as CameraAngle);
        window.localStorage.setItem(PREFERRED_ANGLE_KEY, angle.toString())
    }

    const isHorizontal = useMemo(() => {
        return [0, 180].includes(angle)
    }, [angle])

    const {height, width} = useMemo(() => {
        return {
            width: 1920,
            height: 1080,
        }
    }, [isHorizontal])

    // Configuration with better resolution
    const videoConstraints = {
        width,
        height,
        facingMode: "user"
    };

    const rotateWebcam = () => {
        setPersistentAngle((angle + 90) % 360 as CameraAngle);
        handleDelete()
    }

    const handleCapture = useCallback(
        async () => {
            const imageSrc = webcamRef?.current?.getScreenshot({
                width,
                height,
            });
            if (imageSrc) {
                const blob =   await rotate(await (await fetch(imageSrc)).blob(), { angle });
                setPhoto(blob)
                onCapture(blob)
            }
        },
        [onCapture, angle]
    );

    const handleDelete = () => {
        setPhoto(undefined)
        onCapture(undefined)
    }

    return <div className={`flex lg:flex-col flex-row-reverse gap-4 items-center justify-evenly rounded-lg grow`}>
        <div className={`flex relative overflow-hidden rounded-md justify-center items-center grow ${photo ? "border-green-500 border-4" : ""}`} style={{ width: "100%", minHeight: "300px" }}>
            <Webcam
                audio={false}
                height={height}
                width={width}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                style={{
                    transform: `rotate(${angle}deg)`,
                }}
                className={`rounded-md m-auto w-full ${photo ? "h-0" : ""}`}
            />
            {photo &&
                <div>
                    <Image
                        src={URL.createObjectURL(photo)}
                        alt="Preview"
                        fill
                        style={{ objectFit: "contain" }}
                        className={"rounded-md"}
                    />
                    <CircleCheckBig className={"absolute bottom-0 right-0 mr-4 mb-4 text-green-500 w-12 h-12"}/>
                </div>
            }
        </div>
        <div className={"flex lg:flex-row flex-col gap-2 lg:self-center self-start justify-center"}>
            <Button onClick={rotateWebcam} icon={RotateCwIcon}></Button>
            <Button onClick={handleCapture} icon={CameraIcon} label={"Prendre photo"} ref={takePhotoRef}/>
            <Button onClick={handleDelete} icon={TrashIcon} variant={"danger"} ref={clearPhotoRef} label={"Supprimer photo"}/>
        </div>
    </div>
}

export default Camera;