"use client"
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import Button from "@/components/button";
import {PlayIcon, RotateCcwIcon, SquareIcon} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {brandLabels, sizeLabels} from "@/lib/product";
import {Brand, Category} from "@prisma/client";
import {ProductFormAttributes} from "@/types/product";

type Props = {
    onVocalCommandAction: (attribute: ProductFormAttributes, value?: string) => void;
}

const brandFuzzy = {
    [Brand.bonton]: 0.7,
    [Brand.bonpoint]: 0.7,
    [Brand.natalys]: 0.5,
    [Brand.boutchou_monoprix]: 0.8,
};

export default function VoiceDetection({ onVocalCommandAction }: Readonly<Props>) {
    const [isMounted, setIsMounted] = useState(false);

    const brandCommands = useMemo(() => Object.entries(brandLabels).filter(([k]) => k !== Brand.Empty).map(([key, value]) => ({
        command: value.toLowerCase().replace(/\(.*\)]/g, "").replace(/œ/g, "oe"),
        callback: (command: string, spokenPhrase: string) => {
            if(command) onVocalCommandAction("brand", key)
        },
        ...(key in brandFuzzy && {
            fuzzyMatchingThreshold: brandFuzzy[key as keyof typeof brandFuzzy],
            isFuzzyMatch: true
        })
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
        {
            command: ['manches courtes', 'manche courte'],
            callback: (category: string) => {
                onVocalCommandAction("category", Category.tshirt_short)
            },
        },
        ...brandCommands,
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