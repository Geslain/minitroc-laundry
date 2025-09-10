import useMediaQuery from "@/hooks/use-media-query";

type Props = {
    label: string
    id: string
    children: React.ReactNode
}

export default function Step({label, id, children}: Readonly<Props>) {
    const isMobile = useMediaQuery("(max-width: 1024px)");
    return<div className={"flex flex-col gap-8"}>
        {!isMobile && <label htmlFor={id} className={"text-2xl font-bold text-center"}>{label}</label>}
        {children}
    </div>
}