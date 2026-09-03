import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Grid,
    Typography,
    Divider
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const SupplierDetails = () => {

    const { id } = useParams();

    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadSupplier = async () => {

            try {

                setLoading(true);
                setError("");

                // Debug
                console.log("URL ID:", id);

                // Validate ID
                const supplierId = Number(id);

                if (!Number.isInteger(supplierId)) {
                    throw new Error(
                        `Invalid Supplier ID: ${id}`
                    );
                }

                const response = await axios.get(
                    `${API_URL}/Supplier/${supplierId}`
                );

                console.log(
                    "Supplier response:",
                    response.data
                );

                setSupplier(response.data);

            } catch (err) {

                console.error(
                    "Supplier details error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load supplier details"
                );

            } finally {

                setLoading(false);

            }

        };

        loadSupplier();

    }, [id]);


    if (loading) {

        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
            >
                <CircularProgress />
            </Box>
        );

    }


    if (error) {

        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Box>
        );

    }


    if (!supplier) {

        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">
                    Supplier not found.
                </Alert>
            </Box>
        );

    }


    return (

        <Box sx={{ p: 3 }}>

            <Typography
                variant="h5"
                sx={{
                    mb: 3,
                    fontWeight: 600
                }}
            >
                Supplier Details
            </Typography>

            <Card>

                <CardContent>

                    <Grid container spacing={3}>

                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Supplier ID
                            </Typography>

                            <Typography>
                                {supplier.supplierId ?? "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Seller ID
                            </Typography>

                            <Typography>
                                {supplier.sellerId ?? "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Supplier Name
                            </Typography>

                            <Typography>
                                {supplier.supplierName ?? "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Contact Person
                            </Typography>

                            <Typography>
                                {supplier.contactPerson ?? "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Phone
                            </Typography>

                            <Typography>
                                {supplier.phone ?? "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Email
                            </Typography>

                            <Typography>
                                {supplier.email ?? "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Address
                            </Typography>

                            <Typography>
                                {supplier.address ?? "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                City
                            </Typography>

                            <Typography>
                                {supplier.city ?? "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                State
                            </Typography>

                            <Typography>
                                {supplier.state ?? "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Country
                            </Typography>

                            <Typography>
                                {supplier.country ?? "-"}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                GST Number
                            </Typography>

                            <Typography>
                                {supplier.gstNumber ?? "-"}
                            </Typography>
                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

        </Box>
    );
};

export default SupplierDetails;