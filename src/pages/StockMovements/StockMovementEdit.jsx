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
    Grid,
    MenuItem,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save
} from "@mui/icons-material";

import {
    useNavigate,
    useParams
} from "react-router-dom";


const SERVER_URL =
    "http://localhost:5000";


const StockMovementEdit = () => {

    const {
        id
    } = useParams();

    const navigate =
        useNavigate();

    const [form, setForm] =
        useState({
            sellerId: "",
            customerId: "",
            productId: "",
            warehouseId: "",
            movementType: "",
            quantity: "",
            reference: "",
            movementDate: ""
        });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadMovement =
            async () => {

                try {

                    setLoading(true);

                    const response =
                        await axios.get(
                            `${SERVER_URL}/api/stock-movements/${Number(id)}`
                        );

                    const data =
                        response.data;

                    setForm({
                        sellerId:
                            data.sellerId ??
                            data.SellerId ??
                            "",

                        customerId:
                            data.customerId ??
                            data.CustomerId ??
                            "",

                        productId:
                            data.productId ??
                            data.ProductId ??
                            "",

                        warehouseId:
                            data.warehouseId ??
                            data.WarehouseId ??
                            "",

                        movementType:
                            data.movementType ??
                            data.MovementType ??
                            "",

                        quantity:
                            data.quantity ??
                            data.Quantity ??
                            "",

                        reference:
                            data.reference ??
                            data.Reference ??
                            "",

                        movementDate:
                            data.movementDate ??
                            data.MovementDate
                                ? new Date(
                                    data.movementDate ??
                                    data.MovementDate
                                )
                                    .toISOString()
                                    .slice(0, 16)
                                : ""
                    });

                } catch (error) {

                    console.error(
                        "GET STOCK MOVEMENT ERROR:",
                        error
                    );

                    setError(
                        "Failed to load stock movement"
                    );

                } finally {

                    setLoading(false);

                }

            };


        if (id) {
            loadMovement();
        }

    }, [id]);


    const handleChange =
        (event) => {

            const {
                name,
                value
            } = event.target;

            setForm(
                previous => ({
                    ...previous,
                    [name]: value
                })
            );

        };


    const handleSubmit =
        async (event) => {

            event.preventDefault();

            try {

                setSaving(true);

                const payload = {

                    sellerId:
                        Number(form.sellerId),

                    customerId:
                        form.customerId
                            ? Number(form.customerId)
                            : null,

                    productId:
                        Number(form.productId),

                    warehouseId:
                        Number(form.warehouseId),

                    movementType:
                        form.movementType,

                    quantity:
                        Number(form.quantity),

                    reference:
                        form.reference || null,

                    movementDate:
                        form.movementDate
                            ? new Date(
                                form.movementDate
                            ).toISOString()
                            : null

                };


                await axios.put(
                    `${SERVER_URL}/api/stock-movements/${Number(id)}`,
                    payload
                );

                navigate(
                    "/stock-movements"
                );

            } catch (error) {

                console.error(
                    "UPDATE STOCK MOVEMENT ERROR:",
                    error
                );

                setError(
                    error.response?.data?.message ??
                    "Failed to update stock movement"
                );

            } finally {

                setSaving(false);

            }

        };


    if (loading) {

        return (
            <Box sx={{ p: 3 }}>
                Loading stock movement...
            </Box>
        );

    }


    if (error) {

        return (
            <Box sx={{ p: 3 }}>

                <Alert severity="error">
                    {error}
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/stock-movements"
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

            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
            >

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/stock-movements"
                        )
                    }
                >
                    Back
                </Button>

                <Typography
                    variant="h5"
                    fontWeight={600}
                >
                    Edit Stock Movement #{id}
                </Typography>

            </Stack>


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

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="sellerId"
                                    label="Seller ID"
                                    value={form.sellerId}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="customerId"
                                    label="Customer ID"
                                    value={form.customerId}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="productId"
                                    label="Product ID"
                                    value={form.productId}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name="warehouseId"
                                    label="Warehouse ID"
                                    value={form.warehouseId}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    select
                                    name="movementType"
                                    label="Movement Type"
                                    value={form.movementType}
                                    onChange={handleChange}
                                >

                                    <MenuItem value="Purchase">
                                        Purchase
                                    </MenuItem>

                                    <MenuItem value="Sale">
                                        Sale
                                    </MenuItem>

                                    <MenuItem value="Transfer">
                                        Transfer
                                    </MenuItem>

                                    <MenuItem value="Adjustment">
                                        Adjustment
                                    </MenuItem>

                                    <MenuItem value="Return">
                                        Return
                                    </MenuItem>

                                </TextField>

                            </Grid>

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    type="number"
                                    name="quantity"
                                    label="Quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    name="reference"
                                    label="Reference"
                                    value={form.reference}
                                    onChange={handleChange}
                                />

                            </Grid>

                            <Grid item xs={12} md={6}>

                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    name="movementDate"
                                    label="Movement Date"
                                    value={form.movementDate}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />

                            </Grid>

                            <Grid item xs={12}>

                                <Stack
                                    direction="row"
                                    spacing={2}
                                    justifyContent="flex-end"
                                >

                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            navigate(
                                                "/stock-movements"
                                            )
                                        }
                                    >
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<Save />}
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Updating..."
                                            : "Update Movement"}
                                    </Button>

                                </Stack>

                            </Grid>

                        </Grid>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};

export default StockMovementEdit;