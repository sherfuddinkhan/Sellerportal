import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Button,
    Stack,
    Chip
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const BrandModelView = () => {

    const { brandId, modelId } = useParams();

    const navigate = useNavigate();

    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD BRAND MODEL
    // GET /api/BrandModel/:id
    // =========================================================

    const loadBrandModel = async () => {

        try {

            setLoading(true);
            setError("");

            if (
                !brandId ||
                isNaN(Number(brandId)) ||
                !modelId ||
                isNaN(Number(modelId))
            ) {
                throw new Error("Invalid Brand ID or Model ID.");
            }

            const url =
                `${API_URL}/BrandModel/${modelId}`;

            console.log(
                "Loading Brand Model:",
                url
            );

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "*/*"
                }
            });

            console.log(
                "Brand Model response:",
                response.status
            );

            if (!response.ok) {

                let message =
                    `Failed to load brand model (${response.status})`;

                try {

                    const errorData =
                        await response.json();

                    message =
                        errorData?.message ||
                        message;

                } catch {
                    // Response may not be JSON
                }

                throw new Error(message);
            }

            const data =
                await response.json();

            console.log(
                "Brand Model data:",
                data
            );

            // Handle possible API wrappers
            const modelData =
                data?.data ??
                data?.brandModel ??
                data;

            if (!modelData) {

                throw new Error(
                    "Brand model not found."
                );
            }

            setModel(modelData);

        } catch (err) {

            console.error(
                "Brand Model View Error:",
                err
            );

            setError(
                err.message ||
                "Failed to load brand model."
            );

            setModel(null);

        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {

        loadBrandModel();

    }, [brandId, modelId]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300
                }}
            >
                <CircularProgress />
            </Box>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() =>
                        navigate(
                            `/brands/${brandId}/models`
                        )
                    }
                >
                    Back to Brand Models
                </Button>

            </Box>
        );
    }


    // =========================================================
    // NO MODEL
    // =========================================================

    if (!model) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="warning">
                    Brand model not found.
                </Alert>

            </Box>
        );
    }


    // =========================================================
    // SUPPORT camelCase / PascalCase
    // =========================================================

    const currentModelId =
        model.brandModelId ??
        model.BrandModelId ??
        modelId;

    const currentBrandId =
        model.brandId ??
        model.BrandId ??
        brandId;

    const modelName =
        model.modelName ??
        model.ModelName ??
        "-";

    const description =
        model.description ??
        model.Description ??
        "-";

    const isActive =
        model.isActive ??
        model.IsActive ??
        false;


    // =========================================================
    // UI
    // =========================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* HEADER */}

            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Brand Model Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View brand model information
                    </Typography>

                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() =>
                            navigate(
                                `/brands/${currentBrandId}/models`
                            )
                        }
                    >
                        Back
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() =>
                            navigate(
                                `/brands/${currentBrandId}/models/${currentModelId}/edit`
                            )
                        }
                    >
                        Edit
                    </Button>

                </Stack>

            </Stack>


            {/* DETAILS */}

            <Paper
                elevation={2}
                sx={{ p: 3 }}
            >

                <Stack spacing={3}>

                    {/* MODEL ID */}

                    <Box>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Model ID
                        </Typography>

                        <Typography variant="body1">
                            {currentModelId}
                        </Typography>

                    </Box>


                    {/* BRAND ID */}

                    <Box>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Brand ID
                        </Typography>

                        <Typography variant="body1">
                            {currentBrandId}
                        </Typography>

                    </Box>


                    {/* MODEL NAME */}

                    <Box>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Model Name
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            {modelName}
                        </Typography>

                    </Box>


                    {/* DESCRIPTION */}

                    <Box>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Description
                        </Typography>

                        <Typography variant="body1">
                            {description}
                        </Typography>

                    </Box>


                    {/* STATUS */}

                    <Box>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mb: 1 }}
                        >
                            Status
                        </Typography>

                        <Chip
                            label={
                                isActive
                                    ? "Active"
                                    : "Inactive"
                            }
                            color={
                                isActive
                                    ? "success"
                                    : "default"
                            }
                        />

                    </Box>

                </Stack>

            </Paper>

        </Box>
    );
};

export default BrandModelView;