import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../../services/authService";
import { ErrorContext } from "../../context/ErrorContext";

const Register = () => {
    const [form, setForm] = useState(
        {
            email: "",
            password: "",
            confirmPassword: "",
            fullName: "",
            phone: "",
            avatar: ""
        }
    );
    const navigate = useNavigate();
    const { setGlobalError } = useContext(ErrorContext);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(form.password !== form.confirmPassword) {
            alert("Password must be match Password");
        }

        try {
            await registerApi(form);
            navigate("/login");
        } catch (error) {
            setGlobalError(error);
            navigate("/error");
        }
    };

    return(
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Register</h2>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
                <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
                <input type="file" name="avatar" placeholder="Avatar" onChange={handleChange}/>

                <button type="submit">Register</button>
            </form>
        </div>
    )
};

export default Register;