import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import { Box, Paper,Typography, Grid,Chip,Button,CircularProgress,Alert,Divider} from "@mui/material";
import {ArrowBack,Edit} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
const BrandDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        loadBrand();
    }, []);
    const loadBrand = async () => {
        try {
            const response = await apiService.getBrandById(id);
            setBrand(response.data);
        }
        catch (err) {
            console.error(err);
            setError("Unable to load Brand.");
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={10}
            >
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }
    return (
        <Box p={3}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 3
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Brand Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid
                    container
                    spacing={3}
                >
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Brand Name
                        </Typography>

                        <Typography variant="h6">
                            {brand.brandName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Status
                        </Typography>
                        <Chip
                            label={
                                brand.isActive
                                    ? "Active"
                                    : "Inactive"
                            }
                            color={
                                brand.isActive
                                    ? "success"
                                    : "error"
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Description
                        </Typography>
                        <Typography>
                            {brand.description || "-"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>
                        <Typography>
                            {brand.createdDate
                                ? new Date(
                                      brand.createdDate
                                  ).toLocaleString()
                                : "-"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Updated Date
                        </Typography>
                        <Typography>
                            {brand.updatedDate
                                ? new Date(
                                      brand.updatedDate
                                  ).toLocaleString()
                                : "-"}
                        </Typography>
                    </Grid>
                </Grid>
                <Box
                    mt={4}
                    display="flex"
                    gap={2}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/brands")}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() =>
                            navigate(`/brands/edit/${id}`)
                        }
                    >
                        Edit
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default BrandDetails;