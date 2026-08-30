// =========================================================
// server.js
// Marketplace Seller Portal
// Node.js / Express API Proxy
// =========================================================

import express from "express";
import cors from "cors";
import axios from "axios";
import https from "https";

// =========================================================
// APP
// =========================================================

const app = express();

// =========================================================
// CONFIGURATION
// =========================================================

const PORT = 5000;

const DOTNET_API = "https://localhost:7203/api";

// =========================================================
// HTTPS AGENT
// Development only
// Allows self-signed ASP.NET HTTPS certificate
// =========================================================

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000"
        ],

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Accept",
            "Authorization"
        ]
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// =========================================================
// REQUEST LOGGER
// =========================================================

app.use((req, res, next) => {

    console.log(
        "================================================"
    );

    console.log(
        `${req.method} ${req.originalUrl}`
    );

    if (
        req.body &&
        typeof req.body === "object" &&
        Object.keys(req.body).length > 0
    ) {

        console.log(
            "BODY:",
            req.body
        );
    }

    if (
        req.query &&
        Object.keys(req.query).length > 0
    ) {

        console.log(
            "QUERY:",
            req.query
        );
    }

    console.log(
        "================================================"
    );

    next();
});

// =========================================================
// AXIOS ERROR HANDLER
// =========================================================

const handleAxiosError = (
    res,
    error,
    operation = "API REQUEST"
) => {

    console.error(
        "================================================"
    );

    console.error(
        `${operation} ERROR`
    );

    console.error(
        "MESSAGE:",
        error.message
    );

    // -----------------------------------------------------
    // ASP.NET returned HTTP error
    // -----------------------------------------------------

    if (error.response) {

        console.error(
            "STATUS:",
            error.response.status
        );

        console.error(
            "DATA:",
            error.response.data
        );

        return res
            .status(error.response.status)
            .json(
                error.response.data || {
                    success: false,
                    message:
                        `${operation} failed.`
                }
            );
    }

    // -----------------------------------------------------
    // Request sent but no response
    // -----------------------------------------------------

    if (error.request) {

        console.error(
            "NO RESPONSE FROM ASP.NET API"
        );

        return res.status(502).json({

            success: false,

            message:
                "Unable to connect to ASP.NET API.",

            details:
                error.message
        });
    }

    // -----------------------------------------------------
    // Other error
    // -----------------------------------------------------

    return res.status(500).json({

        success: false,

        message:
            `${operation} failed.`,

        details:
            error.message
    });
};

// =========================================================
// HEALTH CHECK
// =========================================================

app.get(
    "/",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Marketplace Seller Portal Node Server is running.",

            nodeUrl:
                `http://localhost:${PORT}`,

            dotnetApi:
                DOTNET_API
        });
    }
);

// =========================================================
// =========================================================
// AUTH MANAGEMENT
// =========================================================
// =========================================================

// =========================================================
// LOGIN
// =========================================================

app.post(
    "/api/AuthManagement/login",
    async (req, res) => {

        try {

            console.log(
                "AUTH LOGIN REQUEST"
            );

            const {
                userName,
                password
            } = req.body;

            if (!userName?.trim()) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Username is required."
                });
            }

            if (!password) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password is required."
                });
            }

            const payload = {

                userName:
                    userName.trim(),

                password
            };

            const response =
                await axios.post(

                    `${DOTNET_API}/AuthManagement/login`,

                    payload,

                    {
                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "AUTH LOGIN"
            );
        }
    }
);

// =========================================================
// REGISTER
// =========================================================

app.post(
    "/api/AuthManagement/register",
    async (req, res) => {

        try {

            console.log(
                "AUTH REGISTER REQUEST"
            );

            const {
                sellerId,
                fullName,
                userName,
                email,
                password,
                mobile,
                role
            } = req.body;

            if (!fullName?.trim()) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Full Name is required."
                });
            }

            if (!userName?.trim()) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Username is required."
                });
            }

            if (!email?.trim()) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email address is required."
                });
            }

            if (!mobile?.trim()) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Mobile number is required."
                });
            }

            if (!password) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Password is required."
                });
            }

            const payload = {

                sellerId:
                    Number(sellerId) || 0,

                fullName:
                    fullName.trim(),

                userName:
                    userName.trim(),

                email:
                    email.trim(),

                password,

                mobile:
                    mobile.trim(),

                role:
                    role || "Seller"
            };

            console.log(
                "REGISTER PAYLOAD:",
                {
                    ...payload,
                    password: "********"
                }
            );

            const response =
                await axios.post(

                    `${DOTNET_API}/AuthManagement/register`,

                    payload,

                    {
                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "AUTH REGISTER"
            );
        }
    }
);

// =========================================================
// FORGOT PASSWORD
// =========================================================

app.post(
    "/api/AuthManagement/forgot-password",
    async (req, res) => {

        try {

            const response =
                await axios.post(

                    `${DOTNET_API}/AuthManagement/forgot-password`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "FORGOT PASSWORD"
            );
        }
    }
);

// =========================================================
// RESET PASSWORD
// =========================================================

app.post(
    "/api/AuthManagement/reset-password",
    async (req, res) => {

        try {

            const response =
                await axios.post(

                    `${DOTNET_API}/AuthManagement/reset-password`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "RESET PASSWORD"
            );
        }
    }
);

// =========================================================
// =========================================================
// CATALOG
// =========================================================
// =========================================================

// =========================================================
// GET ALL CATALOG PRODUCTS
// =========================================================

app.get(
    "/api/catalog/products/all",
    async (req, res) => {

        try {

            const response =
                await axios.get(

                    `${DOTNET_API}/catalog/products/all`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET ALL CATALOG PRODUCTS"
            );
        }
    }
);

// =========================================================
// GET CATALOG PRODUCT BY ID
// =========================================================

app.get(
    "/api/catalog/products/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.get(

                    `${DOTNET_API}/catalog/products/${encodeURIComponent(id)}`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `GET CATALOG PRODUCT ${id}`
            );
        }
    }
);

// =========================================================
// GET CATALOG PRODUCTS
// =========================================================

app.get(
    "/api/catalog/products",
    async (req, res) => {

        const {
            sellerId,
            customerId
        } = req.query;

        try {

            if (!sellerId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "sellerId is required."
                });
            }

            if (!customerId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "customerId is required."
                });
            }

            const response =
                await axios.get(

                    `${DOTNET_API}/catalog/products`,

                    {
                        params: {
                            sellerId,
                            customerId
                        },

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET CATALOG PRODUCTS"
            );
        }
    }
);

// =========================================================
// CREATE CATALOG PRODUCT
// =========================================================

app.post(
    "/api/catalog/products",
    async (req, res) => {

        try {

            const response =
                await axios.post(

                    `${DOTNET_API}/catalog/products`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "CREATE CATALOG PRODUCT"
            );
        }
    }
);

// =========================================================
// UPDATE CATALOG PRODUCT
// =========================================================

app.put(
    "/api/catalog/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.put(

                    `${DOTNET_API}/catalog/${encodeURIComponent(id)}`,

                    req.body,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `UPDATE CATALOG ${id}`
            );
        }
    }
);

// =========================================================
// DELETE CATALOG PRODUCT
// =========================================================

app.delete(
    "/api/catalog/products/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.delete(

                    `${DOTNET_API}/catalog/products/${encodeURIComponent(id)}`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            if (
                response.data === undefined ||
                response.data === null
            ) {

                return res
                    .status(response.status)
                    .send();
            }

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `DELETE CATALOG PRODUCT ${id}`
            );
        }
    }
);

// =========================================================
// =========================================================
// BRAND
// =========================================================
// =========================================================

// =========================================================
// GET ALL BRANDS
// =========================================================

app.get(
    "/api/Brand",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/Brand`,
                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET ALL BRANDS"
            );
        }
    }
);

// =========================================================
// GET BRAND BY ID
// =========================================================

app.get(
    "/api/Brand/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.get(

                    `${DOTNET_API}/Brand/${encodeURIComponent(id)}`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `GET BRAND ${id}`
            );
        }
    }
);

// =========================================================
// CREATE BRAND
// =========================================================

app.post(
    "/api/Brand",
    async (req, res) => {

        try {

            const response =
                await axios.post(

                    `${DOTNET_API}/Brand`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "CREATE BRAND"
            );
        }
    }
);

// =========================================================
// UPDATE BRAND
// =========================================================

app.put(
    "/api/Brand/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.put(

                    `${DOTNET_API}/Brand/${encodeURIComponent(id)}`,

                    req.body,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `UPDATE BRAND ${id}`
            );
        }
    }
);

// =========================================================
// PATCH BRAND
// =========================================================

app.patch(
    "/api/Brand/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.patch(

                    `${DOTNET_API}/Brand/${encodeURIComponent(id)}`,

                    req.body,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `PATCH BRAND ${id}`
            );
        }
    }
);

// =========================================================
// DELETE BRAND
// =========================================================

app.delete(
    "/api/Brand/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.delete(

                    `${DOTNET_API}/Brand/${encodeURIComponent(id)}`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            if (
                response.data === undefined ||
                response.data === null
            ) {

                return res
                    .status(response.status)
                    .send();
            }

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `DELETE BRAND ${id}`
            );
        }
    }
);

// =========================================================
// BRAND STATISTICS
// =========================================================

app.get(
    "/api/Brand/statistics",
    async (req, res) => {

        try {

            const response =
                await axios.get(

                    `${DOTNET_API}/Brand/statistics`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET BRAND STATISTICS"
            );
        }
    }
);

// =========================================================
// BRAND FILTERS
// =========================================================

app.get(
    "/api/Brand/filters",
    async (req, res) => {

        try {

            const response =
                await axios.get(

                    `${DOTNET_API}/Brand/filters`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET BRAND FILTERS"
            );
        }
    }
);

// =========================================================
// =========================================================
// BRAND MODEL
// =========================================================
// =========================================================

// =========================================================
// GET ALL BRAND MODELS
// =========================================================

app.get(
    "/api/BrandModel",
    async (req, res) => {

        try {

            const response =
                await axios.get(

                    `${DOTNET_API}/BrandModel`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET ALL BRAND MODELS"
            );
        }
    }
);

// =========================================================
// GET BRAND MODEL BY ID
// =========================================================

app.get(
    "/api/BrandModel/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.get(

                    `${DOTNET_API}/BrandModel/${encodeURIComponent(id)}`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `GET BRAND MODEL ${id}`
            );
        }
    }
);

// =========================================================
// CREATE BRAND MODEL
// =========================================================

app.post(
    "/api/BrandModel",
    async (req, res) => {

        try {

            const response =
                await axios.post(

                    `${DOTNET_API}/BrandModel`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "CREATE BRAND MODEL"
            );
        }
    }
);

// =========================================================
// UPDATE BRAND MODEL
// =========================================================

app.put(
    "/api/BrandModel/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.put(

                    `${DOTNET_API}/BrandModel/${encodeURIComponent(id)}`,

                    req.body,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `UPDATE BRAND MODEL ${id}`
            );
        }
    }
);

// =========================================================
// PATCH BRAND MODEL
// =========================================================

app.patch(
    "/api/BrandModel/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.patch(

                    `${DOTNET_API}/BrandModel/${encodeURIComponent(id)}`,

                    req.body,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `PATCH BRAND MODEL ${id}`
            );
        }
    }
);

// =========================================================
// DELETE BRAND MODEL
// =========================================================

app.delete(
    "/api/BrandModel/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.delete(

                    `${DOTNET_API}/BrandModel/${encodeURIComponent(id)}`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            if (
                response.data === undefined ||
                response.data === null
            ) {

                return res
                    .status(response.status)
                    .send();
            }

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `DELETE BRAND MODEL ${id}`
            );
        }
    }
);

// =========================================================
// =========================================================
// CATEGORY
// =========================================================
// =========================================================

// =========================================================
// GET ALL CATEGORIES
//
// React:
// GET /api/Category
//
// ASP.NET:
// GET /api/Category
//
// Supports query parameters such as:
//
// /api/Category?sellerId=6
// /api/Category?search=Electronics
// /api/Category?isActive=true
// =========================================================

app.get(
    "/api/Category",
    async (req, res) => {

        try {

            console.log(
                "GET ALL CATEGORIES"
            );

            console.log(
                "QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/Category`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "CATEGORY STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET ALL CATEGORIES"
            );
        }
    }
);

// =========================================================
// GET CATEGORY BY ID
//
// React:
// GET /api/Category/1
//
// ASP.NET:
// GET /api/Category/1
// =========================================================

app.get(
    "/api/Category/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            console.log(
                "GET CATEGORY BY ID:",
                id
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/Category/${encodeURIComponent(id)}`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `GET CATEGORY ${id}`
            );
        }
    }
);

// =========================================================
// CREATE CATEGORY
//
// React:
// POST /api/Category
//
// ASP.NET:
// POST /api/Category
// =========================================================

app.post(
    "/api/Category",
    async (req, res) => {

        try {

            console.log(
                "CREATE CATEGORY"
            );

            console.log(
                "BODY:",
                req.body
            );

            const response =
                await axios.post(

                    `${DOTNET_API}/Category`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "CREATE CATEGORY STATUS:",
                response.status
            );

            console.log(
                "CREATE CATEGORY RESPONSE:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "CREATE CATEGORY"
            );
        }
    }
);

// =========================================================
// UPDATE CATEGORY
//
// React:
// PUT /api/Category/1
//
// ASP.NET:
// PUT /api/Category/1
// =========================================================

app.put(
    "/api/Category/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            console.log(
                "UPDATE CATEGORY:",
                id
            );

            console.log(
                "BODY:",
                req.body
            );

            const response =
                await axios.put(

                    `${DOTNET_API}/Category/${encodeURIComponent(id)}`,

                    req.body,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "UPDATE CATEGORY STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `UPDATE CATEGORY ${id}`
            );
        }
    }
);

// =========================================================
// PATCH CATEGORY
//
// React:
// PATCH /api/Category/1
//
// ASP.NET:
// PATCH /api/Category/1
// =========================================================

app.patch(
    "/api/Category/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            console.log(
                "PATCH CATEGORY:",
                id
            );

            console.log(
                "BODY:",
                req.body
            );

            const response =
                await axios.patch(

                    `${DOTNET_API}/Category/${encodeURIComponent(id)}`,

                    req.body,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `PATCH CATEGORY ${id}`
            );
        }
    }
);

// =========================================================
// DELETE CATEGORY
//
// React:
// DELETE /api/Category/1
//
// ASP.NET:
// DELETE /api/Category/1
// =========================================================

app.delete(
    "/api/Category/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            console.log(
                "DELETE CATEGORY:",
                id
            );

            const response =
                await axios.delete(

                    `${DOTNET_API}/Category/${encodeURIComponent(id)}`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            if (
                response.data === undefined ||
                response.data === null
            ) {

                return res
                    .status(response.status)
                    .send();
            }

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `DELETE CATEGORY ${id}`
            );
        }
    }
);

// =========================================================
// CATEGORY STATISTICS
//
// React:
// GET /api/Category/statistics
//
// ASP.NET:
// GET /api/Category/statistics
// =========================================================

app.get(
    "/api/Category/statistics",
    async (req, res) => {

        try {

            console.log(
                "GET CATEGORY STATISTICS"
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/Category/statistics`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "CATEGORY STATISTICS:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET CATEGORY STATISTICS"
            );
        }
    }
);

// =========================================================
// CATEGORY FILTERS
//
// React:
// GET /api/Category/filters
//
// Examples:
//
// /api/Category/filters?search=Electronics
// /api/Category/filters?isActive=true
// /api/Category/filters?sellerId=6
// =========================================================

app.get(
    "/api/Category/filters",
    async (req, res) => {

        try {

            console.log(
                "GET CATEGORY FILTERS"
            );

            console.log(
                "FILTER QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/Category/filters`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET CATEGORY FILTERS"
            );
        }
    }
);
// =========================================================
// SELLER ROUTES
// Node.js → ASP.NET Core
//
// ASP.NET Base:
// https://localhost:7203/api/sellers
//
// Node Base:
// http://localhost:5000/api/sellers
// =========================================================


// =========================================================
// GET SELLER LIST
//
// PURPOSE:
// Used by dropdowns / selection controls.
//
// React:
// GET /api/sellers/list
//
// ASP.NET:
// GET /api/sellers/list
//
// RESPONSE:
//
// [
//     {
//         "sellerId": 1,
//         "sellerName": "ABC Traders"
//     },
//     {
//         "sellerId": 2,
//         "sellerName": "XYZ Electronics"
//     }
// ]
// =========================================================

app.get(
    "/api/sellers/list",
    async (req, res) => {

        try {

            console.log(
                "GET SELLER LIST"
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/sellers/list`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "SELLER LIST STATUS:",
                response.status
            );

            console.log(
                "SELLER LIST:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET SELLER LIST ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error,
                "GET SELLER LIST"
            );
        }
    }
);


// =========================================================
// GET ALL SELLERS
//
// React:
// GET /api/sellers
//
// ASP.NET:
// GET /api/sellers
//
// Supported:
//
// /api/sellers
// /api/sellers?search=john
// /api/sellers?status=active
// /api/sellers?sort=seller_name
// /api/sellers?page=1&limit=15
// =========================================================

app.get(
    "/api/sellers",
    async (req, res) => {

        try {

            console.log(
                "GET ALL SELLERS"
            );

            console.log(
                "SELLER QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/sellers`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "SELLER STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET ALL SELLERS"
            );
        }
    }
);


// =========================================================
// GET SELLER BY ID
//
// React:
// GET /api/sellers/1
//
// ASP.NET:
// GET /api/sellers/1
// =========================================================

app.get(
    "/api/sellers/:id",
    async (req, res) => {

        const { id } =
            req.params;

        try {

            console.log(
                "GET SELLER BY ID:",
                id
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/sellers/${encodeURIComponent(id)}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "SELLER BY ID STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `GET SELLER ${id}`
            );
        }
    }
);


// =========================================================
// GET SELLER STATISTICS
//
// React:
// GET /api/sellers/stats
//
// ASP.NET:
// GET /api/sellers/stats
// =========================================================

app.get(
    "/api/sellers/stats",
    async (req, res) => {

        try {

            console.log(
                "GET SELLER STATISTICS"
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/sellers/stats`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "SELLER STATISTICS:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET SELLER STATISTICS"
            );
        }
    }
);


// =========================================================
// CREATE SELLER
//
// React:
// POST /api/sellers
//
// ASP.NET:
// POST /api/sellers
// =========================================================

app.post(
    "/api/sellers",
    async (req, res) => {

        try {

            console.log(
                "CREATE SELLER"
            );

            console.log(
                "SELLER BODY:",
                req.body
            );

            const response =
                await axios.post(

                    `${DOTNET_API}/sellers`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {

                            Accept:
                                "application/json",

                            "Content-Type":
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "CREATE SELLER STATUS:",
                response.status
            );

            console.log(
                "CREATE SELLER RESPONSE:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "CREATE SELLER"
            );
        }
    }
);


// =========================================================
// UPDATE SELLER
//
// React:
// PUT /api/sellers/1
//
// ASP.NET:
// PUT /api/sellers/1
// =========================================================

app.put(
    "/api/sellers/:id",
    async (req, res) => {

        const { id } =
            req.params;

        try {

            console.log(
                "UPDATE SELLER:",
                id
            );

            console.log(
                "UPDATE SELLER BODY:",
                req.body
            );

            const response =
                await axios.put(

                    `${DOTNET_API}/sellers/${encodeURIComponent(id)}`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {

                            Accept:
                                "application/json",

                            "Content-Type":
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "UPDATE SELLER STATUS:",
                response.status
            );

            console.log(
                "UPDATE SELLER RESPONSE:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `UPDATE SELLER ${id}`
            );
        }
    }
);


// =========================================================
// DELETE SELLER
//
// React:
// DELETE /api/sellers/1
//
// ASP.NET:
// DELETE /api/sellers/1
// =========================================================

app.delete(
    "/api/sellers/:id",
    async (req, res) => {

        const { id } =
            req.params;

        try {

            console.log(
                "DELETE SELLER:",
                id
            );

            const response =
                await axios.delete(

                    `${DOTNET_API}/sellers/${encodeURIComponent(id)}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "DELETE SELLER STATUS:",
                response.status
            );

            if (
                response.data === undefined ||
                response.data === null
            ) {

                return res
                    .status(response.status)
                    .send();
            }

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `DELETE SELLER ${id}`
            );
        }
    }
);

// =========================================================
// =========================================================
// PRODUCT
// =========================================================
// =========================================================

// =========================================================
// GET ALL PRODUCTS
//
// React:
// GET /api/Product
//
// ASP.NET:
// GET /api/Product
//
// Query examples:
//
// /api/Product?sellerId=6
// /api/Product?categoryId=2
// /api/Product?brandId=3
// /api/Product?productTypeId=1
// /api/Product?isActive=true
// =========================================================

app.get(
    "/api/Product",
    async (req, res) => {

        try {

            console.log(
                "GET ALL PRODUCTS"
            );

            console.log(
                "QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/Product`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET ALL PRODUCTS"
            );
        }
    }
);

// =========================================================
// GET PRODUCT BY ID
//
// React:
// GET /api/Product/1
//
// ASP.NET:
// GET /api/Product/1
// =========================================================

app.get(
    "/api/Product/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            console.log(
                "GET PRODUCT BY ID:",
                id
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/Product/${encodeURIComponent(id)}`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `GET PRODUCT ${id}`
            );
        }
    }
);

// =========================================================
// CREATE PRODUCT
//
// React:
// POST /api/Product
//
// ASP.NET:
// POST /api/Product
// =========================================================

app.post(
    "/api/Product",
    async (req, res) => {

        try {

            console.log(
                "CREATE PRODUCT"
            );

            console.log(
                "BODY:",
                req.body
            );

            const response =
                await axios.post(

                    `${DOTNET_API}/Product`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "CREATE PRODUCT STATUS:",
                response.status
            );

            console.log(
                "CREATE PRODUCT RESPONSE:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "CREATE PRODUCT"
            );
        }
    }
);

// =========================================================
// UPDATE PRODUCT
//
// React:
// PUT /api/Product/1
//
// ASP.NET:
// PUT /api/Product/1
// =========================================================

app.put(
    "/api/Product/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            console.log(
                "UPDATE PRODUCT:",
                id
            );

            console.log(
                "BODY:",
                req.body
            );

            const response =
                await axios.put(

                    `${DOTNET_API}/Product/${encodeURIComponent(id)}`,

                    req.body,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "UPDATE PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `UPDATE PRODUCT ${id}`
            );
        }
    }
);

// =========================================================
// PATCH PRODUCT
//
// React:
// PATCH /api/Product/1
//
// ASP.NET:
// PATCH /api/Product/1
// =========================================================

app.patch(
    "/api/Product/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            console.log(
                "PATCH PRODUCT:",
                id
            );

            console.log(
                "BODY:",
                req.body
            );

            const response =
                await axios.patch(

                    `${DOTNET_API}/Product/${encodeURIComponent(id)}`,

                    req.body,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `PATCH PRODUCT ${id}`
            );
        }
    }
);

// =========================================================
// DELETE PRODUCT
//
// React:
// DELETE /api/Product/1
//
// ASP.NET:
// DELETE /api/Product/1
// =========================================================

app.delete(
    "/api/Product/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            console.log(
                "DELETE PRODUCT:",
                id
            );

            const response =
                await axios.delete(

                    `${DOTNET_API}/Product/${encodeURIComponent(id)}`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            if (
                response.data === undefined ||
                response.data === null
            ) {

                return res
                    .status(response.status)
                    .send();
            }

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `DELETE PRODUCT ${id}`
            );
        }
    }
);

// =========================================================
// PRODUCT STATISTICS
//
// React:
// GET /api/Product/statistics
//
// ASP.NET:
// GET /api/Product/statistics
// =========================================================

app.get(
    "/api/Product/statistics",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCT STATISTICS"
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/Product/statistics`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "PRODUCT STATISTICS:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCT STATISTICS"
            );
        }
    }
);

// =========================================================
// PRODUCT FILTERS
//
// React:
// GET /api/Product/filters
//
// Examples:
//
// /api/Product/filters?search=Samsung
// /api/Product/filters?brandId=3
// /api/Product/filters?categoryId=2
// /api/Product/filters?productTypeId=1
// /api/Product/filters?isActive=true
// =========================================================

app.get(
    "/api/Product/filters",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCT FILTERS"
            );

            console.log(
                "FILTER QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/Product/filters`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCT FILTERS"
            );
        }
    }
);

// =========================================================
// PRODUCT SEARCH
//
// React:
// GET /api/Product/search?search=Samsung
//
// ASP.NET:
// GET /api/Product/search?search=Samsung
// =========================================================

app.get(
    "/api/Product/search",
    async (req, res) => {

        try {

            console.log(
                "SEARCH PRODUCTS"
            );

            console.log(
                "SEARCH QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/Product/search`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "SEARCH PRODUCTS"
            );
        }
    }
);
// =========================================================
// PRODUCT ROUTES
// Node.js → ASP.NET
// =========================================================


// =========================================================
// GET ALL PRODUCTS
//
// Node:
// GET /api/products
//
// ASP.NET:
// GET /api/products
// =========================================================

app.get(
    "/api/products",
    async (req, res) => {

        try {

            console.log(
                "GET ALL PRODUCTS"
            );

            console.log(
                "QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET ALL PRODUCTS"
            );
        }
    }
);


// =========================================================
// GET PRODUCT BY ID
//
// Node:
// GET /api/products/1
//
// ASP.NET:
// GET /api/products/1
// =========================================================

app.get(
    "/api/products/:id",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCT BY ID"
            );

            console.log(
                "PRODUCT ID:",
                req.params.id
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/${req.params.id}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCT BY ID"
            );
        }
    }
);


// =========================================================
// GET PRODUCT BY SKU
//
// Node:
// GET /api/products/sku/ABC-001
//
// ASP.NET:
// GET /api/products/sku/ABC-001
// =========================================================

app.get(
    "/api/products/sku/:sku",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCT BY SKU"
            );

            console.log(
                "SKU:",
                req.params.sku
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/sku/${encodeURIComponent(
                        req.params.sku
                    )}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "PRODUCT SKU STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCT BY SKU"
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY SELLER
//
// Node:
// GET /api/products/seller/1
//
// ASP.NET:
// GET /api/products/seller/1
// =========================================================

app.get(
    "/api/products/seller/:sellerId",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCTS BY SELLER"
            );

            console.log(
                "SELLER ID:",
                req.params.sellerId
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/seller/${req.params.sellerId}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "SELLER PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCTS BY SELLER"
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY CUSTOMER
//
// Node:
// GET /api/products/customer/1
//
// ASP.NET:
// GET /api/products/customer/1
// =========================================================

app.get(
    "/api/products/customer/:customerId",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCTS BY CUSTOMER"
            );

            console.log(
                "CUSTOMER ID:",
                req.params.customerId
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/customer/${req.params.customerId}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "CUSTOMER PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCTS BY CUSTOMER"
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY SELLER + CUSTOMER
//
// Node:
// GET /api/products/seller/1/customer/2
//
// ASP.NET:
// GET /api/products/seller/1/customer/2
// =========================================================

app.get(
    "/api/products/seller/:sellerId/customer/:customerId",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCTS BY SELLER + CUSTOMER"
            );

            console.log(
                "SELLER ID:",
                req.params.sellerId
            );

            console.log(
                "CUSTOMER ID:",
                req.params.customerId
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/seller/${req.params.sellerId}/customer/${req.params.customerId}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "SELLER CUSTOMER PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCTS BY SELLER + CUSTOMER"
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY BRAND
//
// Node:
// GET /api/products/brand/1
//
// ASP.NET:
// GET /api/products/brand/1
// =========================================================

app.get(
    "/api/products/brand/:brandId",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCTS BY BRAND"
            );

            console.log(
                "BRAND ID:",
                req.params.brandId
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/brand/${req.params.brandId}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "BRAND PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCTS BY BRAND"
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY CATEGORY
//
// Node:
// GET /api/products/category/1
//
// ASP.NET:
// GET /api/products/category/1
// =========================================================

app.get(
    "/api/products/category/:categoryId",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCTS BY CATEGORY"
            );

            console.log(
                "CATEGORY ID:",
                req.params.categoryId
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/category/${req.params.categoryId}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "CATEGORY PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCTS BY CATEGORY"
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY PRODUCT TYPE
//
// Node:
// GET /api/products/product-type/1
//
// ASP.NET:
// GET /api/products/product-type/1
// =========================================================

app.get(
    "/api/products/product-type/:productTypeId",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCTS BY PRODUCT TYPE"
            );

            console.log(
                "PRODUCT TYPE ID:",
                req.params.productTypeId
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/product-type/${req.params.productTypeId}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "PRODUCT TYPE STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCTS BY PRODUCT TYPE"
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY STATUS
//
// Node:
// GET /api/products/status/Active
//
// ASP.NET:
// GET /api/products/status/Active
// =========================================================

app.get(
    "/api/products/status/:status",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCTS BY STATUS"
            );

            console.log(
                "STATUS:",
                req.params.status
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/status/${encodeURIComponent(
                        req.params.status
                    )}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "STATUS PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCTS BY STATUS"
            );
        }
    }
);


// =========================================================
// SEARCH PRODUCTS
//
// Node:
// GET /api/products/search?search=phone
//
// ASP.NET:
// GET /api/products/search?search=phone
// =========================================================

app.get(
    "/api/products/search",
    async (req, res) => {

        try {

            console.log(
                "SEARCH PRODUCTS"
            );

            console.log(
                "QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/search`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "SEARCH PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "SEARCH PRODUCTS"
            );
        }
    }
);


// =========================================================
// GET PRODUCT STATISTICS
//
// Node:
// GET /api/products/stats
//
// ASP.NET:
// GET /api/products/stats
// =========================================================

app.get(
    "/api/products/stats",
    async (req, res) => {

        try {

            console.log(
                "GET PRODUCT STATISTICS"
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/stats`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "PRODUCT STATISTICS STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCT STATISTICS"
            );
        }
    }
);


// =========================================================
// GET PAGED PRODUCTS
//
// Node:
// GET /api/products/paged?page=1&limit=15
//
// ASP.NET:
// GET /api/products/paged?page=1&limit=15
// =========================================================

app.get(
    "/api/products/paged",
    async (req, res) => {

        try {

            console.log(
                "GET PAGED PRODUCTS"
            );

            console.log(
                "QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/paged`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "PAGED PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PAGED PRODUCTS"
            );
        }
    }
);


// =========================================================
// GET SORTED PRODUCTS
//
// Node:
// GET /api/products/sorted?sort=name_asc
//
// ASP.NET:
// GET /api/products/sorted?sort=name_asc
// =========================================================

app.get(
    "/api/products/sorted",
    async (req, res) => {

        try {

            console.log(
                "GET SORTED PRODUCTS"
            );

            console.log(
                "QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/products/sorted`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "SORTED PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET SORTED PRODUCTS"
            );
        }
    }
);


// =========================================================
// CREATE PRODUCT
//
// Node:
// POST /api/products
//
// ASP.NET:
// POST /api/products
// =========================================================

app.post(
    "/api/products",
    async (req, res) => {

        try {

            console.log(
                "CREATE PRODUCT"
            );

            console.log(
                "BODY:",
                req.body
            );

            const response =
                await axios.post(

                    `${DOTNET_API}/products`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json",

                            "Content-Type":
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "CREATE PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "CREATE PRODUCT"
            );
        }
    }
);


// =========================================================
// UPDATE PRODUCT
//
// Node:
// PUT /api/products/1
//
// ASP.NET:
// PUT /api/products/1
// =========================================================

app.put(
    "/api/products/:id",
    async (req, res) => {

        try {

            console.log(
                "UPDATE PRODUCT"
            );

            console.log(
                "PRODUCT ID:",
                req.params.id
            );

            console.log(
                "BODY:",
                req.body
            );

            const response =
                await axios.put(

                    `${DOTNET_API}/products/${req.params.id}`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json",

                            "Content-Type":
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "UPDATE PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "UPDATE PRODUCT"
            );
        }
    }
);


// =========================================================
// DELETE PRODUCT
//
// Node:
// DELETE /api/products/1
//
// ASP.NET:
// DELETE /api/products/1
// =========================================================

app.delete(
    "/api/products/:id",
    async (req, res) => {

        try {

            console.log(
                "DELETE PRODUCT"
            );

            console.log(
                "PRODUCT ID:",
                req.params.id
            );

            const response =
                await axios.delete(

                    `${DOTNET_API}/products/${req.params.id}`,

                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            console.log(
                "DELETE PRODUCT STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "DELETE PRODUCT"
            );
        }
    }
);
// =========================================================
// =========================================================
// PRODUCT TYPE
// =========================================================
// =========================================================

// =========================================================
// GET ALL PRODUCT TYPES
// =========================================================

app.get(
    "/api/producttype",
    async (req, res) => {

        try {

            const response =
                await axios.get(

                    `${DOTNET_API}/producttype`,

                    {
                        params:
                            req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        },

                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET PRODUCT TYPES"
            );
        }
    }
);

// =========================================================
// 404 HANDLER
// =========================================================

app.use(
    (req, res) => {

        console.log(
            `ROUTE NOT FOUND: ${req.method} ${req.originalUrl}`
        );

        res.status(404).json({

            success: false,

            message:
                `Cannot ${req.method} ${req.originalUrl}`
        });
    }
);

// =========================================================
// GLOBAL ERROR HANDLER
// =========================================================

app.use(
    (error, req, res, next) => {

        console.error(
            "GLOBAL SERVER ERROR:",
            error
        );

        if (res.headersSent) {

            return next(error);
        }

        res.status(500).json({

            success: false,

            message:
                "Internal server error."
        });
    }
);


// =========================================================
// START SERVER
// =========================================================

app.listen(
    PORT,
    () => {

        console.log(
            "================================================"
        );

        console.log(
            "MARKETPLACE SELLER PORTAL"
        );

        console.log(
            "NODE SERVER STARTED"
        );

        console.log(
            "================================================"
        );

        console.log(
            `Node URL: http://localhost:${PORT}`
        );

        console.log(
            "React URL: http://localhost:5173"
        );

        console.log(
            `ASP.NET API: ${DOTNET_API}`
        );

        console.log(
            "================================================"
        );

        console.log(
            "AUTH:"
        );

        console.log(
            "POST /api/AuthManagement/login"
        );

        console.log(
            "POST /api/AuthManagement/register"
        );

        console.log(
            "POST /api/AuthManagement/forgot-password"
        );

        console.log(
            "POST /api/AuthManagement/reset-password"
        );

        console.log(
            "================================================"
        );

        console.log(
            "CATEGORY:"
        );

        console.log(
            "GET    /api/Category"
        );

        console.log(
            "GET    /api/Category/:id"
        );

        console.log(
            "POST   /api/Category"
        );

        console.log(
            "PUT    /api/Category/:id"
        );

        console.log(
            "PATCH  /api/Category/:id"
        );

        console.log(
            "DELETE /api/Category/:id"
        );

        console.log(
            "GET    /api/Category/statistics"
        );

        console.log(
            "GET    /api/Category/filters"
        );

        console.log(
            "================================================"
        );

        console.log(
            "PRODUCT:"
        );

        console.log(
            "GET    /api/Product"
        );

        console.log(
            "GET    /api/Product/:id"
        );

        console.log(
            "POST   /api/Product"
        );

        console.log(
            "PUT    /api/Product/:id"
        );

        console.log(
            "PATCH  /api/Product/:id"
        );

        console.log(
            "DELETE /api/Product/:id"
        );

        console.log(
            "GET    /api/Product/statistics"
        );

        console.log(
            "GET    /api/Product/filters"
        );

        console.log(
            "GET    /api/Product/search"
        );

        console.log(
            "================================================"
        );

        console.log(
            "BRAND:"
        );

        console.log(
            "GET    /api/Brand"
        );

        console.log(
            "GET    /api/Brand/:id"
        );

        console.log(
            "POST   /api/Brand"
        );

        console.log(
            "PUT    /api/Brand/:id"
        );

        console.log(
            "PATCH  /api/Brand/:id"
        );

        console.log(
            "DELETE /api/Brand/:id"
        );

        console.log(
            "GET    /api/Brand/statistics"
        );

        console.log(
            "GET    /api/Brand/filters"
        );

        console.log(
            "================================================"
        );

        console.log(
            "BRAND MODEL:"
        );

        console.log(
            "GET    /api/BrandModel"
        );

        console.log(
            "GET    /api/BrandModel/:id"
        );

        console.log(
            "POST   /api/BrandModel"
        );

        console.log(
            "PUT    /api/BrandModel/:id"
        );

        console.log(
            "PATCH  /api/BrandModel/:id"
        );

        console.log(
            "DELETE /api/BrandModel/:id"
        );

        console.log(
            "================================================"
        );

        console.log(
            "PRODUCT TYPE:"
        );

        console.log(
            "GET    /api/producttype"
        );

        console.log(
            "================================================"
        );
    }
);
