import React, { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Divider
} from "@mui/material";

import {
    FilterList,
    Clear
} from "@mui/icons-material";

/* =========================================================
   GOODS RECEIPT NOTE ITEM FILTERS
========================================================= */

const GoodsReceiptNoteItemFilters = ({
    items = [],
    onFilterChange
}) => {

    const [filters, setFilters] = useState({
        GoodsReceiptNoteItemId: "",
        GoodsReceiptNoteId: "",
        ProductId: "",
        minReceivedQuantity: "",
        maxReceivedQuantity: "",
        minAcceptedQuantity: "",
        maxAcceptedQuantity: "",
        minRejectedQuantity: "",
        maxRejectedQuantity: "",
        minUnitPrice: "",
        maxUnitPrice: "",
        minTotalAmount: "",
        maxTotalAmount: ""
    });

    /* =========================================================
       UPDATE FILTER
    ========================================================= */

    const handleChange = (field) => (event) => {

        const value = event.target.value;

        setFilters((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    /* =========================================================
       APPLY FILTERS
    ========================================================= */

    const applyFilters = () => {

        const filteredItems = items.filter((item) => {

            /* -------------------------------------------------
               ID FILTERS
            ------------------------------------------------- */

            if (
                filters.GoodsReceiptNoteItemId &&
                String(item.GoodsReceiptNoteItemId) !==
                String(filters.GoodsReceiptNoteItemId)
            ) {
                return false;
            }

            if (
                filters.GoodsReceiptNoteId &&
                String(item.GoodsReceiptNoteId) !==
                String(filters.GoodsReceiptNoteId)
            ) {
                return false;
            }

            if (
                filters.ProductId &&
                String(item.ProductId) !==
                String(filters.ProductId)
            ) {
                return false;
            }

            /* -------------------------------------------------
               RECEIVED QUANTITY
            ------------------------------------------------- */

            const receivedQuantity =
                Number(item.ReceivedQuantity) || 0;

            if (
                filters.minReceivedQuantity !== "" &&
                receivedQuantity <
                Number(filters.minReceivedQuantity)
            ) {
                return false;
            }

            if (
                filters.maxReceivedQuantity !== "" &&
                receivedQuantity >
                Number(filters.maxReceivedQuantity)
            ) {
                return false;
            }

            /* -------------------------------------------------
               ACCEPTED QUANTITY
            ------------------------------------------------- */

            const acceptedQuantity =
                Number(item.AcceptedQuantity) || 0;

            if (
                filters.minAcceptedQuantity !== "" &&
                acceptedQuantity <
                Number(filters.minAcceptedQuantity)
            ) {
                return false;
            }

            if (
                filters.maxAcceptedQuantity !== "" &&
                acceptedQuantity >
                Number(filters.maxAcceptedQuantity)
            ) {
                return false;
            }

            /* -------------------------------------------------
               REJECTED QUANTITY
            ------------------------------------------------- */

            const rejectedQuantity =
                Number(item.RejectedQuantity) || 0;

            if (
                filters.minRejectedQuantity !== "" &&
                rejectedQuantity <
                Number(filters.minRejectedQuantity)
            ) {
                return false;
            }

            if (
                filters.maxRejectedQuantity !== "" &&
                rejectedQuantity >
                Number(filters.maxRejectedQuantity)
            ) {
                return false;
            }

            /* -------------------------------------------------
               UNIT PRICE
            ------------------------------------------------- */

            const unitPrice =
                Number(item.UnitPrice) || 0;

            if (
                filters.minUnitPrice !== "" &&
                unitPrice <
                Number(filters.minUnitPrice)
            ) {
                return false;
            }

            if (
                filters.maxUnitPrice !== "" &&
                unitPrice >
                Number(filters.maxUnitPrice)
            ) {
                return false;
            }

            /* -------------------------------------------------
               TOTAL AMOUNT
            ------------------------------------------------- */

            const totalAmount =
                Number(item.TotalAmount) || 0;

            if (
                filters.minTotalAmount !== "" &&
                totalAmount <
                Number(filters.minTotalAmount)
            ) {
                return false;
            }

            if (
                filters.maxTotalAmount !== "" &&
                totalAmount >
                Number(filters.maxTotalAmount)
            ) {
                return false;
            }

            return true;
        });

        if (typeof onFilterChange === "function") {
            onFilterChange(filteredItems);
        }
    };

    /* =========================================================
       CLEAR FILTERS
    ========================================================= */

    const clearFilters = () => {

        const emptyFilters = {
            GoodsReceiptNoteItemId: "",
            GoodsReceiptNoteId: "",
            ProductId: "",
            minReceivedQuantity: "",
            maxReceivedQuantity: "",
            minAcceptedQuantity: "",
            maxAcceptedQuantity: "",
            minRejectedQuantity: "",
            maxRejectedQuantity: "",
            minUnitPrice: "",
            maxUnitPrice: "",
            minTotalAmount: "",
            maxTotalAmount: ""
        };

        setFilters(emptyFilters);

        if (typeof onFilterChange === "function") {
            onFilterChange(items);
        }
    };

    /* =========================================================
       AUTO APPLY
    ========================================================= */

    useEffect(() => {

        applyFilters();

    }, [filters, items]);

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <Card
            sx={{
                width: "100%",
                mb: 2
            }}
        >

            <CardContent>

                {/* =================================================
                   HEADER
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >

                        <FilterList />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            GRN Item Filters
                        </Typography>

                    </Box>

                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<Clear />}
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </Button>

                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* =================================================
                   IDENTIFICATION FILTERS
                ================================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Identification
                </Typography>

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 3 }}
                >

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="GRN Item ID"
                            type="number"
                            value={filters.GoodsReceiptNoteItemId}
                            onChange={handleChange(
                                "GoodsReceiptNoteItemId"
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="GRN ID"
                            type="number"
                            value={filters.GoodsReceiptNoteId}
                            onChange={handleChange(
                                "GoodsReceiptNoteId"
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Product ID"
                            type="number"
                            value={filters.ProductId}
                            onChange={handleChange(
                                "ProductId"
                            )}
                        />
                    </Grid>

                </Grid>

                {/* =================================================
                   RECEIVED QUANTITY
                ================================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Received Quantity
                </Typography>

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 3 }}
                >

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Minimum Received Quantity"
                            type="number"
                            value={filters.minReceivedQuantity}
                            onChange={handleChange(
                                "minReceivedQuantity"
                            )}
                            inputProps={{
                                min: 0
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Maximum Received Quantity"
                            type="number"
                            value={filters.maxReceivedQuantity}
                            onChange={handleChange(
                                "maxReceivedQuantity"
                            )}
                            inputProps={{
                                min: 0
                            }}
                        />
                    </Grid>

                </Grid>

                {/* =================================================
                   ACCEPTED QUANTITY
                ================================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Accepted Quantity
                </Typography>

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 3 }}
                >

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Minimum Accepted Quantity"
                            type="number"
                            value={filters.minAcceptedQuantity}
                            onChange={handleChange(
                                "minAcceptedQuantity"
                            )}
                            inputProps={{
                                min: 0
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Maximum Accepted Quantity"
                            type="number"
                            value={filters.maxAcceptedQuantity}
                            onChange={handleChange(
                                "maxAcceptedQuantity"
                            )}
                            inputProps={{
                                min: 0
                            }}
                        />
                    </Grid>

                </Grid>

                {/* =================================================
                   REJECTED QUANTITY
                ================================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Rejected Quantity
                </Typography>

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 3 }}
                >

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Minimum Rejected Quantity"
                            type="number"
                            value={filters.minRejectedQuantity}
                            onChange={handleChange(
                                "minRejectedQuantity"
                            )}
                            inputProps={{
                                min: 0
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Maximum Rejected Quantity"
                            type="number"
                            value={filters.maxRejectedQuantity}
                            onChange={handleChange(
                                "maxRejectedQuantity"
                            )}
                            inputProps={{
                                min: 0
                            }}
                        />
                    </Grid>

                </Grid>

                {/* =================================================
                   UNIT PRICE
                ================================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Unit Price
                </Typography>

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 3 }}
                >

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Minimum Unit Price"
                            type="number"
                            value={filters.minUnitPrice}
                            onChange={handleChange(
                                "minUnitPrice"
                            )}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Maximum Unit Price"
                            type="number"
                            value={filters.maxUnitPrice}
                            onChange={handleChange(
                                "maxUnitPrice"
                            )}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />
                    </Grid>

                </Grid>

                {/* =================================================
                   TOTAL AMOUNT
                ================================================= */}

                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                >
                    Total Amount
                </Typography>

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 3 }}
                >

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Minimum Total Amount"
                            type="number"
                            value={filters.minTotalAmount}
                            onChange={handleChange(
                                "minTotalAmount"
                            )}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Maximum Total Amount"
                            type="number"
                            value={filters.maxTotalAmount}
                            onChange={handleChange(
                                "maxTotalAmount"
                            )}
                            inputProps={{
                                min: 0,
                                step: "0.01"
                            }}
                        />
                    </Grid>

                </Grid>

                {/* =================================================
                   ACTIONS
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        flexWrap: "wrap"
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={<Clear />}
                        onClick={clearFilters}
                    >
                        Reset
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<FilterList />}
                        onClick={applyFilters}
                    >
                        Apply Filters
                    </Button>

                </Box>

            </CardContent>

        </Card>
    );
};

export default GoodsReceiptNoteItemFilters;
