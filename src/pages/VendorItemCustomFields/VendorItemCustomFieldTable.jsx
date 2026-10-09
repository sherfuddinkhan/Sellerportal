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
    Switch,
    CircularProgress
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Inventory2,
    Tune
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
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
   FORMAT FIELD TYPE
========================================================= */

const formatFieldType = (value) => {
    if (!value) {
        return "-";
    }

    return String(value)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

/* =========================================================
   FORMAT FIELD VALUE
========================================================= */

const formatFieldValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
        try {
            return JSON.stringify(value);
        } catch {
            return "-";
        }
    }

    return String(value);
};

/* =========================================================
   VENDOR ITEM CUSTOM FIELD TABLE
========================================================= */

const VendorItemCustomFieldTable = ({
    vendorItemCustomFields = [],
    customFields = [],
    fields = [],

    loading = false,

    onView,
    onEdit,
    onDelete,
    onToggleStatus,

    onViewField,
    onEditField,
    onDeleteField,
    onToggleFieldStatus,

    emptyMessage = "No custom fields found.",

    showVendor = true,
    showItem = true,
    showValue = true,
    showDisplayOrder = true,
    showCreatedAt = false,
    showActions = true
}) => {
    /* =====================================================
       NORMALIZE DATA
    ===================================================== */

    const rows =
        vendorItemCustomFields?.length > 0
            ? vendorItemCustomFields
            : customFields?.length > 0
                ? customFields
                : fields;

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleView = (field) => {
        const callback = onView || onViewField;

        if (callback) {
            callback(field);
        }
    };

    const handleEdit = (field) => {
        const callback = onEdit || onEditField;

        if (callback) {
            callback(field);
        }
    };

    const handleDelete = (field) => {
        const callback = onDelete || onDeleteField;

        if (callback) {
            callback(field);
        }
    };

    const handleToggleStatus = (field) => {
        const callback =
            onToggleStatus || onToggleFieldStatus;

        if (callback) {
            callback(field);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                width: "100%",
                overflowX: "auto",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2
            }}
        >
            <Table
                stickyHeader
                size="medium"
                aria-label="Vendor item custom fields table"
                sx={{
                    minWidth: 1100,

                    "& .MuiTableCell-root": {
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        py: 1.5
                    },

                    "& .MuiTableHead-root .MuiTableCell-root": {
                        backgroundColor: "background.default",
                        color: "text.secondary",
                        fontWeight: 700,
                        whiteSpace: "nowrap"
                    },

                    "& .MuiTableBody-root .MuiTableRow-root:hover": {
                        backgroundColor: "action.hover"
                    }
                }}
            >
                {/* =========================================
                    TABLE HEADER
                ========================================= */}

                <TableHead>
                    <TableRow>
                        <TableCell>
                            #
                        </TableCell>

                        <TableCell>
                            Field Name
                        </TableCell>

                        <TableCell>
                            Field Label
                        </TableCell>

                        <TableCell>
                            Field Key
                        </TableCell>

                        <TableCell>
                            Field Type
                        </TableCell>

                        {showVendor && (
                            <TableCell>
                                Vendor
                            </TableCell>
                        )}

                        {showItem && (
                            <TableCell>
                                Item
                            </TableCell>
                        )}

                        {showValue && (
                            <TableCell>
                                Field Value
                            </TableCell>
                        )}

                        <TableCell>
                            Required
                        </TableCell>

                        <TableCell>
                            Status
                        </TableCell>

                        {showDisplayOrder && (
                            <TableCell align="center">
                                Display Order
                            </TableCell>
                        )}

                        {showCreatedAt && (
                            <TableCell>
                                Created At
                            </TableCell>
                        )}

                        {showActions && (
                            <TableCell align="center">
                                Actions
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>

                {/* =========================================
                    TABLE BODY
                ========================================= */}

                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell
                                colSpan={
                                    7 +
                                    (showVendor ? 1 : 0) +
                                    (showItem ? 1 : 0) +
                                    (showValue ? 1 : 0) +
                                    (showDisplayOrder ? 1 : 0) +
                                    (showCreatedAt ? 1 : 0) +
                                    (showActions ? 1 : 0)
                                }
                                align="center"
                                sx={{ py: 6 }}
                            >
                                <CircularProgress size={30} />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    Loading custom fields...
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={
                                    7 +
                                    (showVendor ? 1 : 0) +
                                    (showItem ? 1 : 0) +
                                    (showValue ? 1 : 0) +
                                    (showDisplayOrder ? 1 : 0) +
                                    (showCreatedAt ? 1 : 0) +
                                    (showActions ? 1 : 0)
                                }
                                align="center"
                                sx={{ py: 7 }}
                            >
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    gap={1}
                                >
                                    <Inventory2
                                        sx={{
                                            fontSize: 42,
                                            color: "text.disabled"
                                        }}
                                    />

                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                    >
                                        {emptyMessage}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Custom field records will appear here.
                                    </Typography>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((field, index) => {
                            const id = getFieldValue(
                                field,
                                "vendorItemCustomFieldId",
                                "VendorItemCustomFieldId",
                                "id",
                                "Id"
                            );

                            const fieldName = getFieldValue(
                                field,
                                "fieldName",
                                "FieldName"
                            );

                            const fieldLabel = getFieldValue(
                                field,
                                "fieldLabel",
                                "FieldLabel"
                            );

                            const fieldKey = getFieldValue(
                                field,
                                "fieldKey",
                                "FieldKey"
                            );

                            const fieldType = getFieldValue(
                                field,
                                "fieldType",
                                "FieldType"
                            );

                            const vendorName = getFieldValue(
                                field,
                                "vendorName",
                                "VendorName"
                            );

                            const itemName = getFieldValue(
                                field,
                                "itemName",
                                "ItemName",
                                "productName",
                                "ProductName"
                            );

                            const fieldValue = getFieldValue(
                                field,
                                "fieldValue",
                                "FieldValue"
                            );

                            const isRequired = getFieldValue(
                                field,
                                "isRequired",
                                "IsRequired"
                            );

                            const isActive = getFieldValue(
                                field,
                                "isActive",
                                "IsActive"
                            );

                            const displayOrder = getFieldValue(
                                field,
                                "displayOrder",
                                "DisplayOrder"
                            );

                            const createdAt = getFieldValue(
                                field,
                                "createdAt",
                                "CreatedAt"
                            );

                            const active =
                                isActive === true ||
                                isActive === 1 ||
                                String(isActive).toLowerCase() === "true";

                            const required =
                                isRequired === true ||
                                isRequired === 1 ||
                                String(isRequired).toLowerCase() === "true";

                            return (
                                <TableRow
                                    key={id ?? `${fieldName}-${index}`}
                                    hover
                                >
                                    {/* ROW NUMBER */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {index + 1}
                                        </Typography>
                                    </TableCell>

                                    {/* FIELD NAME */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            sx={{
                                                minWidth: 130,
                                                overflowWrap: "anywhere"
                                            }}
                                        >
                                            {fieldName || "-"}
                                        </Typography>
                                    </TableCell>

                                    {/* FIELD LABEL */}

                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{ minWidth: 120 }}
                                        >
                                            {fieldLabel || "-"}
                                        </Typography>
                                    </TableCell>

                                    {/* FIELD KEY */}

                                    <TableCell>
                                        <Chip
                                            label={fieldKey || "-"}
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                maxWidth: 180,
                                                "& .MuiChip-label": {
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis"
                                                }
                                            }}
                                        />
                                    </TableCell>

                                    {/* FIELD TYPE */}

                                    <TableCell>
                                        <Chip
                                            icon={<Tune />}
                                            label={formatFieldType(fieldType)}
                                            size="small"
                                            variant="outlined"
                                            color="default"
                                        />
                                    </TableCell>

                                    {/* VENDOR */}

                                    {showVendor && (
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ minWidth: 120 }}
                                            >
                                                {vendorName ||
                                                    getFieldValue(
                                                        field,
                                                        "vendorId",
                                                        "VendorId"
                                                    ) ||
                                                    "-"}
                                            </Typography>
                                        </TableCell>
                                    )}

                                    {/* ITEM */}

                                    {showItem && (
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ minWidth: 120 }}
                                            >
                                                {itemName ||
                                                    getFieldValue(
                                                        field,
                                                        "itemId",
                                                        "ItemId"
                                                    ) ||
                                                    "-"}
                                            </Typography>
                                        </TableCell>
                                    )}

                                    {/* FIELD VALUE */}

                                    {showValue && (
                                        <TableCell>
                                            <Tooltip
                                                title={formatFieldValue(fieldValue)}
                                                placement="top"
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        maxWidth: 180,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap"
                                                    }}
                                                >
                                                    {formatFieldValue(fieldValue)}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                    )}

                                    {/* REQUIRED */}

                                    <TableCell>
                                        <Chip
                                            label={
                                                required
                                                    ? "Required"
                                                    : "Optional"
                                            }
                                            size="small"
                                            color={
                                                required
                                                    ? "warning"
                                                    : "default"
                                            }
                                            variant={
                                                required
                                                    ? "filled"
                                                    : "outlined"
                                            }
                                        />
                                    </TableCell>

                                    {/* STATUS */}

                                    <TableCell>
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            gap={0.5}
                                        >
                                            <Chip
                                                label={
                                                    active
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                                size="small"
                                                color={
                                                    active
                                                        ? "success"
                                                        : "default"
                                                }
                                            />

                                            {onToggleStatus ||
                                            onToggleFieldStatus ? (
                                                <Tooltip
                                                    title={
                                                        active
                                                            ? "Deactivate field"
                                                            : "Activate field"
                                                    }
                                                >
                                                    <Switch
                                                        size="small"
                                                        checked={active}
                                                        onChange={() =>
                                                            handleToggleStatus(field)
                                                        }
                                                        inputProps={{
                                                            "aria-label":
                                                                `Toggle status for ${fieldName || "custom field"}`
                                                        }}
                                                    />
                                                </Tooltip>
                                            ) : null}
                                        </Box>
                                    </TableCell>

                                    {/* DISPLAY ORDER */}

                                    {showDisplayOrder && (
                                        <TableCell align="center">
                                            <Typography variant="body2">
                                                {displayOrder ?? 0}
                                            </Typography>
                                        </TableCell>
                                    )}

                                    {/* CREATED AT */}

                                    {showCreatedAt && (
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{ whiteSpace: "nowrap" }}
                                            >
                                                {formatDate(createdAt)}
                                            </Typography>
                                        </TableCell>
                                    )}

                                    {/* ACTIONS */}

                                    {showActions && (
                                        <TableCell align="center">
                                            <Box
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                gap={0.5}
                                            >
                                                {(
                                                    onView ||
                                                    onViewField
                                                ) && (
                                                    <Tooltip title="View details">
                                                        <IconButton
                                                            size="small"
                                                            color="info"
                                                            onClick={() =>
                                                                handleView(field)
                                                            }
                                                            aria-label="View custom field"
                                                        >
                                                            <Visibility fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                {(
                                                    onEdit ||
                                                    onEditField
                                                ) && (
                                                    <Tooltip title="Edit custom field">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() =>
                                                                handleEdit(field)
                                                            }
                                                            aria-label="Edit custom field"
                                                        >
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                {(
                                                    onDelete ||
                                                    onDeleteField
                                                ) && (
                                                    <Tooltip title="Delete custom field">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() =>
                                                                handleDelete(field)
                                                            }
                                                            aria-label="Delete custom field"
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default VendorItemCustomFieldTable;

