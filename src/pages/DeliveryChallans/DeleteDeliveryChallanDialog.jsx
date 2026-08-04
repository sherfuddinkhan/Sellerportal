import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
    Box
} from "@mui/material";

import {
    WarningAmber
} from "@mui/icons-material";

const DeleteDeliveryChallanDialog = ({
    open,
    onClose,
    deliveryChallan,
    onDeleted
}) => {

    const handleDelete = () => {

        if (deliveryChallan?.DeliveryChallanId) {

            onDeleted(deliveryChallan.DeliveryChallanId);

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                }}
            >

                <WarningAmber color="error" />

                Delete Delivery Challan

            </DialogTitle>

            <DialogContent>

                <DialogContentText>

                    Are you sure you want to delete this Delivery Challan?

                </DialogContentText>

                {deliveryChallan && (

                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            border: "1px solid #e0e0e0",
                            borderRadius: 2,
                            backgroundColor: "#fafafa"
                        }}
                    >

                        <Typography>
                            <strong>ID :</strong>{" "}
                            {deliveryChallan.DeliveryChallanId}
                        </Typography>

                        <Typography>
                            <strong>Sales Order :</strong>{" "}
                            {deliveryChallan.SalesOrderId}
                        </Typography>

                        <Typography>
                            <strong>Challan Number :</strong>{" "}
                            {deliveryChallan.ChallanNumber}
                        </Typography>

                        <Typography>
                            <strong>Vehicle :</strong>{" "}
                            {deliveryChallan.VehicleNumber || "-"}
                        </Typography>

                        <Typography>
                            <strong>Driver :</strong>{" "}
                            {deliveryChallan.DriverName || "-"}
                        </Typography>

                        <Typography>
                            <strong>Transporter :</strong>{" "}
                            {deliveryChallan.TransporterName || "-"}
                        </Typography>

                        <Typography>
                            <strong>Status :</strong>{" "}
                            {deliveryChallan.Status || "-"}
                        </Typography>

                    </Box>

                )}

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    variant="outlined"
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>

    );

};

export default DeleteDeliveryChallanDialog;