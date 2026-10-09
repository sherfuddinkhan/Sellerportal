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
    Divider,
    Chip,
    Button,
    Stack,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Refresh,
    Business,
    Hub,
    Tag,
    InfoOutlined,
    CalendarMonth
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const DEFAULT_API_BASE_URL =
    "https://localhost:7000/api/FacilityChannel";

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

    return (
        error?.message ||
        "Unable to load facility channel details."
    );

};

/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

const normalizeFacilityChannel = (responseData) => {

    const record =
        responseData?.data ??
        responseData?.result ??
        responseData;

    if (
        !record ||
        typeof record !== "object" ||
        Array.isArray(record)
    ) {
        return null;
    }

    return record;

};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {

    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
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
   GET STATUS CONFIGURATION
========================================================= */

const getStatusConfig = (status) => {

    const normalizedStatus = String(
        status ?? "unknown"
    ).toLowerCase();

    switch (normalizedStatus) {

        case "active":
            return {
                label: "Active",
                color: "success"
            };

        case "inactive":
            return {
                label: "Inactive",
                color: "default"
            };

        case "pending":
            return {
                label: "Pending",
                color: "warning"
            };

        default:
            return {
                label: status || "Unknown",
                color: "default"
            };

    }

};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    icon,
    label,
    value
}) => {

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                minWidth: 0
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    borderRadius: 2,
                    backgroundColor: "action.hover",
                    color: "text.secondary"
                }}
            >
                {icon}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-wrap"
                    }}
                >
                    {value === null ||
                    value === undefined ||
                    value === ""
                        ? "—"
                        : String(value)}
                </Typography>

            </Box>

        </Box>
    );

};

/* =========================================================
   FACILITY CHANNEL DETAILS
========================================================= */

const FacilityChannelDetails = ({
    facilityChannelId,
    facilityChannel: initialFacilityChannel = null,
    apiBaseUrl = DEFAULT_API_BASE_URL,
    onClose,
    onEdit,
    onError
}) => {

    /* =====================================================
       COMPONENT STATE
    ===================================================== */

    const [facilityChannel, setFacilityChannel] =
        useState(initialFacilityChannel);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    /* =====================================================
       LOAD FACILITY CHANNEL DETAILS
    ===================================================== */

    const loadFacilityChannel = async () => {

        if (
            facilityChannelId === null ||
            facilityChannelId === undefined ||
            facilityChannelId === ""
        ) {

            if (initialFacilityChannel) {

                setFacilityChannel(initialFacilityChannel);
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

            const response = await axios.get(
                `${apiBaseUrl}/${encodeURIComponent(
                    facilityChannelId
                )}`
            );

            const record = normalizeFacilityChannel(
                response.data
            );

            if (!record) {
                throw new Error(
                    "The API did not return valid facility channel details."
                );
            }

            setFacilityChannel(record);

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
       LOAD DETAILS WHEN ID CHANGES
    ===================================================== */

    useEffect(() => {

        if (
            facilityChannelId !== null &&
            facilityChannelId !== undefined &&
            facilityChannelId !== ""
        ) {

            loadFacilityChannel();

        } else {

            setFacilityChannel(initialFacilityChannel);
            setError("");

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        facilityChannelId,
        apiBaseUrl,
        initialFacilityChannel
    ]);

    /* =====================================================
       STATUS
    ===================================================== */

    const statusConfig = getStatusConfig(
        facilityChannel?.status
    );

    /* =====================================================
       RENDER LOADING STATE
    ===================================================== */

    if (loading && !facilityChannel) {

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
       RENDER ERROR STATE
    ===================================================== */

    if (error && !facilityChannel) {

        return (
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3
                }}
            >

                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>

                <Stack
                    direction="row"
                    spacing={1}
                >

                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={loadFacilityChannel}
                    >
                        Retry
                    </Button>

                    {typeof onClose === "function" && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    )}

                </Stack>

            </Paper>
        );

    }

    /* =====================================================
       RENDER EMPTY STATE
    ===================================================== */

    if (!facilityChannel) {

        return (
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3
                }}
            >

                <InfoOutlined
                    sx={{
                        fontSize: 42,
                        color: "text.secondary",
                        mb: 1
                    }}
                />

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    No Facility Channel Selected
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    Select a facility channel to view its details.
                </Typography>

                {typeof onClose === "function" && (
                    <Button
                        sx={{ mt: 2 }}
                        onClick={onClose}
                    >
                        Back
                    </Button>
                )}

            </Paper>
        );

    }

    /* =====================================================
       RENDER DETAILS
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
                        <Hub
                            color="primary"
                            fontSize="large"
                        />
                    </Box>

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            Facility Channel Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            View the selected facility channel information.
                        </Typography>

                    </Box>

                </Stack>

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                >

                    <Tooltip title="Refresh details">

                        <span>

                            <IconButton
                                onClick={loadFacilityChannel}
                                disabled={loading}
                                aria-label="Refresh facility channel details"
                            >
                                {loading
                                    ? (
                                        <CircularProgress size={20} />
                                    )
                                    : <Refresh />}
                            </IconButton>

                        </span>

                    </Tooltip>

                    {typeof onEdit === "function" && (
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() => onEdit(facilityChannel)}
                        >
                            Edit
                        </Button>
                    )}

                    {typeof onClose === "function" && (
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<ArrowBack />}
                            onClick={onClose}
                        >
                            Back
                        </Button>
                    )}

                </Stack>

            </Box>

            <Divider />

            {/* =================================================
                STATUS AND IDENTIFIER
            ================================================= */}

            <Box
                sx={{
                    px: 3,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    backgroundColor: "action.hover"
                }}
            >

                <Box>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Facility Channel ID
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        {facilityChannel.facilityChannelId ??
                         facilityChannel.id ??
                         facilityChannelId ??
                         "—"}
                    </Typography>

                </Box>

                <Chip
                    label={statusConfig.label}
                    color={statusConfig.color}
                    variant="filled"
                    sx={{ fontWeight: 600 }}
                />

            </Box>

            <Divider />

            {/* =================================================
                DETAIL CONTENT
            ================================================= */}

            <Box sx={{ p: 3 }}>

                {error && (
                    <Alert
                        severity="warning"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* =============================================
                    GENERAL INFORMATION
                ============================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    General Information
                </Typography>

                <Grid
                    container
                    spacing={3}
                >

                    <Grid item xs={12} md={6}>

                        <DetailItem
                            icon={<Business />}
                            label="Facility Name"
                            value={facilityChannel.facilityName}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <DetailItem
                            icon={<Hub />}
                            label="Channel Name"
                            value={facilityChannel.channelName}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <DetailItem
                            icon={<Tag />}
                            label="Channel Code"
                            value={facilityChannel.channelCode}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <DetailItem
                            icon={<InfoOutlined />}
                            label="Status"
                            value={statusConfig.label}
                        />

                    </Grid>

                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* =============================================
                    DESCRIPTION
                ============================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Description
                </Typography>

                <Box
                    sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        backgroundColor: "background.default"
                    }}
                >

                    <Typography
                        variant="body1"
                        sx={{
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere"
                        }}
                    >
                        {facilityChannel.description || "No description provided."}
                    </Typography>

                </Box>

                {/* =============================================
                    AUDIT INFORMATION
                ============================================= */}

                {(facilityChannel.createdAt ||
                  facilityChannel.createdDate ||
                  facilityChannel.updatedAt ||
                  facilityChannel.updatedDate) && (

                    <>

                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 2 }}
                        >
                            Audit Information
                        </Typography>

                        <Grid
                            container
                            spacing={3}
                        >

                            {(facilityChannel.createdAt ||
                              facilityChannel.createdDate) && (

                                <Grid item xs={12} md={6}>

                                    <DetailItem
                                        icon={<CalendarMonth />}
                                        label="Created At"
                                        value={formatDate(
                                            facilityChannel.createdAt ??
                                            facilityChannel.createdDate
                                        )}
                                    />

                                </Grid>

                            )}

                            {(facilityChannel.updatedAt ||
                              facilityChannel.updatedDate) && (

                                <Grid item xs={12} md={6}>

                                    <DetailItem
                                        icon={<CalendarMonth />}
                                        label="Last Updated"
                                        value={formatDate(
                                            facilityChannel.updatedAt ??
                                            facilityChannel.updatedDate
                                        )}
                                    />

                                </Grid>

                            )}

                        </Grid>

                    </>

                )}

            </Box>

        </Paper>
    );

};

export default FacilityChannelDetails;

