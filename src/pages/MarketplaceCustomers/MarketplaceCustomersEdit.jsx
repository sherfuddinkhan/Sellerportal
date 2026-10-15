import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    Grid,
    TextField,
    Typography,
    Divider
} from "@mui/material";

import {
    ArrowBack,
    Save,
    Business
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/marketplace/customers";

const getField = (row, name) =>
    row?.[name] ??
    row?.[name.charAt(0).toUpperCase() + name.slice(1)] ??
    "";

function MarketplaceCustomersEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [form, setForm] = useState({
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
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const loadCustomer = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await axios.get(`${API_URL}/all`, {
                    signal: controller.signal,
                    headers: {
                        Accept: "application/json"
                    }
                });

                const records = Array.isArray(response.data)
                    ? response.data
                    : response.data?.data ??
                      response.data?.items ??
                      response.data?.$values ??
                      [];

                const selectedCustomer = records.find(
                    (item) =>
                        Number(item.id ?? item.Id) === Number(id)
                );

                if (!selectedCustomer) {
                    setError(
                        `Marketplace customer with ID ${id} was not found.`
                    );
                    return;
                }

                setCustomer(selectedCustomer);

                setForm({
                    sellerId: getField(selectedCustomer, "sellerId"),
                    customerId: getField(selectedCustomer, "customerId"),
                    marketplaceCustomerId: getField(
                        selectedCustomer,
                        "marketplaceCustomerId"
                    ),
                    marketplaceName: getField(
                        selectedCustomer,
                        "marketplaceName"
                    ),
                    companyName: getField(selectedCustomer, "companyName"),
                    gstin: getField(selectedCustomer, "gstin"),
                    email: getField(selectedCustomer, "email"),
                    phone: getField(selectedCustomer, "phone"),
                    address: getField(selectedCustomer, "address"),
                    city: getField(selectedCustomer, "city"),
                    state: getField(selectedCustomer, "state"),
                    stateCode: getField(selectedCustomer, "stateCode"),
                    pincode: getField(selectedCustomer, "pincode")
                });
            } catch (err) {
                if (err.code === "ERR_CANCELED") return;

                console.error(
                    "LOAD MARKETPLACE CUSTOMER ERROR:",
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.title ||
                    err.message ||
                    "Failed to load marketplace customer."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        if (Number.isInteger(Number(id)) && Number(id) > 0) {
            loadCustomer();
        } else {
            setError("Invalid marketplace customer ID.");
            setLoading(false);
        }

        return () => controller.abort();
    }, [id]);

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

        if (!form.sellerId || !form.customerId || !form.marketplaceName.trim()) {
            setError(
                "Seller ID, Customer ID, and Marketplace Name are required."
            );
            return;
        }

        if (
            !Number.isInteger(Number(form.sellerId)) ||
            Number(form.sellerId) <= 0 ||
            !Number.isInteger(Number(form.customerId)) ||
            Number(form.customerId) <= 0
        ) {
            setError("Seller ID and Customer ID must be positive integers.");
            return;
        }

        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        const payload = {
            id: Number(id),
            sellerId: Number(form.sellerId),
            customerId: Number(form.customerId),
            marketplaceCustomerId: form.marketplaceCustomerId,
            marketplaceName: form.marketplaceName.trim(),
            companyName: form.companyName,
            gstin: form.gstin,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            state: form.state,
            stateCode: form.stateCode,
            pincode: form.pincode
        };

        setSaving(true);

        try {
            await axios.put(`${API_URL}/${id}`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            });

            setSuccess("Marketplace customer updated successfully.");

            navigate("/marketplace-customers", {
                state: {
                    message: "Marketplace customer updated successfully."
                }
            });
        } catch (err) {
            console.error(
                "UPDATE MARKETPLACE CUSTOMER ERROR:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : null) ||
                "Failed to update marketplace customer. Check the API endpoint and server logs."
            );
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        {
            name: "marketplaceCustomerId",
            label: "Marketplace Customer ID"
        },
        {
            name: "marketplaceName",
            label: "Marketplace Name",
            required: true
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
            multiline: true
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

    if (loading) {
        return (
            <Container sx={{ py: 6, textAlign: "center" }}>
                <CircularProgress />

                <Typography sx={{ mt: 2 }}>
                    Loading marketplace customer...
                </Typography>
            </Container>
        );
    }

    if (error && !customer) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/marketplace-customers")}
                    sx={{ mb: 3 }}
                >
                    Back to Marketplace Customers
                </Button>

                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
                    <Typography variant="h4" fontWeight={700}>
                        Edit Marketplace Customer
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Record ID: {id}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/marketplace-customers")}
                    disabled={saving}
                >
                    Back to Customers
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}

            <Card variant="outlined">
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 2
                        }}
                    >
                        <Business color="primary" />

                        <Typography variant="h6" fontWeight={700}>
                            Customer Information
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2.5}>
                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Seller ID"
                                    name="sellerId"
                                    value={form.sellerId}
                                    onChange={handleChange}
                                    inputProps={{ min: 1, step: 1 }}
                                />
                            </Grid>

                            <Grid xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Customer ID"
                                    name="customerId"
                                    value={form.customerId}
                                    onChange={handleChange}
                                    inputProps={{ min: 1, step: 1 }}
                                />
                            </Grid>

                            {fields.map((item) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    key={item.name}
                                >
                                    <TextField
                                        fullWidth
                                        name={item.name}
                                        label={item.label}
                                        type={item.type || "text"}
                                        required={Boolean(item.required)}
                                        multiline={Boolean(item.multiline)}
                                        minRows={item.multiline ? 2 : undefined}
                                        value={form[item.name] ?? ""}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                flexWrap: "wrap",
                                gap: 2
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={() =>
                                    navigate("/marketplace-customers")
                                }
                                disabled={saving}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    saving ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Save />
                                    )
                                }
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}

export default MarketplaceCustomersEdit;
