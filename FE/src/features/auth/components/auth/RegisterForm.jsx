import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthInput from "./AuthInput";
import Button from "../common/Button";
import { useAuth } from "../../hooks/useAuth";
import { registerApi } from "../../api/authService";
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await registerApi(form);
      setUser(res.data);
      navigate("/");
    } catch (err) {
      console.log(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Register</h2>
        <div className={styles.subtitle}>
          Already a member?{" "}
          <Link to="/login" className={styles.link}>
            Login here
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <AuthInput
          label="Full Name"
          type="text"
          placeholder="YOUR FULL NAME"
          value={form.fullName}
          onChange={handleChange}
          name="fullName"
        />

        <AuthInput
          label="Email Address"
          type="email"
          placeholder="EMAIL@EXAMPLE.COM"
          value={form.email}
          onChange={handleChange}
          name="email"
        />

        <AuthInput
          label="Create Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          name="password"
        />

        <div className={styles.submitArea}>
          <Button disabled={loading} type="submit">
            <span>{loading ? "Processing..." : "Create Account →"}</span>
          </Button>
        </div>
        <Link to="/" className={styles.backToHomeLink}>Back to Home</Link>
      </form>
    </div>
  );
}