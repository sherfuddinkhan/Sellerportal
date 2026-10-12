import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField, MenuItem, Typography, Divider, Box, CircularProgress } from "@mui/material";
import { LocationOn, Save, Close } from "@mui/icons-material";

const initialFormData = {
    supplierId: "",
    supplierName: "",
    addressType: "Billing",
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateCode: "TG",
    countryCode: "IN",
    pincode: "",
    phone: "",
    latitude: "",
    longitude: "",
    sellerId: "",
    customerId: ""
};

const SupplierAddressModal = ({ open, onClose, onSubmit, selectedSupplierAddress = null, loading = false, suppliers = [] }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const isEditMode = Boolean(selectedSupplierAddress);

    const getFieldValue = (data,...keys) => {
        for (const key of keys) {
            if (data?.[key]!== undefined && data?.[key]!== null && String(data[key]).trim()!== "") return data[key];
        }
        return "";
    };

    useEffect(() => {
        if (!open) return;
        if (selectedSupplierAddress) {
            setFormData({
                supplierId: getFieldValue(selectedSupplierAddress, "supplierId", "SupplierId"),
                supplierName: getFieldValue(selectedSupplierAddress, "supplierName", "SupplierName"),
                addressType: getFieldValue(selectedSupplierAddress, "addressType", "AddressType") || "Billing",
                addressLine1: getFieldValue(selectedSupplierAddress, "addressLine1", "AddressLine1"),
                addressLine2: getFieldValue(selectedSupplierAddress, "addressLine2", "AddressLine2"),
                city: getFieldValue(selectedSupplierAddress, "city", "City"),
                stateCode: getFieldValue(selectedSupplierAddress, "stateCode", "StateCode", "state", "State"),
                countryCode: getFieldValue(selectedSupplierAddress, "countryCode", "CountryCode", "country", "Country") || "IN",
                pincode: getFieldValue(selectedSupplierAddress, "pincode", "Pincode", "postalCode", "PostalCode"),
                phone: getFieldValue(selectedSupplierAddress, "phone", "Phone", "phoneNumber", "PhoneNumber"),
                latitude: getFieldValue(selectedSupplierAddress, "latitude", "Latitude"),
                longitude: getFieldValue(selectedSupplierAddress, "longitude", "Longitude"),
                sellerId: getFieldValue(selectedSupplierAddress, "sellerId", "SellerId"),
                customerId: getFieldValue(selectedSupplierAddress, "customerId", "CustomerId"),
            });
        } else {
            setFormData(initialFormData);
        }
        setErrors({});
    }, [open, selectedSupplierAddress]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({...prev, [name]: value }));
        setErrors((prev) => ({...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.supplierId) newErrors.supplierId = "Supplier is required";
        if (!String(formData.addressLine1).trim()) newErrors.addressLine1 = "Address line 1 is required";
        if (!String(formData.city).trim()) newErrors.city = "City is required";
        if (!String(formData.stateCode).trim()) newErrors.stateCode = "State code is required";
        if (!String(formData.countryCode).trim()) newErrors.countryCode = "Country code is required";
        if (!String(formData.pincode).trim()) newErrors.pincode = "Pincode is required";
        if (!String(formData.phone).trim()) newErrors.phone = "Phone is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (loading ||!validateForm()) return;

        const requestBody = {
            supplierId: Number(formData.supplierId),
            addressType: formData.addressType,
            addressLine1: String(formData.addressLine1).trim(),
            addressLine2: String(formData.addressLine2 || "").trim(),
            city: String(formData.city).trim(),
            stateCode: String(formData.stateCode).trim(),
            countryCode: String(formData.countryCode).trim(),
            pincode: String(formData.pincode).trim(),
            phone: String(formData.phone).trim(),
            latitude: String(formData.latitude || "17.4485").trim(),
            longitude: String(formData.longitude || "78.3908").trim(),
            sellerId: Number(formData.sellerId) || 0,
            customerId: Number(formData.customerId) || 0,
            createdDate: new Date().toISOString()
        };
        onSubmit?.(requestBody);
    };

    const renderField = ({ name, label, required = false, type = "text" }) => (
        <Grid item xs={12} sm={6} key={name}>
            <TextField fullWidth name={name} label={label} type={type} value={formData[name]?? ""} onChange={handleChange} required={required} error={Boolean(errors[name])} helperText={errors[name] || ""} disabled={loading} size="small" />
        </Grid>
    );

    return (
        <Dialog open={open} onClose={loading? undefined : onClose} fullWidth maxWidth="md" scroll="paper">
            <Box component="form" onSubmit={handleSubmit}>
                <DialogTitle><Box display="flex" alignItems="center" gap={1}><LocationOn color="primary" /><Typography variant="h6" fontWeight={700}>{isEditMode? "Edit Supplier Address" : "Add Supplier Address"}</Typography></Box></DialogTitle>
                <Divider />
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}><Typography variant="subtitle1" fontWeight={700}>Supplier Information</Typography></Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField select fullWidth size="small" name="supplierId" label="Supplier" value={formData.supplierId?? ""} onChange={(e) => {
                                const supplierId = e.target.value;
                                const supplier = suppliers.find(item => String(item.supplierId?? item.SupplierId?? item.id) === String(supplierId));
                                setFormData(prev => ({...prev, supplierId, supplierName: supplier?.supplierName?? supplier?.name?? "" }));
                                setErrors(prev => ({...prev, supplierId: "" }));
                            }} error={Boolean(errors.supplierId)} helperText={errors.supplierId || ""} disabled={loading} required>
                                {suppliers.map((supplier, index) => {
                                    const id = supplier.supplierId?? supplier.SupplierId?? supplier.id?? supplier.Id;
                                    const name = supplier.supplierName?? supplier.SupplierName?? supplier.name?? supplier.Name;
                                    return <MenuItem key={id?? index} value={id?? ""}>{name || `Supplier ${id}`}</MenuItem>;
                                })}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField select fullWidth size="small" name="addressType" label="Address Type" value={formData.addressType} onChange={handleChange} disabled={loading}>
                                <MenuItem value="Billing">Billing</MenuItem>
                                <MenuItem value="Shipping">Shipping</MenuItem>
                                <MenuItem value="Office">Office</MenuItem>
                                <MenuItem value="Warehouse">Warehouse</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}><Divider sx={{ my: 1 }} /><Typography variant="subtitle1" fontWeight={700}>Address Details</Typography></Grid>
                        {renderField({ name: "addressLine1", label: "Address Line 1", required: true })}
                        {renderField({ name: "addressLine2", label: "Address Line 2" })}
                        {renderField({ name: "countryCode", label: "Country Code (IN)", required: true })}
                        {renderField({ name: "stateCode", label: "State Code (TG)", required: true })}
                        {renderField({ name: "city", label: "City", required: true })}
                        {renderField({ name: "pincode", label: "Pincode", required: true })}
                        {renderField({ name: "phone", label: "Phone", required: true })}

                        <Grid item xs={12}><Divider sx={{ my: 1 }} /><Typography variant="subtitle1" fontWeight={700}>Location & Mapping</Typography></Grid>
                        {renderField({ name: "latitude", label: "Latitude (17.4485)" })}
                        {renderField({ name: "longitude", label: "Longitude (78.3908)" })}
                        {renderField({ name: "sellerId", label: "Seller ID", type: "number" })}
                        {renderField({ name: "customerId", label: "Customer ID", type: "number" })}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" startIcon={loading? <CircularProgress size={18} color="inherit" /> : <Save />} disabled={loading}>{loading? "Saving..." : isEditMode? "Update Address" : "Save Address"}</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default SupplierAddressModal;