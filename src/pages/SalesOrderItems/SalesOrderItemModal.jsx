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
    Button
} from "@mui/material";

const initialState = {

    SalesOrderItemId: 0,

    SalesOrderId: "",

    ProductId: "",

    Quantity: "",

    UnitPrice: "",

    Discount: "",

    TaxAmount: "",

    TotalAmount: ""

};

const SalesOrderItemModal = ({

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

                ...item

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
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>

                {

                    formData.SalesOrderItemId

                        ? "Edit Sales Order Item"

                        : "Add Sales Order Item"

                }

            </DialogTitle>

            <DialogContent dividers>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 0.5 }}
                >

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Sales Order ID"
                            name="SalesOrderId"
                            type="number"
                            value={formData.SalesOrderId}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Product ID"
                            name="ProductId"
                            type="number"
                            value={formData.ProductId}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Quantity"
                            name="Quantity"
                            type="number"
                            value={formData.Quantity}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Unit Price"
                            name="UnitPrice"
                            type="number"
                            value={formData.UnitPrice}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Discount"
                            name="Discount"
                            type="number"
                            value={formData.Discount}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Tax Amount"
                            name="TaxAmount"
                            type="number"
                            value={formData.TaxAmount}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12}>

                        <TextField
                            fullWidth
                            label="Total Amount"
                            name="TotalAmount"
                            type="number"
                            value={formData.TotalAmount}
                            onChange={handleChange}
                        />

                    </Grid>

                </Grid>

            </DialogContent>

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

                    {

                        formData.SalesOrderItemId

                            ? "Update"

                            : "Save"

                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default SalesOrderItemModal;