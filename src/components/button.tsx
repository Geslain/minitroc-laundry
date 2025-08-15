import {ButtonHTMLAttributes, createElement, DetailedHTMLProps} from "react"
import {LucideIcon} from "lucide-react";

type Props = {
    icon?: LucideIcon;
    label?: string;
    variant?: "primary" | "danger"
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export default function Button({icon, label, variant = "primary", className, ...rest}: Props) {
    const classes = (() => {
        switch (variant) {
            case "primary":
                return "bg-blue-500 hover:bg-blue-600 text-white"
            case "danger":
                return "bg-red-500 hover:bg-red-600 text-white"
        }
    })()
    return <button {...rest} className={`flex justify-center gap-2 p-3 rounded-lg items-center transition-colors ${classes} ${className} `}>
        {icon && createElement(icon, {className: "w-4 h-4", "aria-hidden": "true"})}
        {label}
    </button>
}