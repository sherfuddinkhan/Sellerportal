import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Paper,
    Typography,
    Divider,
    Alert,
    CircularProgress,
    Stack
} from "@mui/material";

import {
    Save,
    RestartAlt,
    ArrowBack
} from "@mui/icons-material";

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
   FACILITY CHANNEL FORM
========================================================= */

const FacilityChannelForm = ({
    mode = "create",
    facilityChannel = null,
    loading = false,
    error = "",
    onSubmit,
    onCancel,
    onReset
}) => {

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [formErrors, setFormErrors] = useState({});

    const [submitError, setSubmitError] = useState("");

    /* =====================================================
       DETERMINE FORM MODE
    ===================================================== */

    const isEditMode =
        mode === "edit" ||
        mode === "update";

    /* =====================================================
       POPULATE FORM DATA
    ===================================================== */

    useEffect(() => {

        if (isEditMode && facilityChannel) {

            setFormData({
                facilityName:
                    facilityChannel.facilityName ?? "",

                channelName:
                    facilityChannel.channelName ?? "",

                channelCode:
                    facilityChannel.channelCode ?? "",

                description:
                    facilityChannel.description ?? "",

                status: String(
                    facilityChannel.status ?? "active"
                ).toLowerCase()
            });

        } else {

            setFormData({
                ...initialFormData
            });

        }

        setFormErrors({});
        setSubmitError("");

    }, [
        isEditMode,
        facilityChannel
    ]);

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

        setSubmitError("");

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
       HANDLE FORM SUBMISSION
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (loading) {
            return;
        }

        setSubmitError("");

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

        if (typeof onSubmit !== "function") {
            setSubmitError(
                "Form submission handler is not configured."
            );
            return;
        }

        try {

            await onSubmit(payload);

        } catch (submitException) {

            setSubmitError(
                submitException?.response?.data?.message ||
                submitException?.message ||
                "Unable to save the facility channel."
            );

        }

    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {

        if (loading) {
            return;
        }

        if (isEditMode && facilityChannel) {

            setFormData({
                facilityName:
                    facilityChannel.facilityName ?? "",

                channelName:
                    facilityChannel.channelName ?? "",

                channelCode:
                    facilityChannel.channelCode ?? "",

                description:
                    facilityChannel.description ?? "",

                status: String(
                    facilityChannel.status ?? "active"
                ).toLowerCase()
            });

        } else {

            setFormData({
                ...initialFormData
            });

        }

        setFormErrors({});
        setSubmitError("");

        if (typeof onReset === "function") {
            onReset();
        }

    };

    /* =====================================================
       HANDLE CANCEL
    ===================================================== */

    const handleCancel = () => {

        if (loading) {
            return;
        }

        if (typeof onCancel === "function") {
            onCancel();
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
                FORM HEADER
            ================================================= */}

            <Box
                sx={{
                    p: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2
                }}
            >

                <Box>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {isEditMode
                            ? "Edit Facility Channel"
                            : "Create Facility Channel"}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {isEditMode
                            ? "Update the facility channel information."
                            : "Enter the details to register a new facility channel."}
                    </Typography>

                </Box>

                {typeof onCancel === "function" && (
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBack />}
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Back
                    </Button>
                )}

            </Box>

            <Divider />

            {/* =================================================
                FORM BODY
            ================================================= */}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >

                <Box sx={{ p: 3 }}>

                    {(error || submitError) && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                        >
                            {submitError || error}
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
                    sx={{
                        p: 3
                    }}
                >

                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleReset}
                        startIcon={<RestartAlt />}
                        disabled={loading}
                    >
                        Reset
                    </Button>

                    {typeof onCancel === "function" && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleCancel}
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
                            ? "Saving..."
                            : isEditMode
                                ? "Update Facility Channel"
                                : "Create Facility Channel"}
                    </Button>

                </Stack>

            </Box>

        </Paper>
    );

};

export default FacilityChannelForm;

