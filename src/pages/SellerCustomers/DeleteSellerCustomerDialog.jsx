// =========================================================
// DeleteSellerCustomerDialog.jsx
// =========================================================

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Stack,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    Delete as DeleteIcon,
    WarningAmber as WarningIcon
} from "@mui/icons-material";

// =========================================================
// FIELD HELPER
// =========================================================

const getField = (object, field) => {
    if (!object) return undefined;

    if (object[field] !== undefined) {
        return object[field];
    }

    const pascalField =
        field.charAt(0).toUpperCase() + field.slice(1);

    if (object[pascalField] !== undefined) {
        return object[pascalField];
    }

    return undefined;
};

// =========================================================
// COMPONENT
// =========================================================

const DeleteSellerCustomerDialog = ({
    open,
    customer,
    onClose,
    onDeleted,
    loading = false
}) => {
    if (!customer) return null;

    // =====================================================
    // CUSTOMER VALUES
    // =====================================================

    const customerId =
        getField(customer, "customerId") ??
        getField(customer, "sellerCustomerId") ??
        getField(customer, "id");

    const customerCode =
        getField(customer, "customerCode");

    const customerName =
        getField(customer, "customerName") ??
        getField(customer, "name");

    const contactPerson =
        getField(customer, "contactPerson");

    const email =
        getField(customer, "email");

    const phone =
        getField(customer, "phone");

    const gstin =
        getField(customer, "gstin");

    const city =
        getField(customer, "city");

    // =====================================================
    // DELETE HANDLER
    // =====================================================

    const handleDelete = () => {
        if (
            customerId === undefined ||
            customerId === null ||
            String(customerId).trim() === "" ||
            loading
        ) {
            return;
        }

        // SellerCustomerList performs the API request.
        onDeleted(customerId);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >
                    <WarningIcon color="error" />
                    <Typography variant="h6" fontWeight="bold">
                        Delete Seller Customer
                    </Typography>
                </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ mt: 2 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    This action may not be reversible.
                </Alert>

                <Typography sx={{ mb: 2 }}>
                    Are you sure you want to delete this customer?
                </Typography>

                <Stack spacing={1}>
                    <Typography>
                        <strong>Customer ID:</strong>{" "}
                        {customerId ?? "-"}
                    </Typography>

                    <Typography>
                        <strong>Customer Code:</strong>{" "}
                        {customerCode || "-"}
                    </Typography>

                    <Typography>
                        <strong>Customer Name:</strong>{" "}
                        {customerName || "-"}
                    </Typography>

                    <Typography>
                        <strong>Contact Person:</strong>{" "}
                        {contactPerson || "-"}
                    </Typography>

                    <Typography>
                        <strong>Email:</strong>{" "}
                        {email || "-"}
                    </Typography>

                    <Typography>
                        <strong>Phone:</strong>{" "}
                        {phone || "-"}
                    </Typography>

                    <Typography>
                        <strong>GSTIN:</strong>{" "}
                        {gstin || "-"}
                    </Typography>

                    <Typography>
                        <strong>City:</strong>{" "}
                        {city || "-"}
                    </Typography>
                </Stack>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="outlined"
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
                            : <DeleteIcon />
                    }
                    onClick={handleDelete}
                    disabled={
                        loading ||
                        customerId === undefined ||
                        customerId === null ||
                        String(customerId).trim() === ""
                    }
                >
                    {loading ? "Deleting..." : "Delete Customer"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteSellerCustomerDialog;
