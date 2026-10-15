import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material";
import {
    Inventory2,
    Refresh,
    ArrowBack,
    Edit
} from "@mui/icons-material";

const ManifestPackagesView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRecord = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(`/api/manifest-packages/${id}`);
            // API returns { manifestPackageId: 1, sellerId: 6, customerId: 3, ... }
            setRecord(res.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to load");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchRecord();
    }, [fetchRecord]);

    if (loading) {
        return (
            <Box sx={{ p: 5, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
                <Button onClick={fetchRecord} sx={{ mt: 2 }} variant="outlined">Retry</Button>
                <Button onClick={() => navigate("/manifest-packages")} sx={{ mt: 2, ml: 1 }}>Back</Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* HEADER */}
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box sx={{ width: 48, height: 48, bgcolor: "#e3f2fd", color: "#1976d2", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Inventory2 />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            Manifest Package #{record?.manifestPackageId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {record?.shippingManifestCode}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" gap={1} alignItems="center">
                    <Tooltip title="Refresh">
                        <IconButton onClick={fetchRecord}><Refresh /></IconButton>
                    </Tooltip>
                    <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => navigate("/manifest-packages")}>
                        BACK
                    </Button>
                    <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(`/manifest-packages/${id}/edit`)}>
                        EDIT
                    </Button>
                </Box>
            </Paper>

            {/* DETAILS */}
            <Box sx={{ maxWidth: 450 }}>
                <Card sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>Details</Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Box display="flex" flexDirection="column" gap={2}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">ID</Typography>
                                <Typography variant="body1" fontWeight={700}>{record?.manifestPackageId ?? "—"}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Seller ID</Typography>
                                <Typography variant="body1" fontWeight={500}>{record?.sellerId ?? "—"}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Customer ID</Typography>
                                <Typography variant="body1" fontWeight={500}>{record?.customerId ?? "—"}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Manifest Code</Typography>
                                <Typography variant="body1" fontWeight={500}>{record?.shippingManifestCode ?? "—"}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Package Code</Typography>
                                <Typography variant="body1" fontWeight={500}>{record?.shippingPackageCode ?? "—"}</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default ManifestPackagesView;