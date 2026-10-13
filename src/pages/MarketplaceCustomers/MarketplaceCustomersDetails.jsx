import React from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography
} from "@mui/material";

import { Business, Store } from "@mui/icons-material";

const field = (row, name) =>
    row?.[name] ??
    row?.[name.charAt(0).toUpperCase() + name.slice(1)] ??
    "—";

 function MarketplaceCustomersDetails({
    open,
    customer,
    onClose
}) {
    if (!customer) return null;

    const sections = [
        {
            title: "Marketplace Information",
            icon: <Store color="primary" />,
            fields: [
                ["Record ID", "id"],
                ["Marketplace", "marketplaceName"],
                ["Marketplace Customer ID", "marketplaceCustomerId"]
            ]
        },
        {
            title: "Seller and Customer Mapping",
            icon: <Business color="primary" />,
            fields: [
                ["Seller ID", "sellerId"],
                ["Customer ID", "customerId"]
            ]
        },
        {
            title: "Company and Contact",
            fields: [
                ["Company Name", "companyName"],
                ["GSTIN", "gstin"],
                ["Email", "email"],
                ["Phone", "phone"]
            ]
        },
        {
            title: "Address",
            fields: [
                ["Address", "address"],
                ["City", "city"],
                ["State", "state"],
                ["State Code", "stateCode"],
                ["Pincode", "pincode"]
            ]
        },
        {
            title: "Audit Information",
            fields: [
                ["Created At", "createdAt"]
            ]
        }
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                Marketplace Customer Details
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2}>
                    {sections.map((section) => (
                        <Grid item xs={12} key={section.title}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            mb: 2
                                        }}
                                    >
                                        {section.icon}

                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                        >
                                            {section.title}
                                        </Typography>
                                    </Box>

                                    <Grid container spacing={2}>
                                        {section.fields.map(
                                            ([label, name]) => (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                    key={name}
                                                >
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
                                                </Grid>
                                            )
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
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
export default MarketplaceCustomersDetails;