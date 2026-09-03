import React, { useEffect, useState } from "react";

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
// STOCK LEDGER EDIT
// =========================================================

const StockLedgerEdit = ({
    ledger,
    onSaved,
    onCancel
}) => {

    const [formData, setFormData] = useState({
        stockLedgerId: "",
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


    // =========================================================
    // LOAD LEDGER
    // =========================================================

    useEffect(() => {

        if (!ledger) {
            return;
        }

        const stockLedgerId =
            ledger.stockLedgerId ??
            ledger.StockLedgerId;

        const sellerId =
            ledger.sellerId ??
            ledger.SellerId;

        const customerId =
            ledger.customerId ??
            ledger.CustomerId;

        const productId =
            ledger.productId ??
            ledger.ProductId;

        const warehouseId =
            ledger.warehouseId ??
            ledger.WarehouseId;

        const transactionType =
            ledger.transactionType ??
            ledger.TransactionType;

        const referenceNumber =
            ledger.referenceNumber ??
            ledger.ReferenceNumber;

        const quantity =
            ledger.quantity ??
            ledger.Quantity;

        const balanceQuantity =
            ledger.balanceQuantity ??
            ledger.BalanceQuantity;

        const transactionDate =
            ledger.transactionDate ??
            ledger.TransactionDate;

        const remarks =
            ledger.remarks ??
            ledger.Remarks;

        setFormData({
            stockLedgerId: stockLedgerId ?? "",
            sellerId: sellerId ?? "",
            customerId: customerId ?? "",
            productId: productId ?? "",
            warehouseId: warehouseId ?? "",
            transactionType: transactionType ?? "",
            referenceNumber: referenceNumber ?? "",
            quantity: quantity ?? "",
            balanceQuantity: balanceQuantity ?? "",
            transactionDate:
                transactionDate
                    ? transactionDate.substring(0, 10)
                    : "",
            remarks: remarks ?? ""
        });

    }, [ledger]);


    // =========================================================
    // HANDLE CHANGE
    // =========================================================

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


    // =========================================================
    // HANDLE SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!formData.stockLedgerId) {

            setError(
                "Stock Ledger ID is required."
            );

            return;
        }


        if (!formData.sellerId) {

            setError(
                "Seller ID is required."
            );

            return;
        }


        if (!formData.productId) {

            setError(
                "Product ID is required."
            );

            return;
        }


        if (!formData.warehouseId) {

            setError(
                "Warehouse ID is required."
            );

            return;
        }


        if (!formData.transactionType) {

            setError(
                "Transaction Type is required."
            );

            return;
        }


        setLoading(true);


        try {

            const payload = {
                stockLedgerId:
                    Number(formData.stockLedgerId),

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
                    formData.referenceNumber || null,

                quantity:
                    Number(formData.quantity || 0),

                balanceQuantity:
                    Number(
                        formData.balanceQuantity || 0
                    ),

                transactionDate:
                    formData.transactionDate
                        ? new Date(
                            `${formData.transactionDate}T00:00:00`
                        ).toISOString()
                        : null,

                remarks:
                    formData.remarks || null
            };


            const response = await fetch(
                `${SERVER_URL}/api/stock-ledgers/${formData.stockLedgerId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(payload)
                }
            );


            if (!response.ok) {

                let message =
                    `HTTP Error: ${response.status}`;

                try {

                    const errorData =
                        await response.json();

                    message =
                        errorData.message ||
                        errorData.title ||
                        message;

                } catch {
                    // Response was not JSON.
                }

                throw new Error(message);
            }


            const result =
                await response.json();


            console.log(
                "Stock Ledger Updated:",
                result
            );


            setSuccess(
                "Stock Ledger updated successfully."
            );


            if (onSaved) {
                onSaved(result);
            }

        } catch (err) {

            console.error(
                "Stock Ledger Update Error:",
                err
            );

            setError(
                err.message ||
                "Failed to update Stock Ledger."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // NO LEDGER
    // =========================================================

    if (!ledger) {

        return (
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    textAlign: "center"
                }}
            >

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Stock Ledger record not found.
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={() => onCancel?.()}
                >
                    Back
                </Button>

            </Paper>
        );
    }


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Paper
            className="stock-ledger-edit"
            elevation={3}
            sx={{
                p: 3,
                borderRadius: 3
            }}
        >

            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ mb: 3 }}
            >
                Edit Stock Ledger
            </Typography>


            {/* =================================================
                MESSAGES
            ================================================== */}

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


            <form onSubmit={handleSubmit}>

                <Grid
                    container
                    spacing={2}
                >

                    {/* =============================================
                        STOCK LEDGER ID
                    ============================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <TextField
                            fullWidth
                            label="Stock Ledger ID"
                            name="stockLedgerId"
                            value={formData.stockLedgerId}
                            disabled
                        />

                    </Grid>


                    {/* =============================================
                        SELLER ID
                    ============================================== */}

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
                        />

                    </Grid>


                    {/* =============================================
                        CUSTOMER ID
                    ============================================== */}

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
                        />

                    </Grid>


                    {/* =============================================
                        PRODUCT ID
                    ============================================== */}

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
                        />

                    </Grid>


                    {/* =============================================
                        WAREHOUSE ID
                    ============================================== */}

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
                        />

                    </Grid>


                    {/* =============================================
                        TRANSACTION TYPE
                    ============================================== */}

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


                    {/* =============================================
                        REFERENCE NUMBER
                    ============================================== */}

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
                        />

                    </Grid>


                    {/* =============================================
                        QUANTITY
                    ============================================== */}

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
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* =============================================
                        BALANCE QUANTITY
                    ============================================== */}

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
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* =============================================
                        TRANSACTION DATE
                    ============================================== */}

                    <Grid
                        item
                        xs={12}
                        sm={6}
                    >

                        <TextField
                            fullWidth
                            type="date"
                            label="Transaction Date"
                            name="transactionDate"
                            value={formData.transactionDate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                    </Grid>


                    {/* =============================================
                        REMARKS
                    ============================================== */}

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
                        />

                    </Grid>


                    {/* =============================================
                        ACTIONS
                    ============================================== */}

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
                                startIcon={<ArrowBack />}
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
                                    loading
                                        ? <CircularProgress
                                            size={20}
                                            color="inherit"
                                          />
                                        : <Save />
                                }
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </Button>

                        </Stack>

                    </Grid>

                </Grid>

            </form>

        </Paper>
    );
};


export default StockLedgerEdit;
