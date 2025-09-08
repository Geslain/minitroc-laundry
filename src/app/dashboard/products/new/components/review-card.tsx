import {useFormContext} from "react-hook-form";
import {productAttributes} from "@/lib/product-attributes";
import {StepName, stepOrder} from "@/types/step";
import {CheckIcon, XIcon} from "lucide-react";
import {motion} from "framer-motion";

type Props = {
    className?: string;
    onStepClick: (step: StepName) => void;
    currentStep: StepName;
}

export default function ReviewCard({className, onStepClick, currentStep}: Readonly<Props>) {
    const {watch} = useFormContext();

    const formValues = watch();

    const isBeforeCurrentStep = (step: StepName | "price") => {
        if (step === "price")
            return stepOrder.indexOf("photo") <= stepOrder.indexOf(currentStep)
        return stepOrder.indexOf(step) < stepOrder.indexOf(currentStep)
    }

    return (
        <div className={`bg-gray-50 p-6 rounded-lg border border-gray-200 ${className}`}>
            <dl className="divide-gray-200">
                {Object.entries(productAttributes).map(([key, step]) => (
                    <div className={"flex"} key={key}>
                        <div className={"flex flex-col items-center"}>
                            <div className={"w-0 grow border border-blue-500"}></div>
                            <motion.div
                                className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${isBeforeCurrentStep(key as StepName) ? (formValues[key] ? "bg-blue-500 border-blue-500 " : "border-red-600 bg-red-500") : "border-blue-500  bg-white"}`}
                            >
                                {isBeforeCurrentStep(key as StepName) && (formValues[key] ? <CheckIcon className={"w-3 h-3 text-white"}/>: <XIcon className={"w-3 h-3 text-white"}/>)}
                                {key === currentStep && <motion.div
                                    style={{
                                        scale: 0,
                                    }}
                                    animate={{
                                        scale: 1.0,
                                        transition: {
                                            duration: 0.3,
                                        }
                                    }}
                                    className={"w-3 h-3 rounded-full bg-blue-500"}></motion.div>}
                            </motion.div>
                            <div className={"w-0 grow border border-blue-500"}></div>
                        </div>
                        <motion.div
                            whileHover={{
                                scale: 1.1,
                                transition: {
                                    duration: 0.5,
                                },
                            }}
                            className={`lg:py-2 py-1 px-2 flex grow hover:bg-blue-100 hover:border hover:border-blue-500 items-center justify-between hover:rounded-md ${key === "price" ? "cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={() => key !== "price" && onStepClick(key as StepName)}>
                            <dt className={`font-medium text-gray-500 rounded-full px-2 py-1 ${step.color}`}>{step.label}</dt>
                            <dd className="text-gray-900">{step.formatter ? step.formatter(formValues[key] as never) : formValues[key]}</dd>
                        </motion.div>
                    </div>
                ))}
            </dl>
        </div>
    )
}