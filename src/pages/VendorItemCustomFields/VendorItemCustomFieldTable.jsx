import React from "react";

import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TuneIcon from "@mui/icons-material/Tune";

/* =========================================================
   FIELD VALUE HELPER
========================================================= */

const getFieldValue = (object, ...keys) => {
    for (const key of keys) {
        if (
            object?.[key] !== undefined &&
            object?.[key] !== null
        ) {
            return object[key];
        }
    }

    return null;
};

/* =========================================================
   RECORD ID
========================================================= */

const getRecordId = (field) => {
    return getFieldValue(
        field,
        "vendorItemCustomFieldId",
        "VendorItemCustomFieldId",
        "id",
        "Id"
    );
};

/* =========================================================
   BOOLEAN HELPER
========================================================= */

const isTrue = (value) => {
    return (
        value === true ||
        value === 1 ||
        String(value).toLowerCase() === "true"
    );
};

/* =========================================================
   VENDOR ITEM CUSTOM FIELD TABLE
========================================================= */

const VendorItemCustomFieldTable = ({
    vendorItemCustomFields,
    customFields,
    fields,
    loading = false,
    onView,
    onEdit,
    onDelete,
    onToggleStatus,
    onViewField,
    onEditField,
    onDeleteField,
    onToggleFieldStatus
}) => {
    const records =
        vendorItemCustomFields ??
        customFields ??
        fields ??
        [];

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleView = (event, field) => {
        event.preventDefault();
        event.stopPropagation();

        const handler = onView || onViewField;

        if (typeof handler === "function") {
            handler(field);
        }
    };

    const handleEdit = (event, field) => {
        event.preventDefault();
        event.stopPropagation();

        const handler = onEdit || onEditField;

        if (typeof handler === "function") {
            handler(field);
        }
    };

    const handleDelete = (event, field) => {
        event.preventDefault();
        event.stopPropagation();

        console.log("Vendor custom field Delete icon clicked:", field);
        console.log("Vendor custom field ID:", getRecordId(field));

        const handler = onDelete || onDeleteField;

        if (typeof handler !== "function") {
            console.error(
                "Delete handler is missing. Check the onDelete prop in VendorItemCustomFieldsList."
            );
            return;
        }

        handler(field);
    };

    const handleToggleStatus = (event, field) => {
        event.preventDefault();
        event.stopPropagation();

        const handler = onToggleStatus || onToggleFieldStatus;

        if (typeof handler === "function") {
            handler(field);
        }
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2
                }}
            >
                <CircularProgress size={28} />

                <Typography variant="body2" color="text.secondary">
                    Loading custom fields...
                </Typography>
            </Paper>
        );
    }

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (!Array.isArray(records) || records.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <Inventory2Icon
                    sx={{
                        fontSize: 44,
                        color: "text.secondary",
                        mb: 1
                    }}
                />

                <Typography variant="h6" fontWeight={600}>
                    No custom fields found
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    Create a vendor item custom field to see it here.
                </Typography>
            </Paper>
        );
    }

    /* =====================================================
       TABLE
    ===================================================== */

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                width: "100%",
                overflowX: "auto"
            }}
        >
            <Table size="small" sx={{ minWidth: 1000 }}>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: "action.hover",
                            "& th": {
                                fontWeight: 700,
                                whiteSpace: "nowrap"
                            }
                        }}
                    >
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Vendor Item Master ID</TableCell>
                        <TableCell>Seller ID</TableCell>
                        <TableCell>Customer ID</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {records.map((field, index) => {
                        const id = getRecordId(field);

                        const name = getFieldValue(
                            field,
                            "name",
                            "Name",
                            "fieldName",
                            "FieldName",
                            "fieldLabel",
                            "FieldLabel"
                        );

                        const value = getFieldValue(
                            field,
                            "value",
                            "Value",
                            "fieldValue",
                            "FieldValue"
                        );

                        const vendorItemMasterId = getFieldValue(
                            field,
                            "vendorItemMasterId",
                            "VendorItemMasterId"
                        );

                        const sellerId = getFieldValue(
                            field,
                            "sellerId",
                            "SellerId"
                        );

                        const customerId = getFieldValue(
                            field,
                            "customerId",
                            "CustomerId"
                        );

                        const required = isTrue(
                            getFieldValue(
                                field,
                                "isRequired",
                                "IsRequired"
                            )
                        );

                        const activeValue = getFieldValue(
                            field,
                            "isActive",
                            "IsActive",
                            "enabled",
                            "Enabled"
                        );

                        const hasStatus =
                            activeValue !== null &&
                            activeValue !== undefined;

                        const active = isTrue(activeValue);

                        return (
                            <TableRow
                                key={id ?? `custom-field-${index}`}
                                hover
                                sx={{
                                    "&:last-child td": {
                                        borderBottom: 0
                                    }
                                }}
                            >
                                <TableCell>
                                    {id ?? "—"}
                                </TableCell>

                                <TableCell>
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                    >
                                        <TuneIcon
                                            fontSize="small"
                                            color="action"
                                        />

                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                        >
                                            {name ?? "—"}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            maxWidth: 220,
                                            overflowWrap: "anywhere"
                                        }}
                                    >
                                        {value ?? "—"}
                                    </Typography>
                                </TableCell>

                                <TableCell>
                                    {vendorItemMasterId ?? "—"}
                                </TableCell>

                                <TableCell>
                                    {sellerId ?? "—"}
                                </TableCell>

                                <TableCell>
                                    {customerId ?? "—"}
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        size="small"
                                        label={required ? "Required" : "Optional"}
                                        color={required ? "primary" : "default"}
                                        variant={required ? "filled" : "outlined"}
                                    />
                                </TableCell>

                                <TableCell>
                                    {hasStatus ? (
                                        <Chip
                                            size="small"
                                            label={active ? "Active" : "Inactive"}
                                            color={active ? "success" : "default"}
                                            variant={active ? "filled" : "outlined"}
                                        />
                                    ) : (
                                        <Chip
                                            size="small"
                                            label="Not configured"
                                            variant="outlined"
                                        />
                                    )}
                                </TableCell>

                                <TableCell align="center">
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        gap={0.25}
                                    >
                                        {(onView || onViewField) && (
                                            <Tooltip title="View custom field">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label="View custom field"
                                                    onClick={(event) =>
                                                        handleView(event, field)
                                                    }
                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {(onEdit || onEditField) && (
                                            <Tooltip title="Edit custom field">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    aria-label="Edit custom field"
                                                    onClick={(event) =>
                                                        handleEdit(event, field)
                                                    }
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {(onDelete || onDeleteField) && (
                                            <Tooltip title="Delete custom field">
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    aria-label="Delete custom field"
                                                    onClick={(event) =>
                                                        handleDelete(event, field)
                                                    }
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        {(onToggleStatus || onToggleFieldStatus) && (
                                            <Tooltip
                                                title={
                                                    active
                                                        ? "Deactivate custom field"
                                                        : "Activate custom field"
                                                }
                                            >
                                                <IconButton
                                                    size="small"
                                                    color={active ? "success" : "default"}
                                                    aria-label="Toggle custom field status"
                                                    onClick={(event) =>
                                                        handleToggleStatus(event, field)
                                                    }
                                                >
                                                    <TuneIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <Alert
                severity="info"
                variant="outlined"
                sx={{
                    m: 1,
                    display: "none"
                }}
            >
                Custom fields loaded.
            </Alert>
        </TableContainer>
    );
};

export default VendorItemCustomFieldTable;
