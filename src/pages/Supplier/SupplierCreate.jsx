import React, { useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    Alert
} from "@mui/material";

import {
    Save,
    ArrowBack
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://localhost:7203/api";

const SupplierCreate = () => {

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

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

            setLoading(true);
            setError("");

            const payload = {
                ...formData,
                sellerId: Number(formData.sellerId)
            };

            await axios.post(
                `${API_URL}/Supplier`,
                payload
            );

            navigate("/suppliers");

        } catch (err) {

            console.error(
                "Supplier create error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to create supplier"
            );

        } finally {

            setLoading(false);

        }
    };

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
                    Create Supplier
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

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

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

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    label="Supplier Name"
                                    name="supplierName"
                                    value={formData.supplierName}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={6}
                            >

                                <TextField
                                    fullWidth
                                    label="GST Number"
                                    name="gstNumber"
                                    value={formData.gstNumber}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid
                                item
                                xs={12}
                            >

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

                            <Grid
                                item
                                xs={12}
                                sm={4}
                            >

                                <TextField
                                    fullWidth
                                    label="City"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={4}
                            >

                                <TextField
                                    fullWidth
                                    label="State"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={4}
                            >

                                <TextField
                                    fullWidth
                                    label="Country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid
                                item
                                xs={12}
                            >

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<Save />}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : "Save Supplier"}
                                </Button>

                            </Grid>

                        </Grid>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};

export default SupplierCreate;