
// DeleteReversePickupAddressDialog.jsx

import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Button,
    Stack,
    Divider,
    Alert,
    CircularProgress,
    IconButton,
    Chip
} from "@mui/material";

import {
    Close,
    Delete,
    WarningAmber,
    LocationOn,
    Person,
    Phone,
    Email
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (object, ...keys) => {
    if (!object || typeof object !== "object") {
        return "";
    }

    for (const key of keys) {
        const value = object[key];

        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        ) {
            return value;
        }
    }

    return "";
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({ icon, label, value }) => {
    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return null;
    }

    return (
        <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
        >
            <Box
                sx={{
                    color: "text.secondary",
                    display: "flex",
                    alignItems: "center",
                    pt: 0.25
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
                    fontWeight={500}
                    sx={{ overflowWrap: "anywhere" }}
                >
                    {value}
                </Typography>
            </Box>
        </Stack>
    );
};

/* =========================================================
   DELETE REVERSE PICKUP ADDRESS DIALOG
========================================================= */

const DeleteReversePickupAddressDialog = ({
    open = false,
    address = null,

    onClose,
    onConfirm,
    onDelete,

    loading = false,
    deleting = false,
    error = "",

    title = "Delete Reverse Pickup Address",
    confirmLabel = "Delete Address",
    cancelLabel = "Cancel",

    showAddressDetails = true,
    closeOnBackdrop = true,
    maxWidth = "sm",
    fullWidth = true
}) => {
    const [localError, setLocalError] = useState("");

    const isDeleting = loading || deleting;
    const displayError = error || localError;

    /* =====================================================
       RESET ERROR WHEN DIALOG OPENS
    ===================================================== */

    useEffect(() => {
        if (open) {
            setLocalError("");
        }
    }, [open]);

    /* =====================================================
       ADDRESS FIELDS
    ===================================================== */

    const addressId = getFieldValue(
        address,
        "reversePickupAddressId",
        "ReversePickupAddressId",
        "addressId",
        "AddressId",
        "id",
        "Id"
    );

    const contactName = getFieldValue(
        address,
        "contactName",
        "ContactName",
        "contactPerson",
        "ContactPerson",
        "name",
        "Name"
    );

    const phoneNumber = getFieldValue(
        address,
        "phoneNumber",
        "PhoneNumber",
        "phone",
        "Phone",
        "mobileNumber",
        "MobileNumber"
    );

    const email = getFieldValue(
        address,
        "email",
        "Email",
        "emailAddress",
        "EmailAddress"
    );

    const addressLine1 = getFieldValue(
        address,
        "addressLine1",
        "AddressLine1",
        "address1",
        "Address1"
    );

    const addressLine2 = getFieldValue(
        address,
        "addressLine2",
        "AddressLine2",
        "address2",
        "Address2"
    );

    const city = getFieldValue(address, "city", "City");

    const state = getFieldValue(
        address,
        "state",
        "State",
        "stateName",
        "StateName"
    );

    const postalCode = getFieldValue(
        address,
        "postalCode",
        "PostalCode",
        "zipCode",
        "ZipCode",
        "pinCode",
        "PinCode"
    );

    const country = getFieldValue(
        address,
        "country",
        "Country",
        "countryName",
        "CountryName"
    );

    const addressType = getFieldValue(
        address,
        "addressType",
        "AddressType",
        "type",
        "Type"
    );

    const fullAddress = [
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country
    ]
        .filter(
            (value) =>
                value !== undefined &&
                value !== null &&
                String(value).trim() !== ""
        )
        .join(", ");

    /* =====================================================
       CLOSE DIALOG
    ===================================================== */

    const handleClose = () => {
        if (isDeleting) {
            return;
        }

        setLocalError("");

        if (typeof onClose === "function") {
            onClose();
        }
    };

    /* =====================================================
       CONFIRM DELETE
    ===================================================== */

    const handleConfirm = async () => {
        if (isDeleting) {
            return;
        }

        if (!address) {
            setLocalError(
                "No reverse pickup address was selected for deletion."
            );
            return;
        }

        const deleteHandler =
            typeof onConfirm === "function"
                ? onConfirm
                : onDelete;

        if (typeof deleteHandler !== "function") {
            setLocalError(
                "Delete action is not configured. Please provide onConfirm or onDelete."
            );
            return;
        }

        setLocalError("");

        try {
            await deleteHandler(address);
        } catch (err) {
            setLocalError(
                err?.response?.data?.message ||
                err?.response?.data?.title ||
                err?.message ||
                "Failed to delete the reverse pickup address."
            );
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={
                closeOnBackdrop
                    ? handleClose
                    : undefined
            }
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            aria-labelledby="delete-reverse-pickup-address-title"
        >
            {/* DIALOG HEADER */}

            <DialogTitle
                id="delete-reverse-pickup-address-title"
                sx={{ pr: 7 }}
            >
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            bgcolor: "error.light",
                            color: "error.dark",
                            flexShrink: 0
                        }}
                    >
                        <Delete />
                    </Box>

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
                            Confirm before continuing.
                        </Typography>
                    </Box>
                </Stack>

                <IconButton
                    aria-label="Close dialog"
                    onClick={handleClose}
                    disabled={isDeleting}
                    size="small"
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* DIALOG CONTENT */}

            <DialogContent sx={{ pt: 3 }}>
                <Alert
                    severity="warning"
                    icon={<WarningAmber />}
                    sx={{ mb: 3 }}
                >
                    <Typography
                        variant="body2"
                        fontWeight={600}
                    >
                        Are you sure you want to delete this address?
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ mt: 0.5 }}
                    >
                        This action may not be reversible. Confirm that
                        you have selected the correct reverse pickup address.
                    </Typography>
                </Alert>

                {displayError && (
                    <Alert
                        severity="error"
                        onClose={() => setLocalError("")}
                        sx={{ mb: 3 }}
                    >
                        {displayError}
                    </Alert>
                )}

                {showAddressDetails && address && (
                    <Box
                        sx={{
                            p: 2.5,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            bgcolor: "background.paper"
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="flex-start"
                            justifyContent="space-between"
                            sx={{ mb: 2 }}
                        >
                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                                sx={{ minWidth: 0 }}
                            >
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: "action.hover",
                                        color: "primary.main",
                                        borderRadius: 2,
                                        flexShrink: 0
                                    }}
                                >
                                    <LocationOn />
                                </Box>

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                        sx={{ overflowWrap: "anywhere" }}
                                    >
                                        {contactName || "Unnamed Contact"}
                                    </Typography>

                                    {addressId !== "" && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            Address ID: {addressId}
                                        </Typography>
                                    )}
                                </Box>
                            </Stack>

                            {addressType && (
                                <Chip
                                    label={addressType}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={2}>
                            <DetailItem
                                icon={<Person fontSize="small" />}
                                label="Contact Person"
                                value={contactName}
                            />

                            <DetailItem
                                icon={<Phone fontSize="small" />}
                                label="Phone Number"
                                value={phoneNumber}
                            />

                            <DetailItem
                                icon={<Email fontSize="small" />}
                                label="Email Address"
                                value={email}
                            />

                            <DetailItem
                                icon={<LocationOn fontSize="small" />}
                                label="Full Address"
                                value={fullAddress}
                            />
                        </Stack>
                    </Box>
                )}
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
                    disabled={isDeleting}
                >
                    {cancelLabel}
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={
                        isDeleting
                            ? <CircularProgress
                                size={18}
                                color="inherit"
                            />
                            : <Delete />
                    }
                    onClick={handleConfirm}
                    disabled={isDeleting || !address}
                >
                    {isDeleting ? "Deleting..." : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteReversePickupAddressDialog;

