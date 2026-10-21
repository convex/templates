"use client";

import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { DEFAULT_MIN_PASSWORD_LENGTH } from "@convex-dev/auth/methods/username-password";
import {
  type SignInWithUsernamePasswordResult,
  type SignUpWithUsernamePasswordResult,
  useSignInWithUsernamePassword,
  useSignUpWithUsernamePassword,
} from "@convex-dev/auth/methods/username-password/react";
import { useState } from "react";

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
        Convex + React + Convex Auth
        <SignOutButton />
      </header>
      <main className="p-8 flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">
          Convex + React + Convex Auth
        </h1>
        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  return (
    <>
      {isAuthenticated && (
        <button
          className="bg-slate-200 dark:bg-slate-800 text-dark dark:text-light rounded-md px-2 py-1"
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      )}
    </>
  );
}

function SignInForm() {
  const { signIn, pending: signInPending } = useSignInWithUsernamePassword(
    api.auth,
  );
  const { signUp, pending: signUpPending } = useSignUpWithUsernamePassword(
    api.auth,
  );
  const pending = signInPending || signUpPending;
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto">
      <p>Log in to see the numbers</p>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          void (flow === "signIn" ? signIn : signUp)({
            username,
            password,
          }).then((result) => {
            if (result.status !== "complete") {
              setError(errorMessage(result.userError));
            }
          });
        }}
      >
        <input
          className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
          // A static id helps password managers behave correctly
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={pending}
        />
        <input
          className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          autoComplete={flow === "signIn" ? "current-password" : "new-password"}
          minLength={
            flow === "signUp" ? DEFAULT_MIN_PASSWORD_LENGTH : undefined
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={pending}
        />
        <button
          className="bg-dark dark:bg-light text-light dark:text-dark rounded-md"
          type="submit"
          disabled={pending}
        >
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="flex flex-row gap-2">
          <span>
            {flow === "signIn"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <span
            className="text-dark dark:text-light underline hover:no-underline cursor-pointer"
            onClick={() => {
              setFlow(flow === "signIn" ? "signUp" : "signIn");
              setError(null);
            }}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </span>
        </div>
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
            <p className="text-dark dark:text-light font-mono text-xs">
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

function Content() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      <p>Welcome {viewer ?? "Anonymous"}!</p>
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
      </p>
      <p>
        <button
          className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2"
          onClick={() => {
            void addNumber({ value: Math.floor(Math.random() * 10) });
          }}
        >
          Add a random number
        </button>
      </p>
      <p>
        Numbers:{" "}
        {numbers?.length === 0
          ? "Click the button!"
          : (numbers?.join(", ") ?? "...")}
      </p>
      <p>
        Edit{" "}
        <code className="text-sm font-bold font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded-md">
          convex/myFunctions.ts
        </code>{" "}
        to change your backend
      </p>
      <p>
        Edit{" "}
        <code className="text-sm font-bold font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded-md">
          src/App.tsx
        </code>{" "}
        to change your frontend
      </p>
      <div className="flex flex-col">
        <p className="text-lg font-bold">Useful resources:</p>
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-1/2">
            <ResourceCard
              title="Convex docs"
              description="Read comprehensive documentation for all Convex features."
              href="https://docs.convex.dev/home"
            />
            <ResourceCard
              title="Stack articles"
              description="Learn about best practices, use cases, and more from a growing
            collection of articles, videos, and walkthroughs."
              href="https://www.typescriptlang.org/docs/handbook/2/basic-types.html"
            />
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <ResourceCard
              title="Templates"
              description="Browse our collection of templates to get started quickly."
              href="https://www.convex.dev/templates"
            />
            <ResourceCard
              title="Discord"
              description="Join our developer community to ask questions, trade tips & tricks,
            and show off your projects."
              href="https://www.convex.dev/community"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-2 bg-slate-200 dark:bg-slate-800 p-4 rounded-md h-28 overflow-auto">
      <a href={href} className="text-sm underline hover:no-underline">
        {title}
      </a>
      <p className="text-xs">{description}</p>
    </div>
  );
}
