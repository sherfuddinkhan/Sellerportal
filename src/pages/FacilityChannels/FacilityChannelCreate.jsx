import React, {
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Paper,
    Grid,
    Typography,
    TextField,
    MenuItem,
    Button,
    Divider,
    Alert,
    CircularProgress,
    Stack
} from "@mui/material";

import {
    Save,
    RestartAlt,
    ArrowBack,
    AddBusiness
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const DEFAULT_API_BASE_URL =
    "https://localhost:7000/api/FacilityChannel";

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
    facilityName: "",
    channelName: "",
    channelCode: "",
    description: "",
    status: "active"
};

/* =========================================================
   EXTRACT API ERROR MESSAGE
========================================================= */

const getErrorMessage = (error) => {

    const responseData = error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    if (responseData?.title) {
        return responseData.title;
    }

    if (responseData?.errors) {
        return Object.values(responseData.errors)
            .flat()
            .join(" ");
    }

    return (
        error?.message ||
        "Unable to create the facility channel."
    );

};

/* =========================================================
   FACILITY CHANNEL CREATE
========================================================= */

const FacilityChannelCreate = ({
    apiBaseUrl = DEFAULT_API_BASE_URL,
    onCreated,
    onCancel,
    onError
}) => {

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [formErrors, setFormErrors] = useState({});

    /* =====================================================
       REQUEST STATE
    ===================================================== */

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFormErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setError("");
        setSuccess("");

    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {

        const errors = {};

        if (!formData.facilityName.trim()) {
            errors.facilityName =
                "Facility name is required.";
        } else if (
            formData.facilityName.trim().length > 150
        ) {
            errors.facilityName =
                "Facility name cannot exceed 150 characters.";
        }

        if (!formData.channelName.trim()) {
            errors.channelName =
                "Channel name is required.";
        } else if (
            formData.channelName.trim().length > 150
        ) {
            errors.channelName =
                "Channel name cannot exceed 150 characters.";
        }

        if (!formData.channelCode.trim()) {
            errors.channelCode =
                "Channel code is required.";
        } else if (
            formData.channelCode.trim().length > 50
        ) {
            errors.channelCode =
                "Channel code cannot exceed 50 characters.";
        }

        if (formData.description.length > 500) {
            errors.description =
                "Description cannot exceed 500 characters.";
        }

        if (
            !["active", "inactive", "pending"].includes(
                formData.status
            )
        ) {
            errors.status = "Select a valid status.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;

    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {

        if (loading) {
            return;
        }

        setFormData({
            ...initialFormData
        });

        setFormErrors({});
        setError("");
        setSuccess("");

    };

    /* =====================================================
       CREATE FACILITY CHANNEL
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (loading) {
            return;
        }

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        const payload = {
            facilityName: formData.facilityName.trim(),
            channelName: formData.channelName.trim(),
            channelCode: formData.channelCode.trim(),
            description: formData.description.trim(),
            status: formData.status
        };

        try {

            setLoading(true);

            const response = await axios.post(
                apiBaseUrl,
                payload
            );

            setSuccess(
                "Facility channel created successfully."
            );

            setFormData({
                ...initialFormData
            });

            setFormErrors({});

            if (typeof onCreated === "function") {
                onCreated(response.data);
            }

        } catch (requestError) {

            const message = getErrorMessage(requestError);

            setError(message);

            if (typeof onError === "function") {
                onError(requestError);
            }

        } finally {

            setLoading(false);

        }

    };

    /* =====================================================
       RENDER FORM
    ===================================================== */

    return (
        <Paper
            elevation={0}
            sx={{
                width: "100%",
                maxWidth: 1000,
                mx: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                overflow: "hidden"
            }}
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2
                }}
            >

                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >

                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            backgroundColor: "action.hover"
                        }}
                    >
                        <AddBusiness
                            color="primary"
                            fontSize="large"
                        />
                    </Box>

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Create Facility Channel
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Enter the details to register a new facility channel.
                        </Typography>

                    </Box>

                </Stack>

                {typeof onCancel === "function" && (
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBack />}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Back
                    </Button>
                )}

            </Box>

            <Divider />

            {/* =================================================
                FORM CONTENT
            ================================================= */}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >

                <Box sx={{ p: 3 }}>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{ mb: 2 }}
                        >
                            {success}
                        </Alert>
                    )}

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* =====================================
                            FACILITY NAME
                        ===================================== */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                required
                                name="facilityName"
                                label="Facility Name"
                                placeholder="Enter facility name"
                                value={formData.facilityName}
                                onChange={handleChange}
                                error={Boolean(
                                    formErrors.facilityName
                                )}
                                helperText={
                                    formErrors.facilityName ||
                                    "Maximum 150 characters"
                                }
                                disabled={loading}
                                inputProps={{
                                    maxLength: 150
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            CHANNEL NAME
                        ===================================== */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                required
                                name="channelName"
                                label="Channel Name"
                                placeholder="Enter channel name"
                                value={formData.channelName}
                                onChange={handleChange}
                                error={Boolean(
                                    formErrors.channelName
                                )}
                                helperText={
                                    formErrors.channelName ||
                                    "Maximum 150 characters"
                                }
                                disabled={loading}
                                inputProps={{
                                    maxLength: 150
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            CHANNEL CODE
                        ===================================== */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                required
                                name="channelCode"
                                label="Channel Code"
                                placeholder="Enter channel code"
                                value={formData.channelCode}
                                onChange={handleChange}
                                error={Boolean(
                                    formErrors.channelCode
                                )}
                                helperText={
                                    formErrors.channelCode ||
                                    "Enter a unique channel code."
                                }
                                disabled={loading}
                                inputProps={{
                                    maxLength: 50
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            STATUS
                        ===================================== */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                select
                                fullWidth
                                required
                                name="status"
                                label="Status"
                                value={formData.status}
                                onChange={handleChange}
                                error={Boolean(
                                    formErrors.status
                                )}
                                helperText={formErrors.status || " "}
                                disabled={loading}
                            >

                                <MenuItem value="active">
                                    Active
                                </MenuItem>

                                <MenuItem value="inactive">
                                    Inactive
                                </MenuItem>

                                <MenuItem value="pending">
                                    Pending
                                </MenuItem>

                            </TextField>

                        </Grid>

                        {/* =====================================
                            DESCRIPTION
                        ===================================== */}

                        <Grid item xs={12}>

                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                name="description"
                                label="Description"
                                placeholder="Enter an optional description"
                                value={formData.description}
                                onChange={handleChange}
                                error={Boolean(
                                    formErrors.description
                                )}
                                helperText={
                                    formErrors.description ||
                                    `${formData.description.length}/500 characters`
                                }
                                disabled={loading}
                                inputProps={{
                                    maxLength: 500
                                }}
                            />

                        </Grid>

                    </Grid>

                </Box>

                <Divider />

                {/* =================================================
                    FORM ACTIONS
                ================================================= */}

                <Stack
                    direction={{
                        xs: "column-reverse",
                        sm: "row"
                    }}
                    spacing={1.5}
                    justifyContent="flex-end"
                    sx={{ p: 3 }}
                >

                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<RestartAlt />}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Reset
                    </Button>

                    {typeof onCancel === "function" && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            loading
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : <Save />
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Facility Channel"}
                    </Button>

                </Stack>

            </Box>

        </Paper>
    );

};

export default FacilityChannelCreate;

