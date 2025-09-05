import {useFormContext} from "react-hook-form";
import Step from "@/app/dashboard/products/new/components/step";

export default function DescriptionStep() {
    const {register} = useFormContext()
    return (
        <Step label={"Comment décrieriez vous votre article ?"} id={"description"}>
            <input {...register("description")} placeholder={"Décrivez votre produit..."} id={"description"} autoFocus/>
        </Step>
    )
}