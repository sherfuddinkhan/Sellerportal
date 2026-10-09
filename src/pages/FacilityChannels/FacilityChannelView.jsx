import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Grid,
    Typography,
    Divider,
    Chip,
    CircularProgress,
    Alert,
    IconButton,
    Stack,
    Tooltip
} from "@mui/material";

import {
    Close,
    Refresh,
    Apartment,
    Tag,
    CalendarMonth,
    Update,
    CheckCircle,
    Cancel,
    InfoOutlined
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
    "https://localhost:7000/api/FacilityChannel";

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

/* =========================================================
   FORMAT VALUE
========================================================= */

const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "N/A";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return String(value);
};

/* =========================================================
   STATUS CONFIGURATION
========================================================= */

const getStatusColor = (value) => {
    if (value === true) {
        return "success";
    }

    if (value === false) {
        return "default";
    }

    const status = String(value || "")
        .trim()
        .toLowerCase();

    switch (status) {
        case "active":
        case "enabled":
        case "available":
        case "true":
            return "success";

        case "inactive":
        case "disabled":
        case "unavailable":
        case "false":
            return "default";

        case "pending":
            return "warning";

        case "failed":
        case "error":
            return "error";

        default:
            return "info";
    }
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    label,
    value,
    icon,
    status = false
}) => {
    const displayValue = formatValue(value);

    return (
        <Grid item xs={12} sm={6}>
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: "action.hover",
                        color: "text.secondary",
                        flexShrink: 0
                    }}
                >
                    {icon || <InfoOutlined fontSize="small" />}
                </Box>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {label}
                    </Typography>

                    {status ? (
                        <Box sx={{ mt: 0.5 }}>
                            <Chip
                                size="small"
                                label={displayValue}
                                color={getStatusColor(value)}
                                variant="outlined"
                            />
                        </Box>
                    ) : (
                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                                mt: 0.5,
                                overflowWrap: "anywhere",
                                whiteSpace: "pre-wrap"
                            }}
                        >
                            {displayValue}
                        </Typography>
                    )}
                </Box>
            </Stack>
        </Grid>
    );
};

/* =========================================================
   FACILITY CHANNEL VIEW
========================================================= */

const FacilityChannelView = ({
    open,
    facilityChannelId,
    facilityChannel,
    apiBaseUrl = API_BASE_URL,
    onClose,
    onEdit
}) => {
    const [details, setDetails] = useState(
        facilityChannel || null
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* =====================================================
       RESOLVE ID
    ===================================================== */

    const resolvedId =
        facilityChannelId ??
        facilityChannel?.id ??
        facilityChannel?.facilityChannelId ??
        facilityChannel?.channelId;

    /* =====================================================
       FETCH FACILITY CHANNEL DETAILS
    ===================================================== */

    const fetchDetails = async () => {
        if (resolvedId === null || resolvedId === undefined) {
            if (facilityChannel) {
                setDetails(facilityChannel);
                setError("");
                return;
            }

            setError("Facility channel ID was not provided.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.get(
                `${apiBaseUrl}/${encodeURIComponent(resolvedId)}`
            );

            const result = response.data;

            const record =
                result?.data ??
                result?.facilityChannel ??
                result;

            setDetails(record);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                err.message ||
                "Failed to load facility channel details."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       LOAD DETAILS WHEN OPENED
    ===================================================== */

    useEffect(() => {
        if (!open) {
            return;
        }

        if (
            facilityChannel &&
            (
                facilityChannelId === undefined ||
                facilityChannelId === null
            )
        ) {
            setDetails(facilityChannel);
            setError("");
            return;
        }

        fetchDetails();

        // Load when the dialog opens or the selected ID changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, resolvedId]);

    /* =====================================================
       GET FIELD VALUES
    ===================================================== */

    const record = details || {};

    const id =
        record.id ??
        record.facilityChannelId ??
        record.channelId;

    const facilityName =
        record.facilityName ??
        record.facility?.name ??
        record.name;

    const channelName =
        record.channelName ??
        record.channel?.name ??
        record.channel;

    const channelCode =
        record.channelCode ??
        record.code;

    const description =
        record.description ??
        record.remarks;

    const status =
        record.status ??
        record.channelStatus;

    const isActive =
        record.isActive ??
        record.active ??
        record.enabled;

    const createdAt =
        record.createdAt ??
        record.createdDate ??
        record.createdOn;

    const updatedAt =
        record.updatedAt ??
        record.updatedDate ??
        record.updatedOn;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={Boolean(open)}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            aria-labelledby="facility-channel-view-title"
        >
            {/* DIALOG HEADER */}

            <DialogTitle
                id="facility-channel-view-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    pr: 2
                }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: "primary.light",
                            color: "primary.contrastText"
                        }}
                    >
                        <Apartment />
                    </Box>

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Facility Channel Details
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            View facility channel information
                        </Typography>
                    </Box>
                </Stack>

                <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                >
                    <Tooltip title="Refresh details">
                        <span>
                            <IconButton
                                onClick={fetchDetails}
                                disabled={loading}
                                aria-label="Refresh facility channel details"
                            >
                                <Refresh />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <IconButton
                        onClick={onClose}
                        aria-label="Close dialog"
                    >
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <Divider />

            {/* DIALOG CONTENT */}

            <DialogContent sx={{ py: 3 }}>
                {loading && (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            py: 6,
                            gap: 2
                        }}
                    >
                        <CircularProgress />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Loading facility channel details...
                        </Typography>
                    </Box>
                )}

                {!loading && error && (
                    <Alert
                        severity="error"
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={fetchDetails}
                            >
                                Retry
                            </Button>
                        }
                    >
                        {error}
                    </Alert>
                )}

                {!loading && !error && details && (
                    <Stack spacing={3}>
                        {/* GENERAL INFORMATION */}

                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ mb: 2 }}
                            >
                                General Information
                            </Typography>

                            <Grid container spacing={3}>
                                <DetailItem
                                    label="Facility Channel ID"
                                    value={id}
                                    icon={<Tag fontSize="small" />}
                                />

                                <DetailItem
                                    label="Facility Name"
                                    value={facilityName}
                                    icon={<Apartment fontSize="small" />}
                                />

                                <DetailItem
                                    label="Channel Name"
                                    value={channelName}
                                    icon={<Apartment fontSize="small" />}
                                />

                                <DetailItem
                                    label="Channel Code"
                                    value={channelCode}
                                    icon={<Tag fontSize="small" />}
                                />

                                {status !== undefined && (
                                    <DetailItem
                                        label="Status"
                                        value={status}
                                        status
                                        icon={<InfoOutlined fontSize="small" />}
                                    />
                                )}

                                {isActive !== undefined && (
                                    <DetailItem
                                        label="Active"
                                        value={isActive}
                                        status
                                        icon={
                                            isActive === true
                                                ? <CheckCircle fontSize="small" />
                                                : <Cancel fontSize="small" />
                                        }
                                    />
                                )}
                            </Grid>
                        </Box>

                        <Divider />

                        {/* DESCRIPTION */}

                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ mb: 1.5 }}
                            >
                                Description
                            </Typography>

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: "action.hover",
                                    minHeight: 56
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{ whiteSpace: "pre-wrap" }}
                                >
                                    {formatValue(description)}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider />

                        {/* AUDIT INFORMATION */}

                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ mb: 2 }}
                            >
                                Audit Information
                            </Typography>

                            <Grid container spacing={3}>
                                <DetailItem
                                    label="Created At"
                                    value={formatDate(createdAt)}
                                    icon={<CalendarMonth fontSize="small" />}
                                />

                                <DetailItem
                                    label="Updated At"
                                    value={formatDate(updatedAt)}
                                    icon={<Update fontSize="small" />}
                                />
                            </Grid>
                        </Box>
                    </Stack>
                )}
            </DialogContent>

            <Divider />

            {/* DIALOG ACTIONS */}

            <DialogActions sx={{ p: 2.5, gap: 1 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                >
                    Close
                </Button>

                {onEdit && details && (
                    <Button
                        variant="contained"
                        onClick={() => onEdit(details)}
                        disabled={loading}
                    >
                        Edit Facility Channel
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default FacilityChannelView;

