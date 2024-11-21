'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { toast } from "react-hot-toast"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { singIn } from "@/lib/firebase"

const formSchema = z.object({
  email: z
    .string()
    .email("Email format is not valid. Example: user@mail.com")
    .min(1, { message: "This field is required" }),
  password: z.string().min(6, {
    message: "The password must contain at least 6 characters",
  }),
})

type FormData = z.infer<typeof formSchema>

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const res = await singIn(data)
      console.log(res)
      toast.success("Signed in successfully!")
      router.push("/forgot-password") // Redirect to dashboard after successful sign-in
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, { duration: 2500 })
      } else {
        toast.error("An unknown error occurred.", { duration: 2500 })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <Input
          {...register("email")}
          id="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1"
          placeholder="name@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <Input
          {...register("password")}
          id="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-sm text-gray-900"
          >
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <Link
            href="/forgot-password"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
      >
        {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
        Sign in
      </Button>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  )
}

export default SignInForm