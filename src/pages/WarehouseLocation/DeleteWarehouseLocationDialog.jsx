import React from "react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";


const DeleteWarehouseLocationDialog = ({
    open,
    location,
    onClose,
    onConfirm
}) => {

    const name =
        location?.LocationName ??
        location?.locationName ??
        location?.LocationCode ??
        location?.locationCode ??
        "this location";


    return (
        <Dialog
            open={open}
            onClose={onClose}
        >

            <DialogTitle>
                Delete Warehouse Location
            </DialogTitle>


            <DialogContent>

                <DialogContentText>
                    Are you sure you want to delete{" "}
                    <strong>{name}</strong>?
                    <br />
                    This action cannot be undone.
                </DialogContentText>

            </DialogContent>


            <DialogActions>

                <Button
                    onClick={onClose}
                >
                    Cancel
                </Button>


                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default DeleteWarehouseLocationDialog;