import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthInput from "./AuthInput";
import Button from "../common/Button";
import { loginApi } from "../../api/authService";
import { useAuth } from "../../hooks/useAuth";
import styles from "./LoginForm.module.css";
import { notify } from '../../../../utils/Notify.js';
import { ROUTES } from "@/config/route.config.js";
import { ROLES } from "@/shared/constants/roles";
import { useLanguage } from "@/shared/context/LanguageContext";

export default function LoginForm() {
  const { t } = useLanguage();
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
      setUser(res.data);
      notify.success(t('auth.loginSuccess'));
      
      const role = res.data?.role;
      if (role === ROLES.SELLER || role?.toLowerCase() === "seller") {
        navigate(ROUTES.SELLER_DASHBOARD);
      } 
      else if (role === ROLES.ADMIN || role?.toLowerCase() === "admin") {
        navigate(ROUTES.ADMIN_DASHBOARD);
      }
      else {
        navigate(ROUTES.HOME);
      }
    } catch (err) {
      notify.error(t('common.error'));
      console.log(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('auth.login')}</h2>
        <div className={styles.subtitle}>
          {t('auth.dontHaveAccount')}{" "}
          <Link to={ROUTES.REGISTER} className={styles.link}>
            {t('auth.register')}
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
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
            <span>{loading ? t('common.loading') : `${t('auth.login')} →`}</span>
          </Button>
        </div>
        <Link to={ROUTES.HOME} className={styles.backToHomeLink}>{t('common.back')}</Link>
      </form>
    </div>
  );
}
