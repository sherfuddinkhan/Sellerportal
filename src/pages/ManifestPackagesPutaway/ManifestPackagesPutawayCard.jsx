
import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Stack,
    Chip,
    Divider,
    Button,
    IconButton,
    Tooltip,
    Skeleton
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Inventory2,
    Assignment,
    LocationOn,
    Numbers,
    CalendarMonth
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
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "0";
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
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

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   STATUS COLOR
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
   MANIFEST PACKAGES PUTAWAY CARD
========================================================= */

const ManifestPackagesPutawayCard = ({
    record = null,
    loading = false,
    onView,
    onEdit,
    onDelete,
    showActions = true,
    compact = false
}) => {

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <Card
                elevation={2}
                sx={{
                    height: "100%",
                    borderRadius: 3
                }}
            >
                <CardContent>
                    <Skeleton
                        variant="text"
                        width="60%"
                        height={32}
                    />

                    <Skeleton
                        variant="rounded"
                        width={100}
                        height={26}
                        sx={{ my: 2 }}
                    />

                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton
                        variant="rounded"
                        width="100%"
                        height={40}
                        sx={{ mt: 2 }}
                    />
                </CardContent>
            </Card>
        );
    }

    /* =====================================================
       EMPTY RECORD
    ===================================================== */

    if (!record) {
        return (
            <Card
                elevation={1}
                sx={{
                    borderRadius: 3,
                    p: 2
                }}
            >
                <Typography
                    color="text.secondary"
                    textAlign="center"
                >
                    No putaway record available.
                </Typography>
            </Card>
        );
    }

    /* =====================================================
       RECORD FIELDS
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

    /* =====================================================
       DETAIL ROW
    ===================================================== */

    const DetailRow = ({ icon, label, value }) => (
        <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{ minWidth: 0 }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "text.secondary"
                }}
            >
                {icon}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                >
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                        overflowWrap: "anywhere"
                    }}
                >
                    {formatText(value)}
                </Typography>
            </Box>
        </Stack>
    );

    /* =====================================================
       RENDER CARD
    ===================================================== */

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                overflow: "hidden",
                transition: "box-shadow 0.2s ease",
                "&:hover": {
                    boxShadow: 6
                }
            }}
        >
            {/* CARD HEADER */}

            <Box
                sx={{
                    px: 2,
                    py: 2,
                    bgcolor: "action.hover"
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                >
                    <Stack
                        direction="row"
                        spacing={1.25}
                        alignItems="center"
                        sx={{ minWidth: 0 }}
                    >
                        <Box
                            sx={{
                                p: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "background.paper",
                                borderRadius: 2,
                                color: "primary.main"
                            }}
                        >
                            <Inventory2 />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{
                                    overflowWrap: "anywhere"
                                }}
                            >
                                Putaway #{formatText(recordId)}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Manifest Package Putaway
                            </Typography>
                        </Box>
                    </Stack>

                    <Chip
                        size="small"
                        label={formatText(status, "Unknown")}
                        color={getStatusColor(status)}
                    />
                </Stack>
            </Box>

            <CardContent
                sx={{
                    p: 2.5,
                    flexGrow: 1,
                    "&:last-child": {
                        pb: 2.5
                    }
                }}
            >
                {/* RECORD DETAILS */}

                <Stack spacing={2.25}>
                    <DetailRow
                        icon={<Assignment fontSize="small" />}
                        label="Manifest ID"
                        value={manifestId}
                    />

                    <DetailRow
                        icon={<Inventory2 fontSize="small" />}
                        label="Package ID"
                        value={packageId}
                    />

                    <DetailRow
                        icon={<LocationOn fontSize="small" />}
                        label="Putaway Location"
                        value={location}
                    />

                    <DetailRow
                        icon={<Numbers fontSize="small" />}
                        label="Quantity"
                        value={formatNumber(quantity)}
                    />

                    {!compact && (
                        <DetailRow
                            icon={<CalendarMonth fontSize="small" />}
                            label="Created Date"
                            value={formatDate(createdAt)}
                        />
                    )}
                </Stack>

                {/* QUANTITY SUMMARY */}

                {!compact && (
                    <>
                        <Divider sx={{ my: 2.5 }} />

                        <Box
                            sx={{
                                p: 1.75,
                                borderRadius: 2,
                                bgcolor: "action.hover"
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Putaway Quantity
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight={700}
                                color="primary.main"
                            >
                                {formatNumber(quantity)}
                            </Typography>
                        </Box>
                    </>
                )}
            </CardContent>

            {/* CARD ACTIONS */}

            {showActions && (
                <>
                    <Divider />

                    <CardActions
                        sx={{
                            p: 1.5,
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1
                        }}
                    >
                        <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => onView?.(record)}
                            disabled={!onView}
                        >
                            View
                        </Button>

                        <Stack
                            direction="row"
                            spacing={0.5}
                        >
                            <Tooltip title="Edit putaway">
                                <span>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        aria-label="Edit putaway"
                                        onClick={() => onEdit?.(record)}
                                        disabled={!onEdit}
                                    >
                                        <Edit fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>

                            <Tooltip title="Delete putaway">
                                <span>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        aria-label="Delete putaway"
                                        onClick={() => onDelete?.(record)}
                                        disabled={!onDelete}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        </Stack>
                    </CardActions>
                </>
            )}
        </Card>
    );
};

export default ManifestPackagesPutawayCard;

