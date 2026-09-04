
import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    MenuItem,
    Alert
} from "@mui/material";


const initialState = {
    SalesOrderId: 0,
    SellerId: "",
    CustomerId: "",
    SalesOrderNumber: "",
    OrderDate: "",
    Status: "Pending",
    TotalAmount: "",
    Remarks: ""
};


const SalesOrderEdit = ({
    open,
    item,
    onClose,
    onSave,
    loading = false
}) => {

    const [formData, setFormData] = useState(initialState);

    const [error, setError] = useState("");


    /* =========================================================
       LOAD SALES ORDER
    ========================================================= */

    useEffect(() => {

        if (!item) {
            setFormData(initialState);
            return;
        }

        setFormData({
            SalesOrderId: item.SalesOrderId || 0,

            SellerId: item.SellerId ?? "",

            CustomerId: item.CustomerId ?? "",

            SalesOrderNumber:
                item.SalesOrderNumber || "",

            OrderDate:
                item.OrderDate
                    ? String(item.OrderDate).substring(0, 10)
                    : "",

            Status:
                item.Status || "Pending",

            TotalAmount:
                item.TotalAmount ?? "",

            Remarks:
                item.Remarks || ""
        });

        setError("");

    }, [item, open]);


    /* =========================================================
       HANDLE CHANGE
    ========================================================= */

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
    };


    /* =========================================================
       VALIDATE
    ========================================================= */

    const validateForm = () => {

        if (!formData.SellerId) {
            setError("Seller ID is required.");
            return false;
        }

        if (!formData.CustomerId) {
            setError("Customer ID is required.");
            return false;
        }

        if (!formData.SalesOrderNumber.trim()) {
            setError("Sales Order Number is required.");
            return false;
        }

        if (!formData.OrderDate) {
            setError("Order Date is required.");
            return false;
        }

        if (
            formData.TotalAmount === "" ||
            Number(formData.TotalAmount) < 0
        ) {
            setError("Please enter a valid Total Amount.");
            return false;
        }

        return true;
    };


    /* =========================================================
       SAVE
    ========================================================= */

    const handleSubmit = (event) => {

        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const payload = {
            SalesOrderId: Number(formData.SalesOrderId),

            SellerId: Number(formData.SellerId),

            CustomerId: Number(formData.CustomerId),

            SalesOrderNumber:
                formData.SalesOrderNumber.trim(),

            OrderDate: formData.OrderDate,

            Status: formData.Status,

            TotalAmount: Number(formData.TotalAmount),

            Remarks:
                formData.Remarks.trim()
        };

        onSave?.(payload);
    };


    /* =========================================================
       CLOSE
    ========================================================= */

    const handleClose = () => {

        if (loading) {
            return;
        }

        setError("");

        onClose?.();
    };


    return (
        <Dialog
            open={Boolean(open)}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >

            <form onSubmit={handleSubmit}>

                <DialogTitle>
                    Edit Sales Order
                </DialogTitle>


                <DialogContent dividers>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                        >
                            {error}
                        </Alert>
                    )}


                    <Grid
                        container
                        spacing={2}
                    >

                        {/* Sales Order ID */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Sales Order ID"
                                value={
                                    formData.SalesOrderId
                                }
                                disabled
                            />

                        </Grid>


                        {/* Sales Order Number */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                label="Sales Order Number"
                                name="SalesOrderNumber"
                                value={
                                    formData.SalesOrderNumber
                                }
                                onChange={handleChange}
                            />

                        </Grid>


                        {/* Seller ID */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Seller ID"
                                name="SellerId"
                                value={formData.SellerId}
                                onChange={handleChange}
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* Customer ID */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Customer ID"
                                name="CustomerId"
                                value={formData.CustomerId}
                                onChange={handleChange}
                                inputProps={{
                                    min: 1
                                }}
                            />

                        </Grid>


                        {/* Order Date */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                type="date"
                                label="Order Date"
                                name="OrderDate"
                                value={formData.OrderDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />

                        </Grid>


                        {/* Status */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                select
                                fullWidth
                                label="Status"
                                name="Status"
                                value={formData.Status}
                                onChange={handleChange}
                            >

                                <MenuItem value="Pending">
                                    Pending
                                </MenuItem>

                                <MenuItem value="Processing">
                                    Processing
                                </MenuItem>

                                <MenuItem value="Completed">
                                    Completed
                                </MenuItem>

                                <MenuItem value="Cancelled">
                                    Cancelled
                                </MenuItem>

                            </TextField>

                        </Grid>


                        {/* Total Amount */}

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Total Amount"
                                name="TotalAmount"
                                value={formData.TotalAmount}
                                onChange={handleChange}
                                inputProps={{
                                    min: 0,
                                    step: "0.01"
                                }}
                            />

                        </Grid>


                        {/* Remarks */}

                        <Grid item xs={12}>

                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Remarks"
                                name="Remarks"
                                value={formData.Remarks}
                                onChange={handleChange}
                                placeholder="Enter remarks"
                            />

                        </Grid>

                    </Grid>

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={handleClose}
                        color="inherit"
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Update Sales Order"}
                    </Button>

                </DialogActions>

            </form>

        </Dialog>
    );
};


export default SalesOrderEdit;

