import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    MenuItem
} from "@mui/material";


// =========================================================
// INITIAL STATE
// =========================================================

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


// =========================================================
// STATUS OPTIONS
// =========================================================

const statusOptions = [

    "Pending",

    "Processing",

    "Completed",

    "Cancelled"

];


// =========================================================
// COMPONENT
// =========================================================

const SalesOrderModal = ({
    open,
    item,
    onClose,
    onSave
}) => {

    const [formData, setFormData] =
        useState(initialState);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD ITEM FOR EDIT
    // =====================================================

    useEffect(() => {

        if (item) {

            setFormData({

                ...initialState,

                ...item,

                OrderDate:
                    item.OrderDate
                        ? String(item.OrderDate)
                            .substring(0, 10)
                        : "",

                SellerId:
                    item.SellerId ?? "",

                CustomerId:
                    item.CustomerId ?? "",

                TotalAmount:
                    item.TotalAmount ?? "",

                Remarks:
                    item.Remarks ?? ""

            });

        }
        else {

            setFormData({
                ...initialState
            });

        }

        setError("");

    }, [item, open]);


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));


        // Clear validation error
        if (error) {

            setError("");

        }

    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        if (!formData.SellerId) {

            setError(
                "Seller ID is required."
            );

            return false;

        }


        if (!formData.CustomerId) {

            setError(
                "Customer ID is required."
            );

            return false;

        }


        if (!formData.SalesOrderNumber.trim()) {

            setError(
                "Sales Order Number is required."
            );

            return false;

        }


        if (!formData.OrderDate) {

            setError(
                "Order Date is required."
            );

            return false;

        }


        if (
            formData.TotalAmount === "" ||
            formData.TotalAmount === null
        ) {

            setError(
                "Total Amount is required."
            );

            return false;

        }


        if (
            Number(formData.SellerId) <= 0
        ) {

            setError(
                "Seller ID must be greater than 0."
            );

            return false;

        }


        if (
            Number(formData.CustomerId) <= 0
        ) {

            setError(
                "Customer ID must be greater than 0."
            );

            return false;

        }


        if (
            Number(formData.TotalAmount) < 0
        ) {

            setError(
                "Total Amount cannot be negative."
            );

            return false;

        }


        return true;

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = () => {

        if (!validateForm()) {

            return;

        }


        // Convert form values to the
        // correct backend data types.

        const payload = {

            ...formData,

            SalesOrderId:
                Number(formData.SalesOrderId || 0),

            SellerId:
                Number(formData.SellerId),

            CustomerId:
                Number(formData.CustomerId),

            TotalAmount:
                Number(formData.TotalAmount),

            SalesOrderNumber:
                formData.SalesOrderNumber.trim(),

            Status:
                formData.Status || "Pending",

            Remarks:
                formData.Remarks?.trim() || ""

        };


        console.log(
            "Sales Order Payload:",
            payload
        );


        onSave(payload);

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                {formData.SalesOrderId
                    ? "Edit Sales Order"
                    : "Add Sales Order"}

            </DialogTitle>


            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 0.5 }}
                >

                    {/* =====================================
                        SELLER ID
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Seller ID"
                            name="SellerId"
                            type="number"
                            value={formData.SellerId}
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =====================================
                        CUSTOMER ID
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Customer ID"
                            name="CustomerId"
                            type="number"
                            value={formData.CustomerId}
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =====================================
                        SALES ORDER NUMBER
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Sales Order Number"
                            name="SalesOrderNumber"
                            value={
                                formData.SalesOrderNumber
                            }
                            onChange={handleChange}
                            placeholder="SO-001"
                        />

                    </Grid>


                    {/* =====================================
                        ORDER DATE
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            type="date"
                            label="Order Date"
                            name="OrderDate"
                            value={
                                formData.OrderDate
                            }
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                    </Grid>


                    {/* =====================================
                        STATUS
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            select
                            fullWidth
                            label="Status"
                            name="Status"
                            value={
                                formData.Status
                            }
                            onChange={handleChange}
                        >

                            {statusOptions.map(
                                (status) => (

                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>


                    {/* =====================================
                        TOTAL AMOUNT
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Total Amount"
                            name="TotalAmount"
                            type="number"
                            value={
                                formData.TotalAmount
                            }
                            onChange={handleChange}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />

                    </Grid>


                    {/* =====================================
                        REMARKS
                    ====================================== */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Remarks"
                            name="Remarks"
                            value={
                                formData.Remarks
                            }
                            onChange={handleChange}
                            placeholder="Enter remarks..."
                        />

                    </Grid>


                    {/* =====================================
                        VALIDATION ERROR
                    ====================================== */}

                    {error && (

                        <Grid
                            item
                            xs={12}
                        >

                            <TextField
                                fullWidth
                                error
                                value={error}
                                InputProps={{
                                    readOnly: true
                                }}
                            />

                        </Grid>

                    )}

                </Grid>

            </DialogContent>


            {/* =========================================
                ACTIONS
            ========================================== */}

            <DialogActions>

                <Button
                    onClick={onClose}
                    color="inherit"
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >

                    {formData.SalesOrderId
                        ? "Update"
                        : "Save"}

                </Button>

            </DialogActions>

        </Dialog>

    );

};


export default SalesOrderModal;