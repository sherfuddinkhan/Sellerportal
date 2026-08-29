
// server.js
// Marketplace Seller Portal Proxy Server
// =========================================================

import express from "express";
import cors from "cors";
import axios from "axios";
import https from "https";

const app = express();

// =========================================================
// CONFIG
// =========================================================

const PORT = 5000;

const DOTNET_API =
    "https://localhost:7203/api";

// =========================================================
// HTTPS AGENT
// Allows local ASP.NET development certificate
// =========================================================

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
        ],
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Accept",
        ],
    })
);

app.use(express.json());

app.use(express.urlencoded({
    extended: true,
}));

// =========================================================
// LOGGER
// =========================================================

app.use((req, res, next) => {

    console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
    );

    next();
});

// =========================================================
// HEALTH CHECK
// =========================================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Marketplace Seller Portal proxy server is running.",
        port: PORT,
        dotnetApi: DOTNET_API,
    });

});

// =========================================================
// API HEALTH CHECK
// =========================================================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "Node API proxy is running.",
    });

});

// =========================================================
// AXIOS ERROR HANDLER
// =========================================================

const handleAxiosError = (res, error, operation) => {

    console.error(
        `${operation} ERROR:`,
        error.message
    );

    if (error.response) {

        console.error(
            "HTTP STATUS:",
            error.response.status
        );

        console.error(
            "RESPONSE DATA:",
            error.response.data
        );

        return res.status(
            error.response.status
        ).json(
            error.response.data || {
                success: false,
                message: `${operation} failed.`,
            }
        );
    }

    if (error.request) {

        console.error(
            "NO RESPONSE RECEIVED FROM .NET API"
        );

        return res.status(502).json({
            success: false,
            message:
                "Unable to connect to the .NET API.",
            details: error.message,
        });
    }

    return res.status(500).json({
        success: false,
        message:
            error.message ||
            `${operation} failed.`,
    });
};

// =========================================================
// CATALOG
// =========================================================

// ---------------------------------------------------------
// GET ALL CATALOG PRODUCTS
// React:
// GET http://localhost:5000/api/catalog/products/all
//
// Node:
// GET https://localhost:7203/api/catalog/products/all
// ---------------------------------------------------------

app.get(
    "/api/catalog/products/all",
    async (req, res) => {

        console.log(
            "========================================"
        );

        console.log(
            "GET ALL CATALOG PRODUCTS"
        );

        console.log(
            "NODE:",
            "http://localhost:5000/api/catalog/products/all"
        );

        console.log(
            "DOTNET:",
            `${DOTNET_API}/catalog/products/all`
        );

        console.log(
            "========================================"
        );

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/products/all`,
                    {
                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            console.log(
                "CATALOG STATUS:",
                response.status
            );

            console.log(
                "CATALOG DATA:",
                response.data
            );

            return res.status(
                response.status
            ).json(
                response.data
            );

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

// ---------------------------------------------------------
// GET SINGLE CATALOG PRODUCT
//
// GET:
// /api/catalog/products/:id
// ---------------------------------------------------------

// =========================================================
// GET SINGLE CATALOG PRODUCT
//
// React:
// GET /api/catalog/products/:id
//
// Node:
// GET /api/catalog/products/:id
//
// ASP.NET:
// GET /api/catalog/:id
// =========================================================

// =========================================================
// GET SINGLE CATALOG PRODUCT
//
// React:
// GET http://localhost:5000/api/catalog/products/:id
//
// ASP.NET:
// GET https://localhost:7203/api/catalog/products/:id
// =========================================================

app.get(
    "/api/catalog/products/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            console.log(
                "========================================"
            );

            console.log(
                "GET SINGLE CATALOG PRODUCT"
            );

            console.log(
                "PRODUCT ID:",
                id
            );

            console.log(
                "QUERY:",
                req.query
            );

            console.log(
                "NODE:",
                `http://localhost:5000/api/catalog/products/${id}`
            );

            console.log(
                "DOTNET:",
                `${DOTNET_API}/catalog/products/${id}`
            );

            console.log(
                "========================================"
            );

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/products/${id}`,
                    {
                        params: req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            console.log(
                "CATALOG PRODUCT STATUS:",
                response.status
            );

            console.log(
                "CATALOG PRODUCT DATA:",
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
                `GET CATALOG PRODUCT ${id}`
            );

        }
    }
);

// ---------------------------------------------------------
// CREATE CATALOG PRODUCT
//
// POST:
// /api/catalog/products
// ---------------------------------------------------------

app.post(
    "/api/catalog/products",
    async (req, res) => {

        try {

            console.log(
                "CREATE CATALOG REQUEST:",
                req.body
            );

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
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            console.log(
                "CREATE CATALOG STATUS:",
                response.status
            );

            console.log(
                "CREATE CATALOG RESPONSE:",
                response.data
            );

            return res.status(
                response.status
            ).json(
                response.data
            );

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

// ---------------------------------------------------------
// UPDATE CATALOG PRODUCT
//
// PUT:
// /api/catalog/:id
// ---------------------------------------------------------

app.put(
    "/api/catalog/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            console.log(
                "UPDATE CATALOG:",
                id
            );

            console.log(
                "REQUEST BODY:",
                req.body
            );

            const response =
                await axios.put(
                    `${DOTNET_API}/catalog/${id}`,
                    req.body,
                    {
                        params: req.query,

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

            return res.status(
                response.status
            ).json(
                response.data
            );

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

// ---------------------------------------------------------
// DELETE CATALOG PRODUCT
//
// DELETE:
// /api/catalog/products/:id
// ---------------------------------------------------------

app.delete(
    "/api/catalog/products/:id",
    async (req, res) => {

        const { id } = req.params;

        try {

            console.log(
                "DELETE CATALOG:",
                id
            );

            const response =
                await axios.delete(
                    `${DOTNET_API}/catalog/products/${id}`,
                    {
                        params: req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            if (
                response.data === undefined ||
                response.data === null
            ) {

                return res.status(
                    response.status
                ).send();

            }

            return res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                `DELETE CATALOG ${id}`
            );

        }

    }
);
// =========================================================
// VIEW / GET CATALOG PRODUCTS
// =========================================================
//
// FRONTEND:
// GET
// http://localhost:5000/api/catalog/products?sellerId=6&customerId=3
//
// NODE -> ASP.NET:
// GET
// https://localhost:7203/api/catalog/products?sellerId=6&customerId=3
//
// =========================================================

app.get(
    "/api/catalog/products",
    async (req, res) => {

        const {
            sellerId,
            customerId,
        } = req.query;

        console.log(
            "=========================================="
        );

        console.log(
            "VIEW CATALOG PRODUCTS"
        );

        console.log(
            "Seller ID:",
            sellerId
        );

        console.log(
            "Customer ID:",
            customerId
        );

        // =====================================================
        // VALIDATION
        // =====================================================

        if (!sellerId) {

            return res.status(400).json({

                success: false,

                message:
                    "sellerId is required.",

            });

        }

        if (!customerId) {

            return res.status(400).json({

                success: false,

                message:
                    "customerId is required.",

            });

        }

        try {

            // =================================================
            // CALL ASP.NET API
            // =================================================

            const response =
                await axios.get(
                    `${DOTNET_API}/catalog/products`,
                    {

                        params: {

                            sellerId:
                                sellerId,

                            customerId:
                                customerId,

                        },

                        httpsAgent,

                        headers: {

                            Accept:
                                "application/json",

                        },

                        timeout: 30000,

                    }
                );

            // =================================================
            // LOG RESPONSE
            // =================================================

            console.log(
                "ASP.NET STATUS:",
                response.status
            );

            console.log(
                "ASP.NET CATALOG RESPONSE:",
                response.data
            );

            // =================================================
            // RETURN DATA TO REACT
            // =================================================

            return res
                .status(response.status)
                .json(response.data);

        }
        catch (error) {

            console.error(
                "VIEW CATALOG ERROR:",
                error.message
            );

            // =================================================
            // ASP.NET RETURNED ERROR
            // =================================================

            if (error.response) {

                console.error(
                    "ASP.NET STATUS:",
                    error.response.status
                );

                console.error(
                    "ASP.NET ERROR:",
                    error.response.data
                );

                return res
                    .status(
                        error.response.status
                    )
                    .json(
                        error.response.data
                    );

            }

            // =================================================
            // CONNECTION ERROR
            // =================================================

            if (error.request) {

                return res.status(502).json({

                    success: false,

                    message:
                        "Unable to connect to ASP.NET Catalog API.",

                    details:
                        error.message,

                });

            }

            // =================================================
            // OTHER ERROR
            // =================================================

            return res.status(500).json({

                success: false,

                message:
                    "Internal server error while loading catalog.",

                details:
                    error.message,

            });

        }

    }
);



// =========================================================
// BRANDS
// =========================================================

app.get(
    "/api/Brand",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/Brand`,
                    {
                        params: req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            return res.status(
                response.status
            ).json(
                response.data
            );

        }
        catch (error) {

            return handleAxiosError(
                res,
                error,
                "GET BRANDS"
            );

        }

    }
);

// =========================================================
// CATEGORIES
// =========================================================

app.get(
    "/api/Category",
    async (req, res) => {

        try {

            const response =
                await axios.get(
                    `${DOTNET_API}/Category`,
                    {
                        params: req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            return res.status(
                response.status
            ).json(
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
// PRODUCT TYPES
// =========================================================

app.get(
    "/api/producttype",
    async (req, res) => {

        try {

            console.log(
                "Loading Product Types..."
            );

            const response =
                await axios.get(
                    `${DOTNET_API}/producttype`,
                    {
                        params: req.query,

                        httpsAgent,

                        headers: {
                            Accept:
                                "application/json",
                        },

                        timeout: 30000,
                    }
                );

            console.log(
                "PRODUCT TYPE STATUS:",
                response.status
            );

            console.log(
                "PRODUCT TYPE DATA:",
                response.data
            );

            return res.status(
                response.status
            ).json(
                response.data
            );

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
// START SERVER
// =========================================================

app.listen(
    PORT,
    () => {

        console.log(
            "========================================"
        );

        console.log(
            "Marketplace Seller Portal Proxy"
        );

        console.log(
            `Node Server: http://localhost:${PORT}`
        );

        console.log(
            `ASP.NET API: ${DOTNET_API}`
        );

        console.log(
            "========================================"
        );

    }
);
