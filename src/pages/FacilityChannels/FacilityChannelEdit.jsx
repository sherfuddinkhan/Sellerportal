import React, {
    useEffect,
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
    Stack,
    IconButton
} from "@mui/material";

import {
    Save,
    ArrowBack,
    Refresh,
    Edit as EditIcon
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
   EXTRACT ERROR MESSAGE
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

    if (error?.message) {
        return error.message;
    }

    return "An unexpected error occurred.";

};

/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

const normalizeFacilityChannel = (responseData) => {

    const record =
        responseData?.data ??
        responseData?.result ??
        responseData;

    return {
        facilityName: record?.facilityName ?? "",
        channelName: record?.channelName ?? "",
        channelCode: record?.channelCode ?? "",
        description: record?.description ?? "",
        status: String(
            record?.status ?? "active"
        ).toLowerCase()
    };

};

/* =========================================================
   FACILITY CHANNEL EDIT
========================================================= */

const FacilityChannelEdit = ({
    facilityChannelId,
    facilityChannel: initialFacilityChannel = null,
    apiBaseUrl = DEFAULT_API_BASE_URL,
    onCancel,
    onUpdated,
    onError
}) => {

    /* =====================================================
       COMPONENT STATE
    ===================================================== */

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formErrors, setFormErrors] = useState({});

    /* =====================================================
       LOAD FACILITY CHANNEL
    ===================================================== */

    const loadFacilityChannel = async () => {

        if (
            facilityChannelId === null ||
            facilityChannelId === undefined ||
            facilityChannelId === ""
        ) {

            if (initialFacilityChannel) {

                setFormData(
                    normalizeFacilityChannel(
                        initialFacilityChannel
                    )
                );

                setError("");

            } else {

                setError(
                    "A facility channel ID is required."
                );

            }

            return;
        }

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            const response = await axios.get(
                `${apiBaseUrl}/${encodeURIComponent(
                    facilityChannelId
                )}`
            );

            setFormData(
                normalizeFacilityChannel(response.data)
            );

            setFormErrors({});

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
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {

        loadFacilityChannel();

        // Reload when the selected record or API URL changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        facilityChannelId,
        apiBaseUrl
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
       UPDATE FACILITY CHANNEL
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (saving || loading) {
            return;
        }

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        if (
            facilityChannelId === null ||
            facilityChannelId === undefined ||
            facilityChannelId === ""
        ) {

            const message =
                "Cannot update the facility channel because its ID is missing.";

            setError(message);

            if (typeof onError === "function") {
                onError(new Error(message));
            }

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

            setSaving(true);

            const response = await axios.put(
                `${apiBaseUrl}/${encodeURIComponent(
                    facilityChannelId
                )}`,
                payload
            );

            setSuccess(
                "Facility channel updated successfully."
            );

            if (typeof onUpdated === "function") {
                onUpdated(
                    response.data,
                    facilityChannelId
                );
            }

        } catch (requestError) {

            const message = getErrorMessage(requestError);

            setError(message);

            if (typeof onError === "function") {
                onError(requestError);
            }

        } finally {

            setSaving(false);

        }

    };

    /* =====================================================
       RENDER LOADING STATE
    ===================================================== */

    if (loading) {

        return (
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3
                }}
            >

                <Stack
                    alignItems="center"
                    spacing={2}
                >

                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading facility channel details...
                    </Typography>

                </Stack>

            </Paper>
        );

    }

    /* =====================================================
       RENDER EDIT FORM
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

                    <EditIcon
                        color="primary"
                        fontSize="large"
                    />

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Edit Facility Channel
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Update the selected facility channel.
                        </Typography>

                    </Box>

                </Stack>

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <IconButton
                        onClick={loadFacilityChannel}
                        disabled={loading || saving}
                        aria-label="Reload facility channel"
                    >
                        <Refresh />
                    </IconButton>

                    {typeof onCancel === "function" && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<ArrowBack />}
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Back
                        </Button>
                    )}

                </Stack>

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
                                value={formData.facilityName}
                                onChange={handleChange}
                                error={Boolean(
                                    formErrors.facilityName
                                )}
                                helperText={
                                    formErrors.facilityName ||
                                    "Maximum 150 characters"
                                }
                                disabled={saving}
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
                                value={formData.channelName}
                                onChange={handleChange}
                                error={Boolean(
                                    formErrors.channelName
                                )}
                                helperText={
                                    formErrors.channelName ||
                                    "Maximum 150 characters"
                                }
                                disabled={saving}
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
                                value={formData.channelCode}
                                onChange={handleChange}
                                error={Boolean(
                                    formErrors.channelCode
                                )}
                                helperText={
                                    formErrors.channelCode ||
                                    "Maximum 50 characters"
                                }
                                disabled={saving}
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
                                disabled={saving}
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
                                value={formData.description}
                                onChange={handleChange}
                                error={Boolean(
                                    formErrors.description
                                )}
                                helperText={
                                    formErrors.description ||
                                    `${formData.description.length}/500 characters`
                                }
                                disabled={saving}
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
                        xs: "column",
                        sm: "row"
                    }}
                    spacing={1.5}
                    justifyContent="flex-end"
                    sx={{ p: 3 }}
                >

                    {typeof onCancel === "function" && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={onCancel}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            saving
                                ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                )
                                : <Save />
                        }
                        disabled={saving}
                    >
                        {saving
                            ? "Updating..."
                            : "Update Facility Channel"}
                    </Button>

                </Stack>

            </Box>

        </Paper>
    );

};

export default FacilityChannelEdit;

