import {useFormContext} from "react-hook-form";
import Step from "@/app/dashboard/products/new/components/step";

export default function NameStep() {
    const {register} = useFormContext()
    return (
            <Step label={"Comment s'appelle votre article ?"} id={"name"}>
                <input {...register("name")} placeholder={"Donnez un nom à votre nouveau produit..."} id={"name"}
                       autoFocus/>
            </Step>
    )
}