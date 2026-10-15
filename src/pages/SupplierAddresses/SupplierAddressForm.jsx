import React, { useEffect, useState } from "react";
import {
    Grid,
    TextField,
    MenuItem,
    Button,
    Box,
    Typography,
    Divider,
    Stack,
    CircularProgress
} from "@mui/material";
import { Save, RestartAlt, ArrowBack, LocationOn } from "@mui/icons-material";

const initialFormData = {
    supplierId: "",
    addressType: "Billing",
    addressLine1: "",
    addressLine2: "",
    countryCode: "IN",
    stateCode: "TG",
    city: "",
    pincode: "",
    phone: "",
    latitude: "",
    longitude: "",
    sellerId: "",
    customerId: ""
};

const getFieldValue = (data,...keys) => {
    for (const key of keys) {
        if (data?.[key]!== undefined && data?.[key]!== null && String(data?.[key]).trim()!== "") {
            return data[key];
        }
    }
    return "";
};

const SupplierAddressForm = ({ initialData = null, suppliers = [], loading = false, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const isEditMode = Boolean(initialData);

    useEffect(() => {
        if (initialData) {
            setFormData({
                supplierId: getFieldValue(initialData, "supplierId", "SupplierId"),
                addressType: getFieldValue(initialData, "addressType", "AddressType") || "Billing",
                addressLine1: getFieldValue(initialData, "addressLine1", "AddressLine1"),
                addressLine2: getFieldValue(initialData, "addressLine2", "AddressLine2"),
                countryCode: getFieldValue(initialData, "countryCode", "CountryCode") || "IN",
                stateCode: getFieldValue(initialData, "stateCode", "StateCode"),
                city: getFieldValue(initialData, "city", "City"),
                pincode: getFieldValue(initialData, "pincode", "Pincode"),
                phone: getFieldValue(initialData, "phone", "Phone", "phoneNumber", "PhoneNumber"),
                latitude: getFieldValue(initialData, "latitude", "Latitude"),
                longitude: getFieldValue(initialData, "longitude", "Longitude"),
                sellerId: getFieldValue(initialData, "sellerId", "SellerId"),
                customerId: getFieldValue(initialData, "customerId", "CustomerId"),
            });
        } else {
            setFormData(initialFormData);
        }
        setErrors({});
    }, [initialData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({...prev, [name]: value }));
        setErrors((prev) => ({...prev, [name]: "" }));
    };

    const handleSupplierChange = (event) => {
        setFormData((prev) => ({...prev, supplierId: event.target.value }));
        setErrors((prev) => ({...prev, supplierId: "" }));
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
            addressLine1: formData.addressLine1.trim(),
            addressLine2: formData.addressLine2.trim(),
            countryCode: formData.countryCode.trim(),
            stateCode: formData.stateCode.trim(),
            city: formData.city.trim(),
            pincode: formData.pincode.trim(),
            phone: formData.phone.trim(),
            latitude: formData.latitude.trim() || "17.4485",
            longitude: formData.longitude.trim() || "78.3908",
            sellerId: Number(formData.sellerId) || 0,
            customerId: Number(formData.customerId) || 0,
            createdDate: new Date().toISOString()
        };
        onSubmit?.(requestBody);
    };

    const handleReset = () => {
        if (loading) return;
        setFormData(initialData? {
            supplierId: getFieldValue(initialData, "supplierId", "SupplierId"),
            addressType: getFieldValue(initialData, "addressType", "AddressType") || "Billing",
            addressLine1: getFieldValue(initialData, "addressLine1", "AddressLine1"),
            addressLine2: getFieldValue(initialData, "addressLine2", "AddressLine2"),
            countryCode: getFieldValue(initialData, "countryCode", "CountryCode") || "IN",
            stateCode: getFieldValue(initialData, "stateCode", "StateCode"),
            city: getFieldValue(initialData, "city", "City"),
            pincode: getFieldValue(initialData, "pincode", "Pincode"),
            phone: getFieldValue(initialData, "phone", "Phone"),
            latitude: getFieldValue(initialData, "latitude", "Latitude"),
            longitude: getFieldValue(initialData, "longitude", "Longitude"),
            sellerId: getFieldValue(initialData, "sellerId", "SellerId"),
            customerId: getFieldValue(initialData, "customerId", "CustomerId"),
        } : initialFormData);
        setErrors({});
    };

    const renderField = ({ name, label, required = false, type = "text", placeholder = "" }) => (
        <Grid xs={12} sm={6} key={name}>
            <TextField fullWidth size="small" name={name} label={label} type={type} placeholder={placeholder} value={formData[name]?? ""} onChange={handleChange} required={required} error={Boolean(errors[name])} helperText={errors[name] || ""} disabled={loading} />
        </Grid>
    );

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", p: { xs: 2, md: 3 }, borderRadius: 2, bgcolor: "background.paper" }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <LocationOn color="primary" fontSize="large" />
                <Box>
                    <Typography variant="h5" fontWeight={700}>{isEditMode? "Edit Supplier Address" : "Add Supplier Address"}</Typography>
                    <Typography variant="body2" color="text.secondary">Enter supplier address details as per new model</Typography>
                </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2.5}>
                <Grid xs={12}><Typography variant="subtitle1" fontWeight={700}>Supplier Information</Typography></Grid>
                <Grid xs={12} sm={6}>
                    <TextField select fullWidth size="small" name="supplierId" label="Supplier" value={formData.supplierId?? ""} onChange={handleSupplierChange} required error={Boolean(errors.supplierId)} helperText={errors.supplierId || ""} disabled={loading}>
                        {suppliers.map((supplier, index) => {
                            const id = supplier.supplierId?? supplier.SupplierId?? supplier.id?? supplier.Id;
                            const name = supplier.supplierName?? supplier.SupplierName?? supplier.name?? supplier.Name;
                            return <MenuItem key={id?? index} value={id?? ""}>{name || `Supplier ${id}`}</MenuItem>;
                        })}
                    </TextField>
                </Grid>
                <Grid xs={12} sm={6}>
                    <TextField select fullWidth size="small" name="addressType" label="Address Type" value={formData.addressType} onChange={handleChange} disabled={loading}>
                        <MenuItem value="Billing">Billing</MenuItem>
                        <MenuItem value="Shipping">Shipping</MenuItem>
                        <MenuItem value="Office">Office</MenuItem>
                        <MenuItem value="Warehouse">Warehouse</MenuItem>
                    </TextField>
                </Grid>

                <Grid xs={12}><Divider sx={{ my: 1 }} /><Typography variant="subtitle1" fontWeight={700}>Address Details</Typography></Grid>
                {renderField({ name: "addressLine1", label: "Address Line 1", required: true })}
                {renderField({ name: "addressLine2", label: "Address Line 2" })}
                {renderField({ name: "countryCode", label: "Country Code", required: true, placeholder: "IN" })}
                {renderField({ name: "stateCode", label: "State Code", required: true, placeholder: "TG" })}
                {renderField({ name: "city", label: "City", required: true })}
                {renderField({ name: "pincode", label: "Pincode", required: true })}
                {renderField({ name: "phone", label: "Phone", required: true, type: "tel" })}

                <Grid xs={12}><Divider sx={{ my: 1 }} /><Typography variant="subtitle1" fontWeight={700}>Location Coordinates</Typography></Grid>
                {renderField({ name: "latitude", label: "Latitude", placeholder: "17.4485" })}
                {renderField({ name: "longitude", label: "Longitude", placeholder: "78.3908" })}

                <Grid xs={12}><Divider sx={{ my: 1 }} /><Typography variant="subtitle1" fontWeight={700}>Seller / Customer Mapping</Typography></Grid>
                {renderField({ name: "sellerId", label: "Seller ID", type: "number" })}
                {renderField({ name: "customerId", label: "Customer ID", type: "number" })}
            </Grid>

            <Divider sx={{ mt: 3, mb: 2 }} />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end">
                <Button variant="outlined" color="inherit" startIcon={<ArrowBack />} onClick={onCancel} disabled={loading}>Cancel</Button>
                <Button variant="outlined" startIcon={<RestartAlt />} onClick={handleReset} disabled={loading}>Reset</Button>
                <Button type="submit" variant="contained" startIcon={loading? <CircularProgress size={18} color="inherit" /> : <Save />} disabled={loading}>{loading? "Saving..." : isEditMode? "Update Address" : "Create Address"}</Button>
            </Stack>
        </Box>
    );
};

export default SupplierAddressForm;
