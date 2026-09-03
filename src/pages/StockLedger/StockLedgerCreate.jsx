import React, { useState } from "react";

import {
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    Stack,
    Alert,
    CircularProgress,
    MenuItem
} from "@mui/material";

import {
    Save,
    ArrowBack
} from "@mui/icons-material";


const SERVER_URL = "http://localhost:5000";


// =========================================================
// STOCK LEDGER CREATE
// =========================================================

const StockLedgerCreate = ({
    onCreated,
    onCancel
}) => {

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        sellerId: "",
        customerId: "",
        productId: "",
        warehouseId: "",
        transactionType: "",
        referenceNumber: "",
        quantity: "",
        balanceQuantity: "",
        transactionDate: "",
        remarks: ""
    });


    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };


    // =====================================================
    // VALIDATE FORM
    // =====================================================

    const validateForm = () => {

        if (!formData.sellerId) {
            return "Seller ID is required.";
        }

        if (!formData.productId) {
            return "Product ID is required.";
        }

        if (!formData.warehouseId) {
            return "Warehouse ID is required.";
        }

        if (!formData.transactionType) {
            return "Transaction Type is required.";
        }

        if (
            formData.quantity === "" ||
            Number.isNaN(Number(formData.quantity))
        ) {
            return "Quantity is required.";
        }

        if (
            formData.balanceQuantity === "" ||
            Number.isNaN(Number(formData.balanceQuantity))
        ) {
            return "Balance Quantity is required.";
        }

        return "";
    };


    // =====================================================
    // HANDLE SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        const validationError =
            validateForm();

        if (validationError) {

            setError(
                validationError
            );

            return;
        }


        setLoading(true);


        try {

            // =================================================
            // REQUEST PAYLOAD
            // =================================================

            const payload = {

                sellerId:
                    Number(formData.sellerId),

                customerId:
                    formData.customerId === ""
                        ? null
                        : Number(formData.customerId),

                productId:
                    Number(formData.productId),

                warehouseId:
                    Number(formData.warehouseId),

                transactionType:
                    formData.transactionType,

                referenceNumber:
                    formData.referenceNumber.trim() || null,

                quantity:
                    Number(formData.quantity),

                balanceQuantity:
                    Number(formData.balanceQuantity),

                transactionDate:
                    formData.transactionDate
                        ? new Date(
                            `${formData.transactionDate}T00:00:00`
                        ).toISOString()
                        : new Date().toISOString(),

                remarks:
                    formData.remarks.trim() || null
            };


            console.log(
                "Creating Stock Ledger:",
                payload
            );


            // =================================================
            // POST REQUEST
            // =================================================

            const response = await fetch(
                `${SERVER_URL}/api/stock-ledgers`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(payload)
                }
            );


            // =================================================
            // ERROR RESPONSE
            // =================================================

            if (!response.ok) {

                let message =
                    `HTTP Error: ${response.status}`;

                try {

                    const errorData =
                        await response.json();

                    if (
                        errorData?.message
                    ) {
                        message =
                            errorData.message;
                    }
                    else if (
                        errorData?.title
                    ) {
                        message =
                            errorData.title;
                    }
                    else if (
                        typeof errorData === "string"
                    ) {
                        message =
                            errorData;
                    }

                } catch {
                    // Response is not JSON.
                }

                throw new Error(message);
            }


            // =================================================
            // SUCCESS RESPONSE
            // =================================================

            const result =
                await response.json();

            console.log(
                "Stock Ledger Created:",
                result
            );


            setSuccess(
                "Stock Ledger created successfully."
            );


            // -------------------------------------------------
            // RESET FORM
            // -------------------------------------------------

            setFormData({
                sellerId: "",
                customerId: "",
                productId: "",
                warehouseId: "",
                transactionType: "",
                referenceNumber: "",
                quantity: "",
                balanceQuantity: "",
                transactionDate: "",
                remarks: ""
            });


            // -------------------------------------------------
            // CALLBACK
            // -------------------------------------------------

            if (onCreated) {
                onCreated(result);
            }

        } catch (err) {

            console.error(
                "Stock Ledger Create Error:",
                err
            );

            setError(
                err.message ||
                "Failed to create Stock Ledger."
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <Paper
            className="stock-ledger-create"
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 3
            }}
        >

            {/* =================================================
                HEADER
            ================================================== */}

            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                    mb: 3
                }}
            >
                Create Stock Ledger
            </Typography>


            {/* =================================================
                MESSAGES
            ================================================== */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                >
                    {error}
                </Alert>
            )}


            {success && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 2
                    }}
                >
                    {success}
                </Alert>
            )}


            {/* =================================================
                FORM
            ================================================== */}

            <form onSubmit={handleSubmit}>

                <Grid
                    container
                    spacing={2}
                >

                    {/* =========================================
                        SELLER ID
                    ========================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Seller ID"
                            name="sellerId"
                            value={formData.sellerId}
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        CUSTOMER ID
                    ========================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Customer ID"
                            name="customerId"
                            value={formData.customerId}
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        PRODUCT ID
                    ========================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Product ID"
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        WAREHOUSE ID
                    ========================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Warehouse ID"
                            name="warehouseId"
                            value={formData.warehouseId}
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        TRANSACTION TYPE
                    ========================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <TextField
                            select
                            fullWidth
                            required
                            label="Transaction Type"
                            name="transactionType"
                            value={formData.transactionType}
                            onChange={handleChange}
                        >

                            <MenuItem value="Purchase">
                                Purchase
                            </MenuItem>

                            <MenuItem value="Sale">
                                Sale
                            </MenuItem>

                            <MenuItem value="Return">
                                Return
                            </MenuItem>

                            <MenuItem value="Adjustment">
                                Adjustment
                            </MenuItem>

                            <MenuItem value="Transfer">
                                Transfer
                            </MenuItem>

                        </TextField>

                    </Grid>


                    {/* =========================================
                        REFERENCE NUMBER
                    ========================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <TextField
                            fullWidth
                            label="Reference Number"
                            name="referenceNumber"
                            value={formData.referenceNumber}
                            onChange={handleChange}
                            placeholder="PO-001"
                        />

                    </Grid>


                    {/* =========================================
                        QUANTITY
                    ========================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        BALANCE QUANTITY
                    ========================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Balance Quantity"
                            name="balanceQuantity"
                            value={formData.balanceQuantity}
                            onChange={handleChange}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* =========================================
                        TRANSACTION DATE
                    ========================================== */}

               
<Grid
    item
    xs={12}
    sm={6}
>
    <TextField
        fullWidth
        required
        type="date"
        name="transactionDate"
        label="Transaction Date"
        value={formData.transactionDate || ""}
        onChange={handleChange}
        InputLabelProps={{
            shrink: true
        }}
        inputProps={{
            max: "9999-12-31"
        }}
    />
</Grid>




                    {/* =========================================
                        REMARKS
                    ========================================== */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField
                            fullWidth
                            multiline
                            minRows={4}
                            label="Remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="Enter stock ledger remarks..."
                        />

                    </Grid>


                    {/* =========================================
                        ACTIONS
                    ========================================== */}

                    <Grid
                        item
                        xs={12}
                    >

                        <Stack
                            direction={{
                                xs: "column",
                                sm: "row"
                            }}
                            spacing={2}
                            justifyContent="flex-end"
                            sx={{
                                mt: 1
                            }}
                        >

                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={
                                    <ArrowBack />
                                }
                                onClick={() =>
                                    onCancel?.()
                                }
                                disabled={loading}
                            >
                                Cancel
                            </Button>


                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={20}
                                            color="inherit"
                                        />
                                    ) : (
                                        <Save />
                                    )
                                }
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Stock Entry"}
                            </Button>

                        </Stack>

                    </Grid>

                </Grid>

            </form>

        </Paper>
    );
};


export default StockLedgerCreate;




