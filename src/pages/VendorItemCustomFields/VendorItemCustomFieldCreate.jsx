
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";

const API_URL = "http://localhost:5000/api/vendor-item-custom-fields";
const SUPPLIERS_API_URL = "http://localhost:5000/api/Supplier";
const ITEMS_API_URL = "http://localhost:5000/api/catalog/products/all";

const getList = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.$values)) return data.$values;

    return [];
};

const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.includes("<!DOCTYPE")) {
        return "The requested API route was not found. Check the Node.js proxy route.";
    }

    if (typeof data === "string") return data;

    return (
        data?.message ||
        data?.title ||
        error?.message ||
        "An unexpected error occurred."
    );
};

const getSupplierId = (item) =>
    item?.id ??
    item?.Id ??
    item?.supplierId ??
    item?.SupplierId;

const getSupplierName = (item) =>
    item?.name ??
    item?.Name ??
    item?.supplierName ??
    item?.SupplierName ??
    `Supplier ${getSupplierId(item) ?? ""}`;

const getItemId = (item) =>
    item?.vendorItemMasterId ??
    item?.VendorItemMasterId ??
    item?.id ??
    item?.Id ??
    item?.productId ??
    item?.ProductId;

const getItemName = (item) =>
    item?.name ??
    item?.Name ??
    item?.itemName ??
    item?.ItemName ??
    item?.productName ??
    item?.ProductName ??
    item?.sku ??
    item?.SKU ??
    `Item ${getItemId(item) ?? ""}`;

 function VendorItemCustomFieldCreate() {
    const navigate = useNavigate();

    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);

    const [loadingLists, setLoadingLists] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        vendorItemMasterId: "",
        name: "",
        value: "",
        sellerId: "",
        customerId: ""
    });

    useEffect(() => {
        loadDropdownData();
    }, []);

    const loadDropdownData = async () => {
        setLoadingLists(true);
        setError("");

        try {
            const [supplierResponse, itemResponse] = await Promise.all([
                axios.get(SUPPLIERS_API_URL),
                axios.get(ITEMS_API_URL)
            ]);

            const supplierList = getList(supplierResponse);
            const itemList = getList(itemResponse);

            setSuppliers(supplierList);
            setItems(itemList);

            if (!supplierList.length) {
                console.warn("Supplier API returned no records.");
            }

            if (!itemList.length) {
                console.warn(
                    "Catalog products API returned no records. Check the endpoint and response format."
                );
            }
        } catch (err) {
            console.error("Dropdown API error:", err);
            setError(
                `Unable to load suppliers or items. ${getErrorMessage(err)}`
            );
        } finally {
            setLoadingLists(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.vendorItemMasterId) {
            setError("Please select an item.");
            return;
        }

        if (!formData.name.trim()) {
            setError("Please enter the custom field name.");
            return;
        }

        if (!formData.sellerId || !formData.customerId) {
            setError("Please enter both Seller ID and Customer ID.");
            return;
        }

        const payload = {
            vendorItemMasterId: Number(formData.vendorItemMasterId),
            name: formData.name.trim(),
            value: formData.value.trim() || null,
            sellerId: Number(formData.sellerId),
            customerId: Number(formData.customerId)
        };

        setSaving(true);

        try {
            await axios.post(API_URL, payload);

            setSuccess(true);

            setTimeout(() => {
                navigate("/vendor-item-custom-fields");
            }, 1000);
        } catch (err) {
            console.error(
                "Create Vendor Item Custom Field error:",
                err.response?.data || err
            );

            setError(
                `Unable to create custom field. ${getErrorMessage(err)}`
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1000, mx: "auto" }}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700}>
                        Create Vendor Item Custom Field
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Add a custom field to a vendor item.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/vendor-item-custom-fields")}
                >
                    Back to List
                </Button>
            </Stack>

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={2}
                sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}
            >
                {loadingLists ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2,
                            py: 5
                        }}
                    >
                        <CircularProgress size={26} />
                        <Typography>Loading suppliers and items...</Typography>
                    </Box>
                ) : (
                    <Stack spacing={3}>
                        <Typography variant="h6" fontWeight={600}>
                            Custom Field Details
                        </Typography>

                        <FormControl fullWidth required>
                            <InputLabel id="vendor-item-label">
                                Vendor Item
                            </InputLabel>

                            <Select
                                labelId="vendor-item-label"
                                name="vendorItemMasterId"
                                value={formData.vendorItemMasterId}
                                label="Vendor Item"
                                onChange={handleChange}
                            >
                                {items.map((item, index) => {
                                    const id = getItemId(item);

                                    if (id == null) return null;

                                    return (
                                        <MenuItem
                                            key={id ?? index}
                                            value={String(id)}
                                        >
                                            {getItemName(item)} (ID: {id})
                                        </MenuItem>
                                    );
                                })}
                            </Select>

                            {items.length === 0 && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                    sx={{ mt: 1 }}
                                >
                                    No items were returned. Verify the catalog
                                    API route and its response.
                                </Typography>
                            )}
                        </FormControl>

                        <TextField
                            label="Field Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{ maxLength: 250 }}
                            placeholder="Example: Color"
                        />

                        <TextField
                            label="Field Value"
                            name="value"
                            value={formData.value}
                            onChange={handleChange}
                            fullWidth
                            multiline
                            minRows={2}
                            placeholder="Example: Red"
                        />

                        <Typography variant="h6" fontWeight={600}>
                            Seller and Customer
                        </Typography>

                        <FormControl fullWidth required>
                            <InputLabel id="supplier-label">
                                Supplier
                            </InputLabel>

                            <Select
                                labelId="supplier-label"
                                name="sellerId"
                                value={formData.sellerId}
                                label="Supplier"
                                onChange={handleChange}
                            >
                                {suppliers.map((supplier, index) => {
                                    const id = getSupplierId(supplier);

                                    if (id == null) return null;

                                    return (
                                        <MenuItem
                                            key={id ?? index}
                                            value={String(id)}
                                        >
                                            {getSupplierName(supplier)} (ID: {id})
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Customer ID"
                            name="customerId"
                            type="number"
                            value={formData.customerId}
                            onChange={handleChange}
                            fullWidth
                            required
                            inputProps={{ min: 1 }}
                        />

                        <Alert severity="info">
                            This form uses the fields currently supported by
                            the backend model: Vendor Item Master ID, Name,
                            Value, Seller ID, and Customer ID.
                        </Alert>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            justifyContent="flex-end"
                        >
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={loadDropdownData}
                                disabled={loadingLists || saving}
                            >
                                Reload Dropdowns
                            </Button>

                            <Button
                                type="button"
                                variant="outlined"
                                onClick={() =>
                                    navigate("/vendor-item-custom-fields")
                                }
                                disabled={saving}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    saving ? (
                                        <CircularProgress
                                            size={18}
                                            color="inherit"
                                        />
                                    ) : (
                                        <SaveIcon />
                                    )
                                }
                                disabled={saving || loadingLists}
                            >
                                {saving ? "Saving..." : "Save Custom Field"}
                            </Button>
                        </Stack>
                    </Stack>
                )}
            </Paper>

            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={() => setSuccess(false)}
                message="Vendor item custom field created successfully."
            />
        </Box>
    );
}
export default VendorItemCustomFieldCreate
