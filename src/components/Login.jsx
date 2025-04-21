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


    <div className={styles.container}>
      <form onSubmit={handleSubmitEvent}>
        <div className="error-message">
          {error && <div>{error}</div>}
        </div>
        <div className={styles.form_control}>
          <label htmlFor="user-email">Email:</label>
          <input
            type="text"
            id="user-email"
            name="email"
            placeholder="example@yahoo.com"
            aria-invalid="false"
            onChange={handleInput}
          />
        </div>
        <div className={styles.form_control}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            aria-describedby="user-password"
            aria-invalid="false"
            onChange={handleInput}
          />
        </div>
        <button className="btn-submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;