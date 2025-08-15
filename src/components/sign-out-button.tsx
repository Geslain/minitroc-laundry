'use client'

import {useClerk} from '@clerk/nextjs'
import Button from "@/components/button";
import {LogOutIcon} from "lucide-react";

export const SignOutButton = () => {
    const {signOut} = useClerk()

    return (
        <Button type={"button"} variant={"danger"} label={"Sign out"} icon={LogOutIcon} onClick={() => signOut({redirectUrl: '/'})}/>
    )
}