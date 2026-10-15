
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
    CircularProgress,
    Stack
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
    LocalShipping,
    Badge,
    CalendarMonth
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getField = (object, ...keys) => {
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

const formatText = (value, fallback = "—") => {
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
        ["active", "approved", "verified", "completed"].includes(
            normalized
        )
    ) {
        return {
            label: status,
            color: "success"
        };
    }

    if (
        ["inactive", "disabled", "rejected", "cancelled"].includes(
            normalized
        )
    ) {
        return {
            label: status,
            color: "error"
        };
    }

    if (
        ["pending", "processing", "in progress"].includes(
            normalized
        )
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
    <Grid xs={12} sm={fullWidth ? 12 : 6}>
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
    <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 2 }}
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
    </Stack>
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
    /* -----------------------------------------------------
       NORMALIZE RESPONSE
    ----------------------------------------------------- */

    const source = address || reversePickupAddress || null;

    // Supports API responses wrapped in { data: { ... } }.
    const data =
        source?.data &&
        !Array.isArray(source.data) &&
        typeof source.data === "object"
            ? source.data
            : source;

    /* -----------------------------------------------------
       IDENTIFIERS
    ----------------------------------------------------- */

    const addressId = getField(
        data,
        "id",
        "Id",
        "reversePickupAddressId",
        "ReversePickupAddressId",
        "addressId",
        "AddressId"
    );

    const sellerId = getField(
        data,
        "sellerId",
        "SellerId"
    );

    const customerId = getField(
        data,
        "customerId",
        "CustomerId"
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

    /* -----------------------------------------------------
       RECIPIENT / CUSTOMER
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       ADDRESS
    ----------------------------------------------------- */

    const addressType = getField(
        data,
        "addressType",
        "AddressType",
        "type",
        "Type"
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
        "pincode",
        "Pincode",
        "pinCode",
        "PinCode",
        "postalCode",
        "PostalCode",
        "zipCode",
        "ZipCode"
    );

    const country = getField(
        data,
        "country",
        "Country",
        "countryName",
        "CountryName"
    );

    /* -----------------------------------------------------
       OTHER DETAILS
    ----------------------------------------------------- */

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
       FORMATTED ADDRESS
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

    const formattedAddress = addressParts.length > 0
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
            {/* DIALOG HEADER */}

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
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ minWidth: 0 }}
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
                            backgroundColor: "primary.main",
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
                </Stack>

                <Tooltip title="Close">
                    <IconButton
                        type="button"
                        onClick={onClose}
                        aria-label="Close address details"
                        size="small"
                    >
                        <Close />
                    </IconButton>
                </Tooltip>
            </DialogTitle>

            <Divider />

            {/* DIALOG CONTENT */}

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
                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row"
                                }}
                                alignItems={{
                                    xs: "flex-start",
                                    sm: "center"
                                }}
                                justifyContent="space-between"
                                spacing={2}
                                sx={{ mb: 1.5 }}
                            >
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={1.5}
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
                                </Stack>

                                <Stack
                                    direction="row"
                                    flexWrap="wrap"
                                    gap={1}
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
                                </Stack>
                            </Stack>

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
                                    label="PIN Code"
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
                                    label="Seller ID"
                                    value={sellerId}
                                    icon={Badge}
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

                        {/* RECORD INFORMATION */}

                        {(createdAt || updatedAt) && (
                            <>
                                <Divider sx={{ mb: 3 }} />

                                <Box>
                                    <SectionHeader
                                        icon={CalendarMonth}
                                        title="Record Information"
                                    />

                                    <Grid container spacing={2}>
                                        <DetailField
                                            label="Created At"
                                            value={formatDate(createdAt)}
                                            icon={CalendarMonth}
                                        />

                                        <DetailField
                                            label="Last Updated"
                                            value={formatDate(updatedAt)}
                                            icon={CalendarMonth}
                                        />
                                    </Grid>
                                </Box>
                            </>
                        )}
                    </Box>
                )}
            </DialogContent>

            <Divider />

            {/* DIALOG FOOTER */}

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    type="button"
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
