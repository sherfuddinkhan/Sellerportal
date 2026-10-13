
import React, {
    useEffect,
    useState,
    useCallback
} from "react";

import axios from "axios";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Stack,
    Breadcrumbs,
    Link
} from "@mui/material";

import {
    ArrowBack,
    LocationOn
} from "@mui/icons-material";

import ReversePickupAddressForm
    from "./ReversePickupAddressForm";

/* =========================================================
   API CONFIGURATION
   React -> Node.js -> ASP.NET Core
========================================================= */

const API_BASE_URL = "http://localhost:5000";

const DEFAULT_API_ENDPOINT =
    "/api/reverse-pickup-addresses";

const getEndpoint = (endpoint) => {
    const path = endpoint || DEFAULT_API_ENDPOINT;

    const normalizedPath = path.startsWith("/")
        ? path
        : `/${path}`;

    return `${API_BASE_URL}${normalizedPath}`;
};

/* =========================================================
   ERROR MESSAGE HELPER
========================================================= */

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (typeof data === "string") {
        return data;
    }

    if (data?.message) {
        return data.message;
    }

    if (data?.title) {
        return data.title;
    }

    if (data?.errors) {
        return Object.values(data.errors)
            .flat()
            .join(" ");
    }

    return error?.message || fallback;
};

/* =========================================================
   RESPONSE HELPER
========================================================= */

const extractAddress = (responseData) => {
    if (!responseData) {
        return null;
    }

    if (
        responseData.data &&
        !Array.isArray(responseData.data) &&
        typeof responseData.data === "object"
    ) {
        return responseData.data;
    }

    if (
        responseData.result &&
        !Array.isArray(responseData.result) &&
        typeof responseData.result === "object"
    ) {
        return responseData.result;
    }

    return responseData;
};

/* =========================================================
   REVERSE PICKUP ADDRESS EDIT
========================================================= */

const ReversePickupAddressEdit = ({
    addressId,
    id,
    address: initialAddress = null,
    endpoint = DEFAULT_API_ENDPOINT,
    onSuccess,
    onCancel,
    onUpdated,
    navigateBack,
    showBreadcrumbs = true,
    title = "Edit Reverse Pickup Address"
}) => {
    /* =====================================================
       ROUTER
    ===================================================== */

    const params = useParams();
    const navigate = useNavigate();

    /* =====================================================
       ADDRESS ID

       Supports:
       - addressId prop
       - id prop
       - /reverse-pickup-addresses/:id/edit
       - /reverse-pickup-addresses/:addressId/edit
    ===================================================== */

    const resolvedAddressId =
        addressId ??
        id ??
        params.addressId ??
        params.id ??
        params.reversePickupAddressId;

    /* =====================================================
       API URL
    ===================================================== */

    const apiUrl = getEndpoint(endpoint);

    /* =====================================================
       STATE
    ===================================================== */

    const [address, setAddress] =
        useState(initialAddress);

    const [loading, setLoading] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    /* =====================================================
       BACK / CANCEL NAVIGATION
    ===================================================== */

    const handleBack = () => {
        if (submitting) {
            return;
        }

        // Use the parent's cancel handler if provided.
        if (typeof onCancel === "function") {
            onCancel();
            return;
        }

        // Use a custom navigation callback if provided.
        if (typeof navigateBack === "function") {
            navigateBack();
            return;
        }

        // Default: return to the address list.
        navigate("/reverse-pickup-addresses");
    };

    const handleCancel = handleBack;

    /* =====================================================
       LOAD ADDRESS
    ===================================================== */

    const fetchAddress = useCallback(async () => {
        if (
            resolvedAddressId === undefined ||
            resolvedAddressId === null ||
            String(resolvedAddressId).trim() === ""
        ) {
            setAddress(null);
            setError("A valid address ID is required.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const requestUrl =
                `${apiUrl}/${encodeURIComponent(
                    resolvedAddressId
                )}`;

            console.log(
                "Reverse Pickup Address GET:",
                requestUrl
            );

            const response = await axios.get(requestUrl);

            console.log(
                "Reverse Pickup Address Response:",
                response.data
            );

            const record = extractAddress(response.data);

            if (
                !record ||
                typeof record !== "object" ||
                Array.isArray(record)
            ) {
                setAddress(null);
                setError(
                    "Address information was not found."
                );
                return;
            }

            setAddress(record);
        } catch (requestError) {
            console.error(
                "Failed to load reverse pickup address:",
                requestError.response?.data ||
                    requestError.message
            );

            setAddress(null);

            setError(
                getErrorMessage(
                    requestError,
                    "Failed to load reverse pickup address."
                )
            );
        } finally {
            setLoading(false);
        }
    }, [apiUrl, resolvedAddressId]);

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        if (initialAddress) {
            setAddress(initialAddress);
            setError("");
            setSuccess("");
            return;
        }

        fetchAddress();
    }, [initialAddress, fetchAddress]);

    /* =====================================================
       UPDATE ADDRESS
    ===================================================== */

    const handleUpdate = async (formData) => {
        if (
            resolvedAddressId === undefined ||
            resolvedAddressId === null ||
            String(resolvedAddressId).trim() === ""
        ) {
            setError(
                "A valid address ID is required to update."
            );
            return;
        }

        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const updateUrl =
                `${apiUrl}/${encodeURIComponent(
                    resolvedAddressId
                )}`;

            console.log(
                "Reverse Pickup Address PUT:",
                updateUrl
            );

            console.log(
                "Reverse Pickup Address Update Data:",
                formData
            );

            const response = await axios.put(
                updateUrl,
                formData
            );

            console.log(
                "Reverse Pickup Address Update Response:",
                response.data
            );

            const responseAddress =
                extractAddress(response.data);

            const updatedAddress =
                responseAddress &&
                typeof responseAddress === "object" &&
                !Array.isArray(responseAddress)
                    ? responseAddress
                    : {
                        ...address,
                        ...formData
                    };

            setAddress(updatedAddress);

            setSuccess(
                "Reverse pickup address updated successfully."
            );

            if (typeof onUpdated === "function") {
                onUpdated(updatedAddress);
            }

            if (typeof onSuccess === "function") {
                onSuccess(updatedAddress);
            }
        } catch (requestError) {
            console.error(
                "Update reverse pickup address error:",
                requestError.response?.data ||
                    requestError.message
            );

            setError(
                getErrorMessage(
                    requestError,
                    "Failed to update reverse pickup address."
                )
            );

            throw requestError;
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       RETRY
    ===================================================== */

    const handleRetry = () => {
        setAddress(null);
        fetchAddress();
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 1100,
                mx: "auto",
                p: {
                    xs: 1,
                    sm: 2,
                    md: 3
                }
            }}
        >
            {/* BREADCRUMBS */}

            {showBreadcrumbs && (
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Link
                        component="button"
                        type="button"
                        underline="hover"
                        color="inherit"
                        onClick={handleBack}
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            cursor: submitting
                                ? "not-allowed"
                                : "pointer",
                            opacity: submitting ? 0.5 : 1
                        }}
                    >
                        Reverse Pickup Addresses
                    </Link>

                    <Typography
                        color="text.primary"
                        variant="body2"
                    >
                        Edit Address
                    </Typography>
                </Breadcrumbs>
            )}

            {/* PAGE HEADER */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                alignItems={{
                    xs: "flex-start",
                    sm: "center"
                }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                >
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            bgcolor: "primary.main",
                            color: "primary.contrastText"
                        }}
                    >
                        <LocationOn />
                    </Box>

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Update the selected pickup address details.
                        </Typography>
                    </Box>
                </Stack>

                {/* BACK BUTTON */}

                <Button
                    type="button"
                    variant="outlined"
                    color="inherit"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    disabled={submitting}
                >
                    Back
                </Button>
            </Stack>

            {/* SUCCESS MESSAGE */}

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {success}
                </Alert>
            )}

            {/* ERROR MESSAGE */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        !address ? (
                            <Button
                                type="button"
                                color="inherit"
                                size="small"
                                onClick={handleRetry}
                                disabled={loading}
                            >
                                Retry
                            </Button>
                        ) : undefined
                    }
                >
                    {error}
                </Alert>
            )}

            {/* LOADING STATE */}

            {loading ? (
                <Paper
                    elevation={1}
                    sx={{
                        p: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        borderRadius: 2
                    }}
                >
                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading address details...
                    </Typography>
                </Paper>
            ) : !address ? (
                /* ADDRESS NOT FOUND */

                <Paper
                    elevation={1}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Address Not Found
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        The requested address could not be loaded.
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button
                            type="button"
                            variant="contained"
                            onClick={handleRetry}
                            disabled={loading}
                        >
                            Try Again
                        </Button>

                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                        >
                            Back to Addresses
                        </Button>
                    </Stack>
                </Paper>
            ) : (
                /* EDIT FORM */

                <Paper
                    elevation={1}
                    sx={{
                        p: {
                            xs: 2,
                            sm: 3
                        },
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider"
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{ mb: 1 }}
                    >
                        Address Information
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Update the required fields and save your changes.
                    </Typography>

                    <ReversePickupAddressForm
                        key={String(resolvedAddressId)}
                        mode="edit"
                        address={address}
                        initialData={address}
                        onSubmit={handleUpdate}
                        onCancel={handleBack}
                        loading={submitting}
                        submitting={submitting}
                        error=""
                        success=""
                        showActions
                        showCancelButton
                        submitLabel="Update Address"
                    />
                </Paper>
            )}

            {/* FOOTER BACK BUTTON */}

            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end"
                }}
            >
                <Button
                    type="button"
                    variant="text"
                    color="inherit"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    disabled={submitting}
                >
                    Return to Addresses
                </Button>
            </Box>
        </Box>
    );
};

export default ReversePickupAddressEdit;