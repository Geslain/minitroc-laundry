'use client'

import {useClerk} from '@clerk/nextjs'
import Button from "@/components/button";
import {LogOutIcon} from "lucide-react";

export const SignOutButton = () => {
    const {signOut} = useClerk()

    return (
        <Button type={"button"} variant={"danger"} label={"Déconnexion"} icon={LogOutIcon} onClick={() => signOut({redirectUrl: '/'})}/>
    )
}