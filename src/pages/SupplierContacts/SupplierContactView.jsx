import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Divider,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Close,
    Visibility,
    Person,
    Business,
    Email,
    Phone,
    Work,
    Badge,
    CalendarMonth,
    ToggleOn,
    ToggleOff
} from "@mui/icons-material";

/* =========================================================
   SAFE VALUE
========================================================= */

const getValue = (obj, ...keys) => {
    for (const key of keys) {
        const value = obj?.[key];

        if (value !== undefined && value !== null && value !== "") {
            return value;
        }
    }

    return null;
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) return "N/A";

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

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({ icon, label, value }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            p: 1.5,
            height: "100%",
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.paper"
        }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 38,
                height: 38,
                borderRadius: 2,
                bgcolor: "action.hover",
                color: "primary.main"
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
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap"
                }}
            >
                {value ?? "N/A"}
            </Typography>
        </Box>
    </Box>
);

/* =========================================================
   SUPPLIER CONTACT VIEW
========================================================= */

const SupplierContactView = ({
    open,
    onClose,
    supplierContact,
    selectedSupplierContact,
    onEdit
}) => {
    const contact =
        supplierContact ??
        selectedSupplierContact ??
        null;

    if (!contact) {
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
                        No supplier contact selected.
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

    const contactId = getValue(
        contact,
        "supplierContactId",
        "SupplierContactId",
        "id",
        "Id"
    );

    const supplierId = getValue(
        contact,
        "supplierId",
        "SupplierId"
    );

    const supplierName = getValue(
        contact,
        "supplierName",
        "SupplierName"
    );

    const contactName = getValue(
        contact,
        "contactName",
        "ContactName",
        "name",
        "Name"
    );

    const designation = getValue(
        contact,
        "designation",
        "Designation",
        "jobTitle",
        "JobTitle",
        "position",
        "Position"
    );

    const department = getValue(
        contact,
        "department",
        "Department"
    );

    const email = getValue(
        contact,
        "email",
        "Email",
        "emailAddress",
        "EmailAddress"
    );

    const phoneNumber = getValue(
        contact,
        "phoneNumber",
        "PhoneNumber",
        "phone",
        "Phone",
        "mobileNumber",
        "MobileNumber"
    );

    const alternatePhone = getValue(
        contact,
        "alternatePhone",
        "AlternatePhone",
        "alternatePhoneNumber",
        "AlternatePhoneNumber"
    );

    const isPrimary = getValue(
        contact,
        "isPrimary",
        "IsPrimary"
    );

    const isActive = getValue(
        contact,
        "isActive",
        "IsActive"
    );

    const notes = getValue(
        contact,
        "notes",
        "Notes",
        "remarks",
        "Remarks"
    );

    const createdAt = getValue(
        contact,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    );

    const updatedAt = getValue(
        contact,
        "updatedAt",
        "UpdatedAt",
        "modifiedDate",
        "ModifiedDate"
    );

    /* =====================================================
       STATUS
    ===================================================== */

    const activeStatus =
        isActive === undefined || isActive === null
            ? null
            : isActive === true ||
              isActive === 1 ||
              String(isActive).toLowerCase() === "true" ||
              String(isActive).toLowerCase() === "active";

    const primaryStatus =
        isPrimary === true ||
        isPrimary === 1 ||
        String(isPrimary).toLowerCase() === "true";

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            aria-labelledby="supplier-contact-view-title"
        >
            <DialogTitle
                id="supplier-contact-view-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pr: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: "primary.main",
                        color: "primary.contrastText"
                    }}
                >
                    <Visibility />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700}>
                        Supplier Contact Details
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View contact information and status.
                    </Typography>
                </Box>

                <Tooltip title="Close">
                    <IconButton
                        onClick={onClose}
                        aria-label="Close supplier contact details"
                    >
                        <Close />
                    </IconButton>
                </Tooltip>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                {/* CONTACT HEADER */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: "action.hover"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 58,
                            height: 58,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            flexShrink: 0
                        }}
                    >
                        <Person sx={{ fontSize: 32 }} />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {contactName || "Unnamed Contact"}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {designation || "Supplier Contact"}
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                mt: 1
                            }}
                        >
                            {primaryStatus && (
                                <Chip
                                    label="Primary Contact"
                                    color="primary"
                                    size="small"
                                />
                            )}

                            {activeStatus !== null && (
                                <Chip
                                    label={activeStatus ? "Active" : "Inactive"}
                                    color={activeStatus ? "success" : "default"}
                                    size="small"
                                    icon={
                                        activeStatus
                                            ? <ToggleOn />
                                            : <ToggleOff />
                                    }
                                />
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* CONTACT INFORMATION */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 1.5 }}
                >
                    Contact Information
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Badge />}
                            label="Contact ID"
                            value={contactId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Person />}
                            label="Contact Name"
                            value={contactName}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Email />}
                            label="Email Address"
                            value={email}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Phone />}
                            label="Phone Number"
                            value={phoneNumber}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Phone />}
                            label="Alternate Phone"
                            value={alternatePhone}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Work />}
                            label="Designation"
                            value={designation}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Business />}
                            label="Department"
                            value={department}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* SUPPLIER INFORMATION */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 1.5 }}
                >
                    Supplier Information
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Business />}
                            label="Supplier ID"
                            value={supplierId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Business />}
                            label="Supplier Name"
                            value={supplierName}
                        />
                    </Grid>
                </Grid>

                {/* NOTES */}

                {notes && (
                    <>
                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 1.5 }}
                        >
                            Notes / Remarks
                        </Typography>

                        <Box
                            sx={{
                                p: 2,
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 2
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{ whiteSpace: "pre-wrap" }}
                            >
                                {notes}
                            </Typography>
                        </Box>
                    </>
                )}

                {/* AUDIT INFORMATION */}

                {(createdAt || updatedAt) && (
                    <>
                        <Divider sx={{ my: 3 }} />

                        <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ mb: 1.5 }}
                        >
                            Record Information
                        </Typography>

                        <Grid container spacing={2}>
                            {createdAt && (
                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        icon={<CalendarMonth />}
                                        label="Created Date"
                                        value={formatDate(createdAt)}
                                    />
                                </Grid>
                            )}

                            {updatedAt && (
                                <Grid item xs={12} sm={6}>
                                    <DetailItem
                                        icon={<CalendarMonth />}
                                        label="Last Updated"
                                        value={formatDate(updatedAt)}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2.5, gap: 1 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                >
                    Close
                </Button>

                {typeof onEdit === "function" && (
                    <Button
                        variant="contained"
                        onClick={() => onEdit(contact)}
                    >
                        Edit Contact
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default SupplierContactView;

