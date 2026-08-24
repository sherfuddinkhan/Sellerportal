import React from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Grid,Typography,Button,Divider,Chip} from "@mui/material";
const WarehouseView = ({
    open,
    warehouse,
    onClose
}) => {
    if (!warehouse) return null;
    const Field = ({
        label,
        value
    }) => (
        <Grid
            item
            xs={12}
            md={6}
        >
            <Typography
                variant="caption"
                color="text.secondary"
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                fontWeight={500}
            >
                {value || "-"}
            </Typography>
        </Grid>
    );
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Warehouse Details
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ mt: 2 }}>
                <Grid
                    container
                    spacing={3}
                >
                   <Field
                        label="Warehouse ID"
                        value={warehouse.WarehouseId}
                    />
                    <Field
                        label="Seller ID"
                        value={warehouse.SellerId}
                    />
                    <Field
                        label="Warehouse Code"
                        value={warehouse.WarehouseCode}
                    />
                    <Field
                        label="Warehouse Name"
                        value={warehouse.WarehouseName}
                    />
                    <Field
                        label="Address Line 1"
                        value={warehouse.AddressLine1}
                    />
                    <Field
                        label="Address Line 2"
                        value={warehouse.AddressLine2}
                    />
                    <Field
                        label="City"
                        value={warehouse.City}
                    />
                    <Field
                        label="State"
                        value={warehouse.State}
                    />
                    <Field
                        label="Country"
                        value={warehouse.Country}
                    />
                    <Field
                        label="Postal Code"
                        value={warehouse.PostalCode}
                    />
                    <Field
                        label="Contact Person"
                        value={warehouse.ContactPerson}
                    />
                    <Field
                        label="Phone"
                        value={warehouse.Phone}
                    />
                    <Field
                        label="Email"
                        value={warehouse.Email}
                    />
                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Status
                        </Typography>
                        <br />
                        <Chip
                            label={ warehouse.IsActive ? "Active" : "Inactive" }
                            color={ warehouse.IsActive ? "success" : "error" }
                        />
                    </Grid>
                    <Field
                        label="Created Date"
                        value={ warehouse.CreatedDate ? new Date( warehouse.CreatedDate).toLocaleString() : "-" }
                    />
                    <Field
                        label="Updated Date"
                        value={ warehouse.UpdatedDate ? new Date(warehouse.UpdatedDate).toLocaleString() : "-"
                        }
                    />
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

export default WarehouseView;