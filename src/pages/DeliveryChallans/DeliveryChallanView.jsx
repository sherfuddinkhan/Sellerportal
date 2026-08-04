import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Typography,
    Button,
    Divider,
    Chip
} from "@mui/material";

const DeliveryChallanView = ({
    open,
    onClose,
    deliveryChallan
}) => {

    if (!deliveryChallan) return null;

    const getStatusColor = (status) => {

        switch (status?.toLowerCase()) {

            case "delivered":
                return "success";

            case "pending":
                return "warning";

            case "in transit":
                return "info";

            case "cancelled":
                return "error";

            default:
                return "default";

        }

    };

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString();

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >

            <DialogTitle>
                Delivery Challan Details
            </DialogTitle>

            <DialogContent dividers>

                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <Divider sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                General Information
                            </Typography>
                        </Divider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                            Delivery Challan ID
                        </Typography>
                        <Typography>
                            {deliveryChallan.DeliveryChallanId}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                            Sales Order ID
                        </Typography>
                        <Typography>
                            {deliveryChallan.SalesOrderId}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                            Challan Number
                        </Typography>
                        <Typography>
                            {deliveryChallan.ChallanNumber}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                            Challan Date
                        </Typography>
                        <Typography>
                            {formatDate(deliveryChallan.ChallanDate)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Transport Details
                            </Typography>
                        </Divider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                            Vehicle Number
                        </Typography>
                        <Typography>
                            {deliveryChallan.VehicleNumber || "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                            Driver Name
                        </Typography>
                        <Typography>
                            {deliveryChallan.DriverName || "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                            Driver Mobile
                        </Typography>
                        <Typography>
                            {deliveryChallan.DriverMobile || "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                            Transporter Name
                        </Typography>
                        <Typography>
                            {deliveryChallan.TransporterName || "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Status
                            </Typography>
                        </Divider>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                            Current Status
                        </Typography>

                        <Chip
                            label={deliveryChallan.Status || "N/A"}
                            color={getStatusColor(deliveryChallan.Status)}
                            size="small"
                            sx={{ mt: 1 }}
                        />

                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">
                            Created Date
                        </Typography>
                        <Typography>
                            {formatDate(deliveryChallan.CreatedDate)}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2">
                            Remarks
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            {deliveryChallan.Remarks || "-"}
                        </Typography>
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Close
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeliveryChallanView;