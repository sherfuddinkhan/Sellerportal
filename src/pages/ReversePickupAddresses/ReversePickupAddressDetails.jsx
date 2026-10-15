import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
    Paper,
    CircularProgress,
    Alert
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
    Business,
    PinDrop,
    LocalShipping,
    Badge
} from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5000/api/reverse-pickup-addresses";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (object, ...keys) => {
    if (!object || typeof object !== "object") {
        return undefined;
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

    return undefined;
};

/* =========================================================
   FORMAT TEXT
========================================================= */

const formatText = (value, fallback = "Not provided") => {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return fallback;
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return String(value);
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
        return [
            "true",
            "1",
            "yes",
            "active"
        ].includes(value.trim().toLowerCase());
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
                {formatText(value, fallback)}
            </Typography>
        </Box>
    </Box>
);

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
        <Box sx={{ color: "primary.main", display: "flex" }}>
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
    address: addressProp,
    reversePickupAddress,
    loading: loadingProp,
    error: errorProp = "",
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
    const { id } = useParams();
    const navigate = useNavigate();

    const [fetchedAddress, setFetchedAddress] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [fetchError, setFetchError] = useState("");

    const suppliedAddress = addressProp || reversePickupAddress || null;

    /* =====================================================
       FETCH ADDRESS WHEN OPENED DIRECTLY BY URL

       Example:
       /reverse-pickup-addresses/1404
    ===================================================== */

    const loadAddress = useCallback(async () => {
        if (suppliedAddress || !id) {
            setFetchedAddress(suppliedAddress);
            setFetchError("");
            setFetching(false);
            return;
        }

        const numericId = Number(id);

        if (!Number.isInteger(numericId) || numericId <= 0) {
            setFetchedAddress(null);
            setFetchError("Invalid reverse pickup address ID.");
            setFetching(false);
            return;
        }

        setFetching(true);
        setFetchError("");

        try {
            const response = await axios.get(
                `${API_BASE_URL}/${numericId}`
            );

            const responseData = response.data;

            const normalizedData =
                responseData?.data &&
                !Array.isArray(responseData.data)
                    ? responseData.data
                    : responseData;

            if (
                !normalizedData ||
                typeof normalizedData !== "object" ||
                Array.isArray(normalizedData)
            ) {
                setFetchedAddress(null);
                setFetchError(
                    `Reverse pickup address ${numericId} was not found.`
                );
                return;
            }

            setFetchedAddress(normalizedData);
        } catch (err) {
            console.error(
                "Failed to load reverse pickup address:",
                err
            );

            setFetchedAddress(null);

            setFetchError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                `Unable to load reverse pickup address ${numericId}. Check that the Node GET-by-ID endpoint exists.`
            );
        } finally {
            setFetching(false);
        }
    }, [id, suppliedAddress]);

    useEffect(() => {
        loadAddress();
    }, [loadAddress]);

    /* =====================================================
       BACK BUTTON

       Priority:
       1. Parent onBack callback
       2. Parent onClose callback
       3. Navigate to list page
    ===================================================== */

    const handleBack = () => {
        if (typeof onBack === "function") {
            onBack();
            return;
        }

        if (typeof onClose === "function") {
            onClose();
            return;
        }

        navigate("/reverse-pickup-addresses", {
            replace: false
        });
    };

    /* =====================================================
       EDIT BUTTON
    ===================================================== */

    const handleEdit = (data) => {
        if (typeof onEdit === "function") {
            onEdit(data);
            return;
        }

        const recordId = getFieldValue(
            data,
            "id",
            "Id",
            "reversePickupAddressId",
            "ReversePickupAddressId",
            "addressId",
            "AddressId"
        ) ?? id;

        if (recordId !== undefined && recordId !== null) {
            navigate(
                `/reverse-pickup-addresses/${recordId}/edit`
            );
        }
    };

    /* =====================================================
       NORMALIZE DATA
    ===================================================== */

    const source = suppliedAddress || fetchedAddress;

    const data =
        source?.data &&
        !Array.isArray(source.data) &&
        typeof source.data === "object"
            ? source.data
            : source;

    const loading =
        loadingProp !== undefined
            ? loadingProp
            : fetching;

    const error = errorProp || fetchError;

    /* =====================================================
       LOADING STATE
    ===================================================== */

    if (loading) {
        return (
            <Card variant="outlined">
                <CardContent>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{ py: 6 }}
                    >
                        <CircularProgress />

                        <Typography color="text.secondary">
                            Loading reverse pickup address details...
                        </Typography>

                        <Button
                            type="button"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                        >
                            Back to Addresses
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    /* =====================================================
       ERROR STATE
    ===================================================== */

    if (error) {
        return (
            <Card variant="outlined">
                <CardContent>
                    <Alert severity="error">
                        {error}
                    </Alert>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 2 }}
                    >
                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBack}
                        >
                            Back to Addresses
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            onClick={loadAddress}
                        >
                            Retry
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {
        return (
            <Card variant="outlined">
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

                    <Button
                        type="button"
                        sx={{ mt: 2 }}
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back to Addresses
                    </Button>
                </CardContent>
            </Card>
        );
    }

    /* =====================================================
       IDENTIFIERS
    ===================================================== */

    const addressId = getFieldValue(
        data,
        "id",
        "Id",
        "reversePickupAddressId",
        "ReversePickupAddressId",
        "addressId",
        "AddressId"
    );

    const sellerId = getFieldValue(data, "sellerId", "SellerId");
    const customerId = getFieldValue(data, "customerId", "CustomerId");

    const reversePickupId = getFieldValue(
        data,
        "reversePickupId",
        "ReversePickupId"
    );

    const reversePickupNumber = getFieldValue(
        data,
        "reversePickupNumber",
        "ReversePickupNumber"
    );

    /* =====================================================
       CONTACT INFORMATION
    ===================================================== */

    const contactName = getFieldValue(
        data,
        "contactName",
        "ContactName",
        "contactPerson",
        "ContactPerson",
        "customerName",
        "CustomerName",
        "recipientName",
        "RecipientName",
        "name",
        "Name"
    );

    const companyName = getFieldValue(
        data,
        "companyName",
        "CompanyName",
        "businessName",
        "BusinessName"
    );

    const phoneNumber = getFieldValue(
        data,
        "phone",
        "Phone",
        "phoneNumber",
        "PhoneNumber",
        "mobileNumber",
        "MobileNumber",
        "mobile",
        "Mobile"
    );

    const alternatePhoneNumber = getFieldValue(
        data,
        "alternatePhoneNumber",
        "AlternatePhoneNumber",
        "alternatePhone",
        "AlternatePhone",
        "secondaryPhone",
        "SecondaryPhone"
    );

    const email = getFieldValue(
        data,
        "email",
        "Email",
        "emailAddress",
        "EmailAddress"
    );

    /* =====================================================
       ADDRESS INFORMATION
    ===================================================== */

    const addressType = getFieldValue(
        data,
        "addressType",
        "AddressType",
        "type",
        "Type"
    );

    const addressLine1 = getFieldValue(
        data,
        "addressLine1",
        "AddressLine1",
        "address1",
        "Address1",
        "streetAddress",
        "StreetAddress"
    );

    const addressLine2 = getFieldValue(
        data,
        "addressLine2",
        "AddressLine2",
        "address2",
        "Address2"
    );

    const landmark = getFieldValue(data, "landmark", "Landmark");
    const city = getFieldValue(data, "city", "City");

    const state = getFieldValue(
        data,
        "state",
        "State",
        "stateName",
        "StateName"
    );

    const postalCode = getFieldValue(
        data,
        "pincode",
        "Pincode",
        "pinCode",
        "PinCode",
        "postalCode",
        "PostalCode",
        "zipCode",
        "ZipCode"
    );

    const country = getFieldValue(
        data,
        "country",
        "Country",
        "countryName",
        "CountryName"
    );

    /* =====================================================
       STATUS AND OTHER INFORMATION
    ===================================================== */

    const status = getFieldValue(
        data,
        "status",
        "Status",
        "addressStatus",
        "AddressStatus"
    );

    const defaultValue = getFieldValue(
        data,
        "isDefault",
        "IsDefault",
        "defaultAddress",
        "DefaultAddress",
        "isDefaultAddress",
        "IsDefaultAddress"
    );

    const activeValue = getFieldValue(
        data,
        "isActive",
        "IsActive",
        "active",
        "Active"
    );

    const isDefault = getBooleanValue(defaultValue);

    const isActive =
        activeValue !== undefined
            ? getBooleanValue(activeValue)
            : status !== undefined
                ? ![
                    "inactive",
                    "disabled",
                    "rejected",
                    "cancelled",
                    "canceled"
                ].includes(String(status).trim().toLowerCase())
                : undefined;

    const notes = getFieldValue(
        data,
        "notes",
        "Notes",
        "instructions",
        "Instructions",
        "deliveryInstructions",
        "DeliveryInstructions"
    );

    const createdAt = getFieldValue(
        data,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    );

    const updatedAt = getFieldValue(
        data,
        "updatedAt",
        "UpdatedAt",
        "modifiedAt",
        "ModifiedAt",
        "modifiedDate",
        "ModifiedDate"
    );

    /* =====================================================
       COMPLETE ADDRESS
    ===================================================== */

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
            value =>
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
            {/* PAGE HEADER */}

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
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        {title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        View the contact information and delivery location
                        for this reverse pickup address.
                    </Typography>
                </Box>

                {showActions && (
                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                    >
                        {showBackButton && (
                            <Button
                                type="button"
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                        )}

                        {showEditButton && (
                            <Button
                                type="button"
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() => handleEdit(data)}
                            >
                                Edit Address
                            </Button>
                        )}
                    </Stack>
                )}
            </Box>

            {/* ADDRESS SUMMARY */}

            <Card variant="outlined" sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                    flexShrink: 0
                                }}
                            >
                                <LocationOn fontSize="large" />
                            </Box>

                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="h6" fontWeight={700}>
                                    {formatText(contactName, "Pickup Recipient")}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {formatText(addressType, "Address")}
                                    {showAddressId &&
                                        addressId !== undefined &&
                                        ` • ID: ${addressId}`}
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip
                                icon={
                                    isActive === undefined
                                        ? undefined
                                        : isActive
                                            ? <CheckCircle />
                                            : <Cancel />
                                }
                                label={
                                    status !== undefined
                                        ? formatText(status)
                                        : isActive === undefined
                                            ? "Status Unknown"
                                            : isActive
                                                ? "Active"
                                                : "Inactive"
                                }
                                color={
                                    isActive === undefined
                                        ? "default"
                                        : isActive
                                            ? "success"
                                            : "default"
                                }
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

                    <Divider sx={{ my: 2 }} />

                    <Typography
                        variant="body2"
                        sx={{ lineHeight: 1.9, overflowWrap: "anywhere" }}
                    >
                        {fullAddress || "No address details provided."}
                    </Typography>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {/* CONTACT INFORMATION */}

                <Grid xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <SectionHeader icon={<Person />} title="Contact Information" />
                            <Divider sx={{ mb: 3 }} />

                            <Stack spacing={3}>
                                <DetailItem icon={<Person />} label="Contact Name" value={contactName} />
                                <DetailItem icon={<Phone />} label="Primary Phone Number" value={phoneNumber} />
                                <DetailItem icon={<Phone />} label="Alternate Phone Number" value={alternatePhoneNumber} />
                                <DetailItem icon={<Email />} label="Email Address" value={email} />
                                <DetailItem icon={<Business />} label="Company Name" value={companyName} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* ADDRESS INFORMATION */}

                <Grid xs={12} md={6}>
                    <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <SectionHeader icon={<Home />} title="Address Information" />
                            <Divider sx={{ mb: 3 }} />

                            <Stack spacing={3}>
                                <DetailItem icon={<LocationOn />} label="Address Line 1" value={addressLine1} />
                                <DetailItem icon={<Home />} label="Address Line 2" value={addressLine2} />
                                <DetailItem icon={<Business />} label="Landmark" value={landmark} />
                                <DetailItem icon={<LocationOn />} label="City" value={city} />
                                <DetailItem icon={<Public />} label="State" value={state} />
                                <DetailItem icon={<PinDrop />} label="PIN Code" value={postalCode} />
                                <DetailItem icon={<Public />} label="Country" value={country} />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* RELATED RECORDS */}

                <Grid xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <SectionHeader icon={<LocalShipping />} title="Related Records" />
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid xs={12} sm={6} md={3}>
                                    <DetailItem icon={<Badge />} label="Address ID" value={addressId} />
                                </Grid>

                                <Grid xs={12} sm={6} md={3}>
                                    <DetailItem icon={<Badge />} label="Seller ID" value={sellerId} />
                                </Grid>

                                <Grid xs={12} sm={6} md={3}>
                                    <DetailItem icon={<Person />} label="Customer ID" value={customerId} />
                                </Grid>

                                <Grid xs={12} sm={6} md={3}>
                                    <DetailItem icon={<LocalShipping />} label="Reverse Pickup ID" value={reversePickupId} />
                                </Grid>

                                <Grid xs={12} sm={6}>
                                    <DetailItem icon={<LocalShipping />} label="Reverse Pickup Number" value={reversePickupNumber} />
                                </Grid>

                                <Grid xs={12} sm={6}>
                                    <DetailItem icon={<Home />} label="Address Type" value={addressType} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* ADDRESS STATUS */}

                <Grid xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <SectionHeader icon={<CheckCircle />} title="Address Status" />
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid xs={12} sm={4}>
                                    <DetailItem
                                        icon={<Home />}
                                        label="Default Address"
                                        value={isDefault ? "Yes" : "No"}
                                    />
                                </Grid>

                                <Grid xs={12} sm={4}>
                                    <DetailItem
                                        icon={
                                            isActive === undefined
                                                ? <Public />
                                                : isActive
                                                    ? <CheckCircle />
                                                    : <Cancel />
                                        }
                                        label="Active Status"
                                        value={
                                            status !== undefined
                                                ? status
                                                : isActive === undefined
                                                    ? "Not provided"
                                                    : isActive
                                                        ? "Active"
                                                        : "Inactive"
                                        }
                                    />
                                </Grid>

                                <Grid xs={12} sm={4}>
                                    <DetailItem
                                        icon={<Home />}
                                        label="Address Type"
                                        value={addressType}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* NOTES */}

                {notes !== undefined && (
                    <Grid xs={12}>
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader icon={<Home />} title="Notes / Instructions" />
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
                                        variant="body2"
                                        sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                                    >
                                        {formatText(notes)}
                                    </Typography>
                                </Paper>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* RECORD INFORMATION */}

                {(createdAt || updatedAt) && (
                    <Grid xs={12}>
                        <Card variant="outlined" sx={{ borderRadius: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <SectionHeader icon={<Public />} title="Record Information" />
                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={3}>
                                    <Grid xs={12} sm={6}>
                                        <DetailItem
                                            icon={<Public />}
                                            label="Created At"
                                            value={
                                                createdAt
                                                    ? new Date(createdAt).toLocaleString("en-IN")
                                                    : undefined
                                            }
                                        />
                                    </Grid>

                                    <Grid xs={12} sm={6}>
                                        <DetailItem
                                            icon={<Public />}
                                            label="Last Updated"
                                            value={
                                                updatedAt
                                                    ? new Date(updatedAt).toLocaleString("en-IN")
                                                    : undefined
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* FOOTER ACTIONS */}

            {showActions &&
                (showBackButton || showEditButton) && (
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
                                type="button"
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                        )}

                        {showEditButton && (
                            <Button
                                type="button"
                                variant="contained"
                                startIcon={<Edit />}
                                onClick={() => handleEdit(data)}
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
