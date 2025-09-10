"use client";
import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {newProductSchema} from "@/lib/validators/product";
import {z} from "zod";
import {AnimatePresence, motion} from "framer-motion";
import NameStep from "./name-step";
import DescriptionStep from "./description-step";
import {useEffect, useRef, useState} from "react";
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
import ReviewCard from "@/app/dashboard/products/new/components/review-card";
import {addProduct} from "@/app/actions/products";
import {toast} from "react-toastify";
import {StepName, stepOrder} from "@/types/step";

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

export default function NewProductForm() {
    const methods =
        useForm<FormValues>({
            resolver: zodResolver(newProductSchema),
            defaultValues
        });
    const {getValues, setValue, reset, handleSubmit, formState} = methods;
    const [direction, setDirection] = useState<"forward" | "backward">("forward");

    const [currentStep, setCurrentStep] = useState<StepName>("name")
    const submitButtonRef = useRef<HTMLButtonElement>(null)
    const clearPromptsRef = useRef<HTMLButtonElement>(null)
    const takePhotoRef = useRef<HTMLButtonElement>(null)
    const clearPhotoRef = useRef<HTMLButtonElement>(null)


    useEffect(() => {
        if (formState.errors.photo) {
            toast("Veuillez prendre une photo", {type: "error"});
        }
        if (formState.errors.size) {
            toast("Veuillez sélectionner une taille", {type: "error"});
        }
        if (formState.errors.brand) {
            toast("Veuillez sélectionner une marque", {type: "error"});
        }
        if (formState.errors.category) {
            toast("Veuillez sélectionner une catégorie", {type: "error"});
        }
        if (formState.errors.season) {
            toast("Veuillez sélectionner une saison", {type: "error"});
        }
        if (formState.errors.state) {
            toast("Veuillez sélectionner l'état du produit", {type: "error"});
        }
        if (formState.errors.gender) {
            toast("Veuillez sélectionner un genre", {type: "error"});
        }
        if (formState.errors.name) {
            toast("Veuillez ajouter un nom au produit", {type: "error"});
        }
        if (formState.errors.description) {
            toast("Veuillez ajouter une description au produit", {type: "error"});
        }
    }, [formState.errors]);
    const onSubmit = async (values: FormValues) => {
        const fd = new FormData();
        Object.entries(values).forEach(([k, v]) => {
            if (k === "photo" && v instanceof File) {
                fd.append("photo", v);
            } else {
                fd.append(k, String(v ?? ""));
            }
        });

        try {
            const response = await addProduct(fd);
            if ("error" in response) {
                toast(`Erreur: ${response.error || 'Une erreur est survenue'}`, {type: "error"});
                return;
            }
            reset({
                ...defaultValues,
                size: getValues("size"),
                category: getValues("category")
            });
            toast("Produit créé ✅", {type: "success"});
            setCurrentStep("name");
            clearPhotoRef.current?.click()
            clearPromptsRef.current?.click()
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            toast("Erreur lors de la communication avec le serveur", {type: "error"});
        }
    };

    const handleNextStep = () => {
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
            setDirection("forward");
            setCurrentStep(stepOrder[currentIndex + 1]);
        }
    };

    const handlePreviousStep = () => {
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex > 0) {
            setDirection("backward");
            setCurrentStep(stepOrder[currentIndex - 1]);
        }
    };

    function handleVocalCommand(attribute: ProductFormAttributes | "submit" | "step", value?: string) {
        console.log("Vocal command:", attribute, value);
        if (attribute === "submit") {
            submitButtonRef.current?.click()
        } else if (attribute === "step") {
            setCurrentStep(value as StepName)
        } else if (value) {
            setValue(attribute, value)
            const step = stepOrder.indexOf(attribute)
            setDirection("forward");
            setCurrentStep(stepOrder[step + 1])
            if (["category", "state", "brand"].includes(attribute)) {
                setValue("price", calculatePrice(getValues("brand"), getValues("category"), getValues("state")))
            }
        } else if (attribute === "photo") {
            takePhotoRef.current?.click()
        }
    }

    const handleStepClick = (step: StepName) => {
        setCurrentStep(step)
    }


    const variants = {
        enter: (direction: string) => ({
            x: direction === "forward" ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: string) => ({
            x: direction === "forward" ? -100 : 100,
            opacity: 0
        })
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className={"grid md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[100%] grid-rows-[50%] gap-4 p-4 h-full"}>
                <VoiceDetection onVocalCommandAction={handleVocalCommand} clearPromptsRef={clearPromptsRef}
                                className={"lg:col-span-3 md:col-span-1 z-10 bg-white"} step={currentStep}/>

                <div className="flex flex-col grow gap-4 lg:col-span-6 md:col-span-2 justify-between">
                    <AnimatePresence custom={direction} mode="popLayout">
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit">
                            {currentStep === "name" && <NameStep/>}
                            {currentStep === "description" && <DescriptionStep/>}
                            {currentStep === "category" && <CategoryStep/>}
                            {currentStep === "brand" && <BrandStep/>}
                            {currentStep === "state" && <StateStep/>}
                            {currentStep === "gender" && <GenderStep/>}
                            {currentStep === "size" && <SizeStep/>}
                            {currentStep === "season" && <SeasonStep/>}
                            {currentStep === "photo" &&
                                <PhotoStep clearPhotoRef={clearPhotoRef} takePhotoRef={takePhotoRef}/>}
                        </motion.div>
                    </AnimatePresence>
                    <div className={"flex"}>
                        {currentStep !== "name" &&
                            <Button label={"Précédent"} onClick={handlePreviousStep}></Button>}
                        <Button label={currentStep === "photo" ? "Valider" : "Suivant"}
                                type={currentStep === "photo" ? "submit" : "button"} ref={submitButtonRef}
                                onClick={handleNextStep} className={"ml-auto"}/>
                    </div>
                </div>
                <ReviewCard className={"lg:col-span-3 lg:col-start-10 md:col-span-1 md:col-start-2 md:row-start-1 z-10"}
                            onStepClick={handleStepClick} currentStep={currentStep}/>
            </form>
        </FormProvider>)
}