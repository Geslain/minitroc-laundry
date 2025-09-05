
type Props = {
    label: string
    id: string
    children: React.ReactNode
}

export default function Step({label, id, children}: Readonly<Props>) {
    return<div className={"flex flex-col gap-8"}>
        <label htmlFor={id} className={"text-2xl font-bold text-center"}>{label}</label>
        {children}
    </div>
}