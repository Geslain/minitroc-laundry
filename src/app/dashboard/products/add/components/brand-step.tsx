import {useFormContext} from "react-hook-form";
import {Brand} from "@prisma/client";
import {brandLabels} from "@/lib/product";
import Button from "@/components/button";
import Step from "@/app/dashboard/products/add/components/step";

type Props = {}

export default function BrandStep({}: Readonly<Props>) {
    const {register, setValue, getValues, watch} = useFormContext()

    watch("brand")

    function handleChange(value: Brand) {
        return () => {
            setValue("brand", value)
        }
    }

    return (
        <Step label={"Marque"} id={"brand"}>
            <input {...register("brand")} className={"hidden"}/>
            <div className={"grid grid-cols-4 gap-4"}>
                {Object.entries(brandLabels).map(([key, value]) => <Button
                    variant={getValues("brand") === key ? "primary" : "none"} key={key} label={value}
                    onClick={handleChange(key as Brand)}/>)}

            </div>
        </Step>)
}