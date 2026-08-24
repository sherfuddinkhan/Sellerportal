import React, {useEffect,useState} from "react";
import {Dialog,DialogTitle,DialogContent, DialogActions,Button,TextField,Grid} from "@mui/material";

const initialState = {
    PurchaseOrderItemId: null,
    PurchaseOrderId: "",
    ProductId: "",
    Quantity: "",
    UnitPrice: "",
    Discount: "",
    TaxAmount: "",
    TotalAmount: ""
};
const PurchaseOrderItemModal = ({
    open,
    item,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState(initialState);
    useEffect(() => {
        if(item){
            setFormData({
                PurchaseOrderItemId:item.PurchaseOrderItemId || null,
                PurchaseOrderId:item.PurchaseOrderId || "",
                ProductId:item.ProductId || "",
                Quantity:item.Quantity || "",
                UnitPrice:item.UnitPrice || "",
                Discount:item.Discount || "",
                TaxAmount:item.TaxAmount || "",
                TotalAmount:item.TotalAmount || ""
            });
        }
        else {
            setFormData(initialState);
        }
    }, [item, open]);
    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const calculateTotal = () => {
        const qty =Number(formData.Quantity || 0);
        const price =Number(formData.UnitPrice || 0);
        const discount =Number(formData.Discount || 0);
        const tax =Number(formData.TaxAmount || 0);
        return ((qty * price)-discount+tax).toFixed(2);
    };
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            TotalAmount:calculateTotal()
        }));
    }, [
        formData.Quantity,
        formData.UnitPrice,
        formData.Discount,
        formData.TaxAmount
    ]);
    const handleSubmit = () => {
        onSave({
            ...formData,
            Quantity:Number(formData.Quantity),
            UnitPrice:Number(formData.UnitPrice),
            Discount:Number(formData.Discount || 0),
            TaxAmount:Number(formData.TaxAmount || 0),
            TotalAmount:Number( formData.TotalAmount || 0)
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
                    formData.PurchaseOrderItemId ? "Edit Purchase Order Item" :  "Add Purchase Order Item"
                }
            </DialogTitle>
            <DialogContent dividers>
                <Grid
                    container
                    spacing={2}
                    mt={1}
                >
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Purchase Order ID"
                            name="PurchaseOrderId"
                            value={ formData.PurchaseOrderId}
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
                            label="Product ID"
                            name="ProductId"
                            value={ formData.ProductId}
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
                            label="Quantity"
                            name="Quantity"
                            value={ formData.Quantity}
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
                            label="Unit Price"
                            name="UnitPrice"
                            value={ formData.UnitPrice}
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
                            label="Discount"
                            name="Discount"
                            value={ formData.Discount}
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
                            label="Tax Amount"
                            name="TaxAmount"
                            value={ formData.TaxAmount}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                    >
                        <TextField
                            fullWidth
                            label="Total Amount"
                            name="TotalAmount"
                            value={ formData.TotalAmount}
                            InputProps={{ readOnly: true}}
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

export default PurchaseOrderItemModal;