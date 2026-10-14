
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Snackbar,
    Stack
} from "@mui/material";

import {
    Edit,
    ArrowBack,
    Refresh
} from "@mui/icons-material";

import ShippingManifestForm from "./ShippingManifestForm";

const API_URL = "http://localhost:5000/api/shipping-manifests";

/* =========================================================
   GET FIELD - SUPPORT CAMEL CASE AND PASCAL CASE
========================================================= */

const getField = (record, ...keys) => {
    if (!record || typeof record !== "object") {
        return null;
    }

    for (const key of keys) {
        const value = record[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return null;
};

/* =========================================================
   NORMALIZE ID
========================================================= */

const normalizeId = (value) => {
    if (value === undefined || value === null) {
        return "";
    }

    return String(value).trim().toLowerCase();
};

/* =========================================================
   GET MANIFEST IDENTIFIER
========================================================= */


const getManifestId = (manifest) =>
    getField(
        manifest,
        "shippingManifestCode",
        "ShippingManifestCode",
        "shippingManifestId",
        "ShippingManifestId",
        "manifestNumber",
        "ManifestNumber",
        "manifestCode",
        "ManifestCode",
        "id",
        "Id"
    );

/* =========================================================
   VALIDATE IDENTIFIER
========================================================= */

const isValidManifestId = (value) => {
    if (value === undefined || value === null) {
        return false;
    }

    const id = String(value).trim();

    if (!id) {
        return false;
    }

    // Reject negative or zero numeric IDs.
    if (/^-?\d+$/.test(id)) {
        const number = Number(id);

        return Number.isSafeInteger(number) && number > 0;
    }

    return id.length >= 2;
};

/* =========================================================
   EXTRACT SINGLE MANIFEST
========================================================= */

const extractManifest = (responseData) => {
    if (
        !responseData ||
        typeof responseData !== "object" ||
        Array.isArray(responseData)
    ) {
        return null;
    }

    const candidates = [
        responseData.data,
        responseData.Data,
        responseData.manifest,
        responseData.Manifest,
        responseData.item,
        responseData.Item,
        responseData.result,
        responseData.Result
    ];

    for (const candidate of candidates) {
        if (
            candidate &&
            typeof candidate === "object" &&
            !Array.isArray(candidate)
        ) {
            // Handle { data: { data: { ... } } }.
            const nested = extractManifest(candidate);

            if (nested) {
                return nested;
            }
        }
    }

    // Avoid treating a wrapper containing only an array as a manifest.
    const hasList = [
        responseData.data,
        responseData.Data,
        responseData.items,
        responseData.Items,
        responseData.manifests,
        responseData.Manifests,
        responseData.results,
        responseData.Results
    ].some(Array.isArray);

    if (hasList) {
        return null;
    }

    return responseData;
};

/* =========================================================
   EXTRACT MANIFEST LIST
========================================================= */

const extractManifestList = (responseData, depth = 0) => {
    if (depth > 6 || responseData == null) {
        return [];
    }

    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (typeof responseData !== "object") {
        return [];
    }

    const listKeys = [
        "data",
        "Data",
        "items",
        "Items",
        "manifests",
        "Manifests",
        "results",
        "Results",
        "records",
        "Records",
        "result",
        "Result"
    ];

    for (const key of listKeys) {
        const value = responseData[key];

        if (Array.isArray(value)) {
            return value;
        }
    }

    for (const key of listKeys) {
        const value = responseData[key];

        if (value && typeof value === "object") {
            const nested = extractManifestList(value, depth + 1);

            if (nested.length > 0) {
                return nested;
            }
        }
    }

    // Some APIs return one record rather than a list.
    if (
        getField(
            responseData,
            "shippingManifestCode",
            "ShippingManifestCode",
            "manifestCode",
            "ManifestCode"
        ) !== null
    ) {
        return [responseData];
    }

    return [];
};

/* =========================================================
   FIND MANIFEST BY CODE OR DATABASE ID
========================================================= */


const findManifest = (list, requestedId) => {
    const target = normalizeId(requestedId);

    return list.find((record) => {
        const identifiers = [
            getField(record, "shippingManifestCode", "ShippingManifestCode"),
            getField(record, "shippingManifestId", "ShippingManifestId"),
            getField(record, "manifestNumber", "ManifestNumber"),
            getField(record, "manifestCode", "ManifestCode"),
            getField(record, "id", "Id")
        ];

        return identifiers.some(
            (value) => normalizeId(value) === target
        );
    });
};

/* =========================================================
   BUILD UPDATE PAYLOAD
========================================================= */

const buildUpdatePayload = (formData) => {
    let createdDate =
        formData?.createdDate ??
        formData?.CreatedDate ??
        "";

    if (createdDate) {
        const date = new Date(createdDate);

        if (!Number.isNaN(date.getTime())) {
            createdDate = date.toISOString();
        }
    } else {
        createdDate = new Date().toISOString();
    }

    const toNullableNumber = (value) => {
        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {
            return null;
        }

        const number = Number(value);

        return Number.isFinite(number) ? number : null;
    };

    const thirdPartyShipping =
        formData?.thirdPartyShipping ??
        formData?.ThirdPartyShipping;

    return {
        shippingManifestCode:
            formData?.shippingManifestCode ??
            formData?.ShippingManifestCode ??
            "",

        channel:
            formData?.channel ??
            formData?.Channel ??
            "",

        shippingProviderCode:
            formData?.shippingProviderCode ??
            formData?.ShippingProviderCode ??
            "",

        shippingProviderName:
            formData?.shippingProviderName ??
            formData?.ShippingProviderName ??
            "",

        shippingMethodCode:
            formData?.shippingMethodCode ??
            formData?.ShippingMethodCode ??
            "",

        comments:
            formData?.comments ??
            formData?.Comments ??
            "",

        status:
            formData?.status ??
            formData?.Status ??
            "Pending",

        createdDate,

        thirdPartyShipping:
            thirdPartyShipping === true ||
            thirdPartyShipping === "true" ||
            thirdPartyShipping === 1 ||
            thirdPartyShipping === "1",

        sellerId: toNullableNumber(
            formData?.sellerId ??
            formData?.SellerId
        ),

        customerId: toNullableNumber(
            formData?.customerId ??
            formData?.CustomerId
        ),

        courierCode:
            formData?.courierCode ??
            formData?.CourierCode ??
            "",

        trackingNumber:
            formData?.trackingNumber ??
            formData?.TrackingNumber ??
            "",

        manifestType:
            formData?.manifestType ??
            formData?.ManifestType ??
            ""
    };
};

/* =========================================================
   ERROR MESSAGE
========================================================= */

const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string") {
        return data;
    }

    if (data?.errors) {
        return Object.entries(data.errors)
            .map(([key, value]) => {
                const message = Array.isArray(value)
                    ? value.join(", ")
                    : String(value);

                return `${key}: ${message}`;
            })
            .join(" | ");
    }

    return (
        data?.message ||
        data?.Message ||
        data?.title ||
        error?.message ||
        "An unexpected error occurred."
    );
};

/* =========================================================
   SHIPPING MANIFEST EDIT
========================================================= */

const ShippingManifestEdit = ({
    id,
    manifestId,
    manifest: initialManifest = null,
    onUpdated,
    onCancel,
    apiUrl = API_URL,
    embedded = false
}) => {
    const params = useParams();
    const navigate = useNavigate();

    const requestedId =
        id ??
        manifestId ??
        params.id ??
        getManifestId(initialManifest);

    const [manifest, setManifest] = useState(initialManifest);
    const [loading, setLoading] = useState(!initialManifest);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [notice, setNotice] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const showNotice = (message, severity = "success") => {
        setNotice({
            open: true,
            message,
            severity
        });
    };

    const closeNotice = () => {
        setNotice((previous) => ({
            ...previous,
            open: false
        }));
    };

    /* =====================================================
       FETCH MANIFEST
    ===================================================== */

 

const fetchManifest = useCallback(async () => {
    if (!isValidManifestId(requestedId)) {
        setManifest(null);
        setError(
            `Invalid shipping manifest ID: ${requestedId ?? "missing"}`
        );
        setLoading(false);
        return;
    }

    const targetId = String(requestedId).trim();

    setLoading(true);
    setError("");

    const matchesId = (record) => {
        const identifiers = [
            getField(record, "shippingManifestCode", "ShippingManifestCode"),
            getField(record, "shippingManifestId", "ShippingManifestId"),
            getField(record, "manifestNumber", "ManifestNumber"),
            getField(record, "manifestCode", "ManifestCode"),
            getField(record, "id", "Id")
        ];

        return identifiers.some(
            (value) =>
                value !== null &&
                normalizeId(value) === normalizeId(targetId)
        );
    };

    try {
        let found = null;

        // First: fetch the specific manifest.
        try {
            const directUrl =
                `${apiUrl}/${encodeURIComponent(targetId)}`;

            console.log("GET MANIFEST:", directUrl);

            const response = await axios.get(directUrl);
            const record = extractManifest(response.data);

            console.log("DIRECT API RESPONSE:", response.data);

            if (record && matchesId(record)) {
                found = record;
            }
        } catch (directError) {
            console.warn(
                "Direct manifest request failed:",
                directError.response?.status,
                directError.message
            );
        }

        // Second: search the complete list if direct lookup did not match.
        if (!found) {
            const allUrl = `${apiUrl}/all`;

            console.log("GET ALL MANIFESTS:", allUrl);

            const response = await axios.get(allUrl);

            console.log("ALL API RESPONSE:", response.data);

            const list = Array.isArray(response.data)
                ? response.data
                : extractManifestList(response.data);

            console.log("MANIFEST COUNT:", list.length);

            found = findManifest(list, targetId);

            console.log("MATCHED MANIFEST:", found);
        }

        if (!found) {
            throw new Error(
                `Shipping manifest "${targetId}" was not found. ` +
                "Check the browser console and Network response."
            );
        }

        setManifest(found);
        setError("");
    } catch (fetchError) {
        console.error("FETCH MANIFEST ERROR:", fetchError);

        setManifest(null);
        setError(getErrorMessage(fetchError));
    } finally {
        setLoading(false);
    }
}, [requestedId, apiUrl]);


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        if (initialManifest) {
            setManifest(initialManifest);
            setError("");
            setLoading(false);
            return;
        }

        fetchManifest();
    }, [initialManifest, fetchManifest]);

    /* =====================================================
       UPDATE MANIFEST
    ===================================================== */

    const handleUpdate = async (formData) => {
        const currentId =
            getManifestId(manifest) ??
            requestedId;

        if (!isValidManifestId(currentId)) {
            showNotice("A valid manifest ID is required.", "error");
            return;
        }

        const code =
            formData?.shippingManifestCode ??
            formData?.ShippingManifestCode ??
            "";

        if (!String(code).trim()) {
            showNotice("Manifest code is required.", "error");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = buildUpdatePayload(formData);

            const requestUrl =
                `${apiUrl}/${encodeURIComponent(String(currentId))}`;

            console.log("UPDATE MANIFEST URL:", requestUrl);
            console.log("UPDATE MANIFEST PAYLOAD:", payload);

            const response = await axios.put(
                requestUrl,
                payload
            );

            console.log(
                "UPDATE MANIFEST RESPONSE:",
                response.data
            );

            const updatedManifest = extractManifest(response.data);

            const result = {
                ...(manifest || {}),
                ...payload,
                ...(updatedManifest || {})
            };

            if (!getManifestId(result)) {
                result.shippingManifestCode = String(currentId);
            }

            setManifest(result);

            showNotice(
                "Shipping manifest updated successfully.",
                "success"
            );

            if (onUpdated) {
                onUpdated(result);
            }
        } catch (updateError) {
            console.error(
                "UPDATE SHIPPING MANIFEST ERROR:",
                updateError
            );

            const message = getErrorMessage(updateError);

            setError(message);
            showNotice(message, "error");
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       NAVIGATION
    ===================================================== */

    const handleBack = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate("/shipping-manifests");
        }
    };

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading shipping manifest...
                </Typography>
            </Box>
        );
    }

    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error && !manifest) {
        return (
            <Box
                sx={{
                    width: "100%",
                    p: { xs: 1, sm: 2, md: 3 }
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        p: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Edit Shipping Manifest
                    </Typography>

                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        Requested ID: {String(requestedId ?? "Missing")}
                    </Typography>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                    >
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={fetchManifest}
                        >
                            Retry
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                        >
                            Back to List
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        );
    }

    /* =====================================================
       MAIN CONTENT
    ===================================================== */

    const content = (
        <>
            {!embedded && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 3
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <Edit color="primary" />

                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                            >
                                Edit Shipping Manifest
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Update details for{" "}
                                {String(requestedId)}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={fetchManifest}
                            disabled={saving}
                        >
                            Refresh
                        </Button>

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                            disabled={saving}
                        >
                            Back
                        </Button>
                    </Stack>
                </Box>
            )}

            {error && manifest && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            <ShippingManifestForm
                key={String(
                    getManifestId(manifest) ?? requestedId
                )}
                manifest={manifest}
                mode="edit"
                loading={false}
                saving={saving}
                onSubmit={handleUpdate}
                onCancel={handleBack}
                submitLabel="Update Manifest"
                showReset
            />

            <Snackbar
                open={notice.open}
                autoHideDuration={5000}
                onClose={closeNotice}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    onClose={closeNotice}
                    severity={notice.severity}
                    variant="filled"
                >
                    {notice.message}
                </Alert>
            </Snackbar>
        </>
    );

    return embedded ? (
        content
    ) : (
        <Box
            sx={{
                width: "100%",
                p: { xs: 1, sm: 2, md: 3 }
            }}
        >
            {content}
        </Box>
    );
};

export default ShippingManifestEdit;
