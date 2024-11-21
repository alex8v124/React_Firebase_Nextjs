"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Asegúrate de que este archivo exporte tu instancia de Firebase Auth.
import toast from "react-hot-toast";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      // Registrar el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Actualizar el perfil del usuario con el nombre
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      toast.success("Account created successfully!");
      console.log("User registered:", userCredential.user);

      // Redirigir al usuario, si es necesario.
      // router.push("/dashboard"); // Necesitarías `useRouter` de Next.js para esto.
    } catch (error: unknown) {
        if (error instanceof Error) {
            toast.error(error.message, { duration: 2500 });
          } else {
            toast.error("An unknown error occurred.", { duration: 2500 });
          }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Full Name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          aria-label="Full Name"
        />
      </div>
      <div className="space-y-2">
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          aria-label="Email"
        />
      </div>
      <div className="space-y-2">
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          aria-label="Password"
        />
      </div>
      <div className="space-y-2">
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          placeholder="Confirm Password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          aria-label="Confirm Password"
        />
      </div>
      <button
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Signing Up..." : "Sign Up"}
      </button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a
          href="../"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </a>
      </p>
    </form>
  );
}
