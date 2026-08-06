import React, {useEffect,useState} from "react";
import {Dialog,DialogTitle, DialogContent,DialogActions,Grid,TextField,Button,MenuItem} from "@mui/material";

const MarketplaceReturnModal = ({open,onClose,onSave,marketplaceReturn
}) => {

    const initialState = {
        MarketplaceReturnId: 0,
        MarketplaceOrderItemId: "",
        ReturnNumber: "",
        ReturnReason: "",
        ReturnStatus: "Pending",
        QuantityReturned: "",
        RefundAmount: "",
        ReturnDate: ""
    };
    const [formData,setFormData] = useState(initialState);
    useEffect(() => {
        if (marketplaceReturn) {
            setFormData({
                MarketplaceReturnId:marketplaceReturn.MarketplaceReturnId || 0,
                MarketplaceOrderItemId: marketplaceReturn.MarketplaceOrderItemId || "",
                ReturnNumber: marketplaceReturn.ReturnNumber || "",
                ReturnReason: marketplaceReturn.ReturnReason || "",
                ReturnStatus: marketplaceReturn.ReturnStatus || "Pending",
                QuantityReturned:marketplaceReturn.QuantityReturned || "",
                RefundAmount:marketplaceReturn.RefundAmount || "",
                ReturnDate:marketplaceReturn.ReturnDate? marketplaceReturn.ReturnDate.substring(0, 10): ""
            });

        }
        else {

            setFormData(initialState);

        }

    }, [marketplaceReturn, open]);

    const handleChange = (e) => {

        const {name,value} = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            MarketplaceOrderItemId:Number(formData.MarketplaceOrderItemId),
            QuantityReturned:Number(formData.QuantityReturned),
            RefundAmount:Number(formData.RefundAmount)
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

                    formData.MarketplaceReturnId

                        ? "Edit Marketplace Return"

                        : "Add Marketplace Return"

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
                                label="Marketplace Order Item ID"
                                name="MarketplaceOrderItemId"
                                value={formData.MarketplaceOrderItemId}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                label="Return Number"
                                name="ReturnNumber"
                                value={formData.ReturnNumber}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Quantity Returned"
                                name="QuantityReturned"
                                value={formData.QuantityReturned}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Refund Amount"
                                name="RefundAmount"
                                value={formData.RefundAmount}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} sm={6}>

                            <TextField
                                fullWidth
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
                                select
                                fullWidth
                                label="Return Status"
                                name="ReturnStatus"
                                value={formData.ReturnStatus}
                                onChange={handleChange}
                            >

                                <MenuItem value="Pending">
                                    Pending
                                </MenuItem>

                                <MenuItem value="Approved">
                                    Approved
                                </MenuItem>

                                <MenuItem value="Completed">
                                    Completed
                                </MenuItem>

                                <MenuItem value="Rejected">
                                    Rejected
                                </MenuItem>

                                <MenuItem value="Cancelled">
                                    Cancelled
                                </MenuItem>

                            </TextField>

                        </Grid>

                        <Grid item xs={12}>

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Return Reason"
                                name="ReturnReason"
                                value={formData.ReturnReason}
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

export default MarketplaceReturnModal;