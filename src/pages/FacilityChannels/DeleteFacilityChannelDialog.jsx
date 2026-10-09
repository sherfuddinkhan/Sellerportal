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
    DeleteForever,
    WarningAmber,
    Close
} from "@mui/icons-material";

/* =========================================================
   DELETE FACILITY CHANNEL DIALOG
========================================================= */

const DeleteFacilityChannelDialog = ({
    open = false,
    facilityChannel = null,
    loading = false,
    error = "",
    onClose,
    onConfirm
}) => {

    /* =====================================================
       GET FACILITY CHANNEL DETAILS
    ===================================================== */

    const facilityName =
        facilityChannel?.facilityName || "N/A";

    const channelName =
        facilityChannel?.channelName || "N/A";

    const channelCode =
        facilityChannel?.channelCode || "N/A";

    /* =====================================================
       CLOSE DIALOG
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
       CONFIRM DELETE
    ===================================================== */

    const handleConfirm = () => {
        if (loading || !facilityChannel) {
            return;
        }

        if (typeof onConfirm === "function") {
            onConfirm(facilityChannel);
        }
    };

    /* =====================================================
       RENDER DIALOG
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="delete-facility-channel-title"
        >
            {/* =============================================
               DIALOG TITLE
            ============================================= */}

            <DialogTitle
                id="delete-facility-channel-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pb: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        backgroundColor: "error.light",
                        color: "error.dark",
                        flexShrink: 0
                    }}
                >
                    <DeleteForever fontSize="medium" />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography
                        variant="h6"
                        component="div"
                        fontWeight={700}
                    >
                        Delete Facility Channel
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Confirm your deletion request
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider />

            {/* =============================================
               DIALOG CONTENT
            ============================================= */}

            <DialogContent sx={{ pt: 3 }}>
                <Alert
                    severity="warning"
                    icon={<WarningAmber />}
                    sx={{ mb: 2 }}
                >
                    This action may permanently remove the
                    selected facility channel.
                </Alert>

                <DialogContentText sx={{ mb: 2 }}>
                    Are you sure you want to delete this
                    facility channel? Please review the details
                    before proceeding.
                </DialogContentText>

                {/* =========================================
                   FACILITY CHANNEL DETAILS
                ========================================= */}

                {facilityChannel && (
                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            backgroundColor: "action.hover"
                        }}
                    >
                        <Box sx={{ mb: 1.5 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Facility Name
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {facilityName}
                            </Typography>
                        </Box>

                        <Box sx={{ mb: 1.5 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Channel Name
                            </Typography>

                            <Typography
                                variant="body1"
                                fontWeight={600}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {channelName}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Channel Code
                            </Typography>

                            <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {channelCode}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* =========================================
                   ERROR MESSAGE
                ========================================= */}

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

            {/* =============================================
               DIALOG ACTIONS
            ============================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
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
                            <DeleteForever />
                        )
                    }
                    onClick={handleConfirm}
                    disabled={loading || !facilityChannel}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteFacilityChannelDialog;

