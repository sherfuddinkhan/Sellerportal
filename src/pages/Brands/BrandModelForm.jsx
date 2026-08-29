import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    Stack,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const BrandModelForm = () => {

    const navigate = useNavigate();

    const {
        brandId,
        modelId
    } = useParams();

    const isEditMode =
        Boolean(modelId);


    // =========================================================
    // STATE
    // =========================================================

    const [formData, setFormData] = useState({
        brandModelId: 0,
        brandId: "",
        modelName: "",
        description: "",
        isActive: true
    });

    const [loading, setLoading] =
        useState(isEditMode);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================================
    // VALIDATE PARAMETERS
    // =========================================================

    useEffect(() => {

        if (!brandId || isNaN(Number(brandId))) {

            setError("Invalid Brand ID.");
            setLoading(false);

            return;
        }

        if (
            isEditMode &&
            (!modelId || isNaN(Number(modelId)))
        ) {

            setError("Invalid Brand Model ID.");
            setLoading(false);

            return;
        }

        if (isEditMode) {

            loadBrandModel();

        } else {

            setFormData((previous) => ({
                ...previous,
                brandId: Number(brandId)
            }));

            setLoading(false);
        }

    }, [
        brandId,
        modelId
    ]);


    // =========================================================
    // LOAD BRAND MODEL FOR EDIT
    //
    // GET /api/BrandModel/:id
    //
    // Example:
    // /brands/3/models/2/edit
    //
    // GET:
    // /api/BrandModel/2
    // =========================================================

    const loadBrandModel = async () => {

        try {

            setLoading(true);
            setError("");

            const url =
                `${API_URL}/BrandModel/${modelId}`;

            console.log(
                "Loading Brand Model for Edit:",
                url
            );

            const response =
                await fetch(url, {
                    method: "GET",
                    headers: {
                        Accept: "*/*"
                    }
                });

            console.log(
                "Brand Model Edit Response:",
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
                    // Non JSON response
                }

                throw new Error(message);
            }

            const data =
                await response.json();

            console.log(
                "Brand Model Edit Data:",
                data
            );


            // =================================================
            // HANDLE RESPONSE WRAPPER
            // =================================================

            const model =
                data?.data ??
                data?.brandModel ??
                data;


            if (!model) {

                throw new Error(
                    "Brand model not found."
                );
            }


            // =================================================
            // SUPPORT camelCase + PascalCase
            // =================================================

            setFormData({

                brandModelId:
                    model.brandModelId ??
                    model.BrandModelId ??
                    Number(modelId),

                brandId:
                    model.brandId ??
                    model.BrandId ??
                    Number(brandId),

                modelName:
                    model.modelName ??
                    model.ModelName ??
                    "",

                description:
                    model.description ??
                    model.Description ??
                    "",

                isActive:
                    model.isActive ??
                    model.IsActive ??
                    true

            });

        } catch (err) {

            console.error(
                "Brand Model Edit Error:",
                err
            );

            setError(
                err.message ||
                "Failed to load brand model."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // =========================================================
    // ACTIVE CHANGE
    // =========================================================

    const handleActiveChange = (event) => {

        setFormData((previous) => ({
            ...previous,
            isActive: event.target.checked
        }));

    };


    // =========================================================
    // SAVE
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // =====================================================
        // VALIDATION
        // =====================================================

        if (!formData.modelName.trim()) {

            setError(
                "Model Name is required."
            );

            return;
        }


        try {

            setSaving(true);


            // =================================================
            // CREATE
            // =================================================

            if (!isEditMode) {

                const payload = {

                    brandModelId: 0,

                    brandId:
                        Number(brandId),

                    modelName:
                        formData.modelName.trim(),

                    description:
                        formData.description.trim(),

                    isActive:
                        formData.isActive

                };


                console.log(
                    "Creating Brand Model:",
                    payload
                );


                const response =
                    await fetch(
                        `${API_URL}/BrandModel`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Accept:
                                    "*/*"
                            },

                            body:
                                JSON.stringify(
                                    payload
                                )
                        }
                    );


                if (!response.ok) {

                    let message =
                        `Failed to create brand model (${response.status})`;

                    try {

                        const errorData =
                            await response.json();

                        message =
                            errorData?.message ||
                            message;

                    } catch {}

                    throw new Error(message);
                }


                setSuccess(
                    "Brand model created successfully."
                );


                setTimeout(() => {

                    navigate(
                        `/brands/${brandId}/models`
                    );

                }, 800);

                return;
            }


            // =================================================
            // UPDATE
            // =================================================

            const payload = {

                brandModelId:
                    Number(
                        formData.brandModelId
                    ),

                brandId:
                    Number(
                        formData.brandId ||
                        brandId
                    ),

                modelName:
                    formData.modelName.trim(),

                description:
                    formData.description.trim(),

                isActive:
                    formData.isActive

            };


            console.log(
                "Updating Brand Model:",
                payload
            );


            const response =
                await fetch(
                    `${API_URL}/BrandModel/${modelId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "*/*"
                        },

                        body:
                            JSON.stringify(
                                payload
                            )
                    }
                );


            if (!response.ok) {

                let message =
                    `Failed to update brand model (${response.status})`;

                try {

                    const errorData =
                        await response.json();

                    message =
                        errorData?.message ||
                        message;

                } catch {}

                throw new Error(message);
            }


            setSuccess(
                "Brand model updated successfully."
            );


            setTimeout(() => {

                navigate(
                    `/brands/${brandId}/models/${modelId}`
                );

            }, 800);


        } catch (err) {

            console.error(
                "Save Brand Model Error:",
                err
            );

            setError(
                err.message ||
                "Failed to save brand model."
            );

        } finally {

            setSaving(false);

        }
    };


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
                    minHeight: 350
                }}
            >

                <CircularProgress />

            </Box>
        );
    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* =================================================
                HEADER
            ================================================= */}

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
                        {isEditMode
                            ? "Edit Brand Model"
                            : "Create Brand Model"}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {isEditMode
                            ? "Update brand model information"
                            : "Create a model for this brand"}
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() =>
                        navigate(
                            `/brands/${brandId}/models`
                        )
                    }
                >
                    Back to Models
                </Button>

            </Stack>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {success}
                </Alert>
            )}


            {/* =================================================
                FORM
            ================================================= */}

            <Paper
                elevation={2}
                sx={{ p: 3 }}
            >

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                >

                    <Stack spacing={3}>

                        {/* BRAND ID */}

                        <TextField
                            label="Brand ID"
                            value={
                                formData.brandId
                            }
                            fullWidth
                            disabled
                        />


                        {/* MODEL ID */}

                        {isEditMode && (

                            <TextField
                                label="Brand Model ID"
                                value={
                                    formData.brandModelId
                                }
                                fullWidth
                                disabled
                            />

                        )}


                        {/* MODEL NAME */}

                        <TextField
                            label="Model Name"
                            name="modelName"
                            value={
                                formData.modelName
                            }
                            onChange={
                                handleChange
                            }
                            fullWidth
                            required
                        />


                        {/* DESCRIPTION */}

                        <TextField
                            label="Description"
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            fullWidth
                            multiline
                            rows={4}
                        />


                        {/* STATUS */}

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        formData.isActive
                                    }
                                    onChange={
                                        handleActiveChange
                                    }
                                />
                            }
                            label={
                                formData.isActive
                                    ? "Active"
                                    : "Inactive"
                            }
                        />


                        {/* BUTTONS */}

                        <Stack
                            direction="row"
                            spacing={2}
                        >

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    <SaveIcon />
                                }
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : isEditMode
                                        ? "Update Model"
                                        : "Create Model"}
                            </Button>


                            <Button
                                variant="outlined"
                                onClick={() =>
                                    navigate(
                                        `/brands/${brandId}/models`
                                    )
                                }
                                disabled={saving}
                            >
                                Cancel
                            </Button>

                        </Stack>

                    </Stack>

                </Box>

            </Paper>

        </Box>
    );
};

export default BrandModelForm;