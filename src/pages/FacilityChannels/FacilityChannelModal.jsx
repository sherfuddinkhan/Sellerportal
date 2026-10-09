import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    IconButton,
    MenuItem,
    CircularProgress,
    Divider,
    Alert
} from "@mui/material";

import {
    Close,
    Save,
    RestartAlt
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
   FACILITY CHANNEL MODAL
========================================================= */

const FacilityChannelModal = ({
    open = false,
    mode = "create",
    facilityChannel = null,
    loading = false,
    error = "",
    onClose,
    onSubmit
}) => {

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState({
        ...initialFormData
    });

    const [formErrors, setFormErrors] = useState({});

    /* =====================================================
       DETERMINE CREATE OR EDIT MODE
    ===================================================== */

    const isEditMode =
        mode === "edit" ||
        mode === "update";

    /* =====================================================
       POPULATE FORM FOR EDIT
    ===================================================== */

    useEffect(() => {

        if (!open) {
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

                status:
                    String(
                        facilityChannel.status ?? "active"
                    ).toLowerCase()
            });

        } else {

            setFormData({
                ...initialFormData
            });

        }

        setFormErrors({});

    }, [
        open,
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

    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {

        const errors = {};

        if (!formData.facilityName.trim()) {
            errors.facilityName =
                "Facility name is required.";
        }

        if (!formData.channelName.trim()) {
            errors.channelName =
                "Channel name is required.";
        }

        if (!formData.channelCode.trim()) {
            errors.channelCode =
                "Channel code is required.";
        }

        if (formData.channelCode.trim().length > 50) {
            errors.channelCode =
                "Channel code cannot exceed 50 characters.";
        }

        if (formData.facilityName.trim().length > 150) {
            errors.facilityName =
                "Facility name cannot exceed 150 characters.";
        }

        if (formData.channelName.trim().length > 150) {
            errors.channelName =
                "Channel name cannot exceed 150 characters.";
        }

        if (formData.description.length > 500) {
            errors.description =
                "Description cannot exceed 500 characters.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;

    };

    /* =====================================================
       HANDLE FORM SUBMISSION
    ===================================================== */

    const handleSubmit = (event) => {

        event.preventDefault();

        if (loading) {
            return;
        }

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

        if (typeof onSubmit === "function") {
            onSubmit(payload);
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

                status:
                    String(
                        facilityChannel.status ?? "active"
                    ).toLowerCase()
            });

        } else {

            setFormData({
                ...initialFormData
            });

        }

        setFormErrors({});

    };

    /* =====================================================
       HANDLE CLOSE
    ===================================================== */

    const handleClose = () => {

        if (loading) {
            return;
        }

        if (typeof onClose === "function") {
            onClose();
        }

    };

    /* =====================================================
       RENDER MODAL
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            disableEscapeKeyDown={loading}
            PaperProps={{
                sx: {
                    borderRadius: 3
                }
            }}
        >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    py: 2
                }}
            >

                <Box>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        {isEditMode
                            ? "Edit Facility Channel"
                            : "Create Facility Channel"}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {isEditMode
                            ? "Update the facility channel details."
                            : "Enter the details to create a facility channel."}
                    </Typography>

                </Box>

                <IconButton
                    onClick={handleClose}
                    disabled={loading}
                    aria-label="Close modal"
                    size="small"
                >
                    <Close />
                </IconButton>

            </DialogTitle>

            <Divider />

            {/* =================================================
                FORM CONTENT
            ================================================= */}

            <Box
                component="form"
                onSubmit={handleSubmit}
            >

                <DialogContent sx={{ py: 3 }}>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Grid
                        container
                        spacing={2.5}
                    >

                        {/* =====================================
                            FACILITY NAME
                        ===================================== */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                name="facilityName"
                                label="Facility Name"
                                placeholder="Enter facility name"
                                value={formData.facilityName}
                                onChange={handleChange}
                                error={Boolean(formErrors.facilityName)}
                                helperText={formErrors.facilityName}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 150
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            CHANNEL NAME
                        ===================================== */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                name="channelName"
                                label="Channel Name"
                                placeholder="Enter channel name"
                                value={formData.channelName}
                                onChange={handleChange}
                                error={Boolean(formErrors.channelName)}
                                helperText={formErrors.channelName}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 150
                                }}
                            />

                        </Grid>

                        {/* =====================================
                            CHANNEL CODE
                        ===================================== */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                name="channelCode"
                                label="Channel Code"
                                placeholder="Enter channel code"
                                value={formData.channelCode}
                                onChange={handleChange}
                                error={Boolean(formErrors.channelCode)}
                                helperText={
                                    formErrors.channelCode ||
                                    "Enter a unique code for this channel."
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

                        <Grid item xs={12} sm={6}>

                            <TextField
                                select
                                fullWidth
                                required
                                name="status"
                                label="Status"
                                value={formData.status}
                                onChange={handleChange}
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
                                minRows={3}
                                name="description"
                                label="Description"
                                placeholder="Enter channel description (optional)"
                                value={formData.description}
                                onChange={handleChange}
                                error={Boolean(formErrors.description)}
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

                </DialogContent>

                <Divider />

                {/* =================================================
                    MODAL ACTIONS
                ================================================= */}

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        gap: 1,
                        flexWrap: "wrap"
                    }}
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

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

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
                                ? "Update Channel"
                                : "Create Channel"}
                    </Button>

                </DialogActions>

            </Box>

        </Dialog>
    );

};

export default FacilityChannelModal;

