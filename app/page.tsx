"use client";
import BaseButton from "@/components/ui/buttons/BaseButton";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-white">
      <div className="absolute w-full top-0 h-fit flex justify-between p-4 items-center border-b border-gray-200 shadow-sm">
        <div className="logo items-center w-1/3 flex gap-2 font-bold cursor-default text-xl font-bricolage text-black ">
          <Image src="/logo.svg" alt=" " className="h-full" width={30} height={30} />
          SimpleStocks
        </div>
        <div className="flex self-center gap-4 w-1/3 font-bold text-xl justify-center items-center bg-white rounded-md text-black">
          <Link className="animated-underline" href="/login">Pricing</Link>
          <Link className="animated-underline" href="/register">FAQ</Link>
          <Link className="animated-underline" href="/register">Reviews</Link>
        </div>
        <div className="w-1/3 flex justify-end">
          <BaseButton onClick={() => router.push("/login")} className="transition-transform duration-300 hover:scale-105">Log in</BaseButton>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center font-bricolage">
        <div className="flex">
          <h1 className="text-5xl font-extrabold tracking-tight cursor-default text-black">Stop losing time managing your&nbsp;
            <span className="relative">
              stocks
              <p className="text-lg absolute font-medium -bottom-4 -right-10 -rotate-[20deg] self-end font-handlee text-primary">easily 🙂</p></span>
          </h1>
        </div>
        <div className="flex flex-col p-2 mt-6 cursor-default">
          <h2 className="text-2xl font-semibold tracking-tight text-black">Simple, easy to use, and effective:</h2>
          <div className="flex flex-col py-4 text-gray-600">
            <p className="text-xl flex items-center gap-2 tracking-tight">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12L9 18L21 6" />
              </svg>
              Get alerts when your stocks are running low
            </p>
            <p className="text-xl flex items-center gap-2 tracking-tight">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12L9 18L21 6" />
              </svg>
              Manage your stocks from anywhere, anytime
            </p>
            <p className="text-xl flex items-center gap-2 tracking-tight">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12L9 18L21 6" />
              </svg>
              Invite your team to manage your stocks together
            </p>
          </div>
          <BaseButton onClick={() => router.push("/register?invite_url=createBusiness")} className="shadow-xl drop-shadow-xl shadow-primary transition-transform duration-300 hover:scale-105">Stop losing time</BaseButton>
        </div>
      </div>

      {/* I Love Alyssa */}
    </div>
  );
}
