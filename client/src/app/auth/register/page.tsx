"use client";
import { LoginSvg } from "@/components/Icons/LoginSvg";

import useThemeStore from "@/store/themeStore";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/Loaders";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useFetch from "@/hooks/useFetch";
import { AuthService } from "@/services/AuthService";
import { setCookie } from "cookies-next";
import useAuthStore from "@/store/authStore";
import useProfileStore from "@/store/profileStore";
import { ProfileService } from "@/services/ProfileService";

export default function Register() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const router = useRouter();
  const setAuthToken = useAuthStore((state) => state.setAuthToken);
  const setProfile = useProfileStore((state) => state.setProfileDetails);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [
    {
      data: registerData,
      isLoading: isRegisterLoading,
      isError: isRegisterError,
    },
    getRegisterAPI,
  ] = useFetch(null);
  const [
    {
      data: userDetailsData,
      isLoading: isUserDetailsLoading,
      isError: isUserDetailsError,
    },
    getUserDetailsAPI,
  ] = useFetch(null);

  useEffect(() => {
    const { code, message } = registerData;

    if (code === 201) {
      const { data } = registerData;
      const token = data.token;

      setCookie("token", token);
      setAuthToken(token);

      getUserDetailsAPI(() => () => ProfileService.getUserProfile(token));
    } else {
      setErrorMessage(message);
    }
  }, [registerData, isRegisterError]);

  useEffect(() => {
    const { code } = userDetailsData;

    if (code === 200) {
      const { data } = userDetailsData;
      setProfile(data);

      router.push("/dashboard");
    }
  }, [userDetailsData, isUserDetailsError]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onHandleSubmit = () => {
    if (name === "") {
      setErrorMessage("Enter name");
    } else if (!validateEmail(email)) {
      setErrorMessage("Enter correct email");
    } else if (password === "") {
      setErrorMessage("Enter Password");
    } else {
      setErrorMessage("");
      getRegisterAPI(
        () => () =>
          AuthService.emailSignUp({ name: name, email, password: password })
      );
    }
  };

  return (
    <>
      <Navbar landingPage={false} />
      <div
        className={`flex w-screen  flex-wrap ${
          theme === "light"
            ? "text-slate-800 "
            : "border-t-2 border-gray-600 text-white bg-[#12141D]"
        }`}
      >
        <div className="relative hidden h- select-none bg-blue-600 bg-gradient-to-br md:block md:w-1/2">
          <div className="pt-9 py-4 px-8 text-white xl:w-[40rem]">
            <p className="mb-6 mt-1 text-3xl font-semibold leading-10">
              Never Forget Your Passwords Again!
              <span className="abg-white whitespace-nowrap py-2 text-cyan-300">
                {" "}
                Safe & Secure
              </span>
              .
            </p>
            <p className="mb-4">
              Tired of forgetting your passwords? Say goodbye to sticky notes
              and random paper scraps with CodeShield.
            </p>
          </div>
          <div className="">
            <LoginSvg />
          </div>
        </div>
        <div className="flex w-full h-auto flex-col md:w-1/2">
          <div className="my-3 mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
            <p className="text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl">
              Welcome to <br />
              <span className="text-blue-600">CodeShield.</span>
            </p>
            <p className="mt-6 text-center font-medium md:text-left">
              Create your account below.
            </p>
            <div className="flex flex-col items-stretch pt-3 md:pt-8">
              <div className="flex flex-col pt-4">
                <div className="relative flex overflow-hidden rounded-md border border-gray-500 transition focus-within:border-blue-600">
                  <input
                    type="text"
                    id="register-name"
                    className={`w-full flex-shrink appearance-none ${
                      theme === "light"
                        ? "bg-[white] text-gray-700 "
                        : "bg-[#12141D] text-white "
                    } border-gray-500 py-2 px-4 text-base  placeholder-gray-400 focus:outline-none`}
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col pt-4">
                <div className="relative flex overflow-hidden rounded-md border border-gray-500 transition focus-within:border-blue-600">
                  <input
                    type="email"
                    id="register-email"
                    className={`w-full flex-shrink appearance-none ${
                      theme === "light"
                        ? "bg-[white] text-gray-700 "
                        : "bg-[#12141D] text-white "
                    } border-gray-500 py-2 px-4 text-base  placeholder-gray-400 focus:outline-none`}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-col pt-4">
                <div className="relative flex overflow-hidden rounded-md border border-gray-500 transition focus-within:border-blue-600">
                  <input
                    type="password"
                    id="register-password"
                    className={`w-full flex-shrink appearance-none ${
                      theme === "light"
                        ? "bg-[white]  text-gray-700"
                        : "bg-[#12141D] text-white"
                    } border-gray-500 py-2 px-4 text-base  placeholder-gray-400 focus:outline-none`}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <a
                href="/auth/forgot-password"
               
                className="text-center text-sm font-medium text-gray-600 md:text-left"
              >
                Forgot password?
              </a>

              <div className="my-2 text-red-500 flex">{errorMessage}</div>

              <button
                onClick={onHandleSubmit}
                disabled={isRegisterLoading}
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-blue-500 ring-offset-2 transition hover:bg-blue-700 focus:ring-2 md:w-32"
              >
                Sign Up
              </button>
            </div>
            <div className="py-12 text-center">
              <p className="text-gray-600">
                Already have an account?
                <Link
                  href="/auth/login"
                  className={`whitespace-nowrap px-1 font-semibold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  } underline underline-offset-4`}
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
