import { useContext } from "react"
import { ErrorContext } from "@/shared/context/ErrorContext"
import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import { AlertOctagon, ArrowLeft, Home, RefreshCcw } from "lucide-react";

const ErrorPage = () => {
    const { error, clearError } = useContext(ErrorContext);
    const navigate = useNavigate();

    if (!error) return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapperSuccess}>
                    <Home size={48} />
                </div>
                <h1 className={styles.title}>No error found</h1>
                <p className={styles.message}>The system is operating normally.</p>
                <button
                    className={styles.primaryBtn}
                    onClick={() => navigate("/")}
                >
                    <ArrowLeft size={18} />
                    Go to Home
                </button>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <AlertOctagon size={56} strokeWidth={1.5} />
                </div>

                <h1 className={styles.title}>System Error Occurred</h1>
                <p className={styles.subtitle}>
                    We apologize for the inconvenience. A problem occurred while processing your request. Details below:
                </p>

                <div className={styles.errorDetails}>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Error Type:</span>
                        <span className={styles.detailValue}>{error.type || "Unknown Error"}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Status Code:</span>
                        <span className={styles.badge}>{error.status || "N/A"}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Path:</span>
                        <span className={styles.detailPath}>{error.path || "N/A"}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Time:</span>
                        <span className={styles.detailValue}>
                            {error.time ? new Date(error.time).toLocaleString('en-US') : "N/A"}
                        </span>
                    </div>
                    
                    <div className={styles.messageBox}>
                        <strong>Error Message:</strong>
                        <p>{error.message || "No detailed message available."}</p>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        className={styles.secondaryBtn}
                        onClick={() => {
                            clearError();
                            navigate(-1);
                        }}
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                    <button
                        className={styles.primaryBtn}
                        onClick={() => {
                            clearError();
                            navigate("/");
                        }}
                    >
                        <Home size={18} />
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    )
};

export default ErrorPage;