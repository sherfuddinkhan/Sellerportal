import React, {
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
    useNavigate
} from "react-router-dom";


const SERVER_URL =
    "http://localhost:5000";


const StockMovementCreate = () => {

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
            movementDate:
                new Date()
                    .toISOString()
                    .slice(0, 16)
        });

    const [loading, setLoading] =
        useState(false);

    const [snackbar, setSnackbar] =
        useState({
            open: false,
            message: "",
            severity: "success"
        });


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

            if (
                !form.sellerId ||
                !form.productId ||
                !form.warehouseId ||
                !form.movementType ||
                !form.quantity
            ) {

                setSnackbar({
                    open: true,
                    message:
                        "Please fill all required fields",
                    severity: "error"
                });

                return;
            }


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


            try {

                setLoading(true);

                await axios.post(
                    `${SERVER_URL}/api/stock-movements`,
                    payload,
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

                setSnackbar({
                    open: true,
                    message:
                        "Stock movement created successfully",
                    severity: "success"
                });

                setTimeout(() => {

                    navigate(
                        "/stock-movements"
                    );

                }, 800);

            } catch (error) {

                console.error(
                    "CREATE STOCK MOVEMENT ERROR:",
                    error
                );

                setSnackbar({
                    open: true,
                    message:
                        error.response?.data?.message ??
                        "Failed to create stock movement",
                    severity: "error"
                });

            } finally {

                setLoading(false);

            }

        };


    return (

        <Box sx={{ p: 2 }}>

            <Stack
                direction="row"
                alignItems="center"
                spacing={2}
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
                    Create Stock Movement
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

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    name="sellerId"
                                    label="Seller ID"
                                    value={form.sellerId}
                                    onChange={handleChange}
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    type="number"
                                    name="customerId"
                                    label="Customer ID"
                                    value={form.customerId}
                                    onChange={handleChange}
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    name="productId"
                                    label="Product ID"
                                    value={form.productId}
                                    onChange={handleChange}
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    name="warehouseId"
                                    label="Warehouse ID"
                                    value={form.warehouseId}
                                    onChange={handleChange}
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
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


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    name="quantity"
                                    label="Quantity"
                                    value={form.quantity}
                                    onChange={handleChange}
                                    inputProps={{
                                        min: 1
                                    }}
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <TextField
                                    fullWidth
                                    name="reference"
                                    label="Reference"
                                    value={form.reference}
                                    onChange={handleChange}
                                />

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

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


                            <Grid
                                item
                                xs={12}
                            >

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
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Saving..."
                                            : "Save Movement"}
                                    </Button>

                                </Stack>

                            </Grid>

                        </Grid>

                    </Box>

                </CardContent>

            </Card>


            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() =>
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
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

export default StockMovementCreate;