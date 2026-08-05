import authService from "./authService";

const authServices = {

    //=========================================
    // Authentication
    //=========================================

    login: async (credentials) => {

        return await authService.login(credentials);

    },

    register: async (user) => {

        return await authService.register(user);

    },

    logout: async () => {

        return await authService.logout();

    },

    //=========================================
    // Password
    //=========================================

    forgotPassword: async (email) => {

        return await authService.forgotPassword(email);

    },

    resetPassword: async (model) => {

        return await authService.resetPassword(model);

    },

    changePassword: async (model) => {

        return await authService.changePassword(model);

    },

    //=========================================
    // User
    //=========================================

    getCurrentUser: async () => {

        return await authService.getCurrentUser();

    },

    updateProfile: async (model) => {

        return await authService.updateProfile(model);

    },

    //=========================================
    // Token
    //=========================================

    refreshToken: async (refreshToken) => {

        return await authService.refreshToken(refreshToken);

    },

    //=========================================
    // Storage Helpers
    //=========================================

    getToken: () => {

        return authService.getToken();

    },

    getUser: () => {

        return authService.getUser();

    },

    isAuthenticated: () => {

        return authService.isAuthenticated();

    },

    clearStorage: () => {

        authService.clearStorage();

    }

};

export default authServices;