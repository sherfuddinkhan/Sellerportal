import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    Divider
} from "@mui/material";

import {
    WarningAmber,
    DeleteOutline,
    Close
} from "@mui/icons-material";

/* =========================================================
   DELETE SUPPLIER ADDRESS DIALOG
========================================================= */

const DeleteSupplierAddressDialog = ({
    open,
    onClose,
    onConfirm,
    supplierAddress,
    loading = false
}) => {

    /* =====================================================
       GET SUPPLIER ADDRESS ID
    ===================================================== */

    const addressId =
        supplierAddress?.supplierAddressId ??
        supplierAddress?.SupplierAddressId ??
        supplierAddress?.id ??
        supplierAddress?.Id ??
        "N/A";

    /* =====================================================
       GET SUPPLIER NAME
    ===================================================== */

    const supplierName =
        supplierAddress?.supplierName ??
        supplierAddress?.SupplierName ??
        "N/A";

    /* =====================================================
       GET ADDRESS
    ===================================================== */

    const addressLine1 =
        supplierAddress?.addressLine1 ??
        supplierAddress?.AddressLine1 ??
        supplierAddress?.address ??
        supplierAddress?.Address ??
        "";

    const addressLine2 =
        supplierAddress?.addressLine2 ??
        supplierAddress?.AddressLine2 ??
        "";

    const city =
        supplierAddress?.city ??
        supplierAddress?.City ??
        "";

    const state =
        supplierAddress?.state ??
        supplierAddress?.State ??
        "";

    const postalCode =
        supplierAddress?.postalCode ??
        supplierAddress?.PostalCode ??
        supplierAddress?.zipCode ??
        supplierAddress?.ZipCode ??
        "";

    const country =
        supplierAddress?.country ??
        supplierAddress?.Country ??
        "";

    const formattedAddress = [
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country
    ]
        .filter(value => String(value).trim() !== "")
        .join(", ");

    /* =====================================================
       HANDLE DELETE CONFIRMATION
    ===================================================== */

    const handleConfirm = () => {
        if (loading || !supplierAddress) {
            return;
        }

        if (typeof onConfirm === "function") {
            onConfirm(supplierAddress);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="delete-supplier-address-title"
        >
            <DialogTitle
                id="delete-supplier-address-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pb: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: "error.light",
                        color: "error.dark"
                    }}
                >
                    <WarningAmber />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        Delete Supplier Address
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Confirm before permanently deleting this record.
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3 }}>
                <DialogContentText sx={{ mb: 2 }}>
                    Are you sure you want to delete this supplier address?
                    This action may not be reversible.
                </DialogContentText>

                {supplierAddress && (
                    <Box
                        sx={{
                            p: 2,
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                            bgcolor: "background.default"
                        }}
                    >
                        <Box sx={{ mb: 1.5 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Address ID
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {addressId}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 1.5 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Supplier
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                            >
                                {supplierName}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Address
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {formattedAddress || "No address information available"}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <Divider />

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
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        loading
                            ? <CircularProgress size={18} color="inherit" />
                            : <DeleteOutline />
                    }
                    onClick={handleConfirm}
                    disabled={loading || !supplierAddress}
                >
                    {loading ? "Deleting..." : "Delete Address"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteSupplierAddressDialog;

