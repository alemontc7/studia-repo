"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/login");
  };

  const handleSignUp = () => {
    router.push("/register");
  };

  return (
    <div className="main-container">
      <div className="landing">
        <div className="logo">
          <h1>StudIA</h1>
        </div>
        <div className="presentation">
          <p>
            THE best tool for la cato's systems engineering students, take notes, plan your learning schedule and more
          </p>
        </div>
        <div className="buttons-container">
          <button onClick={handleSignIn}>Sign in</button>
          <button onClick={handleSignUp}>Sign up</button>
        </div>
      </div>
    </div>
  );
}
