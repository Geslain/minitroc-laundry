import {useFormContext} from "react-hook-form";
import Step from "@/app/dashboard/products/add/components/step";

export default function NameStep() {
    const {register} = useFormContext()
    return (
        <Step label={"Comment s'appelle votre article ?"} id={"name"}>
            <input {...register("name")} placeholder={"Dites \"Nom du produit...\""} id={"name"} autoFocus/>
        </Step>
    )
}