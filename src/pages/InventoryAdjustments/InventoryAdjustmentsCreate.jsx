import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

const API_URL =
    "http://localhost:5000/api/inventory-adjustments";

const InventoryAdjustmentsCreate = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        inventoryAdjustmentId: 0,
        sellerId: "",
        productId: "",
        warehouseLocationId: "",
        adjustmentType: "",
        quantity: "",
        previousQuantity: "",
        newQuantity: "",
        reason: "",
        referenceNumber: "",
        status: "PENDING",
        createdDate: "",
        updatedDate: ""
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setLoading(true);

            const payload = {
                inventoryAdjustmentId: 0,

                sellerId:
                    Number(formData.sellerId) || 0,

                productId:
                    Number(formData.productId) || 0,

                warehouseLocationId:
                    Number(formData.warehouseLocationId) || 0,

                adjustmentType:
                    formData.adjustmentType,

                quantity:
                    Number(formData.quantity) || 0,

                previousQuantity:
                    Number(formData.previousQuantity) || 0,

                newQuantity:
                    Number(formData.newQuantity) || 0,

                reason:
                    formData.reason,

                referenceNumber:
                    formData.referenceNumber,

                status:
                    formData.status,

                createdDate:
                    formData.createdDate ||
                    new Date().toISOString(),

                updatedDate:
                    formData.updatedDate ||
                    new Date().toISOString()
            };

            await axios.post(
                API_URL,
                payload,
                {
                    timeout: 15000
                }
            );

            setSnackbar({
                open: true,
                message:
                    "Inventory adjustment created successfully.",
                severity: "success"
            });

            setTimeout(() => {
                navigate("/inventory-adjustments");
            }, 700);

        }
        catch (error) {

            console.error(
                "Create Inventory Adjustment Error:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to create inventory adjustment.",
                severity: "error"
            });

        }
        finally {

            setLoading(false);

        }
    };

    return (

        <Box sx={{ p: 2 }}>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2
                }}
            >

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() =>
                        navigate("/inventory-adjustments")
                    }
                >
                    Back
                </Button>

                <Typography
                    variant="h5"
                    fontWeight={600}
                >
                    Create Inventory Adjustment
                </Typography>

            </Box>

            <Card>

                <CardContent>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Seller ID"
                                    name="sellerId"
                                    type="number"
                                    value={formData.sellerId}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Product ID"
                                    name="productId"
                                    type="number"
                                    value={formData.productId}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Warehouse Location ID"
                                    name="warehouseLocationId"
                                    type="number"
                                    value={formData.warehouseLocationId}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Adjustment Type"
                                    name="adjustmentType"
                                    value={formData.adjustmentType}
                                    onChange={handleChange}
                                    placeholder="INCREASE / DECREASE"
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    name="quantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Previous Quantity"
                                    name="previousQuantity"
                                    type="number"
                                    value={formData.previousQuantity}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="New Quantity"
                                    name="newQuantity"
                                    type="number"
                                    value={formData.newQuantity}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Reference Number"
                                    name="referenceNumber"
                                    value={formData.referenceNumber}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 1
                                    }}
                                >

                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            navigate(
                                                "/inventory-adjustments"
                                            )
                                        }
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Saving..."
                                            : "Create Adjustment"}
                                    </Button>

                                </Box>

                            </Grid>

                        </Grid>

                    </Box>

                </CardContent>

            </Card>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() =>
                    setSnackbar((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
            >
                <Alert
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default InventoryAdjustmentsCreate;
