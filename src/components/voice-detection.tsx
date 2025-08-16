"use client"
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import Button from "@/components/button";
import {PlayIcon, RotateCcwIcon, SquareIcon} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {brandLabels, categoryLabels, genderLabels, seasonLabels, sizeLabels, stateLabels} from "@/lib/product";
import {Brand, Category, Gender, Season, Size, State} from "@prisma/client";
import {ProductFormAttributes} from "@/types/product";

type Props = {
    onVocalCommandAction: (attribute: ProductFormAttributes, value?: string) => void;
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
export default function VoiceDetection({ onVocalCommandAction }: Readonly<Props>) {
    const [isMounted, setIsMounted] = useState(false);

    const brandCommands = useMemo(() => Object.entries(brandLabels).filter(([k]) => k !== Brand.Empty).map(([key, value]) => ({
        command: value.toLowerCase().replace(/\(.*\)]/g, "").replace(/œ/g, "oe"),
        callback: (command: string, spokenPhrase: string) => {
            if(command) onVocalCommandAction("brand", key)
        },
        ...(key in brandFuzziness && {
            fuzzyMatchingThreshold: brandFuzziness[key as keyof typeof brandFuzziness],
            isFuzzyMatch: true
        })
    })), [onVocalCommandAction])

    const sizeCommands = useMemo(() => Object.entries(sizeLabels).filter(([k]) => k !== Size.Empty).map(([key, value]) => ({
        command: [value, ...(key in altervativeSizeCommands ? altervativeSizeCommands[key as keyof typeof altervativeSizeCommands] : [])],
        callback: (command: string) => {
            if(command) onVocalCommandAction("size", key)
        }
    })), [onVocalCommandAction])

    const categoryCommands = useMemo(() => Object.entries(categoryLabels).filter(([k]) => k !== Category.Empty).map(([key, value]) => ({
        command: value.split("/").map(s => s.trim()),
        callback: (command: string) => {
            if(command) onVocalCommandAction("category", key)
        },
        ...(key in categoryFuzziness && {
            fuzzyMatchingThreshold: categoryFuzziness[key as keyof typeof categoryFuzziness],
            isFuzzyMatch: true
        })
    })), [onVocalCommandAction])

    const seasonCommands = useMemo(() => Object.entries(seasonLabels).filter(([k]) => k !== Season.Empty).map(([key, value]) => ({
        command: value,
        callback: (command: string) => {
            if(command) onVocalCommandAction("season", key)
        }
    })), [onVocalCommandAction])

    const genderCommands = useMemo(() => Object.entries(genderLabels).filter(([k]) => k !== Gender.Empty).map(([key, value]) => ({
        command: value,
        callback: (command: string) => {
            if(command) onVocalCommandAction("gender", key)
        }
    })), [onVocalCommandAction])

    const stateCommands = useMemo(() => Object.entries(stateLabels).map(([key, value]) => ({
        command: value,
        callback: (command: string) => {
            if(command) onVocalCommandAction("state", key)
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
            callback: (size: string) => onVocalCommandAction("size", Object.entries(sizeLabels).find(([key, value]) => value.toLowerCase().includes(size))?.[0]),
        },
        ...brandCommands,
        ...sizeCommands,
        ...categoryCommands,
        ...seasonCommands,
        ...genderCommands,
        ...stateCommands,
        {
            command: ['capture photo', 'prendre photo', 'capture', 'photo'],
            callback: () => {
                onVocalCommandAction("photo")
            },
        }
    ]

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({commands})

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
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <Button onClick={() => SpeechRecognition.startListening({ continuous: true })} icon={PlayIcon}
                    label={"Démarrer la reconnaissance vocale"}></Button>
            <Button onClick={SpeechRecognition.stopListening} variant={"danger"} icon={SquareIcon}
                    label={"Stopper"}>Stop</Button>
            <Button onClick={resetTranscript} icon={RotateCcwIcon} label={"Reset"}></Button>
            <p>{transcript}</p>
        </div>
    )
}