// =========================================================
// ProductInventoryEdit.jsx
// Edit Product Inventory
// =========================================================

import React, {
    useEffect,
    useState,
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    MenuItem,
    TextField,
} from "@mui/material";

import axios from "axios";


// =========================================================
// CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";


// =========================================================
// COMPONENT
// =========================================================

const ProductInventoryEdit = ({
    open,
    inventory,
    onClose,
    onUpdated,
}) => {

    const [formData, setFormData] = useState({
        ProductInventoryId: "",
        ProductId: "",
        SellerId: "",
        CustomerId: "",
        WarehouseId: "",
        Quantity: 0,
        AvailableQuantity: 0,
        ReservedQuantity: 0,
        ReorderLevel: 0,
        MinStockLevel: 0,
        MaxStockLevel: 0,
        StockStatus: "In Stock",
        IsActive: true,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =========================================================
    // LOAD INVENTORY INTO FORM
    // =========================================================

    useEffect(() => {

        if (!inventory) {
            return;
        }

        setFormData({
            ProductInventoryId:
                inventory.ProductInventoryId ?? "",

            ProductId:
                inventory.ProductId ?? "",

            SellerId:
                inventory.SellerId ?? "",

            CustomerId:
                inventory.CustomerId ?? "",

            WarehouseId:
                inventory.WarehouseId ?? "",

            Quantity:
                inventory.Quantity ?? 0,

            AvailableQuantity:
                inventory.AvailableQuantity ?? 0,

            ReservedQuantity:
                inventory.ReservedQuantity ?? 0,

            ReorderLevel:
                inventory.ReorderLevel ?? 0,

            MinStockLevel:
                inventory.MinStockLevel ?? 0,

            MaxStockLevel:
                inventory.MaxStockLevel ?? 0,

            StockStatus:
                inventory.StockStatus ?? "In Stock",

            IsActive:
                inventory.IsActive ?? true,
        });

        setError("");
        setSuccess("");

    }, [inventory, open]);


    // =========================================================
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData((previous) => ({
            ...previous,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const payload = {
                ProductInventoryId:
                    Number(formData.ProductInventoryId),

                ProductId:
                    Number(formData.ProductId),

                SellerId:
                    Number(formData.SellerId),

                CustomerId:
                    formData.CustomerId === ""
                        ? null
                        : Number(formData.CustomerId),

                WarehouseId:
                    formData.WarehouseId === ""
                        ? null
                        : Number(formData.WarehouseId),

                Quantity:
                    Number(formData.Quantity),

                AvailableQuantity:
                    Number(formData.AvailableQuantity),

                ReservedQuantity:
                    Number(formData.ReservedQuantity),

                ReorderLevel:
                    Number(formData.ReorderLevel),

                MinStockLevel:
                    Number(formData.MinStockLevel),

                MaxStockLevel:
                    Number(formData.MaxStockLevel),

                StockStatus:
                    formData.StockStatus,

                IsActive:
                    Boolean(formData.IsActive),
            };


            const response = await axios.put(
                `${SERVER_URL}/api/productinventory/${formData.ProductInventoryId}`,
                payload
            );


            setSuccess(
                response.data?.message ||
                "Inventory updated successfully."
            );


            if (onUpdated) {
                onUpdated(
                    response.data?.data ||
                    response.data
                );
            }


            setTimeout(() => {

                if (onClose) {
                    onClose();
                }

            }, 700);


        } catch (err) {

            console.error(
                "Update inventory error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                "Failed to update inventory."
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>
                Edit Product Inventory
            </DialogTitle>

            <Divider />

            <Box
                component="form"
                onSubmit={handleSubmit}
            >

                <DialogContent>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{ mb: 2 }}
                        >
                            {success}
                        </Alert>
                    )}


                    <Grid
                        container
                        spacing={2}
                    >

                        {/* PRODUCT ID */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Product ID"
                                name="ProductId"
                                value={formData.ProductId}
                                onChange={handleChange}
                                type="number"
                                required
                            />

                        </Grid>


                        {/* SELLER ID */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Seller ID"
                                name="SellerId"
                                value={formData.SellerId}
                                onChange={handleChange}
                                type="number"
                                required
                            />

                        </Grid>


                        {/* CUSTOMER ID */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Customer ID"
                                name="CustomerId"
                                value={formData.CustomerId}
                                onChange={handleChange}
                                type="number"
                            />

                        </Grid>


                        {/* WAREHOUSE ID */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Warehouse ID"
                                name="WarehouseId"
                                value={formData.WarehouseId}
                                onChange={handleChange}
                                type="number"
                            />

                        </Grid>


                        {/* QUANTITY */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Quantity"
                                name="Quantity"
                                value={formData.Quantity}
                                onChange={handleChange}
                                type="number"
                                inputProps={{
                                    min: 0,
                                }}
                                required
                            />

                        </Grid>


                        {/* AVAILABLE QUANTITY */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Available Quantity"
                                name="AvailableQuantity"
                                value={
                                    formData.AvailableQuantity
                                }
                                onChange={handleChange}
                                type="number"
                                inputProps={{
                                    min: 0,
                                }}
                                required
                            />

                        </Grid>


                        {/* RESERVED QUANTITY */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Reserved Quantity"
                                name="ReservedQuantity"
                                value={
                                    formData.ReservedQuantity
                                }
                                onChange={handleChange}
                                type="number"
                                inputProps={{
                                    min: 0,
                                }}
                                required
                            />

                        </Grid>


                        {/* REORDER LEVEL */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Reorder Level"
                                name="ReorderLevel"
                                value={
                                    formData.ReorderLevel
                                }
                                onChange={handleChange}
                                type="number"
                                inputProps={{
                                    min: 0,
                                }}
                            />

                        </Grid>


                        {/* MIN STOCK */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Minimum Stock Level"
                                name="MinStockLevel"
                                value={
                                    formData.MinStockLevel
                                }
                                onChange={handleChange}
                                type="number"
                                inputProps={{
                                    min: 0,
                                }}
                            />

                        </Grid>


                        {/* MAX STOCK */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                label="Maximum Stock Level"
                                name="MaxStockLevel"
                                value={
                                    formData.MaxStockLevel
                                }
                                onChange={handleChange}
                                type="number"
                                inputProps={{
                                    min: 0,
                                }}
                            />

                        </Grid>


                        {/* STOCK STATUS */}

                        <Grid item xs={12} md={6}>

                            <TextField
                                select
                                fullWidth
                                label="Stock Status"
                                name="StockStatus"
                                value={
                                    formData.StockStatus
                                }
                                onChange={handleChange}
                            >

                                <MenuItem value="In Stock">
                                    In Stock
                                </MenuItem>

                                <MenuItem value="Low Stock">
                                    Low Stock
                                </MenuItem>

                                <MenuItem value="Out of Stock">
                                    Out of Stock
                                </MenuItem>

                                <MenuItem value="Overstock">
                                    Overstock
                                </MenuItem>

                            </TextField>

                        </Grid>


                        {/* ACTIVE */}

                        <Grid item xs={12}>

                            <TextField
                                select
                                fullWidth
                                label="Active Status"
                                name="IsActive"
                                value={
                                    formData.IsActive
                                        ? "true"
                                        : "false"
                                }
                                onChange={(event) => {

                                    setFormData(
                                        (previous) => ({
                                            ...previous,
                                            IsActive:
                                                event.target.value ===
                                                "true",
                                        })
                                    );

                                }}
                            >

                                <MenuItem value="true">
                                    Active
                                </MenuItem>

                                <MenuItem value="false">
                                    Inactive
                                </MenuItem>

                            </TextField>

                        </Grid>

                    </Grid>

                </DialogContent>


                <DialogActions
                    sx={{ px: 3, pb: 2 }}
                >

                    <Button
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>


                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <CircularProgress
                                    size={20}
                                    sx={{ mr: 1 }}
                                />

                                Updating...
                            </>
                        ) : (
                            "Update Inventory"
                        )}

                    </Button>

                </DialogActions>

            </Box>

        </Dialog>
    );
};


export default ProductInventoryEdit;

