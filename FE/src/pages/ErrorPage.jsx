import { useContext } from "react"
import { ErrorContext } from "../context/ErrorContext"
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const { error, clearError } = useContext(ErrorContext);
    const navigate = useNavigate();

    if(!error) return <div>No error found</div>;

    return (
    <div style={{ padding: 40 }}>
      <h1>Something went wrong</h1>

      <p><strong>Type:</strong> {error.type}</p>
      <p><strong>Status:</strong> {error.status}</p>
      <p><strong>Message:</strong> {error.message}</p>
      <p><strong>Path:</strong> {error.path}</p>
      <p><strong>Time:</strong> {error.time}</p>

      <button
        onClick={() => {
          clearError();
          navigate("/");
        }}
      >
        Back to Home
      </button>
    </div>
    )
};

export default ErrorPage;