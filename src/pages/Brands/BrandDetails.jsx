import React, {useEffect,useState} from "react";
import {Box,Paper,Typography,Grid,Chip,Button,CircularProgress,Alert,Divider} from "@mui/material";
import {ArrowBack,Edit} from "@mui/icons-material";
import {useNavigate,useParams} from "react-router-dom";
const SERVER_URL = "http://localhost:5000";

const BrandDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [brand, setBrand] =useState(null);
    const [loading, setLoading] =useState(true);
    const [error, setError] =useState("");
    // =====================================================
    // LOAD BRAND WHEN ID CHANGES
    // =====================================================
    useEffect(() => {
        if (!id) {
            setError("Brand ID is missing.");
            setLoading(false);
            return;
        }
        // Prevent literal ":id"
        if (
            id === ":id" ||
            !/^\d+$/.test(id)
        ) {

            setError(`Invalid Brand ID: ${id}`);
            setLoading(false);
            return;
        }
        loadBrand();
    }, [id]);
    // =====================================================
    // LOAD BRAND
    // =====================================================
    const loadBrand = async () => {
        try {
            setLoading(true);
            setError("");
            console.log( "=================================");
            console.log("Loading Brand");
            console.log("Brand ID:",id);
            console.log("Node URL:",`${SERVER_URL}/api/brand/${id}`);
            console.log("=================================");
            const response = await fetch(`${SERVER_URL}/api/brand/${id}`);
            console.log("Node response status:",response.status);
            // Safely read response
            const data = await response.json();
            console.log("Node response:",data);
            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.title ||
                    `HTTP ${response.status}: ${response.statusText}`
                );
            }
            setBrand(data);
        } catch (err) {
            console.error("Load Brand Error:",err);
            setError(err.message ||"Unable to load Brand.");
            setBrand(null);
        } finally {
            setLoading(false);
        }
    };
    // =====================================================
    // LOADING
    // =====================================================
    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <CircularProgress />
            </Box>
        );
    }
    // =====================================================
    // ERROR
    // =====================================================
    if (error) {
        return (
            <Box p={3}>
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate("/brands")
                    }
                >
                    Back to Brands
                </Button>
            </Box>
        );
    }
    // =====================================================
    // BRAND NOT FOUND
    // =====================================================
    if (!brand) {
        return (
            <Box p={3}>
                <Alert
                    severity="warning"
                    sx={{ mb: 2 }}
                >
                    Brand not found.
                </Alert>
                <Button
                    variant="outlined"
                    startIcon={
                        <ArrowBack />
                    }
                    onClick={() =>
                        navigate("/brands")
                    }
                >
                    Back to Brands
                </Button>
            </Box>
        );
    }
    // =====================================================
    // UI
    // =====================================================
    return (
        <Box p={3}>
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 3
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}
                <Typography
                    variant="h4"
                    gutterBottom
                >
                    Brand Details
                </Typography>


                <Divider
                    sx={{ mb: 3 }}
                />
                <Grid
                    container
                    spacing={3}
                >

                    {/* =================================================
                        BRAND ID
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Brand ID
                        </Typography>
                        <Typography
                            variant="h6"
                        >
                            {brand.brandId || "-"}
                        </Typography>
                    </Grid>
                    {/* =================================================
                        BRAND NAME
                    ================================================= */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Brand Name
                        </Typography>


                        <Typography
                            variant="h6"
                        >
                            {brand.brandName || "-"}
                        </Typography>

                    </Grid>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Status
                        </Typography>


                        <Box mt={1}>

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

                        </Box>

                    </Grid>


                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Description
                        </Typography>


                        <Typography>
                            {
                                brand.description ||
                                "-"
                            }
                        </Typography>

                    </Grid>


                    {/* =================================================
                        CREATED DATE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Created Date
                        </Typography>


                        <Typography>

                            {
                                brand.createdDate
                                    ? new Date(
                                        brand.createdDate
                                    ).toLocaleString()
                                    : "-"
                            }

                        </Typography>

                    </Grid>


                    {/* =================================================
                        UPDATED DATE
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                        >
                            Updated Date
                        </Typography>


                        <Typography>

                            {
                                brand.updatedDate
                                    ? new Date(
                                        brand.updatedDate
                                    ).toLocaleString()
                                    : "-"
                            }

                        </Typography>

                    </Grid>

                </Grid>


                {/* =================================================
                    BUTTONS
                ================================================= */}

                <Box
                    mt={4}
                    display="flex"
                    gap={2}
                >

                    {/* BACK */}

                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate("/brands")
                        }
                    >
                        Back
                    </Button>


                    {/* EDIT */}

                    <Button
                        variant="contained"
                        startIcon={
                            <Edit />
                        }
                        onClick={() =>
                            navigate(
                                `/brands/${id}/edit`
                            )
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
