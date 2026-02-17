import { auth } from "@clerk/nextjs/server";
import { checkProfile } from "@/lib/user";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    const profile = await checkProfile();
    if (!profile) {
      redirect("/complete-profile");
    }
    // If profile exists, show dashboard or logged-in view
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-4">Welcome back!</h1>
        <p>You are logged in and your profile is complete.</p>
        {/* Add dashboard components here */}
      </div>
    );
  }

  // Not logged in - Landing Page
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-4xl font-bold">StudySync</h1>
        <p className="mt-4 text-lg">Your academic resource sharing platform.</p>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Please sign in to continue.</p>
      </main>
    </div>
  );
}
