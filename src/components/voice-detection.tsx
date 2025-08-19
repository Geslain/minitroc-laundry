"use client"
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import Button from "@/components/button";
import {CircleIcon, PlayIcon, Trash} from "lucide-react";
import {ForwardedRef, useEffect, useMemo, useState} from "react";
import {brandLabels, categoryLabels, genderLabels, seasonLabels, sizeLabels, stateLabels} from "@/lib/product";
import {Brand, Category, Gender, Season, Size} from "@prisma/client";
import {ProductFormAttributes} from "@/types/product";

type Props = {
    onVocalCommandAction: (attribute: ProductFormAttributes | "submit", value?: string) => void;
    clearPromptsRef: ForwardedRef<HTMLButtonElement>
}

const brandFuzziness = {
    [Brand.bonton]: 0.7,
    [Brand.bonpoint]: 0.7,
    [Brand.natalys]: 0.5,
    [Brand.boutchou_monoprix]: 0.8,
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
export default function VoiceDetection({onVocalCommandAction, clearPromptsRef}: Readonly<Props>) {
    const [isMounted, setIsMounted] = useState(false);
    const [prompts, setPrompts] = useState<{text: string, date: Date}[]>([])
    const [currentTranscript, setCurrentTranscript] = useState("")

    const brandCommands = useMemo(() => Object.entries(brandLabels).filter(([k]) => k !== Brand.Empty).map(([key, value]) => ({
        command: value.toLowerCase().replace(/\(.*\)]/g, "").replace(/œ/g, "oe"),
        callback: (command: string) => {
            if (command) onVocalCommandAction("brand", key)
        },
        ...(key in brandFuzziness && {
            fuzzyMatchingThreshold: brandFuzziness[key as keyof typeof brandFuzziness],
            isFuzzyMatch: true
        })
    })), [onVocalCommandAction])

    const sizeCommands = useMemo(() => Object.entries(sizeLabels).filter(([k]) => k !== Size.Empty).map(([key, value]) => ({
        command: [value, ...(key in altervativeSizeCommands ? altervativeSizeCommands[key as keyof typeof altervativeSizeCommands] : [])],
        callback: (command: string) => {
            if (command) onVocalCommandAction("size", key)
        }
    })), [onVocalCommandAction])

    const categoryCommands = useMemo(() => Object.entries(categoryLabels).filter(([k]) => k !== Category.Empty).map(([key, value]) => ({
        command: value.split("/").map(s => s.trim()),
        callback: (command: string) => {
            if (command) onVocalCommandAction("category", key)
        },
        ...(key in categoryFuzziness && {
            fuzzyMatchingThreshold: categoryFuzziness[key as keyof typeof categoryFuzziness],
            isFuzzyMatch: true
        })
    })), [onVocalCommandAction])

    const seasonCommands = useMemo(() => Object.entries(seasonLabels).filter(([k]) => k !== Season.Empty).map(([key, value]) => ({
        command: value,
        callback: (command: string) => {
            if (command) onVocalCommandAction("season", key)
        }
    })), [onVocalCommandAction])

    const genderCommands = useMemo(() => Object.entries(genderLabels).filter(([k]) => k !== Gender.Empty).map(([key, value]) => ({
        command: value,
        callback: (command: string) => {
            if (command) onVocalCommandAction("gender", key)
        }
    })), [onVocalCommandAction])

    const stateCommands = useMemo(() => Object.entries(stateLabels).map(([key, value]) => ({
        command: value,
        callback: (command: string) => {
            if (command) onVocalCommandAction("state", key)
        }
    })), [onVocalCommandAction])

    const commands = [
        {
            command: 'Nom du produit *',
            callback: (name: string) => onVocalCommandAction("name", name),
        },
        {
            command: 'Description *',
            callback: (description: string) => onVocalCommandAction("description", description)
        },
        {
            command: 'taille *',
            callback: (size: string) => onVocalCommandAction("size", Object.entries(sizeLabels).find(([, value]) => value.toLowerCase().includes(size))?.[0]),
        },
        ...brandCommands,
        ...sizeCommands,
        ...categoryCommands,
        ...seasonCommands,
        ...genderCommands,
        ...stateCommands,
        {
            command: ['capture photo', 'prendre photo', 'capture', 'photo', 'photos'],
            callback: () => {
                onVocalCommandAction("photo")
            },
        },
        {
            command: ['envoyer', 'soumettre', 'valider', "suivant"],
            callback: () => {
                onVocalCommandAction("submit")
            },
        }
    ]

    function resetPrompt() {
        setPrompts([])
        setCurrentTranscript("")
    }

    const {
        listening,
        interimTranscript,
        finalTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({commands})

    useEffect(() => {
        if (interimTranscript) {
            setCurrentTranscript(interimTranscript)
        }
    }, [interimTranscript]);

    useEffect(() => {
        if (currentTranscript) {
            setPrompts([...prompts, {text: currentTranscript, date: new Date()}])
            setCurrentTranscript("")
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

    return (
        <div className={"flex flex-col gap-4"}>
            <div className={"flex justify-between"}>
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
            <div className={"flex flex-col border inset-shadow-sm grow rounded-lg border-gray-300 p-2 h-0 overflow-scroll gap-3"}>
                <div className={"font-bold"}>Liste des commandes:</div>
                <ul className={"flex flex-col gap-2 text-sm"}>
                    {prompts.map((prompt) => (
                        <li key={prompt.date.getTime()}>
                            <span className={"p-1 text-xs border font-bold bg-blue-200 rounded-md border-blue-300"}>{prompt.date.toLocaleTimeString()}</span>
                            <span>&nbsp;-&nbsp;</span>
                            <span className={"capitalize"}>{prompt.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}