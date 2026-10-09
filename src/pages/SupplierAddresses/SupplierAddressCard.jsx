import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Grid,
    Chip,
    Button,
    Divider,
    Tooltip
} from "@mui/material";

import {
    Business,
    LocationOn,
    LocationCity,
    Person,
    Phone,
    Email,
    Visibility,
    Edit,
    Delete,
    LocalShipping,
    ReceiptLong
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
   GET STATUS
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
            gap: 1.25,
            minWidth: 0
        }}
    >
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                flexShrink: 0,
                borderRadius: 1.5,
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
                sx={{ overflowWrap: "anywhere" }}
            >
                {value}
            </Typography>
        </Box>
    </Box>
);

/* =========================================================
   SUPPLIER ADDRESS CARD
========================================================= */

const SupplierAddressCard = ({
    supplierAddress,
    onView,
    onEdit,
    onDelete
}) => {

    /* =====================================================
       EMPTY CHECK
    ===================================================== */

    if (!supplierAddress) {
        return null;
    }

    /* =====================================================
       ADDRESS DATA
    ===================================================== */

    const addressId = getFieldValue(
        supplierAddress,
        "supplierAddressId",
        "SupplierAddressId",
        "id",
        "Id"
    );

    const supplierId = getFieldValue(
        supplierAddress,
        "supplierId",
        "SupplierId"
    );

    const supplierName =
        getFieldValue(
            supplierAddress,
            "supplierName",
            "SupplierName"
        ) !== "-"
            ? getFieldValue(
                supplierAddress,
                "supplierName",
                "SupplierName"
            )
            : getFieldValue(
                supplierAddress?.supplier ||
                supplierAddress?.Supplier,
                "supplierName",
                "SupplierName",
                "name",
                "Name"
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

    const isActive = getStatus(supplierAddress);

    /* =====================================================
       FORMATTED ADDRESS
    ===================================================== */

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
       ADDRESS TYPE ICON
    ===================================================== */

    const getAddressTypeIcon = () => {
        const type = String(addressType).toLowerCase();

        if (type.includes("shipping")) {
            return <LocalShipping fontSize="small" />;
        }

        if (type.includes("billing")) {
            return <ReceiptLong fontSize="small" />;
        }

        return <LocationOn fontSize="small" />;
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                transition: "box-shadow 0.2s, transform 0.2s",
                "&:hover": {
                    boxShadow: 4,
                    transform: "translateY(-2px)"
                }
            }}
        >
            <CardContent sx={{ p: 2.5, flexGrow: 1 }}>

                {/* CARD HEADER */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 1.5,
                        mb: 2
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            minWidth: 0
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 46,
                                height: 46,
                                flexShrink: 0,
                                borderRadius: 2,
                                bgcolor: "action.hover",
                                color: "primary.main"
                            }}
                        >
                            <Business />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                noWrap
                            >
                                {supplierName}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Address ID: {addressId}
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        size="small"
                        label={isActive ? "Active" : "Inactive"}
                        color={isActive ? "success" : "default"}
                        variant="outlined"
                    />
                </Box>

                {/* ADDRESS TYPE */}

                <Box sx={{ mb: 2 }}>
                    <Chip
                        icon={getAddressTypeIcon()}
                        label={addressType}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* ADDRESS */}

                <Box sx={{ mb: 2.5 }}>
                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            mb: 1
                        }}
                    >
                        <LocationOn
                            fontSize="small"
                            color="action"
                        />
                        Address
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            overflowWrap: "anywhere",
                            lineHeight: 1.8
                        }}
                    >
                        {fullAddress || "No address available"}
                    </Typography>
                </Box>

                {/* SUPPLIER DETAILS */}

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Business fontSize="small" />}
                            label="Supplier ID"
                            value={supplierId}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<LocationCity fontSize="small" />}
                            label="City"
                            value={city}
                        />
                    </Grid>

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

                    <Grid item xs={12}>
                        <DetailItem
                            icon={<Email fontSize="small" />}
                            label="Email Address"
                            value={email}
                        />
                    </Grid>
                </Grid>

            </CardContent>

            <Divider />

            {/* CARD ACTIONS */}

            <CardActions
                sx={{
                    p: 2,
                    justifyContent: "flex-end",
                    gap: 0.5,
                    flexWrap: "wrap"
                }}
            >
                <Tooltip title="View address details">
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => onView?.(supplierAddress)}
                    >
                        View
                    </Button>
                </Tooltip>

                <Tooltip title="Edit supplier address">
                    <Button
                        size="small"
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => onEdit?.(supplierAddress)}
                    >
                        Edit
                    </Button>
                </Tooltip>

                <Tooltip title="Delete supplier address">
                    <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<Delete />}
                        onClick={() => onDelete?.(supplierAddress)}
                    >
                        Delete
                    </Button>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default SupplierAddressCard;

