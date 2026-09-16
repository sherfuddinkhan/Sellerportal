import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Stack,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    LocationOn
} from "@mui/icons-material";


const CustomerAddressCard = ({
    address,
    onView,
    onEdit,
    onDelete
}) => {

    // ============================================================
    // NO ADDRESS
    // ============================================================

    if (!address) {
        return null;
    }


    // ============================================================
    // SUPPORT PASCALCASE + CAMELCASE
    // ============================================================

    const customerAddressId =
        address.CustomerAddressId ??
        address.customerAddressId ??
        0;

    const customerId =
        address.CustomerId ??
        address.customerId ??
        0;

    const addressType =
        address.AddressType ??
        address.addressType ??
        "";

    const addressLine1 =
        address.AddressLine1 ??
        address.addressLine1 ??
        "";

    const addressLine2 =
        address.AddressLine2 ??
        address.addressLine2 ??
        "";

    const city =
        address.City ??
        address.city ??
        "";

    const state =
        address.State ??
        address.state ??
        "";

    const country =
        address.Country ??
        address.country ??
        "";

    const postalCode =
        address.PostalCode ??
        address.postalCode ??
        "";

    const isDefault =
        address.IsDefault ??
        address.isDefault ??
        false;


    // ============================================================
    // ADDRESS TYPE COLOR
    // ============================================================

    const getAddressTypeColor = (type) => {

        switch (
            type?.toLowerCase()
        ) {

            case "billing":
                return "primary";

            case "shipping":
                return "success";

            case "both":
                return "info";

            default:
                return "default";
        }
    };


    return (

        <Card
            elevation={3}
            sx={{
                height: "100%",
                borderRadius: 2,
                transition: "0.3s",

                "&:hover": {
                    boxShadow: 8,
                    transform:
                        "translateY(-4px)"
                }
            }}
        >

            <CardContent>

                {/* =================================================
                    HEADER
                ================================================= */}

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <LocationOn
                        color="primary"
                        fontSize="large"
                    />


                    <Chip
                        label={
                            isDefault
                                ? "Default"
                                : "Normal"
                        }
                        color={
                            isDefault
                                ? "success"
                                : "default"
                        }
                        size="small"
                    />

                </Stack>


                {/* =================================================
                    ADDRESS TYPE
                ================================================= */}

                <Chip
                    label={
                        addressType || "-"
                    }
                    color={
                        getAddressTypeColor(
                            addressType
                        )
                    }
                    size="small"
                    sx={{
                        mb: 1
                    }}
                />


                {/* =================================================
                    ADDRESS ID
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 1
                    }}
                >
                    <strong>Address ID:</strong>{" "}
                    {customerAddressId}
                </Typography>


                {/* =================================================
                    CUSTOMER ID
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Customer ID:</strong>{" "}
                    {customerId}
                </Typography>


                {/* =================================================
                    ADDRESS LINE 1
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1
                    }}
                >
                    <strong>Address:</strong>{" "}
                    {addressLine1 || "-"}
                </Typography>


                {/* =================================================
                    ADDRESS LINE 2
                ================================================= */}

                {addressLine2 && (

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            ml: 9
                        }}
                    >
                        {addressLine2}
                    </Typography>

                )}


                {/* =================================================
                    CITY
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mt: 1
                    }}
                >
                    <strong>City:</strong>{" "}
                    {city || "-"}
                </Typography>


                {/* =================================================
                    STATE
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>State:</strong>{" "}
                    {state || "-"}
                </Typography>


                {/* =================================================
                    COUNTRY
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Country:</strong>{" "}
                    {country || "-"}
                </Typography>


                {/* =================================================
                    POSTAL CODE
                ================================================= */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Postal Code:</strong>{" "}
                    {postalCode || "-"}
                </Typography>

            </CardContent>


            <Divider />


            {/* =================================================
                ACTIONS
            ================================================= */}

            <CardActions
                sx={{
                    justifyContent: "flex-end"
                }}
            >

                {/* VIEW */}

                <Tooltip
                    title="View"
                >

                    <IconButton
                        color="primary"
                        onClick={() =>
                            onView(address)
                        }
                    >
                        <Visibility />
                    </IconButton>

                </Tooltip>


                {/* EDIT */}

                <Tooltip
                    title="Edit"
                >

                    <IconButton
                        color="warning"
                        onClick={() =>
                            onEdit(address)
                        }
                    >
                        <Edit />
                    </IconButton>

                </Tooltip>


                {/* DELETE */}

                <Tooltip
                    title="Delete"
                >

                    <IconButton
                        color="error"
                        onClick={() =>
                            onDelete(address)
                        }
                    >
                        <Delete />
                    </IconButton>

                </Tooltip>

            </CardActions>

        </Card>
    );
};


export default CustomerAddressCard;