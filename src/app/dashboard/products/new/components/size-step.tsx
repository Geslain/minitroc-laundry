import {useFormContext} from "react-hook-form";
import {Size} from "@prisma/client";
import {sizeLabels} from "@/lib/product";
import Button from "@/components/button";
import Step from "./step";

export default function SizeStep() {
    const {register, setValue, getValues, watch} = useFormContext()

    watch("size")

    function handleChange(value: Size) {
        return () => {
            setValue("size", value)
        }
    }

    return (<Step label={"Taille"} id={"size"}>
        <input {...register("size")} className={"hidden"}/>
        <div className={"grid grid-cols-4 gap-4"}>
            {Object.entries(sizeLabels).map(([key, value]) => <Button
                variant={getValues("size") === key ? "primary" : "none"} key={key} label={value}
                onClick={handleChange(key as Size)}/>)}

        </div>
    </Step>)
}