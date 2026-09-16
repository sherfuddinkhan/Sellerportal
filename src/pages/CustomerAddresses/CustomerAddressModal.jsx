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
    Checkbox,
    MenuItem
} from "@mui/material";


// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
    CustomerAddressId: 0,
    CustomerId: "",
    AddressType: "",
    AddressLine1: "",
    AddressLine2: "",
    City: "",
    State: "",
    Country: "",
    PostalCode: "",
    IsDefault: false
};


// ============================================================
// COMPONENT
// ============================================================

const CustomerAddressModal = ({
    open,
    address,
    onClose,
    onSave
}) => {

    const [formData, setFormData] =
        useState(initialState);


    // ========================================================
    // LOAD ADDRESS FOR EDIT
    // ========================================================

    useEffect(() => {

        if (address) {

            setFormData({
                CustomerAddressId:
                    address.CustomerAddressId ??
                    address.customerAddressId ??
                    0,

                CustomerId:
                    address.CustomerId ??
                    address.customerId ??
                    "",

                AddressType:
                    address.AddressType ??
                    address.addressType ??
                    "",

                AddressLine1:
                    address.AddressLine1 ??
                    address.addressLine1 ??
                    "",

                AddressLine2:
                    address.AddressLine2 ??
                    address.addressLine2 ??
                    "",

                City:
                    address.City ??
                    address.city ??
                    "",

                State:
                    address.State ??
                    address.state ??
                    "",

                Country:
                    address.Country ??
                    address.country ??
                    "",

                PostalCode:
                    address.PostalCode ??
                    address.postalCode ??
                    "",

                IsDefault:
                    address.IsDefault ??
                    address.isDefault ??
                    false
            });

        } else {

            setFormData(initialState);

        }

    }, [address, open]);


    // ========================================================
    // HANDLE INPUT
    // ========================================================

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


    // ========================================================
    // SUBMIT
    // ========================================================

    const handleSubmit = () => {

        // ----------------------------------------------------
        // REQUIRED VALIDATION
        // ----------------------------------------------------

        if (
            !formData.CustomerId ||
            !formData.AddressType ||
            !formData.AddressLine1
        ) {

            alert(
                "Customer ID, Address Type and Address Line 1 are required."
            );

            return;
        }


        // ----------------------------------------------------
        // PAYLOAD
        // ----------------------------------------------------

        const payload = {

            CustomerAddressId:
                Number(formData.CustomerAddressId) || 0,

            CustomerId:
                Number(formData.CustomerId),

            AddressType:
                formData.AddressType.trim(),

            AddressLine1:
                formData.AddressLine1.trim(),

            AddressLine2:
                formData.AddressLine2.trim() || null,

            City:
                formData.City.trim() || null,

            State:
                formData.State.trim() || null,

            Country:
                formData.Country.trim() || null,

            PostalCode:
                formData.PostalCode.trim() || null,

            IsDefault:
                Boolean(formData.IsDefault)
        };


        onSave(payload);

    };


    // ========================================================
    // RENDER
    // ========================================================

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

                {formData.CustomerAddressId
                    ? "Edit Customer Address"
                    : "Add Customer Address"}

            </DialogTitle>


            {/* =================================================
                CONTENT
            ================================================= */}

            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 0.5 }}
                >

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
                            required
                            label="Customer ID"
                            name="CustomerId"
                            type="number"
                            value={formData.CustomerId}
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        ADDRESS TYPE
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >

                        <TextField
                            select
                            fullWidth
                            required
                            label="Address Type"
                            name="AddressType"
                            value={formData.AddressType}
                            onChange={handleChange}
                        >

                            <MenuItem value="Billing">
                                Billing
                            </MenuItem>

                            <MenuItem value="Shipping">
                                Shipping
                            </MenuItem>

                            <MenuItem value="Both">
                                Both
                            </MenuItem>

                        </TextField>

                    </Grid>


                    {/* =========================================
                        ADDRESS LINE 1
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Address Line 1"
                            name="AddressLine1"
                            value={formData.AddressLine1}
                            onChange={handleChange}
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
                            value={formData.AddressLine2}
                            onChange={handleChange}
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
                            value={formData.City}
                            onChange={handleChange}
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
                            value={formData.State}
                            onChange={handleChange}
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
                            value={formData.Country}
                            onChange={handleChange}
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
                            value={formData.PostalCode}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* =========================================
                        DEFAULT
                    ========================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <FormControlLabel

                            control={
                                <Checkbox
                                    name="IsDefault"
                                    checked={
                                        Boolean(
                                            formData.IsDefault
                                        )
                                    }
                                    onChange={handleChange}
                                />
                            }

                            label="Default Address"

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

                    {formData.CustomerAddressId
                        ? "Update"
                        : "Save"}

                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default CustomerAddressModal;