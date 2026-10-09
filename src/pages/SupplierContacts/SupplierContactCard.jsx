import React from "react";

import {
    Card,
    CardContent,
    Box,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    Divider,
    Stack
} from "@mui/material";

import {
    Person,
    Business,
    Email,
    Phone,
    Work,
    Visibility,
    Edit,
    Delete,
    Star,
    StarBorder,
    CheckCircle,
    Cancel
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
   Supports camelCase and PascalCase
========================================================= */

const getField = (object, ...keys) => {
    if (!object) return "";

    for (const key of keys) {
        if (
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }
    }

    return "";
};

/* =========================================================
   FORMAT TEXT
========================================================= */

const formatText = (value, fallback = "Not provided") => {
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
   GET INITIALS
========================================================= */

const getInitials = (name) => {
    if (!name) return "SC";

    return String(name)
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
};

/* =========================================================
   SUPPLIER CONTACT CARD
========================================================= */

const SupplierContactCard = ({
    supplierContact,
    contact,
    onView,
    onEdit,
    onDelete,
    onSetPrimary,
    loading = false,
    compact = false
}) => {
    const data = supplierContact || contact || {};

    /* =====================================================
       CONTACT FIELDS
    ===================================================== */

    const contactId = getField(
        data,
        "supplierContactId",
        "SupplierContactId",
        "contactId",
        "ContactId",
        "id",
        "Id"
    );

    const contactName = formatText(
        getField(
            data,
            "contactName",
            "ContactName",
            "name",
            "Name"
        ),
        "Unnamed Contact"
    );

    const supplierName = formatText(
        getField(
            data,
            "supplierName",
            "SupplierName",
            "companyName",
            "CompanyName"
        ),
        "Supplier"
    );

    const designation = getField(
        data,
        "designation",
        "Designation"
    );

    const department = getField(
        data,
        "department",
        "Department"
    );

    const email = getField(
        data,
        "email",
        "Email"
    );

    const phoneNumber = getField(
        data,
        "phoneNumber",
        "PhoneNumber",
        "phone",
        "Phone",
        "contactNumber",
        "ContactNumber"
    );

    const alternatePhone = getField(
        data,
        "alternatePhone",
        "AlternatePhone"
    );

    const isPrimary = Boolean(
        getField(
            data,
            "isPrimary",
            "IsPrimary"
        )
    );

    const isActive = getField(
        data,
        "isActive",
        "IsActive"
    ) !== false;

    const notes = getField(
        data,
        "notes",
        "Notes"
    );

    /* =====================================================
       ACTION HANDLERS
    ===================================================== */

    const handleView = () => {
        if (onView) {
            onView(data);
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(data);
        }
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(data);
        }
    };

    const handleSetPrimary = () => {
        if (onSetPrimary) {
            onSetPrimary(data);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Card
            elevation={2}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                border: "1px solid",
                borderColor: isPrimary
                    ? "primary.main"
                    : "divider",
                transition: "all 0.2s ease",
                opacity: loading ? 0.6 : 1,
                "&:hover": {
                    boxShadow: 5,
                    transform: "translateY(-2px)"
                }
            }}
        >
            <CardContent
                sx={{
                    p: compact ? 2 : 2.5,
                    "&:last-child": {
                        pb: compact ? 2 : 2.5
                    }
                }}
            >
                {/* HEADER */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5
                    }}
                >
                    <Avatar
                        sx={{
                            width: compact ? 44 : 52,
                            height: compact ? 44 : 52,
                            bgcolor: "primary.main",
                            fontWeight: 700
                        }}
                    >
                        {getInitials(contactName)}
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{
                                overflowWrap: "anywhere",
                                lineHeight: 1.4
                            }}
                        >
                            {contactName}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                mt: 0.4,
                                overflowWrap: "anywhere"
                            }}
                        >
                            {formatText(
                                designation,
                                "No designation"
                            )}
                        </Typography>

                        {department && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {department}
                            </Typography>
                        )}
                    </Box>

                    {onSetPrimary && (
                        <Tooltip
                            title={
                                isPrimary
                                    ? "Primary contact"
                                    : "Set as primary contact"
                            }
                        >
                            <span>
                                <IconButton
                                    size="small"
                                    color={
                                        isPrimary
                                            ? "warning"
                                            : "default"
                                    }
                                    onClick={handleSetPrimary}
                                    disabled={
                                        loading || isPrimary
                                    }
                                    aria-label="Set primary contact"
                                >
                                    {isPrimary ? (
                                        <Star />
                                    ) : (
                                        <StarBorder />
                                    )}
                                </IconButton>
                            </span>
                        </Tooltip>
                    )}
                </Box>

                {/* BADGES */}

                <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    flexWrap="wrap"
                    sx={{ mt: 2 }}
                >
                    <Chip
                        size="small"
                        label={
                            isActive
                                ? "Active"
                                : "Inactive"
                        }
                        color={
                            isActive
                                ? "success"
                                : "default"
                        }
                        icon={
                            isActive
                                ? <CheckCircle />
                                : <Cancel />
                        }
                        variant="outlined"
                    />

                    {isPrimary && (
                        <Chip
                            size="small"
                            label="Primary"
                            color="warning"
                            icon={<Star />}
                            variant="outlined"
                        />
                    )}
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* SUPPLIER */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.2,
                        mb: 1.5
                    }}
                >
                    <Business
                        fontSize="small"
                        color="action"
                        sx={{ mt: 0.25 }}
                    />

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Supplier
                        </Typography>

                        <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {supplierName}
                        </Typography>
                    </Box>
                </Box>

                {/* EMAIL */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.2,
                        mb: 1.5
                    }}
                >
                    <Email
                        fontSize="small"
                        color="action"
                        sx={{ mt: 0.25 }}
                    />

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Email
                        </Typography>

                        {email ? (
                            <Typography
                                component="a"
                                href={`mailto:${email}`}
                                variant="body2"
                                sx={{
                                    display: "block",
                                    color: "primary.main",
                                    textDecoration: "none",
                                    overflowWrap: "anywhere",
                                    "&:hover": {
                                        textDecoration: "underline"
                                    }
                                }}
                            >
                                {email}
                            </Typography>
                        ) : (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Not provided
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* PHONE */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.2,
                        mb: alternatePhone ? 1.5 : 0
                    }}
                >
                    <Phone
                        fontSize="small"
                        color="action"
                        sx={{ mt: 0.25 }}
                    />

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Phone
                        </Typography>

                        {phoneNumber ? (
                            <Typography
                                component="a"
                                href={`tel:${phoneNumber}`}
                                variant="body2"
                                sx={{
                                    display: "block",
                                    color: "primary.main",
                                    textDecoration: "none",
                                    overflowWrap: "anywhere",
                                    "&:hover": {
                                        textDecoration: "underline"
                                    }
                                }}
                            >
                                {phoneNumber}
                            </Typography>
                        ) : (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Not provided
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* ALTERNATE PHONE */}

                {alternatePhone && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.2,
                            mt: 1.5
                        }}
                    >
                        <Phone
                            fontSize="small"
                            color="action"
                            sx={{ mt: 0.25 }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Alternate Phone
                            </Typography>

                            <Typography
                                component="a"
                                href={`tel:${alternatePhone}`}
                                variant="body2"
                                sx={{
                                    display: "block",
                                    color: "primary.main",
                                    textDecoration: "none",
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {alternatePhone}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* NOTES */}

                {!compact && notes && (
                    <Box sx={{ mt: 2 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Notes
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 0.4,
                                whiteSpace: "pre-wrap",
                                overflowWrap: "anywhere"
                            }}
                        >
                            {notes}
                        </Typography>
                    </Box>
                )}

                {/* ACTIONS */}

                {(onView || onEdit || onDelete) && (
                    <>
                        <Divider sx={{ my: 2 }} />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: 0.5
                            }}
                        >
                            {onView && (
                                <Tooltip title="View contact">
                                    <span>
                                        <IconButton
                                            size="small"
                                            color="info"
                                            onClick={handleView}
                                            disabled={loading}
                                            aria-label="View contact"
                                        >
                                            <Visibility />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            )}

                            {onEdit && (
                                <Tooltip title="Edit contact">
                                    <span>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={handleEdit}
                                            disabled={loading}
                                            aria-label="Edit contact"
                                        >
                                            <Edit />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            )}

                            {onDelete && (
                                <Tooltip title="Delete contact">
                                    <span>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={handleDelete}
                                            disabled={loading}
                                            aria-label="Delete contact"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            )}
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default SupplierContactCard;

