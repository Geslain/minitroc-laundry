import Webcam from "react-webcam";
import {ForwardedRef, forwardRef, useCallback, useRef, useState} from "react";
import {CameraIcon, TrashIcon} from "lucide-react";
import Button from "@/components/button";

type CameraProps = {
    onCapture: (imageSrc: Blob | undefined) => void;
}

const Camera = forwardRef(({onCapture}: Readonly<CameraProps>, takePhotoButtonRef: ForwardedRef<HTMLButtonElement>) => {
    const [photo, setPhoto] = useState<Blob | undefined>()
    const webcamRef = useRef<Webcam>(null);
    const handleCapture = useCallback(
        async () => {
            const imageSrc = webcamRef?.current?.getScreenshot();
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

    return <div>
        <div className={"relative"}>
            <Webcam
                audio={false}
                height={720}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={1280}
            />
            {photo && <img src={URL.createObjectURL(photo)} alt="webcam screen" className={"absolute top-0 left-0"}/>}
        </div>
        <div className={"mt-2 flex gap-2"}>
            <Button onClick={handleCapture} icon={CameraIcon} label={"Prendre photo"} ref={takePhotoButtonRef}/>
            <Button onClick={handleDelete} icon={TrashIcon} variant={"danger"} label={"Supprimer photo"}/>
        </div>
    </div>
})

export default Camera;