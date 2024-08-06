// app/components/SignIn.js
"use client";
import React from "react";

export default function SignIn({
  email,
  password,
  isSignUp,
  localError,
  globalError,
  setEmail,
  setPassword,
  setIsSignUp,
  handleSubmit,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-1 my-2 mr-2 border-2 text-black rounded"
        />
        <input
          label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-1 my-2 mr-2  border-2 text-black rounded"
        />
        <button
          type="submit"
          className="p-2 text-sm rounded bg-orange-300 hover:bg-blue-500 hover:text-white"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="p-1 my-2 mr-2 text-sm rounded bg-orange-600 hover:bg-blue-500 hover:text-white"
      >
        {isSignUp
          ? "Already have an account? Sign In"
          : "Don't have an account? Sign Up"}
      </button>
      {(localError || globalError) && (
        <p className="text-red-500">{localError || globalError}</p>
      )}
    </div>
  );
}
