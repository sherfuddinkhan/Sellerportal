import React, { useEffect, useState } from "react";

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

const statusOptions = [
    "Pending",
    "In Transit",
    "Delivered",
    "Cancelled"
];

const initialState = {
    DeliveryChallanId: 0,
    SalesOrderId: "",
    ChallanNumber: "",
    ChallanDate: "",
    VehicleNumber: "",
    DriverName: "",
    DriverMobile: "",
    TransporterName: "",
    Status: "Pending",
    Remarks: ""
};

const DeliveryChallanModal = ({
    open,
    onClose,
    onSave,
    deliveryChallan
}) => {

    const [formData, setFormData] = useState(initialState);

    useEffect(() => {

        if (deliveryChallan) {

            setFormData({

                DeliveryChallanId:
                    deliveryChallan.DeliveryChallanId || 0,

                SalesOrderId:
                    deliveryChallan.SalesOrderId || "",

                ChallanNumber:
                    deliveryChallan.ChallanNumber || "",

                ChallanDate:
                    deliveryChallan.ChallanDate
                        ? deliveryChallan.ChallanDate.substring(0, 10)
                        : "",

                VehicleNumber:
                    deliveryChallan.VehicleNumber || "",

                DriverName:
                    deliveryChallan.DriverName || "",

                DriverMobile:
                    deliveryChallan.DriverMobile || "",

                TransporterName:
                    deliveryChallan.TransporterName || "",

                Status:
                    deliveryChallan.Status || "Pending",

                Remarks:
                    deliveryChallan.Remarks || ""

            });

        }
        else {

            setFormData(initialState);

        }

    }, [deliveryChallan, open]);



    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };



    const handleSubmit = () => {

        if (!formData.SalesOrderId) {

            alert("Sales Order is required");

            return;

        }

        if (!formData.ChallanNumber.trim()) {

            alert("Challan Number is required");

            return;

        }

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

                {formData.DeliveryChallanId
                    ? "Edit Delivery Challan"
                    : "Add Delivery Challan"}

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
                            label="Challan Number"
                            name="ChallanNumber"
                            value={formData.ChallanNumber}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            type="date"
                            label="Challan Date"
                            name="ChallanDate"
                            value={formData.ChallanDate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Vehicle Number"
                            name="VehicleNumber"
                            value={formData.VehicleNumber}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Driver Name"
                            name="DriverName"
                            value={formData.DriverName}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Driver Mobile"
                            name="DriverMobile"
                            value={formData.DriverMobile}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            fullWidth
                            label="Transporter Name"
                            name="TransporterName"
                            value={formData.TransporterName}
                            onChange={handleChange}
                        />

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <TextField
                            select
                            fullWidth
                            label="Status"
                            name="Status"
                            value={formData.Status}
                            onChange={handleChange}
                        >

                            {statusOptions.map(status => (

                                <MenuItem
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </MenuItem>

                            ))}

                        </TextField>

                    </Grid>

                    <Grid item xs={12}>

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
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
                    variant="contained"
                    onClick={handleSubmit}
                >
                    {formData.DeliveryChallanId
                        ? "Update"
                        : "Save"}
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeliveryChallanModal;