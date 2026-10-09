// ReversePickupAddressCard.jsx

import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Box,
    Typography,
    Chip,
    Stack,
    Divider,
    Button,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    LocationOn,
    Person,
    Phone,
    Email,
    Home,
    Star,
    Visibility,
    Edit,
    Delete,
    CheckCircle,
    Cancel,
    Public
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
   GET BOOLEAN VALUE
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
   DETAIL ROW
========================================================= */

const DetailRow = ({ icon, label, value }) => {
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
            spacing={1.25}
            alignItems="flex-start"
            sx={{ minWidth: 0 }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                    pt: 0.15
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
   REVERSE PICKUP ADDRESS CARD
========================================================= */

const ReversePickupAddressCard = ({
    address,
    onView,
    onEdit,
    onDelete,
    onClick,

    loading = false,
    deleting = false,
    disabled = false,

    showViewButton = true,
    showEditButton = true,
    showDeleteButton = true,
    showAddressId = true,
    showEmail = true,
    showStatus = true,
    showDefaultBadge = true,
    showActions = true,

    compact = false,
    elevation = 1
}) => {
    if (!address || typeof address !== "object") {
        return null;
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
       ACTION HANDLERS
    ===================================================== */

    const handleView = (event) => {
        event.stopPropagation();

        if (typeof onView === "function") {
            onView(address);
        } else if (typeof onClick === "function") {
            onClick(address);
        }
    };

    const handleEdit = (event) => {
        event.stopPropagation();

        if (typeof onEdit === "function") {
            onEdit(address);
        }
    };

    const handleDelete = (event) => {
        event.stopPropagation();

        if (
            !deleting &&
            typeof onDelete === "function"
        ) {
            onDelete(address);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Card
            elevation={elevation}
            onClick={
                typeof onClick === "function"
                    ? () => onClick(address)
                    : undefined
            }
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                cursor:
                    typeof onClick === "function"
                        ? "pointer"
                        : "default",
                "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-2px)"
                },
                opacity: disabled ? 0.6 : 1,
                pointerEvents: disabled ? "none" : "auto"
            }}
        >
            {/* CARD HEADER */}

            <Box
                sx={{
                    p: compact ? 2 : 2.5,
                    bgcolor: "action.hover"
                }}
            >
                <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={1}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                        sx={{ minWidth: 0, flex: 1 }}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                flexShrink: 0
                            }}
                        >
                            <LocationOn />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {contactName || "Unnamed Contact"}
                            </Typography>

                            {showAddressId && addressId !== "" && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Address ID: {addressId}
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    {showDefaultBadge && isDefault && (
                        <Chip
                            icon={<Star />}
                            label="Default"
                            size="small"
                            color="primary"
                            variant="outlined"
                        />
                    )}
                </Stack>

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ mt: 2 }}
                >
                    {addressType && (
                        <Chip
                            icon={<Home />}
                            label={addressType}
                            size="small"
                            variant="outlined"
                        />
                    )}

                    {showStatus && (
                        <Chip
                            icon={
                                isActive
                                    ? <CheckCircle />
                                    : <Cancel />
                            }
                            label={status || (isActive ? "Active" : "Inactive")}
                            color={isActive ? "success" : "default"}
                            size="small"
                            variant="outlined"
                        />
                    )}
                </Stack>
            </Box>

            <Divider />

            {/* CARD CONTENT */}

            <CardContent
                sx={{
                    p: compact ? 2 : 2.5,
                    flexGrow: 1
                }}
            >
                <Stack spacing={2.25}>
                    <DetailRow
                        icon={<Person fontSize="small" />}
                        label="Contact Person"
                        value={contactName}
                    />

                    <DetailRow
                        icon={<Phone fontSize="small" />}
                        label="Phone Number"
                        value={phoneNumber}
                    />

                    {showEmail && (
                        <DetailRow
                            icon={<Email fontSize="small" />}
                            label="Email Address"
                            value={email}
                        />
                    )}

                    <DetailRow
                        icon={<LocationOn fontSize="small" />}
                        label="Address"
                        value={fullAddress}
                    />

                    {!fullAddress && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            No address details provided.
                        </Typography>
                    )}

                    {(city || state || postalCode) && (
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="flex-start"
                        >
                            <Public
                                fontSize="small"
                                color="action"
                                sx={{ mt: 0.25 }}
                            />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ overflowWrap: "anywhere" }}
                            >
                                {[city, state, postalCode]
                                    .filter(
                                        (value) =>
                                            value !== undefined &&
                                            value !== null &&
                                            String(value).trim() !== ""
                                    )
                                    .join(", ")}
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            </CardContent>

            {/* CARD ACTIONS */}

            {showActions && (
                <>
                    <Divider />

                    <CardActions
                        sx={{
                            p: compact ? 1.5 : 2,
                            justifyContent: "space-between",
                            gap: 1,
                            flexWrap: "wrap"
                        }}
                    >
                        <Box>
                            {showViewButton && (
                                <Tooltip title="View address details">
                                    <IconButton
                                        color="primary"
                                        onClick={handleView}
                                        disabled={disabled || loading}
                                        aria-label="View address"
                                    >
                                        <Visibility />
                                    </IconButton>
                                </Tooltip>
                            )}

                            {showEditButton && (
                                <Tooltip title="Edit address">
                                    <IconButton
                                        color="secondary"
                                        onClick={handleEdit}
                                        disabled={
                                            disabled ||
                                            loading ||
                                            typeof onEdit !== "function"
                                        }
                                        aria-label="Edit address"
                                    >
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>

                        {showDeleteButton && (
                            <Button
                                color="error"
                                variant="outlined"
                                size="small"
                                startIcon={<Delete />}
                                onClick={handleDelete}
                                disabled={
                                    disabled ||
                                    loading ||
                                    deleting ||
                                    typeof onDelete !== "function"
                                }
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </Button>
                        )}
                    </CardActions>
                </>
            )}
        </Card>
    );
};

export default ReversePickupAddressCard;

