
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

const API_URL = "http://localhost:5000/api/Gatepass";

const GatepassDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [gatepass, setGatepass] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGatepass = async () => {
            try {
                setLoading(true);
                setError("");

                // Load gatepasses without requiring seller/customer selection.
                const response = await axios.get(`${API_URL}/all`);

                const result = response.data;
                const items = Array.isArray(result)
                    ? result
                    : result?.data ??
                      result?.Data ??
                      result?.items ??
                      result?.gatepasses ??
                      [];

                const selectedGatepass = items.find(
                    (item) =>
                        String(item.gatepassId ?? item.GatepassId ?? item.id ?? item.Id) ===
                        String(id)
                );

                if (!selectedGatepass) {
                    setError(`Gatepass with ID ${id} was not found.`);
                    return;
                }

                setGatepass(selectedGatepass);
            } catch (err) {
                console.error("Error loading gatepass:", err);

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.Message ||
                    err.message ||
                    "Failed to load gatepass details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchGatepass();
    }, [id]);

    const getValue = (camelCase, pascalCase) =>
        gatepass?.[camelCase] ?? gatepass?.[pascalCase] ?? "—";

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/gatepasses")}
                >
                    Back to Gatepasses
                </Button>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
                mb={3}
            >
                <Typography variant="h5" fontWeight="bold">
                    Gatepass Details
                </Typography>

                <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate("/gatepasses")}
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() =>
                            navigate(`/gatepasses/${id}/edit`)
                        }
                    >
                        Edit Gatepass
                    </Button>
                </Box>
            </Box>

            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary">
                                Gatepass ID
                            </Typography>
                            <Typography fontWeight="medium">
                                {getValue("gatepassId", "GatepassId")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary">
                                Gatepass Code
                            </Typography>
                            <Typography fontWeight="medium">
                                {getValue("gatepassCode", "GatepassCode")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary">
                                Facility Code
                            </Typography>
                            <Typography fontWeight="medium">
                                {getValue("facilityCode", "FacilityCode")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary">
                                Item SKU Code
                            </Typography>
                            <Typography fontWeight="medium">
                                {getValue("itemSkuCode", "ItemSkuCode")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary">
                                Quantity
                            </Typography>
                            <Typography fontWeight="medium">
                                {getValue("quantity", "Quantity")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary">
                                Status
                            </Typography>
                            <Typography fontWeight="medium">
                                {getValue("status", "Status")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary">
                                Seller ID
                            </Typography>
                            <Typography fontWeight="medium">
                                {getValue("sellerId", "SellerId")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary">
                                Customer ID
                            </Typography>
                            <Typography fontWeight="medium">
                                {getValue("customerId", "CustomerId")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Typography color="text.secondary">
                                Created By
                            </Typography>
                            <Typography fontWeight="medium">
                                {getValue("createdBy", "CreatedBy")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography color="text.secondary">
                                Reason
                            </Typography>
                            <Typography>
                                {getValue("reason", "Reason")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography color="text.secondary">
                                Created Date
                            </Typography>
                            <Typography>
                                {getValue("createdDate", "CreatedDate") === "—"
                                    ? "—"
                                    : new Date(
                                          getValue("createdDate", "CreatedDate")
                                      ).toLocaleString("en-IN")}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography color="text.secondary">
                                Updated Date
                            </Typography>
                            <Typography>
                                {getValue("updatedDate", "UpdatedDate") === null
                                    ? "—"
                                    : getValue("updatedDate", "UpdatedDate") === "—"
                                      ? "—"
                                      : new Date(
                                            getValue("updatedDate", "UpdatedDate")
                                        ).toLocaleString("en-IN")}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default GatepassDetails;