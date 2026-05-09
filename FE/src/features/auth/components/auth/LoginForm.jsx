import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthInput from "./AuthInput";
import Button from "../common/Button";
import { loginApi } from "../../api/authService";
import { useAuth } from "../../hooks/useAuth";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginApi(form);
      setUser(res);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Login</h2>
        <div className={styles.subtitle}>
          New here?{" "}
          <Link to="/register" className={styles.link}>
            Create an account
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <AuthInput
          label="Identity / Email"
          type="email"
          placeholder="ENTER YOUR EMAIL"
          value={form.email}
          onChange={handleChange}
          name="email"
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          name="password"
        />

        <div className={styles.submitArea}>
          <Button disabled={loading} type="submit">
            <span>{loading ? "Verifying..." : "Sign In →"}</span>
          </Button>
        </div>
        <Link to="/" className={styles.backToHomeLink}>Back to Home</Link>
      </form>
    </div>
  );
}