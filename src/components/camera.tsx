import Webcam from "react-webcam";
import {useCallback, useRef} from "react";

type CameraProps = {
    onCapture: (imageSrc: Blob) => void;
}

export default function Camera({ onCapture }: CameraProps) {
    const webcamRef = useRef<Webcam>(null);
    const capture = useCallback(
        async () => {
            const imageSrc = webcamRef?.current?.getScreenshot();
            if(imageSrc) {
                const blob = await (await fetch(imageSrc)).blob();
                onCapture(blob)
            }
        },
        []
    );

    return <div>
        <Webcam
            audio={false}
            height={720}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={1280}
        />
        <button type={"button"} onClick={capture}>Capture photo</button>
    </div>
}