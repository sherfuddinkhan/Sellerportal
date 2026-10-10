import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Divider
} from "@mui/material";

import {
    WarningAmber,
    Close
} from "@mui/icons-material";

/* =========================================================
   DELETE EXPORT JOBS DIALOG
========================================================= */

const DeleteExportJobsDialog = ({
    open = false,
    exportJob = null,
    loading = false,
    error = "",
    onClose,
    onConfirm
}) => {

    /* =====================================================
       GET EXPORT JOB DETAILS
    ===================================================== */

    const jobId =
        exportJob?.id ??
        exportJob?.exportJobId ??
        exportJob?.exportId ??
        "";

    const jobName =
        exportJob?.jobName ??
        exportJob?.name ??
        exportJob?.title ??
        "this export job";

    /* =====================================================
       HANDLE CLOSE
    ===================================================== */

    const handleClose = () => {
        if (loading) {
            return;
        }

        onClose?.();
    };

    /* =====================================================
       HANDLE DELETE CONFIRMATION
    ===================================================== */

    const handleConfirm = () => {
        if (loading || !exportJob) {
            return;
        }

        onConfirm?.(exportJob);
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            aria-labelledby="delete-export-job-title"
            aria-describedby="delete-export-job-description"
        >
            {/* DIALOG TITLE */}

            <DialogTitle
                id="delete-export-job-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pb: 2
                }}
            >
                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "error.light",
                        color: "error.contrastText"
                    }}
                >
                    <DeleteOutline />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        component="div"
                        fontWeight={700}
                    >
                        Delete Export Job
                    </Typography>

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Confirm your action
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider />

            {/* DIALOG CONTENT */}

            <DialogContent sx={{ pt: 3 }}>
                <DialogContentText
                    id="delete-export-job-description"
                    color="text.primary"
                >
                    Are you sure you want to delete this export job?
                </DialogContentText>

                {/* SELECTED JOB DETAILS */}

                {exportJob && (
                    <Box
                        sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 1.5,
                            bgcolor: "action.hover",
                            border: "1px solid",
                            borderColor: "divider"
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Job Name
                        </Typography>

                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{
                                overflowWrap: "anywhere",
                                mb: 1
                            }}
                        >
                            {jobName}
                        </Typography>

                        {jobId !== "" && (
                            <>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Job ID
                                </Typography>

                                <Typography
                                    variant="body2"
                                    fontWeight={500}
                                >
                                    {jobId}
                                </Typography>
                            </>
                        )}
                    </Box>
                )}

                {/* WARNING */}

                <Alert
                    severity="warning"
                    icon={<WarningAmber />}
                    sx={{ mt: 2 }}
                >
                    This action may be permanent. Please verify the
                    selected export job before continuing.
                </Alert>

                {/* ERROR MESSAGE */}

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mt: 2 }}
                    >
                        {error}
                    </Alert>
                )}
            </DialogContent>

            <Divider />

            {/* DIALOG ACTIONS */}

            <DialogActions
                sx={{
                    p: 2,
                    gap: 1
                }}
            >
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Close />}
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        loading ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : (
                            <DeleteOutline />
                        )
                    }
                    onClick={handleConfirm}
                    disabled={loading || !exportJob}
                    autoFocus
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteExportJobsDialog;

