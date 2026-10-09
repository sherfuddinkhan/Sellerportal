import React from "react";

import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Stack,
    Divider,
    CircularProgress,
    Button
} from "@mui/material";

import {
    Inventory2,
    Visibility,
    Edit,
    Delete,
    LocationOn,
    CalendarMonth,
    Numbers,
    Inbox
} from "@mui/icons-material";

/* =========================================================
   FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    return number.toLocaleString("en-IN", {
        maximumFractionDigits: 2
    });
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, ...fields) => {
    for (const field of fields) {
        const value = record?.[field];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return null;
};

/* =========================================================
   GET STATUS COLOR
========================================================= */

const getStatusColor = (status) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase();

    if (
        normalizedStatus.includes("complete") ||
        normalizedStatus.includes("done")
    ) {
        return "success";
    }

    if (
        normalizedStatus.includes("pending") ||
        normalizedStatus.includes("waiting")
    ) {
        return "warning";
    }

    if (
        normalizedStatus.includes("progress") ||
        normalizedStatus.includes("process")
    ) {
        return "info";
    }

    if (
        normalizedStatus.includes("cancel") ||
        normalizedStatus.includes("fail")
    ) {
        return "error";
    }

    if (normalizedStatus.includes("putaway")) {
        return "primary";
    }

    return "default";
};

/* =========================================================
   PUTAWAY LIST ITEM
========================================================= */

const PutawayListItem = ({
    record,
    index,
    onView,
    onEdit,
    onDelete
}) => {
    const id = getFieldValue(
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

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 5
                }
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                {/* CARD HEADER */}

                <Stack
                    direction="row"
                    alignItems="flex-start"
                    spacing={1.5}
                >
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "primary.light",
                            color: "primary.dark",
                            flexShrink: 0
                        }}
                    >
                        <Inventory2 />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            Putaway #{id ?? index + 1}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Manifest: {manifestId ?? "-"}
                        </Typography>
                    </Box>

                    <Chip
                        label={status || "Unknown"}
                        color={getStatusColor(status)}
                        size="small"
                        variant="outlined"
                        sx={{
                            fontWeight: 600,
                            maxWidth: 125,
                            "& .MuiChip-label": {
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }
                        }}
                    />
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* PACKAGE DETAILS */}

                <Stack spacing={1.5}>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <Inventory2
                            fontSize="small"
                            color="action"
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Package ID:
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ ml: "auto !important" }}
                        >
                            {packageId ?? "-"}
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <LocationOn
                            fontSize="small"
                            color="action"
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Location:
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                                ml: "auto !important",
                                textAlign: "right",
                                overflowWrap: "anywhere"
                            }}
                        >
                            {location || "-"}
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <Numbers
                            fontSize="small"
                            color="action"
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Quantity:
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ ml: "auto !important" }}
                        >
                            {formatNumber(quantity)}
                        </Typography>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <CalendarMonth
                            fontSize="small"
                            color="action"
                        />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Created:
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{ ml: "auto !important" }}
                        >
                            {formatDate(createdAt)}
                        </Typography>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* ACTIONS */}

                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={1}
                >
                    <Tooltip title="View Details">
                        <span>
                            <IconButton
                                size="small"
                                color="info"
                                disabled={!onView}
                                onClick={() => onView?.(record)}
                                aria-label={`View putaway ${id ?? ""}`}
                            >
                                <Visibility fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Edit Record">
                        <span>
                            <IconButton
                                size="small"
                                color="primary"
                                disabled={!onEdit}
                                onClick={() => onEdit?.(record)}
                                aria-label={`Edit putaway ${id ?? ""}`}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title="Delete Record">
                        <span>
                            <IconButton
                                size="small"
                                color="error"
                                disabled={!onDelete}
                                onClick={() => onDelete?.(record)}
                                aria-label={`Delete putaway ${id ?? ""}`}
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </CardContent>
        </Card>
    );
};

/* =========================================================
   MANIFEST PACKAGES PUTAWAY LIST
========================================================= */

const ManifestPackagesPutawayList = ({
    records = [],
    loading = false,

    onView,
    onEdit,
    onDelete,

    onCreate,

    emptyMessage = "No manifest package putaway records found."
}) => {
    const safeRecords = Array.isArray(records)
        ? records
        : [];

    /* -----------------------------------------------------
       LOADING STATE
    ----------------------------------------------------- */

    if (loading && safeRecords.length === 0) {
        return (
            <Box
                sx={{
                    width: "100%",
                    py: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Loading putaway records...
                </Typography>
            </Box>
        );
    }

    /* -----------------------------------------------------
       EMPTY STATE
    ----------------------------------------------------- */

    if (safeRecords.length === 0) {
        return (
            <Box
                sx={{
                    width: "100%",
                    py: 7,
                    px: 2,
                    textAlign: "center",
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 3
                }}
            >
                <Inbox
                    sx={{
                        fontSize: 54,
                        color: "text.disabled",
                        mb: 1
                    }}
                />

                <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                >
                    No Records Found
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: onCreate ? 2 : 0 }}
                >
                    {emptyMessage}
                </Typography>

                {onCreate && (
                    <Button
                        variant="contained"
                        startIcon={<Inventory2 />}
                        onClick={onCreate}
                    >
                        Create Putaway
                    </Button>
                )}
            </Box>
        );
    }

    /* -----------------------------------------------------
       RENDER LIST
    ----------------------------------------------------- */

    return (
        <Box sx={{ width: "100%" }}>
            {/* LIST SUMMARY */}

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2, flexWrap: "wrap" }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Putaway Records
                </Typography>

                <Chip
                    label={`${safeRecords.length.toLocaleString("en-IN")} records`}
                    color="primary"
                    variant="outlined"
                    size="small"
                />
            </Stack>

            {/* CARD GRID */}

            <Grid container spacing={2.5}>
                {safeRecords.map((record, index) => {
                    const id = getFieldValue(
                        record,
                        "manifestPackagesPutawayId",
                        "ManifestPackagesPutawayId",
                        "manifestPackagePutawayId",
                        "ManifestPackagePutawayId",
                        "id",
                        "Id"
                    );

                    return (
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            lg={4}
                            key={id ?? `putaway-${index}`}
                        >
                            <PutawayListItem
                                record={record}
                                index={index}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        </Grid>
                    );
                })}
            </Grid>

            {/* LOADING OVERLAY INDICATOR */}

            {loading && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 3
                    }}
                >
                    <CircularProgress size={26} />
                </Box>
            )}
        </Box>
    );
};

export default ManifestPackagesPutawayList;

