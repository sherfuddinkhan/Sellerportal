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
// GET ALL PRODUCTS
// ASP.NET:
// GET /api/products
// =========================================================

app.get(
    "/api/products",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                "GET ALL PRODUCTS"
            );
        }
    }
);


// =========================================================
// GET PRODUCT BY ID
// ASP.NET:
// GET /api/products/{id}
// =========================================================

app.get(
    "/api/products/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/${encodeURIComponent(id)}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
// GET PRODUCT BY SKU
// ASP.NET:
// GET /api/products/sku/{sku}
// =========================================================

app.get(
    "/api/products/sku/:sku",
    async (req, res) => {

        const { sku } = req.params;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/sku/${encodeURIComponent(sku)}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                `GET PRODUCT BY SKU ${sku}`
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY SELLER
// ASP.NET:
// GET /api/products/seller/{sellerId}
// =========================================================

app.get(
    "/api/products/seller/:sellerId",
    async (req, res) => {

        const { sellerId } = req.params;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/seller/${encodeURIComponent(sellerId)}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                `GET PRODUCTS BY SELLER ${sellerId}`
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY CUSTOMER
// ASP.NET:
// GET /api/products/customer/{customerId}
// =========================================================

app.get(
    "/api/products/customer/:customerId",
    async (req, res) => {

        const { customerId } = req.params;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/customer/${encodeURIComponent(customerId)}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                `GET PRODUCTS BY CUSTOMER ${customerId}`
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY SELLER + CUSTOMER
// ASP.NET:
// GET /api/products/seller/{sellerId}/customer/{customerId}
// =========================================================

app.get(
    "/api/products/seller/:sellerId/customer/:customerId",
    async (req, res) => {

        const {
            sellerId,
            customerId
        } = req.params;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/seller/${encodeURIComponent(sellerId)}/customer/${encodeURIComponent(customerId)}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                `GET PRODUCTS SELLER ${sellerId} CUSTOMER ${customerId}`
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY BRAND
// ASP.NET:
// GET /api/products/brand/{brandId}
// =========================================================

app.get(
    "/api/products/brand/:brandId",
    async (req, res) => {

        const { brandId } = req.params;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/brand/${encodeURIComponent(brandId)}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                `GET PRODUCTS BY BRAND ${brandId}`
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY CATEGORY
// ASP.NET:
// GET /api/products/category/{categoryId}
// =========================================================

app.get(
    "/api/products/category/:categoryId",
    async (req, res) => {

        const { categoryId } = req.params;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/category/${encodeURIComponent(categoryId)}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                `GET PRODUCTS BY CATEGORY ${categoryId}`
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY PRODUCT TYPE
// ASP.NET:
// GET /api/products/product-type/{productTypeId}
// =========================================================

app.get(
    "/api/products/product-type/:productTypeId",
    async (req, res) => {

        const { productTypeId } = req.params;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/product-type/${encodeURIComponent(productTypeId)}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                `GET PRODUCTS BY PRODUCT TYPE ${productTypeId}`
            );
        }
    }
);


// =========================================================
// GET PRODUCTS BY STATUS
// ASP.NET:
// GET /api/products/status/{status}
// =========================================================

app.get(
    "/api/products/status/:status",
    async (req, res) => {

        const { status } = req.params;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/status/${encodeURIComponent(status)}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                `GET PRODUCTS BY STATUS ${status}`
            );
        }
    }
);


// =========================================================
// SEARCH PRODUCTS
// ASP.NET:
// GET /api/products/search?search=phone
// =========================================================

app.get(
    "/api/products/search",
    async (req, res) => {

        const { search } = req.query;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/search`,
                    {
                        params: {
                            search
                        },

                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
// PRODUCT STATISTICS
// ASP.NET:
// GET /api/products/stats
// =========================================================

app.get(
    "/api/products/stats",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/stats`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                "GET PRODUCT STATISTICS"
            );
        }
    }
);


// =========================================================
// PAGED PRODUCTS
// ASP.NET:
// GET /api/products/paged?page=1&limit=15
// =========================================================

app.get(
    "/api/products/paged",
    async (req, res) => {

        const {
            page = 1,
            limit = 15
        } = req.query;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/paged`,
                    {
                        params: {
                            page,
                            limit
                        },

                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                "GET PAGED PRODUCTS"
            );
        }
    }
);


// =========================================================
// SORT PRODUCTS
// ASP.NET:
// GET /api/products/sorted?sort=name_asc
// =========================================================

app.get(
    "/api/products/sorted",
    async (req, res) => {

        const { sort } = req.query;

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/products/sorted`,
                    {
                        params: {
                            sort
                        },

                        httpsAgent,

                        headers: {
                            Accept: "application/json"
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
                "GET SORTED PRODUCTS"
            );
        }
    }
);


// =========================================================
// CREATE PRODUCT
// ASP.NET:
// POST /api/products
// =========================================================

app.post(
    "/api/products",
    async (req, res) => {

        try {

            const response =
                await axios.post(
                    `${DOTNET_API}/products`,
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
                "CREATE PRODUCT"
            );
        }
    }
);


// =========================================================
// UPDATE PRODUCT
// ASP.NET:
// PUT /api/products/{id}
// =========================================================

app.put(
    "/api/products/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.put(
                    `${DOTNET_API}/products/${encodeURIComponent(id)}`,
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
                `UPDATE PRODUCT ${id}`
            );
        }
    }
);


// =========================================================
// DELETE PRODUCT
// ASP.NET:
// DELETE /api/products/{id}
// =========================================================

app.delete(
    "/api/products/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            const response =
                await axios.delete(
                    `${DOTNET_API}/products/${encodeURIComponent(id)}`,
                    {
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
                `DELETE PRODUCT ${id}`
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
// =====================================================
// CATEGORY FILTER
// =====================================================

app.get(
    "/api/categories/filter",
    async (req, res) => {

        try {

            const status =
                req.query.status || "All";

            console.log(
                "CATEGORY FILTER:",
                status
            );

            const response =
                await axios.get(
                    `${DOTNET_API}/categories`,
                    {
                        headers: {
                            Accept: "*/*"
                        },
                        httpsAgent,
                        timeout: 30000
                    }
                );

            const categories =
                response.data?.items || [];

            let filteredCategories =
                categories;

            if (status === "Active") {

                filteredCategories =
                    categories.filter(
                        category =>
                            category.isActive === true
                    );

            }
            else if (status === "Inactive") {

                filteredCategories =
                    categories.filter(
                        category =>
                            category.isActive === false
                    );

            }

            console.log(
                "FILTERED CATEGORIES:",
                filteredCategories
            );

            res.status(200).json({

                items:
                    filteredCategories,

                page: 1,

                limit:
                    filteredCategories.length,

                totalItems:
                    filteredCategories.length,

                totalPages:
                    filteredCategories.length > 0
                        ? 1
                        : 0

            });

        }
        catch (error) {

            console.error(
                "CATEGORY FILTER ERROR:",
                error
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to filter categories"
                }
            );

        }

    }
);


// =====================================================
// GET CATEGORY BY ID
// IMPORTANT: KEEP THIS AFTER /filter
// =====================================================

app.get(
    "/api/categories/:id",
    async (req, res) => {

        try {

            const { id } =
                req.params;

            console.log(
                "GET CATEGORY:",
                id
            );

            const response =
                await axios.get(
                    `${DOTNET_API}/categories/${id}`,
                    {
                        headers: {
                            Accept: "*/*"
                        },

                        httpsAgent,

                        timeout: 30000
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
                "GET CATEGORY ERROR:",
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch category"
                }
            );

        }

    }
);
// =========================================================
// CATEGORY SEARCH
// =========================================================
// React:
// GET http://localhost:5000/api/categories/search?search=Consumer%20Electronics
//
// Node forwards to:
// GET https://localhost:7203/api/categories/search?search=Consumer%20Electronics
// =========================================================

app.get("/api/categories/search", async (req, res) => {

    try {

        const { search } = req.query;

        if (!search || !search.trim()) {

            return res.status(400).json({
                message: "Search term is required."
            });

        }

        const response = await axios.get(
            `${DOTNET_API}/api/categories/search`,
            {
                params: {
                    search: search
                },

                httpsAgent,

                headers: {
                    Accept: "*/*"
                }
            }
        );

        return res.status(response.status).json(
            response.data
        );

    } catch (error) {

        console.error(
            "CATEGORY SEARCH PROXY ERROR:"
        );

        console.error(
            error.response?.data ||
            error.message
        );

        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Unable to search categories."
            }
        );
    }
});

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
// SALES ORDER STATISTICS
// GET /api/SalesOrder/stats
// =========================================================

app.get(
    "/api/SalesOrder/stats",
    async (req, res) => {

        console.log(
            "\n========================================"
        );

        console.log(
            "GET SALES ORDER STATISTICS"
        );

        console.log(
            "========================================"
        );


        try {

            // =============================================
            // CALL ASP.NET CORE API
            // =============================================

            const response =
                await axios.get(
                    `${DOTNET_API}/SalesOrder/stats`,
                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            // =============================================
            // LOG RESPONSE
            // =============================================

            console.log(
                "ASP.NET Status:",
                response.status
            );


            console.log(
                "ASP.NET Response:",
                response.data
            );


            // =============================================
            // RETURN RESPONSE TO REACT
            // =============================================

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "\n========================================"
            );

            console.error(
                "SALES ORDER STATISTICS ERROR"
            );

            console.error(
                "========================================"
            );


            console.error(
                "Status:",
                error.response?.status
            );


            console.error(
                "Response:",
                error.response?.data
            );


            console.error(
                "Message:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load sales order statistics.",
                    }
                );

        }

    }
);

// =========================================================
// GET SALES ORDERS BY SELLER
// =========================================================

// =========================================================
// SALES ORDER - GET ALL BY SELLER
// =========================================================

app.get("/api/SalesOrder/seller/:sellerId", async (req, res) => {
    try {

        const { sellerId } = req.params;

        const response = await axios.get(
            `${DOTNET_API}/SalesOrder/seller/${sellerId}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(
            response.data
        );

    }
    catch (error) {

        console.error(
            "Sales Order Seller API Error:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message:
                    "Failed to load Sales Orders."
            }
        );

    }
});


// =========================================================
// SALES ORDER - SEARCH
// =========================================================

app.get("/api/SalesOrder/search", async (req, res) => {
    try {

        const {
            sellerId,
            search
        } = req.query;


        if (!sellerId) {

            return res.status(400).json({
                message:
                    "sellerId is required."
            });

        }


        if (!search || !search.trim()) {

            return res.status(400).json({
                message:
                    "search is required."
            });

        }


        console.log(
            "Sales Order Search:",
            {
                sellerId,
                search
            }
        );


        const response = await axios.get(
            `${DOTNET_API}/SalesOrder/search`,
            {
                params: {
                    sellerId,
                    search
                },

                httpsAgent,

                headers: {
                    Accept:
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
            "Sales Order Search API Error:",
            error.response?.data ||
            error.message
        );


        res.status(
            error.response?.status ||
            500
        ).json(
            error.response?.data || {
                message:
                    "Failed to search Sales Orders."
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
// =========================================================
// CREATE SALES ORDER ITEM
// POST /api/sales-order-items
// =========================================================

app.post("/api/sales-order-items", async (req, res) => {

    try {

        console.log(
            "CREATE SALES ORDER ITEM:",
            req.body
        );

        const response = await axios.post(
            `${DOTNET_API}/sales-order-items`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );

        return res.status(
            response.status || 201
        ).json(
            response.data
        );

    } catch (error) {

        console.error(
            "CREATE SALES ORDER ITEM ERROR:",
            error.response?.status,
            error.response?.data ||
            error.message
        );

        return res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to create sales order item"
            }
        );

    }

});


// =========================================================
// UPDATE SALES ORDER ITEM
// PUT /api/sales-order-items/:id
// =========================================================

// =========================================================
// UPDATE SALES ORDER ITEM
// PUT /api/sales-order-items/:id
// =========================================================

// =========================================================
// UPDATE SALES ORDER
// PUT /api/SalesOrder/:id
// =========================================================

// =========================================================
// UPDATE SALES ORDER
// PUT /api/SalesOrder/:id
// =========================================================

// =========================================================
// UPDATE SALES ORDER
// PUT /api/SalesOrder/:id
// =========================================================

app.put("/api/SalesOrder/:id", async (req, res) => {

    try {

        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid Sales Order ID"
            });
        }

        console.log("================================================");
        console.log(`PUT /api/SalesOrder/${id}`);
        console.log("BODY:", req.body);
        console.log("================================================");

        const response = await axios.put(
            `${DOTNET_API}/SalesOrder/${id}`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );

        return res.status(
            response.status || 200
        ).json(response.data);

    } catch (error) {

        console.error(
            "UPDATE SALES ORDER ERROR:"
        );

        console.error(
            "Status:",
            error.response?.status
        );

        console.error(
            "Response:",
            error.response?.data
        );

        console.error(
            "Message:",
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
// =========================================================
// SALES ORDER ITEMS - STATISTICS
// =========================================================

app.get("/api/sales-order-items/stats", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/sales-order-items/stats`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {

        console.error(
            "Sales Order Item Statistics Error:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json({
            message:
                error.response?.data?.message ||
                "Failed to load sales order item statistics"
        });

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




// =========================================================
// REVIEWS
// GET ALL
// =========================================================
// React:
// GET http://localhost:5000/api/reviews
//
// ASP.NET:
// GET https://localhost:7203/api/reviews
// =========================================================

app.get("/api/reviews", async (req, res) => {

    try {

        console.log("========================================");
        console.log("GET ALL REVIEWS");
        console.log("========================================");

        const response = await axios.get(
            `${DOTNET_API}/reviews`,
            {
                httpsAgent,
                headers: {
                    Accept: "application/json"
                }
            }
        );

        console.log(
            "REVIEWS RESPONSE:",
            response.data
        );

        return res
            .status(response.status)
            .json(response.data);

    } catch (error) {

        console.error("========================================");
        console.error("GET REVIEWS ERROR");
        console.error(
            "STATUS:",
            error.response?.status
        );
        console.error(
            "DATA:",
            error.response?.data
        );
        console.error(
            "MESSAGE:",
            error.message
        );
        console.error("========================================");

        return res
            .status(error.response?.status || 500)
            .json(
                error.response?.data || {
                    message: error.message
                }
            );
    }
});
// =========================================================
// REVIEW - APPROVE
// PUT /api/reviews/6/approve
// =========================================================

app.put("/api/reviews/:id/approve", async (req, res) => {

    try {

        const { id } = req.params;

        console.log("========================================");
        console.log("APPROVE REVIEW:", id);
        console.log("========================================");

        const response = await axios.put(
            `${DOTNET_API}/reviews/${Number(id)}/approve`,
            {},
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );

        console.log(
            "APPROVE REVIEW RESPONSE:",
            response.data
        );

        return res
            .status(response.status)
            .json(response.data);

    } catch (error) {

        console.error("========================================");
        console.error("APPROVE REVIEW ERROR");
        console.error("STATUS:", error.response?.status);
        console.error("DATA:", error.response?.data);
        console.error("MESSAGE:", error.message);
        console.error("========================================");

        return res
            .status(error.response?.status || 500)
            .json(
                error.response?.data || {
                    message: error.message
                }
            );
    }
});
// =========================================================
// REVIEW - REJECT
// =========================================================

app.put("/api/reviews/:id/reject", async (req, res) => {

    try {

        const id = Number(req.params.id);

        console.log("========================================");
        console.log("PUT /api/reviews/:id/reject");
        console.log("Review ID:", id);
        console.log("========================================");

        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                message: "Invalid review ID."
            });

        }

        const response = await axios.put(
            `${DOTNET_API}/reviews/${id}/reject`,
            {},
            {
                httpsAgent: httpsAgent,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );

        console.log(
            "ASP.NET REJECT RESPONSE:",
            response.data
        );

        return res
            .status(response.status)
            .json(response.data);

    } catch (error) {

        console.error("========================================");
        console.error("REJECT REVIEW ERROR");
        console.error("STATUS:", error.response?.status);
        console.error("DATA:", error.response?.data);
        console.error("MESSAGE:", error.message);
        console.error("========================================");

        return res
            .status(error.response?.status || 500)
            .json(
                error.response?.data || {
                    message: error.message
                }
            );
    }
});

// =========================================================
// GET FILTERED REVIEWS
// GET /api/reviews/filter
// =========================================================

app.get("/api/reviews/filter", async (req, res) => {

    try {

        console.log("================================================");
        console.log("GET /api/reviews/filter");
        console.log("QUERY:", req.query);
        console.log("================================================");

        const response = await axios.get(
            `${DOTNET_API}/reviews/filter`,
            {
                params: req.query,

                httpsAgent,

                headers: {
                    Accept: "application/json"
                }
            }
        );

        console.log("================================================");
        console.log("GET FILTERED REVIEWS RESPONSE");
        console.log("STATUS:", response.status);
        console.log("DATA:", response.data);
        console.log("================================================");

        return res
            .status(response.status)
            .json(response.data);

    } catch (error) {

        console.error("================================================");
        console.error("GET FILTERED REVIEWS ERROR");
        console.error("STATUS:", error.response?.status);
        console.error("DATA:", error.response?.data);
        console.error("MESSAGE:", error.message);
        console.error("================================================");

        return res
            .status(error.response?.status || 500)
            .json(
                error.response?.data || {
                    message: error.message
                }
            );
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



// ================================================================
// PURCHASE ORDER APIs
// ================================================================

const PURCHASE_ORDER_API =
    `${DOTNET_API}/purchase-orders`;


// ================================================================
// 1. GET ALL PURCHASE ORDERS
// GET /api/purchase-orders
// ================================================================

app.get(
    "/api/purchase-orders",
    async (req, res) => {

        console.log(
            "================================================"
        );

        console.log(
            "GET ALL PURCHASE ORDERS"
        );

        console.log(
            "================================================"
        );

        try {

            const response =
                await axios.get(
                    PURCHASE_ORDER_API,
                    {
                        httpsAgent,
                        timeout: 30000
                    }
                );

            console.log(
                "GET ALL PURCHASE ORDERS SUCCESS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET ALL PURCHASE ORDERS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to fetch purchase orders."
                    }
                );

        }

    }
);


// ================================================================
// 2. GET PURCHASE ORDER BY ID
// GET /api/purchase-orders/:id
// ================================================================

app.get(
    "/api/purchase-orders/:id",
    async (req, res) => {

        const purchaseOrderId =
            Number(req.params.id);

        console.log(
            "GET PURCHASE ORDER:",
            purchaseOrderId
        );

        if (
            !Number.isInteger(purchaseOrderId) ||
            purchaseOrderId <= 0
        ) {

            return res.status(400).json({
                message:
                    "Invalid Purchase Order ID."
            });

        }

        try {

            const response =
                await axios.get(
                    `${PURCHASE_ORDER_API}/${purchaseOrderId}`,
                    {
                        httpsAgent,
                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE ORDER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to fetch purchase order."
                    }
                );

        }

    }
);


// ================================================================
// 3. GET PURCHASE ORDERS BY SELLER + CUSTOMER
//
// GET
// /api/purchase-orders/seller/:sellerId?customerId=3
//
// Example:
// /api/purchase-orders/seller/6?customerId=3
// ================================================================

app.get(
    "/api/purchase-orders/seller/:sellerId",
    async (req, res) => {

        const sellerId =
            Number(req.params.sellerId);

        const customerId =
            req.query.customerId !== undefined
                ? Number(req.query.customerId)
                : null;

        console.log(
            "GET PURCHASE ORDERS BY SELLER"
        );

        console.log(
            "Seller ID:",
            sellerId
        );

        console.log(
            "Customer ID:",
            customerId
        );

        if (
            !Number.isInteger(sellerId) ||
            sellerId <= 0
        ) {

            return res.status(400).json({
                message:
                    "Invalid Seller ID."
            });

        }

        if (
            customerId !== null &&
            (
                !Number.isInteger(customerId) ||
                customerId <= 0
            )
        ) {

            return res.status(400).json({
                message:
                    "Invalid Customer ID."
            });

        }

        try {

            let url =
                `${PURCHASE_ORDER_API}/seller/${sellerId}`;

            if (customerId !== null) {

                url +=
                    `?customerId=${customerId}`;

            }

            const response =
                await axios.get(
                    url,
                    {
                        httpsAgent,
                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE ORDERS BY SELLER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to fetch seller purchase orders."
                    }
                );

        }

    }
);


// ================================================================
// 4. GET PURCHASE ORDERS BY SUPPLIER
//
// GET /api/purchase-orders/supplier/:supplierId
//
// Example:
// /api/purchase-orders/supplier/1
// ================================================================

app.get(
    "/api/purchase-orders/supplier/:supplierId",
    async (req, res) => {

        const supplierId =
            Number(req.params.supplierId);

        console.log(
            "GET PURCHASE ORDERS BY SUPPLIER:",
            supplierId
        );

        if (
            !Number.isInteger(supplierId) ||
            supplierId <= 0
        ) {

            return res.status(400).json({
                message:
                    "Invalid Supplier ID."
            });

        }

        try {

            const response =
                await axios.get(
                    `${PURCHASE_ORDER_API}/supplier/${supplierId}`,
                    {
                        httpsAgent,
                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE ORDERS BY SUPPLIER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to fetch supplier purchase orders."
                    }
                );

        }

    }
);


// ================================================================
// 5. GET PURCHASE ORDER BY SELLER + PURCHASE ORDER ID
//
// GET
// /api/purchase-orders/seller/:sellerId/order/:purchaseOrderId
//
// Example:
// /api/purchase-orders/seller/6/order/1
// ================================================================

app.get(
    "/api/purchase-orders/seller/:sellerId/order/:purchaseOrderId",
    async (req, res) => {

        const sellerId =
            Number(req.params.sellerId);

        const purchaseOrderId =
            Number(req.params.purchaseOrderId);

        console.log(
            "GET PURCHASE ORDER BY SELLER + ORDER"
        );

        console.log(
            "Seller ID:",
            sellerId
        );

        console.log(
            "Purchase Order ID:",
            purchaseOrderId
        );

        if (
            !Number.isInteger(sellerId) ||
            sellerId <= 0
        ) {

            return res.status(400).json({
                message:
                    "Invalid Seller ID."
            });

        }

        if (
            !Number.isInteger(purchaseOrderId) ||
            purchaseOrderId <= 0
        ) {

            return res.status(400).json({
                message:
                    "Invalid Purchase Order ID."
            });

        }

        try {

            const response =
                await axios.get(
                    `${PURCHASE_ORDER_API}/seller/${sellerId}/order/${purchaseOrderId}`,
                    {
                        httpsAgent,
                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE ORDER BY SELLER + ORDER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to fetch purchase order."
                    }
                );

        }

    }
);


// ================================================================
// 6. GET PURCHASE ORDER BY SELLER + SUPPLIER + ORDER
//
// GET
// /api/purchase-orders/seller/:sellerId/supplier/:supplierId/order/:purchaseOrderId
//
// Example:
// /api/purchase-orders/seller/6/supplier/1/order/1
// ================================================================

app.get(
    "/api/purchase-orders/seller/:sellerId/supplier/:supplierId/order/:purchaseOrderId",
    async (req, res) => {

        const sellerId =
            Number(req.params.sellerId);

        const supplierId =
            Number(req.params.supplierId);

        const purchaseOrderId =
            Number(req.params.purchaseOrderId);

        console.log(
            "GET PURCHASE ORDER BY SELLER + SUPPLIER + ORDER"
        );

        console.log(
            "Seller ID:",
            sellerId
        );

        console.log(
            "Supplier ID:",
            supplierId
        );

        console.log(
            "Purchase Order ID:",
            purchaseOrderId
        );

        if (
            !Number.isInteger(sellerId) ||
            sellerId <= 0
        ) {

            return res.status(400).json({
                message:
                    "Invalid Seller ID."
            });

        }

        if (
            !Number.isInteger(supplierId) ||
            supplierId <= 0
        ) {

            return res.status(400).json({
                message:
                    "Invalid Supplier ID."
            });

        }

        if (
            !Number.isInteger(purchaseOrderId) ||
            purchaseOrderId <= 0
        ) {

            return res.status(400).json({
                message:
                    "Invalid Purchase Order ID."
            });

        }

        try {

            const response =
                await axios.get(
                    `${PURCHASE_ORDER_API}/seller/${sellerId}/supplier/${supplierId}/order/${purchaseOrderId}`,
                    {
                        httpsAgent,
                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE ORDER BY SELLER + SUPPLIER + ORDER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to fetch purchase order."
                    }
                );

        }

    }
);


// ================================================================
// 7. GET PURCHASE ORDER STATISTICS
//
// GET /api/purchase-orders/stats
// ================================================================

app.get(
    "/api/purchase-orders/stats",
    async (req, res) => {

        console.log(
            "GET PURCHASE ORDER STATISTICS"
        );

        try {

            const response =
                await axios.get(
                    `${PURCHASE_ORDER_API}/stats`,
                    {
                        httpsAgent,
                        timeout: 30000
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE ORDER STATISTICS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to fetch purchase order statistics."
                    }
                );

        }

    }
);


// ================================================================
// 8. CREATE PURCHASE ORDER
//
// POST /api/purchase-orders
// ================================================================

app.post(
    "/api/purchase-orders",
    async (req, res) => {

        console.log(
            "================================================"
        );

        console.log(
            "CREATE PURCHASE ORDER"
        );

        console.log(
            "REQUEST BODY:",
            req.body
        );

        console.log(
            "================================================"
        );

        if (
            !req.body ||
            typeof req.body !== "object"
        ) {

            return res.status(400).json({
                message:
                    "Purchase Order data is required."
            });

        }

        try {

            const response =
                await axios.post(
                    PURCHASE_ORDER_API,
                    req.body,
                    {
                        httpsAgent,
                        timeout: 30000,
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            console.log(
                "CREATE PURCHASE ORDER SUCCESS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "CREATE PURCHASE ORDER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to create purchase order."
                    }
                );

        }

    }
);


// ================================================================
// 9. UPDATE PURCHASE ORDER
//
// PUT /api/purchase-orders/:id
// ================================================================

app.put(
    "/api/purchase-orders/:id",
    async (req, res) => {

        const purchaseOrderId =
            Number(req.params.id);

        console.log(
            "UPDATE PURCHASE ORDER:",
            purchaseOrderId
        );

        if (
            !Number.isInteger(purchaseOrderId) ||
            purchaseOrderId <= 0
        ) {

            return res.status(400).json({
                message:
                    "Invalid Purchase Order ID."
            });

        }

        if (
            !req.body ||
            typeof req.body !== "object"
        ) {

            return res.status(400).json({
                message:
                    "Purchase Order data is required."
            });

        }

        try {

            const response =
                await axios.put(
                    `${PURCHASE_ORDER_API}/${purchaseOrderId}`,
                    req.body,
                    {
                        httpsAgent,
                        timeout: 30000,
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            console.log(
                "UPDATE PURCHASE ORDER SUCCESS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "UPDATE PURCHASE ORDER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to update purchase order."
                    }
                );

        }

    }
);


// ================================================================
// 10. DELETE PURCHASE ORDER
//
// DELETE /api/purchase-orders/:id
// ================================================================

app.delete(
    "/api/purchase-orders/:id",
    async (req, res) => {

        const purchaseOrderId =
            Number(req.params.id);

        console.log(
            "DELETE PURCHASE ORDER:",
            purchaseOrderId
        );

        if (
            !Number.isInteger(purchaseOrderId) ||
            purchaseOrderId <= 0
        ) {

            return res.status(400).json({
                message:
                    "Invalid Purchase Order ID."
            });

        }

        try {

            const response =
                await axios.delete(
                    `${PURCHASE_ORDER_API}/${purchaseOrderId}`,
                    {
                        httpsAgent,
                        timeout: 30000
                    }
                );

            console.log(
                "DELETE PURCHASE ORDER SUCCESS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "DELETE PURCHASE ORDER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to delete purchase order."
                    }
                );

        }

    }
);
// ============================================================
// PURCHASE ORDER ITEMS
// ============================================================


// ============================================================
// GET ALL PURCHASE ORDER ITEMS
//
// React:
// GET http://localhost:5000/api/purchase-order-items
//
// .NET:
// GET https://localhost:7203/api/purchase-order-items
// ============================================================

app.get(
    "/api/purchase-order-items",
    async (req, res) => {

        try {

            console.log(
                "================================================"
            );

            console.log(
                "GET ALL PURCHASE ORDER ITEMS"
            );

            console.log(
                "================================================"
            );

            const response = await axios.get(
                `${DOTNET_API}/purchase-order-items`,
                {
                    httpsAgent
                }
            );

            console.log(
                "GET ALL PURCHASE ORDER ITEMS SUCCESS"
            );

            return res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET ALL PURCHASE ORDER ITEMS ERROR:",
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

                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );
            }

            return res.status(500).json({
                message:
                    "Failed to fetch purchase order items.",
                error:
                    error.message
            });
        }
    }
);


// ============================================================
// SEARCH / SORT / PAGINATION
//
// React:
// GET http://localhost:5000/api/purchase-order-items/search
//
// Examples:
//
// ?search=SKU-882
// ?sort=line_no
// ?page=1&limit=25
//
// .NET:
// GET https://localhost:7203/api/purchase-order-items/search
// ============================================================

app.get(
    "/api/purchase-order-items/search",
    async (req, res) => {

        try {

            console.log(
                "PURCHASE ORDER ITEMS SEARCH REQUEST:",
                req.query
            );

            const response = await axios.get(
                `${DOTNET_API}/purchase-order-items/search`,
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
                "PURCHASE ORDER ITEMS SEARCH ERROR:",
                error.message
            );

            if (error.response) {

                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );
            }

            return res.status(500).json({
                message:
                    "Failed to search purchase order items.",
                error:
                    error.message
            });
        }
    }
);


// ============================================================
// GET PURCHASE ORDER ITEM BY ID
//
// React:
// GET http://localhost:5000/api/purchase-order-items/5
//
// .NET:
// GET https://localhost:7203/api/purchase-order-items/5
// ============================================================

app.get(
    "/api/purchase-order-items/:purchaseOrderItemId",
    async (req, res) => {

        try {

            const {
                purchaseOrderItemId
            } = req.params;

            console.log(
                "GET PURCHASE ORDER ITEM:",
                purchaseOrderItemId
            );

            const response = await axios.get(
                `${DOTNET_API}/purchase-order-items/${purchaseOrderItemId}`,
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
                "GET PURCHASE ORDER ITEM ERROR:",
                error.message
            );

            if (error.response) {

                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );
            }

            return res.status(500).json({
                message:
                    "Failed to fetch purchase order item.",
                error:
                    error.message
            });
        }
    }
);


// ============================================================
// GET ITEMS BY PURCHASE ORDER
//
// React:
// GET http://localhost:5000/api/purchase-order-items/purchaseorder/10
//
// .NET:
// GET https://localhost:7203/api/purchase-order-items/purchaseorder/10
// ============================================================

app.get(
    "/api/purchase-order-items/purchaseorder/:purchaseOrderId",
    async (req, res) => {

        try {

            const {
                purchaseOrderId
            } = req.params;

            console.log(
                "GET PURCHASE ORDER ITEMS:",
                purchaseOrderId
            );

            const response = await axios.get(
                `${DOTNET_API}/purchase-order-items/purchaseorder/${purchaseOrderId}`,
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
                "GET PURCHASE ORDER ITEMS ERROR:",
                error.message
            );

            if (error.response) {

                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );
            }

            return res.status(500).json({
                message:
                    "Failed to fetch purchase order items.",
                error:
                    error.message
            });
        }
    }
);


// ============================================================
// GET PURCHASE ORDER + ITEM
//
// React:
// GET
// /api/purchase-order-items/purchaseorder/10/item/25
//
// .NET:
// GET
// /api/purchase-order-items/purchaseorder/10/item/25
// ============================================================

app.get(
    "/api/purchase-order-items/purchaseorder/:purchaseOrderId/item/:purchaseOrderItemId",
    async (req, res) => {

        try {

            const {
                purchaseOrderId,
                purchaseOrderItemId
            } = req.params;

            console.log(
                "GET PURCHASE ORDER + ITEM:",
                purchaseOrderId,
                purchaseOrderItemId
            );

            const response = await axios.get(
                `${DOTNET_API}/purchase-order-items/purchaseorder/${purchaseOrderId}/item/${purchaseOrderItemId}`,
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
                "GET PURCHASE ORDER + ITEM ERROR:",
                error.message
            );

            if (error.response) {

                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );
            }

            return res.status(500).json({
                message:
                    "Failed to fetch purchase order item.",
                error:
                    error.message
            });
        }
    }
);


// ============================================================
// PURCHASE ORDER ITEM STATISTICS
//
// React:
// GET http://localhost:5000/api/purchase-order-items/stats
//
// .NET:
// GET https://localhost:7203/api/purchase-order-items/stats
// ============================================================

app.get(
    "/api/purchase-order-items/stats",
    async (req, res) => {

        try {

            console.log(
                "GET PURCHASE ORDER ITEM STATISTICS"
            );

            const response = await axios.get(
                `${DOTNET_API}/purchase-order-items/stats`,
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
                "GET PURCHASE ORDER ITEM STATISTICS ERROR:",
                error.message
            );

            if (error.response) {

                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );
            }

            return res.status(500).json({
                message:
                    "Failed to fetch purchase order item statistics.",
                error:
                    error.message
            });
        }
    }
);


// ============================================================
// CREATE PURCHASE ORDER ITEM
//
// POST:
// /api/purchase-order-items
// ============================================================

app.post(
    "/api/purchase-order-items",
    async (req, res) => {

        try {

            console.log(
                "CREATE PURCHASE ORDER ITEM"
            );

            console.log(
                "REQUEST BODY:",
                req.body
            );

            const response = await axios.post(
                `${DOTNET_API}/purchase-order-items`,
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
                "CREATE PURCHASE ORDER ITEM ERROR:",
                error.message
            );

            if (error.response) {

                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );
            }

            return res.status(500).json({
                message:
                    "Failed to create purchase order item.",
                error:
                    error.message
            });
        }
    }
);


// ============================================================
// UPDATE PURCHASE ORDER ITEM
//
// PUT:
// /api/purchase-order-items/:purchaseOrderItemId
// ============================================================

app.put(
    "/api/purchase-order-items/:purchaseOrderItemId",
    async (req, res) => {

        try {

            const {
                purchaseOrderItemId
            } = req.params;

            console.log(
                "UPDATE PURCHASE ORDER ITEM:",
                purchaseOrderItemId
            );

            const response = await axios.put(
                `${DOTNET_API}/purchase-order-items/${purchaseOrderItemId}`,
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
                "UPDATE PURCHASE ORDER ITEM ERROR:",
                error.message
            );

            if (error.response) {

                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );
            }

            return res.status(500).json({
                message:
                    "Failed to update purchase order item.",
                error:
                    error.message
            });
        }
    }
);


// ============================================================
// DELETE PURCHASE ORDER ITEM
//
// DELETE:
// /api/purchase-order-items/:purchaseOrderItemId
// ============================================================

app.delete(
    "/api/purchase-order-items/:purchaseOrderItemId",
    async (req, res) => {

        try {

            const {
                purchaseOrderItemId
            } = req.params;

            console.log(
                "DELETE PURCHASE ORDER ITEM:",
                purchaseOrderItemId
            );

            const response = await axios.delete(
                `${DOTNET_API}/purchase-order-items/${purchaseOrderItemId}`,
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
                "DELETE PURCHASE ORDER ITEM ERROR:",
                error.message
            );

            if (error.response) {

                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );
            }

            return res.status(500).json({
                message:
                    "Failed to delete purchase order item.",
                error:
                    error.message
            });
        }
    }
);
/* =========================================================
   PURCHASE RETURN PROXY
========================================================= */

/* ---------------------------------------------------------
   GET ALL PURCHASE RETURNS
   GET /api/purchase-returns
--------------------------------------------------------- */

app.get(
    "/api/purchase-returns",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE RETURNS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch purchase returns."
                    }
                );
        }
    }
);


/* =========================================================
   GET ALL PURCHASE RETURN DETAILS
   GET /api/purchase-returns/all-details
========================================================= */

app.get(
    "/api/purchase-returns/all-details",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns/all-details`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET ALL PURCHASE RETURN DETAILS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch purchase return details."
                    }
                );
        }
    }
);


/* =========================================================
   GET PURCHASE RETURN STATISTICS
   GET /api/purchase-returns/stats
========================================================= */

app.get(
    "/api/purchase-returns/stats",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns/stats`,
                {
                    httpsAgent
                }
            );

            console.log(
                "PURCHASE RETURN STATISTICS:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE RETURN STATISTICS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch purchase return statistics."
                    }
                );
        }
    }
);


/* =========================================================
   GET PURCHASE RETURN BY ID
   GET /api/purchase-returns/:purchaseReturnId
========================================================= */

app.get(
    "/api/purchase-returns/:purchaseReturnId",
    async (req, res) => {

        try {

            const {
                purchaseReturnId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns/${purchaseReturnId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE RETURN BY ID ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch purchase return."
                    }
                );
        }
    }
);


/* =========================================================
   GET PURCHASE RETURNS BY PURCHASE ORDER
   GET /api/purchase-returns/purchaseorder/:purchaseOrderId
========================================================= */

app.get(
    "/api/purchase-returns/purchaseorder/:purchaseOrderId",
    async (req, res) => {

        try {

            const {
                purchaseOrderId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns/purchaseorder/${purchaseOrderId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE RETURNS BY PURCHASE ORDER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch purchase returns."
                    }
                );
        }
    }
);


/* =========================================================
   GET PURCHASE RETURNS BY SUPPLIER
   GET /api/purchase-returns/supplier/:supplierId
========================================================= */

app.get(
    "/api/purchase-returns/supplier/:supplierId",
    async (req, res) => {

        try {

            const {
                supplierId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns/supplier/${supplierId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE RETURNS BY SUPPLIER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch supplier purchase returns."
                    }
                );
        }
    }
);


/* =========================================================
   GET PURCHASE RETURNS BY GRN
   GET /api/purchase-returns/grn/:goodsReceiptNoteId
========================================================= */

app.get(
    "/api/purchase-returns/grn/:goodsReceiptNoteId",
    async (req, res) => {

        try {

            const {
                goodsReceiptNoteId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns/grn/${goodsReceiptNoteId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE RETURNS BY GRN ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch GRN purchase returns."
                    }
                );
        }
    }
);


/* =========================================================
   GET PURCHASE RETURNS BY SELLER
   GET /api/purchase-returns/seller/:sellerId
========================================================= */

app.get(
    "/api/purchase-returns/seller/:sellerId",
    async (req, res) => {

        try {

            const {
                sellerId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns/seller/${sellerId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE RETURNS BY SELLER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch seller purchase returns."
                    }
                );
        }
    }
);


/* =========================================================
   GET PURCHASE RETURNS BY CUSTOMER
   GET /api/purchase-returns/customer/:customerId
========================================================= */

app.get(
    "/api/purchase-returns/customer/:customerId",
    async (req, res) => {

        try {

            const {
                customerId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns/customer/${customerId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE RETURNS BY CUSTOMER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch customer purchase returns."
                    }
                );
        }
    }
);


/* =========================================================
   GET PURCHASE RETURNS BY SELLER + CUSTOMER
   GET /api/purchase-returns/seller/:sellerId/customer/:customerId
========================================================= */

app.get(
    "/api/purchase-returns/seller/:sellerId/customer/:customerId",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns/seller/${sellerId}/customer/${customerId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE RETURNS BY SELLER CUSTOMER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch seller customer purchase returns."
                    }
                );
        }
    }
);


/* =========================================================
   GET PURCHASE RETURNS BY STATUS
   GET /api/purchase-returns/status/:status
========================================================= */

app.get(
    "/api/purchase-returns/status/:status",
    async (req, res) => {

        try {

            const {
                status
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns/status/${encodeURIComponent(status)}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PURCHASE RETURNS BY STATUS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch purchase returns by status."
                    }
                );
        }
    }
);


/* =========================================================
   GET SPECIFIC PURCHASE RETURN
   GET /api/purchase-returns/purchaseorder/:purchaseOrderId/
       supplier/:supplierId/return/:purchaseReturnId
========================================================= */

app.get(
    "/api/purchase-returns/purchaseorder/:purchaseOrderId/supplier/:supplierId/return/:purchaseReturnId",
    async (req, res) => {

        try {

            const {
                purchaseOrderId,
                supplierId,
                purchaseReturnId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/purchase-returns/purchaseorder/${purchaseOrderId}/supplier/${supplierId}/return/${purchaseReturnId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET SPECIFIC PURCHASE RETURN ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to fetch purchase return."
                    }
                );
        }
    }
);


/* =========================================================
   CREATE PURCHASE RETURN
   POST /api/purchase-returns
========================================================= */

app.post(
    "/api/purchase-returns",
    async (req, res) => {

        try {

            console.log(
                "CREATE PURCHASE RETURN REQUEST:",
                req.body
            );

            const response = await axios.post(
                `${DOTNET_API}/purchase-returns`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "CREATE PURCHASE RETURN ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to create purchase return."
                    }
                );
        }
    }
);


/* =========================================================
   UPDATE PURCHASE RETURN
   PUT /api/purchase-returns/:purchaseReturnId
========================================================= */

app.put(
    "/api/purchase-returns/:purchaseReturnId",
    async (req, res) => {

        try {

            const {
                purchaseReturnId
            } = req.params;

            console.log(
                "UPDATE PURCHASE RETURN REQUEST:",
                purchaseReturnId,
                req.body
            );

            const response = await axios.put(
                `${DOTNET_API}/purchase-returns/${purchaseReturnId}`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "UPDATE PURCHASE RETURN ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to update purchase return."
                    }
                );
        }
    }
);


/* =========================================================
   DELETE PURCHASE RETURN
   DELETE /api/purchase-returns/:purchaseReturnId
========================================================= */

app.delete(
    "/api/purchase-returns/:purchaseReturnId",
    async (req, res) => {

        try {

            const {
                purchaseReturnId
            } = req.params;

            const response = await axios.delete(
                `${DOTNET_API}/purchase-returns/${purchaseReturnId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "DELETE PURCHASE RETURN ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to delete purchase return."
                    }
                );
        }
    }
);


/* =========================================================
   CONFIGURATION
========================================================= */
const GRN_ITEM_API = `${DOTNET_API}/GoodsReceiptNotes`;


/* =========================================================
   HTTPS AGENT
   Allow local ASP.NET development certificate
========================================================= */




/* =========================================================
   AXIOS DEFAULT CONFIG
========================================================= */

const axiosConfig = {
    httpsAgent,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
};
/* =========================================================
   GET ALL
   GET /api/goods-receipt-note-items
========================================================= */

app.get(
    "/api/goods-receipt-note-items",
    async (req, res) => {

        try {

            console.log(
                "========================================"
            );

            console.log(
                "GET ALL GOODS RECEIPT NOTE ITEMS"
            );

            console.log(
                "DOWNSTREAM:",
                GRN_ITEM_API
            );

            const response = await axios.get(
                GRN_ITEM_API,
                axiosConfig
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET ALL GOODS RECEIPT NOTE ITEMS ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   SEARCH
   IMPORTANT:
   Keep this BEFORE /:goodsReceiptNoteItemId
========================================================= */

app.get(
    "/api/goods-receipt-note-items/search",
    async (req, res) => {

        try {

            const {
                search = ""
            } = req.query;

            console.log(
                "SEARCH GOODS RECEIPT NOTE ITEMS:",
                search
            );

            const response = await axios.get(
                `${GRN_ITEM_API}/search`,
                {
                    ...axiosConfig,
                    params: {
                        search
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "SEARCH GOODS RECEIPT NOTE ITEMS ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   STATISTICS
   GET /api/goods-receipt-note-items/stats
========================================================= */

app.get(
    "/api/goods-receipt-note-items/stats",
    async (req, res) => {

        try {

            console.log(
                "GET GOODS RECEIPT NOTE ITEM STATISTICS"
            );

            const response = await axios.get(
                `${GRN_ITEM_API}/stats`,
                axiosConfig
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET GOODS RECEIPT NOTE ITEM STATISTICS ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   PAGINATION
   GET /api/goods-receipt-note-items/page
========================================================= */

app.get(
    "/api/goods-receipt-note-items/page",
    async (req, res) => {

        try {

            const page =
                Number(req.query.page) || 1;

            const limit =
                Number(req.query.limit) || 15;

            console.log(
                "GET PAGED GOODS RECEIPT NOTE ITEMS:",
                {
                    page,
                    limit
                }
            );

            const response = await axios.get(
                `${GRN_ITEM_API}/page`,
                {
                    ...axiosConfig,
                    params: {
                        page,
                        limit
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET PAGED GOODS RECEIPT NOTE ITEMS ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   SORTING
   GET /api/goods-receipt-note-items/sort
========================================================= */

app.get(
    "/api/goods-receipt-note-items/sort",
    async (req, res) => {

        try {

            const {
                sort = ""
            } = req.query;

            console.log(
                "SORT GOODS RECEIPT NOTE ITEMS:",
                sort
            );

            const response = await axios.get(
                `${GRN_ITEM_API}/sort`,
                {
                    ...axiosConfig,
                    params: {
                        sort
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "SORT GOODS RECEIPT NOTE ITEMS ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   GET BY STATUS
   GET /api/goods-receipt-note-items/status/:status
========================================================= */

app.get(
    "/api/goods-receipt-note-items/status/:status",
    async (req, res) => {

        try {

            const {
                status
            } = req.params;

            console.log(
                "GET GRN ITEMS BY STATUS:",
                status
            );

            const response = await axios.get(
                `${GRN_ITEM_API}/status/${encodeURIComponent(status)}`,
                axiosConfig
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET GRN ITEMS BY STATUS ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   GET BY GRN
   GET /api/goods-receipt-note-items/grn/:goodsReceiptNoteId
========================================================= */

app.get(
    "/api/goods-receipt-note-items/grn/:goodsReceiptNoteId",
    async (req, res) => {

        try {

            const {
                goodsReceiptNoteId
            } = req.params;

            console.log(
                "GET GRN ITEMS BY GRN:",
                goodsReceiptNoteId
            );

            const response = await axios.get(
                `${GRN_ITEM_API}/grn/${goodsReceiptNoteId}`,
                axiosConfig
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET GRN ITEMS BY GRN ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   GET BY PRODUCT
   GET /api/goods-receipt-note-items/product/:productId
========================================================= */

app.get(
    "/api/goods-receipt-note-items/product/:productId",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            console.log(
                "GET GRN ITEMS BY PRODUCT:",
                productId
            );

            const response = await axios.get(
                `${GRN_ITEM_API}/product/${productId}`,
                axiosConfig
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET GRN ITEMS BY PRODUCT ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   GET BY GRN + PRODUCT
========================================================= */

app.get(
    "/api/goods-receipt-note-items/grn/:goodsReceiptNoteId/product/:productId",
    async (req, res) => {

        try {

            const {
                goodsReceiptNoteId,
                productId
            } = req.params;

            console.log(
                "GET GRN ITEM BY GRN + PRODUCT:",
                {
                    goodsReceiptNoteId,
                    productId
                }
            );

            const response = await axios.get(
                `${GRN_ITEM_API}/grn/${goodsReceiptNoteId}/product/${productId}`,
                axiosConfig
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET GRN ITEM BY GRN + PRODUCT ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   GET BY ID
   IMPORTANT:
   This is AFTER search/stats/page/sort.
========================================================= */

app.get(
    "/api/goods-receipt-note-items/:goodsReceiptNoteItemId",
    async (req, res) => {

        try {

            const {
                goodsReceiptNoteItemId
            } = req.params;

            console.log(
                "GET GOODS RECEIPT NOTE ITEM:",
                goodsReceiptNoteItemId
            );

            if (!/^\d+$/.test(goodsReceiptNoteItemId)) {

                return res.status(400).json({
                    success: false,
                    message:
                        "goodsReceiptNoteItemId must be a number."
                });
            }

            const response = await axios.get(
                `${GRN_ITEM_API}/${goodsReceiptNoteItemId}`,
                axiosConfig
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET GOODS RECEIPT NOTE ITEM ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   CREATE
   POST /api/goods-receipt-note-items
========================================================= */

app.post(
    "/api/goods-receipt-note-items",
    async (req, res) => {

        try {

            console.log(
                "========================================"
            );

            console.log(
                "CREATE GOODS RECEIPT NOTE ITEM"
            );

            console.log(
                "REQUEST BODY:",
                req.body
            );

            const response = await axios.post(
                GRN_ITEM_API,
                req.body,
                axiosConfig
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "CREATE GOODS RECEIPT NOTE ITEM ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   UPDATE
   PUT /api/goods-receipt-note-items/:id
========================================================= */

app.put(
    "/api/goods-receipt-note-items/:goodsReceiptNoteItemId",
    async (req, res) => {

        try {

            const {
                goodsReceiptNoteItemId
            } = req.params;

            console.log(
                "UPDATE GOODS RECEIPT NOTE ITEM:",
                goodsReceiptNoteItemId
            );

            console.log(
                "REQUEST BODY:",
                req.body
            );

            if (!/^\d+$/.test(goodsReceiptNoteItemId)) {

                return res.status(400).json({
                    success: false,
                    message:
                        "goodsReceiptNoteItemId must be a number."
                });
            }

            const response = await axios.put(
                `${GRN_ITEM_API}/${goodsReceiptNoteItemId}`,
                req.body,
                axiosConfig
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "UPDATE GOODS RECEIPT NOTE ITEM ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);


/* =========================================================
   DELETE
   DELETE /api/goods-receipt-note-items/:id
========================================================= */

app.delete(
    "/api/goods-receipt-note-items/:goodsReceiptNoteItemId",
    async (req, res) => {

        try {

            const {
                goodsReceiptNoteItemId
            } = req.params;

            console.log(
                "DELETE GOODS RECEIPT NOTE ITEM:",
                goodsReceiptNoteItemId
            );

            if (!/^\d+$/.test(goodsReceiptNoteItemId)) {

                return res.status(400).json({
                    success: false,
                    message:
                        "goodsReceiptNoteItemId must be a number."
                });
            }

            const response = await axios.delete(
                `${GRN_ITEM_API}/${goodsReceiptNoteItemId}`,
                axiosConfig
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "DELETE GOODS RECEIPT NOTE ITEM ERROR:",
                error.message
            );

            return handleAxiosError(
                res,
                error
            );
        }
    }
);
/* =========================================================
   GOODS RECEIPT NOTE ITEM BASE API
========================================================= */

/* =========================================================
   ERROR HANDLER
========================================================= */

const handleError = (
    res,
    error,
    apiName
) => {

    console.error("");
    console.error(
        "================================================="
    );
    console.error(
        `${apiName} ERROR`
    );
    console.error(
        "================================================="
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

    console.error(
        "MESSAGE:",
        error.message
    );

    return res
        .status(500)
        .json({
            success: false,
            message: `${apiName} failed.`,
            error: error.message
        });
};

/* =========================================================
   GET ALL
   GET:
   /api/goods-receipt-note-items
========================================================= */

app.get(
    "/api/goods-receipt-note-items",
    async (req, res) => {

        try {

            console.log("");
            console.log(
                "================================================="
            );
            console.log(
                "GET GOODS RECEIPT NOTE ITEMS"
            );
            console.log(
                "================================================="
            );

            const response =
                await axios.get(
                    GRN_ITEM_API,
                    {
                        params: req.query,
                        httpsAgent
                    }
                );

            return res
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "GET GOODS RECEIPT NOTE ITEMS"
            );
        }
    }
);

/* =========================================================
   GET ALL AT ONCE
   GET:
   /api/goods-receipt-note-items/all

   NO PAGINATION
   NO SEARCH
   NO SORTING
========================================================= */

app.get(
    "/api/goods-receipt-note-items/all",
    async (req, res) => {

        try {

            console.log("");
            console.log(
                "================================================="
            );
            console.log(
                "GET ALL GOODS RECEIPT NOTE ITEMS"
            );
            console.log(
                "================================================="
            );

            const response =
                await axios.get(
                    `${GRN_ITEM_API}/all`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "GET ALL GOODS RECEIPT NOTE ITEMS"
            );
        }
    }
);

/* =========================================================
   STATISTICS
   GET:
   /api/goods-receipt-note-items/stats
========================================================= */

app.get(
    "/api/goods-receipt-note-items/stats",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${GRN_ITEM_API}/stats`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "GET GOODS RECEIPT NOTE ITEM STATISTICS"
            );
        }
    }
);

/* =========================================================
   GET BY ID
   GET:
   /api/goods-receipt-note-items/5
========================================================= */

app.get(
    "/api/goods-receipt-note-items/:goodsReceiptItemId",
    async (req, res) => {

        try {

            const {
                goodsReceiptItemId
            } = req.params;

            const response =
                await axios.get(
                    `${GRN_ITEM_API}/${goodsReceiptItemId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "GET GOODS RECEIPT ITEM BY ID"
            );
        }
    }
);

/* =========================================================
   GET BY GRN
   GET:
   /api/goods-receipt-note-items/grn/10
========================================================= */

app.get(
    "/api/goods-receipt-note-items/grn/:goodsReceiptNoteId",
    async (req, res) => {

        try {

            const {
                goodsReceiptNoteId
            } = req.params;

            const response =
                await axios.get(
                    `${GRN_ITEM_API}/grn/${goodsReceiptNoteId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "GET GOODS RECEIPT ITEMS BY GRN"
            );
        }
    }
);

/* =========================================================
   GET BY GRN + ITEM
   GET:
   /api/goods-receipt-note-items/grn/10/item/5
========================================================= */

app.get(
    "/api/goods-receipt-note-items/grn/:goodsReceiptNoteId/item/:goodsReceiptItemId",
    async (req, res) => {

        try {

            const {
                goodsReceiptNoteId,
                goodsReceiptItemId
            } = req.params;

            const response =
                await axios.get(
                    `${GRN_ITEM_API}/grn/${goodsReceiptNoteId}/item/${goodsReceiptItemId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "GET GOODS RECEIPT ITEM BY GRN AND ITEM"
            );
        }
    }
);

/* =========================================================
   GET BY PRODUCT
   GET:
   /api/goods-receipt-note-items/product/5
========================================================= */

app.get(
    "/api/goods-receipt-note-items/product/:productId",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            const response =
                await axios.get(
                    `${GRN_ITEM_API}/product/${productId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "GET GOODS RECEIPT ITEMS BY PRODUCT"
            );
        }
    }
);

/* =========================================================
   GET BY SELLER
   GET:
   /api/goods-receipt-note-items/seller/6
========================================================= */

app.get(
    "/api/goods-receipt-note-items/seller/:sellerId",
    async (req, res) => {

        try {

            const {
                sellerId
            } = req.params;

            const response =
                await axios.get(
                    `${GRN_ITEM_API}/seller/${sellerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "GET GOODS RECEIPT ITEMS BY SELLER"
            );
        }
    }
);

/* =========================================================
   GET BY CUSTOMER
   GET:
   /api/goods-receipt-note-items/customer/3
========================================================= */

app.get(
    "/api/goods-receipt-note-items/customer/:customerId",
    async (req, res) => {

        try {

            const {
                customerId
            } = req.params;

            const response =
                await axios.get(
                    `${GRN_ITEM_API}/customer/${customerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "GET GOODS RECEIPT ITEMS BY CUSTOMER"
            );
        }
    }
);

/* =========================================================
   GET BY SELLER + CUSTOMER
   GET:
   /api/goods-receipt-note-items/seller/6/customer/3
========================================================= */

app.get(
    "/api/goods-receipt-note-items/seller/:sellerId/customer/:customerId",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.params;

            const response =
                await axios.get(
                    `${GRN_ITEM_API}/seller/${sellerId}/customer/${customerId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "GET GOODS RECEIPT ITEMS BY SELLER AND CUSTOMER"
            );
        }
    }
);

/* =========================================================
   CREATE
   POST:
   /api/goods-receipt-note-items
========================================================= */

app.post(
    "/api/goods-receipt-note-items",
    async (req, res) => {

        try {

            console.log("");
            console.log(
                "================================================="
            );
            console.log(
                "CREATE GOODS RECEIPT NOTE ITEM"
            );
            console.log(
                "================================================="
            );

            console.log(
                "REQUEST BODY:",
                req.body
            );

            const response =
                await axios.post(
                    GRN_ITEM_API,
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
                .status(
                    response.status || 201
                )
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "CREATE GOODS RECEIPT NOTE ITEM"
            );
        }
    }
);

/* =========================================================
   UPDATE
   PUT:
   /api/goods-receipt-note-items/5
========================================================= */

app.put(
    "/api/goods-receipt-note-items/:goodsReceiptItemId",
    async (req, res) => {

        try {

            const {
                goodsReceiptItemId
            } = req.params;

            console.log("");
            console.log(
                "================================================="
            );
            console.log(
                "UPDATE GOODS RECEIPT NOTE ITEM"
            );
            console.log(
                "================================================="
            );

            console.log(
                "ID:",
                goodsReceiptItemId
            );

            console.log(
                "REQUEST BODY:",
                req.body
            );

            const response =
                await axios.put(
                    `${GRN_ITEM_API}/${goodsReceiptItemId}`,
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
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "UPDATE GOODS RECEIPT NOTE ITEM"
            );
        }
    }
);

/* =========================================================
   DELETE
   DELETE:
   /api/goods-receipt-note-items/5
========================================================= */

app.delete(
    "/api/goods-receipt-note-items/:goodsReceiptItemId",
    async (req, res) => {

        try {

            const {
                goodsReceiptItemId
            } = req.params;

            console.log("");
            console.log(
                "================================================="
            );
            console.log(
                "DELETE GOODS RECEIPT NOTE ITEM"
            );
            console.log(
                "================================================="
            );

            console.log(
                "ID:",
                goodsReceiptItemId
            );

            const response =
                await axios.delete(
                    `${GRN_ITEM_API}/${goodsReceiptItemId}`,
                    {
                        httpsAgent
                    }
                );

            return res
                .status(200)
                .json(response.data);

        } catch (error) {

            return handleError(
                res,
                error,
                "DELETE GOODS RECEIPT NOTE ITEM"
            );
        }
    }
);














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
// ============================================================
// SELLER CUSTOMER ROUTES
// ============================================================
//
// React
//   ↓
// Node.js : 5000
//   ↓
// ASP.NET Core : 7203
//
// React must NEVER call ASP.NET directly.
// React calls:
// http://localhost:5000/api/seller-customers/...
//
// Node forwards to:
// https://localhost:7203/api/SellerCustomer/...
// ============================================================


// ============================================================
// GET ALL SELLER CUSTOMERS
// ============================================================
// GET /api/seller-customers
// ============================================================

app.get(
    "/api/seller-customers",
    async (req, res) => {

        console.log("================================================");
        console.log("GET ALL SELLER CUSTOMERS");
        console.log("================================================");

        try {

            const response = await axios.get(
                `${DOTNET_API}/SellerCustomer`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "*/*"
                    },
                    timeout: 30000
                }
            );

            console.log(
                "BACKEND STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET ALL SELLER CUSTOMERS ERROR"
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json({
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        error.message ||
                        "Failed to load seller customers.",
                    backendStatus:
                        error.response?.status || null,
                    backendResponse:
                        error.response?.data || null
                });
        }
    }
);


// ============================================================
// GET CUSTOMERS BY SELLER
// ============================================================
// GET /api/seller-customers/seller/6
// ============================================================

app.get(
    "/api/seller-customers/seller/:sellerId",
    async (req, res) => {

        const {
            sellerId
        } = req.params;

        console.log("================================================");
        console.log("GET SELLER CUSTOMERS BY SELLER");
        console.log("SELLER ID:", sellerId);
        console.log("================================================");

        try {

            const response = await axios.get(
                `${DOTNET_API}/SellerCustomer/seller/${sellerId}`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "*/*"
                    },
                    timeout: 30000
                }
            );

            console.log(
                "BACKEND STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET SELLER CUSTOMERS BY SELLER ERROR"
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json({
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        error.message ||
                        "Failed to load seller customers.",
                    backendStatus:
                        error.response?.status || null,
                    backendResponse:
                        error.response?.data || null
                });
        }
    }
);


// ============================================================
// GET SELLER CUSTOMER DETAILS / AGGREGATE
// ============================================================
// GET /api/seller-customers/6/customers/3
//
// ASP.NET:
// GET /api/SellerCustomer/6/customers/3
//
// IMPORTANT:
// This route MUST appear only once.
// ============================================================

app.get(
    "/api/seller-customers/:sellerId/customers/:customerId",
    async (req, res) => {

        const {
            sellerId,
            customerId
        } = req.params;

        console.log("================================================");
        console.log("GET SELLER CUSTOMER DETAILS");
        console.log("SELLER ID:", sellerId);
        console.log("CUSTOMER ID:", customerId);
        console.log("================================================");

        try {

            const backendUrl =
                `${DOTNET_API}/SellerCustomer/${sellerId}/customers/${customerId}`;

            console.log(
                "BACKEND URL:",
                backendUrl
            );

            const response = await axios.get(
                backendUrl,
                {
                    httpsAgent,
                    headers: {
                        Accept: "*/*"
                    },
                    timeout: 30000
                }
            );

            console.log(
                "BACKEND STATUS:",
                response.status
            );

            console.log(
                "BACKEND RESPONSE:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error("================================================");
            console.error("GET SELLER CUSTOMER DETAILS ERROR");
            console.error("================================================");

            console.error(
                "MESSAGE:",
                error.message
            );

            console.error(
                "CODE:",
                error.code
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error("================================================");

            return res
                .status(error.response?.status || 500)
                .json({
                    success: false,

                    message:
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        error.message ||
                        "Failed to load seller customer.",

                    backendStatus:
                        error.response?.status || null,

                    backendResponse:
                        error.response?.data || null
                });
        }
    }
);


// ============================================================
// GET CUSTOMER BY CODE
// ============================================================
// GET /api/seller-customers/6/code/CUST001
// ============================================================

app.get(
    "/api/seller-customers/:sellerId/code/:customerCode",
    async (req, res) => {

        const {
            sellerId,
            customerCode
        } = req.params;

        console.log("================================================");
        console.log("GET CUSTOMER BY CODE");
        console.log("SELLER ID:", sellerId);
        console.log("CUSTOMER CODE:", customerCode);
        console.log("================================================");

        try {

            const backendUrl =
                `${DOTNET_API}/SellerCustomer/${sellerId}/code/${encodeURIComponent(customerCode)}`;

            const response = await axios.get(
                backendUrl,
                {
                    httpsAgent,
                    headers: {
                        Accept: "*/*"
                    },
                    timeout: 30000
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET CUSTOMER BY CODE ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json({
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        error.message ||
                        "Customer not found.",
                    backendStatus:
                        error.response?.status || null,
                    backendResponse:
                        error.response?.data || null
                });
        }
    }
);


// ============================================================
// FILTER SELLER CUSTOMERS
// ============================================================
// GET /api/seller-customers/filter?sellerId=6
//
// Optional:
// ?sellerId=6&search=Priya
// ?sellerId=6&isActive=true
// ?sellerId=6&search=Priya&isActive=true
// ============================================================

app.get(
    "/api/seller-customers/filter",
    async (req, res) => {

        console.log("================================================");
        console.log("FILTER SELLER CUSTOMERS");
        console.log("QUERY:", req.query);
        console.log("================================================");

        try {

            const {
                sellerId,
                search,
                isActive
            } = req.query;

            if (
                sellerId === undefined ||
                sellerId === null ||
                String(sellerId).trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: "sellerId is required."
                });
            }

            const params = new URLSearchParams();

            params.append(
                "sellerId",
                String(sellerId).trim()
            );

            if (
                search !== undefined &&
                search !== null &&
                String(search).trim() !== ""
            ) {

                params.append(
                    "search",
                    String(search).trim()
                );
            }

            if (
                isActive !== undefined &&
                isActive !== null &&
                String(isActive).trim() !== ""
            ) {

                params.append(
                    "isActive",
                    String(isActive).trim()
                );
            }

            const backendUrl =
                `${DOTNET_API}/SellerCustomer/filter?${params.toString()}`;

            console.log(
                "BACKEND URL:",
                backendUrl
            );

            const response = await axios.get(
                backendUrl,
                {
                    httpsAgent,
                    headers: {
                        Accept: "*/*"
                    },
                    timeout: 30000
                }
            );

            console.log(
                "BACKEND STATUS:",
                response.status
            );

            console.log(
                "BACKEND DATA:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error("================================================");
            console.error("SELLER CUSTOMER FILTER ERROR");
            console.error("================================================");

            console.error(
                "MESSAGE:",
                error.message
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json({
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        error.message ||
                        "Failed to filter seller customers.",
                    backendStatus:
                        error.response?.status || null,
                    backendResponse:
                        error.response?.data || null
                });
        }
    }
);


// ============================================================
// CREATE SELLER CUSTOMER
// ============================================================
// POST /api/seller-customers
// ============================================================

app.post(
    "/api/seller-customers",
    async (req, res) => {

        console.log("================================================");
        console.log("CREATE SELLER CUSTOMER");
        console.log("BODY:", req.body);
        console.log("================================================");

        try {

            const response = await axios.post(
                `${DOTNET_API}/SellerCustomer`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json"
                    },
                    timeout: 30000
                }
            );

            console.log(
                "BACKEND STATUS:",
                response.status
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "CREATE SELLER CUSTOMER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json({
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        error.message ||
                        "Failed to create customer.",
                    backendStatus:
                        error.response?.status || null,
                    backendResponse:
                        error.response?.data || null
                });
        }
    }
);


// ============================================================
// UPDATE SELLER CUSTOMER
// ============================================================
// PUT /api/seller-customers/6/customers/3
//
// ASP.NET:
// PUT /api/SellerCustomer/6/customers/3
// ============================================================

app.put(
    "/api/seller-customers/:sellerId/customers/:customerId",
    async (req, res) => {

        const {
            sellerId,
            customerId
        } = req.params;

        console.log("================================================");
        console.log("UPDATE SELLER CUSTOMER");
        console.log("SELLER ID:", sellerId);
        console.log("CUSTOMER ID:", customerId);
        console.log("BODY:", req.body);
        console.log("================================================");

        try {

            const backendUrl =
                `${DOTNET_API}/SellerCustomer/${sellerId}/customers/${customerId}`;

            const response = await axios.put(
                backendUrl,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        Accept: "*/*",
                        "Content-Type": "application/json"
                    },
                    timeout: 30000
                }
            );

            console.log(
                "BACKEND STATUS:",
                response.status
            );

            console.log(
                "BACKEND DATA:",
                response.data
            );

            // ASP.NET PUT returns 204
            if (response.status === 204) {

                return res.status(204).send();
            }

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error("================================================");
            console.error("UPDATE SELLER CUSTOMER ERROR");
            console.error("================================================");

            console.error(
                "MESSAGE:",
                error.message
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json({
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        error.message ||
                        "Failed to update seller customer.",
                    backendStatus:
                        error.response?.status || null,
                    backendResponse:
                        error.response?.data || null
                });
        }
    }
);


// ============================================================
// DELETE SELLER CUSTOMER
// ============================================================
// DELETE /api/seller-customers/6/customers/3
// ============================================================

app.delete(
    "/api/seller-customers/:sellerId/customers/:customerId",
    async (req, res) => {

        const {
            sellerId,
            customerId
        } = req.params;

        console.log("================================================");
        console.log("DELETE SELLER CUSTOMER");
        console.log("SELLER ID:", sellerId);
        console.log("CUSTOMER ID:", customerId);
        console.log("================================================");

        try {

            const backendUrl =
                `${DOTNET_API}/SellerCustomer/${sellerId}/customers/${customerId}`;

            const response = await axios.delete(
                backendUrl,
                {
                    httpsAgent,
                    headers: {
                        Accept: "*/*"
                    },
                    timeout: 30000
                }
            );

            console.log(
                "BACKEND STATUS:",
                response.status
            );

            if (response.status === 204) {

                return res.status(204).send();
            }

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error("================================================");
            console.error("DELETE SELLER CUSTOMER ERROR");
            console.error("================================================");

            console.error(
                "MESSAGE:",
                error.message
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json({
                    success: false,
                    message:
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        error.message ||
                        "Failed to delete seller customer.",
                    backendStatus:
                        error.response?.status || null,
                    backendResponse:
                        error.response?.data || null
                });
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




/* =========================================================
   GET ALL HISTORY
=========================================================

   FRONTEND:

   GET
   http://localhost:5000/api/order-status-histories/all

   .NET:

   GET
   https://localhost:7203/api/order-status-histories/all
========================================================= */

app.get(
    "/api/order-status-histories/all",

    async (req, res) => {

        try {

            console.log(
                "GET ALL ORDER STATUS HISTORIES"
            );


            const response =
                await axios.get(

                    `${DOTNET_API}/order-status-histories/all`,

                    {
                        httpsAgent
                    }

                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET ALL ORDER STATUS HISTORIES ERROR:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({

                    success: false,

                    message:
                        error.response?.data?.message ||
                        "Unable to fetch all order status histories.",

                    error:
                        error.response?.data ||
                        error.message

                });

        }

    }
);


/* =========================================================
   GET ALL / SEARCH / SORT
========================================================= */

app.get(
    "/api/order-status-histories",

    async (req, res) => {

        try {

            const response =
                await axios.get(

                    `${DOTNET_API}/order-status-histories`,

                    {
                        params: req.query,

                        httpsAgent
                    }

                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET ORDER STATUS HISTORIES ERROR:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({

                    success: false,

                    message:
                        error.response?.data?.message ||
                        "Unable to fetch order status histories.",

                    error:
                        error.response?.data ||
                        error.message

                });

        }

    }
);


/* =========================================================
   GET BY ID
========================================================= */

app.get(
    "/api/order-status-histories/:id",

    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const response =
                await axios.get(

                    `${DOTNET_API}/order-status-histories/${id}`,

                    {
                        httpsAgent
                    }

                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET HISTORY BY ID ERROR:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({

                    success: false,

                    message:
                        error.response?.data?.message ||
                        "Unable to fetch order status history.",

                    error:
                        error.response?.data ||
                        error.message

                });

        }

    }
);


/* =========================================================
   GET BY ORDER
========================================================= */

app.get(
    "/api/order-status-histories/order/:orderId",

    async (req, res) => {

        try {

            const {
                orderId
            } = req.params;


            const response =
                await axios.get(

                    `${DOTNET_API}/order-status-histories/order/${orderId}`,

                    {
                        httpsAgent
                    }

                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET HISTORY BY ORDER ERROR:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({

                    success: false,

                    message:
                        "Unable to fetch order status history for this order.",

                    error:
                        error.response?.data ||
                        error.message

                });

        }

    }
);


/* =========================================================
   GET BY STATUS
========================================================= */

app.get(
    "/api/order-status-histories/status/:status",

    async (req, res) => {

        try {

            const {
                status
            } = req.params;


            const response =
                await axios.get(

                    `${DOTNET_API}/order-status-histories/status/${encodeURIComponent(status)}`,

                    {
                        httpsAgent
                    }

                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET HISTORY BY STATUS ERROR:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({

                    success: false,

                    message:
                        "Unable to fetch histories for this status.",

                    error:
                        error.response?.data ||
                        error.message

                });

        }

    }
);


/* =========================================================
   SEARCH
========================================================= */

app.get(
    "/api/order-status-histories/search",

    async (req, res) => {

        try {

            const response =
                await axios.get(

                    `${DOTNET_API}/order-status-histories/search`,

                    {

                        params: {
                            search:
                                req.query.search
                        },

                        httpsAgent

                    }

                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "SEARCH HISTORY ERROR:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({

                    success: false,

                    message:
                        "Unable to search order status histories.",

                    error:
                        error.response?.data ||
                        error.message

                });

        }

    }
);


/* =========================================================
   STATISTICS
========================================================= */

app.get(
    "/api/order-status-histories/stats",

    async (req, res) => {

        try {

            const response =
                await axios.get(

                    `${DOTNET_API}/order-status-histories/stats`,

                    {
                        httpsAgent
                    }

                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "HISTORY STATISTICS ERROR:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({

                    success: false,

                    message:
                        "Unable to fetch order status history statistics.",

                    error:
                        error.response?.data ||
                        error.message

                });

        }

    }
);


/* =========================================================
   PAGINATED HISTORY BY ORDER
========================================================= */

app.get(
    "/api/orders/:orderId/status-history",

    async (req, res) => {

        try {

            const {
                orderId
            } = req.params;


            const response =
                await axios.get(

                    `${DOTNET_API}/orders/${orderId}/status-history`,

                    {

                        params: {

                            page:
                                req.query.page || 1,

                            limit:
                                req.query.limit || 10

                        },

                        httpsAgent

                    }

                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "PAGINATED HISTORY ERROR:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({

                    success: false,

                    message:
                        "Unable to fetch paginated order status history.",

                    error:
                        error.response?.data ||
                        error.message

                });

        }

    }
);


/* =========================================================
   CREATE
========================================================= */

app.post(
    "/api/order-status-histories",

    async (req, res) => {

        try {

            console.log(
                "CREATE ORDER STATUS HISTORY:",
                req.body
            );


            const response =
                await axios.post(

                    `${DOTNET_API}/order-status-histories`,

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

        }
        catch (error) {

            console.error(
                "CREATE HISTORY ERROR:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({

                    success: false,

                    message:
                        error.response?.data?.message ||
                        "Unable to create order status history.",

                    error:
                        error.response?.data ||
                        error.message

                });

        }

    }
);


/* =========================================================
   UPDATE
========================================================= */

app.put(
    "/api/order-status-histories/:id",

    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            console.log(
                `UPDATE ORDER STATUS HISTORY ${id}:`,
                req.body
            );


            const response =
                await axios.put(

                    `${DOTNET_API}/order-status-histories/${id}`,

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

        }
        catch (error) {

            console.error(
                "UPDATE HISTORY ERROR:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({

                    success: false,

                    message:
                        error.response?.data?.message ||
                        "Unable to update order status history.",

                    error:
                        error.response?.data ||
                        error.message

                });

        }

    }
);


/* =========================================================
   DELETE
========================================================= */

app.delete(
    "/api/order-status-histories/:id",

    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            console.log(
                `DELETE ORDER STATUS HISTORY ${id}`
            );


            const response =
                await axios.delete(

                    `${DOTNET_API}/order-status-histories/${id}`,

                    {
                        httpsAgent
                    }

                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "DELETE HISTORY ERROR:",
                error.message
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({

                    success: false,

                    message:
                        error.response?.data?.message ||
                        "Unable to delete order status history.",

                    error:
                        error.response?.data ||
                        error.message

                });

        } 

    }
);
// =========================================================
// CREATE ORDER STATUS HISTORY
// =========================================================
//
// React:
// POST http://localhost:5000/api/order-status-histories
//
// ASP.NET:
// POST https://localhost:7203/api/order-status-histories
// =========================================================

app.post(
    "/api/order-status-histories",
    async (req, res) => {

        try {

            console.log(
                "=============================================="
            );

            console.log(
                "CREATE ORDER STATUS HISTORY"
            );

            console.log(
                "REQUEST BODY:",
                req.body
            );


            /* =================================================
               VALIDATE REQUEST BODY
            ================================================= */

            if (
                !req.body ||
                typeof req.body !== "object"
            ) {

                return res.status(400).json({
                    message:
                        "Request body is required."
                });

            }


            /* =================================================
               BUILD PAYLOAD
            ================================================= */

            const payload = {

                orderStatusHistoryId:
                    Number(
                        req.body.orderStatusHistoryId || 0
                    ),

                sellerId:
                    Number(
                        req.body.sellerId || 0
                    ),

                customerId:
                    Number(
                        req.body.customerId || 0
                    ),

                orderId:
                    Number(
                        req.body.orderId || 0
                    ),

                status:
                    String(
                        req.body.status || ""
                    ),

                remarks:
                    String(
                        req.body.remarks || ""
                    ),

                changedOn:
                    req.body.changedOn ||
                    new Date().toISOString()

            };


            console.log(
                "PAYLOAD SENT TO ASP.NET:"
            );

            console.log(
                JSON.stringify(
                    payload,
                    null,
                    2
                )
            );


            /* =================================================
               AUTHORIZATION
            ================================================= */

            const authorization =
                req.headers.authorization || "";


            /* =================================================
               CALL ASP.NET API
            ================================================= */

            const response =
                await axios.post(

                    `${DOTNET_API}/order-status-histories`,

                    payload,

                    {

                        httpsAgent,

                        headers: {

                            Accept:
                                "application/json",

                            "Content-Type":
                                "application/json",

                            ...(authorization
                                ? {
                                    Authorization:
                                        authorization
                                }
                                : {})

                        }

                    }

                );


            /* =================================================
               ASP.NET RESPONSE
            ================================================= */

            console.log(
                "ASP.NET STATUS:",
                response.status
            );

            console.log(
                "ASP.NET RESPONSE:",
                response.data
            );


            /* =================================================
               RETURN RESPONSE TO REACT
            ================================================= */

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "CREATE ORDER STATUS HISTORY ERROR:",
                error.message
            );


            console.error(
                "ASP.NET STATUS:",
                error.response?.status
            );


            console.error(
                "ASP.NET ERROR:",
                error.response?.data
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Unable to create order status history."
                    }
                );

        }

    }
);



///////////////////////////////////WISHLIST ////////////////////////
/* =========================================================
   WISHLIST - GET ALL
========================================================= */

app.get("/api/Wishlist", async (req, res) => {
    try {
        console.log("GET ALL WISHLISTS");

        const response = await axios.get(
            `${DOTNET_API}/Wishlist`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error(
            "GET WISHLIST ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json({
            message:
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to fetch wishlists"
        });
    }
});

/* =========================================================
   WISHLIST - GET BY ID
========================================================= */

app.get("/api/Wishlist/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log(
            `GET WISHLIST BY ID: ${id}`
        );

        const response = await axios.get(
            `${DOTNET_API}/Wishlist/${id}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error(
            "GET WISHLIST BY ID ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json({
            message:
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to fetch wishlist"
        });
    }
});

/* =========================================================
   WISHLIST - GET BY CUSTOMER
========================================================= */

app.get(
    "/api/Wishlist/customer/:customerId",
    async (req, res) => {
        try {
            const { customerId } = req.params;

            console.log(
                `GET WISHLISTS BY CUSTOMER: ${customerId}`
            );

            const response = await axios.get(
                `${DOTNET_API}/Wishlist/customer/${customerId}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {
            console.error(
                "GET CUSTOMER WISHLISTS ERROR:",
                error.response?.data || error.message
            );

            res.status(
                error.response?.status || 500
            ).json({
                message:
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to fetch customer wishlists"
            });
        }
    }
);

/* =========================================================
   WISHLIST - CREATE
========================================================= */

app.post("/api/Wishlist", async (req, res) => {
    try {
        console.log(
            "CREATE WISHLIST REQUEST:",
            JSON.stringify(req.body, null, 2)
        );

        const response = await axios.post(
            `${DOTNET_API}/Wishlist`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(response.status).json(
            response.data
        );

    } catch (error) {
        console.error(
            "CREATE WISHLIST ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json({
            message:
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to create wishlist"
        });
    }
});

/* =========================================================
   WISHLIST - UPDATE
========================================================= */

app.put("/api/Wishlist/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log(
            `UPDATE WISHLIST ${id}:`,
            JSON.stringify(req.body, null, 2)
        );

        const response = await axios.put(
            `${DOTNET_API}/Wishlist/${id}`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        res.status(response.status).json(
            response.data
        );

    } catch (error) {
        console.error(
            "UPDATE WISHLIST ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json({
            message:
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to update wishlist"
        });
    }
});

/* =========================================================
   WISHLIST - DELETE
========================================================= */

app.delete("/api/Wishlist/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log(
            `DELETE WISHLIST: ${id}`
        );

        const response = await axios.delete(
            `${DOTNET_API}/Wishlist/${id}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(
            response.data || {
                success: true,
                message: "Wishlist deleted successfully"
            }
        );

    } catch (error) {
        console.error(
            "DELETE WISHLIST ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json({
            message:
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to delete wishlist"
        });
    }
});
/////////////whishlist items/////////
/* =========================================================
   WISHLIST ITEMS
========================================================= */


/* =========================================================
   GET ALL WISHLIST ITEMS
========================================================= */

app.get("/api/WishlistItem", async (req, res) => {

    try {

        console.log("GET ALL WISHLIST ITEMS");

        const response = await axios.get(
            `${DOTNET_API}/WishlistItem`,
            {
                httpsAgent
            }
        );

        res
            .status(response.status)
            .json(response.data);

    } catch (error) {

        console.error(
            "GET ALL WISHLIST ITEMS ERROR:",
            error.response?.data || error.message
        );

        res
            .status(error.response?.status || 500)
            .json({
                message:
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to fetch wishlist items"
            });
    }
});


/* =========================================================
   CREATE WISHLIST ITEM
========================================================= */

app.post("/api/WishlistItem", async (req, res) => {

    try {

        console.log(
            "CREATE WISHLIST ITEM REQUEST:",
            JSON.stringify(req.body, null, 2)
        );

        const response = await axios.post(
            `${DOTNET_API}/WishlistItem`,
            req.body,
            {
                httpsAgent,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        res
            .status(response.status)
            .json(response.data);

    } catch (error) {

        console.error(
            "CREATE WISHLIST ITEM ERROR:",
            error.response?.data || error.message
        );

        res
            .status(error.response?.status || 500)
            .json({
                message:
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to create wishlist item"
            });
    }
});


/* =========================================================
   GET WISHLIST ITEMS BY WISHLIST
   IMPORTANT:
   This must come BEFORE /:id
========================================================= */

app.get(
    "/api/WishlistItem/wishlist/:wishlistId",
    async (req, res) => {

        try {

            const { wishlistId } = req.params;

            console.log(
                `GET WISHLIST ITEMS BY WISHLIST: ${wishlistId}`
            );

            const response = await axios.get(
                `${DOTNET_API}/WishlistItem/wishlist/${wishlistId}`,
                {
                    httpsAgent
                }
            );

            res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET WISHLIST ITEMS BY WISHLIST ERROR:",
                error.response?.data || error.message
            );

            res
                .status(error.response?.status || 500)
                .json({
                    message:
                        error.response?.data?.message ||
                        error.response?.data ||
                        "Failed to fetch wishlist items by wishlist"
                });
        }
    }
);


/* =========================================================
   GET WISHLIST ITEMS BY PRODUCT
   IMPORTANT:
   This must come BEFORE /:id
========================================================= */

app.get(
    "/api/WishlistItem/product/:productId",
    async (req, res) => {

        try {

            const { productId } = req.params;

            console.log(
                `GET WISHLIST ITEMS BY PRODUCT: ${productId}`
            );

            const response = await axios.get(
                `${DOTNET_API}/WishlistItem/product/${productId}`,
                {
                    httpsAgent
                }
            );

            res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET WISHLIST ITEMS BY PRODUCT ERROR:",
                error.response?.data || error.message
            );

            res
                .status(error.response?.status || 500)
                .json({
                    message:
                        error.response?.data?.message ||
                        error.response?.data ||
                        "Failed to fetch wishlist items by product"
                });
        }
    }
);


/* =========================================================
   GET WISHLIST ITEM BY ID
========================================================= */

app.get(
    "/api/WishlistItem/:id",
    async (req, res) => {

        try {

            const { id } = req.params;

            console.log(
                `GET WISHLIST ITEM BY ID: ${id}`
            );

            const response = await axios.get(
                `${DOTNET_API}/WishlistItem/${id}`,
                {
                    httpsAgent
                }
            );

            res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET WISHLIST ITEM BY ID ERROR:",
                error.response?.data || error.message
            );

            res
                .status(error.response?.status || 500)
                .json({
                    message:
                        error.response?.data?.message ||
                        error.response?.data ||
                        "Failed to fetch wishlist item"
                });
        }
    }
);


/* =========================================================
   UPDATE WISHLIST ITEM
========================================================= */

app.put(
    "/api/WishlistItem/:id",
    async (req, res) => {

        try {

            const { id } = req.params;

            console.log(
                `UPDATE WISHLIST ITEM ${id}:`,
                JSON.stringify(req.body, null, 2)
            );

            const response = await axios.put(
                `${DOTNET_API}/WishlistItem/${id}`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "UPDATE WISHLIST ITEM ERROR:",
                error.response?.data || error.message
            );

            res
                .status(error.response?.status || 500)
                .json({
                    message:
                        error.response?.data?.message ||
                        error.response?.data ||
                        "Failed to update wishlist item"
                });
        }
    }
);


/* =========================================================
   DELETE WISHLIST ITEM
========================================================= */

app.delete(
    "/api/WishlistItem/:id",
    async (req, res) => {

        try {

            const { id } = req.params;

            console.log(
                `DELETE WISHLIST ITEM: ${id}`
            );

            const response = await axios.delete(
                `${DOTNET_API}/WishlistItem/${id}`,
                {
                    httpsAgent
                }
            );

            res
                .status(response.status)
                .json(
                    response.data || {
                        success: true,
                        message:
                            "Wishlist item deleted successfully"
                    }
                );

        } catch (error) {

            console.error(
                "DELETE WISHLIST ITEM ERROR:",
                error.response?.data || error.message
            );

            res
                .status(error.response?.status || 500)
                .json({
                    message:
                        error.response?.data?.message ||
                        error.response?.data ||
                        "Failed to delete wishlist item"
                });
        }
    }
);






//////////////////// stock transfer  /////////////

// =========================================================
// STOCK TRANSFER API ROUTES


// =========================================================
// STOCK TRANSFER API
// =========================================================
// React → Node → ASP.NET Core
//
// React:
// http://localhost:5000/api/stock-transfers
//
// ASP.NET:
// https://localhost:7203/api/StockTransfer
//
// IMPORTANT:
// - Keep only ONE copy of this entire section.
// - Static routes must appear before /:stockTransferId.
// - Every Axios request uses the shared httpsAgent.
// =========================================================


// =========================================================
// HTTPS CONFIGURATION
// =========================================================
// Put this near the TOP of server.js.
// Do NOT declare another httpsAgent elsewhere.

// =========================================================
// COMMON ERROR HANDLER
// =========================================================

function handleStockTransferError(
    res,
    error,
    defaultMessage
) {

    console.error(
        "========================================"
    );

    console.error(
        "STOCK TRANSFER ERROR"
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
                message: defaultMessage
            }
        );
}


// =========================================================
// GET ALL STOCK TRANSFERS
// =========================================================
//
// React:
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
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        }
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

            return handleStockTransferError(
                res,
                error,
                "Failed to get stock transfers."
            );
        }
    }
);


// =========================================================
// SEARCH STOCK TRANSFERS
// =========================================================
//
// React:
// GET /api/stock-transfers/search?search=ST-001
//
// .NET:
// GET /api/StockTransfer/search?search=ST-001
//
// IMPORTANT:
// This route must be BEFORE /:stockTransferId.
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
                "========================================"
            );

            if (!search) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Search value is required."
                    });
            }

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/search`,
                    {
                        httpsAgent,

                        params: {
                            search
                        },

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            console.log(
                "Search Response:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            return handleStockTransferError(
                res,
                error,
                "Failed to search stock transfers."
            );
        }
    }
);


// =========================================================
// GET STOCK TRANSFER STATISTICS
// =========================================================
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
                "========================================"
            );

            console.log(
                "GET STOCK TRANSFER STATISTICS"
            );

            console.log(
                "Backend:",
                `${BASE_URL}/StockTransfer/statistics`
            );

            console.log(
                "========================================"
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/statistics`,
                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        }
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

            return handleStockTransferError(
                res,
                error,
                "Failed to load stock transfer statistics."
            );
        }
    }
);


// =========================================================
// GET STOCK TRANSFERS BY SELLER
// =========================================================
//
// React:
// GET /api/stock-transfers/seller/6
//
// .NET:
// GET /api/StockTransfer/seller/6
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
                            "Invalid seller ID."
                    });
            }

            console.log(
                "GET STOCK TRANSFERS BY SELLER:",
                sellerId
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/seller/${sellerId}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            return handleStockTransferError(
                res,
                error,
                "Failed to get stock transfers by seller."
            );
        }
    }
);


// =========================================================
// GET STOCK TRANSFERS BY PRODUCT
// =========================================================
//
// React:
// GET /api/stock-transfers/product/6
//
// .NET:
// GET /api/StockTransfer/product/6
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
                            "Invalid product ID."
                    });
            }

            console.log(
                "GET STOCK TRANSFERS BY PRODUCT:",
                productId
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/product/${productId}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            return handleStockTransferError(
                res,
                error,
                "Failed to get stock transfers by product."
            );
        }
    }
);


// =========================================================
// GET STOCK TRANSFERS BY FROM WAREHOUSE
// =========================================================
//
// React:
// GET /api/stock-transfers/fromwarehouse/3
//
// .NET:
// GET /api/StockTransfer/fromwarehouse/3
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
                !Number.isInteger(fromWarehouseId) ||
                fromWarehouseId <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid from warehouse ID."
                    });
            }

            console.log(
                "GET STOCK TRANSFERS BY FROM WAREHOUSE:",
                fromWarehouseId
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/fromwarehouse/${fromWarehouseId}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            return handleStockTransferError(
                res,
                error,
                "Failed to get stock transfers by from warehouse."
            );
        }
    }
);


// =========================================================
// GET STOCK TRANSFERS BY TO WAREHOUSE
// =========================================================
//
// React:
// GET /api/stock-transfers/towarehouse/4
//
// .NET:
// GET /api/StockTransfer/towarehouse/4
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
                !Number.isInteger(toWarehouseId) ||
                toWarehouseId <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid to warehouse ID."
                    });
            }

            console.log(
                "GET STOCK TRANSFERS BY TO WAREHOUSE:",
                toWarehouseId
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/towarehouse/${toWarehouseId}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            return handleStockTransferError(
                res,
                error,
                "Failed to get stock transfers by to warehouse."
            );
        }
    }
);


// =========================================================
// GET STOCK TRANSFERS BY STATUS
// =========================================================
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
                            "Status is required."
                    });
            }

            console.log(
                "GET STOCK TRANSFERS BY STATUS:",
                status
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/status/${encodeURIComponent(status)}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            return handleStockTransferError(
                res,
                error,
                "Failed to get stock transfers by status."
            );
        }
    }
);


// =========================================================
// SORT STOCK TRANSFERS
// =========================================================
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

            console.log(
                "STOCK TRANSFER SORT:",
                sort
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/sort`,
                    {
                        httpsAgent,

                        params: {
                            sort:
                                sort || undefined
                        },

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            return handleStockTransferError(
                res,
                error,
                "Failed to sort stock transfers."
            );
        }
    }
);


// =========================================================
// PAGINATION
// =========================================================
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

            console.log(
                "STOCK TRANSFER PAGINATION:",
                {
                    page,
                    limit
                }
            );

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/page`,
                    {
                        httpsAgent,

                        params: {
                            page,
                            limit
                        },

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            return handleStockTransferError(
                res,
                error,
                "Failed to load paginated stock transfers."
            );
        }
    }
);


// =========================================================
// GET STOCK TRANSFER BY ID
// =========================================================
//
// IMPORTANT:
// This MUST remain AFTER all static GET routes.
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

            const stockTransferId =
                Number(
                    req.params.stockTransferId
                );

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
                "Backend:",
                `${BASE_URL}/StockTransfer/${stockTransferId}`
            );

            console.log(
                "========================================"
            );

            if (
                !Number.isInteger(stockTransferId) ||
                stockTransferId <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid stock transfer ID."
                    });
            }

            const response =
                await axios.get(
                    `${BASE_URL}/StockTransfer/${stockTransferId}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            console.log(
                "Backend Response:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            if (
                error?.response?.status === 404
            ) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Stock transfer not found."
                    });
            }

            return handleStockTransferError(
                res,
                error,
                "Failed to load stock transfer."
            );
        }
    }
);


// =========================================================
// CREATE STOCK TRANSFER
// =========================================================
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
                        httpsAgent,

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        }
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

            return handleStockTransferError(
                res,
                error,
                "Failed to create stock transfer."
            );
        }
    }
);


// =========================================================
// UPDATE STOCK TRANSFER
// =========================================================
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

            const stockTransferId =
                Number(
                    req.params.stockTransferId
                );

            console.log(
                "========================================"
            );

            console.log(
                "UPDATE STOCK TRANSFER"
            );

            console.log(
                "ID:",
                stockTransferId
            );

            console.log(
                "Payload:",
                req.body
            );

            console.log(
                "Backend:",
                `${BASE_URL}/StockTransfer/${stockTransferId}`
            );

            console.log(
                "========================================"
            );

            if (
                !Number.isInteger(stockTransferId) ||
                stockTransferId <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid stock transfer ID."
                    });
            }

            const response =
                await axios.put(
                    `${BASE_URL}/StockTransfer/${stockTransferId}`,
                    req.body,
                    {
                        httpsAgent,

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        }
                    }
                );

            console.log(
                "Update Response:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            if (
                error?.response?.status === 404
            ) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Stock transfer not found."
                    });
            }

            return handleStockTransferError(
                res,
                error,
                "Failed to update stock transfer."
            );
        }
    }
);


// =========================================================
// DELETE STOCK TRANSFER
// =========================================================
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

            const stockTransferId =
                Number(
                    req.params.stockTransferId
                );

            console.log(
                "========================================"
            );

            console.log(
                "DELETE STOCK TRANSFER"
            );

            console.log(
                "ID:",
                stockTransferId
            );

            console.log(
                "Backend:",
                `${BASE_URL}/StockTransfer/${stockTransferId}`
            );

            console.log(
                "========================================"
            );

            if (
                !Number.isInteger(stockTransferId) ||
                stockTransferId <= 0
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid stock transfer ID."
                    });
            }

            const response =
                await axios.delete(
                    `${BASE_URL}/StockTransfer/${stockTransferId}`,
                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );

            console.log(
                "Delete Response:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            if (
                error?.response?.status === 404
            ) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Stock transfer not found."
                    });
            }

            return handleStockTransferError(
                res,
                error,
                "Failed to delete stock transfer."
            );
        }
    }
);


// =========================================================
// END STOCK TRANSFER API
// =========================================================


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
// ========================================================= // GET ALL // GET /api/StockAdjustment // ========================================================= 
 app.get( "/api/StockAdjustment", async (req, res) => 
{ 
try 
{ 
    const response = await axios.get( `${DOTNET_API}/StockAdjustment`, 
 { 
    httpsAgent, 
    headers: { Accept: "application/json", ...(req.headers.authorization ? 
    { 
    Authorization: req.headers.authorization } : {}) 
    } 
    } 
    ); 
    return res .status(response.status) .json(response.data); } 
    catch (error) 
    { 
    console.error( "GET StockAdjustment Error:", error.response?.data || error.message ); 
    return res .status( error.response?.status || 500 ) .json( error.response?.data || 
 { 
    message: "Failed to load stock adjustments." } ); 
  } } 
);

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


// =========================================================
// GET ALL PRODUCT IMAGES
// ASP.NET:
// GET /api/product-images/all
// =========================================================

app.get("/api/product-images/all", async (req, res) => {

    try {

        console.log(
            "GET /api/product-images/all"
        );

        const response = await axios.get(
            `${DOTNET_API}/product-images/all`,
            {
                httpsAgent
            }
        );

        console.log(
            "ASP.NET Product Images Status:",
            response.status
        );

        res
            .status(response.status)
            .json(response.data);

    } catch (error) {

        console.error(
            "GET /api/product-images/all Error:",
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
                        "Failed to fetch product images"
                }
            );
    }
});


// =========================================================
// PRODUCT IMAGE STATISTICS
// ASP.NET:
// GET /api/product-images/stats
// =========================================================

app.get(
    "/api/product-images/stats",
    async (req, res) => {

        try {

            console.log(
                "GET /api/product-images/stats"
            );

            const response = await axios.get(
                `${DOTNET_API}/product-images/stats`,
                {
                    httpsAgent
                }
            );

            console.log(
                "ASP.NET Product Image Statistics Status:",
                response.status
            );

            res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "Product Image Statistics Proxy Error:",
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
                            "Failed to load product image statistics."
                    }
                );
        }
    }
);


// =========================================================
// GET PRODUCT IMAGE BY ID
//
// React:
// GET http://localhost:5000/api/product-images/1
//
// Node forwards to:
// GET https://localhost:7203/api/product-images/1
//
// ASP.NET:
// [HttpGet("{productImageId}")]
// =========================================================

app.get(
    "/api/product-images/:id",
    async (req, res) => {

        try {

            const { id } = req.params;

            console.log(
                "========================================"
            );

            console.log(
                "GET PRODUCT IMAGE BY ID"
            );

            console.log(
                "ID:",
                id
            );

            console.log(
                "Forward URL:",
                `${DOTNET_API}/product-images/${id}`
            );

            console.log(
                "========================================"
            );


            const response = await axios.get(
                `${DOTNET_API}/product-images/${id}`,
                {
                    httpsAgent
                }
            );


            console.log(
                "ASP.NET Status:",
                response.status
            );


            res
                .status(response.status)
                .json(response.data);


        } catch (error) {

            console.error(
                "========================================"
            );

            console.error(
                "GET PRODUCT IMAGE ERROR"
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Response:",
                error.response?.data
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "========================================"
            );


            res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to fetch product image"
                    }
                );
        }
    }
);


// =========================================================
// GET PRODUCT IMAGES BY PRODUCT ID
//
// React:
// GET /api/product-images/product/6
//
// ASP.NET:
// GET /api/product-images/product/6
// =========================================================

app.get(
    "/api/product-images/product/:productId",
    async (req, res) => {

        try {

            const { productId } =
                req.params;

            console.log(
                `GET /api/product-images/product/${productId}`
            );


            const response = await axios.get(
                `${DOTNET_API}/product-images/product/${productId}`,
                {
                    httpsAgent
                }
            );


            res
                .status(response.status)
                .json(response.data);


        } catch (error) {

            console.error(
                "GET Product Images By Product Error:",
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
                            "Failed to fetch product images"
                    }
                );
        }
    }
);


// =========================================================
// GET PRIMARY IMAGES
//
// ASP.NET:
// GET /api/product-images/primary
// =========================================================

app.get(
    "/api/product-images/primary",
    async (req, res) => {

        try {

            console.log(
                "GET /api/product-images/primary"
            );


            const response = await axios.get(
                `${DOTNET_API}/product-images/primary`,
                {
                    httpsAgent
                }
            );


            res
                .status(response.status)
                .json(response.data);


        } catch (error) {

            console.error(
                "GET Primary Product Images Error:",
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
                            "Failed to fetch primary images"
                    }
                );
        }
    }
);


// =========================================================
// GET PRIMARY IMAGE BY PRODUCT ID
//
// ASP.NET:
// GET /api/product-images/primary/{productId}
// =========================================================

app.get(
    "/api/product-images/primary/:productId",
    async (req, res) => {

        try {

            const { productId } =
                req.params;


            console.log(
                `GET /api/product-images/primary/${productId}`
            );


            const response = await axios.get(
                `${DOTNET_API}/product-images/primary/${productId}`,
                {
                    httpsAgent
                }
            );


            res
                .status(response.status)
                .json(response.data);


        } catch (error) {

            console.error(
                "GET Primary Product Image Error:",
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
                            "Failed to fetch primary image"
                    }
                );
        }
    }
);


// =========================================================
// CREATE PRODUCT IMAGE
//
// ASP.NET:
// POST /api/product-images
// =========================================================

app.post(
    "/api/product-images",
    async (req, res) => {

        try {

            console.log(
                "POST /api/product-images"
            );

            console.log(
                "Request Body:",
                req.body
            );


            const response = await axios.post(
                `${DOTNET_API}/product-images`,
                req.body,
                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    httpsAgent
                }
            );


            res
                .status(response.status)
                .json(response.data);


        } catch (error) {

            console.error(
                "POST Product Image Error:",
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
                            "Failed to create product image"
                    }
                );
        }
    }
);


// =========================================================
// UPDATE PRODUCT IMAGE
//
// ASP.NET:
// PUT /api/product-images/{productImageId}
// =========================================================

app.put(
    "/api/product-images/:id",
    async (req, res) => {

        try {

            const { id } =
                req.params;


            console.log(
                `PUT /api/product-images/${id}`
            );


            const response = await axios.put(
                `${DOTNET_API}/product-images/${id}`,
                req.body,
                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    httpsAgent
                }
            );


            res
                .status(response.status)
                .json(response.data);


        } catch (error) {

            console.error(
                "PUT Product Image Error:",
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
                            "Failed to update product image"
                    }
                );
        }
    }
);


// =========================================================
// DELETE PRODUCT IMAGE
//
// ASP.NET:
// DELETE /api/product-images/{productImageId}
// =========================================================

app.delete(
    "/api/product-images/:id",
    async (req, res) => {

        try {

            const { id } =
                req.params;


            console.log(
                `DELETE /api/product-images/${id}`
            );


            const response = await axios.delete(
                `${DOTNET_API}/product-images/${id}`,
                {
                    httpsAgent
                }
            );


            res
                .status(response.status)
                .json(response.data);


        } catch (error) {

            console.error(
                "DELETE Product Image Error:",
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
                            "Failed to delete product image"
                    }
                );
        }
    }
);


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
// PRODUCT PRICE - GET BY ID
// =========================================================

app.get("/api/product-prices/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const response = await axios.get(
            `${DOTNET_API}/product-prices/${id}`,
            {
                httpsAgent,
                headers: {
                    Accept: "*/*",
                },
            }
        );

        res.status(response.status).json(
            response.data
        );

    } catch (error) {

        console.error(
            "Product Price GET Error:",
            error.response?.data ||
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message:
                    "Unable to get Product Price."
            }
        );
    }
});

app.get("/api/product-prices/stats", async (req, res) => {

    try {

        const response = await axios.get(
            `${DOTNET_API}/product-prices/stats`,
            {
                httpsAgent,
                headers: {
                    Accept: "*/*",
                },
            }
        );

        res.status(response.status).json(
            response.data
        );

    } catch (error) {

        console.error(
            "Product Price Stats Error:",
            error.response?.data ||
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message:
                    "Unable to load Product Price statistics."
            }
        );
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
// GET ALL PRODUCT INVENTORIES
// =========================================================
//
// React:
// GET http://localhost:5000/api/product-inventories/all
//
// ASP.NET:
// GET https://localhost:7203/api/product-inventories/all
// =========================================================

app.get(
    "/api/product-inventories/all",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/product-inventories/all`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET /api/product-inventories/all Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to fetch all product inventories.",
                        error: error.message
                    }
                );
        }
    }
);


// =========================================================
// GET PRODUCT INVENTORIES
// =========================================================
//
// React:
// GET http://localhost:5000/api/product-inventories
//
// Optional query parameters:
//
// ?search=abc
// ?status=Active
// ?sort=quantity
// ?page=1&limit=10
//
// Node forwards the query parameters to ASP.NET.
// =========================================================

app.get(
    "/api/product-inventories",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/product-inventories`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET Product Inventories Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load product inventories.",
                        error: error.message
                    }
                );
        }
    }
);


// =========================================================
// GET PRODUCT INVENTORY STATISTICS
// =========================================================
//
// React:
// GET http://localhost:5000/api/product-inventories/stats
//
// ASP.NET:
// GET https://localhost:7203/api/product-inventories/stats
// =========================================================

app.get(
    "/api/product-inventories/stats",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/product-inventories/stats`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET Product Inventory Statistics Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load inventory statistics.",
                        error: error.message
                    }
                );
        }
    }
);


// =========================================================
// GET PRODUCT INVENTORY BY ID
// =========================================================
//
// React:
// GET http://localhost:5000/api/product-inventories/1
//
// ASP.NET:
// GET https://localhost:7203/api/product-inventories/1
// =========================================================

app.get(
    "/api/product-inventories/:productInventoryId",
    async (req, res) => {

        try {

            const {
                productInventoryId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/product-inventories/${productInventoryId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET Product Inventory By ID Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Product inventory not found.",
                        error: error.message
                    }
                );
        }
    }
);


// =========================================================
// GET INVENTORY BY PRODUCT
// =========================================================
//
// React:
// GET http://localhost:5000/api/product-inventories/product/1
//
// ASP.NET:
// GET https://localhost:7203/api/product-inventories/product/1
// =========================================================

app.get(
    "/api/product-inventories/product/:productId",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/product-inventories/product/${productId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET Inventory By Product Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load product inventory.",
                        error: error.message
                    }
                );
        }
    }
);


// =========================================================
// GET INVENTORIES BY PRODUCT IDS
// =========================================================
//
// React:
// POST http://localhost:5000/api/product-inventories/products
//
// Body:
//
// [
//     1,
//     2,
//     3
// ]
//
// ASP.NET:
// POST https://localhost:7203/api/product-inventories/products
// =========================================================

app.post(
    "/api/product-inventories/products",
    async (req, res) => {

        try {

            const response = await axios.post(
                `${DOTNET_API}/product-inventories/products`,
                req.body,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "POST Product IDs Inventory Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load product inventories.",
                        error: error.message
                    }
                );
        }
    }
);


// =========================================================
// GET INVENTORY BY SELLER
// =========================================================
//
// React:
// GET http://localhost:5000/api/product-inventories/seller/6
//
// ASP.NET:
// GET https://localhost:7203/api/product-inventories/seller/6
// =========================================================

app.get(
    "/api/product-inventories/seller/:sellerId",
    async (req, res) => {

        try {

            const {
                sellerId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/product-inventories/seller/${sellerId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET Inventory By Seller Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load seller inventory.",
                        error: error.message
                    }
                );
        }
    }
);

// ============================================================
// CATALOG API
// React -> Node server.js -> ASP.NET Core
// ============================================================
//
// ASP.NET Base:
// https://localhost:7203/api
//
// Node Base:
// http://localhost:5000/api
//
// Uses Axios directly
// ============================================================


// ============================================================
// GET ALL CATALOG PRODUCTS
// ============================================================
//
// GET
// http://localhost:5000/api/catalog/products/all
//
// ASP.NET:
// https://localhost:7203/api/catalog/products/all
// ============================================================

app.get(
    "/api/catalog/products/all",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/products/all`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET ALL CATALOG PRODUCTS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load all catalog products."
                    }
                );
        }
    }
);

//
// ASP.NET
// =========================================================

app.get(
    "/api/catalog/categories",
    async (req, res) => {

        try {

            // =================================================
            // GET QUERY PARAMETERS
            // =================================================

            const {
                sellerId,
                customerId
            } = req.query;


            // =================================================
            // VALIDATION
            // =================================================

            if (!sellerId) {

                return res.status(400).json({
                    success: false,
                    message: "sellerId is required"
                });

            }

            if (!customerId) {

                return res.status(400).json({
                    success: false,
                    message: "customerId is required"
                });

            }


            // =================================================
            // CALL ASP.NET API
            // =================================================

            const response =
                await dotnetClient.get(
                    "/catalog/categories",
                    {
                        params: {
                            sellerId: Number(sellerId),
                            customerId: Number(customerId)
                        }
                    }
                );


            // =================================================
            // RETURN ASP.NET RESPONSE TO REACT
            // =================================================

            return res.status(200).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET /api/catalog/categories ERROR:",
                error.response?.data ||
                error.message
            );


            return res.status(
                error.response?.status || 500
            ).json({

                success: false,

                message:
                    error.response?.data?.message ||
                    "Failed to load catalog categories.",

                error:
                    error.response?.data ||
                    error.message

            });

        }

    }
);

// ============================================================
// GET ALL CATALOG
// ============================================================
//
// GET
// http://localhost:5000/api/catalog/all
//
// ASP.NET:
// https://localhost:7203/api/catalog/all
// ============================================================

app.get(
    "/api/catalog/all",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/all`,
                    {
                        httpsAgent,

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET ALL CATALOG ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load catalog."
                    }
                );
        }
    }
);


// ============================================================
// GET PRODUCTS BY SELLER + CUSTOMER
// ============================================================
//
// GET
// /api/catalog/products?sellerId=6&customerId=3
//
// ASP.NET:
// /api/catalog/products?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/products",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/products`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET CATALOG PRODUCTS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load catalog products."
                    }
                );
        }
    }
);


// ============================================================
// GET PRODUCT BY ID
// ============================================================
//
// GET
// /api/catalog/6?sellerId=6&customerId=3
//
// ASP.NET:
// /api/catalog/6?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/:productId",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/${productId}`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET CATALOG PRODUCT BY ID ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load product."
                    }
                );
        }
    }
);


// ============================================================
// GET PRODUCT DETAILS
// ============================================================
//
// GET
// /api/catalog/products/6?sellerId=6&customerId=3
//
// ASP.NET:
// /api/catalog/products/6?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/products/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/products/${Number(id)}`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET CATALOG PRODUCT DETAILS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load product details."
                    }
                );
        }
    }
);

// ================================================================
// CATALOG SEARCH
// ================================================================

//
// ================================================================

app.post(
    "/api/catalog/search",
    async (req, res) => {

        try {

            // ====================================================
            // READ QUERY PARAMETERS
            // ====================================================

            const {
                sellerId,
                customerId
            } = req.query;

            // ====================================================
            // READ SEARCH BODY
            // ====================================================

            const {
                search,
                sku,
                productName,
                brandId,
                categoryId,
                productTypeId,
                isActive
            } = req.body || {};

            // ====================================================
            // VALIDATE SELLER
            // ====================================================

            if (
                sellerId === undefined ||
                sellerId === null ||
                sellerId === ""
            ) {

                return res.status(400).json({
                    message:
                        "sellerId is required."
                });

            }

            // ====================================================
            // VALIDATE CUSTOMER
            // ====================================================

            if (
                customerId === undefined ||
                customerId === null ||
                customerId === ""
            ) {

                return res.status(400).json({
                    message:
                        "customerId is required."
                });

            }

            // ====================================================
            // BUILD ASP.NET REQUEST BODY
            // ====================================================
            //
            // ProductSearchRequest
            //
            // Keep the fields that are supplied by React.
            //
            // ====================================================

            const requestBody = {};

            if (
                search !== undefined &&
                search !== null
            ) {

                requestBody.search =
                    String(search).trim();

            }

            if (
                sku !== undefined &&
                sku !== null
            ) {

                requestBody.sku =
                    String(sku).trim();

            }

            if (
                productName !== undefined &&
                productName !== null
            ) {

                requestBody.productName =
                    String(productName).trim();

            }

            if (
                brandId !== undefined &&
                brandId !== null &&
                brandId !== ""
            ) {

                requestBody.brandId =
                    Number(brandId);

            }

            if (
                categoryId !== undefined &&
                categoryId !== null &&
                categoryId !== ""
            ) {

                requestBody.categoryId =
                    Number(categoryId);

            }

            if (
                productTypeId !== undefined &&
                productTypeId !== null &&
                productTypeId !== ""
            ) {

                requestBody.productTypeId =
                    Number(productTypeId);

            }

            if (
                isActive !== undefined &&
                isActive !== null &&
                isActive !== ""
            ) {

                requestBody.isActive =
                    Boolean(isActive);

            }

            // ====================================================
            // VALIDATE SEARCH BODY
            // ====================================================

            if (
                Object.keys(requestBody).length === 0
            ) {

                return res.status(400).json({
                    message:
                        "At least one search parameter is required."
                });

            }

            // ====================================================
            // LOG REQUEST
            // ====================================================

            console.log(
                "================================================"
            );

            console.log(
                "CATALOG SEARCH REQUEST"
            );

            console.log(
                "Seller ID:",
                sellerId
            );

            console.log(
                "Customer ID:",
                customerId
            );

            console.log(
                "Search Body:",
                requestBody
            );

            console.log(
                "================================================"
            );

            // ====================================================
            // CALL ASP.NET
            // ====================================================

            const response =
                await dotnetClient.post(
                    "/catalog/search",
                    requestBody,
                    {
                        params: {
                            sellerId:
                                Number(sellerId),

                            customerId:
                                Number(customerId)
                        },

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json"
                        }
                    }
                );

            // ====================================================
            // LOG RESPONSE
            // ====================================================

            console.log(
                "CATALOG SEARCH STATUS:",
                response.status
            );

            console.log(
                "CATALOG SEARCH RESPONSE:",
                response.data
            );

            // ====================================================
            // RETURN ASP.NET RESPONSE TO REACT
            // ====================================================

            return res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            // ====================================================
            // LOG ERROR
            // ====================================================

            console.error(
                "CATALOG SEARCH ERROR:",
                error?.response?.data ||
                error.message
            );

            // ====================================================
            // ASP.NET ERROR
            // ====================================================

            if (error.response) {

                return res.status(
                    error.response.status
                ).json(
                    error.response.data
                );

            }

            // ====================================================
            // NODE ERROR
            // ====================================================

            return res.status(500).json({

                message:
                    "Failed to search catalog products.",

                error:
                    error.message

            });

        }

    }
);
// =========================================================
// GET CATALOG PRODUCT DETAILS BY ID
// =========================================================
//
// React:
// GET
// http://localhost:5000/api/catalog/products/6
//     ?sellerId=6
//     &customerId=3
//
// ASP.NET:
// GET
// https://localhost:7203/api/catalog/products/6
//     ?sellerId=6
//     &customerId=3
// =========================================================

app.get(
    "/api/catalog/products/:id",
    async (req, res) => {

        try {

            // =================================================
            // ROUTE PARAMETER
            // =================================================

            const { id } = req.params;


            // =================================================
            // QUERY PARAMETERS
            // =================================================

            const {
                sellerId,
                customerId
            } = req.query;


            // =================================================
            // VALIDATE PRODUCT ID
            // =================================================

            const productId = Number(id);

            if (
                !id ||
                !Number.isInteger(productId) ||
                productId <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Valid product ID is required."
                });

            }


            // =================================================
            // VALIDATE SELLER ID
            // =================================================

            const seller = Number(sellerId);

            if (
                !sellerId ||
                !Number.isInteger(seller) ||
                seller <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Valid sellerId is required."
                });

            }


            // =================================================
            // VALIDATE CUSTOMER ID
            // =================================================

            const customer = Number(customerId);

            if (
                !customerId ||
                !Number.isInteger(customer) ||
                customer <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Valid customerId is required."
                });

            }


            // =================================================
            // DEBUG LOG
            // =================================================

            console.log(
                "================================================"
            );

            console.log(
                "GET CATALOG PRODUCT DETAILS"
            );

            console.log(
                "Product ID:",
                productId
            );

            console.log(
                "Seller ID:",
                seller
            );

            console.log(
                "Customer ID:",
                customer
            );

            console.log(
                "ASP.NET URL:",
                `/catalog/products/${productId}`
            );

            console.log(
                "================================================"
            );


            // =================================================
            // CALL ASP.NET API
            // =================================================

            const response =
                await dotnetClient.get(
                    `/catalog/products/${productId}`,
                    {
                        params: {
                            sellerId: seller,
                            customerId: customer
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );


            // =================================================
            // LOG RESPONSE
            // =================================================

            console.log(
                "CATALOG PRODUCT DETAILS RESPONSE:",
                response.data
            );


            // =================================================
            // RETURN TO REACT
            // =================================================

            return res.status(200).json(
                response.data
            );


        } catch (error) {

            // =================================================
            // ERROR LOGGING
            // =================================================

            console.error(
                "================================================"
            );

            console.error(
                "GET CATALOG PRODUCT BY ID ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "ASP.NET RESPONSE:",
                error.response?.data
            );

            console.error(
                "REQUEST:",
                error.config?.url
            );

            console.error(
                "METHOD:",
                error.config?.method
            );

            console.error(
                "================================================"
            );


            // =================================================
            // RETURN ERROR
            // =================================================

            return res.status(
                error.response?.status || 500
            ).json({

                success: false,

                message:
                    error.response?.data?.message ||
                    "Failed to load product.",

                error:
                    error.response?.data ||
                    error.message

            });

        }

    }
);







// ============================================================
// SEARCH PRODUCTS
// ============================================================
//
// POST
// /api/catalog/search?sellerId=6&customerId=3
//
// Body:
// {
//     "search": "headphones"
// }
// ============================================================

app.post(
    "/api/catalog/search",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.post(
                    `${DOTNET_API}/catalog/search`,
                    req.body,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json",
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "SEARCH CATALOG ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to search catalog products."
                    }
                );
        }
    }
);


// ============================================================
// CREATE PRODUCT
// ============================================================
//
// POST
// /api/catalog/products
// ============================================================

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
                            Accept: "application/json",
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "CREATE CATALOG PRODUCT ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to create product."
                    }
                );
        }
    }
);


// ============================================================
// GET BRANDS
// ============================================================
//
// GET
// /api/catalog/brands?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/brands",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/brands`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET CATALOG BRANDS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load catalog brands."
                    }
                );
        }
    }
);


// ============================================================
// GET CATEGORIES
// ============================================================
//
// GET
// /api/catalog/categories?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/categories",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/categories`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET CATALOG CATEGORIES ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load catalog categories."
                    }
                );
        }
    }
);


// ============================================================
// PRODUCTS BY BRAND
// ============================================================
//
// GET
// /api/catalog/brand/3?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/brand/:brandId",
    async (req, res) => {

        try {

            const {
                brandId
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/brand/${brandId}`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET PRODUCTS BY BRAND ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load products by brand."
                    }
                );
        }
    }
);


// ============================================================
// PRODUCTS BY CATEGORY
// ============================================================
//
// GET
// /api/catalog/category/5?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/category/:categoryId",
    async (req, res) => {

        try {

            const {
                categoryId
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/category/${categoryId}`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET PRODUCTS BY CATEGORY ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load products by category."
                    }
                );
        }
    }
);


// ============================================================
// PRODUCTS BY PRODUCT TYPE
// ============================================================
//
// GET
// /api/catalog/producttype/9?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/producttype/:productTypeId",
    async (req, res) => {

        try {

            const {
                productTypeId
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/producttype/${productTypeId}`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET PRODUCTS BY PRODUCT TYPE ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load products by product type."
                    }
                );
        }
    }
);


// ============================================================
// LATEST PRODUCTS
// ============================================================
//
// GET
// /api/catalog/latest?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/latest",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/latest`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET LATEST CATALOG PRODUCTS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load latest products."
                    }
                );
        }
    }
);


// ============================================================
// FEATURED PRODUCTS
// ============================================================
//
// GET
// /api/catalog/featured?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/featured",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/featured`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET FEATURED CATALOG PRODUCTS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load featured products."
                    }
                );
        }
    }
);


// ============================================================
// TOP RATED PRODUCTS
// ============================================================
//
// GET
// /api/catalog/toprated?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/toprated",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/toprated`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET TOP RATED CATALOG PRODUCTS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load top rated products."
                    }
                );
        }
    }
);


// ============================================================
// BESTSELLERS
// ============================================================
//
// GET
// /api/catalog/bestsellers?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/bestsellers",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/bestsellers`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET BESTSELLERS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load best selling products."
                    }
                );
        }
    }
);


// ============================================================
// PRODUCT IMAGES
// ============================================================
//
// GET
// /api/catalog/6/images?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/:productId/images",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/${productId}/images`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET PRODUCT IMAGES ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load product images."
                    }
                );
        }
    }
);


// ============================================================
// PRODUCT ATTRIBUTES
// ============================================================
//
// GET
// /api/catalog/6/attributes?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/:productId/attributes",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/${productId}/attributes`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET PRODUCT ATTRIBUTES ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load product attributes."
                    }
                );
        }
    }
);


// ============================================================
// PRODUCT REVIEWS
// ============================================================
//
// GET
// /api/catalog/6/reviews?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/:productId/reviews",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/${productId}/reviews`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET PRODUCT REVIEWS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load product reviews."
                    }
                );
        }
    }
);


// ============================================================
// RELATED PRODUCTS
// ============================================================
//
// GET
// /api/catalog/6/related?sellerId=6&customerId=3
// ============================================================

app.get(
    "/api/catalog/:productId/related",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/${productId}/related`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "GET RELATED PRODUCTS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load related products."
                    }
                );
        }
    }
);


// ============================================================
// UPDATE PRODUCT - PUT
// ============================================================
//
// PUT
// /api/catalog/6?sellerId=6&customerId=3
// ============================================================

app.put(
    "/api/catalog/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.put(
                    `${DOTNET_API}/catalog/${id}`,
                    req.body,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json",
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "UPDATE CATALOG PRODUCT ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to update product."
                    }
                );
        }
    }
);


// ============================================================
// UPDATE PRODUCT - PATCH
// ============================================================
//
// PATCH
// /api/catalog/6?sellerId=6&customerId=3
// ============================================================

app.patch(
    "/api/catalog/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.patch(
                    `${DOTNET_API}/catalog/${id}`,
                    req.body,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json",
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "PATCH CATALOG PRODUCT ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to patch product."
                    }
                );
        }
    }
);


// ============================================================
// DELETE PRODUCT
// ============================================================
//
// DELETE
// /api/catalog/6?sellerId=6&customerId=3
// ============================================================

app.delete(
    "/api/catalog/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            const {
                sellerId,
                customerId
            } = req.query;

            const response =
                await axios.delete(
                    `${DOTNET_API}/catalog/${id}`,
                    {
                        httpsAgent,

                        params: {
                            sellerId,
                            customerId
                        },

                        headers: {
                            Accept: "application/json"
                        }
                    }
                );

            return res.json(
                response.data
            );

        }
        catch (error) {

            console.error(
                "DELETE CATALOG PRODUCT ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to delete product."
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
// http://localhost:5000/api/product-inventories/warehouse/3
//
// Node forwards to:
//
// https://localhost:7203/api/product-inventories/warehouse/3
// =========================================================

app.get(
    "/api/product-inventories/warehouse/:warehouseId",
    async (req, res) => {

        try {

            const { warehouseId } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/product-inventories/warehouse/${warehouseId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET Inventory By Warehouse Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load warehouse inventory.",
                        error: error.message
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
// http://localhost:5000/api/product-inventories/seller/6/customer/3
//
// Node forwards to:
//
// https://localhost:7203/api/product-inventories/seller/6/customer/3
// =========================================================

app.get(
    "/api/product-inventories/seller/:sellerId/customer/:customerId",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/product-inventories/seller/${sellerId}/customer/${customerId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET Inventory By Seller + Customer Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to load seller customer inventory.",
                        error: error.message
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
// http://localhost:5000/api/product-inventories/inventory
//
// Query:
//
// ?productId=1
// &warehouseId=3
// &locationId=2
//
// Example:
//
// http://localhost:5000/api/product-inventories/inventory?productId=1&warehouseId=3&locationId=2
// =========================================================

app.get(
    "/api/product-inventories/inventory",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/product-inventories/inventory`,
                {
                    params: {
                        productId: req.query.productId,
                        warehouseId: req.query.warehouseId,
                        locationId: req.query.locationId
                    },
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET Specific Inventory Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Product inventory not found.",
                        error: error.message
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
// http://localhost:5000/api/product-inventories
//
// Node forwards to:
//
// https://localhost:7203/api/product-inventories
//
// Body:
//
// {
//     "productId": 1,
//     "sellerId": 6,
//     "warehouseId": 3
// }
// =========================================================

app.post(
    "/api/product-inventories",
    async (req, res) => {

        try {

            console.log(
                "CREATE Product Inventory:"
            );

            console.log(req.body);

            const response = await axios.post(
                `${DOTNET_API}/product-inventories`,
                req.body,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "POST Product Inventory Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to create product inventory.",
                        error: error.message
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
// http://localhost:5000/api/product-inventories/1
//
// Node forwards to:
//
// https://localhost:7203/api/product-inventories/1
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

            console.log(req.body);

            const response = await axios.put(
                `${DOTNET_API}/product-inventories/${productInventoryId}`,
                req.body,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "PUT Product Inventory Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to update product inventory.",
                        error: error.message
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
// http://localhost:5000/api/product-inventories/1
//
// Node forwards to:
//
// https://localhost:7203/api/product-inventories/1
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

            const response = await axios.delete(
                `${DOTNET_API}/product-inventories/${productInventoryId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "DELETE Product Inventory Error:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        success: false,
                        message:
                            "Failed to delete product inventory.",
                        error: error.message
                    }
                );
        }
    }
);

// =========================================================
// CUSTOMER RETURN ROUTES
// =========================================================
// CUSTOMER RETURN CONFIGURATION
// =========================================================
const ASPNET_URL = "https://localhost:7203";
const CUSTOMER_RETURN_API =
    `${ASPNET_URL}/api/CustomerReturn`;


// =========================================================
// CUSTOMER RETURN ERROR HANDLER
// =========================================================

const sendCustomerReturnError = (
    res,
    error,
    fallbackMessage
) => {

    const status =
        error?.response?.status || 500;

    const responseData =
        error?.response?.data;


    console.error(
        "Customer Return API Error:",
        error?.message
    );

    console.error(
        "HTTP Status:",
        status
    );

    console.error(
        "ASP.NET Response:",
        responseData
    );


    let message =
        fallbackMessage;


    if (
        typeof responseData ===
        "string" &&
        responseData.trim()
    ) {

        message =
            responseData;

    }
    else if (
        responseData?.message
    ) {

        message =
            responseData.message;

    }
    else if (
        responseData?.error
    ) {

        message =
            responseData.error;

    }
    else if (
        responseData?.title
    ) {

        message =
            responseData.title;

    }


    return res
        .status(status)
        .json({
            success: false,
            message,
            error:
                error?.message || "Request failed",
            details:
                responseData || null,
        });

};


// =========================================================
// VALIDATE INTEGER ID
// =========================================================

// =========================================================
// CUSTOMER RETURN ID VALIDATION
// =========================================================

const isValidCustomerReturnId = (id) => {

    const numericId = Number(
        String(id ?? "").trim()
    );

    return (
        Number.isInteger(numericId) &&
        numericId > 0
    );
};


// =========================================================
// GET ALL CUSTOMER RETURNS
// =========================================================
//
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
                "================================================"
            );

            console.log(
                "GET ALL CUSTOMER RETURNS"
            );

            console.log(
                `GET ${CUSTOMER_RETURN_API}`
            );

            console.log(
                "================================================"
            );


            const response =
                await axios.get(
                    CUSTOMER_RETURN_API,
                    {
                        httpsAgent,
                        timeout: 30000,
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return sendCustomerReturnError(
                res,
                error,
                "Unable to load customer returns."
            );

        }

    }
);


// =========================================================
// GET RETURNS BY SALES INVOICE
// =========================================================
//
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


            if (
                !isValidCustomerReturnId(
                    salesInvoiceId
                )
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid Sales Invoice ID.",
                    });

            }


            console.log(
                "Get Returns By Sales Invoice:",
                salesInvoiceId
            );


            const response =
                await axios.get(
                    `${CUSTOMER_RETURN_API}/invoice/${salesInvoiceId}`,
                    {
                        httpsAgent,
                        timeout: 30000,
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return sendCustomerReturnError(
                res,
                error,
                "Unable to load returns for this invoice."
            );

        }

    }
);


// =========================================================
// GET RETURNS BY PRODUCT
// =========================================================
//
// React:
// GET /api/customer-returns/product/6
//
// ASP.NET:
// GET /api/CustomerReturn/product/6
// =========================================================

app.get(
    "/api/customer-returns/product/:productId",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;


            if (
                !isValidCustomerReturnId(
                    productId
                )
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid Product ID.",
                    });

            }


            console.log(
                "Get Returns By Product:",
                productId
            );


            const response =
                await axios.get(
                    `${CUSTOMER_RETURN_API}/product/${productId}`,
                    {
                        httpsAgent,
                        timeout: 30000,
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return sendCustomerReturnError(
                res,
                error,
                "Unable to load returns for this product."
            );

        }

    }
);


// =========================================================
// GET RETURNS BY STATUS
// =========================================================
//
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


            if (
                !status ||
                !status.trim()
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Return status is required.",
                    });

            }


            const encodedStatus =
                encodeURIComponent(
                    status.trim()
                );


            console.log(
                "Get Returns By Status:",
                status
            );


            const response =
                await axios.get(
                    `${CUSTOMER_RETURN_API}/status/${encodedStatus}`,
                    {
                        httpsAgent,
                        timeout: 30000,
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return sendCustomerReturnError(
                res,
                error,
                "Unable to load returns by status."
            );

        }

    }
);


// =========================================================
// GET RETURN BY RETURN NUMBER
// =========================================================
//
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


            if (
                !returnNumber ||
                !returnNumber.trim()
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Return number is required.",
                    });

            }


            const encodedReturnNumber =
                encodeURIComponent(
                    returnNumber.trim()
                );


            console.log(
                "Get Return By Number:",
                returnNumber
            );


            const response =
                await axios.get(
                    `${CUSTOMER_RETURN_API}/number/${encodedReturnNumber}`,
                    {
                        httpsAgent,
                        timeout: 30000,
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return sendCustomerReturnError(
                res,
                error,
                "Customer return not found."
            );

        }

    }
);


// =========================================================
// GET CUSTOMER RETURN BY ID
// =========================================================
//
// React:
// GET /api/customer-returns/1
//
// ASP.NET:
// GET /api/CustomerReturn/1
//
// IMPORTANT:
// Keep this route after the named routes above.
// =========================================================

app.get(
    "/api/customer-returns/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            if (
                !isValidCustomerReturnId(id)
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid Customer Return ID.",
                    });

            }


            const numericId =
                Number(id);


            console.log(
                "================================================"
            );

            console.log(
                "GET CUSTOMER RETURN BY ID"
            );

            console.log(
                `GET ${CUSTOMER_RETURN_API}/${numericId}`
            );

            console.log(
                "================================================"
            );


            const response =
                await axios.get(
                    `${CUSTOMER_RETURN_API}/${numericId}`,
                    {
                        httpsAgent,
                        timeout: 30000,
                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return sendCustomerReturnError(
                res,
                error,
                "Customer return not found."
            );

        }

    }
);


// =========================================================
// CREATE CUSTOMER RETURN
// =========================================================
//
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
                "================================================"
            );

            console.log(
                "CREATE CUSTOMER RETURN"
            );

            console.log(
                "POST:",
                CUSTOMER_RETURN_API
            );

            console.log(
                "Payload:",
                req.body
            );

            console.log(
                "================================================"
            );


            if (
                !req.body ||
                typeof req.body !==
                    "object"
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Customer return payload is required.",
                    });

            }


            const response =
                await axios.post(
                    CUSTOMER_RETURN_API,
                    req.body,
                    {
                        httpsAgent,

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );


            return res
                .status(response.status)
                .json(
                    response.data
                );

        }
        catch (error) {

            return sendCustomerReturnError(
                res,
                error,
                "Unable to create customer return."
            );

        }

    }
);


// =========================================================
// UPDATE CUSTOMER RETURN
// =========================================================
//
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


            if (
                !isValidCustomerReturnId(id)
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Invalid Customer Return ID.",
                    });

            }


            if (
                !req.body ||
                typeof req.body !==
                    "object"
            ) {

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Customer return payload is required.",
                    });

            }


            const numericId =
                Number(id);


            console.log(
                "================================================"
            );

            console.log(
                "UPDATE CUSTOMER RETURN"
            );

            console.log(
                `PUT ${CUSTOMER_RETURN_API}/${numericId}`
            );

            console.log(
                "Payload:",
                req.body
            );

            console.log(
                "================================================"
            );


            const response =
                await axios.put(
                    `${CUSTOMER_RETURN_API}/${numericId}`,
                    req.body,
                    {
                        httpsAgent,

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );


            // ASP.NET CustomerReturnController
            // returns Ok() with an empty response body.
            if (
                response.status ===
                    204 ||
                response.data ===
                    "" ||
                response.data ===
                    null ||
                response.data ===
                    undefined
            ) {

                return res
                    .status(
                        response.status === 204
                            ? 204
                            : 200
                    )
                    .json({
                        success: true,
                        message:
                            "Customer return updated successfully.",
                    });

            }


            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            return sendCustomerReturnError(
                res,
                error,
                "Unable to update customer return."
            );

        }

    }
);


// =========================================================
// DELETE CUSTOMER RETURN
// =========================================================
//
// React:
// DELETE /api/customer-returns/1
//
// ASP.NET:
// DELETE /api/CustomerReturn/1
// =========================================================

// =========================================================
// DELETE CUSTOMER RETURN
// React:
// DELETE http://localhost:5000/api/customer-returns/2
//
// ASP.NET:
// DELETE https://localhost:7203/api/CustomerReturn/2
// =========================================================

app.delete(
    "/api/customer-returns/:id",
    async (req, res) => {

        try {

            // =================================================
            // RAW ID FROM EXPRESS
            // =================================================

            const rawId =
                req.params.id;

            console.log(
                "================================================"
            );

            console.log(
                "DELETE CUSTOMER RETURN"
            );

            console.log(
                "Raw ID:",
                rawId
            );

            console.log(
                "ID Type:",
                typeof rawId
            );

            console.log(
                "================================================"
            );


            // =================================================
            // CONVERT TO NUMBER
            // =================================================

            const numericId =
                Number(
                    String(rawId ?? "").trim()
                );


            // =================================================
            // VALIDATE
            // =================================================

            if (
                !Number.isInteger(
                    numericId
                ) ||
                numericId <= 0
            ) {

                console.error(
                    "INVALID CUSTOMER RETURN ID:",
                    rawId
                );

                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            `Invalid Customer Return ID: ${rawId}`,
                    });

            }


            // =================================================
            // BACKEND URL
            // =================================================

            const backendUrl =
                `${CUSTOMER_RETURN_API}/${numericId}`;


            console.log(
                "Backend URL:",
                backendUrl
            );


            // =================================================
            // DELETE FROM ASP.NET
            // =================================================

            const response =
                await axios.delete(
                    backendUrl,
                    {
                        httpsAgent,

                        timeout: 30000,

                        headers: {
                            Accept:
                                "application/json",
                        },
                    }
                );


            console.log(
                "ASP.NET DELETE STATUS:",
                response.status
            );

            console.log(
                "ASP.NET DELETE RESPONSE:",
                response.data
            );


            // =================================================
            // SUCCESS
            // =================================================

            return res
                .status(200)
                .json({
                    success: true,
                    message:
                        "Customer return deleted successfully.",
                });

        }
        catch (error) {

            console.error(
                "================================================"
            );

            console.error(
                "DELETE CUSTOMER RETURN ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "RESPONSE:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            console.error(
                "================================================"
            );


            return res
                .status(
                    error.response?.status || 500
                )
                .json({
                    success: false,

                    message:
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        (
                            typeof error.response?.data ===
                            "string"
                                ? error.response.data
                                : null
                        ) ||
                        "Unable to delete customer return.",
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
///////////////////marketplace-order-items/////////
app.get(
    "/api/marketplace-order-items",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/marketplace-order-items`,
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
                "GET Marketplace Order Items Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load Marketplace Order Items."
                }
            );

        }

    }
);


/* =========================================================
   GET BY ID
=========================================================

GET:

/api/marketplace-order-items/:id

========================================================= */

app.get(
    "/api/marketplace-order-items/:id",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/marketplace-order-items/${req.params.id}`,
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
                "GET Marketplace Order Item Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load Marketplace Order Item."
                }
            );

        }

    }
);


/* =========================================================
   GET BY MARKETPLACE ORDER
=========================================================

GET:

/api/marketplace-order-items/order/:marketplaceOrderId

========================================================= */

app.get(
    "/api/marketplace-order-items/order/:marketplaceOrderId",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/marketplace-order-items/order/${req.params.marketplaceOrderId}`,
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
                "GET Order Items By Marketplace Order Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load order items."
                }
            );

        }

    }
);


/* =========================================================
   GET BY PRODUCT
=========================================================

GET:

/api/marketplace-order-items/product/:productId

========================================================= */

app.get(
    "/api/marketplace-order-items/product/:productId",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/marketplace-order-items/product/${req.params.productId}`,
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
                "GET Order Items By Product Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load product order items."
                }
            );

        }

    }
);


/* =========================================================
   GET BY SELLER
=========================================================

GET:

/api/marketplace-order-items/seller/:sellerId

========================================================= */

app.get(
    "/api/marketplace-order-items/seller/:sellerId",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/marketplace-order-items/seller/${req.params.sellerId}`,
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
                "GET Order Items By Seller Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load seller order items."
                }
            );

        }

    }
);


/* =========================================================
   GET BY CUSTOMER
=========================================================

GET:

/api/marketplace-order-items/customer/:customerId

========================================================= */

app.get(
    "/api/marketplace-order-items/customer/:customerId",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/marketplace-order-items/customer/${req.params.customerId}`,
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
                "GET Order Items By Customer Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load customer order items."
                }
            );

        }

    }
);


/* =========================================================
   GET BY SELLER + CUSTOMER
=========================================================

GET:

/api/marketplace-order-items/seller/:sellerId/customer/:customerId

========================================================= */

app.get(
    "/api/marketplace-order-items/seller/:sellerId/customer/:customerId",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/marketplace-order-items/seller/${req.params.sellerId}/customer/${req.params.customerId}`,
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
                "GET Order Items By Seller Customer Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load seller customer order items."
                }
            );

        }

    }
);


/* =========================================================
   GET BY STATUS
=========================================================

GET:

/api/marketplace-order-items/status/:status

========================================================= */

app.get(
    "/api/marketplace-order-items/status/:status",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/marketplace-order-items/status/${encodeURIComponent(
                        req.params.status
                    )}`,
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
                "GET Order Items By Status Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load order items by status."
                }
            );

        }

    }
);


/* =========================================================
   STATISTICS
=========================================================

GET:

/api/marketplace-order-items/stats

========================================================= */

app.get(
    "/api/marketplace-order-items/stats",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/marketplace-order-items/stats`,
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
                "Marketplace Order Item Statistics Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load Marketplace Order Item statistics."
                }
            );

        }

    }
);


/* =========================================================
   CREATE
=========================================================

POST:

/api/marketplace-order-items

========================================================= */

app.post(
    "/api/marketplace-order-items",
    async (req, res) => {

        try {

            const response =
                await axios.post(
                    `${DOTNET_API}/marketplace-order-items`,
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
                "CREATE Marketplace Order Item Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to create Marketplace Order Item."
                }
            );

        }

    }
);


/* =========================================================
   UPDATE
=========================================================

PUT:

/api/marketplace-order-items/:id

========================================================= */

app.put(
    "/api/marketplace-order-items/:id",
    async (req, res) => {

        try {

            const response =
                await axios.put(
                    `${DOTNET_API}/marketplace-order-items/${req.params.id}`,
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
                "UPDATE Marketplace Order Item Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to update Marketplace Order Item."
                }
            );

        }

    }
);


/* =========================================================
   DELETE
=========================================================

DELETE:

/api/marketplace-order-items/:id

========================================================= */

app.delete(
    "/api/marketplace-order-items/:id",
    async (req, res) => {

        try {

            const response =
                await axios.delete(
                    `${DOTNET_API}/marketplace-order-items/${req.params.id}`,
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
                "DELETE Marketplace Order Item Error:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to delete Marketplace Order Item."
                }
            );

        }

    }
);
// =========================================================
// MARKETPLACE RETURNS API
// =========================================================

const MARKETPLACE_RETURNS_URL =
    `${DOTNET_API}/marketplace-returns`;


// =========================================================
// GET ALL RETURNS
//
// GET:
// http://localhost:5000/api/marketplace-returns
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns
// =========================================================

app.get(
    "/api/marketplace-returns",
    async (req, res) => {

        try {

            const response = await axios.get(
                MARKETPLACE_RETURNS_URL,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET MARKETPLACE RETURNS ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load marketplace returns."
                    }
                );
        }
    }
);


// =========================================================
// SEARCH
//
// GET:
// http://localhost:5000/api/marketplace-returns/search?search=RET-001
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/search?search=RET-001
// =========================================================

app.get(
    "/api/marketplace-returns/search",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/search`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "SEARCH MARKETPLACE RETURNS ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to search marketplace returns."
                    }
                );
        }
    }
);


// =========================================================
// STATISTICS
//
// GET:
// http://localhost:5000/api/marketplace-returns/stats
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/stats
// =========================================================

app.get(
    "/api/marketplace-returns/stats",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/stats`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "MARKETPLACE RETURNS STATISTICS ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load marketplace return statistics."
                    }
                );
        }
    }
);


// =========================================================
// PAGINATION
//
// GET:
// http://localhost:5000/api/marketplace-returns/paged?page=1&limit=20
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/paged?page=1&limit=20
// =========================================================

app.get(
    "/api/marketplace-returns/paged",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/paged`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "PAGED MARKETPLACE RETURNS ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load paged marketplace returns."
                    }
                );
        }
    }
);


// =========================================================
// SORTING
//
// GET:
// http://localhost:5000/api/marketplace-returns/sorted?sort=date_desc
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/sorted?sort=date_desc
// =========================================================

app.get(
    "/api/marketplace-returns/sorted",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/sorted`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "SORTED MARKETPLACE RETURNS ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load sorted marketplace returns."
                    }
                );
        }
    }
);


// =========================================================
// GET BY MARKETPLACE ORDER ITEM
//
// GET:
// http://localhost:5000/api/marketplace-returns/order-item/1
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/order-item/1
// =========================================================

app.get(
    "/api/marketplace-returns/order-item/:marketplaceOrderItemId",
    async (req, res) => {

        try {

            const {
                marketplaceOrderItemId
            } = req.params;

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/order-item/${marketplaceOrderItemId}`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET MARKETPLACE RETURNS BY ORDER ITEM ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load returns by order item."
                    }
                );
        }
    }
);


// =========================================================
// GET RETURN BY ORDER ITEM + RETURN ID
//
// GET:
// http://localhost:5000/api/marketplace-returns/order-item/1/return/5
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/order-item/1/return/5
// =========================================================

app.get(
    "/api/marketplace-returns/order-item/:marketplaceOrderItemId/return/:marketplaceReturnId",
    async (req, res) => {

        try {

            const {
                marketplaceOrderItemId,
                marketplaceReturnId
            } = req.params;

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/order-item/${marketplaceOrderItemId}/return/${marketplaceReturnId}`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET MARKETPLACE RETURN BY ORDER ITEM + RETURN ID ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load marketplace return."
                    }
                );
        }
    }
);


// =========================================================
// GET BY SELLER
//
// GET:
// http://localhost:5000/api/marketplace-returns/seller/6
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/seller/6
// =========================================================

app.get(
    "/api/marketplace-returns/seller/:sellerId",
    async (req, res) => {

        try {

            const {
                sellerId
            } = req.params;

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/seller/${sellerId}`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET MARKETPLACE RETURNS BY SELLER ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load returns by seller."
                    }
                );
        }
    }
);


// =========================================================
// GET BY SELLER + CUSTOMER
//
// GET:
// http://localhost:5000/api/marketplace-returns/seller/6/customer/3
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/seller/6/customer/3
// =========================================================

app.get(
    "/api/marketplace-returns/seller/:sellerId/customer/:customerId",
    async (req, res) => {

        try {

            const {
                sellerId,
                customerId
            } = req.params;

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/seller/${sellerId}/customer/${customerId}`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET MARKETPLACE RETURNS BY SELLER CUSTOMER ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load seller/customer returns."
                    }
                );
        }
    }
);


// =========================================================
// GET BY CUSTOMER
//
// GET:
// http://localhost:5000/api/marketplace-returns/customer/3
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/customer/3
// =========================================================

app.get(
    "/api/marketplace-returns/customer/:customerId",
    async (req, res) => {

        try {

            const {
                customerId
            } = req.params;

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/customer/${customerId}`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET MARKETPLACE RETURNS BY CUSTOMER ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load returns by customer."
                    }
                );
        }
    }
);


// =========================================================
// GET BY PRODUCT
//
// GET:
// http://localhost:5000/api/marketplace-returns/product/10
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/product/10
// =========================================================

app.get(
    "/api/marketplace-returns/product/:productId",
    async (req, res) => {

        try {

            const {
                productId
            } = req.params;

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/product/${productId}`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET MARKETPLACE RETURNS BY PRODUCT ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load returns by product."
                    }
                );
        }
    }
);


// =========================================================
// GET BY STATUS
//
// GET:
// http://localhost:5000/api/marketplace-returns/status/pending
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/status/pending
// =========================================================

app.get(
    "/api/marketplace-returns/status/:status",
    async (req, res) => {

        try {

            const {
                status
            } = req.params;

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/status/${encodeURIComponent(status)}`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET MARKETPLACE RETURNS BY STATUS ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load returns by status."
                    }
                );
        }
    }
);


// =========================================================
// GET BY SKU
//
// GET:
// http://localhost:5000/api/marketplace-returns/sku/SKU-001
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/sku/SKU-001
// =========================================================

app.get(
    "/api/marketplace-returns/sku/:sku",
    async (req, res) => {

        try {

            const {
                sku
            } = req.params;

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/sku/${encodeURIComponent(sku)}`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET MARKETPLACE RETURNS BY SKU ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load returns by SKU."
                    }
                );
        }
    }
);


// =========================================================
// GET BY RETURN NUMBER
//
// GET:
// http://localhost:5000/api/marketplace-returns/return-number/RET-001
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/return-number/RET-001
// =========================================================

app.get(
    "/api/marketplace-returns/return-number/:returnNumber",
    async (req, res) => {

        try {

            const {
                returnNumber
            } = req.params;

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/return-number/${encodeURIComponent(returnNumber)}`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET MARKETPLACE RETURN BY RETURN NUMBER ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load marketplace return."
                    }
                );
        }
    }
);


// =========================================================
// GET RETURN BY ID
//
// IMPORTANT:
// This generic route is intentionally placed AFTER
// all specific GET routes above.
//
// GET:
// http://localhost:5000/api/marketplace-returns/1
//
// ASP.NET:
// GET:
// https://localhost:7203/api/marketplace-returns/1
// =========================================================

app.get(
    "/api/marketplace-returns/:marketplaceReturnId",
    async (req, res) => {

        try {

            const {
                marketplaceReturnId
            } = req.params;

            const response = await axios.get(
                `${MARKETPLACE_RETURNS_URL}/${marketplaceReturnId}`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET MARKETPLACE RETURN BY ID ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load marketplace return."
                    }
                );
        }
    }
);


// =========================================================
// CREATE MARKETPLACE RETURN
//
// POST:
// http://localhost:5000/api/marketplace-returns
//
// ASP.NET:
// POST:
// https://localhost:7203/api/marketplace-returns
// =========================================================

app.post(
    "/api/marketplace-returns",
    async (req, res) => {

        try {

            const response = await axios.post(
                MARKETPLACE_RETURNS_URL,
                req.body,
                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "CREATE MARKETPLACE RETURN ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to create marketplace return."
                    }
                );
        }
    }
);


// =========================================================
// UPDATE MARKETPLACE RETURN
//
// PUT:
// http://localhost:5000/api/marketplace-returns/1
//
// ASP.NET:
// PUT:
// https://localhost:7203/api/marketplace-returns/1
// =========================================================

app.put(
    "/api/marketplace-returns/:marketplaceReturnId",
    async (req, res) => {

        try {

            const {
                marketplaceReturnId
            } = req.params;

            const response = await axios.put(
                `${MARKETPLACE_RETURNS_URL}/${marketplaceReturnId}`,
                req.body,
                {
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "UPDATE MARKETPLACE RETURN ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to update marketplace return."
                    }
                );
        }
    }
);


// =========================================================
// DELETE MARKETPLACE RETURN
//
// DELETE:
// http://localhost:5000/api/marketplace-returns/1
//
// ASP.NET:
// DELETE:
// https://localhost:7203/api/marketplace-returns/1
// =========================================================

app.delete(
    "/api/marketplace-returns/:marketplaceReturnId",
    async (req, res) => {

        try {

            const {
                marketplaceReturnId
            } = req.params;

            const response = await axios.delete(
                `${MARKETPLACE_RETURNS_URL}/${marketplaceReturnId}`,
                {
                    params: req.query,
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "DELETE MARKETPLACE RETURN ERROR:",
                error.response?.data || error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to delete marketplace return."
                    }
                );
        }
    }
);
// =========================================================
// NOTIFICATION ROUTES
// =========================================================


// =========================================================
// GET ALL NOTIFICATIONS
// =========================================================
// GET
// http://localhost:5000/api/Notification
//
// FORWARDS TO
// https://localhost:7203/api/Notification
// =========================================================

app.get("/api/Notification", async (req, res) => {

    console.log("================================================");
    console.log("GET /api/Notification");
    console.log("================================================");

    try {

        const response = await axios.get(
            `${DOTNET_API}/Notification`,
            {
                httpsAgent,

                headers: {
                    Authorization:
                        req.headers.authorization || "",
                    Accept: "application/json"
                }
            }
        );

        console.log("GET NOTIFICATIONS RESPONSE");
        console.log("STATUS:", response.status);
        console.log("DATA:", response.data);

        return res
            .status(response.status)
            .json(response.data);

    } catch (error) {

        console.error("================================================");
        console.error("GET NOTIFICATIONS ERROR");
        console.error(
            error.response?.data || error.message
        );
        console.error("================================================");

        return res
            .status(error.response?.status || 500)
            .json(
                error.response?.data || {
                    message:
                        "Unable to load notifications."
                }
            );
    }
});


// =========================================================
// GET CUSTOMER NOTIFICATIONS
// =========================================================

app.get(
    "/api/Notification/customer/:customerId",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/Notification/customer/${req.params.customerId}`,
                {
                    httpsAgent,

                    headers: {
                        Authorization:
                            req.headers.authorization || "",
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET CUSTOMER NOTIFICATIONS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Unable to load customer notifications."
                    }
                );
        }
    }
);


// =========================================================
// GET UNREAD CUSTOMER NOTIFICATIONS
// =========================================================

app.get(
    "/api/Notification/customer/:customerId/unread",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/Notification/customer/${req.params.customerId}/unread`,
                {
                    httpsAgent,

                    headers: {
                        Authorization:
                            req.headers.authorization || "",
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET UNREAD NOTIFICATIONS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Unable to load unread notifications."
                    }
                );
        }
    }
);


// =========================================================
// SEARCH NOTIFICATIONS
// =========================================================

app.get(
    "/api/Notification/search",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/Notification/search`,
                {
                    httpsAgent,

                    params: {
                        search:
                            req.query.search || ""
                    },

                    headers: {
                        Authorization:
                            req.headers.authorization || "",
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "SEARCH NOTIFICATIONS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Unable to search notifications."
                    }
                );
        }
    }
);


// =========================================================
// SORT NOTIFICATIONS
// =========================================================

app.get(
    "/api/Notification/sort",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/Notification/sort`,
                {
                    httpsAgent,

                    params: {
                        sort:
                            req.query.sort || ""
                    },

                    headers: {
                        Authorization:
                            req.headers.authorization || "",
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "SORT NOTIFICATIONS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Unable to sort notifications."
                    }
                );
        }
    }
);


// =========================================================
// PAGED NOTIFICATIONS
// =========================================================

app.get(
    "/api/Notification/paged",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/Notification/paged`,
                {
                    httpsAgent,

                    params: {
                        page:
                            req.query.page || 1,

                        limit:
                            req.query.limit || 15
                    },

                    headers: {
                        Authorization:
                            req.headers.authorization || "",
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "PAGED NOTIFICATIONS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Unable to load paged notifications."
                    }
                );
        }
    }
);


// =========================================================
// NOTIFICATION STATISTICS
// =========================================================

app.get(
    "/api/Notification/statistics",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/Notification/statistics`,
                {
                    httpsAgent,

                    headers: {
                        Authorization:
                            req.headers.authorization || "",
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "NOTIFICATION STATISTICS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Unable to load notification statistics."
                    }
                );
        }
    }
);


// =========================================================
// GET NOTIFICATION BY ID
// =========================================================

app.get(
    "/api/Notification/:id",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/Notification/${req.params.id}`,
                {
                    httpsAgent,

                    headers: {
                        Authorization:
                            req.headers.authorization || "",
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "GET NOTIFICATION BY ID ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Unable to load notification."
                    }
                );
        }
    }
);


// =========================================================
// CREATE NOTIFICATION
// =========================================================

app.post(
    "/api/Notification",
    async (req, res) => {

        try {

            const response = await axios.post(
                `${DOTNET_API}/Notification`,
                req.body,
                {
                    httpsAgent,

                    headers: {
                        Authorization:
                            req.headers.authorization || "",
                        Accept: "application/json",
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
                "CREATE NOTIFICATION ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Unable to create notification."
                    }
                );
        }
    }
);


// =========================================================
// MARK NOTIFICATION AS READ
// IMPORTANT: PUT /:id/read BEFORE PUT /:id
// =========================================================

app.put(
    "/api/Notification/:id/read",
    async (req, res) => {

        try {

            const response = await axios.put(
                `${DOTNET_API}/Notification/${req.params.id}/read`,
                {},
                {
                    httpsAgent,

                    headers: {
                        Authorization:
                            req.headers.authorization || "",
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "MARK NOTIFICATION READ ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Unable to mark notification as read."
                    }
                );
        }
    }
);


// =========================================================
// UPDATE NOTIFICATION
// =========================================================

app.put(
    "/api/Notification/:id",
    async (req, res) => {

        try {

            const response = await axios.put(
                `${DOTNET_API}/Notification/${req.params.id}`,
                req.body,
                {
                    httpsAgent,

                    headers: {
                        Authorization:
                            req.headers.authorization || "",
                        Accept: "application/json",
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
                "UPDATE NOTIFICATION ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Unable to update notification."
                    }
                );
        }
    }
);


// =========================================================
// DELETE NOTIFICATION
// =========================================================

app.delete(
    "/api/Notification/:id",
    async (req, res) => {

        try {

            const response = await axios.delete(
                `${DOTNET_API}/Notification/${req.params.id}`,
                {
                    httpsAgent,

                    headers: {
                        Authorization:
                            req.headers.authorization || "",
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "DELETE NOTIFICATION ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Unable to delete notification."
                    }
                );
        }
    }
);
// =========================================================
// GET ALL ORDERS
// =========================================================

app.get(
    "/api/Order",
    async (req, res) => {

        try {

            const response = await axios.get(

                `${DOTNET_API}/Order`,

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
                "GET ORDERS ERROR:",
                error.response?.data ||
                error.message
            );


            res.status(

                error.response?.status || 500

            ).json(

                error.response?.data || {

                    message:
                        "Failed to load orders."

                }

            );

        }

    }
);


// =========================================================
// GET ORDER BY ID
// =========================================================

app.get(
    "/api/Order/:id",
    async (req, res) => {

        try {

            const response = await axios.get(

                `${DOTNET_API}/Order/${req.params.id}`,

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
                "GET ORDER ERROR:",
                error.response?.data ||
                error.message
            );


            res.status(

                error.response?.status || 500

            ).json(

                error.response?.data || {

                    message:
                        "Failed to load order."

                }

            );

        }

    }
);


// =========================================================
// CREATE ORDER
// =========================================================

app.post(
    "/api/Order",
    async (req, res) => {

        try {

            console.log(
                "CREATE ORDER REQUEST:",
                req.body
            );


            const response = await axios.post(

                `${DOTNET_API}/Order`,

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
                "CREATE ORDER ERROR:",
                error.response?.data ||
                error.message
            );


            res.status(

                error.response?.status || 500

            ).json(

                error.response?.data || {

                    message:
                        "Failed to create order."

                }

            );

        }

    }
);


// =========================================================
// UPDATE ORDER
// =========================================================

app.put(
    "/api/Order/:id",
    async (req, res) => {

        try {

            console.log(
                "UPDATE ORDER:",
                req.params.id,
                req.body
            );


            const response = await axios.put(

                `${DOTNET_API}/Order/${req.params.id}`,

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
                "UPDATE ORDER ERROR:",
                error.response?.data ||
                error.message
            );


            res.status(

                error.response?.status || 500

            ).json(

                error.response?.data || {

                    message:
                        "Failed to update order."

                }

            );

        }

    }
);


// =========================================================
// DELETE ORDER
// =========================================================

app.delete(
    "/api/Order/:id",
    async (req, res) => {

        try {

            console.log(
                "DELETE ORDER:",
                req.params.id
            );


            const response = await axios.delete(

                `${DOTNET_API}/Order/${req.params.id}`,

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
                "DELETE ORDER ERROR:",
                error.response?.data ||
                error.message
            );


            res.status(

                error.response?.status || 500

            ).json(

                error.response?.data || {

                    message:
                        "Failed to delete order."

                }

            );

        }

    }
);
// =========================================================
// OrderItem API Proxy
// =========================================================

// GET ALL ORDER ITEMS
app.get("/api/OrderItem", async (req, res) => {
    try {
        const response = await axios.get(
            `${DOTNET_API}/OrderItem`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error(
            "GET /api/OrderItem ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to fetch order items."
            }
        );
    }
});
app.get("/api/OrderItem/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log("GET OrderItem ID:", id);

        const response = await axios.get(
            `${DOTNET_API}/OrderItem/${id}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        console.error(
            "GET /api/OrderItem/:id ERROR:",
            error.response?.data || error.message
        );

        res.status(error.response?.status || 500).json(
            error.response?.data || {
                message: "Failed to fetch order item."
            }
        );
    }
});

// =========================================================
// GET ORDER ITEM BY ID
// =========================================================

app.get("/api/OrderItem/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get(
            `${DOTNET_API}/OrderItem/${id}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error(
            "GET /api/OrderItem/:id ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to fetch order item."
            }
        );
    }
});


// =========================================================
// CREATE ORDER ITEM
// =========================================================

app.post("/api/OrderItem", async (req, res) => {
    try {
        const response = await axios.post(
            `${DOTNET_API}/OrderItem`,
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
            "POST /api/OrderItem ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to create order item."
            }
        );
    }
});


// =========================================================
// UPDATE ORDER ITEM
// =========================================================

app.put("/api/OrderItem/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.put(
            `${DOTNET_API}/OrderItem/${id}`,
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
            "PUT /api/OrderItem/:id ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to update order item."
            }
        );
    }
});


// =========================================================
// DELETE ORDER ITEM
// =========================================================

app.delete("/api/OrderItem/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.delete(
            `${DOTNET_API}/OrderItem/${id}`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error(
            "DELETE /api/OrderItem/:id ERROR:",
            error.response?.data || error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message: "Failed to delete order item."
            }
        );
    }
});
// =========================================================
// =========================================================
// MARKETPLACES
// =========================================================
// =========================================================


// ---------------------------------------------------------
// GET ALL MARKETPLACES
// GET: /api/marketplaces
// ---------------------------------------------------------

app.get("/api/marketplaces", async (req, res) => {
    try {

        const response = await axios.get(
            `${DOTNET_API}/marketplaces`,
            {
                httpsAgent
            }
        );

        res.status(response.status).json(
            response.data
        );

    } catch (error) {

        console.error(
            "GET /api/marketplaces ERROR:",
            error.response?.data ||
            error.message
        );

        res.status(
            error.response?.status || 500
        ).json(
            error.response?.data || {
                message:
                    "Failed to fetch marketplaces."
            }
        );
    }
});


// ---------------------------------------------------------
// GET MARKETPLACE BY ID
// GET: /api/marketplaces/1
// ---------------------------------------------------------

app.get(
    "/api/marketplaces/:marketplaceId",
    async (req, res) => {

        try {

            const {
                marketplaceId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/marketplaces/${marketplaceId}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET /api/marketplaces/:marketplaceId ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch marketplace."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// GET MARKETPLACE BY CODE
// GET: /api/marketplaces/code/AMAZON
// ---------------------------------------------------------

app.get(
    "/api/marketplaces/code/:marketplaceCode",
    async (req, res) => {

        try {

            const {
                marketplaceCode
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/marketplaces/code/${encodeURIComponent(
                    marketplaceCode
                )}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET /api/marketplaces/code/:marketplaceCode ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch marketplace by code."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// GET ACTIVE MARKETPLACES
// GET: /api/marketplaces/active
// ---------------------------------------------------------

app.get(
    "/api/marketplaces/active",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/marketplaces/active`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET /api/marketplaces/active ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch active marketplaces."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// SEARCH MARKETPLACES
// GET: /api/marketplaces/search?search=amazon
// ---------------------------------------------------------

app.get(
    "/api/marketplaces/search",
    async (req, res) => {

        try {

            const {
                search
            } = req.query;

            const response = await axios.get(
                `${DOTNET_API}/marketplaces/search`,
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
                "GET /api/marketplaces/search ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to search marketplaces."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// SORT MARKETPLACES
// GET: /api/marketplaces/sort?sort=name_asc
// ---------------------------------------------------------

app.get(
    "/api/marketplaces/sort",
    async (req, res) => {

        try {

            const {
                sort
            } = req.query;

            const response = await axios.get(
                `${DOTNET_API}/marketplaces/sort`,
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
                "GET /api/marketplaces/sort ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to sort marketplaces."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// CREATE MARKETPLACE
// POST: /api/marketplaces
// ---------------------------------------------------------

app.post(
    "/api/marketplaces",
    async (req, res) => {

        try {

            const response = await axios.post(
                `${DOTNET_API}/marketplaces`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "POST /api/marketplaces ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to create marketplace."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// UPDATE MARKETPLACE
// PUT: /api/marketplaces/1
// ---------------------------------------------------------

app.put(
    "/api/marketplaces/:marketplaceId",
    async (req, res) => {

        try {

            const {
                marketplaceId
            } = req.params;

            const response = await axios.put(
                `${DOTNET_API}/marketplaces/${marketplaceId}`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "PUT /api/marketplaces/:marketplaceId ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to update marketplace."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// DELETE MARKETPLACE
// DELETE: /api/marketplaces/1
// ---------------------------------------------------------

app.delete(
    "/api/marketplaces/:marketplaceId",
    async (req, res) => {

        try {

            const {
                marketplaceId
            } = req.params;

            const response = await axios.delete(
                `${DOTNET_API}/marketplaces/${marketplaceId}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "DELETE /api/marketplaces/:marketplaceId ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to delete marketplace."
                }
            );
        }
    }
);


// =========================================================
// =========================================================
// MARKETPLACE ORDERS
// =========================================================
// =========================================================


// ---------------------------------------------------------
// GET ALL MARKETPLACE ORDERS
// GET: /api/MarketplaceOrder
// ---------------------------------------------------------

app.get(
    "/api/MarketplaceOrder",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/MarketplaceOrder`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET /api/MarketplaceOrder ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch marketplace orders."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// GET MARKETPLACE ORDER BY ID
// GET: /api/MarketplaceOrder/1
// ---------------------------------------------------------

app.get(
    "/api/MarketplaceOrder/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/MarketplaceOrder/${id}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET /api/MarketplaceOrder/:id ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch marketplace order."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// GET ORDERS BY SELLER
// GET: /api/MarketplaceOrder/seller/6
// ---------------------------------------------------------

app.get(
    "/api/MarketplaceOrder/seller/:sellerId",
    async (req, res) => {

        try {

            const {
                sellerId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/MarketplaceOrder/seller/${sellerId}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET /api/MarketplaceOrder/seller/:sellerId ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch seller marketplace orders."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// GET ORDERS BY CUSTOMER
// GET: /api/MarketplaceOrder/customer/3
// ---------------------------------------------------------

app.get(
    "/api/MarketplaceOrder/customer/:customerId",
    async (req, res) => {

        try {

            const {
                customerId
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/MarketplaceOrder/customer/${customerId}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET /api/MarketplaceOrder/customer/:customerId ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch customer marketplace orders."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// GET ORDER BY ORDER NUMBER
// GET: /api/MarketplaceOrder/number/AMZ-ORD-001
// ---------------------------------------------------------

app.get(
    "/api/MarketplaceOrder/number/:marketplaceOrderNumber",
    async (req, res) => {

        try {

            const {
                marketplaceOrderNumber
            } = req.params;

            const response = await axios.get(
                `${DOTNET_API}/MarketplaceOrder/number/${encodeURIComponent(
                    marketplaceOrderNumber
                )}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "GET /api/MarketplaceOrder/number/:marketplaceOrderNumber ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to fetch marketplace order by number."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// CREATE MARKETPLACE ORDER
// POST: /api/MarketplaceOrder
// ---------------------------------------------------------

app.post(
    "/api/MarketplaceOrder",
    async (req, res) => {

        try {

            const response = await axios.post(
                `${DOTNET_API}/MarketplaceOrder`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "POST /api/MarketplaceOrder ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to create marketplace order."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// UPDATE MARKETPLACE ORDER
// PUT: /api/MarketplaceOrder/1
// ---------------------------------------------------------

app.put(
    "/api/MarketplaceOrder/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            const response = await axios.put(
                `${DOTNET_API}/MarketplaceOrder/${id}`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "PUT /api/MarketplaceOrder/:id ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to update marketplace order."
                }
            );
        }
    }
);


// ---------------------------------------------------------
// DELETE MARKETPLACE ORDER
// DELETE: /api/MarketplaceOrder/1
// ---------------------------------------------------------

app.delete(
    "/api/MarketplaceOrder/:id",
    async (req, res) => {

        try {

            const {
                id
            } = req.params;

            const response = await axios.delete(
                `${DOTNET_API}/MarketplaceOrder/${id}`,
                {
                    httpsAgent
                }
            );

            res.status(response.status).json(
                response.data
            );

        } catch (error) {

            console.error(
                "DELETE /api/MarketplaceOrder/:id ERROR:",
                error.response?.data ||
                error.message
            );

            res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to delete marketplace order."
                }
            );
        }
    }
);
// ============================================================
// STOCK MOVEMENTS
// ============================================================


// ============================================================
// GET ALL STOCK MOVEMENTS
// GET /api/stock-movements
//
// Backend:
// GET https://localhost:7203/api/StockMovement
// ============================================================

app.get(
    "/api/stock-movements",
    async (req, res) => {

        console.log(
            "\n================================================"
        );

        console.log(
            "GET ALL STOCK MOVEMENTS"
        );

        console.log(
            "Backend:",
            `${DOTNET_API}/StockMovement`
        );

        console.log(
            "================================================"
        );

        try {

            const response = await axios.get(
                `${DOTNET_API}/StockMovement`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "COUNT:",
                Array.isArray(response.data)
                    ? response.data.length
                    : "N/A"
            );

            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT GET ALL ERROR"
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "Backend Status:",
                error.response?.status
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load stock movements"
                    }
                );
        }
    }
);


// ============================================================
// GET BY SELLER + CUSTOMER
//
// GET /api/stock-movements/seller/6/customer/3
//
// Backend:
// GET /api/StockMovement/seller/6/customer/3
// ============================================================

app.get(
    "/api/stock-movements/seller/:sellerId/customer/:customerId",
    async (req, res) => {

        try {

            const sellerId =
                Number(req.params.sellerId);

            const customerId =
                Number(req.params.customerId);


            console.log(
                "\n================================================"
            );

            console.log(
                "GET STOCK MOVEMENTS BY SELLER + CUSTOMER"
            );

            console.log(
                "SellerId:",
                sellerId
            );

            console.log(
                "CustomerId:",
                customerId
            );

            console.log(
                "================================================"
            );


            const response = await axios.get(
                `${DOTNET_API}/StockMovement/seller/${sellerId}/customer/${customerId}`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT SELLER CUSTOMER ERROR:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load stock movements"
                    }
                );
        }
    }
);


// ============================================================
// SEARCH STOCK MOVEMENTS
//
// GET /api/stock-movements/search?search=Purchase
//
// Backend:
// GET /api/StockMovement/search?search=Purchase
// ============================================================

app.get(
    "/api/stock-movements/search",
    async (req, res) => {

        try {

            const search =
                String(req.query.search || "").trim();


            console.log(
                "\n================================================"
            );

            console.log(
                "SEARCH STOCK MOVEMENTS"
            );

            console.log(
                "Search:",
                search
            );

            console.log(
                "================================================"
            );


            if (!search) {

                return res.status(400).json({
                    message:
                        "Search value is required"
                });

            }


            const response = await axios.get(
                `${DOTNET_API}/StockMovement/search`,
                {
                    httpsAgent,

                    params: {
                        search
                    },

                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            console.log(
                "STATUS:",
                response.status
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT SEARCH ERROR:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to search stock movements"
                    }
                );
        }
    }
);


// ============================================================
// SORT STOCK MOVEMENTS
//
// GET /api/stock-movements/sort?sort=date_desc
//
// Backend:
// GET /api/StockMovement/sort?sort=date_desc
// ============================================================

app.get(
    "/api/stock-movements/sort",
    async (req, res) => {

        try {

            const sort =
                req.query.sort || null;


            console.log(
                "\n================================================"
            );

            console.log(
                "SORT STOCK MOVEMENTS"
            );

            console.log(
                "Sort:",
                sort
            );

            console.log(
                "================================================"
            );


            const response = await axios.get(
                `${DOTNET_API}/StockMovement/sort`,
                {
                    httpsAgent,

                    params: {
                        sort
                    },

                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT SORT ERROR:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to sort stock movements"
                    }
                );
        }
    }
);


// ============================================================
// PAGINATION
//
// GET /api/stock-movements/page?page=1&limit=15
//
// Backend:
// GET /api/StockMovement/page?page=1&limit=15
// ============================================================

app.get(
    "/api/stock-movements/page",
    async (req, res) => {

        try {

            let page =
                Number(req.query.page) || 1;

            let limit =
                Number(req.query.limit) || 15;


            if (page < 1) {
                page = 1;
            }

            if (limit < 1) {
                limit = 15;
            }


            console.log(
                "\n================================================"
            );

            console.log(
                "GET PAGED STOCK MOVEMENTS"
            );

            console.log(
                "Page:",
                page
            );

            console.log(
                "Limit:",
                limit
            );

            console.log(
                "================================================"
            );


            const response = await axios.get(
                `${DOTNET_API}/StockMovement/page`,
                {
                    httpsAgent,

                    params: {
                        page,
                        limit
                    },

                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT PAGINATION ERROR:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load paged stock movements"
                    }
                );
        }
    }
);


// ============================================================
// STATISTICS
//
// GET /api/stock-movements/statistics
//
// Backend:
// GET /api/StockMovement/statistics
// ============================================================

app.get(
    "/api/stock-movements/statistics",
    async (req, res) => {

        console.log(
            "\n================================================"
        );

        console.log(
            "GET STOCK MOVEMENT STATISTICS"
        );

        console.log(
            "Backend:",
            `${DOTNET_API}/StockMovement/statistics`
        );

        console.log(
            "================================================"
        );

        try {

            const response = await axios.get(
                `${DOTNET_API}/StockMovement/statistics`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            console.log(
                "STATUS:",
                response.status
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT STATISTICS ERROR"
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load stock movement statistics"
                    }
                );
        }
    }
);


// ============================================================
// GET BY SELLER
//
// GET /api/stock-movements/seller/6
//
// Backend:
// GET /api/StockMovement/seller/6
// ============================================================

app.get(
    "/api/stock-movements/seller/:sellerId",
    async (req, res) => {

        try {

            const sellerId =
                Number(req.params.sellerId);


            const response = await axios.get(
                `${DOTNET_API}/StockMovement/seller/${sellerId}`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT BY SELLER ERROR:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load seller stock movements"
                    }
                );
        }
    }
);


// ============================================================
// GET BY PRODUCT
//
// GET /api/stock-movements/product/6
//
// Backend:
// GET /api/StockMovement/product/6
// ============================================================

app.get(
    "/api/stock-movements/product/:productId",
    async (req, res) => {

        try {

            const productId =
                Number(req.params.productId);


            const response = await axios.get(
                `${DOTNET_API}/StockMovement/product/${productId}`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT BY PRODUCT ERROR:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load product stock movements"
                    }
                );
        }
    }
);


// ============================================================
// GET BY WAREHOUSE
//
// GET /api/stock-movements/warehouse/3
//
// Backend:
// GET /api/StockMovement/warehouse/3
// ============================================================

app.get(
    "/api/stock-movements/warehouse/:warehouseId",
    async (req, res) => {

        try {

            const warehouseId =
                Number(req.params.warehouseId);


            const response = await axios.get(
                `${DOTNET_API}/StockMovement/warehouse/${warehouseId}`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT BY WAREHOUSE ERROR:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load warehouse stock movements"
                    }
                );
        }
    }
);


// ============================================================
// GET BY MOVEMENT TYPE
//
// GET /api/stock-movements/movement/Purchase
//
// Backend:
// GET /api/StockMovement/movement/Purchase
// ============================================================

app.get(
    "/api/stock-movements/movement/:movementType",
    async (req, res) => {

        try {

            const movementType =
                req.params.movementType;


            const response = await axios.get(
                `${DOTNET_API}/StockMovement/movement/${encodeURIComponent(movementType)}`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT BY TYPE ERROR:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load stock movements by type"
                    }
                );
        }
    }
);


// ============================================================
// GET BY SELLER + PRODUCT + WAREHOUSE + MOVEMENT ID
//
// GET /api/stock-movements/6/6/3/1
//
// Backend:
// GET /api/StockMovement/6/6/3/1
// ============================================================

app.get(
    "/api/stock-movements/:sellerId/:productId/:warehouseId/:stockMovementId",
    async (req, res) => {

        try {

            const sellerId =
                Number(req.params.sellerId);

            const productId =
                Number(req.params.productId);

            const warehouseId =
                Number(req.params.warehouseId);

            const stockMovementId =
                Number(req.params.stockMovementId);


            const response = await axios.get(
                `${DOTNET_API}/StockMovement/${sellerId}/${productId}/${warehouseId}/${stockMovementId}`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT COMPOSITE GET ERROR:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load stock movement"
                    }
                );
        }
    }
);


// ============================================================
// GET STOCK MOVEMENT BY ID
//
// GET /api/stock-movements/1
//
// Backend:
// GET /api/StockMovement/1
//
// KEEP THIS AFTER ALL NAMED GET ROUTES.
// ============================================================

app.get(
    "/api/stock-movements/:stockMovementId",
    async (req, res) => {

        try {

            const stockMovementId =
                Number(req.params.stockMovementId);


            console.log(
                "\n================================================"
            );

            console.log(
                "GET STOCK MOVEMENT BY ID"
            );

            console.log(
                "StockMovementId:",
                stockMovementId
            );

            console.log(
                "================================================"
            );


            if (
                !Number.isInteger(stockMovementId) ||
                stockMovementId <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Valid stockMovementId is required"
                });

            }


            const response = await axios.get(
                `${DOTNET_API}/StockMovement/${stockMovementId}`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT GET BY ID ERROR:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load stock movement"
                    }
                );
        }
    }
);


// ============================================================
// CREATE STOCK MOVEMENT
//
// POST /api/stock-movements
//
// Backend:
// POST /api/StockMovement
// ============================================================

app.post(
    "/api/stock-movements",
    async (req, res) => {

        console.log(
            "\n================================================"
        );

        console.log(
            "CREATE STOCK MOVEMENT"
        );

        console.log(
            "REQUEST BODY:"
        );

        console.log(
            JSON.stringify(
                req.body,
                null,
                2
            )
        );

        console.log(
            "================================================"
        );


        try {

            const response = await axios.post(
                `${DOTNET_API}/StockMovement`,
                req.body,
                {
                    httpsAgent,

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"
                    }
                }
            );


            console.log(
                "STATUS:",
                response.status
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT CREATE ERROR"
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to create stock movement"
                    }
                );
        }
    }
);


// ============================================================
// UPDATE STOCK MOVEMENT
//
// PUT /api/stock-movements/1
//
// Backend:
// PUT /api/StockMovement/1
// ============================================================

app.put(
    "/api/stock-movements/:stockMovementId",
    async (req, res) => {

        try {

            const stockMovementId =
                Number(req.params.stockMovementId);


            if (
                !Number.isInteger(stockMovementId) ||
                stockMovementId <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Valid stockMovementId is required"
                });

            }


            console.log(
                "\n================================================"
            );

            console.log(
                "UPDATE STOCK MOVEMENT"
            );

            console.log(
                "StockMovementId:",
                stockMovementId
            );

            console.log(
                "REQUEST BODY:"
            );

            console.log(
                JSON.stringify(
                    req.body,
                    null,
                    2
                )
            );

            console.log(
                "================================================"
            );


            const response = await axios.put(
                `${DOTNET_API}/StockMovement/${stockMovementId}`,
                req.body,
                {
                    httpsAgent,

                    headers: {
                        "Content-Type":
                            "application/json",

                        Accept:
                            "application/json"
                    }
                }
            );


            return res
                .status(response.status)
                .json(response.data);

        } catch (error) {

            console.error(
                "STOCK MOVEMENT UPDATE ERROR"
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to update stock movement"
                    }
                );
        }
    }
);


// ============================================================
// DELETE STOCK MOVEMENT
//
// DELETE /api/stock-movements/1
//
// Backend:
// DELETE /api/StockMovement/1
// ============================================================

app.delete(
    "/api/stock-movements/:stockMovementId",
    async (req, res) => {

        try {

            const stockMovementId =
                Number(req.params.stockMovementId);


            if (
                !Number.isInteger(stockMovementId) ||
                stockMovementId <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Valid stockMovementId is required"
                });

            }


            console.log(
                "\n================================================"
            );

            console.log(
                "DELETE STOCK MOVEMENT"
            );

            console.log(
                "StockMovementId:",
                stockMovementId
            );

            console.log(
                "================================================"
            );


            const response = await axios.delete(
                `${DOTNET_API}/StockMovement/${stockMovementId}`,
                {
                    httpsAgent,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );


            return res
                .status(response.status)
                .json(
                    response.data || {
                        message:
                            "Stock movement deleted successfully"
                    }
                );

        } catch (error) {

            console.error(
                "STOCK MOVEMENT DELETE ERROR"
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "Backend Response:",
                error.response?.data
            );

            return res
                .status(error.response?.status || 500)
                .json(
                    error.response?.data || {
                        message:
                            "Failed to delete stock movement"
                    }
                );
        }
    }
);
// ============================================================
// GET ALL DELIVERY CHALLANS
// Node:
// GET /api/delivery-challans
//
// ASP.NET:
// GET /api/DeliveryChallan
// ============================================================

app.get(
    "/api/delivery-challans",
    async (req, res) => {

        console.log("");
        console.log("================================================");
        console.log("GET /api/delivery-challans");
        console.log("Backend: /api/DeliveryChallan");
        console.log("================================================");

        try {

            const response = await axios.get(
                "https://localhost:7203/api/DeliveryChallan",
                {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    params: req.query,
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            console.log(
                "ASP.NET STATUS:",
                response.status
            );

            console.log(
                "DELIVERY CHALLANS:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET /api/delivery-challans ERROR:",
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
                            "Failed to load delivery challans."
                    }
                );
        }
    }
);


// ============================================================
// GET ALL EXPLICIT
// Node:
// GET /api/delivery-challans/all
//
// ASP.NET:
// GET /api/DeliveryChallan/all
// ============================================================

app.get(
    "/api/delivery-challans/all",
    async (req, res) => {

        try {

            const response = await axios.get(
                "https://localhost:7203/api/DeliveryChallan/all",
                {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET /api/delivery-challans/all ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load all delivery challans."
                    }
                );
        }
    }
);


// ============================================================
// GET BY SALES ORDER
// Node:
// GET /api/delivery-challans/salesorder/:salesOrderId
//
// ASP.NET:
// GET /api/DeliveryChallan/salesorder/:salesOrderId
// ============================================================

app.get(
    "/api/delivery-challans/salesorder/:salesOrderId",
    async (req, res) => {

        try {

            const salesOrderId =
                Number(req.params.salesOrderId);

            if (
                !Number.isInteger(salesOrderId) ||
                salesOrderId <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid Sales Order ID."
                });
            }

            const response = await axios.get(
                `https://localhost:7203/api/DeliveryChallan/salesorder/${salesOrderId}`,
                {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET DELIVERY CHALLANS BY SALES ORDER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load delivery challans."
                    }
                );
        }
    }
);


// ============================================================
// GET BY STATUS
// Node:
// GET /api/delivery-challans/status/:status
//
// ASP.NET:
// GET /api/DeliveryChallan/status/:status
// ============================================================

app.get(
    "/api/delivery-challans/status/:status",
    async (req, res) => {

        try {

            const status =
                encodeURIComponent(
                    req.params.status
                );

            const response = await axios.get(
                `https://localhost:7203/api/DeliveryChallan/status/${status}`,
                {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET DELIVERY CHALLANS BY STATUS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load delivery challans by status."
                    }
                );
        }
    }
);


// ============================================================
// GET BY CHALLAN NUMBER
// Node:
// GET /api/delivery-challans/number/:challanNumber
//
// ASP.NET:
// GET /api/DeliveryChallan/number/:challanNumber
// ============================================================

app.get(
    "/api/delivery-challans/number/:challanNumber",
    async (req, res) => {

        try {

            const challanNumber =
                encodeURIComponent(
                    req.params.challanNumber
                );

            const response = await axios.get(
                `https://localhost:7203/api/DeliveryChallan/number/${challanNumber}`,
                {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET DELIVERY CHALLAN BY NUMBER ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load delivery challan."
                    }
                );
        }
    }
);


// ============================================================
// GET STATISTICS
// Node:
// GET /api/delivery-challans/stats
//
// ASP.NET:
// GET /api/DeliveryChallan/stats
// ============================================================

app.get(
    "/api/delivery-challans/stats",
    async (req, res) => {

        try {

            const response = await axios.get(
                "https://localhost:7203/api/DeliveryChallan/stats",
                {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET DELIVERY CHALLAN STATS ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load delivery challan statistics."
                    }
                );
        }
    }
);


// ============================================================
// GET BY ID
// IMPORTANT:
// Keep this AFTER all static routes
//
// Node:
// GET /api/delivery-challans/:id
//
// ASP.NET:
// GET /api/DeliveryChallan/:id
// ============================================================

app.get(
    "/api/delivery-challans/:id",
    async (req, res) => {

        try {

            const id =
                Number(req.params.id);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid Delivery Challan ID."
                });
            }

            const response = await axios.get(
                `https://localhost:7203/api/DeliveryChallan/${id}`,
                {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET DELIVERY CHALLAN BY ID ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to load delivery challan."
                    }
                );
        }
    }
);


// ============================================================
// CREATE DELIVERY CHALLAN
// Node:
// POST /api/delivery-challans
//
// ASP.NET:
// POST /api/DeliveryChallan
// ============================================================

app.post(
    "/api/delivery-challans",
    async (req, res) => {

        console.log("");
        console.log("================================================");
        console.log("POST /api/delivery-challans");
        console.log("BODY:", req.body);
        console.log("================================================");

        try {

            const response = await axios.post(
                "https://localhost:7203/api/DeliveryChallan",
                req.body,
                {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        Accept: "application/json",
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "POST /api/delivery-challans ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to create delivery challan."
                    }
                );
        }
    }
);


// ============================================================
// UPDATE DELIVERY CHALLAN
// Node:
// PUT /api/delivery-challans/:id
//
// ASP.NET:
// PUT /api/DeliveryChallan/:id
// ============================================================

app.put(
    "/api/delivery-challans/:id",
    async (req, res) => {

        try {

            const id =
                Number(req.params.id);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid Delivery Challan ID."
                });
            }

            const response = await axios.put(
                `https://localhost:7203/api/DeliveryChallan/${id}`,
                req.body,
                {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        Accept: "application/json",
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "PUT /api/delivery-challans ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to update delivery challan."
                    }
                );
        }
    }
);


// ============================================================
// DELETE DELIVERY CHALLAN
// Node:
// DELETE /api/delivery-challans/:id
//
// ASP.NET:
// DELETE /api/DeliveryChallan/:id
// ============================================================

app.delete(
    "/api/delivery-challans/:id",
    async (req, res) => {

        try {

            const id =
                Number(req.params.id);

            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid Delivery Challan ID."
                });
            }

            const response = await axios.delete(
                `https://localhost:7203/api/DeliveryChallan/${id}`,
                {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "DELETE /api/delivery-challans ERROR:",
                error.response?.data ||
                error.message
            );

            return res
                .status(
                    error.response?.status || 500
                )
                .json(
                    error.response?.data || {
                        message:
                            "Failed to delete delivery challan."
                    }
                );
        }
    }
);
// ================================================================
// DELIVERY CHALLAN ITEMS
// ================================================================

const DELIVERY_CHALLAN_ITEM_API =
    `${DOTNET_API}/DeliveryChallanItem`;

const deliveryChallanItemHttpsAgent =
    new https.Agent({
        rejectUnauthorized: false
    });


// ================================================================
// GET ALL DELIVERY CHALLAN ITEMS
// GET /api/delivery-challan-items
// Backend: GET /api/DeliveryChallanItem
// ================================================================

app.get(
    "/api/delivery-challan-items",
    async (req, res) => {

        console.log("\n================================================");
        console.log("GET /api/delivery-challan-items");
        console.log("Backend:", DELIVERY_CHALLAN_ITEM_API);
        console.log("Query:", req.query);
        console.log("================================================");

        try {

            const response = await axios.get(
                DELIVERY_CHALLAN_ITEM_API,
                {
                    httpsAgent:
                        deliveryChallanItemHttpsAgent,

                    params: req.query,

                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            console.log(
                "DELIVERY CHALLAN ITEMS RESPONSE"
            );

            console.log(
                "STATUS:",
                response.status
            );

            return res.status(
                response.status
            ).json(response.data);

        } catch (error) {

            console.error(
                "DELIVERY CHALLAN ITEMS ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load Delivery Challan Items.",
                    error:
                        error.message
                }
            );
        }
    }
);


// ================================================================
// GET ALL EXPLICIT
// GET /api/delivery-challan-items/all
// Backend: GET /api/DeliveryChallanItem/all
// ================================================================

app.get(
    "/api/delivery-challan-items/all",
    async (req, res) => {

        console.log("\n================================================");
        console.log("GET /api/delivery-challan-items/all");
        console.log("Backend:",
            `${DELIVERY_CHALLAN_ITEM_API}/all`);
        console.log("================================================");

        try {

            const response = await axios.get(
                `${DELIVERY_CHALLAN_ITEM_API}/all`,
                {
                    httpsAgent:
                        deliveryChallanItemHttpsAgent,

                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            console.log(
                "GET ALL DELIVERY CHALLAN ITEMS"
            );

            console.log(
                "STATUS:",
                response.status
            );

            return res.status(
                response.status
            ).json(response.data);

        } catch (error) {

            console.error(
                "GET ALL DELIVERY CHALLAN ITEMS ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load all Delivery Challan Items.",
                    error:
                        error.message
                }
            );
        }
    }
);


// ================================================================
// GET BY DELIVERY CHALLAN
// GET /api/delivery-challan-items/challan/:deliveryChallanId
// Backend:
// GET /api/DeliveryChallanItem/challan/:deliveryChallanId
// ================================================================

app.get(
    "/api/delivery-challan-items/challan/:deliveryChallanId",
    async (req, res) => {

        const {
            deliveryChallanId
        } = req.params;

        console.log("\n================================================");
        console.log(
            "GET /api/delivery-challan-items/challan/:deliveryChallanId"
        );
        console.log(
            "DeliveryChallanId:",
            deliveryChallanId
        );
        console.log(
            "Backend:",
            `${DELIVERY_CHALLAN_ITEM_API}/challan/${deliveryChallanId}`
        );
        console.log("================================================");

        try {

            const id =
                Number(deliveryChallanId);

            if (!Number.isInteger(id) || id <= 0) {

                return res.status(400).json({
                    message:
                        "Invalid DeliveryChallanId."
                });
            }

            const response = await axios.get(
                `${DELIVERY_CHALLAN_ITEM_API}/challan/${id}`,
                {
                    httpsAgent:
                        deliveryChallanItemHttpsAgent,

                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            console.log(
                "DELIVERY CHALLAN ITEMS BY CHALLAN RESPONSE"
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "DATA:",
                response.data
            );

            return res.status(
                response.status
            ).json(response.data);

        } catch (error) {

            console.error(
                "GET DELIVERY CHALLAN ITEMS BY CHALLAN ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load Delivery Challan Items for the challan.",
                    error:
                        error.message
                }
            );
        }
    }
);


// ================================================================
// GET BY PRODUCT
// GET /api/delivery-challan-items/product/:productId
// Backend:
// GET /api/DeliveryChallanItem/product/:productId
// ================================================================

app.get(
    "/api/delivery-challan-items/product/:productId",
    async (req, res) => {

        const {
            productId
        } = req.params;

        console.log("\n================================================");
        console.log(
            "GET /api/delivery-challan-items/product/:productId"
        );
        console.log(
            "ProductId:",
            productId
        );
        console.log(
            "Backend:",
            `${DELIVERY_CHALLAN_ITEM_API}/product/${productId}`
        );
        console.log("================================================");

        try {

            const id =
                Number(productId);

            if (!Number.isInteger(id) || id <= 0) {

                return res.status(400).json({
                    message:
                        "Invalid ProductId."
                });
            }

            const response = await axios.get(
                `${DELIVERY_CHALLAN_ITEM_API}/product/${id}`,
                {
                    httpsAgent:
                        deliveryChallanItemHttpsAgent,

                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            console.log(
                "DELIVERY CHALLAN ITEMS BY PRODUCT RESPONSE"
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "DATA:",
                response.data
            );

            return res.status(
                response.status
            ).json(response.data);

        } catch (error) {

            console.error(
                "GET DELIVERY CHALLAN ITEMS BY PRODUCT ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load Delivery Challan Items for the product.",
                    error:
                        error.message
                }
            );
        }
    }
);


// ================================================================
// SEARCH DELIVERY CHALLAN ITEMS
// GET /api/delivery-challan-items/search?search=6
// Backend:
// GET /api/DeliveryChallanItem/search?search=6
// ================================================================

app.get(
    "/api/delivery-challan-items/search",
    async (req, res) => {

        const search =
            String(req.query.search || "").trim();

        console.log("\n================================================");
        console.log(
            "GET /api/delivery-challan-items/search"
        );
        console.log(
            "Search:",
            search
        );
        console.log(
            "Backend:",
            `${DELIVERY_CHALLAN_ITEM_API}/search`
        );
        console.log("================================================");

        try {

            const response = await axios.get(
                `${DELIVERY_CHALLAN_ITEM_API}/search`,
                {
                    httpsAgent:
                        deliveryChallanItemHttpsAgent,

                    params: {
                        search
                    },

                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            console.log(
                "DELIVERY CHALLAN ITEM SEARCH RESPONSE"
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "DATA:",
                response.data
            );

            return res.status(
                response.status
            ).json(response.data);

        } catch (error) {

            console.error(
                "DELIVERY CHALLAN ITEM SEARCH ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to search Delivery Challan Items.",
                    error:
                        error.message
                }
            );
        }
    }
);


// ================================================================
// DELIVERY CHALLAN ITEM STATISTICS
// GET /api/delivery-challan-items/stats
// Backend:
// GET /api/DeliveryChallanItem/stats
// ================================================================

app.get(
    "/api/delivery-challan-items/stats",
    async (req, res) => {

        console.log("\n================================================");
        console.log(
            "GET /api/delivery-challan-items/stats"
        );
        console.log(
            "Backend:",
            `${DELIVERY_CHALLAN_ITEM_API}/stats`
        );
        console.log("================================================");

        try {

            const response = await axios.get(
                `${DELIVERY_CHALLAN_ITEM_API}/stats`,
                {
                    httpsAgent:
                        deliveryChallanItemHttpsAgent,

                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            console.log(
                "DELIVERY CHALLAN ITEM STATISTICS RESPONSE"
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "DATA:",
                response.data
            );

            return res.status(
                response.status
            ).json(response.data);

        } catch (error) {

            console.error(
                "DELIVERY CHALLAN ITEM STATISTICS ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to load Delivery Challan Item statistics.",
                    error:
                        error.message
                }
            );
        }
    }
);


// ================================================================
// CREATE DELIVERY CHALLAN ITEM
// POST /api/delivery-challan-items
// Backend:
// POST /api/DeliveryChallanItem
// ================================================================

app.post(
    "/api/delivery-challan-items",
    async (req, res) => {

        console.log("\n================================================");
        console.log(
            "POST /api/delivery-challan-items"
        );
        console.log(
            "Backend:",
            DELIVERY_CHALLAN_ITEM_API
        );
        console.log(
            "REQUEST BODY:",
            req.body
        );
        console.log("================================================");

        try {

            const response = await axios.post(
                DELIVERY_CHALLAN_ITEM_API,
                req.body,
                {
                    httpsAgent:
                        deliveryChallanItemHttpsAgent,

                    headers: {
                        Accept: "application/json",
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            console.log(
                "CREATE DELIVERY CHALLAN ITEM RESPONSE"
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "DATA:",
                response.data
            );

            return res.status(
                response.status
            ).json(response.data);

        } catch (error) {

            console.error(
                "CREATE DELIVERY CHALLAN ITEM ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to create Delivery Challan Item.",
                    error:
                        error.message
                }
            );
        }
    }
);


// ================================================================
// UPDATE DELIVERY CHALLAN ITEM
// PUT /api/delivery-challan-items/:id
// Backend:
// PUT /api/DeliveryChallanItem/:id
// ================================================================

app.put(
    "/api/delivery-challan-items/:id",
    async (req, res) => {

        const {
            id
        } = req.params;

        console.log("\n================================================");
        console.log(
            "PUT /api/delivery-challan-items/:id"
        );
        console.log(
            "ID:",
            id
        );
        console.log(
            "Backend:",
            `${DELIVERY_CHALLAN_ITEM_API}/${id}`
        );
        console.log(
            "REQUEST BODY:",
            req.body
        );
        console.log("================================================");

        try {

            const itemId =
                Number(id);

            if (!Number.isInteger(itemId) || itemId <= 0) {

                return res.status(400).json({
                    message:
                        "Invalid DeliveryChallanItemId."
                });
            }

            const response = await axios.put(
                `${DELIVERY_CHALLAN_ITEM_API}/${itemId}`,
                req.body,
                {
                    httpsAgent:
                        deliveryChallanItemHttpsAgent,

                    headers: {
                        Accept: "application/json",
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            console.log(
                "UPDATE DELIVERY CHALLAN ITEM RESPONSE"
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "DATA:",
                response.data
            );

            return res.status(
                response.status
            ).json(response.data);

        } catch (error) {

            console.error(
                "UPDATE DELIVERY CHALLAN ITEM ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to update Delivery Challan Item.",
                    error:
                        error.message
                }
            );
        }
    }
);


// ================================================================
// DELETE DELIVERY CHALLAN ITEM
// DELETE /api/delivery-challan-items/:id
// Backend:
// DELETE /api/DeliveryChallanItem/:id
// ================================================================

app.delete(
    "/api/delivery-challan-items/:id",
    async (req, res) => {

        const {
            id
        } = req.params;

        console.log("\n================================================");
        console.log(
            "DELETE /api/delivery-challan-items/:id"
        );
        console.log(
            "ID:",
            id
        );
        console.log(
            "Backend:",
            `${DELIVERY_CHALLAN_ITEM_API}/${id}`
        );
        console.log("================================================");

        try {

            const itemId =
                Number(id);

            if (!Number.isInteger(itemId) || itemId <= 0) {

                return res.status(400).json({
                    message:
                        "Invalid DeliveryChallanItemId."
                });
            }

            const response = await axios.delete(
                `${DELIVERY_CHALLAN_ITEM_API}/${itemId}`,
                {
                    httpsAgent:
                        deliveryChallanItemHttpsAgent,

                    headers: {
                        Accept: "application/json"
                    }
                }
            );

            console.log(
                "DELETE DELIVERY CHALLAN ITEM RESPONSE"
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "DATA:",
                response.data
            );

            return res.status(
                response.status
            ).json(response.data);

        } catch (error) {

            console.error(
                "DELETE DELIVERY CHALLAN ITEM ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            return res.status(
                error.response?.status || 500
            ).json(
                error.response?.data || {
                    message:
                        "Failed to delete Delivery Challan Item.",
                    error:
                        error.message
                }
            );
        }
    }
);
// ================================================================
// GET DELIVERY CHALLAN ITEM BY ID
// GET /api/delivery-challan-items/:id
// Backend:
// GET /api/DeliveryChallanItem/:id
// ================================================================

app.get(
    "/api/delivery-challan-items/:id",
    async (req, res) => {

        const {
            id
        } = req.params;

        console.log("\n================================================");
        console.log(
            "GET /api/delivery-challan-items/:id"
        );
        console.log(
            "DeliveryChallanItemId:",
            id
        );
        console.log(
            "Backend:",
            `${DELIVERY_CHALLAN_ITEM_API}/${id}`
        );
        console.log("================================================");

        try {

            // =================================================
            // VALIDATE ID
            // =================================================

            const itemId =
                Number(id);


            if (
                !Number.isInteger(itemId) ||
                itemId <= 0
            ) {

                console.error(
                    "INVALID DELIVERY CHALLAN ITEM ID:",
                    id
                );

                return res.status(400).json({

                    message:
                        "Invalid DeliveryChallanItemId."

                });

            }


            // =================================================
            // CALL ASP.NET API
            // =================================================

            const response = await axios.get(

                `${DELIVERY_CHALLAN_ITEM_API}/${itemId}`,

                {
                    httpsAgent:
                        deliveryChallanItemHttpsAgent,

                    headers: {
                        Accept:
                            "application/json"
                    }
                }

            );


            // =================================================
            // SUCCESS RESPONSE
            // =================================================

            console.log(
                "GET DELIVERY CHALLAN ITEM BY ID RESPONSE"
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "DATA:",
                response.data
            );


            return res.status(
                response.status
            ).json(
                response.data
            );


        } catch (error) {

            console.error(
                "GET DELIVERY CHALLAN ITEM BY ID ERROR"
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );


            return res.status(
                error.response?.status || 500
            ).json(

                error.response?.data || {

                    message:
                        "Failed to load Delivery Challan Item.",

                    error:
                        error.message

                }

            );

        }

    }
);

// ============================================================
// GOODS RECEIPT NOTES - GRN
// Backend:
// https://localhost:7203/api/GoodsReceiptNotes
// Node:
// http://localhost:5000/api/goods-receipt-notes
// ============================================================


// ============================================================
// GET ALL GOODS RECEIPT NOTES
// GET /api/goods-receipt-notes
// ============================================================

app.get(
    "/api/goods-receipt-notes",
    async (req, res) => {

        try {

            console.log("=================================================");
            console.log("GET /api/goods-receipt-notes");
            console.log("Backend: /api/GoodsReceiptNotes");

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes`,
                {
                    httpsAgent
                }
            );

            console.log(
                "GET GOODS RECEIPT NOTES STATUS:",
                response.status
            );

            console.log(
                "GET GOODS RECEIPT NOTES DATA:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GOODS RECEIPT NOTES ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Notes."
                    }
                );
        }
    }
);


// ============================================================
// GET GRN BY PURCHASE ORDER
// GET /api/goods-receipt-notes/purchaseorder/:purchaseOrderId
// ============================================================

app.get(
    "/api/goods-receipt-notes/purchaseorder/:purchaseOrderId",
    async (req, res) => {

        try {

            const purchaseOrderId =
                Number(req.params.purchaseOrderId);

            if (
                !Number.isInteger(purchaseOrderId) ||
                purchaseOrderId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid Purchase Order ID is required."
                });
            }

            console.log("=================================================");
            console.log(
                "GET /api/goods-receipt-notes/purchaseorder/" +
                purchaseOrderId
            );

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/purchaseorder/${purchaseOrderId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRN BY PURCHASE ORDER ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Notes by Purchase Order."
                    }
                );
        }
    }
);


// ============================================================
// GET GRN BY PURCHASE ORDER + GRN ID
// GET /api/goods-receipt-notes/purchaseorder/:purchaseOrderId/grn/:goodsReceiptNoteId
// ============================================================

app.get(
    "/api/goods-receipt-notes/purchaseorder/:purchaseOrderId/grn/:goodsReceiptNoteId",
    async (req, res) => {

        try {

            const purchaseOrderId =
                Number(req.params.purchaseOrderId);

            const goodsReceiptNoteId =
                Number(req.params.goodsReceiptNoteId);

            if (
                !Number.isInteger(purchaseOrderId) ||
                purchaseOrderId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid Purchase Order ID is required."
                });
            }

            if (
                !Number.isInteger(goodsReceiptNoteId) ||
                goodsReceiptNoteId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid Goods Receipt Note ID is required."
                });
            }

            console.log("=================================================");
            console.log(
                "GET GRN BY PURCHASE ORDER + GRN"
            );

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/purchaseorder/${purchaseOrderId}/grn/${goodsReceiptNoteId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRN BY PURCHASE ORDER + GRN ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Note."
                    }
                );
        }
    }
);


// ============================================================
// GET GRN BY SELLER
// GET /api/goods-receipt-notes/seller/:sellerId
// ============================================================

app.get(
    "/api/goods-receipt-notes/seller/:sellerId",
    async (req, res) => {

        try {

            const sellerId =
                Number(req.params.sellerId);

            if (
                !Number.isInteger(sellerId) ||
                sellerId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid Seller ID is required."
                });
            }

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/seller/${sellerId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRN BY SELLER ERROR:",
                error.message
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Notes by Seller."
                    }
                );
        }
    }
);


// ============================================================
// GET GRN BY CUSTOMER
// GET /api/goods-receipt-notes/customer/:customerId
// ============================================================

app.get(
    "/api/goods-receipt-notes/customer/:customerId",
    async (req, res) => {

        try {

            const customerId =
                Number(req.params.customerId);

            if (
                !Number.isInteger(customerId) ||
                customerId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid Customer ID is required."
                });
            }

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/customer/${customerId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRN BY CUSTOMER ERROR:",
                error.message
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Notes by Customer."
                    }
                );
        }
    }
);


// ============================================================
// GET GRN BY SUPPLIER
// GET /api/goods-receipt-notes/supplier/:supplierId
// ============================================================

app.get(
    "/api/goods-receipt-notes/supplier/:supplierId",
    async (req, res) => {

        try {

            const supplierId =
                Number(req.params.supplierId);

            if (
                !Number.isInteger(supplierId) ||
                supplierId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid Supplier ID is required."
                });
            }

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/supplier/${supplierId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRN BY SUPPLIER ERROR:",
                error.message
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Notes by Supplier."
                    }
                );
        }
    }
);


// ============================================================
// GET GRN BY SELLER + CUSTOMER
// GET /api/goods-receipt-notes/seller/:sellerId/customer/:customerId
// ============================================================

app.get(
    "/api/goods-receipt-notes/seller/:sellerId/customer/:customerId",
    async (req, res) => {

        try {

            const sellerId =
                Number(req.params.sellerId);

            const customerId =
                Number(req.params.customerId);

            if (
                !Number.isInteger(sellerId) ||
                sellerId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid Seller ID is required."
                });
            }

            if (
                !Number.isInteger(customerId) ||
                customerId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid Customer ID is required."
                });
            }

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/seller/${sellerId}/customer/${customerId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRN BY SELLER CUSTOMER ERROR:",
                error.message
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Notes."
                    }
                );
        }
    }
);


// ============================================================
// GET GRN BY STATUS
// GET /api/goods-receipt-notes/status/:status
// ============================================================

app.get(
    "/api/goods-receipt-notes/status/:status",
    async (req, res) => {

        try {

            const status =
                String(req.params.status || "").trim();

            if (!status) {
                return res.status(400).json({
                    message:
                        "Status is required."
                });
            }

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/status/${encodeURIComponent(status)}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRN BY STATUS ERROR:",
                error.message
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Notes by status."
                    }
                );
        }
    }
);


// ============================================================
// SEARCH GRN
// GET /api/goods-receipt-notes/search?search=...&status=...
// ============================================================

app.get(
    "/api/goods-receipt-notes/search",
    async (req, res) => {

        try {

            const search =
                req.query.search ?? "";

            const status =
                req.query.status ?? "";

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/search`,
                {
                    params: {
                        search,
                        status
                    },
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "SEARCH GRN ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to search Goods Receipt Notes."
                    }
                );
        }
    }
);


// ============================================================
// GRN STATISTICS
// GET /api/goods-receipt-notes/stats
// ============================================================

app.get(
    "/api/goods-receipt-notes/stats",
    async (req, res) => {

        try {

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/stats`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRN STATISTICS ERROR:",
                error.message
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Note statistics."
                    }
                );
        }
    }
);


// ============================================================
// PAGED GRN
// GET /api/goods-receipt-notes/page?page=1&limit=15
// ============================================================

app.get(
    "/api/goods-receipt-notes/page",
    async (req, res) => {

        try {

            let page =
                Number(req.query.page || 1);

            let limit =
                Number(req.query.limit || 15);

            if (!Number.isInteger(page) || page < 1) {
                page = 1;
            }

            if (!Number.isInteger(limit) || limit < 1) {
                limit = 15;
            }

            if (limit > 100) {
                limit = 100;
            }

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/page`,
                {
                    params: {
                        page,
                        limit
                    },
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET PAGED GRN ERROR:",
                error.message
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load paged Goods Receipt Notes."
                    }
                );
        }
    }
);


// ============================================================
// SORT GRN
// GET /api/goods-receipt-notes/sort?sort=...
// ============================================================

app.get(
    "/api/goods-receipt-notes/sort",
    async (req, res) => {

        try {

            const sort =
                req.query.sort ?? "";

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/sort`,
                {
                    params: {
                        sort
                    },
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "SORT GRN ERROR:",
                error.message
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to sort Goods Receipt Notes."
                    }
                );
        }
    }
);


// ============================================================
// GET GRN BY ID
// IMPORTANT:
// This generic :id route MUST remain after all specific routes.
// GET /api/goods-receipt-notes/:id
// ============================================================

app.get(
    "/api/goods-receipt-notes/:id",
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
                        "Valid Goods Receipt Note ID is required."
                });
            }

            console.log(
                "GET GOODS RECEIPT NOTE ID:",
                id
            );

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptNotes/${id}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRN BY ID ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Note."
                    }
                );
        }
    }
);


// ============================================================
// CREATE GRN
// POST /api/goods-receipt-notes
// ============================================================

app.post(
    "/api/goods-receipt-notes",
    async (req, res) => {

        try {

            console.log("=================================================");
            console.log("POST /api/goods-receipt-notes");
            console.log("REQUEST BODY:");
            console.log(req.body);

            const response = await axios.post(
                `${DOTNET_API}/GoodsReceiptNotes`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log(
                "CREATE GRN STATUS:",
                response.status
            );

            console.log(
                "CREATE GRN RESPONSE:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "CREATE GRN ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to create Goods Receipt Note."
                    }
                );
        }
    }
);


// ============================================================
// UPDATE GRN
// PUT /api/goods-receipt-notes/:id
// ============================================================

app.put(
    "/api/goods-receipt-notes/:id",
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
                        "Valid Goods Receipt Note ID is required."
                });
            }

            console.log(
                "PUT GOODS RECEIPT NOTE:",
                id
            );

            const response = await axios.put(
                `${DOTNET_API}/GoodsReceiptNotes/${id}`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "UPDATE GRN ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to update Goods Receipt Note."
                    }
                );
        }
    }
);


// ============================================================
// DELETE GRN
// DELETE /api/goods-receipt-notes/:id
// ============================================================

app.delete(
    "/api/goods-receipt-notes/:id",
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
                        "Valid Goods Receipt Note ID is required."
                });
            }

            console.log(
                "DELETE GOODS RECEIPT NOTE:",
                id
            );

            const response = await axios.delete(
                `${DOTNET_API}/GoodsReceiptNotes/${id}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "DELETE GRN ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to delete Goods Receipt Note."
                    }
                );
        }
    }
);


// ============================================================
// END GOODS RECEIPT NOTES - GRN
// ============================================================

// ============================================================
// GOODS RECEIPT NOTE ITEMS - GRI
// Backend:
// https://localhost:7203/api/GoodsReceiptItems
// Node:
// http://localhost:5000/api/goods-receipt-note-items
// ============================================================


// ============================================================
// GET ALL GOODS RECEIPT NOTE ITEMS
// GET /api/goods-receipt-note-items
// ============================================================

app.get(
    "/api/goods-receipt-note-items",
    async (req, res) => {

        try {

            console.log("=================================================");
            console.log(
                "GET /api/goods-receipt-note-items"
            );

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptItems`,
                {
                    httpsAgent
                }
            );

            console.log(
                "GET GRI STATUS:",
                response.status
            );

            console.log(
                "GET GRI DATA:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRI ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Note Items."
                    }
                );
        }
    }
);


// ============================================================
// GET GRI BY GRN + ITEM ID
//
// GET
// /api/goods-receipt-note-items/
// goodsreceiptnote/:goodsReceiptNoteId/
// item/:goodsReceiptNoteItemId
//
// MUST BE BEFORE /:id
// ============================================================

app.get(
    "/api/goods-receipt-note-items/goodsreceiptnote/:goodsReceiptNoteId/item/:goodsReceiptNoteItemId",
    async (req, res) => {

        try {

            const goodsReceiptNoteId =
                Number(req.params.goodsReceiptNoteId);

            const goodsReceiptNoteItemId =
                Number(req.params.goodsReceiptNoteItemId);

            if (
                !Number.isInteger(goodsReceiptNoteId) ||
                goodsReceiptNoteId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid Goods Receipt Note ID is required."
                });
            }

            if (
                !Number.isInteger(goodsReceiptNoteItemId) ||
                goodsReceiptNoteItemId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid Goods Receipt Note Item ID is required."
                });
            }

            console.log("=================================================");
            console.log(
                "GET GRI BY GRN + ITEM"
            );

            console.log(
                "GRN ID:",
                goodsReceiptNoteId
            );

            console.log(
                "GRI ID:",
                goodsReceiptNoteItemId
            );

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptItems/goodsreceiptnote/${goodsReceiptNoteId}/item/${goodsReceiptNoteItemId}`,
                {
                    httpsAgent
                }
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRI BY GRN + ITEM ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Note Item."
                    }
                );
        }
    }
);


// ============================================================
// GET ALL GRI ITEMS FOR A GRN
//
// GET
// /api/goods-receipt-note-items/
// goodsreceiptnote/:goodsReceiptNoteId
//
// MUST BE BEFORE /:id
// ============================================================

app.get(
    "/api/goods-receipt-note-items/goodsreceiptnote/:goodsReceiptNoteId",
    async (req, res) => {

        try {

            const goodsReceiptNoteId =
                Number(req.params.goodsReceiptNoteId);

            if (
                !Number.isInteger(goodsReceiptNoteId) ||
                goodsReceiptNoteId <= 0
            ) {
                return res.status(400).json({
                    message:
                        "Valid Goods Receipt Note ID is required."
                });
            }

            console.log("=================================================");
            console.log(
                "GET GRI BY GRN:",
                goodsReceiptNoteId
            );

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptItems/goodsreceiptnote/${goodsReceiptNoteId}`,
                {
                    httpsAgent
                }
            );

            console.log(
                "GET GRI BY GRN STATUS:",
                response.status
            );

            console.log(
                "GET GRI BY GRN DATA:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRI BY GRN ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Note Items."
                    }
                );
        }
    }
);


// ============================================================
// GET GRI BY ID
//
// IMPORTANT:
// This generic :id route MUST COME AFTER
// the two specific goodsreceiptnote routes above.
// ============================================================

app.get(
    "/api/goods-receipt-note-items/:id",
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
                        "Valid Goods Receipt Note Item ID is required."
                });
            }

            console.log("=================================================");
            console.log(
                "GET GRI BY ID:",
                id
            );

            const response = await axios.get(
                `${DOTNET_API}/GoodsReceiptItems/${id}`,
                {
                    httpsAgent
                }
            );

            console.log(
                "GET GRI BY ID STATUS:",
                response.status
            );

            console.log(
                "GET GRI BY ID DATA:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "GET GRI BY ID ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to load Goods Receipt Note Item."
                    }
                );
        }
    }
);


// ============================================================
// CREATE GRI
// POST /api/goods-receipt-note-items
// ============================================================

app.post(
    "/api/goods-receipt-note-items",
    async (req, res) => {

        try {

            console.log("=================================================");
            console.log(
                "POST /api/goods-receipt-note-items"
            );

            console.log(
                "REQUEST BODY:"
            );

            console.log(req.body);

            const response = await axios.post(
                `${DOTNET_API}/GoodsReceiptItems`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log(
                "CREATE GRI STATUS:",
                response.status
            );

            console.log(
                "CREATE GRI RESPONSE:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "CREATE GRI ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to create Goods Receipt Note Item."
                    }
                );
        }
    }
);


// ============================================================
// UPDATE GRI
// PUT /api/goods-receipt-note-items/:id
// ============================================================

app.put(
    "/api/goods-receipt-note-items/:id",
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
                        "Valid Goods Receipt Note Item ID is required."
                });
            }

            console.log("=================================================");
            console.log(
                "PUT GRI:",
                id
            );

            console.log(
                "REQUEST BODY:"
            );

            console.log(req.body);

            const response = await axios.put(
                `${DOTNET_API}/GoodsReceiptItems/${id}`,
                req.body,
                {
                    httpsAgent,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log(
                "UPDATE GRI STATUS:",
                response.status
            );

            console.log(
                "UPDATE GRI RESPONSE:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "UPDATE GRI ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to update Goods Receipt Note Item."
                    }
                );
        }
    }
);


// ============================================================
// DELETE GRI
// DELETE /api/goods-receipt-note-items/:id
// ============================================================

app.delete(
    "/api/goods-receipt-note-items/:id",
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
                        "Valid Goods Receipt Note Item ID is required."
                });
            }

            console.log("=================================================");
            console.log(
                "DELETE GRI:",
                id
            );

            const response = await axios.delete(
                `${DOTNET_API}/GoodsReceiptItems/${id}`,
                {
                    httpsAgent
                }
            );

            console.log(
                "DELETE GRI STATUS:",
                response.status
            );

            console.log(
                "DELETE GRI RESPONSE:",
                response.data
            );

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "DELETE GRI ERROR:",
                error.message
            );

            console.error(
                "STATUS:",
                error?.response?.status
            );

            console.error(
                "DATA:",
                error?.response?.data
            );

            return res
                .status(error?.response?.status || 500)
                .json(
                    error?.response?.data || {
                        message:
                            "Failed to delete Goods Receipt Note Item."
                    }
                );
        }
    }
);


// ============================================================
// END GOODS RECEIPT NOTE ITEMS - GRI
// ============================================================
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
