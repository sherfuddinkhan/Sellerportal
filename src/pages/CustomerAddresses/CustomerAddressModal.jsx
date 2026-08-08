import React, { useEffect, useState } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Grid,TextField,Button,FormControlLabel,Checkbox,MenuItem} from "@mui/material";

const CustomerAddressModal = ({
    open,
    address,
    onClose,
    onSave
}) => {
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
    const [formData, setFormData] = useState(initialState);
    useEffect(() => {
        if (address) {
            setFormData({
                CustomerAddressId:
                    address.CustomerAddressId || 0,
                CustomerId:
                    address.CustomerId || "",
                AddressType:
                    address.AddressType || "",
                AddressLine1:
                    address.AddressLine1 || "",
                AddressLine2:
                    address.AddressLine2 || "",
                City:
                    address.City || "",
                State:
                    address.State || "",
                Country:
                    address.Country || "",
                PostalCode:
                    address.PostalCode || "",
                IsDefault:
                    address.IsDefault ?? false
            });
        }
        else {
            setFormData(initialState);
        }
    }, [address, open]);

    const handleChange = (e) => {
        const {name, value,checked,type} = e.target;
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
            !formData.CustomerId ||
            !formData.AddressType ||
            !formData.AddressLine1
        ) {
            alert("Customer ID, Address Type and Address Line 1 are required.");
            return;
        }
        onSave({ ...formData});
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
                    formData.CustomerAddressId
                        ? "Edit Customer Address"
                        : "Add Customer Address"
                }
            </DialogTitle>
            <DialogContent dividers>
                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >
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
                            value={formData.CustomerId}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <TextField
                            select
                            fullWidth
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
                            <MenuItem value="Office">
                                Office
                            </MenuItem>
                            <MenuItem value="Home">
                                Home
                            </MenuItem>
                        </TextField>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            label="Address Line 1"
                            name="AddressLine1"
                            value={formData.AddressLine1}
                            onChange={handleChange}
                        />
                    </Grid>
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
                    <Grid
                        item
                        xs={12}
                    >
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="IsDefault"
                                    checked={formData.IsDefault}
                                    onChange={handleChange}
                                />
                            }
                            label="Default Address"
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
                        formData.CustomerAddressId
                            ? "Update"
                            : "Save"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerAddressModal;