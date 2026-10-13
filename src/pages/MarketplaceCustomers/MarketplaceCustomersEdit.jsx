import React, { useEffect, useState } from "react";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField
} from "@mui/material";

const getField = (row, name) =>
    row?.[name] ??
    row?.[name.charAt(0).toUpperCase() + name.slice(1)] ??
    "";

function MarketplaceCustomersEdit({
    open,
    customer,
    onClose,
    onSave,
    saving = false
}) {
    const [form, setForm] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        if (customer) {
            setForm({
                sellerId: getField(customer, "sellerId"),
                customerId: getField(customer, "customerId"),
                marketplaceCustomerId: getField(customer, "marketplaceCustomerId"),
                marketplaceName: getField(customer, "marketplaceName"),
                companyName: getField(customer, "companyName"),
                gstin: getField(customer, "gstin"),
                email: getField(customer, "email"),
                phone: getField(customer, "phone"),
                address: getField(customer, "address"),
                city: getField(customer, "city"),
                state: getField(customer, "state"),
                stateCode: getField(customer, "stateCode"),
                pincode: getField(customer, "pincode")
            });
            setError("");
        }
    }, [customer, open]);

    const handleChange = (event) => {
        setForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.sellerId || !form.customerId || !form.marketplaceName) {
            setError("Seller ID, Customer ID, and Marketplace are required.");
            return;
        }

        if (!onSave) {
            setError("Update API is not connected yet.");
            return;
        }

        onSave({
            ...customer,
            ...form,
            sellerId: Number(form.sellerId),
            customerId: Number(form.customerId)
        });
    };

    const fields = [
        ["marketplaceCustomerId", "Marketplace Customer ID"],
        ["marketplaceName", "Marketplace Name"],
        ["companyName", "Company Name"],
        ["gstin", "GSTIN"],
        ["email", "Email"],
        ["phone", "Phone"],
        ["address", "Address"],
        ["city", "City"],
        ["state", "State"],
        ["stateCode", "State Code"],
        ["pincode", "Pincode"]
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle>Edit Marketplace Customer</DialogTitle>

                <DialogContent dividers>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={2} sx={{ pt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Seller ID"
                                name="sellerId"
                                value={form.sellerId ?? ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Customer ID"
                                name="customerId"
                                value={form.customerId ?? ""}
                                onChange={handleChange}
                            />
                        </Grid>

                        {fields.map(([name, label]) => (
                            <Grid item xs={12} sm={6} key={name}>
                                <TextField
                                    fullWidth
                                    required={name === "marketplaceName"}
                                    type={name === "email" ? "email" : "text"}
                                    label={label}
                                    name={name}
                                    value={form[name] ?? ""}
                                    onChange={handleChange}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default MarketplaceCustomersEdit;