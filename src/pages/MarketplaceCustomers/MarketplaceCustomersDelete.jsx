import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert,
    Typography,
    Button
} from "@mui/material";

import { Delete as DeleteIcon } from "@mui/icons-material";

function MarketplaceCustomersDelete({
    open,
    customer,
    loading = false,
    onCancel,
    onConfirm
}) {
    // Supports both camelCase and PascalCase API responses
    const getField = (name) => {
        if (!customer) return "—";

        const pascalCaseName =
            name.charAt(0).toUpperCase() + name.slice(1);

        return customer[name] ??
            customer[pascalCaseName] ??
            "—";
    };

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onCancel}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Delete Marketplace Customer
            </DialogTitle>

            <DialogContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Please confirm before deleting this customer mapping.
                </Alert>

                <DialogContentText>
                    Are you sure you want to delete this marketplace
                    customer record?
                </DialogContentText>

                {customer && (
                    <>
                        <Typography sx={{ mt: 2 }}>
                            <strong>Record ID:</strong>{" "}
                            {getField("id")}
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            <strong>Company:</strong>{" "}
                            {getField("companyName")}
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            <strong>Marketplace:</strong>{" "}
                            {getField("marketplaceName")}
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            <strong>Seller ID:</strong>{" "}
                            {getField("sellerId")}
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            <strong>Customer ID:</strong>{" "}
                            {getField("customerId")}
                        </Typography>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    disabled={loading || !customer}
                    onClick={onConfirm}
                >
                    {loading ? "Deleting..." : "Confirm Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default MarketplaceCustomersDelete;
