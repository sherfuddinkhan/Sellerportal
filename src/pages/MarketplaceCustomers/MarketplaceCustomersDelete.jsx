
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
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Delete as DeleteIcon,
    WarningAmber
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/marketplace/customers";

function MarketplaceCustomersDelete() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const getField = (object, name) => {
        if (!object) return "";

        const pascalName =
            name.charAt(0).toUpperCase() + name.slice(1);

        return object[name] ?? object[pascalName] ?? "";
    };

    useEffect(() => {
        let active = true;

        const loadCustomer = async () => {
            try {
                setLoading(true);
                setError("");

                if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
                    throw new Error("Invalid marketplace customer ID.");
                }

                const response = await axios.get(`${API_URL}/all`);

                const result = response.data;
                const customers = Array.isArray(result)
                    ? result
                    : result?.items ??
                      result?.data ??
                      result?.$values ??
                      [];

                const found = customers.find(
                    item => String(getField(item, "id")) === String(id)
                );

                if (!found) {
                    throw new Error(
                        `Marketplace customer with ID ${id} was not found.`
                    );
                }

                if (active) {
                    setCustomer(found);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Failed to load marketplace customer."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadCustomer();

        return () => {
            active = false;
        };
    }, [id]);

    const handleDelete = async () => {
        if (!customer || deleting) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete marketplace customer ${id}?`
        );

        if (!confirmed) return;

        try {
            setDeleting(true);
            setError("");

            await axios.delete(`${API_URL}/${id}`);

            setSuccess("Marketplace customer deleted successfully.");

            navigate("/marketplace-customers", {
                state: {
                    message: "Marketplace customer deleted successfully."
                }
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.details ||
                err.message ||
                "Failed to delete marketplace customer."
            );
        } finally {
            setDeleting(false);
        }
    };

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

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/marketplace-customers")}
                    disabled={deleting}
                >
                    Back to Marketplace Customers
                </Button>
            </Box>

            <Card elevation={3}>
                <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 2
                        }}
                    >
                        <WarningAmber color="error" sx={{ fontSize: 40 }} />

                        <Box>
                            <Typography variant="h5" fontWeight={700}>
                                Delete Marketplace Customer
                            </Typography>

                            <Typography color="text.secondary">
                                Confirm deletion of this marketplace mapping.
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

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

                    {customer && (
                        <>
                            <Alert severity="warning" sx={{ mb: 3 }}>
                                This action cannot be undone. The selected
                                marketplace customer record will be deleted.
                            </Alert>

                            <Grid container spacing={2}>
                                {[
                                    ["Record ID", "id"],
                                    ["Company Name", "companyName"],
                                    ["Marketplace", "marketplaceName"],
                                    ["Marketplace Customer ID", "marketplaceCustomerId"],
                                    ["Seller ID", "sellerId"],
                                    ["Customer ID", "customerId"],
                                    ["GSTIN", "gstin"],
                                    ["Email", "email"],
                                    ["Phone", "phone"],
                                    ["Address", "address"],
                                    ["City", "city"],
                                    ["State", "state"],
                                    ["State Code", "stateCode"],
                                    ["Pincode", "pincode"]
                                ].map(([label, field]) => (
                                    <Grid item xs={12} sm={6} key={field}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {label}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontWeight: 600,
                                                overflowWrap: "anywhere"
                                            }}
                                        >
                                            {getField(customer, field) || "—"}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() => navigate("/marketplace-customers")}
                            disabled={deleting}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            color="error"
                            startIcon={
                                deleting
                                    ? <CircularProgress size={18} color="inherit" />
                                    : <DeleteIcon />
                            }
                            onClick={handleDelete}
                            disabled={!customer || deleting}
                        >
                            {deleting ? "Deleting..." : "Confirm Delete"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}

export default MarketplaceCustomersDelete;