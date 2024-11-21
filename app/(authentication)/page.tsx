import { Metadata } from "next"
import Logo from "../components/Logo"
import SignInForm from "./components/sign-in.form"
import "../globals.css";



export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to get access to your product list",
}

export default function Authpage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="lg:grid lg:grid-cols-2">
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600"></div>
            <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
              <Logo />
              <div>
                <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-xl mb-8">
                  &ldquo;This web application helps me to make my life easy&rdquo;
                </p>
                <footer className="text-sm">Yorch Dev</footer>
              </div>
            </div>
          </div>
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="w-full max-w-md mx-auto space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
                <p className="text-gray-600">
                  Enter your email and password to access your account
                </p>
              </div>
              <SignInForm />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}