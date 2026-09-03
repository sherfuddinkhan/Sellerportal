import React, { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    Save,
    ArrowBack
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

const API_URL = "https://localhost:7203/api";

const SupplierEdit = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        sellerId: "",
        supplierName: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        country: "",
        gstNumber: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadSupplier = async () => {

            try {

                const response =
                    await axios.get(
                        `${API_URL}/Supplier/${id}`
                    );

                setFormData({
                    sellerId:
                        response.data.sellerId || "",
                    supplierName:
                        response.data.supplierName || "",
                    contactPerson:
                        response.data.contactPerson || "",
                    phone:
                        response.data.phone || "",
                    email:
                        response.data.email || "",
                    address:
                        response.data.address || "",
                    city:
                        response.data.city || "",
                    state:
                        response.data.state || "",
                    country:
                        response.data.country || "",
                    gstNumber:
                        response.data.gstNumber || ""
                });

            } catch (err) {

                console.error(
                    "Supplier loading error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load supplier"
                );

            } finally {

                setLoading(false);

            }
        };

        loadSupplier();

    }, [id]);

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);
            setError("");

            const payload = {
                ...formData,
                sellerId: Number(formData.sellerId)
            };

            await axios.put(
                `${API_URL}/Supplier/${id}`,
                payload
            );

            navigate("/suppliers");

        } catch (err) {

            console.error(
                "Supplier update error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update supplier"
            );

        } finally {

            setSaving(false);

        }
    };

    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                p={5}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (

        <Box>

            <Box
                display="flex"
                alignItems="center"
                gap={2}
                mb={2}
            >

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/suppliers")
                    }
                >
                    Back
                </Button>

                <Typography variant="h5">
                    Edit Supplier
                </Typography>

            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid item xs={12} sm={6}>

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Seller ID"
                                    name="sellerId"
                                    value={formData.sellerId}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12} sm={6}>

                                <TextField
                                    fullWidth
                                    required
                                    label="Supplier Name"
                                    name="supplierName"
                                    value={formData.supplierName}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12} sm={6}>

                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12} sm={6}>

                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12} sm={6}>

                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12} sm={6}>

                                <TextField
                                    fullWidth
                                    label="GST Number"
                                    name="gstNumber"
                                    value={formData.gstNumber}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12}>

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12} sm={4}>

                                <TextField
                                    fullWidth
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12} sm={4}>

                                <TextField
                                    fullWidth
                                    label="State"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12} sm={4}>

                                <TextField
                                    fullWidth
                                    label="Country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12}>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<Save />}
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Updating..."
                                        : "Update Supplier"}
                                </Button>

                            </Grid>

                        </Grid>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};

export default SupplierEdit;