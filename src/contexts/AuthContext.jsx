import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    useCallback
} from "react";

import authService from "../services/AuthManagement/authService";

//=========================================================
// Context
//=========================================================

const AuthContext = createContext(null);

//=========================================================
// Hook
//=========================================================

export const useAuth = () => {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(

            "useAuth must be used inside AuthProvider."

        );

    }

    return context;

};

//=========================================================
// Provider
//=========================================================

export const AuthProvider = ({

    children

}) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(

        localStorage.getItem("token")

    );

    const [loading, setLoading] = useState(true);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    //=====================================================
    // Load User
    //=====================================================

    const loadCurrentUser = useCallback(async () => {

        const jwt = localStorage.getItem("token");

        if (!jwt) {

            setUser(null);

            setToken(null);

            setIsAuthenticated(false);

            setLoading(false);

            return;

        }

        try {

            const currentUser = await authService.getCurrentUser();

            setUser(currentUser);

            setToken(jwt);

            setIsAuthenticated(true);

        }
        catch (error) {

            console.error(

                "Unable to load current user.",

                error

            );

            authService.clearStorage();

            setUser(null);

            setToken(null);

            setIsAuthenticated(false);

        }
        finally {

            setLoading(false);

        }

    }, []);

    //=====================================================
    // Initialize
    //=====================================================

    useEffect(() => {

        loadCurrentUser();

    }, [loadCurrentUser]);

    //=====================================================
    // Login
    //=====================================================

    const login = async (credentials) => {

        setLoading(true);

        try {

            const response = await authService.login(credentials);

            const jwt =

                response.token ||

                response.accessToken ||

                localStorage.getItem("token");

            setToken(jwt);

            if (response.user) {

                setUser(response.user);

            }
            else {

                const currentUser = await authService.getCurrentUser();

                setUser(currentUser);

            }

            setIsAuthenticated(true);

            return response;

        }
        finally {

            setLoading(false);

        }

    };

    //=====================================================
    // Register
    //=====================================================

    const register = async (model) => {

        return await authService.register(model);

    };

    //=====================================================
    // Logout
    //=====================================================

    const logout = async () => {

        try {

            await authService.logout();

        }
        catch (error) {

            console.error(error);

        }
        finally {

            authService.clearStorage();

            setUser(null);

            setToken(null);

            setIsAuthenticated(false);

        }

    };

    //=====================================================
    // Refresh User
    //=====================================================

    const refreshUser = async () => {

        try {

            const currentUser = await authService.getCurrentUser();

            setUser(currentUser);

        }
        catch (error) {

            console.error(error);

        }

    };

    //=====================================================
    // Update User
    //=====================================================

    const updateUser = (updatedUser) => {

        setUser(updatedUser);

        localStorage.setItem(

            "user",

            JSON.stringify(updatedUser)

        );

    };

    //=====================================================
    // Has Role
    //=====================================================

    const hasRole = (...roles) => {

        if (!user) return false;

        return roles.includes(user.role);

    };

    //=====================================================
    // Has Permission
    //=====================================================

    const hasPermission = (permission) => {

        if (!user) return false;

        if (!user.permissions) return false;

        return user.permissions.includes(permission);

    };

    //=====================================================
    // Context Value
    //=====================================================

    const value = useMemo(() => ({

        //-------------------------------------------------

        user,

        token,

        loading,

        isAuthenticated,

        //-------------------------------------------------

        login,

        logout,

        register,

        refreshUser,

        updateUser,

        //-------------------------------------------------

        hasRole,

        hasPermission,

        //-------------------------------------------------

        setUser,

        setLoading

    }), [

        user,

        token,

        loading,

        isAuthenticated

    ]);

    return (

        <AuthContext.Provider

            value={value}

        >

            {children}

        </AuthContext.Provider>

    );

};

export default AuthContext;