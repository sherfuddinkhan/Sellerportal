// =========================================================
// WarehouseModal.jsx
// Frontend Only
// =========================================================

import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    FormControlLabel,
    Checkbox
} from "@mui/material";


// =========================================================
// INITIAL STATE
// =========================================================

const initialState = {
    WarehouseId: 0,

    SellerId: "",

    CustomerId: "",

    WarehouseCode: "",

    WarehouseName: "",

    AddressLine1: "",

    AddressLine2: "",

    City: "",

    State: "",

    Country: "",

    PostalCode: "",

    ContactPerson: "",

    Phone: "",

    Email: "",

    IsActive: true
};


// =========================================================
// WarehouseModal
// =========================================================

const WarehouseModal = ({
    open,
    warehouse,
    onClose,
    onSave
}) => {

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] =
        useState(initialState);


    // =====================================================
    // LOAD SELECTED WAREHOUSE
    // =====================================================

    useEffect(() => {

        if (warehouse) {

            setFormData({

                WarehouseId:
                    warehouse.WarehouseId ??
                    warehouse.warehouseId ??
                    0,

                SellerId:
                    warehouse.SellerId ??
                    warehouse.sellerId ??
                    "",

                CustomerId:
                    warehouse.CustomerId ??
                    warehouse.customerId ??
                    "",

                WarehouseCode:
                    warehouse.WarehouseCode ??
                    warehouse.warehouseCode ??
                    "",

                WarehouseName:
                    warehouse.WarehouseName ??
                    warehouse.warehouseName ??
                    "",

                AddressLine1:
                    warehouse.AddressLine1 ??
                    warehouse.addressLine1 ??
                    "",

                AddressLine2:
                    warehouse.AddressLine2 ??
                    warehouse.addressLine2 ??
                    "",

                City:
                    warehouse.City ??
                    warehouse.city ??
                    "",

                State:
                    warehouse.State ??
                    warehouse.state ??
                    "",

                Country:
                    warehouse.Country ??
                    warehouse.country ??
                    "",

                PostalCode:
                    warehouse.PostalCode ??
                    warehouse.postalCode ??
                    "",

                ContactPerson:
                    warehouse.ContactPerson ??
                    warehouse.contactPerson ??
                    "",

                Phone:
                    warehouse.Phone ??
                    warehouse.phone ??
                    "",

                Email:
                    warehouse.Email ??
                    warehouse.email ??
                    "",

                IsActive:
                    warehouse.IsActive ??
                    warehouse.isActive ??
                    true

            });

        }
        else {

            setFormData({
                ...initialState
            });

        }

    }, [
        warehouse,
        open
    ]);


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            checked,
            type
        } = event.target;


        setFormData((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));

    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const handleSubmit = () => {

        // -------------------------------------------------
        // Seller
        // -------------------------------------------------

        if (!formData.SellerId) {

            alert(
                "Seller ID is required."
            );

            return;

        }


        // -------------------------------------------------
        // Customer
        // -------------------------------------------------

        if (!formData.CustomerId) {

            alert(
                "Customer ID is required."
            );

            return;

        }


        // -------------------------------------------------
        // Warehouse Code
        // -------------------------------------------------

        if (
            !formData.WarehouseCode ||
            !formData.WarehouseCode.trim()
        ) {

            alert(
                "Warehouse Code is required."
            );

            return;

        }


        // -------------------------------------------------
        // Warehouse Name
        // -------------------------------------------------

        if (
            !formData.WarehouseName ||
            !formData.WarehouseName.trim()
        ) {

            alert(
                "Warehouse Name is required."
            );

            return;

        }


        // -------------------------------------------------
        // Prepare data
        // -------------------------------------------------

        const data = {

            ...formData,

            // Make sure numeric IDs are numbers
            SellerId:
                Number(formData.SellerId),

            CustomerId:
                Number(formData.CustomerId),

            WarehouseId:
                Number(formData.WarehouseId)

        };


        // -------------------------------------------------
        // Send to WarehouseList
        // -------------------------------------------------

        onSave(data);

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

                {
                    formData.WarehouseId
                        ? "Edit Warehouse"
                        : "Add Warehouse"
                }

            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                    sx={{
                        mt: 0.5
                    }}
                >

                    {/* =========================================
                        SELLER ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField

                            fullWidth

                            label="Seller ID"

                            name="SellerId"

                            type="number"

                            value={
                                formData.SellerId
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </Grid>


                    {/* =========================================
                        CUSTOMER ID
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField

                            fullWidth

                            label="Customer ID"

                            name="CustomerId"

                            type="number"

                            value={
                                formData.CustomerId
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </Grid>


                    {/* =========================================
                        WAREHOUSE CODE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField

                            fullWidth

                            label="Warehouse Code"

                            name="WarehouseCode"

                            value={
                                formData.WarehouseCode
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </Grid>


                    {/* =========================================
                        WAREHOUSE NAME
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField

                            fullWidth

                            label="Warehouse Name"

                            name="WarehouseName"

                            value={
                                formData.WarehouseName
                            }

                            onChange={
                                handleChange
                            }

                            required

                        />

                    </Grid>


                    {/* =========================================
                        ADDRESS LINE 1
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={8}
                    >

                        <TextField

                            fullWidth

                            label="Address Line 1"

                            name="AddressLine1"

                            value={
                                formData.AddressLine1
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        ADDRESS LINE 2
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField

                            fullWidth

                            label="Address Line 2"

                            name="AddressLine2"

                            value={
                                formData.AddressLine2
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        CITY
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField

                            fullWidth

                            label="City"

                            name="City"

                            value={
                                formData.City
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        STATE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField

                            fullWidth

                            label="State"

                            name="State"

                            value={
                                formData.State
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        COUNTRY
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField

                            fullWidth

                            label="Country"

                            name="Country"

                            value={
                                formData.Country
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        POSTAL CODE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField

                            fullWidth

                            label="Postal Code"

                            name="PostalCode"

                            value={
                                formData.PostalCode
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        CONTACT PERSON
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField

                            fullWidth

                            label="Contact Person"

                            name="ContactPerson"

                            value={
                                formData.ContactPerson
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        PHONE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField

                            fullWidth

                            label="Phone"

                            name="Phone"

                            value={
                                formData.Phone
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        EMAIL
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField

                            fullWidth

                            label="Email"

                            name="Email"

                            type="email"

                            value={
                                formData.Email
                            }

                            onChange={
                                handleChange
                            }

                        />

                    </Grid>


                    {/* =========================================
                        ACTIVE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <FormControlLabel

                            control={

                                <Checkbox

                                    name="IsActive"

                                    checked={
                                        Boolean(
                                            formData.IsActive
                                        )
                                    }

                                    onChange={
                                        handleChange
                                    }

                                />

                            }

                            label="Active"

                        />

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions>

                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >

                    {
                        formData.WarehouseId
                            ? "Update"
                            : "Save"
                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

};


export default WarehouseModal;