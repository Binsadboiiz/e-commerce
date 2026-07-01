import { createContext, useState } from "react";

export const ErrorContext = createContext();

export const ErrorProvider = ({children}) => {
    const [error, setError] = useState(null);

    const setGlobalError = (err) => {
        setError(err);
    };

    const clearError = () => {
        setError(null);
    }

    return (
        <ErrorContext.Provider value={{error, setGlobalError, clearError}}>
            {children}
        </ErrorContext.Provider>
    )
};