import {useFormContext} from "react-hook-form";
import {State} from "@prisma/client";
import {stateLabels} from "@/lib/product";
import Button from "@/components/button";
import Step from "./step";

type Props = {}

export default function StateStep({}: Readonly<Props>) {
    const {register, setValue, getValues, watch} = useFormContext()

    watch("state")

    function handleChange(value: State) {
        return () => {
            setValue("state", value)
        }
    }

    return <Step label={"État"} id={"state"}>
        <input {...register("state")} className={"hidden"}/>
        <div className={"grid grid-cols-4 gap-4"}>
            {Object.entries(stateLabels).map(([key, value]) => <Button
                variant={getValues("state") === key ? "primary" : "none"} key={key} label={value}
                onClick={handleChange(key as State)}/>)}

        </div>
    </Step>
}