import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem
} from "@mui/material";

const paymentStatusOptions = [
    "Pending",
    "Partially Paid",
    "Paid"
];

const statusOptions = [
    "Draft",
    "Open",
    "Completed",
    "Cancelled"
];

const initialState = {

    SalesInvoiceId: 0,

    SalesOrderId: "",

    InvoiceNumber: "",

    InvoiceDate: "",

    SubTotal: "",

    DiscountAmount: "",

    TaxAmount: "",

    TotalAmount: "",

    PaidAmount: "",

    BalanceAmount: "",

    PaymentStatus: "Pending",

    Status: "Draft",

    Remarks: ""

};

const SalesInvoiceModal = ({

    open,

    item,

    onClose,

    onSave

}) => {

    const [formData, setFormData] =
        useState(initialState);

    useEffect(() => {

        if (item) {

            setFormData({

                ...initialState,

                ...item,

                InvoiceDate: item.InvoiceDate
                    ? item.InvoiceDate.substring(0, 10)
                    : ""

            });

        }
        else {

            setFormData(initialState);

        }

    }, [item]);

    const handleChange = (e) => {

        const {

            name,

            value

        } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value

        }));

    };

    const handleSubmit = () => {

        onSave(formData);

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>

                {

                    formData.SalesInvoiceId

                        ? "Edit Sales Invoice"

                        : "Add Sales Invoice"

                }

            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Sales Order ID"
                            name="SalesOrderId"
                            value={formData.SalesOrderId}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Invoice Number"
                            name="InvoiceNumber"
                            value={formData.InvoiceNumber}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            type="date"
                            label="Invoice Date"
                            name="InvoiceDate"
                            value={formData.InvoiceDate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Sub Total"
                            name="SubTotal"
                            type="number"
                            value={formData.SubTotal}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Discount"
                            name="DiscountAmount"
                            type="number"
                            value={formData.DiscountAmount}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Tax"
                            name="TaxAmount"
                            type="number"
                            value={formData.TaxAmount}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField
                            fullWidth
                            label="Total Amount"
                            name="TotalAmount"
                            type="number"
                            value={formData.TotalAmount}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Paid Amount"
                            name="PaidAmount"
                            type="number"
                            value={formData.PaidAmount}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Balance Amount"
                            name="BalanceAmount"
                            type="number"
                            value={formData.BalanceAmount}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            select
                            fullWidth
                            label="Payment Status"
                            name="PaymentStatus"
                            value={formData.PaymentStatus}
                            onChange={handleChange}
                        >

                            {

                                paymentStatusOptions.map((status) => (

                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >

                                        {status}

                                    </MenuItem>

                                ))

                            }

                        </TextField>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            select
                            fullWidth
                            label="Invoice Status"
                            name="Status"
                            value={formData.Status}
                            onChange={handleChange}
                        >

                            {

                                statusOptions.map((status) => (

                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >

                                        {status}

                                    </MenuItem>

                                ))

                            }

                        </TextField>

                    </Grid>

                    <Grid item xs={12}>

                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Remarks"
                            name="Remarks"
                            value={formData.Remarks}
                            onChange={handleChange}
                        />

                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                >

                    Cancel

                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >

                    Save

                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default SalesInvoiceModal;