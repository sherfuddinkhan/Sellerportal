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
const BASE_URL = "https://localhost:7203/api";
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
//GET ALL BRANDS
// =========================================================
app.get(
    "/api/brands",
    async (req, res) => {

        try {

            console.log(
                "GET ALL BRANDS"
            );

            console.log(
                "BRAND QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/brands`,

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
// =========================================================
// GET ALL CATEGORIES
// =========================================================

app.get(
    "/api/Category",
    async (req, res) => {

        try {

            console.log(
                "GET CATEGORIES"
            );

            console.log(
                "CATEGORY QUERY:",
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

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET CATEGORIES"
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

// =========================================================
// CATEGORY - UPDATE
// PUT /api/categories/:id
// =========================================================

app.put(
    "/api/categories/:id",
    async (req, res) => {

        try {

            const { id } = req.params;

            console.log(
                "================================="
            );

            console.log(
                "UPDATE CATEGORY"
            );

            console.log(
                "Category ID:",
                id
            );

            console.log(
                "Request Body:",
                req.body
            );

            console.log(
                "Target URL:",
                `${BASE_URL}/categories/${id}`
            );

            console.log(
                "================================="
            );

            const response =
                await axios.put(
                    `${BASE_URL}/categories/${id}`,
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
                "UPDATE CATEGORY RESPONSE:",
                response.data
            );

            res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "UPDATE CATEGORY ERROR:"
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Data:",
                error.response?.data
            );

            console.error(
                "Message:",
                error.message
            );

            res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to update category"
                    }
                );
        }
    }
);

// ---------------------------------------------------------
// GET CATEGORY BY ID
// GET /api/categories/:id
// ---------------------------------------------------------

app.get(
    "/api/categories/:id",
    async (req, res) => {

        try {

            const { id } = req.params;

            console.log(
                `GET /api/categories/${id}`
            );

            const response = await axios.get(
                `${BASE_URL}/categories/${id}`,
                {
                    httpsAgent,
                }
            );

            console.log(
                "Category response:",
                response.data
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET category by ID error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch category",
                }
            );

        }

    }
);
app.get(
    "/api/categories/:id",
    async (req, res) => {

        try {

            const { id } = req.params;

            console.log(
                `GET CATEGORY ${id}`
            );

            const response = await axios.get(
                `${BASE_URL}/categories/${id}`,
                {
                    httpsAgent,
                }
            );

            res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET CATEGORY ERROR:",
                error.response?.data ||
                error.message
            );

            res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to fetch category",
                    }
                );
        }
    }
);
app.get(
    "/api/categories/:id/products",
    async (req, res) => {

        try {

            const { id } = req.params;

            console.log(
                `GET CATEGORY PRODUCTS ${id}`
            );

            const response = await axios.get(
                `${BASE_URL}/categories/${id}/products`,
                {
                    httpsAgent,
                }
            );

            console.log(
                "PRODUCTS RESPONSE:",
                response.data
            );

            res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET CATEGORY PRODUCTS ERROR:",
                error.response?.data ||
                error.message
            );

            res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to fetch category products",
                    }
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
// GET ALL CATEGORIES
// =========================================================

app.get(
    "/api/categories",
    async (req, res) => {

        try {

            console.log(
                "GET CATEGORIES"
            );

            console.log(
                "CATEGORY QUERY:",
                req.query
            );

            const response =
                await axios.get(

                    `${DOTNET_API}/categories`,

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
                "CATEGORY API RESPONSE:",
                response.data
            );

            return res
                .status(
                    response.status
                )
                .json(
                    response.data
                );

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET CATEGORIES"
            );

        }

    }
);


// =========================================================
// SUPPLIER ROUTES
// =========================================================

// GET ALL
app.get("/api/Supplier", async (req, res) => {

    try {

        const response = await axios.get(
            `${DOTNET_API}/Supplier`,
            { httpsAgent }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Supplier Error:",
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// SEARCH
app.get("/api/Supplier/search", async (req, res) => {

    try {

        const response = await axios.get(
            `${DOTNET_API}/Supplier/search`,
            {
                params: {
                    search: req.query.search
                },
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Supplier/search Error:",
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// SORT
app.get("/api/Supplier/sort", async (req, res) => {

    try {

        const response = await axios.get(
            `${DOTNET_API}/Supplier/sort`,
            {
                params: {
                    sort: req.query.sort
                },
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Supplier/sort Error:",
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// PAGINATION
app.get("/api/Supplier/page", async (req, res) => {

    try {

        const response = await axios.get(
            `${DOTNET_API}/Supplier/page`,
            {
                params: {
                    page: req.query.page || 1,
                    limit: req.query.limit || 15
                },
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Supplier/page Error:",
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// STATISTICS
app.get("/api/Supplier/statistics", async (req, res) => {

    try {

        const response = await axios.get(
            `${DOTNET_API}/Supplier/statistics`,
            { httpsAgent }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Supplier/statistics Error:",
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// GET BY SELLER
app.get("/api/Supplier/seller/:sellerId", async (req, res) => {

    try {

        const response = await axios.get(
            `${DOTNET_API}/Supplier/seller/${req.params.sellerId}`,
            { httpsAgent }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET Supplier by seller Error:",
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// GET BY SELLER + SUPPLIER
app.get(
    "/api/Supplier/:sellerId/:supplierId",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/Supplier/${req.params.sellerId}/${req.params.supplierId}`,
                { httpsAgent }
            );

            res.status(response.status).json(response.data);

        } catch (error) {

            console.error(
                "GET Supplier seller/supplier Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);


// GET BY SUPPLIER ID
// KEEP THIS LAST
app.get(
    "/api/Supplier/:supplierId",
    async (req, res) => {

        try {

            const supplierId =
                Number(req.params.supplierId);

            if (!Number.isInteger(supplierId)) {

                return res.status(400).json({
                    message: "Supplier ID must be a number"
                });

            }

            const response = await axios.get(
                `${DOTNET_API}/Supplier/${supplierId}`,
                { httpsAgent }
            );

            res.status(response.status).json(response.data);

        } catch (error) {

            console.error(
                "GET /api/Supplier/:supplierId Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);

// =========================================================
// GET ALL SALES ORDERS
//
// React:
// GET http://localhost:5000/api/sales-orders/all
//
// ASP.NET:
// GET https://localhost:7203/api/SalesOrder/all
// =========================================================
app.get("/api/sales-orders/all", async (req, res) => {

    try {

        console.log("GET ALL SALES ORDERS");

        const response = await axios.get(
            `${DOTNET_API}/SalesOrder/all`,
            {
                httpsAgent
            }
        );

        return res.status(200).json(
            response.data
        );

    } catch (error) {

        console.error(
            "GET ALL SALES ORDERS ERROR:",
            error.response?.data ||
            error.message
        );

        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to fetch all sales orders"
            }
        );
    }
});

// =========================================================
// CREATE SALES ORDER
// POST /api/sales-orders
// =========================================================

app.post("/api/sales-orders", async (req, res) => {
    try {
        console.log("======================================");
        console.log("CREATE SALES ORDER");
        console.log("Request Body:", req.body);
        console.log("======================================");

        const response = await axios.post(
            `${DOTNET_API}/SalesOrder`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        console.log(
            "Sales Order Created:",
            response.data
        );

        return res.status(200).json(response.data);

    } catch (error) {

        console.error(
            "CREATE SALES ORDER ERROR:",
            error.response?.data || error.message
        );

        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to create Sales Order"
            }
        );
    }
});



// =========================================================
// GET SALES ORDER BY ID
// GET /api/sales-orders/1
// =========================================================
app.get("/api/sales-orders/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                message: "Invalid Sales Order ID"
            });
        }

        console.log(
            `GET SALES ORDER BY ID: ${id}`
        );

        const response = await axios.get(
            `${DOTNET_API}/SalesOrder/${id}`,
            {
                httpsAgent
            }
        );

        return res.status(200).json(
            response.data
        );

    } catch (error) {

        console.error(
            "GET SALES ORDER BY ID ERROR:",
            error.response?.data ||
            error.message
        );

        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to fetch sales order"
            }
        );
    }
});


// =========================================================
// CREATE SALES ORDER
// POST /api/sales-orders
// =========================================================
app.post("/api/sales-orders", async (req, res) => {

    try {

        console.log(
            "CREATE SALES ORDER:",
            req.body
        );

        const response = await axios.post(
            `${DOTNET_API}/SalesOrder`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json(
            response.data
        );

    } catch (error) {

        console.error(
            "CREATE SALES ORDER ERROR:",
            error.response?.data ||
            error.message
        );

        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to create sales order"
            }
        );
    }
});


// =========================================================
// UPDATE SALES ORDER
// PUT /api/sales-orders/:id
// =========================================================
app.put("/api/sales-orders/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                message: "Invalid Sales Order ID"
            });
        }

        console.log(
            `UPDATE SALES ORDER: ${id}`
        );

        const response = await axios.put(
            `${DOTNET_API}/SalesOrder/${id}`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json(
            response.data
        );

    } catch (error) {

        console.error(
            "UPDATE SALES ORDER ERROR:",
            error.response?.data ||
            error.message
        );

        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to update sales order"
            }
        );
    }
});


// =========================================================
// DELETE SALES ORDER
// DELETE /api/sales-orders/:id
// =========================================================
app.delete("/api/sales-orders/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                message: "Invalid Sales Order ID"
            });
        }

        console.log(
            `DELETE SALES ORDER: ${id}`
        );

        const response = await axios.delete(
            `${DOTNET_API}/SalesOrder/${id}`,
            {
                httpsAgent
            }
        );

        return res.status(200).json(
            response.data
        );

    } catch (error) {

        console.error(
            "DELETE SALES ORDER ERROR:",
            error.response?.data ||
            error.message
        );

        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to delete sales order"
            }
        );
    }
});
// =========================================================
// SALES ORDER ITEMS
// =========================================================

app.get("/api/sales-order-items", async (req, res) => {
    try {
        const response = await axios.get(
            `${DOTNET_API}/sales-order-items`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET SALES ORDER ITEMS PROXY ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});

// ---------------------------------------------------------
// GET ALL / SEARCH / PAGINATION / SORT
// GET /api/sales-order-items
// ---------------------------------------------------------

app.get("/api/sales-order-items", async (req, res) => {
    try {

        console.log(
            "GET SALES ORDER ITEMS:",
            req.query
        );

        const response = await axios.get(
            `${DOTNET_API}/SalesOrderItem`,
            {
                httpsAgent,
                params: req.query
            }
        );

        return res.status(200).json(response.data);

    } catch (error) {

        console.error(
            "GET SALES ORDER ITEMS ERROR:",
            error.response?.data || error.message
        );

        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to fetch Sales Order Items"
            }
        );
    }
});


// ---------------------------------------------------------
// GET SALES ORDER ITEM BY ID
// GET /api/sales-order-items/1
// ---------------------------------------------------------

app.get("/api/sales-order-items/:id", async (req, res) => {
    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                message: "Invalid Sales Order Item ID"
            });

        }

        const response = await axios.get(
            `${DOTNET_API}/SalesOrderItem/${id}`,
            {
                httpsAgent
            }
        );

        return res.status(200).json(response.data);

    } catch (error) {

        console.error(
            "GET SALES ORDER ITEM BY ID ERROR:",
            error.response?.data || error.message
        );

        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to fetch Sales Order Item"
            }
        );
    }
});


// ---------------------------------------------------------
// GET BY SALES ORDER
// GET /api/sales-order-items/salesorder/1
// ---------------------------------------------------------

app.get(
    "/api/sales-order-items/salesorder/:salesOrderId",
    async (req, res) => {

        try {

            const salesOrderId =
                Number(req.params.salesOrderId);

            if (
                !Number.isInteger(salesOrderId) ||
                salesOrderId <= 0
            ) {

                return res.status(400).json({
                    message: "Invalid Sales Order ID"
                });

            }

            const response = await axios.get(
                `${DOTNET_API}/SalesOrderItem/salesorder/${salesOrderId}`,
                {
                    httpsAgent
                }
            );

            return res.status(200).json(response.data);

        } catch (error) {

            console.error(
                "GET ITEMS BY SALES ORDER ERROR:",
                error.response?.data ||
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch items by Sales Order"
                }
            );
        }
    }
);


// ---------------------------------------------------------
// GET BY PRODUCT
// GET /api/sales-order-items/product/1
// ---------------------------------------------------------

app.get(
    "/api/sales-order-items/product/:productId",
    async (req, res) => {

        try {

            const productId =
                Number(req.params.productId);

            if (
                !Number.isInteger(productId) ||
                productId <= 0
            ) {

                return res.status(400).json({
                    message: "Invalid Product ID"
                });

            }

            const response = await axios.get(
                `${DOTNET_API}/SalesOrderItem/product/${productId}`,
                {
                    httpsAgent
                }
            );

            return res.status(200).json(response.data);

        } catch (error) {

            console.error(
                "GET ITEMS BY PRODUCT ERROR:",
                error.response?.data ||
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch items by Product"
                }
            );
        }
    }
);


// ---------------------------------------------------------
// STATISTICS
// GET /api/sales-order-items/stats
// ---------------------------------------------------------

app.get(
    "/api/sales-order-items/stats",
    async (req, res) => {

        try {

            console.log(
                "GET SALES ORDER ITEM STATISTICS"
            );

            const response = await axios.get(
                `${DOTNET_API}/SalesOrderItem/stats`,
                {
                    httpsAgent
                }
            );

            return res.status(200).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET SALES ORDER ITEM STATS ERROR:",
                error.response?.data ||
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch Sales Order Item statistics"
                }
            );
        }
    }
);


// ---------------------------------------------------------
// CREATE SALES ORDER ITEM
// POST /api/sales-order-items
// ---------------------------------------------------------

app.post(
    "/api/sales-order-items",
    async (req, res) => {

        try {

            console.log(
                "CREATE SALES ORDER ITEM:",
                req.body
            );

            const response = await axios.post(
                `${DOTNET_API}/SalesOrderItem`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            console.log(
                "SALES ORDER ITEM CREATED:",
                response.data
            );

            return res.status(200).json(
                response.data
            );

        } catch (error) {

            console.error(
                "CREATE SALES ORDER ITEM ERROR:",
                error.response?.data ||
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to create Sales Order Item"
                }
            );
        }
    }
);


// ---------------------------------------------------------
// UPDATE SALES ORDER ITEM
// PUT /api/sales-order-items/1
// ---------------------------------------------------------

app.put(
    "/api/sales-order-items/:id",
    async (req, res) => {

        try {

            const id =
                Number(req.params.id);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Invalid Sales Order Item ID"
                });

            }

            console.log(
                "UPDATE SALES ORDER ITEM:",
                id,
                req.body
            );

            const response = await axios.put(
                `${DOTNET_API}/SalesOrderItem/${id}`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            return res.status(200).json(
                response.data
            );

        } catch (error) {

            console.error(
                "UPDATE SALES ORDER ITEM ERROR:",
                error.response?.data ||
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to update Sales Order Item"
                }
            );
        }
    }
);


// ---------------------------------------------------------
// DELETE SALES ORDER ITEM
// DELETE /api/sales-order-items/1
// ---------------------------------------------------------

app.delete(
    "/api/sales-order-items/:id",
    async (req, res) => {

        try {

            const id =
                Number(req.params.id);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Invalid Sales Order Item ID"
                });

            }

            console.log(
                "DELETE SALES ORDER ITEM:",
                id
            );

            const response = await axios.delete(
                `${DOTNET_API}/SalesOrderItem/${id}`,
                {
                    httpsAgent
                }
            );

            return res.status(200).json(
                response.data
            );

        } catch (error) {

            console.error(
                "DELETE SALES ORDER ITEM ERROR:",
                error.response?.data ||
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to delete Sales Order Item"
                }
            );
        }
    }
);

// =====================================================
// SALES INVOICE ROUTES
// =====================================================

// GET ALL SALES INVOICES
app.get("/api/sales-invoices", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/SalesInvoice`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET SALES INVOICES ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to load Sales Invoices"
            }
        );
    }
});


// GET SALES INVOICE BY ID
app.get("/api/sales-invoices/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const response = await axios.get(
            `${DOTNET_API}/SalesInvoice/${id}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET SALES INVOICE ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to load Sales Invoice"
            }
        );
    }
});


// GET SALES INVOICES BY SALES ORDER
app.get(
    "/api/sales-invoices/salesorder/:salesOrderId",
    async (req, res) => {

        try {

            const { salesOrderId } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/SalesInvoice/salesorder/${salesOrderId}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(response.data);

        } catch (error) {

            console.error(
                "GET SALES INVOICES BY SALES ORDER ERROR:",
                error.response?.data || error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load Sales Invoices"
                }
            );
        }
    }
);

/*
    GET SALES INVOICE STATISTICS

    React:
    GET http://localhost:5000/api/sales-invoices/statistics
*/

app.get(
    "/api/sales-invoices/statistics",
    async (req, res) => {

        try {

            console.log(
                "GET SALES INVOICE STATISTICS",
                req.query
            );

            const response = await axios.get(
                `${DOTNET_API}/SalesInvoice/statistics`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            console.log(
                "SALES INVOICE STATISTICS RESPONSE:",
                response.data
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "SALES INVOICE STATISTICS ERROR:",
                error.message
            );

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
                    .json(error.response.data);
            }

            res.status(500).json({
                message: "Unable to connect to Sales Invoice statistics API",
                error: error.message
            });

        }

    }
);

// GET SALES INVOICES BY STATUS
app.get(
    "/api/sales-invoices/status/:status",
    async (req, res) => {

        try {

            const { status } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/SalesInvoice/status/${encodeURIComponent(status)}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(response.data);

        } catch (error) {

            console.error(
                "GET SALES INVOICES BY STATUS ERROR:",
                error.response?.data || error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load Sales Invoices"
                }
            );
        }
    }
);


// GET SALES INVOICES BY PAYMENT STATUS
app.get(
    "/api/sales-invoices/paymentstatus/:paymentStatus",
    async (req, res) => {

        try {

            const { paymentStatus } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/SalesInvoice/paymentstatus/${encodeURIComponent(paymentStatus)}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(response.data);

        } catch (error) {

            console.error(
                "GET SALES INVOICES BY PAYMENT STATUS ERROR:",
                error.response?.data || error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load Sales Invoices"
                }
            );
        }
    }
);


// GET SALES INVOICE BY NUMBER
app.get(
    "/api/sales-invoices/number/:invoiceNumber",
    async (req, res) => {

        try {

            const { invoiceNumber } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/SalesInvoice/number/${encodeURIComponent(invoiceNumber)}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(response.data);

        } catch (error) {

            console.error(
                "GET SALES INVOICE BY NUMBER ERROR:",
                error.response?.data || error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load Sales Invoice"
                }
            );
        }
    }
);


// CREATE SALES INVOICE
app.post("/api/sales-invoices", async (req, res) => {

    try {

        const response = await axios.post(
            `${DOTNET_API}/SalesInvoice`,
            req.body,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "CREATE SALES INVOICE ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message:
                    "Failed to create Sales Invoice"
            }
        );
    }
});


// UPDATE SALES INVOICE
app.put("/api/sales-invoices/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const response = await axios.put(
            `${DOTNET_API}/SalesInvoice/${id}`,
            req.body,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "UPDATE SALES INVOICE ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message:
                    "Failed to update Sales Invoice"
            }
        );
    }
});


// DELETE SALES INVOICE
app.delete("/api/sales-invoices/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const response = await axios.delete(
            `${DOTNET_API}/SalesInvoice/${id}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "DELETE SALES INVOICE ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message:
                    "Failed to delete Sales Invoice"
            }
        );
    }
});

/* =========================================================
   GET ALL REVIEWS
========================================================= */

app.get("/api/reviews", async (req, res) => {

    try {

        console.log(
            "GET ALL REVIEWS"
        );


        const response = await axios.get(
            `${DOTNET_API}/reviews`,
            {
                httpsAgent
            }
        );


        return res.status(
            response.status
        ).json(
            response.data
        );

    }
    catch (error) {

        console.error(
            "GET REVIEWS ERROR:",
            error.message
        );


        return res.status(
            error.response?.status || 500
        ).json({

            success: false,

            message:
                error.response?.data?.message ||
                "Failed to load reviews.",

            error:
                error.response?.data ||
                error.message

        });

    }

});


/* =========================================================
   GET FILTERED / PAGINATED REVIEWS
========================================================= */

app.get("/api/reviews/filter", async (req, res) => {

    try {

        console.log(
            "GET FILTERED REVIEWS:",
            req.query
        );


        const response = await axios.get(
            `${DOTNET_API}/reviews/filter`,
            {
                params: req.query,
                httpsAgent
            }
        );


        return res.status(
            response.status
        ).json(
            response.data
        );

    }
    catch (error) {

        console.error(
            "FILTER REVIEWS ERROR:",
            error.message
        );


        return res.status(
            error.response?.status || 500
        ).json({

            success: false,

            message:
                error.response?.data?.message ||
                "Failed to filter reviews.",

            error:
                error.response?.data ||
                error.message

        });

    }

});


/* =========================================================
   GET REVIEW STATISTICS
========================================================= */

app.get("/api/reviews/stats", async (req, res) => {

    try {

        console.log(
            "GET REVIEW STATISTICS"
        );


        const response = await axios.get(
            `${DOTNET_API}/reviews/stats`,
            {
                httpsAgent
            }
        );


        return res.status(
            response.status
        ).json(
            response.data
        );

    }
    catch (error) {

        console.error(
            "REVIEW STATISTICS ERROR:",
            error.message
        );


        return res.status(
            error.response?.status || 500
        ).json({

            success: false,

            message:
                error.response?.data?.message ||
                "Failed to load review statistics.",

            error:
                error.response?.data ||
                error.message

        });

    }

});


/* =========================================================
   GET REVIEW BY ID
========================================================= */

app.get("/api/reviews/:id", async (req, res) => {

    try {

        const { id } = req.params;


        console.log(
            `GET REVIEW BY ID: ${id}`
        );


        const response = await axios.get(
            `${DOTNET_API}/reviews/${id}`,
            {
                httpsAgent
            }
        );


        return res.status(
            response.status
        ).json(
            response.data
        );

    }
    catch (error) {

        console.error(
            "GET REVIEW BY ID ERROR:",
            error.message
        );


        return res.status(
            error.response?.status || 500
        ).json({

            success: false,

            message:
                error.response?.data?.message ||
                "Failed to load review.",

            error:
                error.response?.data ||
                error.message

        });

    }

});


/* =========================================================
   GET REVIEWS BY SELLER
========================================================= */

app.get(
    "/api/reviews/seller/:sellerId",
    async (req, res) => {

        try {

            const { sellerId } = req.params;


            console.log(
                `GET REVIEWS BY SELLER: ${sellerId}`
            );


            const response = await axios.get(
                `${DOTNET_API}/reviews/seller/${sellerId}`,
                {
                    httpsAgent
                }
            );


            return res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "SELLER REVIEWS ERROR:",
                error.message
            );


            return res.status(
                error.response?.status || 500
            ).json({

                success: false,

                message:
                    error.response?.data?.message ||
                    "Failed to load seller reviews.",

                error:
                    error.response?.data ||
                    error.message

            });

        }

    }
);


/* =========================================================
   GET REVIEWS BY CUSTOMER
========================================================= */

app.get(
    "/api/reviews/customer/:customerId",
    async (req, res) => {

        try {

            const { customerId } = req.params;


            console.log(
                `GET REVIEWS BY CUSTOMER: ${customerId}`
            );


            const response = await axios.get(
                `${DOTNET_API}/reviews/customer/${customerId}`,
                {
                    httpsAgent
                }
            );


            return res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "CUSTOMER REVIEWS ERROR:",
                error.message
            );


            return res.status(
                error.response?.status || 500
            ).json({

                success: false,

                message:
                    error.response?.data?.message ||
                    "Failed to load customer reviews.",

                error:
                    error.response?.data ||
                    error.message

            });

        }

    }
);


/* =========================================================
   GET REVIEWS BY PRODUCT
========================================================= */

app.get(
    "/api/reviews/product/:productId",
    async (req, res) => {

        try {

            const { productId } = req.params;


            console.log(
                `GET REVIEWS BY PRODUCT: ${productId}`
            );


            const response = await axios.get(
                `${DOTNET_API}/reviews/product/${productId}`,
                {
                    httpsAgent
                }
            );


            return res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "PRODUCT REVIEWS ERROR:",
                error.message
            );


            return res.status(
                error.response?.status || 500
            ).json({

                success: false,

                message:
                    error.response?.data?.message ||
                    "Failed to load product reviews.",

                error:
                    error.response?.data ||
                    error.message

            });

        }

    }
);


/* =========================================================
   GET REVIEWS BY RATING
========================================================= */

app.get(
    "/api/reviews/rating/:rating",
    async (req, res) => {

        try {

            const { rating } = req.params;


            console.log(
                `GET REVIEWS BY RATING: ${rating}`
            );


            const response = await axios.get(
                `${DOTNET_API}/reviews/rating/${rating}`,
                {
                    httpsAgent
                }
            );


            return res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "RATING REVIEWS ERROR:",
                error.message
            );


            return res.status(
                error.response?.status || 500
            ).json({

                success: false,

                message:
                    error.response?.data?.message ||
                    "Failed to load rating reviews.",

                error:
                    error.response?.data ||
                    error.message

            });

        }

    }
);


/* =========================================================
   GET REVIEWS BY STATUS
========================================================= */

app.get(
    "/api/reviews/status/:status",
    async (req, res) => {

        try {

            const { status } = req.params;


            console.log(
                `GET REVIEWS BY STATUS: ${status}`
            );


            const response = await axios.get(
                `${DOTNET_API}/reviews/status/${encodeURIComponent(status)}`,
                {
                    httpsAgent
                }
            );


            return res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "STATUS REVIEWS ERROR:",
                error.message
            );


            return res.status(
                error.response?.status || 500
            ).json({

                success: false,

                message:
                    error.response?.data?.message ||
                    "Failed to load status reviews.",

                error:
                    error.response?.data ||
                    error.message

            });

        }

    }
);


/* =========================================================
   CREATE REVIEW
========================================================= */

app.post("/api/reviews", async (req, res) => {

    try {

        console.log(
            "CREATE REVIEW:",
            req.body
        );


        const response = await axios.post(
            `${DOTNET_API}/reviews`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );


        return res.status(
            response.status
        ).json(
            response.data
        );

    }
    catch (error) {

        console.error(
            "CREATE REVIEW ERROR:",
            error.message
        );


        return res.status(
            error.response?.status || 500
        ).json({

            success: false,

            message:
                error.response?.data?.message ||
                "Failed to create review.",

            error:
                error.response?.data ||
                error.message

        });

    }

});


/* =========================================================
   UPDATE REVIEW
========================================================= */

app.put("/api/reviews/:id", async (req, res) => {

    try {

        const { id } = req.params;


        console.log(
            `UPDATE REVIEW: ${id}`
        );


        const response = await axios.put(
            `${DOTNET_API}/reviews/${id}`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );


        return res.status(
            response.status
        ).json(
            response.data
        );

    }
    catch (error) {

        console.error(
            "UPDATE REVIEW ERROR:",
            error.message
        );


        return res.status(
            error.response?.status || 500
        ).json({

            success: false,

            message:
                error.response?.data?.message ||
                "Failed to update review.",

            error:
                error.response?.data ||
                error.message

        });

    }

});


/* =========================================================
   DELETE REVIEW
========================================================= */

app.delete("/api/reviews/:id", async (req, res) => {

    try {

        const { id } = req.params;


        console.log(
            `DELETE REVIEW: ${id}`
        );


        const response = await axios.delete(
            `${DOTNET_API}/reviews/${id}`,
            {
                httpsAgent
            }
        );


        return res.status(
            response.status
        ).json(
            response.data
        );

    }
    catch (error) {

        console.error(
            "DELETE REVIEW ERROR:",
            error.message
        );


        return res.status(
            error.response?.status || 500
        ).json({

            success: false,

            message:
                error.response?.data?.message ||
                "Failed to delete review.",

            error:
                error.response?.data ||
                error.message

        });

    }

});













//////////////////////    STOCK LEDGERS /////////////////
// ---------------------------------------------------------
// GET STOCK LEDGERS
// Supports search, transactionType, sort,
// page and limit
//
// GET /api/stock-ledgers
// ---------------------------------------------------------

app.get(
    "/api/stock-ledgers",
    async (req, res) => {

        try {

            console.log(
                "GET /api/stock-ledgers",
                req.query
            );

            const response =
                await axios.get(
                    `${DOTNET_API}/stock-ledgers`,
                    {
                        httpsAgent,
                        params: req.query
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger GET Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to load Stock Ledger records."
            );
        }
    }
);


// ---------------------------------------------------------
// GET STOCK LEDGER STATISTICS
//
// GET /api/stock-ledgers/statistics
// ---------------------------------------------------------

app.get(
    "/api/stock-ledgers/statistics",
    async (req, res) => {

        try {

            console.log(
                "GET /api/stock-ledgers/statistics"
            );

            const response =
                await axios.get(
                    `${DOTNET_API}/stock-ledgers/statistics`,
                    {
                        httpsAgent
                    }
                );

            console.log(
                "Stock Ledger Statistics:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger Statistics Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to load Stock Ledger statistics."
            );
        }
    }
);


// ---------------------------------------------------------
// GET STOCK LEDGER FILTERS
//
// GET /api/stock-ledgers/filters
// ---------------------------------------------------------

app.get(
    "/api/stock-ledgers/filters",
    async (req, res) => {

        try {

            console.log(
                "GET /api/stock-ledgers/filters"
            );

            const response =
                await axios.get(
                    `${DOTNET_API}/stock-ledgers/filters`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger Filters Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to load Stock Ledger filters."
            );
        }
    }
);


// ---------------------------------------------------------
// GET STOCK LEDGER BY ID
//
// GET /api/stock-ledgers/6
// ---------------------------------------------------------

app.get(
    "/api/stock-ledgers/:stockLedgerId",
    async (req, res) => {

        try {

            const {
                stockLedgerId
            } = req.params;

            console.log(
                `GET /api/stock-ledgers/${stockLedgerId}`
            );

            const response =
                await axios.get(
                    `${DOTNET_API}/stock-ledgers/${stockLedgerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger GET BY ID Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to load Stock Ledger record."
            );
        }
    }
);


// ---------------------------------------------------------
// GET BY SELLER
//
// GET /api/stock-ledgers/seller/6
// ---------------------------------------------------------

app.get(
    "/api/stock-ledgers/seller/:sellerId",
    async (req, res) => {

        try {

            const {
                sellerId
            } = req.params;

            const response =
                await axios.get(
                    `${DOTNET_API}/stock-ledgers/seller/${sellerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger Seller Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to load seller Stock Ledger records."
            );
        }
    }
);


// ---------------------------------------------------------
// GET BY CUSTOMER
//
// GET /api/stock-ledgers/customer/3
// ---------------------------------------------------------

app.get(
    "/api/stock-ledgers/customer/:customerId",
    async (req, res) => {

        try {

            const {
                customerId
            } = req.params;

            const response =
                await axios.get(
                    `${DOTNET_API}/stock-ledgers/customer/${customerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger Customer Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to load customer Stock Ledger records."
            );
        }
    }
);


// ---------------------------------------------------------
// GET BY SELLER + CUSTOMER
//
// GET /api/stock-ledgers/seller/6/customer/3
// ---------------------------------------------------------

app.get(
    "/api/stock-ledgers/seller/:sellerId/customer/:customerId",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.params;

            const response =
                await axios.get(
                    `${DOTNET_API}/stock-ledgers/seller/${sellerId}/customer/${customerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger Seller Customer Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to load seller/customer Stock Ledger records."
            );
        }
    }
);


// ---------------------------------------------------------
// GET BY PRODUCT
//
// GET /api/stock-ledgers/product/6
// ---------------------------------------------------------

app.get(
    "/api/stock-ledgers/product/:productId",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            const response =
                await axios.get(
                    `${DOTNET_API}/stock-ledgers/product/${productId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger Product Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to load product Stock Ledger records."
            );
        }
    }
);


// ---------------------------------------------------------
// GET BY WAREHOUSE
//
// GET /api/stock-ledgers/warehouse/3
// ---------------------------------------------------------

app.get(
    "/api/stock-ledgers/warehouse/:warehouseId",
    async (req, res) => {

        try {

            const {
                warehouseId
            } = req.params;

            const response =
                await axios.get(
                    `${DOTNET_API}/stock-ledgers/warehouse/${warehouseId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger Warehouse Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to load warehouse Stock Ledger records."
            );
        }
    }
);


// ---------------------------------------------------------
// GET BY TRANSACTION TYPE
//
// GET /api/stock-ledgers/transaction/Purchase
// ---------------------------------------------------------

app.get(
    "/api/stock-ledgers/transaction/:transactionType",
    async (req, res) => {

        try {

            const {
                transactionType
            } = req.params;

            const response =
                await axios.get(
                    `${DOTNET_API}/stock-ledgers/transaction/${encodeURIComponent(transactionType)}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger Transaction Type Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to load transaction records."
            );
        }
    }
);


// ---------------------------------------------------------
// GET SPECIFIC STOCK LEDGER
//
// GET
// /api/stock-ledgers/seller/6/product/6/warehouse/3/ledger/6
// ---------------------------------------------------------

app.get(
    "/api/stock-ledgers/seller/:sellerId/product/:productId/warehouse/:warehouseId/ledger/:stockLedgerId",
    async (req, res) => {

        try {

            const {
                sellerId,
                productId,
                warehouseId,
                stockLedgerId
            } = req.params;

            const response =
                await axios.get(
                    `${DOTNET_API}/stock-ledgers/seller/${sellerId}/product/${productId}/warehouse/${warehouseId}/ledger/${stockLedgerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger Detailed Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to load Stock Ledger details."
            );
        }
    }
);


// ---------------------------------------------------------
// CREATE STOCK LEDGER
//
// POST /api/stock-ledgers
// ---------------------------------------------------------

app.post(
    "/api/stock-ledgers",
    async (req, res) => {

        try {

            console.log(
                "POST /api/stock-ledgers"
            );

            console.log(
                "Request Body:",
                req.body
            );

            const response =
                await axios.post(
                    `${DOTNET_API}/stock-ledgers`,
                    req.body,
                    {
                        httpsAgent,
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger POST Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to create Stock Ledger record."
            );
        }
    }
);


// ---------------------------------------------------------
// UPDATE STOCK LEDGER
//
// PUT /api/stock-ledgers/6
// ---------------------------------------------------------

app.put(
    "/api/stock-ledgers/:stockLedgerId",
    async (req, res) => {

        try {

            const {
                stockLedgerId
            } = req.params;

            console.log(
                `PUT /api/stock-ledgers/${stockLedgerId}`
            );

            console.log(
                "Request Body:",
                req.body
            );

            const response =
                await axios.put(
                    `${DOTNET_API}/stock-ledgers/${stockLedgerId}`,
                    req.body,
                    {
                        httpsAgent,
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger PUT Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to update Stock Ledger record."
            );
        }
    }
);


// ---------------------------------------------------------
// DELETE STOCK LEDGER
//
// DELETE /api/stock-ledgers/6
// ---------------------------------------------------------

app.delete(
    "/api/stock-ledgers/:stockLedgerId",
    async (req, res) => {

        try {

            const {
                stockLedgerId
            } = req.params;

            console.log(
                `DELETE /api/stock-ledgers/${stockLedgerId}`
            );

            const response =
                await axios.delete(
                    `${DOTNET_API}/stock-ledgers/${stockLedgerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Ledger DELETE Error:",
                error.message
            );

            return handleProxyError(
                res,
                error,
                "Failed to delete Stock Ledger record."
            );
        }
    }
);






// =========================================================
// PRODUCT TYPE
// React -> Node server.js -> ASP.NET Core
// =========================================================


// =========================================================
// GET ALL PRODUCT TYPES
//
// GET
// http://localhost:5000/api/product-types
//
// ASP.NET
// https://localhost:7203/api/product-types
//
// Supports:
// ?search=electronic
// ?status=active
// ?sort=name_desc
// ?page=1&limit=10
// =========================================================

app.get(
    "/api/product-types",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/product-types`,
                    {
                        params: req.query,
                        httpsAgent
                    }
                );


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET /api/product-types Error:",
                error.message
            );


            if (error.response) {

                return res
                    .status(
                        error.response.status
                    )
                    .json(
                        error.response.data
                    );

            }


            return res.status(500).json({

                message:
                    "Failed to fetch product types.",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// GET ALL PRODUCT TYPES AT ONCE
//
// GET
// http://localhost:5000/api/product-types/all
//
// ASP.NET
// https://localhost:7203/api/product-types
//
// This is useful when the frontend needs the complete
// product type list without pagination.
// =========================================================

app.get(
    "/api/product-types/all",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/product-types`,
                    {
                        httpsAgent
                    }
                );


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET /api/product-types/all Error:",
                error.message
            );


            if (error.response) {

                return res
                    .status(
                        error.response.status
                    )
                    .json(
                        error.response.data
                    );

            }


            return res.status(500).json({

                message:
                    "Failed to fetch all product types.",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// GET PRODUCT TYPE STATISTICS
//
// GET
// http://localhost:5000/api/product-types/stats
//
// ASP.NET
// https://localhost:7203/api/product-types/stats
// =========================================================

app.get(
    "/api/product-types/stats",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/product-types/stats`,
                    {
                        httpsAgent
                    }
                );


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET /api/product-types/stats Error:",
                error.message
            );


            if (error.response) {

                return res
                    .status(
                        error.response.status
                    )
                    .json(
                        error.response.data
                    );

            }


            return res.status(500).json({

                message:
                    "Failed to fetch product type statistics.",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// GET PRODUCT TYPE BY ID
//
// GET
// http://localhost:5000/api/product-types/1
//
// ASP.NET
// https://localhost:7203/api/product-types/1
// =========================================================

app.get(
    "/api/product-types/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const response =
                await axios.get(
                    `${DOTNET_API}/product-types/${id}`,
                    {
                        httpsAgent
                    }
                );


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET /api/product-types/:id Error:",
                error.message
            );


            if (error.response) {

                return res
                    .status(
                        error.response.status
                    )
                    .json(
                        error.response.data
                    );

            }


            return res.status(500).json({

                message:
                    "Failed to fetch product type.",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// CREATE PRODUCT TYPE
//
// POST
// http://localhost:5000/api/product-types
//
// ASP.NET
// https://localhost:7203/api/product-types
// =========================================================

app.post(
    "/api/product-types",
    async (req, res) => {

        try {

            const response =
                await axios.post(

                    `${DOTNET_API}/product-types`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }

                );


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "POST /api/product-types Error:",
                error.message
            );


            if (error.response) {

                return res
                    .status(
                        error.response.status
                    )
                    .json(
                        error.response.data
                    );

            }


            return res.status(500).json({

                message:
                    "Failed to create product type.",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// UPDATE PRODUCT TYPE
//
// PUT
// http://localhost:5000/api/product-types/1
//
// ASP.NET
// https://localhost:7203/api/product-types/1
// =========================================================

app.put(
    "/api/product-types/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const response =
                await axios.put(

                    `${DOTNET_API}/product-types/${id}`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }

                );


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "PUT /api/product-types/:id Error:",
                error.message
            );


            if (error.response) {

                return res
                    .status(
                        error.response.status
                    )
                    .json(
                        error.response.data
                    );

            }


            return res.status(500).json({

                message:
                    "Failed to update product type.",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// DELETE PRODUCT TYPE
//
// DELETE
// http://localhost:5000/api/product-types/1
//
// ASP.NET
// https://localhost:7203/api/product-types/1
// =========================================================

app.delete(
    "/api/product-types/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const response =
                await axios.delete(

                    `${DOTNET_API}/product-types/${id}`,

                    {
                        httpsAgent
                    }

                );


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "DELETE /api/product-types/:id Error:",
                error.message
            );


            if (error.response) {

                return res
                    .status(
                        error.response.status
                    )
                    .json(
                        error.response.data
                    );

            }


            return res.status(500).json({

                message:
                    "Failed to delete product type.",

                error:
                    error.message

            });

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
////////////////// seller-customer/////////////////
// =========================================================
// SELLER CUSTOMER ROUTES
// =========================================================

// GET ALL SELLER CUSTOMERS
// GET /api/seller-customers
app.get(
    "/api/seller-customers",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/SellerCustomer`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET ALL SELLER CUSTOMERS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load seller customers."
                    }
                );

        }

    }
);
// GET CUSTOMER BY SELLER + CUSTOMER ID
app.get(
    "/api/SellerCustomer/:sellerId/customers/:customerId",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.params;


            console.log(
                `GET SellerCustomer: seller=${sellerId}, customer=${customerId}`
            );


            const response =
                await axios.get(
                    `${DOTNET_API}/SellerCustomer/${sellerId}/customers/${customerId}`
                );


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET SellerCustomer Details Error:",
                error.response?.data ||
                error.message
            );


            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Unable to load customer details."
                }
            );

        }

    }
);



// =========================================================
// GET CUSTOMERS BY SELLER
// =========================================================

// GET /api/seller-customers/seller/6

app.get(
    "/api/seller-customers/seller/:sellerId",
    async (req, res) => {

        try {

            const {
                sellerId
            } = req.params;

            const response =
                await axios.get(
                    `${DOTNET_API}/SellerCustomer/seller/${sellerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET SELLER CUSTOMERS BY SELLER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load seller customers."
                    }
                );

        }

    }
);


// =========================================================
// GET SINGLE CUSTOMER
// =========================================================

// GET /api/seller-customers/6/customers/3

app.get(
    "/api/seller-customers/:sellerId/customers/:customerId",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.params;

            const response =
                await axios.get(
                    `${DOTNET_API}/SellerCustomer/${sellerId}/customers/${customerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET SELLER CUSTOMER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Customer not found."
                    }
                );

        }

    }
);


// =========================================================
// GET CUSTOMER BY CODE
// =========================================================

// GET /api/seller-customers/6/code/CUST001

app.get(
    "/api/seller-customers/:sellerId/code/:customerCode",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerCode
            } = req.params;

            const response =
                await axios.get(
                    `${DOTNET_API}/SellerCustomer/${sellerId}/code/${encodeURIComponent(customerCode)}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET CUSTOMER BY CODE ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Customer not found."
                    }
                );

        }

    }
);


// =========================================================
// CREATE CUSTOMER
// =========================================================

// POST /api/seller-customers

app.post(
    "/api/seller-customers",
    async (req, res) => {

        try {

            const response =
                await axios.post(
                    `${DOTNET_API}/SellerCustomer`,
                    req.body,
                    {
                        httpsAgent,
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "CREATE SELLER CUSTOMER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to create customer."
                    }
                );

        }

    }
);


// =========================================================
// UPDATE CUSTOMER
// =========================================================

// PUT /api/seller-customers/6/customers/3

app.put(
    "/api/seller-customers/:sellerId/customers/:customerId",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.params;

            const response =
                await axios.put(
                    `${DOTNET_API}/SellerCustomer/${sellerId}/customers/${customerId}`,
                    req.body,
                    {
                        httpsAgent,
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .send(
                    response.data || null
                );

        } catch (error) {

            console.error(
                "UPDATE SELLER CUSTOMER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to update customer."
                    }
                );

        }

    }
);


// =========================================================
// DELETE CUSTOMER
// =========================================================

// DELETE /api/seller-customers/6/customers/3

app.delete(
    "/api/seller-customers/:sellerId/customers/:customerId",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.params;

            const response =
                await axios.delete(
                    `${DOTNET_API}/SellerCustomer/${sellerId}/customers/${customerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(response.status)
                .send(
                    response.data || null
                );

        } catch (error) {

            console.error(
                "DELETE SELLER CUSTOMER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to delete customer."
                    }
                );

        }

    }
);


const WAREHOUSE_LOCATION_API =
    `${DOTNET_API}/WarehouseLocation`;

// =========================================================
// WAREHOUSE LOCATION
// =========================================================

// GET ALL
app.get("/api/warehouse-locations", async (req, res) => {
    try {
        const response = await axios.get(
            WAREHOUSE_LOCATION_API,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(
            "GET /api/warehouse-locations Error:",
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// GET BY ID
app.get(
    "/api/warehouse-locations/:locationId",
    async (req, res) => {
        try {
            const { locationId } = req.params;

            const response = await axios.get(
                `${WAREHOUSE_LOCATION_API}/${locationId}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );
        } catch (error) {
            console.error(
                "GET warehouse location by ID Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);


// GET BY WAREHOUSE
app.get(
    "/api/warehouse-locations/warehouse/:warehouseId",
    async (req, res) => {
        try {
            const { warehouseId } = req.params;

            const response = await axios.get(
                `${WAREHOUSE_LOCATION_API}/warehouse/${warehouseId}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );
        } catch (error) {
            console.error(
                "GET warehouse locations Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);


// GET SPECIFIC LOCATION
app.get(
    "/api/warehouse-locations/warehouse/:warehouseId/:locationId",
    async (req, res) => {
        try {
            const {
                warehouseId,
                locationId
            } = req.params;

            const {
                customerId
            } = req.query;

            const response = await axios.get(
                `${WAREHOUSE_LOCATION_API}/${warehouseId}/${locationId}`,
                {
                    params: {
                        customerId
                    },
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );
        } catch (error) {
            console.error(
                "GET specific warehouse location Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);


// CREATE
app.post(
    "/api/warehouse-locations",
    async (req, res) => {
        try {
            const response = await axios.post(
                WAREHOUSE_LOCATION_API,
                req.body,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );
        } catch (error) {
            console.error(
                "POST /api/warehouse-locations Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);


// UPDATE
app.put(
    "/api/warehouse-locations/:locationId",
    async (req, res) => {
        try {
            const { locationId } = req.params;

            const response = await axios.put(
                `${WAREHOUSE_LOCATION_API}/${locationId}`,
                req.body,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );
        } catch (error) {
            console.error(
                "PUT warehouse location Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);


// SEARCH
app.get(
    "/api/warehouse-locations/search",
    async (req, res) => {
        try {
            const { search } = req.query;

            const response = await axios.get(
                `${WAREHOUSE_LOCATION_API}/search`,
                {
                    params: {
                        search
                    },
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );
        } catch (error) {
            console.error(
                "SEARCH warehouse locations Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);


// SORT
app.get(
    "/api/warehouse-locations/sort",
    async (req, res) => {
        try {
            const { sort } = req.query;

            const response = await axios.get(
                `${WAREHOUSE_LOCATION_API}/sort`,
                {
                    params: {
                        sort
                    },
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );
        } catch (error) {
            console.error(
                "SORT warehouse locations Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);


// PAGINATION
app.get(
    "/api/warehouse-locations/page",
    async (req, res) => {
        try {
            const {
                page = 1,
                limit = 15
            } = req.query;

            const response = await axios.get(
                `${WAREHOUSE_LOCATION_API}/page`,
                {
                    params: {
                        page,
                        limit
                    },
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );
        } catch (error) {
            console.error(
                "PAGE warehouse locations Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);


// STATISTICS
app.get(
    "/api/warehouse-locations/statistics",
    async (req, res) => {
        try {
            const response = await axios.get(
                `${WAREHOUSE_LOCATION_API}/statistics`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );
        } catch (error) {
            console.error(
                "STATISTICS warehouse locations Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);


// DELETE
app.delete(
    "/api/warehouse-locations/:locationId",
    async (req, res) => {
        try {
            const { locationId } = req.params;

            const response = await axios.delete(
                `${WAREHOUSE_LOCATION_API}/${locationId}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );
        } catch (error) {
            console.error(
                "DELETE warehouse location Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: error.message
                }
            );
        }
    }
);
//////////////////// stock transfer Routes /////////////

// =========================================================
// STOCK TRANSFER API ROUTES

//
// =========================================================
// STOCK TRANSFER
// GET ALL
//
// React:
// GET /api/stock-transfers
//
// Node:
// GET /api/stock-transfers
//
// .NET:
// GET /api/StockTransfer
// =========================================================

app.get(
    "/api/stock-transfers",
    async (req, res) => {

        try {

            console.log(
                "========================================"
            );

            console.log(
                "GET ALL STOCK TRANSFERS"
            );

            console.log(
                "Node:",
                "/api/stock-transfers"
            );

            console.log(
                "Backend:",
                `${BASE_URL}/StockTransfer`
            );

            console.log(
                "========================================"
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "Stock Transfer Response:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "========================================"
            );

            console.error(
                "STOCK TRANSFER GET ALL ERROR"
            );

            console.error(
                "Message:",
                error?.message
            );

            console.error(
                "Backend Status:",
                error?.response?.status
            );

            console.error(
                "Backend Response:",
                error?.response?.data
            );

            console.error(
                "========================================"
            );

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER SEARCH
//
// React:
// GET /api/stock-transfers/search?search=ST-001
//
// Node:
// GET /api/stock-transfers/search
//
// .NET:
// GET /api/StockTransfer/search?search=ST-001
// =========================================================

app.get(
    "/api/stock-transfers/search",
    async (req, res) => {

        try {

            const search =
                String(
                    req.query.search || ""
                ).trim();

            console.log(
                "========================================"
            );

            console.log(
                "STOCK TRANSFER SEARCH"
            );

            console.log(
                "Search:",
                search
            );

            console.log(
                "Backend:",
                `${BASE_URL}/StockTransfer/search`
            );

            console.log(
                "========================================"
            );

            // =================================================
            // VALIDATION
            // =================================================

            if (!search) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Search value is required.",
                    });
            }

            // =================================================
            // NODE → .NET
            // =================================================

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/search`,
                    {
                        params: {
                            search: search,
                        },

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "Search Response:",
                response.data
            );

            // =================================================
            // .NET → NODE → REACT
            // =================================================

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "========================================"
            );

            console.error(
                "STOCK TRANSFER SEARCH ERROR"
            );

            console.error(
                "Message:",
                error?.message
            );

            console.error(
                "Backend Status:",
                error?.response?.status
            );

            console.error(
                "Backend Response:",
                error?.response?.data
            );

            console.error(
                "========================================"
            );

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to search stock transfers.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER STATISTICS
//
// React:
// GET /api/stock-transfers/statistics
//
// Node:
// GET /api/stock-transfers/statistics
//
// .NET:
// GET /api/StockTransfer/statistics
// =========================================================

app.get(
    "/api/stock-transfers/statistics",
    async (req, res) => {

        try {

            console.log(
                "========================================"
            );

            console.log(
                "GET STOCK TRANSFER STATISTICS"
            );

            console.log(
                "Node:",
                "/api/stock-transfers/statistics"
            );

            console.log(
                "Backend:",
                `${BASE_URL}/StockTransfer/statistics`
            );

            console.log(
                "========================================"
            );

            // =================================================
            // NODE → .NET API
            // =================================================

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/statistics`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "Statistics Response:",
                response.data
            );

            // =================================================
            // .NET → NODE → REACT
            // =================================================

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "========================================"
            );

            console.error(
                "STOCK TRANSFER STATISTICS ERROR"
            );

            console.error(
                "Message:",
                error?.message
            );

            console.error(
                "Backend Status:",
                error?.response?.status
            );

            console.error(
                "Backend Response:",
                error?.response?.data
            );

            console.error(
                "========================================"
            );

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load stock transfer statistics.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER
// GET BY SELLER
//
// React:
// GET /api/stock-transfers/seller/1
//
// Node:
// GET /api/stock-transfers/seller/1
//
// .NET:
// GET /api/StockTransfer/seller/1
// =========================================================

app.get(
    "/api/stock-transfers/seller/:sellerId",
    async (req, res) => {

        try {

            const {
                sellerId,
            } = req.params;

            const id =
                Number(sellerId);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid seller ID.",
                    });
            }

            console.log(
                "GET STOCK TRANSFERS BY SELLER:",
                id
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/seller/${id}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET BY SELLER Error:",
                error?.response?.data ||
                error?.message
            );

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers by seller.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER
// GET BY PRODUCT
//
// React:
// GET /api/stock-transfers/product/1
//
// Node:
// GET /api/stock-transfers/product/1
//
// .NET:
// GET /api/StockTransfer/product/1
// =========================================================

app.get(
    "/api/stock-transfers/product/:productId",
    async (req, res) => {

        try {

            const {
                productId,
            } = req.params;

            const id =
                Number(productId);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid product ID.",
                    });
            }

            console.log(
                "GET STOCK TRANSFERS BY PRODUCT:",
                id
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/product/${id}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET BY PRODUCT Error:",
                error?.response?.data ||
                error?.message
            );

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers by product.",
                    }
                );
        }
    }
);

// =========================================================
// STOCK TRANSFER ROUTES
//
// React → Node server.js → .NET API
// =========================================================


// =========================================================
// GET ALL STOCK TRANSFERS
//
// React:
// GET http://localhost:5000/api/stock-transfers
//
// .NET:
// GET https://localhost:7203/api/StockTransfer
// =========================================================

app.get(
    "/api/stock-transfers",
    async (req, res) => {

        try {

            console.log(
                "GET /api/stock-transfers"
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET ALL Error:",
                error?.response?.data ||
                error.message
            );

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers.",
                    }
                );
        }
    }
);


// =========================================================
// SEARCH STOCK TRANSFERS
//
// IMPORTANT:
// This route MUST appear before /:stockTransferId
//
// React:
// GET /api/stock-transfers/search?search=ST-001
//
// .NET:
// GET /api/StockTransfer/search?search=ST-001
// =========================================================

app.get(
    "/api/stock-transfers/search",
    async (req, res) => {

        try {

            const search =
                String(
                    req.query.search || ""
                ).trim();

            console.log(
                "STOCK TRANSFER SEARCH:",
                search
            );

            if (!search) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Search value is required.",
                    });
            }

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/search`,
                    {
                        params: {
                            search,
                        },

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer Search Error:",
                error?.response?.data ||
                error.message
            );

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to search stock transfers.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER STATISTICS
//
// IMPORTANT:
// This route MUST appear before /:stockTransferId
//
// React:
// GET /api/stock-transfers/statistics
//
// .NET:
// GET /api/StockTransfer/statistics
// =========================================================

app.get(
    "/api/stock-transfers/statistics",
    async (req, res) => {

        try {

            console.log(
                "GET STOCK TRANSFER STATISTICS"
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/statistics`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "Statistics Response:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer Statistics Error:",
                error?.response?.data ||
                error.message
            );

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load stock transfer statistics.",
                    }
                );
        }
    }
);


// =========================================================
// GET BY SELLER
//
// React:
// GET /api/stock-transfers/seller/5
//
// .NET:
// GET /api/StockTransfer/seller/5
// =========================================================

app.get(
    "/api/stock-transfers/seller/:sellerId",
    async (req, res) => {

        try {

            const sellerId =
                Number(
                    req.params.sellerId
                );

            if (
                !Number.isInteger(sellerId) ||
                sellerId <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid seller ID.",
                    });
            }

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/seller/${sellerId}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET BY SELLER Error:",
                error?.response?.data ||
                error.message
            );

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers by seller.",
                    }
                );
        }
    }
);


// =========================================================
// GET BY PRODUCT
//
// React:
// GET /api/stock-transfers/product/5
//
// .NET:
// GET /api/StockTransfer/product/5
// =========================================================

app.get(
    "/api/stock-transfers/product/:productId",
    async (req, res) => {

        try {

            const productId =
                Number(
                    req.params.productId
                );

            if (
                !Number.isInteger(productId) ||
                productId <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid product ID.",
                    });
            }

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/product/${productId}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET BY PRODUCT Error:",
                error?.response?.data ||
                error.message
            );

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers by product.",
                    }
                );
        }
    }
);


// =========================================================
// GET BY FROM WAREHOUSE
//
// React:
// GET /api/stock-transfers/fromwarehouse/1
//
// .NET:
// GET /api/StockTransfer/fromwarehouse/1
// =========================================================

app.get(
    "/api/stock-transfers/fromwarehouse/:fromWarehouseId",
    async (req, res) => {

        try {

            const fromWarehouseId =
                Number(
                    req.params.fromWarehouseId
                );

            if (
                !Number.isInteger(
                    fromWarehouseId
                ) ||
                fromWarehouseId <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid from warehouse ID.",
                    });
            }

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/fromwarehouse/${fromWarehouseId}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET FROM WAREHOUSE Error:",
                error?.response?.data ||
                error.message
            );

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers from warehouse.",
                    }
                );
        }
    }
);


// =========================================================
// GET BY TO WAREHOUSE
//
// React:
// GET /api/stock-transfers/towarehouse/2
//
// .NET:
// GET /api/StockTransfer/towarehouse/2
// =========================================================

app.get(
    "/api/stock-transfers/towarehouse/:toWarehouseId",
    async (req, res) => {

        try {

            const toWarehouseId =
                Number(
                    req.params.toWarehouseId
                );

            if (
                !Number.isInteger(
                    toWarehouseId
                ) ||
                toWarehouseId <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid to warehouse ID.",
                    });
            }

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/towarehouse/${toWarehouseId}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET TO WAREHOUSE Error:",
                error?.response?.data ||
                error.message
            );

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers to warehouse.",
                    }
                );
        }
    }
);


// =========================================================
// GET BY STATUS
//
// React:
// GET /api/stock-transfers/status/Pending
//
// .NET:
// GET /api/StockTransfer/status/Pending
// =========================================================

app.get(
    "/api/stock-transfers/status/:status",
    async (req, res) => {

        try {

            const status =
                String(
                    req.params.status || ""
                ).trim();

            if (!status) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Status is required.",
                    });
            }

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/status/${encodeURIComponent(status)}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET BY STATUS Error:",
                error?.response?.data ||
                error.message
            );

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers by status.",
                    }
                );
        }
    }
);


// =========================================================
// SORT
//
// React:
// GET /api/stock-transfers/sort?sort=date_desc
//
// .NET:
// GET /api/StockTransfer/sort?sort=date_desc
// =========================================================

app.get(
    "/api/stock-transfers/sort",
    async (req, res) => {

        try {

            const sort =
                String(
                    req.query.sort || ""
                ).trim();

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/sort`,
                    {
                        params: {
                            sort,
                        },

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer SORT Error:",
                error?.response?.data ||
                error.message
            );

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to sort stock transfers.",
                    }
                );
        }
    }
);


// =========================================================
// PAGINATION
//
// React:
// GET /api/stock-transfers/page?page=1&limit=15
//
// .NET:
// GET /api/StockTransfer/page?page=1&limit=15
// =========================================================

app.get(
    "/api/stock-transfers/page",
    async (req, res) => {

        try {

            let page =
                Number(
                    req.query.page || 1
                );

            let limit =
                Number(
                    req.query.limit || 15
                );

            if (
                !Number.isInteger(page) ||
                page < 1
            ) {
                page = 1;
            }

            if (
                !Number.isInteger(limit) ||
                limit < 1
            ) {
                limit = 15;
            }

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/page`,
                    {
                        params: {
                            page,
                            limit,
                        },

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer PAGINATION Error:",
                error?.response?.data ||
                error.message
            );

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load stock transfer page.",
                    }
                );
        }
    }
);


// =========================================================
// GET BY ID
//
// IMPORTANT:
// Keep this AFTER search/statistics/sort/page/filter routes.
//
// React:
// GET /api/stock-transfers/1
//
// .NET:
// GET /api/StockTransfer/1
// =========================================================

app.get(
    "/api/stock-transfers/:stockTransferId",
    async (req, res) => {

        try {

            const id =
                Number(
                    req.params.stockTransferId
                );

            console.log(
                "GET STOCK TRANSFER BY ID:",
                id
            );

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid stock transfer ID.",
                    });
            }

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/${id}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET BY ID Error:",
                error?.response?.data ||
                error.message
            );

            if (
                error?.response?.status === 404
            ) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Stock transfer not found.",
                    });
            }

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load stock transfer.",
                    }
                );
        }
    }
);


// =========================================================
// CREATE
//
// React:
// POST /api/stock-transfers
//
// .NET:
// POST /api/StockTransfer
// =========================================================

app.post(
    "/api/stock-transfers",
    async (req, res) => {

        try {

            console.log(
                "CREATE STOCK TRANSFER"
            );

            console.log(
                "Payload:",
                req.body
            );

            const response =
                await axios.post(
                    `${BASE_URL}/StockTransfer`,
                    req.body,
                    {
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer CREATE Error:",
                error?.response?.data ||
                error.message
            );

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to create stock transfer.",
                    }
                );
        }
    }
);


// =========================================================
// UPDATE
//
// React:
// PUT /api/stock-transfers/1
//
// .NET:
// PUT /api/StockTransfer/1
// =========================================================

app.put(
    "/api/stock-transfers/:stockTransferId",
    async (req, res) => {

        try {

            const id =
                Number(
                    req.params.stockTransferId
                );

            console.log(
                "UPDATE STOCK TRANSFER:",
                id
            );

            console.log(
                "Payload:",
                req.body
            );

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid stock transfer ID.",
                    });
            }

            const response =
                await axios.put(
                    `${BASE_URL}/StockTransfer/${id}`,
                    req.body,
                    {
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(
                    response.data
                );

        } catch (error) {

            console.error(
                "Stock Transfer UPDATE Error:",
                error?.response?.data ||
                error.message
            );

            if (
                error?.response?.status === 404
            ) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Stock transfer not found.",
                    });
            }

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to update stock transfer.",
                    }
                );
        }
    }
);


// =========================================================
// DELETE
//
// React:
// DELETE /api/stock-transfers/1
//
// .NET:
// DELETE /api/StockTransfer/1
// =========================================================

app.delete(
    "/api/stock-transfers/:stockTransferId",
    async (req, res) => {

        try {

            const id =
                Number(
                    req.params.stockTransferId
                );

            console.log(
                "DELETE STOCK TRANSFER:",
                id
            );

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid stock transfer ID.",
                    });
            }

            const response =
                await axios.delete(
                    `${BASE_URL}/StockTransfer/${id}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(
                    response.data
                );

        } catch (error) {

            console.error(
                "Stock Transfer DELETE Error:",
                error?.response?.data ||
                error.message
            );

            if (
                error?.response?.status === 404
            ) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Stock transfer not found.",
                    });
            }

            return res
                .status(
                    error?.response?.status ||
                    500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to delete stock transfer.",
                    }
                );
        }
    }
);

// =========================================================
// STOCK TRANSFER
// GET BY FROM WAREHOUSE
//
// React:
// GET /api/stock-transfers/fromwarehouse/1
//
// Node:
// GET /api/stock-transfers/fromwarehouse/1
//
// .NET:
// GET /api/StockTransfer/fromwarehouse/1
// =========================================================

app.get(
    "/api/stock-transfers/fromwarehouse/:fromWarehouseId",
    async (req, res) => {

        try {

            const {
                fromWarehouseId,
            } = req.params;

            const id =
                Number(fromWarehouseId);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid from warehouse ID.",
                    });
            }

            console.log(
                "GET STOCK TRANSFERS BY FROM WAREHOUSE:",
                id
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/fromwarehouse/${id}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET BY FROM WAREHOUSE Error:",
                error?.response?.data ||
                error?.message
            );

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers by from warehouse.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER
// GET BY TO WAREHOUSE
//
// React:
// GET /api/stock-transfers/towarehouse/1
//
// Node:
// GET /api/stock-transfers/towarehouse/1
//
// .NET:
// GET /api/StockTransfer/towarehouse/1
// =========================================================

app.get(
    "/api/stock-transfers/towarehouse/:toWarehouseId",
    async (req, res) => {

        try {

            const {
                toWarehouseId,
            } = req.params;

            const id =
                Number(toWarehouseId);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid to warehouse ID.",
                    });
            }

            console.log(
                "GET STOCK TRANSFERS BY TO WAREHOUSE:",
                id
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/towarehouse/${id}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET BY TO WAREHOUSE Error:",
                error?.response?.data ||
                error?.message
            );

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers by to warehouse.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER
// GET BY STATUS
//
// React:
// GET /api/stock-transfers/status/Pending
//
// Node:
// GET /api/stock-transfers/status/Pending
//
// .NET:
// GET /api/StockTransfer/status/Pending
// =========================================================

app.get(
    "/api/stock-transfers/status/:status",
    async (req, res) => {

        try {

            const {
                status,
            } = req.params;

            const cleanStatus =
                String(status || "").trim();

            if (!cleanStatus) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Status is required.",
                    });
            }

            console.log(
                "GET STOCK TRANSFERS BY STATUS:",
                cleanStatus
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/status/${encodeURIComponent(cleanStatus)}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer GET BY STATUS Error:",
                error?.response?.data ||
                error?.message
            );

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to get stock transfers by status.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER
// SORT
//
// React:
// GET /api/stock-transfers/sort?sort=date_desc
//
// Node:
// GET /api/stock-transfers/sort?sort=date_desc
//
// .NET:
// GET /api/StockTransfer/sort?sort=date_desc
// =========================================================

app.get(
    "/api/stock-transfers/sort",
    async (req, res) => {

        try {

            const sort =
                String(
                    req.query.sort || ""
                ).trim();

            console.log(
                "STOCK TRANSFER SORT:",
                sort
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/sort`,
                    {
                        params: {
                            sort: sort || undefined,
                        },

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer SORT Error:",
                error?.response?.data ||
                error?.message
            );

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to sort stock transfers.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER
// PAGINATION
//
// React:
// GET /api/stock-transfers/page?page=1&limit=15
//
// Node:
// GET /api/stock-transfers/page?page=1&limit=15
//
// .NET:
// GET /api/StockTransfer/page?page=1&limit=15
// =========================================================

app.get(
    "/api/stock-transfers/page",
    async (req, res) => {

        try {

            let page =
                Number(req.query.page || 1);

            let limit =
                Number(req.query.limit || 15);

            if (
                !Number.isInteger(page) ||
                page < 1
            ) {
                page = 1;
            }

            if (
                !Number.isInteger(limit) ||
                limit < 1
            ) {
                limit = 15;
            }

            console.log(
                "STOCK TRANSFER PAGINATION:",
                {
                    page,
                    limit,
                }
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/page`,
                    {
                        params: {
                            page,
                            limit,
                        },

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Stock Transfer PAGINATION Error:",
                error?.response?.data ||
                error?.message
            );

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load paginated stock transfers.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER
// GET BY ID
//
// IMPORTANT:
// This route is AFTER search/statistics/filter routes.
//
// React:
// GET /api/stock-transfers/1
//
// Node:
// GET /api/stock-transfers/1
//
// .NET:
// GET /api/StockTransfer/1
// =========================================================

app.get(
    "/api/stock-transfers/:stockTransferId",
    async (req, res) => {

        try {

            const {
                stockTransferId,
            } = req.params;

            console.log(
                "========================================"
            );

            console.log(
                "GET STOCK TRANSFER BY ID"
            );

            console.log(
                "ID:",
                stockTransferId
            );

            console.log(
                "Backend URL:",
                `${BASE_URL}/StockTransfer/${stockTransferId}`
            );

            console.log(
                "========================================"
            );

            // =================================================
            // VALIDATE ID
            // =================================================

            const id =
                Number(stockTransferId);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid stock transfer ID.",
                    });
            }

            // =================================================
            // CALL .NET API
            // =================================================

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/${id}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "Backend Response:",
                response.data
            );

            // =================================================
            // RETURN TO REACT
            // =================================================

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "========================================"
            );

            console.error(
                "STOCK TRANSFER GET BY ID ERROR"
            );

            console.error(
                "Message:",
                error?.message
            );

            console.error(
                "Backend Status:",
                error?.response?.status
            );

            console.error(
                "Backend Response:",
                error?.response?.data
            );

            console.error(
                "========================================"
            );

            // =================================================
            // NOT FOUND
            // =================================================

            if (
                error?.response?.status === 404
            ) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Stock transfer not found.",
                    });
            }

            // =================================================
            // BACKEND ERROR
            // =================================================

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load stock transfer.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER
// CREATE
//
// React:
// POST /api/stock-transfers
//
// Node:
// POST /api/stock-transfers
//
// .NET:
// POST /api/StockTransfer
// =========================================================

app.post(
    "/api/stock-transfers",
    async (req, res) => {

        try {

            console.log(
                "========================================"
            );

            console.log(
                "CREATE STOCK TRANSFER"
            );

            console.log(
                "Payload:",
                req.body
            );

            console.log(
                "Backend:",
                `${BASE_URL}/StockTransfer`
            );

            console.log(
                "========================================"
            );

            const response =
                await axios.post(
                    `${BASE_URL}/StockTransfer`,
                    req.body,
                    {
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "Create Response:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "========================================"
            );

            console.error(
                "STOCK TRANSFER CREATE ERROR"
            );

            console.error(
                "Message:",
                error?.message
            );

            console.error(
                "Backend Status:",
                error?.response?.status
            );

            console.error(
                "Backend Response:",
                error?.response?.data
            );

            console.error(
                "========================================"
            );

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to create stock transfer.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER
// UPDATE
//
// React:
// PUT /api/stock-transfers/1
//
// Node:
// PUT /api/stock-transfers/1
//
// .NET:
// PUT /api/StockTransfer/1
// =========================================================

app.put(
    "/api/stock-transfers/:stockTransferId",
    async (req, res) => {

        try {

            const {
                stockTransferId,
            } = req.params;

            const id =
                Number(stockTransferId);

            // =================================================
            // VALIDATE ID
            // =================================================

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid stock transfer ID.",
                    });
            }

            console.log(
                "========================================"
            );

            console.log(
                "UPDATE STOCK TRANSFER"
            );

            console.log(
                "ID:",
                id
            );

            console.log(
                "Payload:",
                req.body
            );

            console.log(
                "Backend:",
                `${BASE_URL}/StockTransfer/${id}`
            );

            console.log(
                "========================================"
            );

            // =================================================
            // NODE → .NET
            // =================================================

            const response =
                await axios.put(
                    `${BASE_URL}/StockTransfer/${id}`,
                    req.body,
                    {
                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "Update Response:",
                response.data
            );

            // =================================================
            // .NET → NODE → REACT
            // =================================================

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "========================================"
            );

            console.error(
                "STOCK TRANSFER UPDATE ERROR"
            );

            console.error(
                "Message:",
                error?.message
            );

            console.error(
                "Backend Status:",
                error?.response?.status
            );

            console.error(
                "Backend Response:",
                error?.response?.data
            );

            console.error(
                "========================================"
            );

            // =================================================
            // NOT FOUND
            // =================================================

            if (
                error?.response?.status === 404
            ) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Stock transfer not found.",
                    });
            }

            // =================================================
            // BACKEND ERROR
            // =================================================

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to update stock transfer.",
                    }
                );
        }
    }
);


// =========================================================
// STOCK TRANSFER
// DELETE
//
// React:
// DELETE /api/stock-transfers/1
//
// Node:
// DELETE /api/stock-transfers/1
//
// .NET:
// DELETE /api/StockTransfer/1
// =========================================================

app.delete(
    "/api/stock-transfers/:stockTransferId",
    async (req, res) => {

        try {

            const {
                stockTransferId,
            } = req.params;

            const id =
                Number(stockTransferId);

            // =================================================
            // VALIDATE ID
            // =================================================

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid stock transfer ID.",
                    });
            }

            console.log(
                "========================================"
            );

            console.log(
                "DELETE STOCK TRANSFER"
            );

            console.log(
                "ID:",
                id
            );

            console.log(
                "Backend:",
                `${BASE_URL}/StockTransfer/${id}`
            );

            console.log(
                "========================================"
            );

            // =================================================
            // NODE → .NET
            // =================================================

            const response =
                await axios.delete(
                    `${BASE_URL}/StockTransfer/${id}`,
                    {
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );

            console.log(
                "Delete Response:",
                response.data
            );

            // =================================================
            // .NET → NODE → REACT
            // =================================================

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "========================================"
            );

            console.error(
                "STOCK TRANSFER DELETE ERROR"
            );

            console.error(
                "Message:",
                error?.message
            );

            console.error(
                "Backend Status:",
                error?.response?.status
            );

            console.error(
                "Backend Response:",
                error?.response?.data
            );

            console.error(
                "========================================"
            );

            // =================================================
            // NOT FOUND
            // =================================================

            if (
                error?.response?.status === 404
            ) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Stock transfer not found.",
                    });
            }

            // =================================================
            // BACKEND ERROR
            // =================================================

            return res
                .status(
                    error?.response?.status || 500
                )
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to delete stock transfer.",
                    }
                );
        }
    }
);
// =========================================================
// SHIPMENT PROXY ROUTES
// =========================================================

app.get("/api/Shipment", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/Shipment`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Shipment Error:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// =========================================================
// GET SHIPMENT BY ID
// GET /api/Shipment/8
// =========================================================

app.get("/api/Shipment/:id", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/Shipment/${req.params.id}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            `GET /api/Shipment/${req.params.id} Error:`,
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// =========================================================
// GET SHIPMENTS BY ORDER
// GET /api/Shipment/order/2
// =========================================================

app.get("/api/Shipment/order/:orderId", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/Shipment/order/${req.params.orderId}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Shipment/order Error:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// =========================================================
// GET SHIPMENTS BY STATUS
// GET /api/Shipment/status/Shipped
// =========================================================

app.get("/api/Shipment/status/:status", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/Shipment/status/${encodeURIComponent(
                req.params.status
            )}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Shipment/status Error:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// =========================================================
// GET SHIPMENT BY TRACKING NUMBER
// GET /api/Shipment/tracking/DLV123456789IN
// =========================================================

app.get("/api/Shipment/tracking/:trackingNumber", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/Shipment/tracking/${encodeURIComponent(
                req.params.trackingNumber
            )}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Shipment/tracking Error:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// =========================================================
// SEARCH SHIPMENTS
// GET /api/Shipment/search?search=Delhivery
// =========================================================

app.get("/api/Shipment/search", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/Shipment/search`,
            {
                params: {
                    search: req.query.search
                },
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Shipment/search Error:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// =========================================================
// SORT SHIPMENTS
// GET /api/Shipment/sort?sort=id_asc
// =========================================================

app.get("/api/Shipment/sort", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/Shipment/sort`,
            {
                params: {
                    sort: req.query.sort
                },
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Shipment/sort Error:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// =========================================================
// PAGINATION
// GET /api/Shipment/page?page=1&limit=15
// =========================================================

app.get("/api/Shipment/page", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/Shipment/page`,
            {
                params: {
                    page: req.query.page || 1,
                    limit: req.query.limit || 15
                },
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Shipment/page Error:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// =========================================================
// STATISTICS
// GET /api/Shipment/statistics
// =========================================================

app.get("/api/Shipment/statistics", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/Shipment/statistics`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/Shipment/statistics Error:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// =========================================================
// CREATE SHIPMENT
// POST /api/Shipment
// =========================================================

app.post("/api/Shipment", async (req, res) => {
    try {

        const response = await axios.post(
            `${DOTNET_API}/Shipment`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "POST /api/Shipment Error:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// =========================================================
// UPDATE SHIPMENT
// PUT /api/Shipment/:id
// =========================================================

app.put("/api/Shipment/:id", async (req, res) => {
    try {

        const response = await axios.put(
            `${DOTNET_API}/Shipment/${req.params.id}`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            `PUT /api/Shipment/${req.params.id} Error:`,
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});


// =========================================================
// DELETE SHIPMENT
// DELETE /api/Shipment/:id
// =========================================================

app.delete("/api/Shipment/:id", async (req, res) => {
    try {

        const response = await axios.delete(
            `${DOTNET_API}/Shipment/${req.params.id}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            `DELETE /api/Shipment/${req.params.id} Error:`,
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: error.message
            }
        );
    }
});

// =========================================================
// WAREHOUSE API
// =========================================================

// GET ALL WAREHOUSES
app.get("/api/warehouse", async (req, res) => {

    try {

        console.log(
            "GET /api/warehouse"
        );


        const response = await axios.get(
            `${DOTNET_API}/Warehouse`,
            {
                httpsAgent
            }
        );


        res.status(
            response.status
        ).json(
            response.data
        );

    }
    catch (error) {

        console.error(
            "GET /api/warehouse ERROR:",
            error.message
        );


        if (error.response) {

            return res.status(
                error.response.status
            ).json(
                error.response.data
            );

        }


        res.status(500).json({

            message:
                "Failed to load warehouses",

            error:
                error.message

        });

    }

});


// =========================================================
// GET WAREHOUSE BY ID
// =========================================================

app.get(
    "/api/warehouse/:id",
    async (req, res) => {

        try {

            const { id } =
                req.params;


            console.log(
                `GET /api/warehouse/${id}`
            );


            const response =
                await axios.get(

                    `${DOTNET_API}/Warehouse/${id}`,

                    {
                        httpsAgent
                    }

                );


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET WAREHOUSE BY ID ERROR:",
                error.message
            );


            if (error.response) {

                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );

            }


            res.status(500).json({

                message:
                    "Failed to get warehouse",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// CREATE WAREHOUSE
// =========================================================

app.post(
    "/api/warehouse",
    async (req, res) => {

        try {

            console.log(
                "POST /api/warehouse"
            );

            console.log(
                "Request Body:",
                req.body
            );


            const response =
                await axios.post(

                    `${DOTNET_API}/Warehouse`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }

                );


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "POST /api/warehouse ERROR:",
                error.message
            );


            if (error.response) {

                console.error(
                    "ASP.NET Response:",
                    error.response.data
                );


                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );

            }


            res.status(500).json({

                message:
                    "Failed to create warehouse",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// UPDATE WAREHOUSE
// =========================================================

app.put(
    "/api/warehouse/:id",
    async (req, res) => {

        try {

            const { id } =
                req.params;


            console.log(
                `PUT /api/warehouse/${id}`
            );

            console.log(
                "Request Body:",
                req.body
            );


            const response =
                await axios.put(

                    `${DOTNET_API}/Warehouse/${id}`,

                    req.body,

                    {
                        httpsAgent,

                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }

                );


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "PUT /api/warehouse ERROR:",
                error.message
            );


            if (error.response) {

                console.error(
                    "ASP.NET Response:",
                    error.response.data
                );


                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );

            }


            res.status(500).json({

                message:
                    "Failed to update warehouse",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// DELETE WAREHOUSE
// =========================================================

app.delete(
    "/api/warehouse/:id",
    async (req, res) => {

        try {

            const { id } =
                req.params;


            console.log(
                `DELETE /api/warehouse/${id}`
            );


            const response =
                await axios.delete(

                    `${DOTNET_API}/Warehouse/${id}`,

                    {
                        httpsAgent
                    }

                );


            // -------------------------------------------------
            // Some DELETE APIs return 204
            // -------------------------------------------------

            if (
                response.status === 204
            ) {

                return res.status(204).send();

            }


            res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "DELETE /api/warehouse ERROR:",
                error.message
            );


            if (error.response) {

                console.error(
                    "ASP.NET Response:",
                    error.response.data
                );


                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );

            }


            res.status(500).json({

                message:
                    "Failed to delete warehouse",

                error:
                    error.message

            });

        }

    }
);


// =========================================================
// STOCK ADJUSTMENT
// =========================================================


// =========================================================
// GET ALL STOCK ADJUSTMENTS
// Frontend:
// GET http://localhost:5000/api/stock-adjustments
//
// Backend:
// GET https://localhost:7203/api/StockAdjustment
// =========================================================

app.get("/api/stock-adjustments", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/StockAdjustment`,
            {
                httpsAgent
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "GET /api/stock-adjustments Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to load stock adjustments"
            }
        );
    }
});


// =========================================================
// SEARCH STOCK ADJUSTMENTS
// Frontend:
// GET /api/stock-adjustments/search?search=value
//
// Backend:
// GET /api/StockAdjustment/search?search=value
// =========================================================

app.get("/api/stock-adjustments/search", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/StockAdjustment/search`,
            {
                params: {
                    search: req.query.search
                },
                httpsAgent
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "GET /api/stock-adjustments/search Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to search stock adjustments"
            }
        );
    }
});


// =========================================================
// SORT STOCK ADJUSTMENTS
// Frontend:
// GET /api/stock-adjustments/sort?sort=quantity
//
// Backend:
// GET /api/StockAdjustment/sort?sort=quantity
// =========================================================

app.get("/api/stock-adjustments/sort", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/StockAdjustment/sort`,
            {
                params: {
                    sort: req.query.sort
                },
                httpsAgent
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "GET /api/stock-adjustments/sort Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to sort stock adjustments"
            }
        );
    }
});


// =========================================================
// PAGINATED STOCK ADJUSTMENTS
// Frontend:
// GET /api/stock-adjustments/page?page=1&limit=15
//
// Backend:
// GET /api/StockAdjustment/page?page=1&limit=15
// =========================================================

app.get("/api/stock-adjustments/page", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/StockAdjustment/page`,
            {
                params: {
                    page: req.query.page || 1,
                    limit: req.query.limit || 15
                },
                httpsAgent
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "GET /api/stock-adjustments/page Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to load paginated stock adjustments"
            }
        );
    }
});


// =========================================================
// STOCK ADJUSTMENT STATISTICS
// Frontend:
// GET /api/stock-adjustments/statistics
//
// Backend:
// GET /api/StockAdjustment/statistics
// =========================================================

app.get("/api/stock-adjustments/statistics", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/StockAdjustment/statistics`,
            {
                httpsAgent
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "GET /api/stock-adjustments/statistics Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to load stock adjustment statistics"
            }
        );
    }
});


// =========================================================
// GET STOCK ADJUSTMENTS BY SELLER
// Frontend:
// GET /api/stock-adjustments/seller/6
//
// Backend:
// GET /api/StockAdjustment/seller/6
// =========================================================

app.get("/api/stock-adjustments/seller/:sellerId", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/StockAdjustment/seller/${req.params.sellerId}`,
            {
                httpsAgent
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "GET /api/stock-adjustments/seller/:sellerId Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to load seller stock adjustments"
            }
        );
    }
});


// =========================================================
// GET STOCK ADJUSTMENTS BY PRODUCT
// Frontend:
// GET /api/stock-adjustments/product/6
//
// Backend:
// GET /api/StockAdjustment/product/6
// =========================================================

app.get("/api/stock-adjustments/product/:productId", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/StockAdjustment/product/${req.params.productId}`,
            {
                httpsAgent
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "GET /api/stock-adjustments/product/:productId Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to load product stock adjustments"
            }
        );
    }
});


// =========================================================
// GET STOCK ADJUSTMENTS BY WAREHOUSE
// Frontend:
// GET /api/stock-adjustments/warehouse/3
//
// Backend:
// GET /api/StockAdjustment/warehouse/3
// =========================================================

app.get("/api/stock-adjustments/warehouse/:warehouseId", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/StockAdjustment/warehouse/${req.params.warehouseId}`,
            {
                httpsAgent
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "GET /api/stock-adjustments/warehouse/:warehouseId Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to load warehouse stock adjustments"
            }
        );
    }
});


// =========================================================
// GET STOCK ADJUSTMENTS BY TYPE
// Frontend:
// GET /api/stock-adjustments/type/Damage
//
// Backend:
// GET /api/StockAdjustment/type/Damage
// =========================================================

app.get("/api/stock-adjustments/type/:adjustmentType", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/StockAdjustment/type/${encodeURIComponent(
                req.params.adjustmentType
            )}`,
            {
                httpsAgent
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "GET /api/stock-adjustments/type/:adjustmentType Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to load stock adjustments by type"
            }
        );
    }
});


// =========================================================
// GET STOCK ADJUSTMENT BY ID
// IMPORTANT:
// Keep this AFTER search, sort, page, statistics,
// seller, product, warehouse and type routes.
//
// Frontend:
// GET /api/stock-adjustments/1
//
// Backend:
// GET /api/StockAdjustment/1
// =========================================================

app.get("/api/stock-adjustments/:id", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/StockAdjustment/${req.params.id}`,
            {
                httpsAgent
            }
        );

        res.json(response.data);

    } catch (error) {

        console.error(
            "GET /api/stock-adjustments/:id Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to load stock adjustment"
            }
        );
    }
});


// =========================================================
// CREATE STOCK ADJUSTMENT
// Frontend:
// POST /api/stock-adjustments
//
// Backend:
// POST /api/StockAdjustment
// =========================================================

app.post("/api/stock-adjustments", async (req, res) => {
    try {

        const response = await axios.post(
            `${DOTNET_API}/StockAdjustment`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "POST /api/stock-adjustments Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to create stock adjustment"
            }
        );
    }
});


// =========================================================
// UPDATE STOCK ADJUSTMENT
// Frontend:
// PUT /api/stock-adjustments/1
//
// Backend:
// PUT /api/StockAdjustment/1
// =========================================================

app.put("/api/stock-adjustments/:id", async (req, res) => {
    try {

        const response = await axios.put(
            `${DOTNET_API}/StockAdjustment/${req.params.id}`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "PUT /api/stock-adjustments/:id Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to update stock adjustment"
            }
        );
    }
});


// =========================================================
// DELETE STOCK ADJUSTMENT
// Frontend:
// DELETE /api/stock-adjustments/1
//
// Backend:
// DELETE /api/StockAdjustment/1
// =========================================================

app.delete("/api/stock-adjustments/:id", async (req, res) => {
    try {

        const response = await axios.delete(
            `${DOTNET_API}/StockAdjustment/${req.params.id}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(
            response.data || {
                message: "Stock adjustment deleted successfully"
            }
        );

    } catch (error) {

        console.error(
            "DELETE /api/stock-adjustments/:id Error:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to delete stock adjustment"
            }
        );
    }
});

// =========================================================
// PRODUCT ATTRIBUTE API PROXY
// server.js
// =========================================================// =========================================================
// GET ALL PRODUCT ATTRIBUTES
//
// GET:
// http://localhost:5000/api/product-attributes/all
// =========================================================

app.get(
    "/api/product-attributes/all",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/product-attributes/all`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET /api/product-attributes/all Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json({
                message:
                    error.response?.data?.message ||
                    "Failed to fetch product attributes.",

                errors:
                    error.response?.data?.errors,

                error: error.message
            });
        }
    }
);


// =========================================================
// GET PRODUCT ATTRIBUTES
//
// GET:
// /api/product-attributes
//
// Supports:
// /api/product-attributesnode 
// /api/product-attributes?search=Color
// /api/product-attributes?sort=name_asc
// /api/product-attributes?page=1&limit=10
// =========================================================

app.get(
    "/api/product-attributes",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/product-attributes`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET /api/product-attributes Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json({
                message:
                    error.response?.data?.message ||
                    "Failed to fetch product attributes.",

                errors:
                    error.response?.data?.errors,

                error: error.message
            });
        }
    }
);


// =========================================================
// GET PRODUCT ATTRIBUTES BY PRODUCT ID
//
// GET:
// /api/product-attributes/product/6
// =========================================================

app.get(
    "/api/product-attributes/product/:productId",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/product-attributes/product/${productId}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET Product Attributes By Product Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json({
                message:
                    error.response?.data?.message ||
                    "Failed to fetch product attributes by product.",

                errors:
                    error.response?.data?.errors,

                error: error.message
            });
        }
    }
);


// =========================================================
// GET PRODUCT ATTRIBUTES BY ATTRIBUTE NAME
//
// GET:
// /api/product-attributes/attribute/Color
// =========================================================

app.get(
    "/api/product-attributes/attribute/:attributeName",
    async (req, res) => {

        try {

            const {
                attributeName
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/product-attributes/attribute/${encodeURIComponent(attributeName)}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET Product Attributes By Name Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json({
                message:
                    error.response?.data?.message ||
                    "Failed to fetch product attributes by name.",

                errors:
                    error.response?.data?.errors,

                error: error.message
            });
        }
    }
);


// =========================================================
// GET PRODUCT ATTRIBUTE STATISTICS
//
// GET:
// /api/product-attributes/stats
// =========================================================

app.get(
    "/api/product-attributes/stats",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/product-attributes/stats`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET Product Attribute Statistics Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json({
                message:
                    error.response?.data?.message ||
                    "Failed to fetch product attribute statistics.",

                errors:
                    error.response?.data?.errors,

                error: error.message
            });
        }
    }
);


// =========================================================
// GET PRODUCT ATTRIBUTE BY ID
//
// GET:
// /api/product-attributes/1
// =========================================================

app.get(
    "/api/product-attributes/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/product-attributes/${id}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET Product Attribute By ID Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json({
                message:
                    error.response?.data?.message ||
                    "Failed to fetch product attribute.",

                errors:
                    error.response?.data?.errors,

                error: error.message
            });
        }
    }
);


// =========================================================
// CREATE PRODUCT ATTRIBUTE
//
// POST:
// /api/product-attributes
// =========================================================

app.post(
    "/api/product-attributes",
    async (req, res) => {

        try {

            const response = await axios.post(
                `${DOTNET_API}/product-attributes`,
                req.body,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "POST /api/product-attributes Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json({
                message:
                    error.response?.data?.message ||
                    "Failed to create product attribute.",

                errors:
                    error.response?.data?.errors,

                error: error.message
            });
        }
    }
);


// =========================================================
// UPDATE PRODUCT ATTRIBUTE
//
// PUT:
// /api/product-attributes/1
// =========================================================

app.put(
    "/api/product-attributes/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            const response = await axios.put(
                `${DOTNET_API}/product-attributes/${id}`,
                req.body,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "PUT Product Attribute Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json({
                message:
                    error.response?.data?.message ||
                    "Failed to update product attribute.",

                errors:
                    error.response?.data?.errors,

                error: error.message
            });
        }
    }
);


// =========================================================
// DELETE PRODUCT ATTRIBUTE
//
// DELETE:
// /api/product-attributes/1
// =========================================================

app.delete(
    "/api/product-attributes/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            const response = await axios.delete(
                `${DOTNET_API}/product-attributes/${id}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "DELETE Product Attribute Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json({
                message:
                    error.response?.data?.message ||
                    "Failed to delete product attribute.",

                errors:
                    error.response?.data?.errors,

                error: error.message
            });
        }
    }
);
// =========================================================
// PRODUCT IMAGE API PROXY
// =========================================================

// GET ALL PRODUCT IMAGES
app.get("/api/product-images/all", async (req, res) => {
    try {
        console.log("GET /api/product-images/all");

        const response = await axios.get(
            `${DOTNET_API}/product-images/all`,
            {
                httpsAgent,
            }
        );

        console.log(
            "ASP.NET Product Images Status:",
            response.status
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/product-images/all Error:",
            error.message
        );

        if (error.response) {
            console.error(
                "ASP.NET Status:",
                error.response.status
            );

            console.error(
                "ASP.NET Response:",
                error.response.data
            );
        }

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to fetch product images"
            }
        );
    }
});


// GET SINGLE PRODUCT IMAGE
app.get("/api/product-images/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log(
            `GET /api/product-images/${id}`
        );

        const response = await axios.get(
            `${DOTNET_API}/ProductImage/${id}`,
            {
                httpsAgent,
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error(
            "GET Product Image Error:",
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to fetch product image"
            }
        );
    }
});


// GET PRODUCT IMAGES BY PRODUCT ID
app.get(
    "/api/product-images/product/:productId",
    async (req, res) => {
        try {
            const { productId } = req.params;

            console.log(
                `GET /api/product-images/product/${productId}`
            );

            const response = await axios.get(
                `${DOTNET_API}/ProductImage/product/${productId}`,
                {
                    httpsAgent,
                }
            );

            res.status(response.status).json(response.data);

        } catch (error) {
            console.error(
                "GET Product Images By Product Error:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message: "Failed to fetch product images"
                }
            );
        }
    }
);


// CREATE PRODUCT IMAGE
app.post("/api/product-images", async (req, res) => {
    try {
        console.log(
            "POST /api/product-images",
            req.body
        );

        const response = await axios.post(
            `${DOTNET_API}/ProductImage`,
            req.body,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                httpsAgent,
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error(
            "POST Product Image Error:",
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to create product image"
            }
        );
    }
});


// UPDATE PRODUCT IMAGE
app.put("/api/product-images/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log(
            `PUT /api/product-images/${id}`,
            req.body
        );

        const response = await axios.put(
            `${DOTNET_API}/ProductImage/${id}`,
            req.body,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                httpsAgent,
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error(
            "PUT Product Image Error:",
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to update product image"
            }
        );
    }
});


// DELETE PRODUCT IMAGE
app.delete("/api/product-images/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log(
            `DELETE /api/product-images/${id}`
        );

        const response = await axios.delete(
            `${DOTNET_API}/ProductImage/${id}`,
            {
                httpsAgent,
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error(
            "DELETE Product Image Error:",
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to delete product image"
            }
        );
    }
});
// =========================================================
// PRODUCT PRICE API PROXY
// =========================================================

// GET ALL PRODUCT PRICES
// GET http://localhost:5000/api/product-prices/all
app.get("/api/product-prices/all", async (req, res) => {
    try {
        const response = await axios.get(
            `${DOTNET_API}/product-prices/all`,
            {
                httpsAgent,
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/product-prices/all Error:",
            error.message
        );

        if (error.response) {
            return res
                .status(error.response.status)
                .json(error.response.data);
        }

        res.status(500).json({
            message: "Failed to fetch all product prices.",
            error: error.message,
        });
    }
});


// =========================================================
// GET PRODUCT PRICES
// =========================================================

// GET http://localhost:5000/api/product-prices
app.get("/api/product-prices", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/product-prices`,
            {
                params: req.query,
                httpsAgent,
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/product-prices Error:",
            error.message
        );

        if (error.response) {
            return res
                .status(error.response.status)
                .json(error.response.data);
        }

        res.status(500).json({
            message: "Failed to fetch product prices.",
            error: error.message,
        });
    }
});


// =========================================================
// GET PAGED PRODUCT PRICES
// =========================================================

// GET http://localhost:5000/api/product-prices/paged?page=1&limit=15
app.get("/api/product-prices/paged", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/product-prices/paged`,
            {
                params: req.query,
                httpsAgent,
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/product-prices/paged Error:",
            error.message
        );

        if (error.response) {
            return res
                .status(error.response.status)
                .json(error.response.data);
        }

        res.status(500).json({
            message: "Failed to fetch paged product prices.",
            error: error.message,
        });
    }
});


// =========================================================
// GET PRODUCT PRICE STATISTICS
// =========================================================

// GET http://localhost:5000/api/product-prices/stats
app.get("/api/product-prices/stats", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/product-prices/stats`,
            {
                httpsAgent,
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/product-prices/stats Error:",
            error.message
        );

        if (error.response) {
            return res
                .status(error.response.status)
                .json(error.response.data);
        }

        res.status(500).json({
            message: "Failed to fetch product price statistics.",
            error: error.message,
        });
    }
});


// =========================================================
// GET PRODUCT PRICES BY PRODUCT ID
// =========================================================

// GET http://localhost:5000/api/product-prices/product/3
app.get("/api/product-prices/product/:productId", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/product-prices/product/${req.params.productId}`,
            {
                httpsAgent,
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/product-prices/product/:productId Error:",
            error.message
        );

        if (error.response) {
            return res
                .status(error.response.status)
                .json(error.response.data);
        }

        res.status(500).json({
            message: "Failed to fetch product prices by product.",
            error: error.message,
        });
    }
});


// =========================================================
// GET PRODUCT PRICE BY ID
// =========================================================

// GET http://localhost:5000/api/product-prices/1
app.get("/api/product-prices/:productPriceId", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/product-prices/${req.params.productPriceId}`,
            {
                httpsAgent,
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "GET /api/product-prices/:productPriceId Error:",
            error.message
        );

        if (error.response) {
            return res
                .status(error.response.status)
                .json(error.response.data);
        }

        res.status(500).json({
            message: "Failed to fetch product price.",
            error: error.message,
        });
    }
});


// =========================================================
// CREATE PRODUCT PRICE
// =========================================================

// POST http://localhost:5000/api/product-prices
app.post("/api/product-prices", async (req, res) => {
    try {

        const response = await axios.post(
            `${DOTNET_API}/product-prices`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "POST /api/product-prices Error:",
            error.message
        );

        if (error.response) {
            return res
                .status(error.response.status)
                .json(error.response.data);
        }

        res.status(500).json({
            message: "Failed to create product price.",
            error: error.message,
        });
    }
});


// =========================================================
// UPDATE PRODUCT PRICE
// =========================================================

// PUT http://localhost:5000/api/product-prices/1
app.put("/api/product-prices/:productPriceId", async (req, res) => {
    try {

        const response = await axios.put(
            `${DOTNET_API}/product-prices/${req.params.productPriceId}`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "PUT /api/product-prices/:productPriceId Error:",
            error.message
        );

        if (error.response) {
            return res
                .status(error.response.status)
                .json(error.response.data);
        }

        res.status(500).json({
            message: "Failed to update product price.",
            error: error.message,
        });
    }
});


// =========================================================
// DELETE PRODUCT PRICE
// =========================================================

// DELETE http://localhost:5000/api/product-prices/1
app.delete("/api/product-prices/:productPriceId", async (req, res) => {
    try {

        const response = await axios.delete(
            `${DOTNET_API}/product-prices/${req.params.productPriceId}`,
            {
                httpsAgent,
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "DELETE /api/product-prices/:productPriceId Error:",
            error.message
        );

        if (error.response) {
            return res
                .status(error.response.status)
                .json(error.response.data);
        }

        res.status(500).json({
            message: "Failed to delete product price.",
            error: error.message,
        });
    }
});


// =========================================================
// PRODUCT INVENTORY
// =========================================================
//
// ASP.NET BASE ROUTE:
//
// /api/product-inventories
//
// React calls:
//
// http://localhost:5000/api/product-inventories
//
// Node forwards to:
//
// https://localhost:7203/api/product-inventories
//
// =========================================================


// =========================================================
// GET ALL / SEARCH / FILTER / SORT / PAGINATION
// =========================================================
//
// GET
// /api/product-inventories
//
// Optional query parameters:
//
// ?search=abc
// ?status=Active
// ?sort=quantity
// ?page=1&limit=10
//
// The ASP.NET controller handles these parameters.
// =========================================================

// ========================================================= // PRODUCT INVENTORY // ========================================================= // ---------------------------------------------------------
 //GET ALL PRODUCT INVENTORIES // GET http://localhost:5000/api/product-inventories/all // --------------------------------------------------------- 
 app.get(
"/api/product-inventories/all", 
async (req, res) => 
{ try 
    
    { 
    const response = await axios.get( `${DOTNET_API}/product-inventories/all`,
    { httpsAgent } ); 
    res.status(response.status).json(response.data); } catch (error) 
    { 
    console.error( "GET /api/product-inventories/all Error:", error.message );
     if (error.response) 
    { 
    return res .status(error.response.status).json(error.response.data); 
    }
     res.status(500).json(
    { message: "Failed to fetch all product inventories.", error: error.message }
    ); 
    }
 }
);

// Frontend: // GET http://localhost:5000/api/product  ---------------------------------------------------------
 app.get("/api/product", async (req, res) => { 
try 
{ 
const response = await axios.get( `${DOTNET_API}/Product`,
 { 
httpsAgent } ); res.status(response.status).json( response.data ); } catch (error) 
{ 
console.error( "GET /api/product Error:", error.message ); 
if (error.response) 
{ 
return res .status(error.response.status).json(error.response.data); 
}
return res.status(500).json(
{ message: "Failed to fetch products.", error: error.message }
); 
}
}
);
app.get(
    "/api/product-inventories",
    async (req, res) => {

        try {

            const response =
                await dotnetClient.get(
                    "/product-inventories",
                    {
                        params: req.query
                    }
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "GET Product Inventories Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load product inventories."
                    }
                );

        }

    }
);


// =========================================================
// GET STATISTICS
// =========================================================
//
// GET
// /api/product-inventories/stats
//
// ASP.NET:
// /api/product-inventories/stats
// =========================================================

app.get(
    "/api/product-inventories/stats",
    async (req, res) => {

        try {

            const response =
                await dotnetClient.get(
                    "/product-inventories/stats"
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "GET Product Inventory Statistics Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load inventory statistics."
                    }
                );

        }

    }
);


// =========================================================
// GET BY ID
// =========================================================
//
// GET
// /api/product-inventories/1
//
// ASP.NET:
// /api/product-inventories/1
// =========================================================

app.get(
    "/api/product-inventories/:productInventoryId",
    async (req, res) => {

        try {

            const {
                productInventoryId
            } = req.params;


            const response =
                await dotnetClient.get(
                    `/product-inventories/${productInventoryId}`
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "GET Product Inventory By ID Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Product inventory not found."
                    }
                );

        }

    }
);


// =========================================================
// GET BY PRODUCT
// =========================================================
//
// GET
// /api/product-inventories/product/1
// =========================================================

app.get(
    "/api/product-inventories/product/:productId",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;


            const response =
                await dotnetClient.get(
                    `/product-inventories/product/${productId}`
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "GET Inventory By Product Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load product inventory."
                    }
                );

        }

    }
);


// =========================================================
// GET BY PRODUCT IDS
// =========================================================
//
// POST
// /api/product-inventories/products
//
// Body:
//
// [
//     1,
//     2,
//     3
// ]
// =========================================================

app.post(
    "/api/product-inventories/products",
    async (req, res) => {

        try {

            const response =
                await dotnetClient.post(
                    "/product-inventories/products",
                    req.body
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "POST Product IDs Inventory Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load product inventories."
                    }
                );

        }

    }
);


// =========================================================
// GET BY SELLER
// =========================================================
//
// GET
// /api/product-inventories/seller/6
// =========================================================

app.get(
    "/api/product-inventories/seller/:sellerId",
    async (req, res) => {

        try {

            const {
                sellerId
            } = req.params;


            const response =
                await dotnetClient.get(
                    `/product-inventories/seller/${sellerId}`
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "GET Inventory By Seller Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load seller inventory."
                    }
                );

        }

    }
);


// =========================================================
// GET BY WAREHOUSE
// =========================================================
//
// GET
// /api/product-inventories/warehouse/3
// =========================================================

app.get(
    "/api/product-inventories/warehouse/:warehouseId",
    async (req, res) => {

        try {

            const {
                warehouseId
            } = req.params;


            const response =
                await dotnetClient.get(
                    `/product-inventories/warehouse/${warehouseId}`
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "GET Inventory By Warehouse Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load warehouse inventory."
                    }
                );

        }

    }
);


// =========================================================
// GET BY SELLER + CUSTOMER
// =========================================================
//
// GET
// /api/product-inventories/seller/6/customer/3
// =========================================================

app.get(
    "/api/product-inventories/seller/:sellerId/customer/:customerId",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.params;


            const response =
                await dotnetClient.get(
                    `/product-inventories/seller/${sellerId}/customer/${customerId}`
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "GET Inventory By Seller + Customer Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load seller customer inventory."
                    }
                );

        }

    }
);


// =========================================================
// GET SPECIFIC INVENTORY
// =========================================================
//
// GET
//
// /api/product-inventories/inventory
//
// Query:
//
// ?productId=1
// &warehouseId=3
// &locationId=2
//
// =========================================================

app.get(
    "/api/product-inventories/inventory",
    async (req, res) => {

        try {

            const response =
                await dotnetClient.get(
                    "/product-inventories/inventory",
                    {
                        params: {
                            productId:
                                req.query.productId,

                            warehouseId:
                                req.query.warehouseId,

                            locationId:
                                req.query.locationId
                        }
                    }
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "GET Specific Inventory Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Product inventory not found."
                    }
                );

        }

    }
);


// =========================================================
// CREATE PRODUCT INVENTORY
// =========================================================
//
// POST
// /api/product-inventories
//
// Body:
//
// {
//     "productId": 1,
//     "sellerId": 6,
//     "warehouseId": 3,
//     ...
// }
// =========================================================

app.post(
    "/api/product-inventories",
    async (req, res) => {

        try {

            console.log(
                "CREATE Product Inventory:"
            );

            console.log(
                req.body
            );


            const response =
                await dotnetClient.post(
                    "/product-inventories",
                    req.body
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "POST Product Inventory Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to create product inventory."
                    }
                );

        }

    }
);


// =========================================================
// UPDATE PRODUCT INVENTORY
// =========================================================
//
// PUT
// /api/product-inventories/1
//
// Body:
//
// {
//     ...
// }
// =========================================================

app.put(
    "/api/product-inventories/:productInventoryId",
    async (req, res) => {

        try {

            const {
                productInventoryId
            } = req.params;


            console.log(
                "UPDATE Product Inventory:",
                productInventoryId
            );


            console.log(
                req.body
            );


            const response =
                await dotnetClient.put(
                    `/product-inventories/${productInventoryId}`,
                    req.body
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "PUT Product Inventory Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to update product inventory."
                    }
                );

        }

    }
);


// =========================================================
// DELETE PRODUCT INVENTORY
// =========================================================
//
// DELETE
// /api/product-inventories/1
// =========================================================

app.delete(
    "/api/product-inventories/:productInventoryId",
    async (req, res) => {

        try {

            const {
                productInventoryId
            } = req.params;


            console.log(
                "DELETE Product Inventory:",
                productInventoryId
            );


            const response =
                await dotnetClient.delete(
                    `/product-inventories/${productInventoryId}`
                );


            return res
                .status(response.status)
                .json(response.data);

        }

        catch (error) {

            console.error(
                "DELETE Product Inventory Error:",
                error.response?.data ||
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to delete product inventory."
                    }
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
                `ROUTE NOT FOUND: ${req.method} ${req.originalUrl}`

        });

    }
);


// =========================================================
// GLOBAL ERROR HANDLER
// =========================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            err
        );


        res.status(500).json({

            success: false,

            message:
                "Internal server error.",

            error:
                err.message

        });

    }
);

// =========================================================
// CUSTOMER RETURN ROUTES
// React -> Node server.js -> ASP.NET Core
// =========================================================

// ASP.NET Core API
const ASPNET_URL = "https://localhost:7203";

// =========================================================
// GET ALL CUSTOMER RETURNS
// =========================================================
// React:
// GET http://localhost:5000/api/customer-returns
//
// ASP.NET:
// GET https://localhost:7203/api/CustomerReturn
// =========================================================

app.get(
    "/api/customer-returns",
    async (req, res) => {

        try {

            console.log(
                "GET /api/customer-returns"
            );

            const response = await axios.get(
                `${ASPNET_URL}/api/CustomerReturn`,
                {
                    httpsAgent,
                    timeout: 30000,
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "Get Customer Returns Error:",
                error.message
            );

            console.error(
                "ASP.NET Response:",
                error.response?.data
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json({
                    message:
                        error.response?.data?.message ||
                        "Unable to load customer returns.",
                    error:
                        error.message,
                });

        }

    }
);


// =========================================================
// GET CUSTOMER RETURN BY ID
// =========================================================
// React:
// GET /api/customer-returns/1
//
// ASP.NET:
// GET /api/CustomerReturn/1
// =========================================================

app.get(
    "/api/customer-returns/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            console.log(
                "GET Customer Return:",
                id
            );

            const response = await axios.get(
                `${ASPNET_URL}/api/CustomerReturn/${id}`,
                {
                    httpsAgent,
                    timeout: 30000,
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "Get Customer Return By ID Error:",
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json({
                    message:
                        error.response?.data?.message ||
                        "Customer return not found.",
                    error:
                        error.message,
                });

        }

    }
);


// =========================================================
// GET RETURNS BY SALES INVOICE
// =========================================================
// React:
// GET /api/customer-returns/invoice/10
//
// ASP.NET:
// GET /api/CustomerReturn/invoice/10
// =========================================================

app.get(
    "/api/customer-returns/invoice/:salesInvoiceId",
    async (req, res) => {

        try {

            const {
                salesInvoiceId
            } = req.params;

            console.log(
                "Get Returns By Sales Invoice:",
                salesInvoiceId
            );

            const response = await axios.get(
                `${ASPNET_URL}/api/CustomerReturn/invoice/${salesInvoiceId}`,
                {
                    httpsAgent,
                    timeout: 30000,
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "Get Returns By Invoice Error:",
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json({
                    message:
                        error.response?.data?.message ||
                        "Unable to load returns for this invoice.",
                    error:
                        error.message,
                });

        }

    }
);


// =========================================================
// GET RETURNS BY PRODUCT
// =========================================================
// React:
// GET /api/customer-returns/product/5
//
// ASP.NET:
// GET /api/CustomerReturn/product/5
// =========================================================

app.get(
    "/api/customer-returns/product/:productId",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            console.log(
                "Get Returns By Product:",
                productId
            );

            const response = await axios.get(
                `${ASPNET_URL}/api/CustomerReturn/product/${productId}`,
                {
                    httpsAgent,
                    timeout: 30000,
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "Get Returns By Product Error:",
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json({
                    message:
                        error.response?.data?.message ||
                        "Unable to load returns for this product.",
                    error:
                        error.message,
                });

        }

    }
);


// =========================================================
// GET RETURNS BY STATUS
// =========================================================
// React:
// GET /api/customer-returns/status/Pending
//
// ASP.NET:
// GET /api/CustomerReturn/status/Pending
// =========================================================

app.get(
    "/api/customer-returns/status/:status",
    async (req, res) => {

        try {

            const {
                status
            } = req.params;

            console.log(
                "Get Returns By Status:",
                status
            );

            const response = await axios.get(
                `${ASPNET_URL}/api/CustomerReturn/status/${encodeURIComponent(status)}`,
                {
                    httpsAgent,
                    timeout: 30000,
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "Get Returns By Status Error:",
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json({
                    message:
                        error.response?.data?.message ||
                        "Unable to load returns by status.",
                    error:
                        error.message,
                });

        }

    }
);


// =========================================================
// GET RETURN BY RETURN NUMBER
// =========================================================
// React:
// GET /api/customer-returns/number/RET-001
//
// ASP.NET:
// GET /api/CustomerReturn/number/RET-001
// =========================================================

app.get(
    "/api/customer-returns/number/:returnNumber",
    async (req, res) => {

        try {

            const {
                returnNumber
            } = req.params;

            console.log(
                "Get Return By Number:",
                returnNumber
            );

            const response = await axios.get(
                `${ASPNET_URL}/api/CustomerReturn/number/${encodeURIComponent(returnNumber)}`,
                {
                    httpsAgent,
                    timeout: 30000,
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "Get Return By Number Error:",
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json({
                    message:
                        error.response?.data?.message ||
                        "Customer return not found.",
                    error:
                        error.message,
                });

        }

    }
);


// =========================================================
// CREATE CUSTOMER RETURN
// =========================================================
// React:
// POST /api/customer-returns
//
// ASP.NET:
// POST /api/CustomerReturn
// =========================================================

app.post(
    "/api/customer-returns",
    async (req, res) => {

        try {

            console.log(
                "Create Customer Return:"
            );

            console.log(
                req.body
            );

            const response = await axios.post(

                `${ASPNET_URL}/api/CustomerReturn`,

                req.body,

                {
                    httpsAgent,

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    timeout: 30000,
                }

            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "Create Customer Return Error:",
                error.message
            );

            console.error(
                "ASP.NET Response:",
                error.response?.data
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json({
                    message:
                        error.response?.data?.message ||
                        "Unable to create customer return.",
                    error:
                        error.message,
                });

        }

    }
);


// =========================================================
// UPDATE CUSTOMER RETURN
// =========================================================
// React:
// PUT /api/customer-returns/1
//
// ASP.NET:
// PUT /api/CustomerReturn/1
// =========================================================

app.put(
    "/api/customer-returns/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            console.log(
                "Update Customer Return:",
                id
            );

            console.log(
                "Payload:",
                req.body
            );

            const response = await axios.put(

                `${ASPNET_URL}/api/CustomerReturn/${id}`,

                req.body,

                {
                    httpsAgent,

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    timeout: 30000,
                }

            );

            // ASP.NET returns Ok()
            return res
                .status(response.status)
                .json(
                    response.data || {
                        success: true,
                        message:
                            "Customer return updated successfully."
                    }
                );

        }
        catch (error) {

            console.error(
                "Update Customer Return Error:",
                error.message
            );

            console.error(
                "ASP.NET Response:",
                error.response?.data
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json({
                    message:
                        error.response?.data?.message ||
                        "Unable to update customer return.",
                    error:
                        error.message,
                });

        }

    }
);


// =========================================================
// DELETE CUSTOMER RETURN
// =========================================================
// React:
// DELETE /api/customer-returns/1
//
// ASP.NET:
// DELETE /api/CustomerReturn/1
// =========================================================

app.delete(
    "/api/customer-returns/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            console.log(
                "Delete Customer Return:",
                id
            );

            const response = await axios.delete(

                `${ASPNET_URL}/api/CustomerReturn/${id}`,

                {
                    httpsAgent,
                    timeout: 30000,
                }

            );

            return res
                .status(response.status)
                .json(
                    response.data || {
                        success: true,
                        message:
                            "Customer return deleted successfully."
                    }
                );

        }
        catch (error) {

            console.error(
                "Delete Customer Return Error:",
                error.message
            );

            console.error(
                "ASP.NET Response:",
                error.response?.data
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json({
                    message:
                        error.response?.data?.message ||
                        "Unable to delete customer return.",
                    error:
                        error.message,
                });

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
