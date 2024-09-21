"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import LoginSvg from "@/assets/Login.svg";
import useThemeStore from "@/store/themeStore";
import Image from "next/image";
import useFetch from "@/hooks/useFetch";
import { AuthService } from "@/services/AuthService";
import { setCookie } from "cookies-next";
import useAuthStore from "@/store/authStore";
import useProfileStore from "@/store/profileStore";
import { useRouter } from "next/navigation";
import { ProfileService } from "@/services/ProfileService";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const Login = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const router = useRouter();
  const setAuthToken = useAuthStore((state) => state.setAuthToken);
  const setProfile = useProfileStore((state) => state.setProfileDetails);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [
    { data: loginData, isLoading: isLoginLoading, isError: isLoginError },
    getLoginAPI,
  ] = useFetch(null);
  const [
    {
      data: userDetailsData,
      isLoading: isUserDetailsLoading,
      isError: isUserDetailsError,
    },
    getUserDetailsAPI,
  ] = useFetch(null);

  // Handle login response
  useEffect(() => {
    console.log("Login Data:", loginData); // Inspect API response
    if (loginData && loginData.code === 200) {
      const { data } = loginData;
      const token = data?.token; // Optional chaining to avoid errors

      if (token) {
        setCookie("token", token);
        setAuthToken(token);

        getUserDetailsAPI(() => () => ProfileService.getUserProfile(token));
      } else {
        setErrorMessage("Login successful but token missing");
      }
    } else if (loginData && loginData.message) {
      setErrorMessage(loginData.message); // Show API error message
    } else if (isLoginError) {
      setErrorMessage("Failed to login, please try again.");
    }
  }, [loginData, isLoginError]);

  // Handle user profile data after login
// Handle user profile data after login
useEffect(() => {
  if (userDetailsData && userDetailsData.code === 200) {
    const { data } = userDetailsData;
    console.log("User profile fetched:", data); // Log profile data
    setProfile(data);

    console.log("Redirecting to /dashboard...");
    router.push("/dashboard"); // Redirect to dashboard after login
  } else if (isUserDetailsError) {
    setErrorMessage("Failed to fetch user profile.");
    console.log("Error fetching user profile", isUserDetailsError);
  }
}, [userDetailsData, isUserDetailsError]);


  // Handle form submission for login
  const onHandleSubmit = () => {
    if (email === "") {
      setErrorMessage("Enter Email");
    } else if (password === "") {
      setErrorMessage("Enter Password");
    } else {
      setErrorMessage("");
      getLoginAPI(() =>
        AuthService.emailLogin({ email: email, password: password })
      );
    }
  };

  return (
    <div data-testid="login">
      <Navbar landingPage={false} />
      <div
        className={`flex w-screen flex-wrap ${
          theme === "light"
            ? "text-slate-800"
            : "text-white border-t-2 border-gray-600 bg-[#12141D]"
        }`}
      >
        <div className="flex w-full h-auto flex-col md:w-1/2">
          <div className="my-3 mx-auto flex flex-col justify-center px-6 pt-8 md:justify-start lg:w-[28rem]">
            <p className="text-center text-3xl font-bold md:leading-tight md:text-left md:text-5xl">
              Welcome back <br />
              to <span className="text-blue-600">CodeShield.</span>
            </p>
            <p className="mt-6 text-center font-medium md:text-left">
              Sign in to your account below.
            </p>
            <div className="flex flex-col items-stretch pt-3 md:pt-8">
              <div className="flex flex-col pt-4">
                <div className="relative flex overflow-hidden rounded-md border border-gray-500 transition focus-within:border-blue-600">
                  <input
                    type="email"
                    id="login-email"
                    className={`w-full flex-shrink appearance-none ${
                      theme === "light"
                        ? "bg-[white] text-gray-700"
                        : "bg-[#12141D] text-white"
                    } border-gray-500 py-2 px-4 text-base placeholder-gray-400 focus:outline-none`}
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
                    id="login-password"
                    className={`w-full flex-shrink appearance-none ${
                      theme === "light"
                        ? "bg-[white]  text-gray-700"
                        : "bg-[#12141D] text-white"
                    } border-gray-500 py-2 px-4 text-base placeholder-gray-400 focus:outline-none`}
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

              <div className="my-2 text-red-500">{errorMessage}</div>

              <button
                disabled={isLoginLoading}
                onClick={onHandleSubmit}
                className="rounded-lg bg-blue-600 px-4 py-2 text-center text-base font-semibold text-white shadow-md outline-none ring-blue-500 ring-offset-2 transition hover:bg-blue-700 focus:ring-2 md:w-32"
              >
                {isLoginLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
            <div className="py-12 text-center">
              <p className="text-gray-600">
                Don&apos;t have an account?
                <Link
                  href="/auth/register"
                  className={`whitespace-nowrap px-1 font-semibold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  } underline underline-offset-4`}
                >
                  Sign up for free.
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="relative hidden px-10 select-none bg-blue-600 bg-gradient-to-br md:block md:w-1/2">
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
              Managing passwords can be tough, but with CodeShield, you don&apos;t
              have to worry about forgetting them anymore.
            </p>
          </div>
          <Image
            alt="login illustration"
            src={LoginSvg}
            className="ml-8 w-11/12 max-w-lg py-5 rounded-lg object-cover"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
