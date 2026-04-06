import { useContext, useState } from "react"
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getProfileApi, loginApi } from "../../services/authService";
import { ErrorContext } from "../../context/ErrorContext";
import "./auth.css";

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
                {error && <p>{setGlobalError(error)}</p>}
                <div className="auth-page">
                <div className="auth-card">
                    <h2 className="auth-title">Login</h2>

                    <div className="auth-group">
                    <label className="auth-label">Email</label>
                    <input type="email" name="email" className="auth-input" placeholder="Enter email..." onChange={handleChange} />
                    </div>

                    <div className="auth-group">
                    <label className="auth-label">Password</label>
                    <input type="password" name="password" className="auth-input" placeholder="Enter password..." onChange={handleChange} />
                    </div>

                    <button className="auth-btn">Sign In</button>

                    <div className="auth-footer">
                    Don't have account? <span className="auth-link">Register</span>
                    </div>
                </div>
                </div>
            </form>
        </div>
    )
}

export default Login;