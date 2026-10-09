import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Stack
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    Store,
    Inventory2,
    Tune,
    DragIndicator
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (record, camelCaseKey, pascalCaseKey) => {
    return record?.[camelCaseKey] ?? record?.[pascalCaseKey] ?? "";
};

/* =========================================================
   VENDOR ITEM CUSTOM FIELD CARD
========================================================= */

const VendorItemCustomFieldCard = ({
    record = {},
    onView,
    onEdit,
    onDelete
}) => {
    const id = getFieldValue(
        record,
        "vendorItemCustomFieldId",
        "VendorItemCustomFieldId"
    ) ||
    getFieldValue(record, "id", "Id");

    const fieldName = getFieldValue(
        record,
        "fieldName",
        "FieldName"
    ) || "Unnamed Field";

    const fieldLabel = getFieldValue(
        record,
        "fieldLabel",
        "FieldLabel"
    ) || fieldName;

    const fieldKey = getFieldValue(
        record,
        "fieldKey",
        "FieldKey"
    ) || "—";

    const fieldType = getFieldValue(
        record,
        "fieldType",
        "FieldType"
    ) || "text";

    const fieldValue = getFieldValue(
        record,
        "fieldValue",
        "FieldValue"
    );

    const defaultValue = getFieldValue(
        record,
        "defaultValue",
        "DefaultValue"
    );

    const description = getFieldValue(
        record,
        "description",
        "Description"
    );

    const vendorName =
        getFieldValue(record, "vendorName", "VendorName") ||
        getFieldValue(record, "supplierName", "SupplierName") ||
        "";

    const itemName = getFieldValue(
        record,
        "itemName",
        "ItemName"
    );

    const displayOrder = getFieldValue(
        record,
        "displayOrder",
        "DisplayOrder"
    );

    const isRequired =
        getFieldValue(record, "isRequired", "IsRequired") === true;

    const isActive =
        getFieldValue(record, "isActive", "IsActive") !== false;

    const options = getFieldValue(
        record,
        "options",
        "Options"
    );

    const formattedOptions = Array.isArray(options)
        ? options.join(", ")
        : typeof options === "string"
            ? options
            : "";

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
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.2s ease",
                "&:hover": {
                    boxShadow: 5,
                    transform: "translateY(-3px)"
                }
            }}
        >
            {/* CARD HEADER */}

            <Box
                sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        minWidth: 0,
                        flex: 1
                    }}
                >
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 2,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}
                    >
                        <Tune />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{
                                overflowWrap: "anywhere"
                            }}
                        >
                            {fieldLabel}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                overflowWrap: "anywhere"
                            }}
                        >
                            {fieldName}
                        </Typography>
                    </Box>
                </Box>

                <Chip
                    label={isActive ? "Active" : "Inactive"}
                    color={isActive ? "success" : "default"}
                    size="small"
                    variant={isActive ? "filled" : "outlined"}
                />
            </Box>

            <Divider />

            {/* CARD CONTENT */}

            <CardContent
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    p: 2
                }}
            >
                {/* FIELD KEY */}

                <Box>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Field Key
                    </Typography>

                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                            overflowWrap: "anywhere"
                        }}
                    >
                        {fieldKey}
                    </Typography>
                </Box>

                {/* FIELD TYPE */}

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                >
                    <Chip
                        icon={<Tune />}
                        label={`Type: ${fieldType}`}
                        size="small"
                        variant="outlined"
                    />

                    {isRequired && (
                        <Chip
                            label="Required"
                            size="small"
                            color="warning"
                        />
                    )}

                    {displayOrder !== "" && displayOrder !== null && (
                        <Chip
                            icon={<DragIndicator />}
                            label={`Order: ${displayOrder}`}
                            size="small"
                            variant="outlined"
                        />
                    )}
                </Stack>

                {/* VENDOR */}

                {vendorName && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        <Store
                            fontSize="small"
                            color="action"
                        />

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Vendor
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {vendorName}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* ITEM */}

                {itemName && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        <Inventory2
                            fontSize="small"
                            color="action"
                        />

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Item
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {itemName}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* FIELD VALUE */}

                {fieldValue !== "" && fieldValue !== null && (
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Field Value
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {String(fieldValue)}
                        </Typography>
                    </Box>
                )}

                {/* DEFAULT VALUE */}

                {defaultValue !== "" && defaultValue !== null && (
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Default Value
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {String(defaultValue)}
                        </Typography>
                    </Box>
                )}

                {/* OPTIONS */}

                {formattedOptions && (
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Options
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {formattedOptions}
                        </Typography>
                    </Box>
                )}

                {/* DESCRIPTION */}

                {description && (
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Description
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                overflowWrap: "anywhere",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                            }}
                        >
                            {description}
                        </Typography>
                    </Box>
                )}
            </CardContent>

            <Divider />

            {/* CARD ACTIONS */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: 0.5,
                    p: 1
                }}
            >
                <Tooltip title="View Details">
                    <IconButton
                        size="small"
                        color="info"
                        aria-label="View custom field"
                        onClick={() => onView?.(record)}
                    >
                        <Visibility fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Edit Field">
                    <IconButton
                        size="small"
                        color="primary"
                        aria-label="Edit custom field"
                        onClick={() => onEdit?.(record)}
                    >
                        <Edit fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete Field">
                    <IconButton
                        size="small"
                        color="error"
                        aria-label="Delete custom field"
                        onClick={() => onDelete?.(id, record)}
                    >
                        <Delete fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Card>
    );
};

export default VendorItemCustomFieldCard;

