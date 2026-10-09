import React from "react";

import {
    Box,
    Paper,
    Typography,
    Grid,
    Divider,
    Chip,
    Button,
    Stack,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Inventory2,
    Assignment,
    Inventory,
    LocationOn,
    Numbers,
    CalendarMonth,
    InfoOutlined
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...keys) => {
    for (const key of keys) {
        if (
            record &&
            record[key] !== undefined &&
            record[key] !== null
        ) {
            return record[key];
        }
    }

    return null;
};

/* =========================================================
   FORMAT TEXT
========================================================= */

const formatText = (value, fallback = "N/A") => {
    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return fallback;
    }

    return String(value);
};

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (
        value === undefined ||
        value === null ||
        value === "" ||
        !Number.isFinite(number)
    ) {
        return "N/A";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 3
    });
};

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
   GET STATUS COLOR
========================================================= */

const getStatusColor = (status) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase();

    switch (normalizedStatus) {
        case "completed":
        case "complete":
        case "putaway":
            return "success";

        case "pending":
        case "not started":
            return "warning";

        case "in progress":
        case "inprogress":
        case "processing":
            return "info";

        case "cancelled":
        case "canceled":
        case "failed":
            return "error";

        default:
            return "default";
    }
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    label,
    value,
    icon,
    valueNode
}) => (
    <Grid item xs={12} sm={6} md={4}>
        <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{ height: "100%" }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "action.hover",
                    borderRadius: 2,
                    p: 1,
                    color: "primary.main"
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

                {valueNode || (
                    <Typography
                        variant="body1"
                        fontWeight={600}
                        sx={{
                            overflowWrap: "anywhere"
                        }}
                    >
                        {formatText(value)}
                    </Typography>
                )}
            </Box>
        </Stack>
    </Grid>
);

/* =========================================================
   MANIFEST PACKAGES PUTAWAY DETAILS
========================================================= */

const ManifestPackagesPutawayDetails = ({
    record = null,
    loading = false,
    error = "",
    onEdit,
    onBack,
    title = "Manifest Package Putaway Details"
}) => {

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <Paper
                elevation={2}
                sx={{
                    p: 5,
                    borderRadius: 3,
                    textAlign: "center"
                }}
            >
                <CircularProgress />

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    Loading putaway details...
                </Typography>
            </Paper>
        );
    }

    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error) {
        return (
            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    borderRadius: 3
                }}
            >
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>

                {typeof onBack === "function" && (
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                    >
                        Back
                    </Button>
                )}
            </Paper>
        );
    }

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (!record) {
        return (
            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center"
                }}
            >
                <InfoOutlined
                    color="disabled"
                    sx={{ fontSize: 48, mb: 1 }}
                />

                <Typography variant="h6" fontWeight={600}>
                    No Putaway Record Found
                </Typography>

                <Typography
                    color="text.secondary"
                    sx={{ mt: 1, mb: 2 }}
                >
                    Select a valid putaway record to view its details.
                </Typography>

                {typeof onBack === "function" && (
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                    >
                        Back to List
                    </Button>
                )}
            </Paper>
        );
    }

    /* =====================================================
       NORMALIZE RECORD FIELDS
    ===================================================== */

    const recordId = getFieldValue(
        record,
        "manifestPackagesPutawayId",
        "ManifestPackagesPutawayId",
        "manifestPackagePutawayId",
        "ManifestPackagePutawayId",
        "id",
        "Id"
    );

    const manifestId = getFieldValue(
        record,
        "manifestId",
        "ManifestId"
    );

    const packageId = getFieldValue(
        record,
        "packageId",
        "PackageId"
    );

    const location = getFieldValue(
        record,
        "putawayLocation",
        "PutawayLocation",
        "location",
        "Location",
        "binLocation",
        "BinLocation"
    );

    const quantity = getFieldValue(
        record,
        "quantity",
        "Quantity",
        "packageQuantity",
        "PackageQuantity"
    );

    const status = getFieldValue(
        record,
        "status",
        "Status",
        "putawayStatus",
        "PutawayStatus"
    );

    const createdAt = getFieldValue(
        record,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    );

    const updatedAt = getFieldValue(
        record,
        "updatedAt",
        "UpdatedAt",
        "modifiedAt",
        "ModifiedAt",
        "updatedDate",
        "UpdatedDate"
    );

    const createdBy = getFieldValue(
        record,
        "createdBy",
        "CreatedBy"
    );

    const updatedBy = getFieldValue(
        record,
        "updatedBy",
        "UpdatedBy",
        "modifiedBy",
        "ModifiedBy"
    );

    /* =====================================================
       RENDER DETAILS
    ===================================================== */

    return (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 2, sm: 3, md: 4 },
                borderRadius: 3,
                width: "100%"
            }}
        >
            {/* HEADER */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
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
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            borderRadius: 2,
                            p: 1.5
                        }}
                    >
                        <Inventory2 />
                    </Box>

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Review the selected putaway record.
                        </Typography>
                    </Box>
                </Stack>

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                >
                    {typeof onBack === "function" && (
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={onBack}
                        >
                            Back
                        </Button>
                    )}

                    {typeof onEdit === "function" && (
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() => onEdit(record)}
                        >
                            Edit
                        </Button>
                    )}
                </Stack>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* RECORD SUMMARY */}

            <Box
                sx={{
                    bgcolor: "action.hover",
                    borderRadius: 2,
                    p: 2,
                    mb: 4
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                >
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Putaway Record ID
                        </Typography>

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            {formatText(recordId)}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.75 }}
                        >
                            Current Status
                        </Typography>

                        <Chip
                            label={formatText(status, "Unknown")}
                            color={getStatusColor(status)}
                            variant="filled"
                        />
                    </Box>
                </Stack>
            </Box>

            {/* PUTAWAY INFORMATION */}

            <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 3 }}
            >
                Putaway Information
            </Typography>

            <Grid container spacing={3}>
                <DetailItem
                    label="Putaway Record ID"
                    value={recordId}
                    icon={<Assignment />}
                />

                <DetailItem
                    label="Manifest ID"
                    value={manifestId}
                    icon={<Assignment />}
                />

                <DetailItem
                    label="Package ID"
                    value={packageId}
                    icon={<Inventory />}
                />

                <DetailItem
                    label="Putaway Location"
                    value={location}
                    icon={<LocationOn />}
                />

                <DetailItem
                    label="Quantity"
                    valueNode={
                        <Typography
                            variant="body1"
                            fontWeight={600}
                        >
                            {formatNumber(quantity)}
                        </Typography>
                    }
                    icon={<Numbers />}
                />

                <DetailItem
                    label="Status"
                    valueNode={
                        <Chip
                            size="small"
                            label={formatText(status, "Unknown")}
                            color={getStatusColor(status)}
                        />
                    }
                    icon={<InfoOutlined />}
                />
            </Grid>

            {/* AUDIT INFORMATION */}

            <Divider sx={{ my: 4 }} />

            <Typography
                variant="h6"
                fontWeight={700}
                sx={{ mb: 3 }}
            >
                Audit Information
            </Typography>

            <Grid container spacing={3}>
                <DetailItem
                    label="Created At"
                    value={formatDate(createdAt)}
                    icon={<CalendarMonth />}
                />

                <DetailItem
                    label="Updated At"
                    value={formatDate(updatedAt)}
                    icon={<CalendarMonth />}
                />

                <DetailItem
                    label="Created By"
                    value={createdBy}
                    icon={<InfoOutlined />}
                />

                <DetailItem
                    label="Updated By"
                    value={updatedBy}
                    icon={<InfoOutlined />}
                />
            </Grid>

            {/* FOOTER */}

            <Divider sx={{ my: 4 }} />

            <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
            >
                {typeof onBack === "function" && (
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                    >
                        Back to List
                    </Button>
                )}

                {typeof onEdit === "function" && (
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => onEdit(record)}
                    >
                        Edit Putaway
                    </Button>
                )}
            </Stack>
        </Paper>
    );
};

export default ManifestPackagesPutawayDetails;

