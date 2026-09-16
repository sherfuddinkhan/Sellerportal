import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Divider,
    Chip
} from "@mui/material";


const CustomerAddressView = ({
    open,
    address,
    onClose
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

    const createdDate =
        address.CreatedDate ??
        address.createdDate ??
        null;


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


    // ============================================================
    // FIELD COMPONENT
    // ============================================================

    const Field = ({
        label,
        value
    }) => (

        <Grid
            item
            xs={12}
            md={6}
        >

            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                fontWeight={500}
                sx={{
                    wordBreak: "break-word"
                }}
            >
                {value || "-"}

            </Typography>

        </Grid>
    );


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    fontWeight: "bold"
                }}
            >
                Customer Address Details
            </DialogTitle>


            <Divider />


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent
                sx={{
                    mt: 2
                }}
            >

                <Grid
                    container
                    spacing={3}
                >

                    {/* CUSTOMER ADDRESS ID */}

                    <Field
                        label="Customer Address ID"
                        value={customerAddressId}
                    />


                    {/* CUSTOMER ID */}

                    <Field
                        label="Customer ID"
                        value={customerId}
                    />


                    {/* ADDRESS TYPE */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Address Type
                        </Typography>

                        <br />

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
                        />

                    </Grid>


                    {/* DEFAULT ADDRESS */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Default Address
                        </Typography>

                        <br />

                        <Chip
                            label={
                                isDefault
                                    ? "Yes"
                                    : "No"
                            }
                            color={
                                isDefault
                                    ? "success"
                                    : "default"
                            }
                            size="small"
                        />

                    </Grid>


                    {/* ADDRESS LINE 1 */}

                    <Field
                        label="Address Line 1"
                        value={addressLine1}
                    />


                    {/* ADDRESS LINE 2 */}

                    <Field
                        label="Address Line 2"
                        value={addressLine2}
                    />


                    {/* CITY */}

                    <Field
                        label="City"
                        value={city}
                    />


                    {/* STATE */}

                    <Field
                        label="State"
                        value={state}
                    />


                    {/* COUNTRY */}

                    <Field
                        label="Country"
                        value={country}
                    />


                    {/* POSTAL CODE */}

                    <Field
                        label="Postal Code"
                        value={postalCode}
                    />


                    {/* CREATED DATE */}

                    <Field
                        label="Created Date"
                        value={
                            createdDate
                                ? new Date(
                                    createdDate
                                ).toLocaleString()
                                : "-"
                        }
                    />

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2
                }}
            >

                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default CustomerAddressView;