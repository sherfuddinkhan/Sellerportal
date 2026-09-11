import React, {
    useCallback,
    useEffect,
    useState,
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
} from "@mui/icons-material";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import CustomerReturnView
    from "./CustomerReturnView";

// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL =
    "http://localhost:5000";

const API_URL =
    `${SERVER_URL}/api/customer-returns`;

// =========================================================
// COMPONENT
// =========================================================

const CustomerReturnDetails = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const returnId =
        String(id ?? "").trim();

    // =====================================================
    // STATE
    // =====================================================

    const [item, setItem] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =====================================================
    // EXTRACT RESPONSE DATA
    // =====================================================

    const extractReturnData = (
        responseData
    ) => {

        if (!responseData) {
            return null;
        }

        // Direct CustomerReturn object
        if (
            responseData.CustomerReturnId !== undefined ||
            responseData.customerReturnId !== undefined
        ) {
            return responseData;
        }

        // { data: object }
        if (
            responseData.data &&
            typeof responseData.data === "object" &&
            !Array.isArray(responseData.data)
        ) {
            return responseData.data;
        }

        // { item: object }
        if (
            responseData.item &&
            typeof responseData.item === "object" &&
            !Array.isArray(responseData.item)
        ) {
            return responseData.item;
        }

        // { customerReturn: object }
        if (
            responseData.customerReturn &&
            typeof responseData.customerReturn === "object" &&
            !Array.isArray(
                responseData.customerReturn
            )
        ) {
            return responseData.customerReturn;
        }

        return responseData;
    };

    // =====================================================
    // LOAD CUSTOMER RETURN BY ID
    // =====================================================

    const loadReturn = useCallback(
        async () => {

            // -------------------------------------------------
            // Validate ID
            // -------------------------------------------------

            if (!returnId) {

                setError(
                    "Customer Return ID is missing."
                );

                setLoading(false);

                return;
            }

            if (
                returnId === ":id" ||
                !/^\d+$/.test(returnId)
            ) {

                setError(
                    `Invalid Customer Return ID: ${returnId}`
                );

                setLoading(false);

                return;
            }

            try {

                setLoading(true);

                setError("");

                const requestUrl =
                    `${API_URL}/${returnId}`;

                console.log(
                    "================================================"
                );

                console.log(
                    "GET CUSTOMER RETURN DETAILS"
                );

                console.log(
                    "Return ID:",
                    returnId
                );

                console.log(
                    "React → Node:",
                    requestUrl
                );

                console.log(
                    "================================================"
                );

                // -------------------------------------------------
                // GET BY ID
                // -------------------------------------------------

                const response =
                    await axios.get(
                        requestUrl,
                        {
                            headers: {
                                Accept:
                                    "application/json",
                            },
                            timeout: 30000,
                        }
                    );

                console.log(
                    "Customer Return Details Response:",
                    response.data
                );

                // -------------------------------------------------
                // Extract record
                // -------------------------------------------------

                const data =
                    extractReturnData(
                        response.data
                    );

                if (!data) {

                    throw new Error(
                        "Customer Return response is empty."
                    );

                }

                setItem(data);

            }
            catch (err) {

                console.error(
                    "================================================"
                );

                console.error(
                    "GET CUSTOMER RETURN DETAILS ERROR"
                );

                console.error(
                    "ID:",
                    returnId
                );

                console.error(
                    "STATUS:",
                    err.response?.status
                );

                console.error(
                    "RESPONSE:",
                    err.response?.data
                );

                console.error(
                    "ERROR:",
                    err
                );

                console.error(
                    "================================================"
                );

                const status =
                    err.response?.status;

                const responseData =
                    err.response?.data;

                const message =
                    responseData?.message ||
                    responseData?.title ||
                    (
                        typeof responseData ===
                        "string"
                            ? responseData
                            : ""
                    );

                if (status === 404) {

                    setError(
                        `Customer Return ID ${returnId} was not found.`
                    );

                }
                else if (status === 400) {

                    setError(
                        message ||
                        "Invalid Customer Return ID."
                    );

                }
                else {

                    setError(
                        message ||
                        `Unable to load Customer Return.${
                            status
                                ? ` HTTP ${status}`
                                : ""
                        }`
                    );

                }

            }
            finally {

                setLoading(false);

            }

        },
        [returnId]
    );

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadReturn();

    }, [
        loadReturn,
    ]);

    // =====================================================
    // CLOSE / BACK
    // =====================================================

    const handleClose = () => {

        navigate(
            "/customer-returns"
        );

    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = () => {

        if (!returnId) {
            return;
        }

        navigate(
            `/customer-returns/edit/${returnId}`
        );

    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "400px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >

                <CircularProgress />

            </Box>

        );

    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <Box
                sx={{
                    p: 3,
                }}
            >

                <Stack spacing={2}>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Customer Return Details
                    </Typography>

                    <Alert
                        severity="error"
                    >
                        {error}
                    </Alert>

                    <Box>

                        <Button
                            variant="outlined"
                            startIcon={
                                <ArrowBack />
                            }
                            onClick={
                                handleClose
                            }
                        >
                            Back to Customer Returns
                        </Button>

                    </Box>

                </Stack>

            </Box>

        );

    }

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <CustomerReturnView
            open={true}
            item={item}
            onClose={handleClose}
            onEdit={handleEdit}
        />

    );

};

// =========================================================
// EXPORT
// =========================================================

export default CustomerReturnDetails;

