import React, { useCallback, useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Stack,
    Chip,
    Tooltip,
} from "@mui/material";

import {
    Add as AddIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const BrandModelTable = () => {
    const { brandId } = useParams();
    const navigate = useNavigate();

    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ============================================================
    // VALIDATE BRAND ID
    // ============================================================

    const validBrandId =
        brandId && /^\d+$/.test(String(brandId));

    // ============================================================
    // LOAD BRAND MODELS
    // GET /api/BrandModel/brand/:brandId
    // ============================================================

    const loadBrandModels = useCallback(async () => {
        if (!validBrandId) {
            setModels([]);
            setError("Invalid Brand ID.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/BrandModel/brand/${brandId}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "*/*",
                    },
                }
            );

            if (!response.ok) {
                let message = `Failed to load brand models (${response.status})`;

                try {
                    const errorData = await response.json();

                    if (errorData?.message) {
                        message = errorData.message;
                    }
                } catch {
                    // Ignore invalid error response
                }

                throw new Error(message);
            }

            const data = await response.json();

            console.log("Brand Models API Response:", data);

            // ----------------------------------------------------
            // Support different API response formats
            // ----------------------------------------------------

            let modelList = [];

            if (Array.isArray(data)) {
                modelList = data;
            } else if (Array.isArray(data?.data)) {
                modelList = data.data;
            } else if (Array.isArray(data?.items)) {
                modelList = data.items;
            } else if (Array.isArray(data?.$values)) {
                modelList = data.$values;
            }

            setModels(modelList);
        } catch (err) {
            console.error("Brand Model API Error:", err);

            setModels([]);

            setError(
                err.message ||
                    "Failed to load brand models."
            );
        } finally {
            setLoading(false);
        }
    }, [brandId, validBrandId]);

    // ============================================================
    // LOAD WHEN BRAND ID CHANGES
    // ============================================================

    useEffect(() => {
        loadBrandModels();
    }, [loadBrandModels]);

    // ============================================================
    // DELETE BRAND MODEL
    // DELETE /api/BrandModel/:id
    // ============================================================

    const handleDelete = async (modelId) => {
        if (!modelId) {
            setError("Invalid Brand Model ID.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this brand model?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `${API_URL}/BrandModel/${modelId}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "*/*",
                    },
                }
            );

            if (!response.ok) {
                let message = `Failed to delete brand model (${response.status})`;

                try {
                    const errorData = await response.json();

                    if (errorData?.message) {
                        message = errorData.message;
                    }
                } catch {
                    // Ignore invalid error response
                }

                throw new Error(message);
            }

            await loadBrandModels();
        } catch (err) {
            console.error(
                "Delete Brand Model Error:",
                err
            );

            setError(
                err.message ||
                    "Failed to delete brand model."
            );
        }
    };

    // ============================================================
    // INVALID BRAND ID
    // ============================================================

    if (!validBrandId) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">
                    Invalid Brand ID.
                </Alert>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => navigate("/brands")}
                >
                    Back to Brands
                </Button>
            </Box>
        );
    }

    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <Box sx={{ p: 3 }}>

            {/* ====================================================
                HEADER
            ==================================================== */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center",
                }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={600}
                    >
                        Brand Models
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Models belonging to this brand
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                    >
                        <strong>Brand ID:</strong>{" "}
                        {brandId}
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
                            navigate("/brands")
                        }
                    >
                        Back to Brands
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            navigate(
                                `/brands/${brandId}/models/new`
                            )
                        }
                    >
                        Add Model
                    </Button>
                </Stack>
            </Stack>

            {/* ====================================================
                ERROR
            ==================================================== */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            {/* ====================================================
                TABLE
            ==================================================== */}

            <Paper elevation={1}>
                <TableContainer>
                    <Table>

                        <TableHead>
                            <TableRow>

                                <TableCell>
                                    <strong>ID</strong>
                                </TableCell>

                                <TableCell>
                                    <strong>Model Name</strong>
                                </TableCell>

                                <TableCell>
                                    <strong>Brand ID</strong>
                                </TableCell>

                                <TableCell>
                                    <strong>Description</strong>
                                </TableCell>

                                <TableCell>
                                    <strong>Status</strong>
                                </TableCell>

                                <TableCell align="center">
                                    <strong>Actions</strong>
                                </TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {models.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        align="center"
                                    >
                                        <Typography
                                            color="text.secondary"
                                            sx={{ py: 4 }}
                                        >
                                            No brand models found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                models.map((model) => {

                                    // ------------------------------------------------
                                    // API property names
                                    // ------------------------------------------------

                                    const modelId =
                                        model.brandModelId ??
                                        model.BrandModelId;

                                    const modelName =
                                        model.modelName ??
                                        model.ModelName ??
                                        "-";

                                    const modelBrandId =
                                        model.brandId ??
                                        model.BrandId ??
                                        brandId;

                                    const description =
                                        model.description ??
                                        model.Description ??
                                        "-";

                                    const isActive =
                                        model.isActive ??
                                        model.IsActive ??
                                        false;

                                    return (
                                        <TableRow
                                            key={modelId}
                                            hover
                                        >

                                            {/* ID */}

                                            <TableCell>
                                                {modelId}
                                            </TableCell>

                                            {/* MODEL NAME */}

                                            <TableCell>
                                                <Typography
                                                    fontWeight={500}
                                                >
                                                    {modelName}
                                                </Typography>
                                            </TableCell>

                                            {/* BRAND ID */}

                                            <TableCell>
                                                {modelBrandId}
                                            </TableCell>

                                            {/* DESCRIPTION */}

                                            <TableCell>
                                                {description}
                                            </TableCell>

                                            {/* STATUS */}

                                            <TableCell>
                                                <Chip
                                                    label={
                                                        isActive
                                                            ? "Active"
                                                            : "Inactive"
                                                    }
                                                    size="small"
                                                    color={
                                                        isActive
                                                            ? "success"
                                                            : "default"
                                                    }
                                                />
                                            </TableCell>

                                            {/* ACTIONS */}

                                            <TableCell align="center">
                                                <Stack
                                                    direction="row"
                                                    spacing={0.5}
                                                    justifyContent="center"
                                                >

                                                    {/* VIEW */}

                                                    <Tooltip title="View">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/brands/${brandId}/models/${modelId}`
                                                                )
                                                            }
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {/* EDIT */}

                                                    <Tooltip title="Edit">
                                                        <IconButton
                                                            color="warning"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/brands/${brandId}/models/${modelId}/edit`
                                                                )
                                                            }
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    {/* DELETE */}

                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    modelId
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                </Stack>
                                            </TableCell>

                                        </TableRow>
                                    );
                                })
                            )}

                        </TableBody>

                    </Table>
                </TableContainer>
            </Paper>

        </Box>
    );
};

export default BrandModelTable;
