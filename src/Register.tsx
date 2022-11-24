import React from "react";
import Form from "./Form";

const Register = () => {
  const content = {
    title: "Create your account",
    buttonText: "Sign Up",
    question: "Already have an account? ",
    linkText: "Sign In",
    route: "/login",
  };
  return <Form {...content} />;
};

export default Register;
