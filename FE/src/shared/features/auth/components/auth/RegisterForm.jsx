import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../api/authService";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";
import AuthInput from "./AuthInput";
import styles from "./RegisterForm.module.css";
import { ROUTES } from "@/config/route.config.js";
import { notify } from '../../../../utils/Notify.js';
import { useLanguage } from "@/shared/context/LanguageContext";

export default function RegisterForm() {
  const { t } = useLanguage();
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
      notify.success(t('auth.registerSuccess'));
      navigate(ROUTES.HOME);
    } catch (err) {
      notify.error(t('common.error'));
      console.log(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('auth.register')}</h2>
        <div className={styles.subtitle}>
          {t('auth.alreadyHaveAccount')}{" "}
          <Link to={ROUTES.LOGIN} className={styles.link}>
            {t('auth.login')}
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <AuthInput
          label={t('auth.fullName')}
          type="text"
          placeholder="John Doe"
          value={form.fullName}
          onChange={handleChange}
          name="fullName"
        />

        <AuthInput
          label={t('auth.email')}
          type="email"
          placeholder="email@example.com"
          value={form.email}
          onChange={handleChange}
          name="email"
        />

        <AuthInput
          label={t('auth.password')}
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          name="password"
        />

        <div className={styles.submitArea}>
          <Button disabled={loading} type="submit">
            <span>{loading ? t('common.loading') : `${t('auth.register')} →`}</span>
          </Button>
        </div>
        <Link to={ROUTES.HOME} className={styles.backToHomeLink}>{t('common.back')}</Link>
      </form>
    </div>
  );
}
