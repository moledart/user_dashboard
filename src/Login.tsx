import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "./Form";

const Login = () => {
  const content = {
    title: "Welcome back!",
    buttonText: "Sign In",
    question: "Don't have an account yet? ",
    linkText: "Sign Up",
    route: "/register",
  };

  return <Form {...content} />;
};

export default Login;
