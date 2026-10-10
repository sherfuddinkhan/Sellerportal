import React, {
    useEffect,
    useState,
    useCallback
} from "react";

import axios from "axios";

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
    Save,
    LocationOn
} from "@mui/icons-material";

import ReversePickupAddressForm from "./ReversePickupAddressForm";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = (
    import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const DEFAULT_API_ENDPOINT = "/api/ReversePickupAddress";

const getEndpoint = (endpoint) => {
    const path = endpoint || DEFAULT_API_ENDPOINT;

    return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
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
        return Object.values(data.errors).flat().join(" ");
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

    if (responseData.data && !Array.isArray(responseData.data)) {
        return responseData.data;
    }

    if (responseData.result && !Array.isArray(responseData.result)) {
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
       IDENTIFIER
    ===================================================== */

    const resolvedAddressId = addressId ?? id;

    const apiUrl = getEndpoint(endpoint);

    /* =====================================================
       STATE
    ===================================================== */

    const [address, setAddress] = useState(initialAddress);

    const [loading, setLoading] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    /* =====================================================
       LOAD ADDRESS
    ===================================================== */

    const fetchAddress = useCallback(async () => {
        if (
            resolvedAddressId === undefined ||
            resolvedAddressId === null ||
            resolvedAddressId === ""
        ) {
            setError("A valid address ID is required.");
            setAddress(null);
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.get(
                `${apiUrl}/${encodeURIComponent(resolvedAddressId)}`
            );

            const record = extractAddress(response.data);

            if (!record || typeof record !== "object") {
                setAddress(null);
                setError("Address information was not found.");
                return;
            }

            setAddress(record);
        } catch (requestError) {
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
            resolvedAddressId === ""
        ) {
            setError("A valid address ID is required to update.");
            return;
        }

        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.put(
                `${apiUrl}/${encodeURIComponent(resolvedAddressId)}`,
                formData
            );

            const updatedAddress =
                extractAddress(response.data) || {
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
            const message = getErrorMessage(
                requestError,
                "Failed to update reverse pickup address."
            );

            setError(message);

            throw requestError;
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {
        if (submitting) {
            return;
        }

        if (typeof onCancel === "function") {
            onCancel();
            return;
        }

        if (typeof navigateBack === "function") {
            navigateBack();
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
            {/* =================================================
                BREADCRUMBS
            ================================================= */}

            {showBreadcrumbs && (
                <Breadcrumbs sx={{ mb: 2 }}>
                    <Link
                        component="button"
                        underline="hover"
                        color="inherit"
                        onClick={handleCancel}
                        disabled={submitting}
                        sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            cursor: "pointer"
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

            {/* =================================================
                PAGE HEADER
            ================================================= */}

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

                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                    disabled={submitting}
                >
                    Back
                </Button>
            </Stack>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {success}
                </Alert>
            )}

            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    action={
                        !address ? (
                            <Button
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

            {/* =================================================
                LOADING STATE
            ================================================= */}

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

                    <Button
                        variant="contained"
                        onClick={handleRetry}
                        disabled={loading}
                    >
                        Try Again
                    </Button>
                </Paper>
            ) : (
                /* =============================================
                   EDIT FORM
                ============================================= */

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
                        onSubmit={handleUpdate}
                        onCancel={handleCancel}
                        submitting={submitting}
                        error=""
                        success=""
                        showActions
                        showCancelButton
                        submitLabel="Update Address"
                    />
                </Paper>
            )}

            {/* =================================================
                FOOTER
            ================================================= */}

            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "flex-end"
                }}
            >
                <Button
                    variant="text"
                    color="inherit"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                    disabled={submitting}
                >
                    Return to Addresses
                </Button>
            </Box>
        </Box>
    );
};

export default ReversePickupAddressEdit;

