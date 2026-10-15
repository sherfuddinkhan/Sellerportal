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
    Divider,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Business,
    Store,
    Person,
    LocationOn,
    History
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/marketplace/customers";

const field = (row, name) =>
    row?.[name] ??
    row?.[name.charAt(0).toUpperCase() + name.slice(1)] ??
    "—";

const formatDate = (value) => {
    if (!value || value === "—") return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? String(value)
        : date.toLocaleString();
};

function MarketplaceCustomersDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchCustomer = async () => {
            setLoading(true);
            setError("");
            setCustomer(null);

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
            } catch (err) {
                if (err.code === "ERR_CANCELED") return;

                console.error(
                    "MARKETPLACE CUSTOMER DETAILS ERROR:",
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.title ||
                    err.message ||
                    "Failed to load marketplace customer details."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        if (Number.isInteger(Number(id)) && Number(id) > 0) {
            fetchCustomer();
        } else {
            setError("Invalid marketplace customer ID.");
            setLoading(false);
        }

        return () => controller.abort();
    }, [id]);

    const sections = [
        {
            title: "Marketplace Information",
            icon: <Store color="primary" />,
            fields: [
                ["Record ID", "id"],
                ["Marketplace", "marketplaceName"],
                ["Marketplace Customer ID", "marketplaceCustomerId"]
            ]
        },
        {
            title: "Seller and Customer Mapping",
            icon: <Business color="primary" />,
            fields: [
                ["Seller ID", "sellerId"],
                ["Customer ID", "customerId"]
            ]
        },
        {
            title: "Company and Contact",
            icon: <Person color="primary" />,
            fields: [
                ["Company Name", "companyName"],
                ["GSTIN", "gstin"],
                ["Email", "email"],
                ["Phone", "phone"]
            ]
        },
        {
            title: "Address",
            icon: <LocationOn color="primary" />,
            fields: [
                ["Address", "address"],
                ["City", "city"],
                ["State", "state"],
                ["State Code", "stateCode"],
                ["Pincode", "pincode"]
            ]
        },
        {
            title: "Audit Information",
            icon: <History color="primary" />,
            fields: [
                ["Created At", "createdAt"]
            ]
        }
    ];

    if (loading) {
        return (
            <Container sx={{ py: 6, textAlign: "center" }}>
                <CircularProgress />

                <Typography sx={{ mt: 2 }}>
                    Loading marketplace customer details...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
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
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    mb: 4
                }}
            >
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Marketplace Customer Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        Customer record ID: {field(customer, "id")}
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/marketplace-customers")}
                >
                    Back to Customers
                </Button>
            </Box>

            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2
                }}
            >
                <Typography variant="h5" fontWeight={700}>
                    {field(customer, "companyName")}
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {field(customer, "marketplaceName")} · Customer ID:{" "}
                    {field(customer, "customerId")}
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                {sections.map((section) => (
                    <Grid xs={12} key={section.title}>
                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        mb: 2
                                    }}
                                >
                                    {section.icon}

                                    <Typography
                                        variant="h6"
                                        fontWeight={700}
                                    >
                                        {section.title}
                                    </Typography>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={3}>
                                    {section.fields.map(([label, name]) => {
                                        const rawValue = field(customer, name);
                                        const value =
                                            name === "createdAt"
                                                ? formatDate(rawValue)
                                                : rawValue;

                                        return (
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                key={name}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mb: 0.5 }}
                                                >
                                                    {label}
                                                </Typography>

                                                <Typography
                                                    variant="body1"
                                                    fontWeight={500}
                                                    sx={{
                                                        overflowWrap: "anywhere",
                                                        whiteSpace: "pre-wrap"
                                                    }}
                                                >
                                                    {value}
                                                </Typography>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/marketplace-customers")}
                >
                    Back to Marketplace Customers
                </Button>
            </Box>
        </Container>
    );
}

export default MarketplaceCustomersDetails;
