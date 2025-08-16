import {ButtonHTMLAttributes, createElement, DetailedHTMLProps, ForwardedRef, forwardRef} from "react"
import {LucideIcon} from "lucide-react";

type Props = {
    icon?: LucideIcon;
    label?: string;
    variant?: "primary" | "danger"
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const Button = forwardRef(({icon, label, variant = "primary", className, ...rest}: Props, ref: ForwardedRef<HTMLButtonElement>) => {
    const classes = (() => {
        switch (variant) {
            case "primary":
                return "bg-blue-500 hover:bg-blue-600 text-white"
            case "danger":
                return "bg-red-500 hover:bg-red-600 text-white"
        }
    })()
    return <button ref={ref} {...rest} className={`flex justify-center gap-2 p-3 rounded-lg items-center transition-colors ${classes} ${className} `}>
        {icon && createElement(icon, {className: "w-4 h-4", "aria-hidden": "true"})}
        {label}
    </button>
})

export default Button