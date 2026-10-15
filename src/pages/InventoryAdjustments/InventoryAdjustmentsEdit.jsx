import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

const API_URL =
    "http://localhost:5000/api/inventory-adjustments";

const InventoryAdjustmentsEdit = () => {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [formData, setFormData] =
        useState(null);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success"
        });


    useEffect(() => {

        const loadAdjustment = async () => {

            try {

                setLoading(true);

                const response =
                    await axios.get(
                        `${API_URL}/${encodeURIComponent(id)}`,
                        {
                            timeout: 15000
                        }
                    );

                const data =
                    response.data;

                const item =
                    data?.data ??
                    data?.result ??
                    data;

                setFormData({
                    inventoryAdjustmentId:
                        item?.inventoryAdjustmentId ??
                        item?.InventoryAdjustmentId ??
                        id,

                    sellerId:
                        item?.sellerId ??
                        item?.SellerId ??
                        "",

                    productId:
                        item?.productId ??
                        item?.ProductId ??
                        "",

                    warehouseLocationId:
                        item?.warehouseLocationId ??
                        item?.WarehouseLocationId ??
                        "",

                    adjustmentType:
                        item?.adjustmentType ??
                        item?.AdjustmentType ??
                        "",

                    quantity:
                        item?.quantity ??
                        item?.Quantity ??
                        "",

                    previousQuantity:
                        item?.previousQuantity ??
                        item?.PreviousQuantity ??
                        "",

                    newQuantity:
                        item?.newQuantity ??
                        item?.NewQuantity ??
                        "",

                    reason:
                        item?.reason ??
                        item?.Reason ??
                        "",

                    referenceNumber:
                        item?.referenceNumber ??
                        item?.ReferenceNumber ??
                        "",

                    status:
                        item?.status ??
                        item?.Status ??
                        "",

                    createdDate:
                        item?.createdDate ??
                        item?.CreatedDate ??
                        "",

                    updatedDate:
                        item?.updatedDate ??
                        item?.UpdatedDate ??
                        ""
                });

            }
            catch (error) {

                console.error(
                    "Load Inventory Adjustment Error:",
                    error
                );

                setSnackbar({
                    open: true,
                    message:
                        error?.response?.data?.message ||
                        error?.message ||
                        "Failed to load inventory adjustment.",
                    severity: "error"
                });

            }
            finally {

                setLoading(false);

            }
        };

        if (id) {
            loadAdjustment();
        }

    }, [id]);


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);

            const payload = {
                ...formData,

                inventoryAdjustmentId:
                    Number(
                        formData.inventoryAdjustmentId
                    ) || 0,

                sellerId:
                    Number(formData.sellerId) || 0,

                productId:
                    Number(formData.productId) || 0,

                warehouseLocationId:
                    Number(
                        formData.warehouseLocationId
                    ) || 0,

                quantity:
                    Number(formData.quantity) || 0,

                previousQuantity:
                    Number(
                        formData.previousQuantity
                    ) || 0,

                newQuantity:
                    Number(
                        formData.newQuantity
                    ) || 0,

                updatedDate:
                    new Date().toISOString()
            };

            await axios.put(
                `${API_URL}/${encodeURIComponent(id)}`,
                payload,
                {
                    timeout: 15000
                }
            );

            setSnackbar({
                open: true,
                message:
                    "Inventory adjustment updated successfully.",
                severity: "success"
            });

            setTimeout(() => {
                navigate("/inventory-adjustments");
            }, 700);

        }
        catch (error) {

            console.error(
                "Update Inventory Adjustment Error:",
                error
            );

            setSnackbar({
                open: true,
                message:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to update inventory adjustment.",
                severity: "error"
            });

        }
        finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress />
            </Box>

        );

    }


    if (!formData) {

        return (

            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    Inventory adjustment not found.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBackIcon />}
                    onClick={() =>
                        navigate(
                            "/inventory-adjustments"
                        )
                    }
                >
                    Back
                </Button>

            </Box>

        );

    }


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
                        navigate(
                            "/inventory-adjustments"
                        )
                    }
                >
                    Back
                </Button>

                <Typography
                    variant="h5"
                    fontWeight={600}
                >
                    Edit Inventory Adjustment
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
                                    label="Adjustment ID"
                                    value={
                                        formData.inventoryAdjustmentId
                                    }
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Seller ID"
                                    name="sellerId"
                                    type="number"
                                    value={formData.sellerId}
                                    onChange={handleChange}
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
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Warehouse Location ID"
                                    name="warehouseLocationId"
                                    type="number"
                                    value={
                                        formData.warehouseLocationId
                                    }
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Adjustment Type"
                                    name="adjustmentType"
                                    value={
                                        formData.adjustmentType
                                    }
                                    onChange={handleChange}
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
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Previous Quantity"
                                    name="previousQuantity"
                                    type="number"
                                    value={
                                        formData.previousQuantity
                                    }
                                    onChange={handleChange}
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
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Reference Number"
                                    name="referenceNumber"
                                    value={
                                        formData.referenceNumber
                                    }
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
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Updating..."
                                            : "Update Adjustment"}
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

export default InventoryAdjustmentsEdit;
