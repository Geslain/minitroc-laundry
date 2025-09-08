"use client"
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import Button from "@/components/button";
import {CircleIcon, PlayIcon, Trash} from "lucide-react";
import {ForwardedRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    brandLabels,
    categoryLabels,
    genderLabels,
    getSizeFromCentimeter,
    seasonLabels,
    sizeLabels,
    stateLabels
} from "@/lib/product";
import {Brand, Category, Size} from "@prisma/client";
import {ProductFormAttributes} from "@/types/product";
import {StepName} from "@/types/step";
import {productAttributes} from "@/lib/product-attributes";

type Props = {
    onVocalCommandAction: (attribute: ProductFormAttributes | "submit" | "step", value?: string) => void;
    clearPromptsRef: ForwardedRef<HTMLButtonElement>
    step: StepName;
    className?: string;
}

const brandFuzziness = {
    [Brand.bonton]: 0.7,
    [Brand.bonpoint]: 0.7,
    [Brand.natalys]: 0.5,
    [Brand.boutchou_monoprix]: 0.6,
    [Brand.tex_carrefour]: 0.6,
    [Brand.shein]: 0.5,
    [Brand.benetton]: 0.4,
};

const categoryFuzziness = {
    [Category.sweatshirt]: 0.7,
}

const altervativeSizeCommands = {
    [Size.zero_months]: ["zéro mois"],
    [Size.one_month]: ["un mois"],
    [Size.three_months]: ["trois mois"],
    [Size.six_months]: ["six mois"],
    [Size.nine_months]: ["neuf mois"],
    [Size.twelve_months]: ["douze mois"],
    [Size.eighteen_months]: ["dix huit mois"],
    [Size.twenty_four_months]: ["vingt quatre mois"]
}
type PromptStep = StepName | "move" | "unknown"

export default function VoiceDetection({onVocalCommandAction, clearPromptsRef, className, step}: Readonly<Props>) {
    const [isMounted, setIsMounted] = useState(false);
    const [prompts, setPrompts] = useState<{ text: string, date: Date, step: PromptStep}[]>([])
    const [currentTranscript, setCurrentTranscript] = useState("")
    const [hasTriggeredCommand, setHasTriggeredCommand] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const addPrompt = useCallback((command: string, step: PromptStep) => {
        setPrompts(prompts => {
            const lastPrompt = prompts[prompts.length-1]
            // Add a prompt only if different from the last
            if(!lastPrompt || !(lastPrompt.step === step && lastPrompt.text === command)) return [...prompts, {text: command, date: new Date(), step}]
            return prompts
        })
    }, [])

    const brandCommands = useMemo(() => Object.entries(brandLabels).map(([key, value]) => ({
        command: value.toLowerCase().replace(/\(.*\)]/g, "").replace(/œ/g, "oe"),
        callback: ({command}: { command: string}) => {
            if (command) {
                onVocalCommandAction("brand", key)
                addPrompt(command, "brand")
                setHasTriggeredCommand(true)
            }
        },
        ...(key in brandFuzziness && {
            fuzzyMatchingThreshold: brandFuzziness[key as keyof typeof brandFuzziness],
            isFuzzyMatch: true
        })
    })), [onVocalCommandAction, addPrompt])

    const sizeCommands = useMemo(() => [{
        command: ["* Cm", "* centimètres"],
        callback: (sizeInCentimeter: string) => {
            if (sizeInCentimeter) {
                onVocalCommandAction("size", getSizeFromCentimeter(parseInt(sizeInCentimeter)))
                addPrompt(`${sizeInCentimeter} cm`, "size")
                setHasTriggeredCommand(true)
            }
        }
    },
        ...Object.entries(sizeLabels).map(([key, value]) => ({
            command: [value, ...(key in altervativeSizeCommands ? altervativeSizeCommands[key as keyof typeof altervativeSizeCommands] : [])],
            callback: ({command}: { command: string}) => {
                if (command) {
                    onVocalCommandAction("size", key)
                    addPrompt(command, "size")
                    setHasTriggeredCommand(true)
                }
            }
        }))], [onVocalCommandAction, addPrompt])

    const categoryCommands = useMemo(() => Object.entries(categoryLabels).map(([key, value]) => ({
        command: value.split("/").map(s => s.trim()),
        callback: ({command}: { command: string}) => {
            if (command) {
                onVocalCommandAction("category", key)
                addPrompt(command, "category")
                setHasTriggeredCommand(true)
            }
        },
        ...(key in categoryFuzziness && {
            fuzzyMatchingThreshold: categoryFuzziness[key as keyof typeof categoryFuzziness],
            isFuzzyMatch: true
        })
    })), [onVocalCommandAction, addPrompt])

    const seasonCommands = useMemo(() => Object.entries(seasonLabels).map(([key, value]) => ({
        command: value,
        callback: ({command}: { command: string}) => {
            if (command) {
                onVocalCommandAction("season", key)
                addPrompt(command, "season")
                setHasTriggeredCommand(true)
            }
        }
    })), [onVocalCommandAction, addPrompt])

    const genderCommands = useMemo(() => Object.entries(genderLabels).map(([key, value]) => ({
        command: value,
        callback: ({command}: { command: string}) => {
            if (command) {
                onVocalCommandAction("gender", key)
                addPrompt(command, "gender")
                setHasTriggeredCommand(true)
            }
        }
    })), [onVocalCommandAction, addPrompt])

    const stateCommands = useMemo(() => Object.entries(stateLabels).map(([key, value]) => ({
        command: value,
        callback: ({command}: { command: string}) => {
            if (command) {
                onVocalCommandAction("state", key)
                addPrompt(command, "state")
                setHasTriggeredCommand(true)
            }
        }
    })), [onVocalCommandAction, addPrompt])

    const stepCommands = {
        brand: brandCommands,
        size: sizeCommands,
        category: categoryCommands,
        season: seasonCommands,
        gender: genderCommands,
        state: stateCommands,
        photo: [{
            command: ['capture photo', 'prendre photo', 'capture', 'photo', 'photos'],
            callback: ({command}: { command: string }) => {
                onVocalCommandAction("photo")
                addPrompt(command, "photo")
                setHasTriggeredCommand(true)
            },
        }],
        name: [],
        description: [],
    }

    const commands = [
        ...stepCommands[step],
        // Add a command for each step for being able to go to each step
        ...Object.entries(productAttributes).filter(([key]) => !["price"].includes(key)).map(([key, step]) => ({
            command: "words" in step ? step.words : step.label,
            matchInterim: true,
            callback: () => {
                onVocalCommandAction("step", key)
                addPrompt(step.label, "move")
                setHasTriggeredCommand(true)
            }
        })),
        {
            command: ['envoyer', 'soumettre', 'valider', "suivant"],
            callback: () => {
                onVocalCommandAction("submit")
                setHasTriggeredCommand(true)
            },
        }
    ]

    function resetPrompt() {
        setPrompts([])
    }

    const {
        listening,
        browserSupportsSpeechRecognition,
        interimTranscript,
        finalTranscript
    } = useSpeechRecognition({commands})

    useEffect(() => {
        if (interimTranscript) {
            setCurrentTranscript(interimTranscript)
        }
    }, [interimTranscript]);

    useEffect(() => {

        if (currentTranscript) {
            if(step === "name" && !productAttributes.name.words.includes(currentTranscript.toLowerCase())) {
                addPrompt(currentTranscript, "name")
                onVocalCommandAction("name", currentTranscript)
                setHasTriggeredCommand(true)
            } else if(step === "description" && !productAttributes.description.words.includes(currentTranscript.toLowerCase())) {
                addPrompt(currentTranscript, "description")
                onVocalCommandAction("description", currentTranscript)
                setHasTriggeredCommand(true)
            } else if (!hasTriggeredCommand) {
                addPrompt(currentTranscript, "unknown")
            }
            setCurrentTranscript("")
            setHasTriggeredCommand(false)
            if(containerRef.current) {
                containerRef.current.scrollTo({
                    top: containerRef.current.scrollHeight + 3000,
                    behavior: "smooth"
                })
            }
        }
    }, [finalTranscript]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    if (!browserSupportsSpeechRecognition) {
        return null
    }

    function renderPrompt({text, date, step}: { text: string, date: Date, step: StepName | "move" | "unknown"}) {
        const [color, label] = (() => {
            if(step === "move") return ["bg-black text-white", `Déplacement  vers`]
            if(step === "unknown") return ["bg-red-500 text-white", `Commande inconnue`]
            if(step) return [productAttributes[step].color, productAttributes[step].label]
            return ["", "Error"]
        })()

        return (
            <li key={date.getTime()+text}>
                <span
                    className={`mr-2 py-1 px-2 rounded-full font-bold ${color}`}>{date.toLocaleTimeString()} - {label}</span>
                <span className={""}>{text}</span>
            </li>
        )
    }

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className={"flex justify-between gap-4"}>
                <Button
                    onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({continuous: true})}
                    variant={"none"}
                    className={"border border-gray-300"}
                >
                    {listening ? <CircleIcon className={"fill-red-500 stroke-0 animate-pulse"}/> :
                        <PlayIcon className={"fill-green-500  stroke-0"}/>}
                    {`${listening ? "Stopper" : "Démarrer"} la reconnaissance vocale`}
                </Button>
                <Button onClick={resetPrompt} ref={clearPromptsRef} icon={Trash} label={"Effacer"}/>
            </div>
            <div ref={containerRef}
                className={"flex flex-col border pb-4 min-h-32 inset-shadow-sm grow rounded-lg border-gray-300 p-2 h-0 overflow-scroll gap-3"}>
                <div className={"font-bold"}>Liste des commandes:</div>
                <ul className={"flex flex-col gap-2 text-sm"}>
                    {prompts.map(renderPrompt)}
                </ul>
            </div>
        </div>
    )
}