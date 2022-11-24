import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface Input {
  username: string;
  email: string;
  password: string;
}

interface ErrorType {
  field: "password" | "email";
  message: string;
}

function Form(props: { [key: string]: string }) {
  const [error, setError] = useState<ErrorType>();

  let route = useLocation().pathname;
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<Input>();

  const onSignUp: SubmitHandler<Input> = (data) => {
    fetch("https://express-backend-ivory.vercel.app/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    }).then((res) => {
      if (res.status === 409)
        setError({ field: "email", message: "User already exists" });
      if (res.status === 201) navigate("/login");
    });
  };

  const onLogin: SubmitHandler<Input> = (data) => {
    fetch("https://express-backend-ivory.vercel.app/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.email, password: data.password }),
      credentials: "include",
    }).then((res) => {
      if (res.status === 201) navigate("/");

      if (res.status === 401)
        setError({ field: "password", message: "Wrong password" });
      if (res.status === 403)
        setError({ field: "email", message: "Sorry, you have been banned" });
      if (res.status === 404)
        setError({ field: "email", message: "User doesn't exist" });
    });
  };

  return (
    <div className="container mx-auto max-w-sm min-h-screen flex items-center">
      <div className="flex flex-col my-auto w-full">
        <h1 className="text-4xl font-semibold mb-2">{props.title}</h1>
        <p className="text-zinc-500 text-sm">Please enter your credentials</p>
        <form
          className="flex flex-col my-8"
          onSubmit={
            route === "/register"
              ? handleSubmit(onSignUp)
              : handleSubmit(onLogin)
          }
        >
          <div className="flex flex-col mb-4">
            {route === "/register" && (
              <div className="flex flex-col mb-4">
                <label className="text-sm mb-1">Username</label>
                <input
                  type="text"
                  className="border border-zinc-200 rounded p-3"
                  {...register("username", { required: true })}
                />
              </div>
            )}
            <label className="text-sm mb-1">Email</label>
            <input
              type="email"
              className="border border-zinc-200 rounded p-3"
              {...register("email", { required: true })}
            />
            {error?.field === "email" && (
              <p className="text-red-600 text-sm ml-2 mt-2">{error.message}</p>
            )}
          </div>
          <div className="flex flex-col mb-10">
            <label className="text-sm mb-1">Password</label>
            <input
              type="password"
              className="border border-zinc-200 rounded p-3"
              {...register("password", { required: true })}
            />
            {error?.field === "password" && (
              <p className="text-red-600 text-sm ml-2 mt-2">{error.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-zinc-800 text-zinc-100 p-4 rounded hover:bg-zinc-900"
          >
            {props.buttonText}
          </button>
        </form>

        <p className="text-zinc-500 text-sm text-center">
          {props.question}
          <Link
            to={props.route}
            className="underline underline-offset-4 decoration-solid text-zinc-900 cursor-pointer"
          >
            {props.linkText}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Form;
