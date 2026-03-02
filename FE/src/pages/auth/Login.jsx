import { useContext, useState } from "react"
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getProfileApi, loginApi } from "../../services/authService";
import { ErrorContext } from "../../context/ErrorContext";

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const { setUser } = useAuth();
    const { setGlobalError } = useContext(ErrorContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await loginApi(form);
            const res = await getProfileApi();
            setUser(res.data);

            if(res.data.role == "Admin") {
                navigate("/admin");
            } else if (res.data.role == "retailer") {
                navigate("/retailer");
            } else {
                navigate("/");
            }
        } catch (error) {
            setGlobalError(error);
            navigate("/error");
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <p className="error">{error}</p>}
                <h2>Login</h2>
                <input type="email" name="email" placeholder="Email.." value={form.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password..." value={form.password} onChange={handleChange} required />

                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;