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
import { Button, Form, Container, Row, Col, Spinner, Alert } from "react-bootstrap";

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
    if (loginData) {
      if (loginData.code === 200) {
        const token = loginData.data?.token;
        if (token) {
          setCookie("token", token);
          setAuthToken(token);
          getUserDetailsAPI(() => ProfileService.getUserProfile(token));
        } else {
          setErrorMessage("Login successful but token is missing.");
        }
      } else {
        switch (loginData.message) {
          case "auth/wrong-password":
            setErrorMessage("Incorrect password. Please try again.");
            break;
          case "auth/user-not-found":
            setErrorMessage("No account found with this email.");
            break;
          case "auth/invalid-email":
            setErrorMessage("Please enter a valid email address.");
            break;
          default:
            setErrorMessage(
              loginData.message || "Login failed. Please try again."
            );
        }
      }
    }
  }, [loginData]);

  // Handle user profile data after login
  useEffect(() => {
    if (userDetailsData) {
      if (userDetailsData.code === 200) {
        setProfile(userDetailsData.data);
        router.push("/dashboard");
      } else if (isUserDetailsError) {
        setErrorMessage("Failed to fetch user profile.");
      }
    }
  }, [userDetailsData, isUserDetailsError]);

  // Handle form submission for login
  const onHandleSubmit = () => {
    if (!email) {
      setErrorMessage("Enter Email");
    } else if (!password) {
      setErrorMessage("Enter Password");
    } else {
      setErrorMessage("");
      getLoginAPI(() => AuthService.emailLogin({ email, password }));
    }
  };

  return (
    <div data-testid="login">
      <Navbar landingPage={false} />
      <Container className="d-flex flex-wrap w-100" fluid>
        <Row className={`w-100 ${theme === "light" ? "text-dark" : "text-light bg-dark"}`}>
          <Col md={6} className="d-flex flex-column justify-content-center">
            <h2 className="text-center text-3xl font-bold">
              Welcome back to <span className="text-primary">CodeShield.</span>
            </h2>
            <p className="text-center">Sign in to your account below.</p>

            <Form className="w-100 px-4">
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={theme === "light" ? "" : "bg-dark text-light"}
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={theme === "light" ? "" : "bg-dark text-light"}
                />
              </Form.Group>

              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

              <Button
                onClick={onHandleSubmit}
                disabled={isLoginLoading}
                className="w-100"
                variant="primary"
              >
                {isLoginLoading ? (
                  <Spinner animation="border" role="status" size="sm" className="mr-2">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  "Sign in"
                )}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <Link href="/auth/forgot-password">Forgot password?</Link>
            </div>

            <div className="text-center mt-4">
              <p>
                Don't have an account?{" "}
                <Link href="/auth/register" className="font-bold text-primary">
                  Sign up for free.
                </Link>
              </p>
            </div>
          </Col>

          <Col md={6} className="d-none d-md-block bg-primary text-white p-5">
            <h3>Never Forget Your Passwords Again! Safe & Secure.</h3>
            <p>
              Managing passwords can be tough, but with CodeShield, you don't have to worry about forgetting them anymore.
            </p>
            <Image
              alt="login illustration"
              src={LoginSvg}
              className="w-75 h-auto mt-3 rounded-lg object-cover"
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Login;
