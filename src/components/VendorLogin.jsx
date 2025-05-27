import { useState } from "react";
import { useAuth } from "./AuthProvider";
import './css/VendorLogin.css';

const VendorLogin = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const auth = useAuth();
  const [error, setError] = useState(null);
  const [showPassword ,setShowPassword] = useState(false);

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setError(null);

    if (input.email.trim() !== "" && input.password.trim() !== "") {
      try {
        await auth.loginVendor(input);  // <-- Use loginVendor here
      } catch (err) {
        setError(err?.message || "Login failed");
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
    // <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="login-page-wrapper">
      <div className="login-page">
        <div className="login-container">
    <h2>Login</h2>
      <form onSubmit={handleSubmitEvent}>
        {/* <div className="mb-3"> */}
          {error && <div className="alert alert-danger">{error}</div>}
        {/* </div> */}
        {/* <div className="mb-3"> */}
          <label htmlFor="user-email">
            Vendor Email
          </label>
          <input
            type="email"
            className="form-control"
            id="user-email"
            name="email"
            placeholder="vendor@example.com"
            aria-invalid={error ? "true" : "false"}
            value={input.email}
            onChange={handleInput}
            required
          />
        {/* </div> */}

        {/* <div className="mb-3"> */}
          <label htmlFor="password" >
            Password
          </label>
          <input
            // type="password"
            type={showPassword ? "text" : "password"}
            className="form-control"
            id="password"
            name="password"
            aria-invalid={error ? "true" : "false"}
            value={input.password}
            onChange={handleInput}
            required
          />
          <label>
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
            />
            Show Password
          </label>

        {/* </div> */}
        <div className="d-flex justify-content-center align-items-center">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
    </div>
    </div>
    </div>

  );
};

export default VendorLogin;
