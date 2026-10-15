
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL = "http://localhost:5000/api/Picklist";

/* =========================================================
   GET VALUE
========================================================= */

const getValue = (object, fields, fallback = "") => {
    if (!object || typeof object !== "object") {
        return fallback;
    }

    for (const field of fields) {
        const value = object[field];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            return value;
        }
    }

    return fallback;
};

/* =========================================================
   PICKLIST DELETE PAGE
========================================================= */

const PicklistDelete = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [picklist, setPicklist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* =====================================================
       LOAD PICKLIST
    ===================================================== */

    useEffect(() => {
        const loadPicklist = async () => {
            if (!id) {
                setError("Picklist ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const encodedId = encodeURIComponent(id);

                console.log(
                    "GET PICKLIST:",
                    `${API_URL}/${encodedId}`
                );

                const response = await axios.get(
                    `${API_URL}/${encodedId}`
                );

                console.log(
                    "PICKLIST RESPONSE:",
                    response.data
                );

                setPicklist(response.data);
            } catch (err) {
                console.error(
                    "GET PICKLIST ERROR:",
                    err
                );

                /* =========================================
                   FALLBACK TO /all
                ========================================= */

                try {
                    console.log(
                        "GET PICKLIST FALLBACK:",
                        `${API_URL}/all`
                    );

                    const allResponse = await axios.get(
                        `${API_URL}/all`
                    );

                    const records = Array.isArray(
                        allResponse.data
                    )
                        ? allResponse.data
                        : [];

                    const found = records.find((item) => {
                        const itemId = getValue(
                            item,
                            [
                                "picklistId",
                                "PicklistId",
                                "pickListId",
                                "PickListId",
                                "id",
                                "Id",
                                "picklistNumber",
                                "PicklistNumber",
                                "pickListNumber",
                                "PickListNumber"
                            ],
                            ""
                        );

                        return String(itemId) === String(id);
                    });

                    if (found) {
                        setPicklist(found);
                        setError("");
                    } else {
                        setError(
                            `No picklist was found for ID "${id}".`
                        );
                    }
                } catch (fallbackError) {
                    console.error(
                        "GET PICKLIST FALLBACK ERROR:",
                        fallbackError
                    );

                    const message =
                        fallbackError.response?.data?.message ||
                        fallbackError.response?.data?.title ||
                        fallbackError.message ||
                        "Failed to load picklist.";

                    setError(message);
                }
            } finally {
                setLoading(false);
            }
        };

        loadPicklist();
    }, [id]);

    /* =====================================================
       DELETE PICKLIST
    ===================================================== */

    const handleDelete = async () => {
        if (!id) {
            setError("Picklist ID is missing.");
            return;
        }

        try {
            setDeleting(true);
            setError("");
            setSuccess("");

            const encodedId = encodeURIComponent(id);

            const deleteUrl = `${API_URL}/${encodedId}`;

            console.log(
                "DELETE PICKLIST:",
                deleteUrl
            );

            await axios.delete(deleteUrl);

            setSuccess(
                `Picklist "${id}" was deleted successfully.`
            );

            setTimeout(() => {
                navigate("/picklists");
            }, 1000);
        } catch (err) {
            console.error(
                "DELETE PICKLIST ERROR:",
                err
            );

            const responseMessage =
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.response?.data?.error;

            if (err.response?.status === 400) {
                setError(
                    responseMessage ||
                    "The server could not process the deletion request."
                );
            } else if (err.response?.status === 401) {
                setError(
                    "You are not authorized to delete this picklist."
                );
            } else if (err.response?.status === 403) {
                setError(
                    "You do not have permission to delete this picklist."
                );
            } else if (err.response?.status === 404) {
                setError(
                    `Picklist "${id}" was not found or has already been deleted.`
                );
            } else if (err.response?.status === 409) {
                setError(
                    responseMessage ||
                    "This picklist cannot be deleted because it is being used by other records."
                );
            } else {
                setError(
                    responseMessage ||
                    err.message ||
                    "Failed to delete the picklist."
                );
            }
        } finally {
            setDeleting(false);
        }
    };

    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {
        if (!deleting) {
            navigate("/picklists");
        }
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <Box
                sx={{
                    p: 4,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300
                }}
            >
                <Stack
                    spacing={2}
                    alignItems="center"
                >
                    <CircularProgress />

                    <Typography>
                        Loading picklist...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ p: 3 }}>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 650,
                    mx: "auto",
                    borderRadius: 2
                }}
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <Box sx={{ p: 3 }}>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <Typography
                            component="span"
                            sx={{
                                fontSize: 32,
                                lineHeight: 1
                            }}
                        >
                            ⚠
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Delete Picklist
                        </Typography>
                    </Stack>
                </Box>

                <Divider />

                {/* =================================================
                    CONTENT
                ================================================= */}

                <Box sx={{ p: 3 }}>
                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{ mb: 2 }}
                        >
                            {success}
                        </Alert>
                    )}

                    {!error && !success && (
                        <>
                            <Typography
                                variant="body1"
                                sx={{ mb: 3 }}
                            >
                                Are you sure you want to delete
                                this picklist? This action may not
                                be reversible.
                            </Typography>

                            <Stack
                                spacing={2}
                                sx={{
                                    p: 2,
                                    bgcolor: "action.hover",
                                    borderRadius: 2,
                                    mb: 3
                                }}
                            >
                                {/* Picklist ID */}

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={2}
                                >
                                    <Typography
                                        color="text.secondary"
                                    >
                                        Picklist ID
                                    </Typography>

                                    <Typography
                                        fontWeight={700}
                                        sx={{
                                            overflowWrap:
                                                "anywhere"
                                        }}
                                    >
                                        {id}
                                    </Typography>
                                </Stack>

                                {/* Picklist Number */}

                                {picklist && (
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        spacing={2}
                                    >
                                        <Typography
                                            color="text.secondary"
                                        >
                                            Picklist Number
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                            textAlign="right"
                                        >
                                            {String(
                                                getValue(
                                                    picklist,
                                                    [
                                                        "picklistNumber",
                                                        "PicklistNumber",
                                                        "pickListNumber",
                                                        "PickListNumber",
                                                        "picklistNo",
                                                        "PicklistNo"
                                                    ],
                                                    id
                                                )
                                            )}
                                        </Typography>
                                    </Stack>
                                )}

                                {/* Order Number */}

                                {picklist &&
                                    getValue(
                                        picklist,
                                        [
                                            "orderNumber",
                                            "OrderNumber",
                                            "salesOrderNumber",
                                            "SalesOrderNumber",
                                            "orderNo",
                                            "OrderNo"
                                        ],
                                        ""
                                    ) !== "" && (
                                        <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            spacing={2}
                                        >
                                            <Typography
                                                color="text.secondary"
                                            >
                                                Order Number
                                            </Typography>

                                            <Typography
                                                fontWeight={600}
                                            >
                                                {String(
                                                    getValue(
                                                        picklist,
                                                        [
                                                            "orderNumber",
                                                            "OrderNumber",
                                                            "salesOrderNumber",
                                                            "SalesOrderNumber",
                                                            "orderNo",
                                                            "OrderNo"
                                                        ],
                                                        ""
                                                    )
                                                )}
                                            </Typography>
                                        </Stack>
                                    )}

                                {/* Status */}

                                {picklist && (
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        spacing={2}
                                    >
                                        <Typography
                                            color="text.secondary"
                                        >
                                            Status
                                        </Typography>

                                        <Typography
                                            fontWeight={600}
                                        >
                                            {String(
                                                getValue(
                                                    picklist,
                                                    [
                                                        "status",
                                                        "Status",
                                                        "picklistStatus",
                                                        "PicklistStatus"
                                                    ],
                                                    "Unknown"
                                                )
                                            )}
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>

                            <Alert severity="warning">
                                Confirm that this picklist is no
                                longer needed before proceeding.
                            </Alert>
                        </>
                    )}
                </Box>

                <Divider />

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={2}
                    sx={{ p: 2 }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>

                    {!success && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                            disabled={
                                deleting ||
                                Boolean(error && !picklist)
                            }
                            startIcon={
                                deleting ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <Typography
                                        component="span"
                                        sx={{
                                            fontSize: 18,
                                            lineHeight: 1
                                        }}
                                    >
                                        🗑
                                    </Typography>
                                )
                            }
                        >
                            {deleting
                                ? "Deleting..."
                                : "Delete Picklist"}
                        </Button>
                    )}
                </Stack>
            </Paper>
        </Box>
    );
};

export default PicklistDelete;
