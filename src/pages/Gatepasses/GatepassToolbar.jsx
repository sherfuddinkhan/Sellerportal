// =========================================================
// GatepassToolbar.jsx
// =========================================================

import React from "react";

import {
    Box,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Stack
} from "@mui/material";

import {
    Add,
    Refresh,
    FileDownload,
    LocalShipping
} from "@mui/icons-material";

// =========================================================
// CSV VALUE FORMATTER
// =========================================================

const escapeCsvValue = (value) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
};

// =========================================================
// GET FIELD VALUE
// Supports camelCase and PascalCase.
// =========================================================

const getField = (record, ...keys) => {
    for (const key of keys) {
        if (
            record?.[key] !== undefined &&
            record?.[key] !== null
        ) {
            return record[key];
        }
    }

    return "";
};

// =========================================================
// GATEPASS TOOLBAR
// =========================================================

const GatepassToolbar = ({
    gatepasses = [],
    data,
    totalCount,
    loading = false,
    onCreate,
    onRefresh,
    title = "Gatepass Management",
    subtitle = "Manage vehicle movements and gatepass records"
}) => {

    // =====================================================
    // NORMALIZE RECORDS
    // =====================================================

    const records = Array.isArray(gatepasses)
        ? gatepasses
        : Array.isArray(data)
            ? data
            : [];

    const displayCount =
        totalCount !== undefined && totalCount !== null
            ? totalCount
            : records.length;

    // =====================================================
    // EXPORT CSV
    // =====================================================

    const handleExport = () => {
        const headers = [
            "Gatepass ID",
            "Gatepass Code",
            "Gatepass Date",
            "Vehicle Number",
            "Driver Name",
            "Driver Phone",
            "Purpose",
            "Status",
            "Remarks"
        ];

        const rows = records.map((record) => [
            getField(
                record,
                "gatepassId",
                "GatepassId",
                "gatePassId",
                "GatePassId",
                "id",
                "Id"
            ),
            getField(
                record,
                "gatepassCode",
                "GatepassCode",
                "gatepassNumber",
                "GatepassNumber",
                "gatePassCode",
                "GatePassCode"
            ),
            getField(
                record,
                "gatepassDate",
                "GatepassDate",
                "gatePassDate",
                "GatePassDate",
                "date",
                "Date"
            ),
            getField(
                record,
                "vehicleNumber",
                "VehicleNumber",
                "vehicleNo",
                "VehicleNo"
            ),
            getField(record, "driverName", "DriverName"),
            getField(
                record,
                "driverPhone",
                "DriverPhone",
                "driverMobile",
                "DriverMobile"
            ),
            getField(record, "purpose", "Purpose"),
            getField(
                record,
                "status",
                "Status",
                "gatepassStatus",
                "GatepassStatus"
            ),
            getField(record, "remarks", "Remarks")
        ]);

        const csvContent = [
            headers.map(escapeCsvValue).join(","),
            ...rows.map((row) =>
                row.map(escapeCsvValue).join(",")
            )
        ].join("\r\n");

        // Add a BOM for compatibility with Excel and UTF-8.
        const blob = new Blob(
            ["\uFEFF", csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `gatepasses_${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Box
            sx={{
                width: "100%",
                mb: 3
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={2}
            >
                {/* =================================================
                    TITLE AND COUNT
                ================================================= */}

                <Box>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                bgcolor: "primary.main",
                                color: "primary.contrastText"
                            }}
                        >
                            <LocalShipping fontSize="medium" />
                        </Box>

                        <Box>
                            <Typography
                                variant="h5"
                                component="h1"
                                fontWeight={700}
                            >
                                {title}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {subtitle}
                            </Typography>
                        </Box>
                    </Stack>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1.5 }}
                    >
                        Total gatepasses:{" "}
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 700,
                                color: "text.primary"
                            }}
                        >
                            {displayCount}
                        </Box>
                    </Typography>
                </Box>

                {/* =================================================
                    TOOLBAR ACTIONS
                ================================================= */}

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    alignItems="center"
                >
                    {/* REFRESH */}

                    <Tooltip title="Refresh gatepasses">
                        <span>
                            <IconButton
                                aria-label="Refresh gatepasses"
                                onClick={onRefresh}
                                disabled={loading || !onRefresh}
                                color="primary"
                                sx={{
                                    border: 1,
                                    borderColor: "divider",
                                    borderRadius: 2
                                }}
                            >
                                <Refresh />
                            </IconButton>
                        </span>
                    </Tooltip>

                    {/* EXPORT */}

                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FileDownload />}
                        onClick={handleExport}
                        disabled={records.length === 0}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none"
                        }}
                    >
                        Export CSV
                    </Button>

                    {/* CREATE */}

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={onCreate}
                        disabled={!onCreate}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            px: 2
                        }}
                    >
                        Create Gatepass
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default GatepassToolbar;

