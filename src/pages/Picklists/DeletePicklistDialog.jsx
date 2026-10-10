import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Stack,
    Typography
} from "@mui/material";

import {
    WarningAmber
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = process.env.REACT_APP_API_URL || "";
const PICKLIST_API = `${API_BASE_URL}/api/Picklist`;

/* =========================================================
   GET VALUE FROM MULTIPLE POSSIBLE FIELD NAMES
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
   DELETE PICKLIST DIALOG
========================================================= */

const DeletePicklistDialog = ({
    open = false,
    picklist = null,
    picklistId: suppliedPicklistId,
    apiUrl = PICKLIST_API,
    onClose,
    onDeleted,
    onError,
    deleteOnConfirm = true
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* =====================================================
       PICKLIST IDENTIFICATION
    ===================================================== */

    const picklistId =
        suppliedPicklistId ??
        getValue(
            picklist,
            [
                "picklistId",
                "PicklistId",
                "pickListId",
                "PickListId",
                "id",
                "Id"
            ],
            ""
        );

    const picklistNumber = getValue(
        picklist,
        [
            "picklistNumber",
            "PicklistNumber",
            "pickListNumber",
            "PickListNumber",
            "picklistNo",
            "PicklistNo",
            "number",
            "Number"
        ],
        picklistId !== ""
            ? `Picklist #${picklistId}`
            : "Selected picklist"
    );

    const orderNumber = getValue(
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
    );

    const status = getValue(
        picklist,
        [
            "status",
            "Status",
            "picklistStatus",
            "PicklistStatus"
        ],
        "Unknown"
    );

    /* =====================================================
       RESET ERROR WHEN OPENING
    ===================================================== */

    useEffect(() => {
        if (open) {
            setError("");
        }
    }, [open, picklistId]);

    /* =====================================================
       CLOSE DIALOG
    ===================================================== */

    const handleClose = () => {
        if (loading) {
            return;
        }

        setError("");

        if (typeof onClose === "function") {
            onClose();
        }
    };

    /* =====================================================
       DELETE PICKLIST
    ===================================================== */

    const handleDelete = async () => {
        if (loading) {
            return;
        }

        if (
            picklistId === undefined ||
            picklistId === null ||
            String(picklistId).trim() === ""
        ) {
            const message = "A valid picklist ID is required.";

            setError(message);

            if (typeof onError === "function") {
                onError(new Error(message));
            }

            return;
        }

        setError("");

        /*
         * Set deleteOnConfirm={false} when the parent component
         * performs the deletion through onDeleted.
         */
        if (!deleteOnConfirm) {
            if (typeof onDeleted === "function") {
                try {
                    setLoading(true);
                    await onDeleted(picklist);
                    handleSuccessClose();
                } catch (err) {
                    handleRequestError(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setError(
                    "No deletion handler was provided. Configure onDeleted or enable deleteOnConfirm."
                );
            }

            return;
        }

        setLoading(true);

        try {
            await axios.delete(
                `${apiUrl}/${encodeURIComponent(String(picklistId))}`
            );

            handleSuccessClose();
        } catch (err) {
            handleRequestError(err);
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       SUCCESS HANDLER
    ===================================================== */

    const handleSuccessClose = () => {
        setError("");

        if (typeof onDeleted === "function" && deleteOnConfirm) {
            onDeleted(picklist);
        }

        if (typeof onClose === "function") {
            onClose();
        }
    };

    /* =====================================================
       ERROR HANDLER
    ===================================================== */

    const handleRequestError = (err) => {
        const responseMessage =
            err.response?.data?.message ||
            err.response?.data?.title ||
            err.response?.data?.error;

        let message;

        if (err.response?.status === 400) {
            message =
                responseMessage ||
                "The server could not process this deletion request.";
        } else if (err.response?.status === 401) {
            message = "You are not authorized to delete this picklist.";
        } else if (err.response?.status === 403) {
            message = "You do not have permission to delete this picklist.";
        } else if (err.response?.status === 404) {
            message = "This picklist was not found or has already been deleted.";
        } else if (err.response?.status === 409) {
            message =
                responseMessage ||
                "This picklist cannot be deleted because it conflicts with existing records.";
        } else {
            message =
                responseMessage ||
                err.message ||
                "Failed to delete the picklist. Please try again.";
        }

        setError(message);

        if (typeof onError === "function") {
            onError(err);
        }
    };

    /* =====================================================
       RENDER DIALOG
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            aria-labelledby="delete-picklist-dialog-title"
            aria-describedby="delete-picklist-dialog-description"
        >
            {/* TITLE */}

            <DialogTitle id="delete-picklist-dialog-title">
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <WarningAmber color="error" />

                    <Typography
                        component="span"
                        variant="h6"
                        fontWeight={700}
                    >
                        Delete Picklist
                    </Typography>
                </Stack>
            </DialogTitle>

            <Divider />

            {/* CONTENT */}

            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => setError("")}
                    >
                        {error}
                    </Alert>
                )}

                <DialogContentText
                    id="delete-picklist-dialog-description"
                    sx={{ mb: 2 }}
                >
                    Are you sure you want to delete this picklist? This
                    action may not be reversible.
                </DialogContentText>

                <Stack
                    spacing={1.5}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover"
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Picklist
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={700}
                            textAlign="right"
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {String(picklistNumber)}
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            ID
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {picklistId !== ""
                                ? String(picklistId)
                                : "—"}
                        </Typography>
                    </Stack>

                    {orderNumber !== "" && (
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={2}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Order Number
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                textAlign="right"
                            >
                                {String(orderNumber)}
                            </Typography>
                        </Stack>
                    )}

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Status
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {String(status)}
                        </Typography>
                    </Stack>
                </Stack>

                <Alert severity="warning" sx={{ mt: 2 }}>
                    Confirm that this picklist is no longer needed before
                    proceeding.
                </Alert>
            </DialogContent>

            <Divider />

            {/* ACTIONS */}

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    variant="outlined"
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleDelete}
                    color="error"
                    variant="contained"
                    disabled={loading || picklistId === ""}
                    startIcon={
                        loading ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : (
                            <DeleteOutline />
                        )
                    }
                >
                    {loading ? "Deleting..." : "Delete Picklist"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeletePicklistDialog;

