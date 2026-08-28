import {
    React,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    useCallback
} from "react";

// =========================================================
// Context
// =========================================================

const AuthContext = createContext(null);

const SERVER_URL = "http://localhost:5000";

// =========================================================
// Hook
// =========================================================

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider."
        );
    }

    return context;
};

// =========================================================
// Provider
// =========================================================

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [loading, setLoading] = useState(true);

    const [isAuthenticated, setIsAuthenticated] = useState(false);


    // =====================================================
    // Clear Storage
    // =====================================================

    const clearStorage = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

    };


    // =====================================================
    // Load Current User
    // =====================================================

    const loadCurrentUser = useCallback(async () => {
    const jwt = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!jwt) {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
    }

    try {
        setToken(jwt);

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);

            setUser(parsedUser);
            setIsAuthenticated(true);
        } else {
            // Token exists but no user information
            setUser(null);
            setIsAuthenticated(true);
        }

    } catch (error) {

        console.error(
            "Unable to load stored user.",
            error
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setToken(null);
        setIsAuthenticated(false);

    } finally {
        setLoading(false);
    }

}, []);


    // =====================================================
    // Initialize
    // =====================================================

    useEffect(() => {

        loadCurrentUser();

    }, [loadCurrentUser]);


    // =====================================================
    // Login
    // =====================================================

    const login = async (credentials) => {

        setLoading(true);

        try {

            const response = await fetch(
                `${SERVER_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(credentials)
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Login failed."
                );

            }

            const jwt =
                data.token ||
                data.accessToken;

            if (jwt) {

                localStorage.setItem(
                    "token",
                    jwt
                );

                setToken(jwt);

            }

            if (data.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                setUser(data.user);

            }

            setIsAuthenticated(true);

            return data;

        }
        catch (error) {

            console.error(
                "Login error:",
                error
            );

            setIsAuthenticated(false);

            throw error;

        }
        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // Register
    // =====================================================

    const register = async (model) => {

        const response = await fetch(
            `${SERVER_URL}/api/auth/register`,
            {
                method: "POST",

                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(model)
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data?.message ||
                "Registration failed."
            );

        }

        return data;

    };


    // =====================================================
    // Logout
    // =====================================================

    const logout = async () => {

        try {

            const jwt =
                localStorage.getItem("token");

            await fetch(
                `${SERVER_URL}/api/auth/logout`,
                {
                    method: "POST",

                    headers: {
                        Accept: "application/json",

                        Authorization:
                            `Bearer ${jwt}`
                    }
                }
            );

        }
        catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }
        finally {

            clearStorage();

            setUser(null);
            setToken(null);
            setIsAuthenticated(false);

        }

    };


    // =====================================================
    // Refresh User
    // =====================================================

    const refreshUser = async () => {

        try {

            const jwt =
                localStorage.getItem("token");

            if (!jwt) {
                return;
            }

            const response = await fetch(
                `${SERVER_URL}/api/auth/current-user`,
                {
                    method: "GET",

                    headers: {
                        Accept: "application/json",

                        Authorization:
                            `Bearer ${jwt}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to refresh user."
                );
            }

            const currentUser =
                await response.json();

            setUser(currentUser);

            localStorage.setItem(
                "user",
                JSON.stringify(currentUser)
            );

        }
        catch (error) {

            console.error(
                "Unable to refresh user.",
                error
            );

        }

    };


    // =====================================================
    // Update User
    // =====================================================

    const updateUser = (updatedUser) => {

        setUser(updatedUser);

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

    };


    // =====================================================
    // Has Role
    // =====================================================

    const hasRole = (...roles) => {

        if (!user) {
            return false;
        }

        return roles.includes(user.role);

    };


    // =====================================================
    // Has Permission
    // =====================================================

    const hasPermission = (permission) => {

        if (!user) {
            return false;
        }

        if (!user.permissions) {
            return false;
        }

        return user.permissions.includes(
            permission
        );

    };


    // =====================================================
    // Context Value
    // =====================================================

    const value = useMemo(
        () => ({

            user,

            token,

            loading,

            isAuthenticated,

            login,

            logout,

            register,

            refreshUser,

            updateUser,

            hasRole,

            hasPermission,

            setUser,

            setLoading

        }),
        [
            user,
            token,
            loading,
            isAuthenticated
        ]
    );


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthContext;