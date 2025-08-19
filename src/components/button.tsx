import {ButtonHTMLAttributes, createElement, DetailedHTMLProps, ForwardedRef, forwardRef} from "react"
import {LucideIcon} from "lucide-react";

type Props = {
    children?: React.ReactNode;
    icon?: LucideIcon;
    label?: string;
    variant?: "primary" | "danger" | "none";
} & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const Button = forwardRef(({children, icon, label, variant = "primary", className, ...rest}: Props, ref: ForwardedRef<HTMLButtonElement>) => {
    const classes = (() => {
        switch (variant) {
            case "none":
                return ""
            case "primary":
                return "bg-blue-700 hover:bg-blue-800 text-white"
            case "danger":
                return "bg-red-700 hover:bg-red-800 text-white"
        }
    })()
    return <button ref={ref} {...rest} className={`flex shadow justify-center gap-2 p-3 rounded-lg items-center transition-colors ${classes} ${className} `}>
        {icon && createElement(icon, {className: "w-4 h-4", "aria-hidden": "true"})}
        {label ? label : children}
    </button>
})

export default Button