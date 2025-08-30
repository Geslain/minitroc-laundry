"use client";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {newProductSchema} from "@/lib/validators/product";
import {z} from "zod";
import NameStep from "./name-step";
import DescriptionStep from "./description-step";
import {useRef, useState} from "react";
import Button from "@/components/button";
import CategoryStep from "./category-step";
import BrandStep from "./brand-step";
import StateStep from "./state-step";
import GenderStep from "./gender-step";
import SizeStep from "./size-step";
import PhotoStep from "./photo-step";
import VoiceDetection from "@/components/voice-detection";
import {ProductFormAttributes} from "@/types/product";
import {calculatePrice} from "@/lib/price";
import SeasonStep from "./season-step";
import ReviewCard from "@/app/dashboard/products/add/components/review-card";

const defaultValues = {
    category: undefined,
    gender: undefined,
    season: undefined,
    size: undefined,
    status: undefined,
    brand: undefined,
    state: undefined,
    price: 0
}

export type FormValues = z.input<typeof newProductSchema>;

export type StepName =
    | "name"
    | "description"
    | "category"
    | "brand"
    | "state"
    | "gender"
    | "size"
    | "season"
    | "photo"

const stepOrder: StepName[] = [
    "name",
    "description",
    "category",
    "brand",
    "state",
    "gender",
    "size",
    "season",
    "photo",
];

export default function AddProductForm() {
    const methods =
        useForm<FormValues>({
            resolver: zodResolver(newProductSchema),
            defaultValues
        });
    const {getValues, setValue} = methods;

    const [currentStep, setCurrentStep] = useState<StepName>("name")
    const clearPromptsRef = useRef<HTMLButtonElement>(null)
    const takePhotoRef = useRef<HTMLButtonElement>(null)
    const clearPhotoRef = useRef<HTMLButtonElement>(null)

    const handleNextStep = () => {
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
        }
    };

    const handlePreviousStep = () => {
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(stepOrder[currentIndex - 1]);
        }
    };

    function handleVocalCommand(attribute: ProductFormAttributes | "submit", value?: string) {
        if (attribute === "submit") {
            //submitButtonRef.current?.click()
            //clearPhotoRef.current?.click()
            clearPromptsRef.current?.click()
        } else if (value) {
            setValue(attribute, value)
            const step = stepOrder.indexOf(attribute)
            setCurrentStep(stepOrder[step + 1])
            if (["category", "state", "brand"].includes(attribute)) {
                setValue("price", calculatePrice(getValues("brand"), getValues("category"), getValues("state")))
            }
        } else if (attribute === "photo") {
            takePhotoRef.current?.click()
        } else {
            setCurrentStep(attribute)
        }
    }


    return (
        <FormProvider {...methods}>
            <div className={"grid grid-cols-12 gap-4 p-4 h-full"}>
                <VoiceDetection onVocalCommandAction={handleVocalCommand} clearPromptsRef={clearPromptsRef}
                                className={"col-span-3"}/>
                <div className={"flex flex-col gap-4 p-4 col-span-6 justify-around"}>
                    {currentStep === "name" && <NameStep/>}
                    {currentStep === "description" && <DescriptionStep/>}
                    {currentStep === "category" && <CategoryStep/>}
                    {currentStep === "brand" && <BrandStep/>}
                    {currentStep === "state" && <StateStep/>}
                    {currentStep === "gender" && <GenderStep/>}
                    {currentStep === "size" && <SizeStep/>}
                    {currentStep === "season" && <SeasonStep/>}
                    {currentStep === "photo" && <PhotoStep clearPhotoRef={clearPhotoRef} takePhotoRef={takePhotoRef}/>}
                    <div className={"flex"}>
                        {currentStep !== "name" && <Button label={"Précédent"} onClick={handlePreviousStep}></Button>}
                        <Button label={currentStep === "photo" ? "Valider" : "Suivant"}
                                onClick={handleNextStep} className={"ml-auto"}></Button>
                    </div>
                </div>
                <ReviewCard className={"col-span-3"}/>
            </div>
        </FormProvider>
    )
}