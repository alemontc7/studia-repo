'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Katibeh, Poppins } from 'next/font/google';

const katibeh = Katibeh({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const poppins = Poppins({
  weight: ['100', '200','300','400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
});


export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="flex flex-col items-center justify-center w-1/2 h-3/4">
        <h1 className={`${katibeh.className} text-[120px] text-gray-900 mb-8`}>StudIA</h1>
        <p className={`${poppins.className} text-[20px] text-gray-800 text-center italic font-extralight px-10 mb-8`}>
          THE best tool for la cato&apos;s systems engineering students, take
          notes, plan your learning schedule and more
        </p>
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <Button
            variant="studia-primary"
            size="studia"
            onClick={() => router.push('/login')}
          >
            Sign in
          </Button>
          <Button
            variant="studia-primary"
            size="studia"
            onClick={() => router.push('/register')}
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}

