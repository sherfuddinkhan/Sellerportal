import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Snackbar,
    Switch,
    FormControlLabel,
    TextField,
    Typography
} from "@mui/material";

import {
    Save,
    ArrowBack,
    RestartAlt
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/VendorItemMaster";

const INITIAL_FORM_DATA = {
    vendorId: "1",
    sellerId: "6",
    customerId: "3",
    productId: "6",
    vendorSkuCode: "",
    itemSkuCode: "",
    itemCode: "",
    itemSku: "",
    SKU: "",
    vendorCode: "",
    vendorItemCode: "",
    costPrice: "",
    unitPrice: "",
    MRP: "",
    sellingPrice: "",
    inventory: "",
    LeadTime: "0",
    priority: "1",
    enabled: true,
    IsActive: true
};

const VendorItemMasterCreate = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ...INITIAL_FORM_DATA
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [notification, setNotification] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    const validateForm = () => {
        const nextErrors = {};

        [
            "vendorId",
            "sellerId",
            "customerId"
        ].forEach((field) => {
            const value = Number(formData[field]);

            if (
                formData[field] === "" ||
                !Number.isInteger(value) ||
                value <= 0
            ) {
                nextErrors[field] = "Enter a valid positive ID.";
            }
        });

        if (
            formData.productId !== "" &&
            (!Number.isInteger(Number(formData.productId)) ||
                Number(formData.productId) <= 0)
        ) {
            nextErrors.productId = "Enter a valid product ID or leave blank.";
        }

        if (!formData.vendorSkuCode.trim()) {
            nextErrors.vendorSkuCode = "Vendor SKU code is required.";
        }

        if (!formData.itemSkuCode.trim()) {
            nextErrors.itemSkuCode = "Item SKU code is required.";
        }

        [
            "costPrice",
            "unitPrice",
            "MRP",
            "sellingPrice"
        ].forEach((field) => {
            if (
                formData[field] !== "" &&
                (!Number.isFinite(Number(formData[field])) ||
                    Number(formData[field]) < 0)
            ) {
                nextErrors[field] = "Enter a valid non-negative price.";
            }
        });

        if (
            formData.costPrice === "" ||
            !Number.isFinite(Number(formData.costPrice)) ||
            Number(formData.costPrice) < 0
        ) {
            nextErrors.costPrice = "Cost price is required and cannot be negative.";
        }

        [
            "inventory",
            "LeadTime",
            "priority"
        ].forEach((field) => {
            if (
                formData[field] !== "" &&
                (!Number.isInteger(Number(formData[field])) ||
                    Number(formData[field]) < 0)
            ) {
                nextErrors[field] = "Enter a non-negative whole number.";
            }
        });

        if (formData.LeadTime === "") {
            nextErrors.LeadTime = "Lead time is required.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const showNotification = (message, severity = "success") => {
        setNotification({
            open: true,
            severity,
            message
        });
    };

    const handleReset = () => {
        setFormData({ ...INITIAL_FORM_DATA });
        setErrors({});
    };

    const getErrorMessage = (error) => {
        const data = error.response?.data;

        if (typeof data === "string") {
            return data;
        }

        if (data?.errors) {
            return Object.values(data.errors).flat().join(" ");
        }

        return (
            data?.message ||
            data?.title ||
            data?.detail ||
            error.message ||
            "Unable to create vendor item master."
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            showNotification("Please correct the highlighted fields.", "error");
            return;
        }

        const sellerId = Number(formData.sellerId);
        const customerId = Number(formData.customerId);

        const payload = {
            vendorId: Number(formData.vendorId),
            sellerId,
            customerId,
            productId:
                formData.productId === ""
                    ? null
                    : Number(formData.productId),

            vendorSkuCode: formData.vendorSkuCode.trim(),
            itemSkuCode: formData.itemSkuCode.trim(),
            itemCode: formData.itemCode.trim() || null,
            itemSku: formData.itemSku.trim() || null,
            SKU: formData.SKU.trim() || null,
            vendorCode: formData.vendorCode.trim() || null,
            VendorItemCode: formData.vendorItemCode.trim() || null,

            CostPrice: Number(formData.costPrice),
            unitPrice:
                formData.unitPrice === ""
                    ? null
                    : Number(formData.unitPrice),
            MRP: formData.MRP === "" ? null : Number(formData.MRP),
            SellingPrice:
                formData.sellingPrice === ""
                    ? null
                    : Number(formData.sellingPrice),

            inventory:
                formData.inventory === ""
                    ? null
                    : Number(formData.inventory),
            LeadTime: Number(formData.LeadTime),
            priority:
                formData.priority === ""
                    ? null
                    : Number(formData.priority),

            enabled: formData.enabled,
            IsActive: formData.IsActive
        };

        try {
            setLoading(true);

            const response = await axios.post(
                `${API_URL}/seller/${sellerId}/customer/${customerId}`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            showNotification(
                "Vendor item master created successfully.",
                "success"
            );

            // Redirect to the list page after a successful create.
            navigate("/vendor-item-masters", {
                replace: true,
                state: {
                    successMessage:
                        "Vendor item master created successfully.",
                    createdItem: response.data
                }
            });
        } catch (error) {
            console.error(
                "CREATE VENDOR ITEM MASTER ERROR:",
                error.response?.data || error
            );

            showNotification(getErrorMessage(error), "error");
        } finally {
            setLoading(false);
        }
    };

    const renderTextField = (
        name,
        label,
        options = {}
    ) => (
        <Grid xs={12} sm={6} key={name}>
            <TextField
                fullWidth
                name={name}
                label={label}
                value={formData[name]}
                onChange={handleChange}
                error={Boolean(errors[name])}
                helperText={errors[name] || options.helperText || ""}
                disabled={loading}
                required={Boolean(options.required)}
                type={options.type || "text"}
                inputProps={options.inputProps}
                multiline={options.multiline || false}
                minRows={options.minRows}
            />
        </Grid>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    p: { xs: 2, md: 3 },
                    borderRadius: 2
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                    mb={2}
                >
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            Create Vendor Item Master
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            Enter vendor, seller, customer, SKU and pricing details.
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/vendor-item-masters")}
                        disabled={loading}
                    >
                        Back to List
                    </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Ownership and Product
                    </Typography>

                    <Grid container spacing={2.5}>
                        {renderTextField("vendorId", "Vendor ID", {
                            required: true,
                            type: "number",
                            inputProps: { min: 1, step: 1 }
                        })}

                        {renderTextField("sellerId", "Seller ID", {
                            required: true,
                            type: "number",
                            inputProps: { min: 1, step: 1 }
                        })}

                        {renderTextField("customerId", "Customer ID", {
                            required: true,
                            type: "number",
                            inputProps: { min: 1, step: 1 }
                        })}

                        {renderTextField("productId", "Product ID (optional)", {
                            type: "number",
                            inputProps: { min: 1, step: 1 }
                        })}

                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                SKU and Item Codes
                            </Typography>
                        </Grid>

                        {renderTextField("vendorSkuCode", "Vendor SKU Code", {
                            required: true,
                            inputProps: { maxLength: 100 }
                        })}

                        {renderTextField("itemSkuCode", "Item SKU Code", {
                            required: true,
                            inputProps: { maxLength: 100 }
                        })}

                        {renderTextField("itemCode", "Item Code", {
                            inputProps: { maxLength: 100 }
                        })}

                        {renderTextField("itemSku", "Item SKU", {
                            inputProps: { maxLength: 100 }
                        })}

                        {renderTextField("SKU", "SKU", {
                            inputProps: { maxLength: 100 }
                        })}

                        {renderTextField("vendorCode", "Vendor Code", {
                            inputProps: { maxLength: 100 }
                        })}

                        {renderTextField("vendorItemCode", "Vendor Item Code", {
                            inputProps: { maxLength: 100 }
                        })}

                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Pricing
                            </Typography>
                        </Grid>

                        {renderTextField("costPrice", "Cost Price", {
                            required: true,
                            type: "number",
                            inputProps: { min: 0, step: "0.01" }
                        })}

                        {renderTextField("unitPrice", "Unit Price", {
                            type: "number",
                            inputProps: { min: 0, step: "0.01" }
                        })}

                        {renderTextField("MRP", "MRP", {
                            type: "number",
                            inputProps: { min: 0, step: "0.01" }
                        })}

                        {renderTextField("sellingPrice", "Selling Price", {
                            type: "number",
                            inputProps: { min: 0, step: "0.01" }
                        })}

                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                Inventory and Status
                            </Typography>
                        </Grid>

                        {renderTextField("inventory", "Inventory Quantity", {
                            type: "number",
                            inputProps: { min: 0, step: 1 }
                        })}

                        {renderTextField("LeadTime", "Lead Time (days)", {
                            required: true,
                            type: "number",
                            inputProps: { min: 0, step: 1 }
                        })}

                        {renderTextField("priority", "Priority", {
                            type: "number",
                            inputProps: { min: 0, step: 1 }
                        })}

                        <Grid xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="enabled"
                                        checked={Boolean(formData.enabled)}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                }
                                label="Enabled"
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name="IsActive"
                                        checked={Boolean(formData.IsActive)}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                }
                                label="Active"
                            />
                        </Grid>

                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Box
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                                flexWrap="wrap"
                                mt={2}
                            >
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<RestartAlt />}
                                    onClick={handleReset}
                                    disabled={loading}
                                >
                                    Reset
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        loading
                                            ? <CircularProgress
                                                size={18}
                                                color="inherit"
                                              />
                                            : <Save />
                                    }
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Create Item"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                onClose={() =>
                    setNotification((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
            >
                <Alert
                    severity={notification.severity}
                    variant="filled"
                    onClose={() =>
                        setNotification((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default VendorItemMasterCreate;
