// =========================================================
// DeleteGatepassDialog.jsx
// =========================================================

import React, { useState, useEffect } from "react";

import axios from "axios";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Divider
} from "@mui/material";

import {
    Delete,
    WarningAmber,
    Close
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION
// =========================================================

const API_URL = "http://localhost:5000/api/Gatepass";

// =========================================================
// GET FIELD VALUE
// Supports camelCase and PascalCase.
// =========================================================

const getField = (record, ...keys) => {
    for (const key of keys) {
        if (
            record?.[key] !== undefined &&
            record?.[key] !== null
        ) {
            return record[key];
        }
    }

    return "";
};

// =========================================================
// GET GATEPASS ID
// =========================================================

const getGatepassId = (gatepass) => {
    return getField(
        gatepass,
        "gatepassId",
        "GatepassId",
        "gatePassId",
        "GatePassId",
        "id",
        "Id"
    );
};

// =========================================================
// DELETE GATEPASS DIALOG
// =========================================================

const DeleteGatepassDialog = ({
    open = false,
    onClose,
    gatepass,
    gatepassId: gatepassIdProp,
    sellerId: sellerIdProp,
    customerId: customerIdProp,
    onDeleted
}) => {

    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // RESOLVE IDS
    // =====================================================

    const gatepassId =
        gatepassIdProp ??
        getGatepassId(gatepass);

    const sellerId =
        sellerIdProp ??
        localStorage.getItem("sellerId") ??
        localStorage.getItem("SellerId");

    const customerId =
        customerIdProp ??
        localStorage.getItem("customerId") ??
        localStorage.getItem("CustomerId");

    // =====================================================
    // GATEPASS DISPLAY DETAILS
    // =====================================================

    const gatepassCode = getField(
        gatepass,
        "gatepassCode",
        "GatepassCode",
        "gatepassNumber",
        "GatepassNumber",
        "gatePassCode",
        "GatePassCode"
    );

    const vehicleNumber = getField(
        gatepass,
        "vehicleNumber",
        "VehicleNumber",
        "vehicleNo",
        "VehicleNo"
    );

    const driverName = getField(
        gatepass,
        "driverName",
        "DriverName"
    );

    // =====================================================
    // RESET ERROR WHEN OPENED
    // =====================================================

    useEffect(() => {
        if (open) {
            setError("");
        }
    }, [open, gatepassId]);

    // =====================================================
    // CLOSE DIALOG
    // =====================================================

    const handleClose = () => {
        if (loading) {
            return;
        }

        setError("");

        if (typeof onClose === "function") {
            onClose();
        }
    };

    // =====================================================
    // DELETE GATEPASS
    // =====================================================

    const handleDelete = async () => {
        if (
            gatepassId === undefined ||
            gatepassId === null ||
            String(gatepassId).trim() === ""
        ) {
            setError(
                "Gatepass ID is missing. Select a valid gatepass record."
            );
            return;
        }

        if (
            sellerId === undefined ||
            sellerId === null ||
            String(sellerId).trim() === "" ||
            customerId === undefined ||
            customerId === null ||
            String(customerId).trim() === ""
        ) {
            setError(
                "Seller ID or Customer ID is missing. Verify your IDs before deleting."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.delete(
                `${API_URL}/${encodeURIComponent(gatepassId)}` +
                `/seller/${encodeURIComponent(sellerId)}` +
                `/customer/${encodeURIComponent(customerId)}`
            );

            // Notify the parent so it can refresh the list.
            if (typeof onDeleted === "function") {
                onDeleted(gatepass, response.data);
            }

            // Close only after the API call succeeds.
            if (typeof onClose === "function") {
                onClose();
            }
        } catch (err) {
            console.error(
                "Error deleting gatepass:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to delete the gatepass. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="delete-gatepass-title"
        >
            {/* =================================================
                DIALOG TITLE
            ================================================= */}

            <DialogTitle
                id="delete-gatepass-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        bgcolor: "error.light",
                        color: "error.dark"
                    }}
                >
                    <WarningAmber />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        component="div"
                        fontWeight={700}
                    >
                        Delete Gatepass
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Confirm this action before proceeding.
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider />

            {/* =================================================
                DIALOG CONTENT
            ================================================= */}

            <DialogContent sx={{ pt: 3 }}>
                <DialogContentText sx={{ mb: 2 }}>
                    Are you sure you want to delete this gatepass?
                    This action may not be reversible.
                </DialogContentText>

                {/* SELECTED RECORD */}

                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        mb: 2
                    }}
                >
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        Gatepass Code
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ overflowWrap: "anywhere" }}
                    >
                        {gatepassCode || "Not available"}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        Vehicle Number
                    </Typography>

                    <Typography
                        variant="body1"
                        fontWeight={500}
                    >
                        {vehicleNumber || "Not available"}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        Driver Name
                    </Typography>

                    <Typography
                        variant="body1"
                        fontWeight={500}
                    >
                        {driverName || "Not available"}
                    </Typography>

                    {gatepassId !== undefined &&
                        gatepassId !== null &&
                        String(gatepassId).trim() !== "" && (
                            <>
                                <Divider sx={{ my: 1.5 }} />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    Gatepass ID
                                </Typography>

                                <Typography variant="body1">
                                    {gatepassId}
                                </Typography>
                            </>
                        )}
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 1 }}
                    >
                        {error}
                    </Alert>
                )}
            </DialogContent>

            <Divider />

            {/* =================================================
                DIALOG ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    p: 2.5,
                    gap: 1
                }}
            >
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Close />}
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        loading
                            ? <CircularProgress
                                size={18}
                                color="inherit"
                              />
                            : <Delete />
                    }
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete Gatepass"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteGatepassDialog;

