// ReversePickupAddressDetails.jsx

import React from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Divider,
    Button,
    Stack,
    Paper
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Person,
    Phone,
    Email,
    LocationOn,
    Public,
    Home,
    CheckCircle,
    Cancel,
    Star,
    Business
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
   FORMAT BOOLEAN
========================================================= */

const getBooleanValue = (value) => {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "number") {
        return value === 1;
    }

    if (typeof value === "string") {
        return ["true", "1", "yes", "active"].includes(
            value.trim().toLowerCase()
        );
    }

    return false;
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    icon,
    label,
    value,
    fallback = "Not provided"
}) => {
    const displayValue =
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
            ? value
            : fallback;

    return (
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
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    color: "primary.main",
                    flexShrink: 0
                }}
            >
                {icon}
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "block",
                        mb: 0.5,
                        fontWeight: 600
                    }}
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
                    {displayValue}
                </Typography>
            </Box>
        </Box>
    );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({ icon, title }) => (
    <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: 2 }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main"
            }}
        >
            {icon}
        </Box>

        <Typography variant="subtitle1" fontWeight={700}>
            {title}
        </Typography>
    </Stack>
);

/* =========================================================
   REVERSE PICKUP ADDRESS DETAILS
========================================================= */

const ReversePickupAddressDetails = ({
    address,
    loading = false,
    error = "",
    onBack,
    onEdit,
    onClose,
    title = "Reverse Pickup Address Details",
    showActions = true,
    showBackButton = true,
    showEditButton = true,
    showAddressId = true,
    fullWidth = true
}) => {
    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography color="text.secondary">
                        Loading reverse pickup address details...
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <Typography color="error" fontWeight={600}>
                        {error}
                    </Typography>

                    {showBackButton && (
                        <Button
                            sx={{ mt: 2 }}
                            startIcon={<ArrowBack />}
                            onClick={onBack || onClose}
                        >
                            Back
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    if (!address || typeof address !== "object") {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight={600}>
                        Address Not Found
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ mt: 1 }}
                    >
                        No reverse pickup address information is available.
                    </Typography>

                    {showBackButton && (
                        <Button
                            sx={{ mt: 2 }}
                            startIcon={<ArrowBack />}
                            onClick={onBack || onClose}
                        >
                            Back
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

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

    const alternatePhoneNumber = getFieldValue(
        address,
        "alternatePhoneNumber",
        "AlternatePhoneNumber",
        "alternatePhone",
        "AlternatePhone",
        "secondaryPhone",
        "SecondaryPhone"
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

    const landmark = getFieldValue(
        address,
        "landmark",
        "Landmark"
    );

    const city = getFieldValue(
        address,
        "city",
        "City"
    );

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

    const status = getFieldValue(
        address,
        "status",
        "Status",
        "addressStatus",
        "AddressStatus"
    );

    const isDefault = getBooleanValue(
        getFieldValue(
            address,
            "isDefault",
            "IsDefault",
            "defaultAddress",
            "DefaultAddress",
            "isDefaultAddress",
            "IsDefaultAddress"
        )
    );

    const isActive = getBooleanValue(
        getFieldValue(
            address,
            "isActive",
            "IsActive",
            "active",
            "Active"
        )
    );

    const fullAddress = [
        addressLine1,
        addressLine2,
        landmark,
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
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: fullWidth ? "100%" : "auto" }}>
            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        View the contact information and delivery location
                        for this reverse pickup address.
                    </Typography>
                </Box>

                {showActions && (
                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                    >
                        {showBackButton && (
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={onBack || onClose}
                            >
                                Back
                            </Button>
                        )}

                        {showEditButton && typeof onEdit === "function" && (
                            <Button
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() => onEdit(address)}
                            >
                                Edit Address
                            </Button>
                        )}
                    </Stack>
                )}
            </Box>

            {/* ADDRESS SUMMARY */}

            <Card
                variant="outlined"
                sx={{
                    mb: 3,
                    borderRadius: 3
                }}
            >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                    >
                        <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                        >
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText"
                                }}
                            >
                                <LocationOn fontSize="large" />
                            </Box>

                            <Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                >
                                    {contactName || "Unnamed Contact"}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {addressType || "Address"}
                                    {addressId !== "" &&
                                        showAddressId &&
                                        ` • ID: ${addressId}`}
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            useFlexGap
                        >
                            <Chip
                                icon={
                                    isActive
                                        ? <CheckCircle />
                                        : <Cancel />
                                }
                                label={isActive ? "Active" : "Inactive"}
                                color={isActive ? "success" : "default"}
                                variant="outlined"
                            />

                            {isDefault && (
                                <Chip
                                    icon={<Star />}
                                    label="Default Address"
                                    color="primary"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {/* CONTACT INFORMATION */}

                <Grid item xs={12} md={6}>
                    <Card
                        variant="outlined"
                        sx={{ height: "100%", borderRadius: 3 }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <SectionHeader
                                icon={<Person />}
                                title="Contact Information"
                            />

                            <Divider sx={{ mb: 3 }} />

                            <Stack spacing={3}>
                                <DetailItem
                                    icon={<Person />}
                                    label="Contact Name"
                                    value={contactName}
                                />

                                <DetailItem
                                    icon={<Phone />}
                                    label="Primary Phone Number"
                                    value={phoneNumber}
                                />

                                <DetailItem
                                    icon={<Phone />}
                                    label="Alternate Phone Number"
                                    value={alternatePhoneNumber}
                                />

                                <DetailItem
                                    icon={<Email />}
                                    label="Email Address"
                                    value={email}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* ADDRESS INFORMATION */}

                <Grid item xs={12} md={6}>
                    <Card
                        variant="outlined"
                        sx={{ height: "100%", borderRadius: 3 }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <SectionHeader
                                icon={<Home />}
                                title="Address Information"
                            />

                            <Divider sx={{ mb: 3 }} />

                            <Stack spacing={3}>
                                <DetailItem
                                    icon={<LocationOn />}
                                    label="Address Line 1"
                                    value={addressLine1}
                                />

                                <DetailItem
                                    icon={<Home />}
                                    label="Address Line 2"
                                    value={addressLine2}
                                />

                                <DetailItem
                                    icon={<Business />}
                                    label="Landmark"
                                    value={landmark}
                                />

                                <DetailItem
                                    icon={<LocationOn />}
                                    label="City"
                                    value={city}
                                />

                                <DetailItem
                                    icon={<Public />}
                                    label="State"
                                    value={state}
                                />

                                <DetailItem
                                    icon={<LocationOn />}
                                    label="Postal Code"
                                    value={postalCode}
                                />

                                <DetailItem
                                    icon={<Public />}
                                    label="Country"
                                    value={country}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* COMPLETE ADDRESS */}

                <Grid item xs={12}>
                    <Card
                        variant="outlined"
                        sx={{ borderRadius: 3 }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <SectionHeader
                                icon={<LocationOn />}
                                title="Complete Address"
                            />

                            <Divider sx={{ mb: 2 }} />

                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: "action.hover"
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        lineHeight: 1.9,
                                        overflowWrap: "anywhere"
                                    }}
                                >
                                    {fullAddress || "No address details provided."}
                                </Typography>
                            </Paper>
                        </CardContent>
                    </Card>
                </Grid>

                {/* ADDRESS STATUS */}

                <Grid item xs={12}>
                    <Card
                        variant="outlined"
                        sx={{ borderRadius: 3 }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <SectionHeader
                                icon={<CheckCircle />}
                                title="Address Status"
                            />

                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={4}>
                                    <DetailItem
                                        icon={<Home />}
                                        label="Address Type"
                                        value={addressType}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <DetailItem
                                        icon={<Star />}
                                        label="Default Address"
                                        value={isDefault ? "Yes" : "No"}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <DetailItem
                                        icon={
                                            isActive
                                                ? <CheckCircle />
                                                : <Cancel />
                                        }
                                        label="Active Status"
                                        value={
                                            status ||
                                            (isActive ? "Active" : "Inactive")
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* FOOTER ACTIONS */}

            {showActions && (showBackButton || showEditButton) && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                        mt: 3
                    }}
                >
                    {showBackButton && (
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={onBack || onClose}
                        >
                            Back
                        </Button>
                    )}

                    {showEditButton && typeof onEdit === "function" && (
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={() => onEdit(address)}
                        >
                            Edit Address
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default ReversePickupAddressDetails;

