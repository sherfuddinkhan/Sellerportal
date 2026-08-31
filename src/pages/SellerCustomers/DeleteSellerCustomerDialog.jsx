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
} from "@mui/material";

// =========================================================
// FIELD HELPER
// =========================================================

const getField = (object, field) => {

    if (!object) {
        return undefined;
    }

    if (object[field] !== undefined) {
        return object[field];
    }

    const pascalField =
        field.charAt(0).toUpperCase() +
        field.slice(1);

    return object[pascalField];

};

// =========================================================
// COMPONENT
// =========================================================

const DeleteSellerCustomerDialog = ({
    open,
    customer,
    onClose,
    onDeleted,
}) => {

    if (!customer) {
        return null;
    }

    // =====================================================
    // VALUES
    // =====================================================

    const customerId =
        getField(
            customer,
            "customerId"
        );

    const customerCode =
        getField(
            customer,
            "customerCode"
        );

    const customerName =
        getField(
            customer,
            "customerName"
        );

    const contactPerson =
        getField(
            customer,
            "contactPerson"
        );

    const email =
        getField(
            customer,
            "email"
        );

    const phone =
        getField(
            customer,
            "phone"
        );

    const gstin =
        getField(
            customer,
            "gstin"
        );

    const city =
        getField(
            customer,
            "city"
        );

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = () => {

        if (!customerId) {
            return;
        }

        onDeleted(
            customerId
        );

    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle>
                Delete Customer
            </DialogTitle>

            <Divider />

            <DialogContent
                sx={{
                    mt: 2,
                }}
            >

                <Typography>
                    Are you sure you want to delete
                    this customer?
                </Typography>

                <Typography
                    sx={{
                        mt: 2,
                    }}
                    fontWeight="bold"
                >
                    Customer ID:{" "}
                    {customerId || "-"}
                </Typography>

                <Typography>
                    Customer Code:{" "}
                    {customerCode || "-"}
                </Typography>

                <Typography>
                    Customer Name:{" "}
                    {customerName || "-"}
                </Typography>

                <Typography>
                    Contact Person:{" "}
                    {contactPerson || "-"}
                </Typography>

                <Typography>
                    Email:{" "}
                    {email || "-"}
                </Typography>

                <Typography>
                    Phone:{" "}
                    {phone || "-"}
                </Typography>

                <Typography>
                    GSTIN:{" "}
                    {gstin || "-"}
                </Typography>

                <Typography>
                    City:{" "}
                    {city || "-"}
                </Typography>

            </DialogContent>

            <DialogActions>

                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeleteSellerCustomerDialog;
