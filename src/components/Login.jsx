import { useState } from "react";
import { useAuth } from "./AuthProvider";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const auth = useAuth();
  const handleSubmitEvent = (e) => {
    e.preventDefault();
    if (input.email !== "" && input.password !== "") {
      auth.loginAction(input);
    }else {
        alert("Please provide a valid input");
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmitEvent}>
      <div className="form_control">
        <label htmlFor="user-email">Email:</label>
        <input
          type="text"
          id="user-email"
          name="email"
          placeholder="example@yahoo.com"
          aria-invalid="false"
          onChange={handleInput}
        />
        <div id="user-email" className="sr-only">
          Please enter a valid username. It must contain at least 6 characters.
        </div>
      </div>
      <div className="form_control">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          aria-describedby="user-password"
          aria-invalid="false"
          onChange={handleInput}
        />
        <div id="user-password" className="sr-only">
          your password should be more than 6 character
        </div>
      </div>
      <button className="btn-submit">Submit</button>
    </form>
  );
};

export default Login;