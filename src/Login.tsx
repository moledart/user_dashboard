import { useNavigate } from "react-router-dom";
import Form from "./Form";
import { baseUrl } from "../config";

const Login = () => {
  const navigate = useNavigate();
  const content = {
    title: "Welcome back!",
    buttonText: "Sign In",
    question: "Don't have an account yet? ",
    linkText: "Sign Up",
    route: "/register",
  };

  fetch(`${baseUrl}/loggedIn`, {
    credentials: "include",
  }).then((res) => {
    if (res.status === 201) navigate("/");
  });

  return <Form {...content} />;
};

export default Login;
