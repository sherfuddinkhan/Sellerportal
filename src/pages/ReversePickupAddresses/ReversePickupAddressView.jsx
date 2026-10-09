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
    Chip,
    Divider,
    IconButton,
    Tooltip,
    CircularProgress
} from "@mui/material";

import {
    Close,
    LocationOn,
    Person,
    Home,
    Phone,
    Email,
    Public,
    PinDrop,
    Business,
    LocalShipping
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getField = (object, ...keys) => {
    if (!object || typeof object !== "object") {
        return undefined;
    }

    for (const key of keys) {
        if (
            object[key] !== undefined &&
            object[key] !== null &&
            object[key] !== ""
        ) {
            return object[key];
        }
    }

    return undefined;
};

/* =========================================================
   FORMAT TEXT
========================================================= */

const formatText = (value, fallback = "—") => {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return String(value);
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "—";
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

/* =========================================================
   STATUS CONFIGURATION
========================================================= */

const getStatusConfig = (status) => {
    const normalized = String(status || "")
        .trim()
        .toLowerCase()
        .replace(/[_-]/g, " ");

    if (
        normalized === "active" ||
        normalized === "approved" ||
        normalized === "verified"
    ) {
        return {
            label: status,
            color: "success"
        };
    }

    if (
        normalized === "inactive" ||
        normalized === "disabled" ||
        normalized === "rejected"
    ) {
        return {
            label: status,
            color: "error"
        };
    }

    if (
        normalized === "pending" ||
        normalized === "processing"
    ) {
        return {
            label: status,
            color: "warning"
        };
    }

    return {
        label: formatText(status, "Unknown"),
        color: "default"
    };
};

/* =========================================================
   DETAIL FIELD
========================================================= */

const DetailField = ({
    label,
    value,
    icon: Icon,
    fullWidth = false
}) => (
    <Grid item xs={12} sm={fullWidth ? 12 : 6}>
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 1.5,
                height: "100%",
                boxSizing: "border-box",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "background.paper",
                overflowWrap: "anywhere"
            }}
        >
            {Icon && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 36,
                        height: 36,
                        flexShrink: 0,
                        borderRadius: 2,
                        backgroundColor: "action.hover",
                        color: "primary.main"
                    }}
                >
                    <Icon fontSize="small" />
                </Box>
            )}

            <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        display: "block",
                        mb: 0.5,
                        fontWeight: 500
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere"
                    }}
                >
                    {formatText(value)}
                </Typography>
            </Box>
        </Box>
    </Grid>
);

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({ icon: Icon, title }) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2
        }}
    >
        {Icon && (
            <Icon
                color="primary"
                fontSize="small"
            />
        )}

        <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700 }}
        >
            {title}
        </Typography>
    </Box>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

const ReversePickupAddressView = ({
    open = false,
    onClose,
    address,
    reversePickupAddress,
    loading = false,
    title = "Reverse Pickup Address"
}) => {
    const data = address || reversePickupAddress || null;

    /* -----------------------------------------------------
       ADDRESS FIELDS
    ----------------------------------------------------- */

    const addressId = getField(
        data,
        "reversePickupAddressId",
        "ReversePickupAddressId",
        "addressId",
        "AddressId",
        "id",
        "Id"
    );

    const reversePickupId = getField(
        data,
        "reversePickupId",
        "ReversePickupId"
    );

    const reversePickupNumber = getField(
        data,
        "reversePickupNumber",
        "ReversePickupNumber"
    );

    const customerId = getField(
        data,
        "customerId",
        "CustomerId"
    );

    const customerName = getField(
        data,
        "customerName",
        "CustomerName",
        "contactName",
        "ContactName",
        "recipientName",
        "RecipientName"
    );

    const companyName = getField(
        data,
        "companyName",
        "CompanyName",
        "businessName",
        "BusinessName"
    );

    const addressLine1 = getField(
        data,
        "addressLine1",
        "AddressLine1",
        "streetAddress",
        "StreetAddress",
        "address",
        "Address"
    );

    const addressLine2 = getField(
        data,
        "addressLine2",
        "AddressLine2",
        "landmark",
        "Landmark"
    );

    const city = getField(
        data,
        "city",
        "City"
    );

    const state = getField(
        data,
        "state",
        "State",
        "stateName",
        "StateName"
    );

    const postalCode = getField(
        data,
        "postalCode",
        "PostalCode",
        "zipCode",
        "ZipCode",
        "pinCode",
        "PinCode"
    );

    const country = getField(
        data,
        "country",
        "Country",
        "countryName",
        "CountryName"
    );

    const phone = getField(
        data,
        "phone",
        "Phone",
        "phoneNumber",
        "PhoneNumber",
        "mobile",
        "Mobile"
    );

    const email = getField(
        data,
        "email",
        "Email",
        "emailAddress",
        "EmailAddress"
    );

    const addressType = getField(
        data,
        "addressType",
        "AddressType",
        "type",
        "Type"
    );

    const status = getField(
        data,
        "status",
        "Status"
    );

    const isDefault = getField(
        data,
        "isDefault",
        "IsDefault",
        "defaultAddress",
        "DefaultAddress"
    );

    const notes = getField(
        data,
        "notes",
        "Notes",
        "instructions",
        "Instructions",
        "deliveryInstructions",
        "DeliveryInstructions"
    );

    const createdAt = getField(
        data,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    );

    const updatedAt = getField(
        data,
        "updatedAt",
        "UpdatedAt",
        "modifiedAt",
        "ModifiedAt",
        "modifiedDate",
        "ModifiedDate"
    );

    const statusConfig = getStatusConfig(status);

    /* -----------------------------------------------------
       ADDRESS SUMMARY
    ----------------------------------------------------- */

    const addressParts = [
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country
    ].filter(
        (part) =>
            part !== undefined &&
            part !== null &&
            String(part).trim() !== ""
    );

    const formattedAddress = addressParts.length
        ? addressParts.join(", ")
        : "No address information available";

    /* -----------------------------------------------------
       RENDER
    ----------------------------------------------------- */

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            aria-labelledby="reverse-pickup-address-view-title"
        >
            <DialogTitle
                id="reverse-pickup-address-view-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    pr: 2
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
                            width: 42,
                            height: 42,
                            flexShrink: 0,
                            borderRadius: 2,
                            backgroundColor: "primary.light",
                            color: "primary.contrastText"
                        }}
                    >
                        <LocationOn />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 700,
                                overflowWrap: "anywhere"
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            View reverse pickup address information
                        </Typography>
                    </Box>
                </Box>

                <Tooltip title="Close">
                    <IconButton
                        onClick={onClose}
                        aria-label="Close address details"
                        size="small"
                    >
                        <Close />
                    </IconButton>
                </Tooltip>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 220,
                            gap: 2
                        }}
                    >
                        <CircularProgress />

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Loading address details...
                        </Typography>
                    </Box>
                ) : !data ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: 220,
                            textAlign: "center",
                            gap: 1
                        }}
                    >
                        <LocationOn
                            sx={{
                                fontSize: 48,
                                color: "text.disabled"
                            }}
                        />

                        <Typography
                            variant="h6"
                            color="text.secondary"
                        >
                            No Address Selected
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Select a reverse pickup address to view its details.
                        </Typography>
                    </Box>
                ) : (
                    <Box>
                        {/* ADDRESS SUMMARY */}

                        <Box
                            sx={{
                                p: 2.5,
                                mb: 3,
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                backgroundColor: "action.hover"
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mb: 1.5
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5
                                    }}
                                >
                                    <LocationOn
                                        color="primary"
                                        sx={{ fontSize: 32 }}
                                    />

                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 700 }}
                                        >
                                            {formatText(
                                                customerName,
                                                "Pickup Recipient"
                                            )}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {formatText(
                                                addressType,
                                                "Address"
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 1
                                    }}
                                >
                                    {status !== undefined && (
                                        <Chip
                                            label={statusConfig.label}
                                            color={statusConfig.color}
                                            size="small"
                                        />
                                    )}

                                    {Boolean(isDefault) && (
                                        <Chip
                                            label="Default Address"
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                </Box>
                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    lineHeight: 1.8,
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {formattedAddress}
                            </Typography>
                        </Box>

                        {/* ADDRESS INFORMATION */}

                        <Box sx={{ mb: 3 }}>
                            <SectionHeader
                                icon={Home}
                                title="Address Information"
                            />

                            <Grid container spacing={2}>
                                <DetailField
                                    label="Address ID"
                                    value={addressId}
                                    icon={PinDrop}
                                />

                                <DetailField
                                    label="Address Type"
                                    value={addressType}
                                    icon={Home}
                                />

                                <DetailField
                                    label="Address Line 1"
                                    value={addressLine1}
                                    icon={LocationOn}
                                    fullWidth
                                />

                                <DetailField
                                    label="Address Line 2 / Landmark"
                                    value={addressLine2}
                                    icon={LocationOn}
                                    fullWidth
                                />

                                <DetailField
                                    label="City"
                                    value={city}
                                    icon={Business}
                                />

                                <DetailField
                                    label="State"
                                    value={state}
                                    icon={Public}
                                />

                                <DetailField
                                    label="Postal Code"
                                    value={postalCode}
                                    icon={PinDrop}
                                />

                                <DetailField
                                    label="Country"
                                    value={country}
                                    icon={Public}
                                />

                                <DetailField
                                    label="Default Address"
                                    value={isDefault}
                                    icon={Home}
                                />
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {/* RECIPIENT INFORMATION */}

                        <Box sx={{ mb: 3 }}>
                            <SectionHeader
                                icon={Person}
                                title="Recipient Information"
                            />

                            <Grid container spacing={2}>
                                <DetailField
                                    label="Recipient Name"
                                    value={customerName}
                                    icon={Person}
                                />

                                <DetailField
                                    label="Company Name"
                                    value={companyName}
                                    icon={Business}
                                />

                                <DetailField
                                    label="Customer ID"
                                    value={customerId}
                                    icon={Person}
                                />

                                <DetailField
                                    label="Phone Number"
                                    value={phone}
                                    icon={Phone}
                                />

                                <DetailField
                                    label="Email Address"
                                    value={email}
                                    icon={Email}
                                    fullWidth
                                />
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        {/* REVERSE PICKUP INFORMATION */}

                        <Box sx={{ mb: 3 }}>
                            <SectionHeader
                                icon={LocalShipping}
                                title="Reverse Pickup Information"
                            />

                            <Grid container spacing={2}>
                                <DetailField
                                    label="Reverse Pickup ID"
                                    value={reversePickupId}
                                    icon={LocalShipping}
                                />

                                <DetailField
                                    label="Reverse Pickup Number"
                                    value={reversePickupNumber}
                                    icon={LocalShipping}
                                />
                            </Grid>
                        </Box>

                        {/* NOTES */}

                        {notes !== undefined && (
                            <>
                                <Divider sx={{ mb: 3 }} />

                                <Box sx={{ mb: 3 }}>
                                    <SectionHeader
                                        icon={Home}
                                        title="Notes / Instructions"
                                    />

                                    <Box
                                        sx={{
                                            p: 2,
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                            backgroundColor: "background.paper"
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                whiteSpace: "pre-wrap",
                                                overflowWrap: "anywhere"
                                            }}
                                        >
                                            {formatText(notes)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </>
                        )}

                        <Divider sx={{ mb: 3 }} />

                        {/* AUDIT INFORMATION */}

                        <Box>
                            <SectionHeader
                                icon={Public}
                                title="Record Information"
                            />

                            <Grid container spacing={2}>
                                <DetailField
                                    label="Created At"
                                    value={formatDate(createdAt)}
                                    icon={Public}
                                />

                                <DetailField
                                    label="Last Updated"
                                    value={formatDate(updatedAt)}
                                    icon={Public}
                                />
                            </Grid>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                    startIcon={<Close />}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReversePickupAddressView;

