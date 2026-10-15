import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box, Paper, Typography, TextField, Button, Grid,
    Divider, CircularProgress, Alert, Stack
} from "@mui/material";
import { Save, ArrowBack, RestartAlt, Inventory2 } from "@mui/icons-material";

const ManifestPackagesEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        sellerId: "",
        customerId: "",
        shippingManifestCode: "",
        shippingPackageCode: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // 1. GET BY ID - Load existing values
    useEffect(() => {
        const fetchRecord = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/manifest-packages/${id}`);
                const data = res.data;
                setFormData({
                    sellerId: data.sellerId ?? data.SellerId ?? "",
                    customerId: data.customerId ?? data.CustomerId ?? "",
                    shippingManifestCode: data.shippingManifestCode ?? data.ShippingManifestCode ?? "",
                    shippingPackageCode: data.shippingPackageCode ?? data.ShippingPackageCode ?? ""
                });
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRecord();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
// 2. PUT API - THIS IS WHERE PUT HAPPENS
const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
        const payload = {
            sellerId: Number(formData.sellerId),
            customerId: Number(formData.customerId),
            shippingManifestCode: formData.shippingManifestCode?.toString(),
            shippingPackageCode: formData.shippingPackageCode?.toString()
        };

        console.log("PUT PAYLOAD:", payload);

        // ---- PUT API CALL - FIXED ----
        const res = await fetch(`https://localhost:7203/api/manifest-packages/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log("PUT SUCCESS:", data);

        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

        navigate(`/manifest-packages/${id}`);
    } catch (err) {
        console.error("PUT FAILED:", err);
        setError(err.message || "Update failed");
    } finally {
        setSaving(false);
    }
};
    if (loading) return <Box sx={{ p: 5, textAlign: "center" }}><CircularProgress /></Box>;

    return (
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Inventory2 color="primary" />
                    <Typography variant="h5" fontWeight={700}>Edit Manifest Package #{id}</Typography>
                </Box>
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate(`/manifest-packages/${id}`)}>Back</Button>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required type="number" label="Seller ID" name="sellerId" value={formData.sellerId} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required type="number" label="Customer ID" name="customerId" value={formData.customerId} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required label="Shipping Manifest Code" name="shippingManifestCode" value={formData.shippingManifestCode} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required label="Shipping Package Code" name="shippingPackageCode" value={formData.shippingPackageCode} onChange={handleChange} />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button variant="outlined" startIcon={<RestartAlt />} onClick={() => window.location.reload()} disabled={saving}>Reset</Button>
                    <Button type="submit" variant="contained" startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />} disabled={saving}>
                        {saving ? "Updating..." : "Update Package"}
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};

export default ManifestPackagesEdit;