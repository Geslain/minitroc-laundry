import {useFormContext} from "react-hook-form";
import {Season} from "@prisma/client";
import {seasonLabels} from "@/lib/product";
import Button from "@/components/button";
import Step from "@/app/dashboard/products/new/components/step";

export default function SeasonStep() {
    const {register, setValue, getValues, watch} = useFormContext()

    watch("season")

    function handleChange(value: Season) {
        return () => {
            setValue("season", value)
        }
    }

    return (<Step label={"Saison"} id={"season"}>
        <input {...register("season")} className={"hidden"}/>
        <div className={"grid grid-cols-4 gap-4"}>
            {Object.entries(seasonLabels).map(([key, value]) => <Button
                variant={getValues("season") === key ? "primary" : "none"} key={key} label={value}
                onClick={handleChange(key as Season)}/>)}
        </div>
    </Step>
)
}