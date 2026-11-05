// "use client";
import { AuthForm } from "@/components/AuthForm"
import { FlameIcon, Scissors } from "lucide-react"
import Link from "next/link"

export default function Register() {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Scissors className="size-4" />
            </span>
            <span>StitchForce</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <AuthForm type="signup" />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://images.pexels.com/photos/21033251/pexels-photo-21033251.jpeg"
          alt="Image"
          className="dark:brightness absolute inset-0 h-full w-full object-cover dark:grayscale-[0.7]"
        />
      </div>
    </div>
  )
}

// export default function Register(){
//   return AuthPage()
// }

export const metadata = {
  title: "Register - StitchForce",
  description: "Register to StitchForce to manage your stitching projects.",
}
