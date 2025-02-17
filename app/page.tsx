"use client";
import BaseButton from "@/components/ui/buttons/BaseButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <div className="logo absolute top-2 left-2 font-bold cursor-default text-xl p-4">
        SimpleStocks
      </div>
      <div className="flex gap-4 font-bold text-xl justify-center items-center bg-white rounded-md p-4 top-2 left-1/2 -translate-x-1/2 absolute">
        <Link className="animated-underline" href="/login">Pricing</Link>
        <Link className="animated-underline" href="/register">FAQ</Link>
        <Link className="animated-underline" href="/register">Reviews</Link>
      </div>
      <div className="absolute top-2 right-2 ">
        <BaseButton onClick={() => router.push("/login")}>Log in</BaseButton>
      </div>

      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl font-extrabold tracking-tight">Stop losing time managing your stocks</h1>
        <div className="flex flex-col p-2 mt-6">
          <h2 className="text-2xl font-semibold tracking-tight">Simple, easy to use, and effective:</h2>
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
          <BaseButton className="shadow-xl drop-shadow-xl shadow-primary transition-transform duration-300 hover:scale-105">Stop losing time</BaseButton>
        </div>
      </div>

      {/* I Love Alyssa */}
    </div>
  );
}
