import { useFormContext } from "react-hook-form";
import {steps} from "@/lib/step";

type Props = {
    className?: string;
}

export default function ReviewCard({className} : Readonly<Props>) {
    const { watch } = useFormContext();

    const formValues = watch();

    return (
        <div className={`bg-gray-50 p-6 rounded-lg border border-gray-200 ${className}`}>
            <dl className="divide-y divide-gray-200">
                {Object.entries(steps).map(([key, step]) => (
                    <div className="py-2 flex justify-between" key={key}>
                        <dt className={`font-medium text-gray-500 rounded-full px-2 py-1 ${step.color}`}>{step.label}</dt>
                        <dd className="text-gray-900">{"formatter" in step ? step.formatter(formValues[key] as never) : formValues[key]}</dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}