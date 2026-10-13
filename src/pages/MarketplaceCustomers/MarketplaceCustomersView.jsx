import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Divider
} from "@mui/material";

const field = (row, name) =>
    row?.[name] ??
    row?.[name.charAt(0).toUpperCase() + name.slice(1)] ??
    "—";

function MarketplaceCustomersView({
    open,
    customer,
    onClose
}) {
    if (!customer) return null;

    const fields = [
        ["Record ID", "id"],
        ["Seller ID", "sellerId"],
        ["Customer ID", "customerId"],
        ["Marketplace", "marketplaceName"],
        ["Marketplace Customer ID", "marketplaceCustomerId"],
        ["Company Name", "companyName"],
        ["GSTIN", "gstin"],
        ["Email", "email"],
        ["Phone", "phone"],
        ["Address", "address"],
        ["City", "city"],
        ["State", "state"],
        ["State Code", "stateCode"],
        ["Pincode", "pincode"],
        ["Created At", "createdAt"]
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Marketplace Customer View</DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2}>
                    {fields.map(([label, name]) => (
                        <Grid item xs={12} sm={6} key={name}>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                {label}
                            </Typography>

                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {field(customer, name)}
                            </Typography>

                            <Divider sx={{ mt: 1 }} />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default MarketplaceCustomersView