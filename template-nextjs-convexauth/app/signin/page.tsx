"use client";

import { DEFAULT_MIN_PASSWORD_LENGTH } from "@convex-dev/auth/methods/username-password";
import {
  type SignInWithUsernamePasswordResult,
  type SignUpWithUsernamePasswordResult,
  useSignInWithUsernamePassword,
  useSignUpWithUsernamePassword,
} from "@convex-dev/auth/methods/username-password/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function SignIn() {
  const { signIn, pending: signInPending } = useSignInWithUsernamePassword(
    api.auth,
  );
  const { signUp, pending: signUpPending } = useSignUpWithUsernamePassword(
    api.auth,
  );
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const loading = signInPending || signUpPending || redirecting;
  const router = useRouter();
  return (
    <div className="flex flex-col gap-8 w-full max-w-lg mx-auto h-screen justify-center items-center px-4">
      <div className="text-center flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <Image src="/convex.svg" alt="Convex Logo" width={90} height={90} />
          <div className="w-px h-20 bg-slate-300 dark:bg-slate-600"></div>
          <Image
            src="/nextjs-icon-light-background.svg"
            alt="Next.js Logo"
            width={90}
            height={90}
            className="dark:hidden"
          />
          <Image
            src="/nextjs-icon-dark-background.svg"
            alt="Next.js Logo"
            width={90}
            height={90}
            className="hidden dark:block"
          />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
          Convex + Next.js + Convex Auth
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          This demo uses Convex Auth for authentication, so you will need to
          sign in or sign up to access the demo.
        </p>
      </div>
      <form
        className="flex flex-col gap-4 w-full bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-300 dark:border-slate-600"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          void (flow === "signIn" ? signIn : signUp)({
            username,
            password,
          }).then((result) => {
            if (result.status === "complete") {
              setRedirecting(true);
              router.push("/");
            } else {
              setError(errorMessage(result.userError));
            }
          });
        }}
      >
        <input
          className="bg-white dark:bg-slate-900 text-foreground rounded-lg p-3 border border-slate-300 dark:border-slate-600 focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 outline-none transition-all placeholder:text-slate-400"
          // A static id helps password managers behave correctly
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className="flex flex-col gap-1">
          <input
            className="bg-white dark:bg-slate-900 text-foreground rounded-lg p-3 border border-slate-300 dark:border-slate-600 focus:border-slate-500 dark:focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 outline-none transition-all placeholder:text-slate-400"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            autoComplete={
              flow === "signIn" ? "current-password" : "new-password"
            }
            minLength={
              flow === "signUp" ? DEFAULT_MIN_PASSWORD_LENGTH : undefined
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {flow === "signUp" && (
            <p className="text-xs text-slate-500 dark:text-slate-400 px-1">
              Password must be at least {DEFAULT_MIN_PASSWORD_LENGTH} characters
            </p>
          )}
        </div>
        <button
          className="bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-semibold rounded-lg py-3 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="flex flex-row gap-2 text-sm justify-center">
          <span className="text-slate-600 dark:text-slate-400">
            {flow === "signIn"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <span
            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium underline decoration-2 underline-offset-2 hover:no-underline cursor-pointer transition-colors"
            onClick={() => {
              setFlow(flow === "signIn" ? "signUp" : "signIn");
              setError(null);
            }}
          >
            {flow === "signIn" ? "Sign up" : "Sign in"}
          </span>
        </div>
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 dark:border-rose-500/50 rounded-lg p-4">
            <p className="text-rose-700 dark:text-rose-300 font-medium text-sm break-words">
              {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

type UserError = Extract<
  SignInWithUsernamePasswordResult | SignUpWithUsernamePasswordResult,
  { status: "error" }
>["userError"];

function errorMessage(userError: UserError): string {
  switch (userError.error) {
    case "USER_NOT_FOUND":
      return "No account exists with that username.";
    case "INVALID_CREDENTIALS":
      return "Incorrect username or password.";
    case "RATE_LIMITED":
      return `Too many attempts. Try again in ${Math.ceil(userError.retryAfterMs / 1000)} seconds.`;
    case "USERNAME_TAKEN":
      return "That username is already taken.";
    case "USERNAME_TOO_SHORT":
      return `Username must be at least ${userError.minimumLength} characters.`;
    case "USERNAME_HAS_SURROUNDING_WHITESPACE":
      return "Username can't start or end with whitespace.";
    case "USERNAME_HAS_INVALID_CHARACTERS":
      return "Username contains characters that aren't allowed.";
    case "PASSWORD_TOO_SHORT":
      return `Password must be at least ${userError.minimumLength} characters.`;
    case "PASSWORD_TOO_LONG":
      return `Password must be at most ${userError.maximumLength} characters.`;
    case "PASSWORD_HAS_SURROUNDING_WHITESPACE":
      return "Password can't start or end with whitespace.";
    case "PASSWORD_TOO_COMMON":
      return "That password is too common. Please choose a different one.";
    case "OTHER_ERROR":
      console.error(userError.cause);
      return "Something went wrong. Please try again.";
    default:
      userError satisfies never;
      return "Something went wrong. Please try again.";
  }
}
