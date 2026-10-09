import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box,
    Avatar,
    Divider,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    DeleteForever,
    WarningAmber,
    Person,
    Email,
    Phone,
    Business
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
   Supports camelCase and PascalCase API responses
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
   DELETE SUPPLIER CONTACT DIALOG
========================================================= */

const DeleteSupplierContactDialog = ({
    open = false,
    onClose,
    onConfirm,
    onDelete,
    supplierContact = null,
    selectedSupplierContact = null,
    contact = null,
    loading = false,
    error = "",
    title = "Delete Supplier Contact"
}) => {
    const contactData =
        supplierContact ||
        selectedSupplierContact ||
        contact ||
        {};

    /* =====================================================
       CONTACT DETAILS
    ===================================================== */

    const contactName = formatText(
        getField(
            contactData,
            "contactName",
            "ContactName",
            "name",
            "Name"
        ),
        "Unnamed Contact"
    );

    const supplierName = formatText(
        getField(
            contactData,
            "supplierName",
            "SupplierName",
            "companyName",
            "CompanyName"
        ),
        "Unknown Supplier"
    );

    const email = getField(
        contactData,
        "email",
        "Email"
    );

    const phoneNumber = getField(
        contactData,
        "phoneNumber",
        "PhoneNumber",
        "phone",
        "Phone",
        "contactNumber",
        "ContactNumber"
    );

    /* =====================================================
       CLOSE DIALOG
    ===================================================== */

    const handleClose = () => {
        if (loading) return;

        if (onClose) {
            onClose();
        }
    };

    /* =====================================================
       CONFIRM DELETE
    ===================================================== */

    const handleConfirm = () => {
        if (loading) return;

        const callback = onConfirm || onDelete;

        if (callback) {
            callback(contactData);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="delete-supplier-contact-title"
        >
            {/* DIALOG TITLE */}

            <DialogTitle
                id="delete-supplier-contact-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    pb: 2
                }}
            >
                <Avatar
                    sx={{
                        bgcolor: "error.light",
                        color: "error.dark"
                    }}
                >
                    <DeleteForever />
                </Avatar>

                <Box>
                    <Typography
                        variant="h6"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Confirm contact deletion
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider />

            {/* DIALOG CONTENT */}

            <DialogContent sx={{ pt: 3 }}>
                <Alert
                    severity="warning"
                    icon={<WarningAmber />}
                    sx={{ mb: 2.5 }}
                >
                    This action may permanently remove this
                    supplier contact. Please verify the details
                    before continuing.
                </Alert>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2.5 }}
                    >
                        {error}
                    </Alert>
                )}

                <DialogContentText sx={{ mb: 2 }}>
                    Are you sure you want to delete this
                    supplier contact?
                </DialogContentText>

                {/* CONTACT DETAILS CARD */}

                <Box
                    sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        bgcolor: "background.paper"
                    }}
                >
                    {/* CONTACT NAME */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 2
                        }}
                    >
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                                width: 44,
                                height: 44
                            }}
                        >
                            <Person />
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {contactName}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Supplier Contact
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    {/* SUPPLIER */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                            mb: 1.5
                        }}
                    >
                        <Business
                            fontSize="small"
                            color="action"
                            sx={{ mt: 0.3 }}
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
                            gap: 1.5,
                            mb: 1.5
                        }}
                    >
                        <Email
                            fontSize="small"
                            color="action"
                            sx={{ mt: 0.3 }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Email
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {formatText(email)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* PHONE */}

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5
                        }}
                    >
                        <Phone
                            fontSize="small"
                            color="action"
                            sx={{ mt: 0.3 }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Phone Number
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {formatText(phoneNumber)}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "block",
                        mt: 2
                    }}
                >
                    Related records or references may affect
                    whether the server allows this contact to
                    be deleted.
                </Typography>
            </DialogContent>

            <Divider />

            {/* DIALOG ACTIONS */}

            <DialogActions
                sx={{
                    p: 2.5,
                    gap: 1,
                    flexWrap: "wrap"
                }}
            >
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        loading ? (
                            <CircularProgress
                                size={18}
                                color="inherit"
                            />
                        ) : (
                            <DeleteForever />
                        )
                    }
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading
                        ? "Deleting..."
                        : "Delete Contact"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteSupplierContactDialog;

