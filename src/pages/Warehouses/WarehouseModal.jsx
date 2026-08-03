import React, { useEffect, useState } from "react";

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

const WarehouseModal = ({

    open,

    warehouse,

    onClose,

    onSave

}) => {

    const initialState = {

        WarehouseId: 0,

        SellerId: "",

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

    const [formData, setFormData] =

        useState(initialState);

    useEffect(() => {

        if (warehouse) {

            setFormData({

                WarehouseId:

                    warehouse.WarehouseId || 0,

                SellerId:

                    warehouse.SellerId || "",

                WarehouseCode:

                    warehouse.WarehouseCode || "",

                WarehouseName:

                    warehouse.WarehouseName || "",

                AddressLine1:

                    warehouse.AddressLine1 || "",

                AddressLine2:

                    warehouse.AddressLine2 || "",

                City:

                    warehouse.City || "",

                State:

                    warehouse.State || "",

                Country:

                    warehouse.Country || "",

                PostalCode:

                    warehouse.PostalCode || "",

                ContactPerson:

                    warehouse.ContactPerson || "",

                Phone:

                    warehouse.Phone || "",

                Email:

                    warehouse.Email || "",

                IsActive:

                    warehouse.IsActive ?? true

            });

        }

        else {

            setFormData(initialState);

        }

    }, [warehouse, open]);

    const handleChange = (e) => {

        const {

            name,

            value,

            checked,

            type

        } = e.target;

        setFormData(prev => ({

            ...prev,

            [name]:

                type === "checkbox"

                    ? checked

                    : value

        }));

    };

    const handleSubmit = () => {

        if (

            !formData.SellerId ||

            !formData.WarehouseCode.trim() ||

            !formData.WarehouseName.trim()

        ) {

            alert(

                "Seller, Warehouse Code and Warehouse Name are required."

            );

            return;

        }

        onSave(formData);

    };

    return (

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="md"

        >

            <DialogTitle>

                {

                    formData.WarehouseId

                        ? "Edit Warehouse"

                        : "Add Warehouse"

                }

            </DialogTitle>

            <DialogContent dividers>

                <Grid

                    container

                    spacing={2}

                    sx={{ mt: 0.5 }}

                >

                    <Grid item xs={12} md={4}>

                        <TextField

                            fullWidth

                            label="Seller ID"

                            name="SellerId"

                            type="number"

                            value={formData.SellerId}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField

                            fullWidth

                            label="Warehouse Code"

                            name="WarehouseCode"

                            value={formData.WarehouseCode}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField

                            fullWidth

                            label="Warehouse Name"

                            name="WarehouseName"

                            value={formData.WarehouseName}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12}>

                        <TextField

                            fullWidth

                            label="Address Line 1"

                            name="AddressLine1"

                            value={formData.AddressLine1}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12}>

                        <TextField

                            fullWidth

                            label="Address Line 2"

                            name="AddressLine2"

                            value={formData.AddressLine2}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField

                            fullWidth

                            label="City"

                            name="City"

                            value={formData.City}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField

                            fullWidth

                            label="State"

                            name="State"

                            value={formData.State}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField

                            fullWidth

                            label="Country"

                            name="Country"

                            value={formData.Country}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField

                            fullWidth

                            label="Postal Code"

                            name="PostalCode"

                            value={formData.PostalCode}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField

                            fullWidth

                            label="Contact Person"

                            name="ContactPerson"

                            value={formData.ContactPerson}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField

                            fullWidth

                            label="Phone"

                            name="Phone"

                            value={formData.Phone}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12}>

                        <TextField

                            fullWidth

                            label="Email"

                            name="Email"

                            type="email"

                            value={formData.Email}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12}>

                        <FormControlLabel

                            control={

                                <Checkbox

                                    name="IsActive"

                                    checked={formData.IsActive}

                                    onChange={handleChange}

                                />

                            }

                            label="Active"

                        />

                    </Grid>

                </Grid>

            </DialogContent>

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