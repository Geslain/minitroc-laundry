import {useFormContext} from "react-hook-form";
import {Gender} from "@prisma/client";
import {genderLabels} from "@/lib/product";
import Button from "@/components/button";
import Step from "@/app/dashboard/products/new/components/step";

export default function GenderStep() {
    const {register, setValue, getValues, watch} = useFormContext()

    watch("gender")

    function handleChange(value: Gender) {
        return () => {
            setValue("gender", value)
        }
    }

    return (<Step label={"Genre"} id={"gender"}>
        <input {...register("gender")} className={"hidden"}/>
        <div className={"grid grid-cols-4 gap-4"}>
            {Object.entries(genderLabels).map(([key, value]) => <Button
                variant={getValues("gender") === key ? "primary" : "none"} key={key} label={value}
                onClick={handleChange(key as Gender)}/>)}

        </div>
    </Step>)
}