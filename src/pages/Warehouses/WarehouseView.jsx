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
    Chip,
    Box
} from "@mui/material";


// =========================================================
// WarehouseView
// =========================================================

const WarehouseView = ({
    open,
    warehouse,
    onClose
}) => {

    // =====================================================
    // No warehouse selected
    // =====================================================

    if (!warehouse) {
        return null;
    }


    // =====================================================
    // Support PascalCase + camelCase
    // =====================================================

    const getValue = (pascalCase, camelCase) => {

        return (
            warehouse[pascalCase] ??
            warehouse[camelCase] ??
            ""
        );

    };


    // =====================================================
    // FIELD COMPONENT
    // =====================================================

    const Field = ({
        label,
        value
    }) => {

        return (

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
                >
                    {value !== null &&
                     value !== undefined &&
                     value !== ""
                        ? value
                        : "-"
                    }
                </Typography>

            </Grid>

        );

    };


    // =====================================================
    // WAREHOUSE VALUES
    // =====================================================

    const warehouseId =
        getValue(
            "WarehouseId",
            "warehouseId"
        );

    const sellerId =
        getValue(
            "SellerId",
            "sellerId"
        );

    const customerId =
        getValue(
            "CustomerId",
            "customerId"
        );

    const warehouseCode =
        getValue(
            "WarehouseCode",
            "warehouseCode"
        );

    const warehouseName =
        getValue(
            "WarehouseName",
            "warehouseName"
        );

    const addressLine1 =
        getValue(
            "AddressLine1",
            "addressLine1"
        );

    const addressLine2 =
        getValue(
            "AddressLine2",
            "addressLine2"
        );

    const city =
        getValue(
            "City",
            "city"
        );

    const state =
        getValue(
            "State",
            "state"
        );

    const country =
        getValue(
            "Country",
            "country"
        );

    const postalCode =
        getValue(
            "PostalCode",
            "postalCode"
        );

    const contactPerson =
        getValue(
            "ContactPerson",
            "contactPerson"
        );

    const phone =
        getValue(
            "Phone",
            "phone"
        );

    const email =
        getValue(
            "Email",
            "email"
        );

    const isActive =
        getValue(
            "IsActive",
            "isActive"
        );

    const createdDate =
        getValue(
            "CreatedDate",
            "createdDate"
        );

    const updatedDate =
        getValue(
            "UpdatedDate",
            "updatedDate"
        );


    // =====================================================
    // DATE FORMATTER
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleString();

    };


    // =====================================================
    // RENDER
    // =====================================================

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

            <DialogTitle>

                <Typography
                    variant="h6"
                    fontWeight={600}
                >
                    Warehouse Details
                </Typography>

                {warehouseName && (

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        {warehouseName}
                    </Typography>

                )}

            </DialogTitle>


            <Divider />


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent sx={{ mt: 2 }}>

                <Grid
                    container
                    spacing={3}
                >

                    {/* =========================================
                        BASIC INFORMATION
                    ========================================= */}

                    <Field
                        label="Warehouse ID"
                        value={warehouseId}
                    />

                    <Field
                        label="Seller ID"
                        value={sellerId}
                    />

                    <Field
                        label="Customer ID"
                        value={customerId}
                    />

                    <Field
                        label="Warehouse Code"
                        value={warehouseCode}
                    />

                    <Field
                        label="Warehouse Name"
                        value={warehouseName}
                    />


                    {/* =========================================
                        ADDRESS
                    ========================================= */}

                    <Field
                        label="Address Line 1"
                        value={addressLine1}
                    />

                    <Field
                        label="Address Line 2"
                        value={addressLine2}
                    />

                    <Field
                        label="City"
                        value={city}
                    />

                    <Field
                        label="State"
                        value={state}
                    />

                    <Field
                        label="Country"
                        value={country}
                    />

                    <Field
                        label="Postal Code"
                        value={postalCode}
                    />


                    {/* =========================================
                        CONTACT
                    ========================================= */}

                    <Field
                        label="Contact Person"
                        value={contactPerson}
                    />

                    <Field
                        label="Phone"
                        value={phone}
                    />

                    <Field
                        label="Email"
                        value={email}
                    />


                    {/* =========================================
                        STATUS
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Status
                        </Typography>

                        <Box sx={{ mt: 0.5 }}>

                            <Chip
                                label={
                                    isActive
                                        ? "Active"
                                        : "Inactive"
                                }
                                color={
                                    isActive
                                        ? "success"
                                        : "error"
                                }
                            />

                        </Box>

                    </Grid>


                    {/* =========================================
                        DATES
                    ========================================= */}

                    <Field
                        label="Created Date"
                        value={
                            formatDate(
                                createdDate
                            )
                        }
                    />

                    <Field
                        label="Updated Date"
                        value={
                            formatDate(
                                updatedDate
                            )
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

export default WarehouseView;