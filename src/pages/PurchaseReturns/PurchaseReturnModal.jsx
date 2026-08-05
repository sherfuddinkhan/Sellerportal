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

const PurchaseReturnModal = ({
    open,
    onClose,
    onSave,
    purchaseReturn
}) => {

    const initialState = {

        PurchaseReturnId: 0,

        PurchaseOrderId: "",

        GoodsReceiptNoteId: "",

        SupplierId: "",

        PurchaseReturnNumber: "",

        ReturnDate: "",

        Reason: "",

        TotalAmount: "",

        Status: "Pending"

    };

    const [formData,
        setFormData] = useState(initialState);

    useEffect(() => {

        if (purchaseReturn) {

            setFormData({

                PurchaseReturnId:
                    purchaseReturn.PurchaseReturnId || 0,

                PurchaseOrderId:
                    purchaseReturn.PurchaseOrderId || "",

                GoodsReceiptNoteId:
                    purchaseReturn.GoodsReceiptNoteId || "",

                SupplierId:
                    purchaseReturn.SupplierId || "",

                PurchaseReturnNumber:
                    purchaseReturn.PurchaseReturnNumber || "",

                ReturnDate:
                    purchaseReturn.ReturnDate
                        ? purchaseReturn.ReturnDate.substring(0, 10)
                        : "",

                Reason:
                    purchaseReturn.Reason || "",

                TotalAmount:
                    purchaseReturn.TotalAmount || "",

                Status:
                    purchaseReturn.Status || "Pending"

            });

        }
        else {

            setFormData(initialState);

        }

    }, [purchaseReturn, open]);

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

            PurchaseOrderId:
                Number(formData.PurchaseOrderId),

            GoodsReceiptNoteId:
                Number(formData.GoodsReceiptNoteId),

            SupplierId:
                Number(formData.SupplierId),

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

                    formData.PurchaseReturnId

                        ? "Edit Purchase Return"

                        : "Add Purchase Return"

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
                                label="Purchase Order ID"
                                name="PurchaseOrderId"
                                value={formData.PurchaseOrderId}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                label="Goods Receipt Note ID"
                                name="GoodsReceiptNoteId"
                                value={formData.GoodsReceiptNoteId}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                label="Supplier ID"
                                name="SupplierId"
                                value={formData.SupplierId}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                label="Purchase Return Number"
                                name="PurchaseReturnNumber"
                                value={formData.PurchaseReturnNumber}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                type="date"
                                label="Return Date"
                                name="ReturnDate"
                                value={formData.ReturnDate}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Total Amount"
                                name="TotalAmount"
                                value={formData.TotalAmount}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12}>

                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Reason"
                                name="Reason"
                                value={formData.Reason}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12}>

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

                                <MenuItem value="Completed">
                                    Completed
                                </MenuItem>

                                <MenuItem value="Cancelled">
                                    Cancelled
                                </MenuItem>

                            </TextField>

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

export default PurchaseReturnModal;