// =========================================================
// GatepassTable.jsx
// =========================================================

import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Typography,
    Box,
    Chip,
    CircularProgress
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    LocalShipping
} from "@mui/icons-material";

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
// GET GATEPASS ID
// =========================================================

const getGatepassId = (gatepass) => {
    return getField(
        gatepass,
        "gatepassId",
        "GatepassId",
        "gatePassId",
        "GatePassId",
        "id",
        "Id"
    );
};

// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

// =========================================================
// STATUS CHIP
// =========================================================

const GatepassStatusChip = ({ status }) => {
    const normalizedStatus = String(status || "")
        .trim()
        .toLowerCase();

    let color = "default";
    let label = status || "Unknown";

    switch (normalizedStatus) {
        case "pending":
            color = "warning";
            break;

        case "approved":
        case "authorized":
        case "authorised":
            color = "info";
            break;

        case "completed":
        case "closed":
            color = "success";
            break;

        case "rejected":
        case "cancelled":
        case "canceled":
            color = "error";
            break;

        default:
            color = "default";
    }

    return (
        <Chip
            label={label}
            color={color}
            size="small"
            variant="outlined"
        />
    );
};

// =========================================================
// GATEPASS TABLE
// =========================================================

const GatepassTable = ({
    gatepasses = [],
    data,
    loading = false,
    onView,
    onEdit,
    onDelete
}) => {

    // =====================================================
    // NORMALIZE DATA
    // =====================================================

    const records = Array.isArray(gatepasses)
        ? gatepasses
        : Array.isArray(data)
            ? data
            : [];

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
                width: "100%",
                borderRadius: 2,
                overflowX: "auto"
            }}
        >
            <Table
                stickyHeader
                size="medium"
                aria-label="Gatepass records table"
            >
                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography fontWeight={700}>
                                Gatepass Code
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                Date
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                Vehicle Number
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                Driver Name
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                Purpose
                            </Typography>
                        </TableCell>

                        <TableCell>
                            <Typography fontWeight={700}>
                                Status
                            </Typography>
                        </TableCell>

                        <TableCell align="center">
                            <Typography fontWeight={700}>
                                Actions
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>

                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <CircularProgress size={32} />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    Loading gatepasses...
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : records.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={7}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <LocalShipping
                                    sx={{
                                        fontSize: 44,
                                        color: "text.disabled",
                                        mb: 1
                                    }}
                                />

                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                >
                                    No Gatepasses Found
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    No gatepass records are available.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        records.map((gatepass, index) => {
                            const id = getGatepassId(gatepass);

                            const code = getField(
                                gatepass,
                                "gatepassCode",
                                "GatepassCode",
                                "gatepassNumber",
                                "GatepassNumber",
                                "gatePassCode",
                                "GatePassCode"
                            );

                            const date = getField(
                                gatepass,
                                "gatepassDate",
                                "GatepassDate",
                                "gatePassDate",
                                "GatePassDate",
                                "date",
                                "Date"
                            );

                            const vehicleNumber = getField(
                                gatepass,
                                "vehicleNumber",
                                "VehicleNumber",
                                "vehicleNo",
                                "VehicleNo"
                            );

                            const driverName = getField(
                                gatepass,
                                "driverName",
                                "DriverName"
                            );

                            const purpose = getField(
                                gatepass,
                                "purpose",
                                "Purpose",
                                "remarks",
                                "Remarks"
                            );

                            const status = getField(
                                gatepass,
                                "status",
                                "Status",
                                "gatepassStatus",
                                "GatepassStatus"
                            );

                            return (
                                <TableRow
                                    key={id !== "" ? id : index}
                                    hover
                                >
                                    {/* GATEPASS CODE */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {code || "—"}
                                        </Typography>

                                        {id !== "" && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                ID: {id}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    {/* DATE */}

                                    <TableCell>
                                        {formatDate(date)}
                                    </TableCell>

                                    {/* VEHICLE NUMBER */}

                                    <TableCell>
                                        {vehicleNumber || "—"}
                                    </TableCell>

                                    {/* DRIVER NAME */}

                                    <TableCell>
                                        {driverName || "—"}
                                    </TableCell>

                                    {/* PURPOSE */}

                                    <TableCell
                                        sx={{
                                            maxWidth: 220,
                                            whiteSpace: "normal",
                                            overflowWrap: "anywhere"
                                        }}
                                    >
                                        {purpose || "—"}
                                    </TableCell>

                                    {/* STATUS */}

                                    <TableCell>
                                        <GatepassStatusChip
                                            status={status}
                                        />
                                    </TableCell>

                                    {/* ACTIONS */}

                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: 0.5
                                            }}
                                        >
                                         
<Tooltip title="Delete gatepass">
    <IconButton
        size="small"
        color="error"
        aria-label="Delete gatepass"
        disabled={id === ""}
        onClick={(event) => {
            event.stopPropagation();

            console.log("DELETE BUTTON CLICKED");
            console.log("Selected Gatepass:", gatepass);
            console.log("Gatepass ID:", id);

            if (typeof onDelete === "function") {
                onDelete(gatepass);
            } else {
                console.error("onDelete prop is not a function.");
            }
        }}
    >
        <Delete fontSize="small" />
    </IconButton>
</Tooltip>

                                            <Tooltip title="Edit gatepass">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label="Edit gatepass"
                                                    disabled={id === ""}
                                                    onClick={() => {
                                                        if (typeof onEdit === "function") {
                                                            onEdit(gatepass);
                                                        }
                                                    }}
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete gatepass">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label="Delete gatepass"
                                                    disabled={id === ""}
                                                    onClick={() => {
                                                        if (typeof onDelete === "function") {
                                                            onDelete(gatepass);
                                                        }
                                                    }}
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default GatepassTable;

