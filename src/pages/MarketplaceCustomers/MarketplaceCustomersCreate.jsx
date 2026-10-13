import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/marketplace/customers";

const initialForm = {
    sellerId: "",
    customerId: "",
    marketplaceCustomerId: "",
    marketplaceName: "",
    companyName: "",
    gstin: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    stateCode: "",
    pincode: ""
};

function MarketplaceCustomersCreate() {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !form.sellerId ||
            !form.customerId ||
            !form.marketplaceName.trim()
        ) {
            setError(
                "Seller ID, Customer ID, and Marketplace Name are required."
            );
            return;
        }

        const payload = {
            sellerId: Number(form.sellerId),
            customerId: Number(form.customerId),
            marketplaceCustomerId: form.marketplaceCustomerId.trim(),
            marketplaceName: form.marketplaceName.trim(),
            companyName: form.companyName.trim(),
            gstin: form.gstin.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            stateCode: form.stateCode.trim(),
            pincode: form.pincode.trim()
        };

        try {
            setLoading(true);

            await axios.post(API_URL, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*"
                }
            });

            setSuccess("Marketplace customer created successfully.");

            setTimeout(() => {
                navigate("/marketplace-customers");
            }, 1000);
        } catch (err) {
            console.error(
                "Create Marketplace Customer Error:",
                err.response?.data || err.message
            );

            const responseData = err.response?.data;

            setError(
                typeof responseData === "string"
                    ? responseData
                    : responseData?.message ||
                      responseData?.title ||
                      err.message ||
                      "Failed to create marketplace customer."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm(initialForm);
        setError("");
        setSuccess("");
    };

    const fields = [
        {
            name: "sellerId",
            label: "Seller ID",
            required: true,
            type: "number"
        },
        {
            name: "customerId",
            label: "Customer ID",
            required: true,
            type: "number"
        },
        {
            name: "marketplaceName",
            label: "Marketplace Name",
            required: true,
            select: true,
            options: [
                "AMAZON",
                "FLIPKART",
                "MEESHO",
                "BLINKIT",
                "MYNTRA",
                "JIOMART",
                "SHOPIFY",
                "OTHER"
            ]
        },
        {
            name: "marketplaceCustomerId",
            label: "Marketplace Customer ID"
        },
        {
            name: "companyName",
            label: "Company Name"
        },
        {
            name: "gstin",
            label: "GSTIN"
        },
        {
            name: "email",
            label: "Email",
            type: "email"
        },
        {
            name: "phone",
            label: "Phone"
        },
        {
            name: "address",
            label: "Address",
            multiline: true,
            rows: 2
        },
        {
            name: "city",
            label: "City"
        },
        {
            name: "state",
            label: "State"
        },
        {
            name: "stateCode",
            label: "State Code"
        },
        {
            name: "pincode",
            label: "Pincode"
        }
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        Create Marketplace Customer
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Map a seller's customer to a marketplace.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/marketplace-customers")}
                >
                    Back to List
                </Button>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Card variant="outlined">
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2.5}>
                            {fields.map((field) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={field.name}
                                >
                                    <TextField
                                        fullWidth
                                        name={field.name}
                                        label={field.label}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        required={field.required || false}
                                        type={field.type || "text"}
                                        select={field.select || false}
                                        multiline={field.multiline || false}
                                        rows={field.rows || undefined}
                                        inputProps={
                                            field.type === "number"
                                                ? { min: 1, step: 1 }
                                                : undefined
                                        }
                                    >
                                        {field.select &&
                                            field.options.map((option) => (
                                                <MenuItem
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                    </TextField>
                                </Grid>
                            ))}
                        </Grid>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                                mt: 4,
                                flexWrap: "wrap"
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={handleReset}
                                disabled={loading}
                            >
                                Reset
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    loading
                                        ? <CircularProgress size={18} color="inherit" />
                                        : <Save />
                                }
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Create Customer"}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default MarketplaceCustomersCreate;

