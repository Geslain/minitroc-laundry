import {useFormContext} from "react-hook-form";
import {categoryLabels} from "@/lib/product";
import {Category} from "@prisma/client";
import Button from "@/components/button";
import Step from "@/app/dashboard/products/add/components/step";

type Props = {}
export default function CategoryStep({}: Readonly<Props>) {
    const {register, setValue, getValues, watch} = useFormContext()

    watch("category")

    function handleChange(value: Category) {
        return () => {
            setValue("category", value)
        }
    }

    return (
        <Step label={"Catégorie"} id={"category"}>
            <input {...register("category")} className={"hidden"}/>
            <div className={"grid grid-cols-4 gap-4"}>
                {Object.entries(categoryLabels).map(([key, value]) => <Button
                    variant={getValues("category") === key ? "primary" : "none"} key={key} label={value}
                    onClick={handleChange(key as Category)}/>)}

            </div>
        </Step>)
}