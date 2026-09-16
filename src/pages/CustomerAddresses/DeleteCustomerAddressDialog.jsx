import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Chip,
    Box
} from "@mui/material";


const DeleteCustomerAddressDialog = ({
    open,
    address,
    onClose,
    onDeleted
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

    const postalCode =
        address.PostalCode ??
        address.postalCode ??
        "";


    // ============================================================
    // DELETE
    // ============================================================

    const handleDelete = () => {

        onDeleted(
            customerAddressId
        );
    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <DialogTitle
                sx={{
                    fontWeight: "bold"
                }}
            >
                Delete Customer Address
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

                <Typography>
                    Are you sure you want to delete this customer
                    address?
                </Typography>


                {/* =============================================
                    ADDRESS INFORMATION
                ============================================= */}

                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: "grey.50"
                    }}
                >

                    {/* ADDRESS ID */}

                    <Typography
                        fontWeight="bold"
                    >
                        Address ID :{" "}
                        {customerAddressId}
                    </Typography>


                    {/* CUSTOMER ID */}

                    <Typography>
                        Customer ID :{" "}
                        {customerId}
                    </Typography>


                    {/* ADDRESS TYPE */}

                    <Box
                        sx={{
                            mt: 1,
                            mb: 1
                        }}
                    >

                        <Typography
                            component="span"
                            sx={{
                                mr: 1
                            }}
                        >
                            Address Type :
                        </Typography>

                        <Chip
                            label={
                                addressType || "-"
                            }
                            size="small"
                        />

                    </Box>


                    {/* ADDRESS LINE 1 */}

                    <Typography>
                        Address :{" "}
                        {addressLine1 || "-"}
                    </Typography>


                    {/* ADDRESS LINE 2 */}

                    {addressLine2 && (

                        <Typography
                            sx={{
                                ml: 4
                            }}
                            color="text.secondary"
                        >
                            {addressLine2}
                        </Typography>

                    )}


                    {/* CITY */}

                    <Typography>
                        City :{" "}
                        {city || "-"}
                    </Typography>


                    {/* STATE */}

                    <Typography>
                        State :{" "}
                        {state || "-"}
                    </Typography>


                    {/* POSTAL CODE */}

                    <Typography>
                        Postal Code :{" "}
                        {postalCode || "-"}
                    </Typography>

                </Box>

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
                    variant="outlined"
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default DeleteCustomerAddressDialog;