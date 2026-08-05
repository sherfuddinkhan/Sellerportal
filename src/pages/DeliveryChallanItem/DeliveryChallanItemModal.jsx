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

const DeliveryChallanItemModal = ({
    open,
    onClose,
    onSave,
    deliveryChallanItem
}) => {

    const initialState = {

        DeliveryChallanItemId: 0,

        DeliveryChallanId: "",

        ProductId: "",

        Quantity: "",

        UnitPrice: "",

        Discount: "",

        TaxAmount: "",

        TotalAmount: "",

        Remarks: ""

    };

    const [formData, setFormData] =
        useState(initialState);

    useEffect(() => {

        if (deliveryChallanItem) {

            setFormData({

                DeliveryChallanItemId:
                    deliveryChallanItem.DeliveryChallanItemId || 0,

                DeliveryChallanId:
                    deliveryChallanItem.DeliveryChallanId || "",

                ProductId:
                    deliveryChallanItem.ProductId || "",

                Quantity:
                    deliveryChallanItem.Quantity || "",

                UnitPrice:
                    deliveryChallanItem.UnitPrice || "",

                Discount:
                    deliveryChallanItem.Discount || "",

                TaxAmount:
                    deliveryChallanItem.TaxAmount || "",

                TotalAmount:
                    deliveryChallanItem.TotalAmount || "",

                Remarks:
                    deliveryChallanItem.Remarks || ""

            });

        }
        else {

            setFormData(initialState);

        }

    }, [deliveryChallanItem, open]);

    useEffect(() => {

        const qty =
            Number(formData.Quantity || 0);

        const price =
            Number(formData.UnitPrice || 0);

        const discount =
            Number(formData.Discount || 0);

        const tax =
            Number(formData.TaxAmount || 0);

        const total =
            (qty * price) - discount + tax;

        setFormData(prev => ({

            ...prev,

            TotalAmount: total.toFixed(2)

        }));

    }, [

        formData.Quantity,

        formData.UnitPrice,

        formData.Discount,

        formData.TaxAmount

    ]);

    const handleChange = (e) => {

        const {

            name,

            value

        } = e.target;

        setFormData(prev => ({

            ...prev,

            [name]: value

        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSave({

            ...formData,

            Quantity:
                Number(formData.Quantity),

            UnitPrice:
                Number(formData.UnitPrice),

            Discount:
                Number(formData.Discount || 0),

            TaxAmount:
                Number(formData.TaxAmount || 0),

            TotalAmount:
                Number(formData.TotalAmount)

        });

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

                    formData.DeliveryChallanItemId

                        ? "Edit Delivery Challan Item"

                        : "Add Delivery Challan Item"

                }

            </DialogTitle>

            <form onSubmit={handleSubmit}>

                <DialogContent>

                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                label="Delivery Challan ID"
                                name="DeliveryChallanId"
                                value={formData.DeliveryChallanId}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                label="Product ID"
                                name="ProductId"
                                value={formData.ProductId}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Quantity"
                                name="Quantity"
                                value={formData.Quantity}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Unit Price"
                                name="UnitPrice"
                                value={formData.UnitPrice}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Discount"
                                name="Discount"
                                value={formData.Discount}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Tax Amount"
                                name="TaxAmount"
                                value={formData.TaxAmount}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Total Amount"
                                name="TotalAmount"
                                value={formData.TotalAmount}
                                InputProps={{
                                    readOnly: true
                                }}
                            />

                        </Grid>

                        <Grid item xs={12}>

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
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
                        color="inherit"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                    >
                        Save
                    </Button>

                </DialogActions>

            </form>

        </Dialog>

    );

};

export default DeliveryChallanItemModal;