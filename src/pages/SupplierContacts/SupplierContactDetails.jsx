import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Box,
    Typography,
    Divider,
    Chip,
    Avatar,
    IconButton,
    Paper,
    Stack,
    Tooltip
} from "@mui/material";

import {
    Close,
    Edit,
    Person,
    Business,
    Email,
    Phone,
    Badge,
    Apartment,
    Star,
    Notes,
    CheckCircle,
    Cancel,
    ContactPhone
} from "@mui/icons-material";

/* =========================================================
   SAFE FIELD ACCESS
========================================================= */

const getField = (object, ...keys) => {
    for (const key of keys) {
        if (
            object?.[key] !== undefined &&
            object?.[key] !== null
        ) {
            return object[key];
        }
    }

    return "";
};

/* =========================================================
   BOOLEAN NORMALIZER
========================================================= */

const toBoolean = (value, defaultValue = false) => {
    if (value === undefined || value === null || value === "") {
        return defaultValue;
    }

    if (typeof value === "string") {
        return value.toLowerCase() === "true";
    }

    return Boolean(value);
};

/* =========================================================
   DISPLAY VALUE
========================================================= */

const displayValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "Not provided";
    }

    return value;
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    icon,
    label,
    value,
    color = "text.secondary"
}) => (
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
                color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 0.25
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
                sx={{
                    fontWeight: 500,
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap"
                }}
            >
                {displayValue(value)}
            </Typography>
        </Box>
    </Box>
);

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({ icon, title }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2
        }}
    >
        {icon}

        <Typography
            variant="subtitle1"
            fontWeight={600}
        >
            {title}
        </Typography>
    </Box>
);

/* =========================================================
   SUPPLIER CONTACT DETAILS
========================================================= */

const SupplierContactDetails = ({
    open = false,
    onClose,
    supplierContact = null,
    selectedSupplierContact = null,
    contact = null,
    onEdit
}) => {
    const details =
        selectedSupplierContact ??
        supplierContact ??
        contact;

    if (!details) {
        return (
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Supplier Contact Details
                </DialogTitle>

                <DialogContent>
                    <Typography color="text.secondary">
                        No supplier contact has been selected.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    /* =====================================================
       CONTACT FIELDS
    ===================================================== */

    const contactId = getField(
        details,
        "SupplierContactId",
        "supplierContactId",
        "ContactId",
        "contactId",
        "Id",
        "id"
    );

    const contactName = getField(
        details,
        "ContactName",
        "contactName",
        "Name",
        "name"
    );

    const supplierName = getField(
        details,
        "SupplierName",
        "supplierName"
    );

    const designation = getField(
        details,
        "Designation",
        "designation"
    );

    const department = getField(
        details,
        "Department",
        "department"
    );

    const email = getField(
        details,
        "Email",
        "email"
    );

    const phoneNumber = getField(
        details,
        "PhoneNumber",
        "phoneNumber",
        "Phone",
        "phone"
    );

    const alternatePhone = getField(
        details,
        "AlternatePhone",
        "alternatePhone"
    );

    const supplierId = getField(
        details,
        "SupplierId",
        "supplierId"
    );

    const isPrimary = toBoolean(
        getField(details, "IsPrimary", "isPrimary")
    );

    const isActive = toBoolean(
        getField(details, "IsActive", "isActive"),
        true
    );

    const notes = getField(
        details,
        "Notes",
        "notes"
    );

    const createdAt = getField(
        details,
        "CreatedAt",
        "createdAt",
        "CreatedDate",
        "createdDate"
    );

    const updatedAt = getField(
        details,
        "UpdatedAt",
        "updatedAt",
        "UpdatedDate",
        "updatedDate"
    );

    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (value) => {
        if (!value) {
            return "Not provided";
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

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 3
                }
            }}
        >
            {/* DIALOG HEADER */}
            <DialogTitle sx={{ pb: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            minWidth: 0
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 52,
                                height: 52,
                                bgcolor: "primary.main"
                            }}
                        >
                            <Person fontSize="large" />
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {contactName || "Supplier Contact"}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {displayValue(designation)}
                            </Typography>

                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ mt: 1 }}
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
                                />

                                {isPrimary && (
                                    <Chip
                                        size="small"
                                        label="Primary Contact"
                                        color="primary"
                                        icon={<Star />}
                                    />
                                )}
                            </Stack>
                        </Box>
                    </Box>

                    <Tooltip title="Close">
                        <IconButton
                            onClick={onClose}
                            aria-label="Close contact details"
                        >
                            <Close />
                        </IconButton>
                    </Tooltip>
                </Box>
            </DialogTitle>

            <Divider />

            {/* DETAILS CONTENT */}
            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Grid container spacing={2.5}>
                    {/* CONTACT INFORMATION */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2.5,
                                height: "100%",
                                borderRadius: 2
                            }}
                        >
                            <SectionHeader
                                icon={<ContactPhone color="primary" />}
                                title="Contact Information"
                            />

                            <Stack spacing={2.5}>
                                <DetailItem
                                    icon={<Person fontSize="small" />}
                                    label="Contact Name"
                                    value={contactName}
                                />

                                <DetailItem
                                    icon={<Badge fontSize="small" />}
                                    label="Designation"
                                    value={designation}
                                />

                                <DetailItem
                                    icon={<Apartment fontSize="small" />}
                                    label="Department"
                                    value={department}
                                />

                                <DetailItem
                                    icon={<Email fontSize="small" />}
                                    label="Email Address"
                                    value={email}
                                />

                                <DetailItem
                                    icon={<Phone fontSize="small" />}
                                    label="Phone Number"
                                    value={phoneNumber}
                                />

                                <DetailItem
                                    icon={<Phone fontSize="small" />}
                                    label="Alternate Phone"
                                    value={alternatePhone}
                                />
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* SUPPLIER INFORMATION */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2.5,
                                height: "100%",
                                borderRadius: 2
                            }}
                        >
                            <SectionHeader
                                icon={<Business color="primary" />}
                                title="Supplier Information"
                            />

                            <Stack spacing={2.5}>
                                <DetailItem
                                    icon={<Business fontSize="small" />}
                                    label="Supplier Name"
                                    value={supplierName}
                                />

                                <DetailItem
                                    icon={<Badge fontSize="small" />}
                                    label="Supplier ID"
                                    value={supplierId}
                                />

                                <DetailItem
                                    icon={<Badge fontSize="small" />}
                                    label="Contact ID"
                                    value={contactId}
                                />

                                <DetailItem
                                    icon={<Star fontSize="small" />}
                                    label="Primary Contact"
                                    value={isPrimary ? "Yes" : "No"}
                                />

                                <DetailItem
                                    icon={<CheckCircle fontSize="small" />}
                                    label="Contact Status"
                                    value={isActive ? "Active" : "Inactive"}
                                />
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* NOTES */}
                    <Grid item xs={12}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2.5,
                                borderRadius: 2
                            }}
                        >
                            <SectionHeader
                                icon={<Notes color="primary" />}
                                title="Additional Notes"
                            />

                            <Typography
                                variant="body2"
                                color={
                                    notes
                                        ? "text.primary"
                                        : "text.secondary"
                                }
                                sx={{ whiteSpace: "pre-wrap" }}
                            >
                                {displayValue(notes)}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* AUDIT INFORMATION */}
                    <Grid item xs={12}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2.5,
                                borderRadius: 2
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                fontWeight={600}
                                sx={{ mb: 2 }}
                            >
                                Record Information
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        icon={<CheckCircle fontSize="small" />}
                                        label="Created At"
                                        value={formatDate(createdAt)}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        icon={<Edit fontSize="small" />}
                                        label="Last Updated"
                                        value={formatDate(updatedAt)}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider />

            {/* DIALOG ACTIONS */}
            <DialogActions
                sx={{
                    p: 2.5,
                    gap: 1
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Close
                </Button>

                {onEdit && (
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => onEdit(details)}
                    >
                        Edit Contact
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default SupplierContactDetails;

