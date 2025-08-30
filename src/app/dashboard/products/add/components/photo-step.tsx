import {useFormContext} from "react-hook-form";
import Camera from "@/components/camera";
import {ForwardedRef} from "react";
import Step from "@/app/dashboard/products/add/components/step";

type Props = {
    takePhotoRef: ForwardedRef<HTMLButtonElement>;
    clearPhotoRef: ForwardedRef<HTMLButtonElement>;
}

export default function PhotoStep({clearPhotoRef, takePhotoRef}: Readonly<Props>) {
    const {setValue} = useFormContext()

    function handleCapture(imageSrc: Blob | undefined) {
        setValue("photo", imageSrc ? new File([imageSrc], "temp") : imageSrc)
    }

    return (<Step label={"Photo"} id={"photo"}>
        <Camera onCapture={handleCapture} clearPhotoRef={clearPhotoRef} takePhotoRef={takePhotoRef}/>
    </Step>)
}