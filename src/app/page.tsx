import {redirect} from "next/navigation";
import {auth} from "@clerk/nextjs/server";
import {RedirectToSignIn} from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }
  else {
    return <RedirectToSignIn/>
  }
}
