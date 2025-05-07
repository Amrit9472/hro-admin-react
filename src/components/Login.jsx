import { useState } from "react";
import { useAuth } from "./AuthProvider";
import styles from "./css/LoginForm.module.css"
const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const auth = useAuth();
  const [error, setError] = useState(null);
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    if (input.email !== "" && input.password !== "") {
      try {
        await auth.loginAction(input);
      } catch (error) {
        setError(error?.message || "Login failed");
      }

    } else {
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

    <div className="d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleSubmitEvent} className="w-25">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label htmlFor="user-email" className="form-label">Emp ID</label>
          <input
            type="text"
            className="form-control"
            id="user-email"
            name="email"
            placeholder="12XXX"
            aria-invalid="false"
            onChange={handleInput}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            aria-describedby="user-password"
            aria-invalid="false"
            onChange={handleInput}
          />
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Login;