// =========================================================
// StockAdjustmentDetails.jsx
// Stock Adjustment Details
// =========================================================

import React from "react";

import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Typography
} from "@mui/material";

import {
    Assessment,
    Business,
    CalendarMonth,
    Inventory,
    Numbers,
    Notes,
    Person,
    Warehouse
} from "@mui/icons-material";

// =========================================================
// COMPONENT
// =========================================================

const StockAdjustmentDetails = ({
    adjustment = null
}) => {

    // =========================================================
    // NO DATA
    // =========================================================

    if (!adjustment) {

        return (
            <Card elevation={2}>

                <CardContent>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                    >
                        No stock adjustment details available.
                    </Typography>

                </CardContent>

            </Card>
        );
    }

    // =========================================================
    // GET VALUE
    // =========================================================

    const getValue = (
        camelCase,
        pascalCase,
        defaultValue = "-"
    ) => {

        return (
            adjustment?.[camelCase] ??
            adjustment?.[pascalCase] ??
            defaultValue
        );
    };

    // =========================================================
    // VALUES
    // =========================================================

    const stockAdjustmentId = getValue(
        "stockAdjustmentId",
        "StockAdjustmentId"
    );

    const sellerId = getValue(
        "sellerId",
        "SellerId"
    );

    const customerId = getValue(
        "customerId",
        "CustomerId"
    );

    const productId = getValue(
        "productId",
        "ProductId"
    );

    const warehouseId = getValue(
        "warehouseId",
        "WarehouseId"
    );

    const adjustmentType = getValue(
        "adjustmentType",
        "AdjustmentType"
    );

    const quantity = getValue(
        "quantity",
        "Quantity",
        0
    );

    const adjustmentDate =
        adjustment?.adjustmentDate ??
        adjustment?.AdjustmentDate ??
        adjustment?.date ??
        adjustment?.Date;

    const remarks = getValue(
        "remarks",
        "Remarks",
        ""
    );

    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (value) => {

        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
    };

    // =========================================================
    // TYPE COLOR
    // =========================================================

    const getTypeColor = (type) => {

        switch (
            String(type || "").toLowerCase()
        ) {

            case "damage":
            case "loss":
            case "expired":
                return "error";

            case "found":
            case "return":
                return "success";

            case "correction":
                return "warning";

            default:
                return "default";
        }
    };

    // =========================================================
    // DETAIL ITEM
    // =========================================================

    const DetailItem = ({
        icon,
        label,
        value
    }) => {

        return (
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    height: "100%"
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 30
                    }}
                >
                    {icon}
                </Box>

                <Box
                    sx={{
                        minWidth: 0
                    }}
                >

                    <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                    >
                        {label}
                    </Typography>

                    <Typography
                        variant="body1"
                        fontWeight={600}
                        sx={{
                            wordBreak: "break-word"
                        }}
                    >
                        {value}
                    </Typography>

                </Box>

            </Box>
        );
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box>

            {/* =================================================
                ADJUSTMENT SUMMARY
            ================================================= */}

            <Card
                elevation={2}
                sx={{
                    mb: 3
                }}
            >

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            flexWrap: "wrap",
                            mb: 2
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            }}
                        >

                            <Assessment color="primary" />

                            <Typography
                                variant="h6"
                                fontWeight={600}
                            >
                                Stock Adjustment Details
                            </Typography>

                        </Box>

                        <Chip
                            label={
                                adjustmentType ||
                                "Other"
                            }
                            color={getTypeColor(
                                adjustmentType
                            )}
                            variant="outlined"
                        />

                    </Box>

                    <Divider sx={{ mb: 2 }} />


                    {/* =================================================
                        DETAILS GRID
                    ================================================= */}

                    <Grid
                        container
                        spacing={2}
                    >

                        {/* ADJUSTMENT ID */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <DetailItem
                                icon={
                                    <Numbers
                                        color="primary"
                                    />
                                }
                                label="Adjustment ID"
                                value={
                                    stockAdjustmentId
                                }
                            />

                        </Grid>


                        {/* SELLER */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <DetailItem
                                icon={
                                    <Business
                                        color="primary"
                                    />
                                }
                                label="Seller ID"
                                value={sellerId}
                            />

                        </Grid>


                        {/* CUSTOMER */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <DetailItem
                                icon={
                                    <Person
                                        color="primary"
                                    />
                                }
                                label="Customer ID"
                                value={customerId}
                            />

                        </Grid>


                        {/* PRODUCT */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <DetailItem
                                icon={
                                    <Inventory
                                        color="primary"
                                    />
                                }
                                label="Product ID"
                                value={productId}
                            />

                        </Grid>


                        {/* WAREHOUSE */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <DetailItem
                                icon={
                                    <Warehouse
                                        color="primary"
                                    />
                                }
                                label="Warehouse ID"
                                value={warehouseId}
                            />

                        </Grid>


                        {/* ADJUSTMENT TYPE */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <DetailItem
                                icon={
                                    <Assessment
                                        color="primary"
                                    />
                                }
                                label="Adjustment Type"
                                value={
                                    adjustmentType
                                }
                            />

                        </Grid>


                        {/* QUANTITY */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <DetailItem
                                icon={
                                    <Numbers
                                        color="primary"
                                    />
                                }
                                label="Quantity"
                                value={quantity}
                            />

                        </Grid>


                        {/* DATE */}

                        <Grid
                            size={{
                                xs: 12,
                                sm: 6,
                                md: 4
                            }}
                        >

                            <DetailItem
                                icon={
                                    <CalendarMonth
                                        color="primary"
                                    />
                                }
                                label="Adjustment Date"
                                value={
                                    formatDate(
                                        adjustmentDate
                                    )
                                }
                            />

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* =================================================
                REMARKS
            ================================================= */}

            <Card elevation={2}>

                <CardContent>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2
                        }}
                    >

                        <Notes color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Remarks
                        </Typography>

                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box
                        sx={{
                            p: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            minHeight: 80
                        }}
                    >

                        <Typography
                            variant="body1"
                            sx={{
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word"
                            }}
                        >
                            {remarks ||
                                "No remarks available."}
                        </Typography>

                    </Box>

                </CardContent>

            </Card>

        </Box>
    );
};

export default StockAdjustmentDetails;