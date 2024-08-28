"use client";
import { Provider } from "@supabase/supabase-js";
import { oAuthSignIn } from "./actions";
import Link from "next/link";
type OAuthProvider = {
  name: Provider;
  displayName: string;
  icon?: JSX.Element;
};


export function OAuthButtons() {
  const oAuthProviders: OAuthProvider[] = [
    {
      name: "google",
      displayName: "Google",
      icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24px"
      height="24px"
    >
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.4-.12-2.42-.38-3.49H24v6.96h11.95c-.25 2.09-1.64 5.21-4.72 7.31l-.04.26 6.87 5.3.48.05c4.36-4.01 6.88-9.9 6.88-16.39z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.3 0 11.59-2.07 15.46-5.63L31.8 37.1c-2.1 1.44-4.81 2.32-7.8 2.32-5.99 0-11.07-4.06-12.88-9.57l-.25.02-7.14 5.55-.1.25C7.62 44.3 15.33 48 24 48z"
      />
      <path
        fill="#FBBC05"
        d="M11.12 29.85A14.85 14.85 0 0 1 10 24c0-1.71.29-3.36.8-4.85L4.02 13.55 3.83 13A24 24 0 0 0 0 24c0 3.78.86 7.34 2.4 10.49l8.72-6.64z"
      />
      <path
        fill="#EA4335"
        d="M24 9.5c4.42 0 7.42 1.9 9.12 3.47l6.64-6.64C35.58 2.59 30.3 0 24 0 15.33 0 7.62 3.7 3.04 9.25l8.82 6.86c1.81-5.51 6.89-9.57 12.88-9.57 2.99 0 5.7.88 7.8 2.32L39.46 5.63C35.59 2.07 30.3 0 24 0z"
      />
    </svg>
    },
  ];

  return (
    <>
      {oAuthProviders.map((provider) => (
        <button
          key={provider.name}
          className="w-full flex items-center justify-center border gap-2 rounded-2xl p-3"
          onClick={async () => {
            await oAuthSignIn(provider.name);
          }}
        >
          {provider.icon}
          Login with {provider.displayName}
        </button>
      ))}
      <Link href="/map" className="underline text-wrap text-center flex justify-center mt-3 border rounded-2xl p-3">View without signing in?</Link>
      
    </>
  );
}