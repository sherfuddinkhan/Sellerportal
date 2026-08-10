import React, {useEffect,useState} from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Grid,TextField} from "@mui/material";

const initialState = {
    GoodsReceiptNoteItemId: null,
    GoodsReceiptNoteId: "",
    ProductId: "",
    ReceivedQuantity: "",
    AcceptedQuantity: "",
    RejectedQuantity: "",
    UnitPrice: "",
    TaxAmount: "",
    TotalAmount: ""
};
const GoodsReceiptNoteItemModal = ({
    open,
    item,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState(initialState);
    useEffect(() => {
        if(item) {
            setFormData({
                GoodsReceiptNoteItemId: item.GoodsReceiptNoteItemId || null,
                GoodsReceiptNoteId: item.GoodsReceiptNoteId || "",
                ProductId: item.ProductId || "",
                ReceivedQuantity: item.ReceivedQuantity || "",
                AcceptedQuantity: item.AcceptedQuantity || "",
                RejectedQuantity: item.RejectedQuantity || "",
                UnitPrice: item.UnitPrice || "",
                TaxAmount: item.TaxAmount || "",
                TotalAmount: item.TotalAmount || ""
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
        const qty =Number(formData.AcceptedQuantity || 0);
        const price =Number(formData.UnitPrice || 0);
        const tax =Number(formData.TaxAmount || 0);
        return (qty * price) + tax;
    };
    const handleSubmit = () => {
        const data = {
            ...formData,
            GoodsReceiptNoteId: Number(formData.GoodsReceiptNoteId),
            ProductId: Number(formData.ProductId),
            ReceivedQuantity: Number(formData.ReceivedQuantity || 0),
            AcceptedQuantity: Number(formData.AcceptedQuantity || 0),
            RejectedQuantity: Number(formData.RejectedQuantity || 0),
            UnitPrice: Number(formData.UnitPrice || 0),
            TaxAmount: Number(formData.TaxAmount || 0),
            TotalAmount: Number(formData.TotalAmount || calculateTotal())
        };
        onSave(data);
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
                    formData.GoodsReceiptNoteItemId ? "Edit Goods Receipt Note Item" : "Add Goods Receipt Note Item"
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
                            label="Goods Receipt Note ID"
                            name="GoodsReceiptNoteId"
                            value={formData.GoodsReceiptNoteId}
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
                            value={formData.ProductId}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <TextField
                            fullWidth
                            type="number"
                            label="Received Quantity"
                            name="ReceivedQuantity"
                            value={formData.ReceivedQuantity}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <TextField
                            fullWidth
                            type="number"
                            label="Accepted Quantity"
                            name="AcceptedQuantity"
                            value={formData.AcceptedQuantity}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <TextField
                            fullWidth
                            type="number"
                            label="Rejected Quantity"
                            name="RejectedQuantity"
                            value={formData.RejectedQuantity}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <TextField
                            fullWidth
                            type="number"
                            label="Unit Price"
                            name="UnitPrice"
                            value={formData.UnitPrice}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <TextField
                            fullWidth
                            type="number"
                            label="Tax Amount"
                            name="TaxAmount"
                            value={formData.TaxAmount}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <TextField
                            fullWidth
                            type="number"
                            label="Total Amount"
                            name="TotalAmount"
                            value={formData.TotalAmount || calculateTotal()}
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
export default GoodsReceiptNoteItemModal;