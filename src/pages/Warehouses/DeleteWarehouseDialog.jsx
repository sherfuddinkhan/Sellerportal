import React from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Typography,Divider} from "@mui/material";

const DeleteWarehouseDialog = ({
    open,
    warehouse,
    onClose,
    onDeleted
}) => {
    if (!warehouse) return null;
    const handleDelete = () => {
        onDeleted(warehouse.WarehouseId);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                Delete Warehouse
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ mt: 2 }}>
                <Typography>
                    Are you sure you want to delete this warehouse?
                </Typography>
                <Typography
                    sx={{ mt: 2 }}
                    fontWeight="bold"
                >
                    Warehouse ID :
                    {" "}
                    {
                        warehouse.WarehouseId
                    }
                </Typography>
                <Typography>
                    Warehouse Code :
                    {" "}
                    {
                        warehouse.WarehouseCode || "-"
                    }
                </Typography>
                <Typography>
                    Warehouse Name :
                    {" "}
                    {
                        warehouse.WarehouseName || "-"
                    }
                </Typography>
                <Typography>
                    City : {" "}
                    {
                        warehouse.City ||
                        "-"
                    }
                </Typography>
                <Typography>
                    State :
                    {" "}
                    {
                        warehouse.State || "-"
                    }
                </Typography>
                <Typography>
                    Contact Person : {" "}
                    {
                        warehouse.ContactPerson || "-"
                    }
                </Typography>
                <Typography>
                    Phone : {" "}
                    {
                        warehouse.Phone || "-"
                    }
                </Typography>
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
                    color="error"
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteWarehouseDialog;