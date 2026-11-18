export const getErrorHandle = (err) => {
    if(!err.response) {
        return {
            type: "NETWORK_ERROR",
            message: "Don't connect to server",
            path: window.location.pathname
        };
    }
    const { status, data } = err.response;
    
    return{
        type: "API_ERROR",
        status,
        message: data?.message || "Server Error",
        path: data?.path || window.location.pathname,
        time: new Date().toISOString()
    };
};