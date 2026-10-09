import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Box,
    Divider,
    Chip,
    Paper
} from "@mui/material";

import {
    Close,
    EditLocationAlt,
    Business,
    LocationOn,
    Person,
    Phone,
    Email,
    Language,
    AccountBalance,
    LocationCity
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (data, ...fields) => {
    for (const field of fields) {
        if (
            data?.[field] !== undefined &&
            data?.[field] !== null &&
            data[field] !== ""
        ) {
            return data[field];
        }
    }

    return "-";
};

/* =========================================================
   FORMAT STATUS
========================================================= */

const getStatus = (address) => {
    const status = getFieldValue(
        address,
        "isActive",
        "IsActive",
        "status",
        "Status"
    );

    if (typeof status === "boolean") {
        return status;
    }

    if (typeof status === "number") {
        return status === 1;
    }

    return ["active", "true", "1"].includes(
        String(status).toLowerCase()
    );
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    icon,
    label,
    value
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                flexShrink: 0,
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
                fontWeight={500}
                sx={{
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap"
                }}
            >
                {value || "-"}
            </Typography>
        </Box>
    </Box>
);

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
    title
}) => (
    <Box sx={{ mb: 2 }}>
        <Typography
            variant="subtitle1"
            fontWeight={700}
        >
            {title}
        </Typography>

        <Divider sx={{ mt: 1 }} />
    </Box>
);

/* =========================================================
   SUPPLIER ADDRESS DETAILS
========================================================= */

const SupplierAddressDetails = ({
    open,
    onClose,
    supplierAddress,
    onEdit
}) => {

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (!supplierAddress) {
        return (
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Supplier Address Details
                </DialogTitle>

                <DialogContent>
                    <Typography color="text.secondary">
                        No supplier address selected.
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
       SUPPLIER INFORMATION
    ===================================================== */

    const supplierName =
        getFieldValue(
            supplierAddress,
            "supplierName",
            "SupplierName"
        ) ||
        getFieldValue(
            supplierAddress?.supplier ||
            supplierAddress?.Supplier,
            "supplierName",
            "SupplierName",
            "name",
            "Name"
        );

    const supplierId = getFieldValue(
        supplierAddress,
        "supplierId",
        "SupplierId"
    );

    const addressType = getFieldValue(
        supplierAddress,
        "addressType",
        "AddressType"
    );

    const addressLine1 = getFieldValue(
        supplierAddress,
        "addressLine1",
        "AddressLine1",
        "address",
        "Address"
    );

    const addressLine2 = getFieldValue(
        supplierAddress,
        "addressLine2",
        "AddressLine2"
    );

    const city = getFieldValue(
        supplierAddress,
        "city",
        "City"
    );

    const state = getFieldValue(
        supplierAddress,
        "state",
        "State"
    );

    const postalCode = getFieldValue(
        supplierAddress,
        "postalCode",
        "PostalCode",
        "zipCode",
        "ZipCode"
    );

    const country = getFieldValue(
        supplierAddress,
        "country",
        "Country"
    );

    const contactPerson = getFieldValue(
        supplierAddress,
        "contactPerson",
        "ContactPerson"
    );

    const phoneNumber = getFieldValue(
        supplierAddress,
        "phoneNumber",
        "PhoneNumber",
        "contactPhone",
        "ContactPhone"
    );

    const email = getFieldValue(
        supplierAddress,
        "email",
        "Email",
        "contactEmail",
        "ContactEmail"
    );

    const website = getFieldValue(
        supplierAddress,
        "website",
        "Website"
    );

    const gstNumber = getFieldValue(
        supplierAddress,
        "gstNumber",
        "GSTNumber",
        "gstin",
        "GSTIN"
    );

    const addressId = getFieldValue(
        supplierAddress,
        "supplierAddressId",
        "SupplierAddressId",
        "id",
        "Id"
    );

    const isActive = getStatus(supplierAddress);

    const fullAddress = [
        addressLine1 !== "-" ? addressLine1 : "",
        addressLine2 !== "-" ? addressLine2 : "",
        city !== "-" ? city : "",
        state !== "-" ? state : "",
        postalCode !== "-" ? postalCode : "",
        country !== "-" ? country : ""
    ]
        .filter(Boolean)
        .join(", ");

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
        >
            {/* HEADER */}

            <DialogTitle>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 46,
                                height: 46,
                                borderRadius: 2,
                                bgcolor: "action.hover",
                                color: "primary.main"
                            }}
                        >
                            <EditLocationAlt />
                        </Box>

                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={700}
                            >
                                Supplier Address Details
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Address ID: {addressId}
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        label={isActive ? "Active" : "Inactive"}
                        color={isActive ? "success" : "default"}
                        size="small"
                    />
                </Box>
            </DialogTitle>

            <Divider />

            {/* CONTENT */}

            <DialogContent sx={{ py: 3 }}>

                {/* SUPPLIER SUMMARY */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 2
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5
                        }}
                    >
                        <Business
                            color="primary"
                            fontSize="large"
                        />

                        <Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Supplier
                            </Typography>

                            <Typography
                                variant="h6"
                                fontWeight={600}
                            >
                                {supplierName}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Supplier ID: {supplierId}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* ADDRESS INFORMATION */}

                <Box sx={{ mb: 3 }}>
                    <SectionHeader title="Address Information" />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <DetailItem
                                icon={<LocationOn fontSize="small" />}
                                label="Address Type"
                                value={addressType}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailItem
                                icon={<LocationCity fontSize="small" />}
                                label="City"
                                value={city}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <DetailItem
                                icon={<LocationOn fontSize="small" />}
                                label="Address Line 1"
                                value={addressLine1}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <DetailItem
                                icon={<LocationOn fontSize="small" />}
                                label="Address Line 2"
                                value={addressLine2}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailItem
                                icon={<LocationCity fontSize="small" />}
                                label="State"
                                value={state}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailItem
                                icon={<LocationOn fontSize="small" />}
                                label="Postal Code"
                                value={postalCode}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailItem
                                icon={<LocationOn fontSize="small" />}
                                label="Country"
                                value={country}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <DetailItem
                                icon={<LocationOn fontSize="small" />}
                                label="Complete Address"
                                value={fullAddress || "-"}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* CONTACT INFORMATION */}

                <Box sx={{ mb: 3 }}>
                    <SectionHeader title="Contact Information" />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <DetailItem
                                icon={<Person fontSize="small" />}
                                label="Contact Person"
                                value={contactPerson}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailItem
                                icon={<Phone fontSize="small" />}
                                label="Phone Number"
                                value={phoneNumber}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailItem
                                icon={<Email fontSize="small" />}
                                label="Email Address"
                                value={email}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <DetailItem
                                icon={<Language fontSize="small" />}
                                label="Website"
                                value={website}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* TAX INFORMATION */}

                <Box>
                    <SectionHeader title="Tax Information" />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <DetailItem
                                icon={<AccountBalance fontSize="small" />}
                                label="GST Number"
                                value={gstNumber}
                            />
                        </Grid>
                    </Grid>
                </Box>

            </DialogContent>

            <Divider />

            {/* ACTIONS */}

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Close />}
                    onClick={onClose}
                >
                    Close
                </Button>

                {onEdit && (
                    <Button
                        variant="contained"
                        startIcon={<EditLocationAlt />}
                        onClick={() => onEdit(supplierAddress)}
                    >
                        Edit Address
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default SupplierAddressDetails;

