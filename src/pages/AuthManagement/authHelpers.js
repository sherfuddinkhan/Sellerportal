//=====================================================
// Storage Keys
//=====================================================

export const TOKEN_KEY = "token";

export const REFRESH_TOKEN_KEY = "refreshToken";

export const USER_KEY = "user";

//=====================================================
// Token
//=====================================================

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
    if (!token) return;
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

//=====================================================
// Refresh Token
//=====================================================

export const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (refreshToken) => {
    if (!refreshToken) return;
    localStorage.setItem(
        REFRESH_TOKEN_KEY,
        refreshToken
    );
};

export const removeRefreshToken = () => {
    localStorage.removeItem(
        REFRESH_TOKEN_KEY
    );
};

//=====================================================
// User
//=====================================================

export const getUser = () => {
    const user = localStorage.getItem(USER_KEY);
    if (!user) {
        return null;
    }
    try {
        return JSON.parse(user);
    }
    catch {
        return null;
    }
};

export const setUser = (user) => {
    if (!user) return;
    localStorage.setItem(USER_KEY,JSON.stringify(user)
    );
};

export const removeUser = () => {
    localStorage.removeItem(USER_KEY);
};

//=====================================================
// Authentication
//=====================================================

export const isAuthenticated = () => {
    return !!getToken();
};

//=====================================================
// User Role
//=====================================================

export const getUserRole = () => {
    const user = getUser();
    return user?.role || null;
};

export const hasRole = (...roles) => {
    const role = getUserRole();
    if (!role) return false;
    return roles.includes(role);
};

//=====================================================
// Permissions
//=====================================================

export const hasPermission = (permission) => {
    const user = getUser();
    if (!user?.permissions) {
        return false;
    }
    return user.permissions.includes(permission);
};

//=====================================================
// JWT Expiration
//=====================================================

export const isTokenExpired = (token = getToken()) => {
    if (!token) {
        return true;
    }
    try {
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        const exp = payload.exp * 1000;
        return Date.now() >= exp;
    }

    catch {
        return true;
    }
};

//=====================================================
// JWT Payload
//=====================================================

export const getTokenPayload = (
    token = getToken()
) => {
    if (!token) {
        return null;
    }
    try {
        return JSON.parse(
            atob(token.split(".")[1])
        );
    }
    catch {
        return null;
    }
};

//=====================================================
// Save Login
//=====================================================

export const saveLogin = ({
    token,
    refreshToken,
    user
}) => {
    setToken(token);
    setRefreshToken(refreshToken);
    setUser(user);
};

//=====================================================
// Logout
//=====================================================

export const clearAuth = () => {
    removeToken();
    removeRefreshToken();
    removeUser();
    sessionStorage.clear();
};

//=====================================================
// Authorization Header
//=====================================================

export const getAuthorizationHeader = () => {
    const token = getToken();
    return token
        ? {
            Authorization: `Bearer ${token}`
        }
        : {};
};

//=====================================================
// Current User
//=====================================================

export const getCurrentUserName = () => {
    const user = getUser();
    if (!user) {
        return "";
    }
    return (
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username ||
        ""
    );
};

//=====================================================
// Email
//=====================================================

export const getCurrentUserEmail = () => {
    return getUser()?.email || "";
};

//=====================================================
// User Id
//=====================================================

export const getCurrentUserId = () => {
    const user = getUser();
    return user?.id || user?.userId || null;
};

//=====================================================
// Default Export
//=====================================================

const authHelpers = {
    getToken,
    setToken,
    removeToken,
    getRefreshToken,
    setRefreshToken,
    removeRefreshToken,
    getUser,
    setUser,
    removeUser,
    isAuthenticated,
    hasRole,
    hasPermission,
    isTokenExpired,
    getTokenPayload,
    saveLogin,
    clearAuth,
    getAuthorizationHeader,
    getCurrentUserId,
    getCurrentUserName,
    getCurrentUserEmail
};

export default authHelpers;