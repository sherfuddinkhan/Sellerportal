import React, {useEffect,useState} from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions, Grid,TextField,Button,MenuItem} from "@mui/material";

const CustomerPaymentModal = ({ open,payment,onClose,onSave}) => {
const initialState = {CustomerPaymentId: 0,SalesInvoiceId: "",PaymentNumber: "",PaymentDate: "",Amount: "",PaymentMode: "",ReferenceNumber: "",Remarks: ""};
const [formData,setFormData] = useState(initialState);
    useEffect(() => {
        if (payment) {
            setFormData({
                CustomerPaymentId:payment.CustomerPaymentId || 0,
                SalesInvoiceId: payment.SalesInvoiceId || "",
                PaymentNumber: payment.PaymentNumber || "",
                PaymentDate: payment.PaymentDate ? payment.PaymentDate.substring(0,10) : "",
                Amount: payment.Amount || "",
                PaymentMode: payment.PaymentMode || "",
                ReferenceNumber: payment.ReferenceNumber || "",
                Remarks: payment.Remarks || ""
            });
        }
        else {
            setFormData(initialState);
        }
    }, [payment, open]);

    const handleChange = (e) => {
        const { name,value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = () => {
        if (
            !formData.SalesInvoiceId ||
            !formData.PaymentNumber ||
            !formData.Amount
        ) {
            alert("Sales Invoice, Payment Number and Amount are required.");
            return;
        }
        onSave({
            ...formData,
            Amount:Number(formData.Amount)
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
                    formData.CustomerPaymentId ? "Edit Customer Payment" : "Add Customer Payment"
                }
            </DialogTitle>
            <DialogContent dividers>
                <Grid
                    container
                    spacing={2}
                    sx={{ mt:1 }}
                >
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Sales Invoice ID"
                            name="SalesInvoiceId"
                            type="number"
                            value={formData.SalesInvoiceId}
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
                            label="Payment Number"
                            name="PaymentNumber"
                            value={formData.PaymentNumber}
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
                            label="Payment Date"
                            name="PaymentDate"
                            type="date"
                            InputLabelProps={{
                                shrink:true
                            }}
                            value={formData.PaymentDate}
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
                            label="Amount"
                            name="Amount"
                            type="number"
                            value={formData.Amount}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            select
                            fullWidth
                            label="Payment Mode"
                            name="PaymentMode"
                            value={formData.PaymentMode}
                            onChange={handleChange}
                        >
                            <MenuItem value="Cash">
                                Cash
                            </MenuItem>
                            <MenuItem value="Bank">
                                Bank
                            </MenuItem>
                            <MenuItem value="UPI">
                                UPI
                            </MenuItem>
                            <MenuItem value="Card">
                                Card
                            </MenuItem>
                            <MenuItem value="Cheque">
                                Cheque
                            </MenuItem>
                            <MenuItem value="Net Banking">
                                Net Banking
                            </MenuItem>
                        </TextField>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <TextField
                            fullWidth
                            label="Reference Number"
                            name="ReferenceNumber"
                            value={formData.ReferenceNumber}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                    >
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
                    variant="outlined"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {
                        formData.CustomerPaymentId ? "Update" : "Save"
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default CustomerPaymentModal;