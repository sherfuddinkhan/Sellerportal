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

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const API_URL = "http://localhost:5000/api/vendor-item-custom-fields";

/* =========================================================
   DELETE VENDOR ITEM CUSTOM FIELD DIALOG
   Same component name; displayed as a standalone page.
========================================================= */

const DeleteVendorItemCustomFieldDialog = ({
    apiUrl = API_URL,
    onSuccess
}) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    /* =====================================================
       LOAD RECORD
    ===================================================== */

    useEffect(() => {
        let cancelled = false;

        const loadRecord = async () => {
            if (!id) {
                setError("Custom field ID is missing from the URL.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                let result;

                try {
                    const response = await axios.get(
                        `${apiUrl.replace(/\/+$/, "")}/${encodeURIComponent(id)}`
                    );

                    result = response.data?.data ?? response.data;
                } catch (requestError) {
                    if (requestError.response?.status !== 404) {
                        throw requestError;
                    }

                    // Fallback if the backend only provides the /all endpoint.
                    const response = await axios.get(
                        `${apiUrl.replace(/\/+$/, "")}/all`
                    );

                    const data = response.data;
                    const records = Array.isArray(data)
                        ? data
                        : data?.data ??
                          data?.items ??
                          data?.results ??
                          data?.records ??
                          data?.vendorItemCustomFields ??
                          data?.VendorItemCustomFields ??
                          [];

                    result = records.find((item) => {
                        const recordId =
                            item?.vendorItemCustomFieldId ??
                            item?.VendorItemCustomFieldId ??
                            item?.id ??
                            item?.Id;

                        return String(recordId) === String(id);
                    });

                    if (!result) {
                        throw new Error(
                            `Custom field with ID ${id} was not found.`
                        );
                    }
                }

                if (!cancelled) {
                    setRecord(result);
                }
            } catch (requestError) {
                console.error("LOAD CUSTOM FIELD ERROR:", requestError);

                if (!cancelled) {
                    setError(
                        requestError.response?.data?.message ||
                        requestError.response?.data?.Message ||
                        requestError.response?.data?.title ||
                        requestError.message ||
                        "Failed to load the custom field."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadRecord();

        return () => {
            cancelled = true;
        };
    }, [id, apiUrl]);

    /* =====================================================
       RECORD DETAILS
    ===================================================== */

    const recordId =
        record?.vendorItemCustomFieldId ??
        record?.VendorItemCustomFieldId ??
        record?.id ??
        record?.Id ??
        id;

    const fieldName =
        record?.name ??
        record?.Name ??
        record?.fieldName ??
        record?.FieldName ??
        record?.fieldLabel ??
        record?.FieldLabel ??
        "—";

    const fieldValue =
        record?.value ??
        record?.Value ??
        record?.fieldValue ??
        record?.FieldValue ??
        "—";

    const vendorItemMasterId =
        record?.vendorItemMasterId ??
        record?.VendorItemMasterId ??
        "—";

    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {
        navigate("/vendor-item-custom-fields");
    };

    /* =====================================================
       DELETE RECORD
    ===================================================== */

    const handleDelete = async () => {
        if (!recordId) {
            setError("Unable to delete: the custom field ID is missing.");
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await axios.delete(
                `${apiUrl.replace(/\/+$/, "")}/${encodeURIComponent(String(recordId))}`
            );

            if (onSuccess) {
                await onSuccess(record);
            }

            navigate("/vendor-item-custom-fields", {
                replace: true,
                state: {
                    message: "Custom field deleted successfully."
                }
            });
        } catch (requestError) {
            console.error(
                "DELETE VENDOR ITEM CUSTOM FIELD ERROR:",
                requestError
            );

            const responseMessage =
                requestError.response?.data?.message ??
                requestError.response?.data?.Message ??
                requestError.response?.data?.title ??
                requestError.response?.data?.Title;

            if (requestError.response?.status === 404) {
                setError(
                    "The custom field or delete endpoint was not found. Check your backend API route."
                );
            } else if (requestError.response?.status === 401) {
                setError("You are not authorized to delete this custom field.");
            } else if (requestError.response?.status === 403) {
                setError("You do not have permission to delete this custom field.");
            } else if (requestError.response?.status === 409) {
                setError(
                    responseMessage ||
                    "This custom field cannot be deleted because it is being used elsewhere."
                );
            } else if (!requestError.response) {
                setError(
                    "Unable to connect to the API server. Check that your Node.js server is running on port 5000."
                );
            } else {
                setError(
                    responseMessage ||
                    requestError.message ||
                    "Failed to delete the custom field."
                );
            }
        } finally {
            setDeleting(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 800,
                mx: "auto",
                p: { xs: 2, sm: 3, md: 4 }
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3
                }}
            >
                <Stack spacing={3}>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                bgcolor: "error.light",
                                color: "error.dark",
                                flexShrink: 0
                            }}
                        >
                            <DeleteIcon />
                        </Box>

                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                Delete Custom Field
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Review the record before deleting it.
                            </Typography>
                        </Box>
                    </Box>

                    <Divider />

                    {error && (
                        <Alert
                            severity="error"
                            onClose={() => setError("")}
                        >
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            gap={2}
                            sx={{ py: 5 }}
                        >
                            <CircularProgress size={28} />
                            <Typography>
                                Loading custom field...
                            </Typography>
                        </Box>
                    ) : record ? (
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: "action.hover",
                                overflowWrap: "anywhere"
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Field ID
                            </Typography>

                            <Typography fontWeight={600} sx={{ mb: 2 }}>
                                {recordId}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Field Name
                            </Typography>

                            <Typography fontWeight={600} sx={{ mb: 2 }}>
                                {fieldName}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Field Value
                            </Typography>

                            <Typography fontWeight={600} sx={{ mb: 2 }}>
                                {fieldValue}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Vendor Item Master ID
                            </Typography>

                            <Typography fontWeight={600}>
                                {vendorItemMasterId}
                            </Typography>
                        </Box>
                    ) : (
                        <Alert severity="warning">
                            The custom field details could not be loaded.
                        </Alert>
                    )}

                    <Alert
                        severity="warning"
                        icon={<WarningAmberIcon />}
                    >
                        Are you sure you want to delete this custom field?
                        This action cannot be undone.
                    </Alert>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        justifyContent="flex-end"
                    >
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<ArrowBackIcon />}
                            onClick={handleCancel}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={
                                deleting ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <DeleteIcon />
                                )
                            }
                            onClick={handleDelete}
                            disabled={loading || deleting || !record}
                        >
                            {deleting ? "Deleting..." : "Confirm Delete"}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
};

export default DeleteVendorItemCustomFieldDialog;
