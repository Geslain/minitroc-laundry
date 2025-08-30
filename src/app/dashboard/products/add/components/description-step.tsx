import {useFormContext} from "react-hook-form";
import Step from "@/app/dashboard/products/add/components/step";

type Props = {}
export default function DescriptionStep({}: Readonly<Props>) {
    const {register} = useFormContext()
    return (
        <Step label={"Comment décrieriez vous votre article ?"} id={"description"}>
            <input {...register("description")} placeholder={"Dites \"Description...\""} id={"description"}/>
        </Step>
    )
}