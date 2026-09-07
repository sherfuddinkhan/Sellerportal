import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    Chip,
    Button
} from "@mui/material";

import {
    AssignmentReturn,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const MarketplaceReturnCard = ({
    marketplaceReturn,
    onView,
    onEdit,
    onDelete
}) => {

    const getStatusColor = (status) => {

        switch ((status || "").toLowerCase()) {

            case "completed":
            case "approved":
                return "success";

            case "pending":
                return "warning";

            case "rejected":
            case "cancelled":
                return "error";

            case "processing":
                return "info";

            default:
                return "default";

        }

    };

    return (

        <Card
            className="marketplace-return-card"
            elevation={3}
        >

            <CardContent>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >

                        <AssignmentReturn
                            color="primary"
                        />

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >

                            {marketplaceReturn.ReturnNumber || "N/A"}

                        </Typography>

                    </Box>

                    <Chip
                        label={
                            marketplaceReturn.ReturnStatus || "N/A"
                        }
                        color={
                            getStatusColor(
                                marketplaceReturn.ReturnStatus
                            )
                        }
                        size="small"
                    />

                </Box>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Marketplace Return ID:</strong>{" "}

                    {marketplaceReturn.MarketplaceReturnId}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Marketplace Order Item ID:</strong>{" "}

                    {marketplaceReturn.MarketplaceOrderItemId}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Quantity Returned:</strong>{" "}

                    {marketplaceReturn.QuantityReturned ?? 0}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Refund Amount:</strong>{" "}

                    ₹
                    {Number(
                        marketplaceReturn.RefundAmount || 0
                    ).toLocaleString()}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Return Date:</strong>{" "}

                    {

                        marketplaceReturn.ReturnDate

                            ?

                            new Date(
                                marketplaceReturn.ReturnDate
                            ).toLocaleDateString()

                            :

                            "-"

                    }

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Reason:</strong>{" "}

                    {marketplaceReturn.ReturnReason || "-"}

                </Typography>

                <Stack
                    direction="row"
                    spacing={1}
                    mt={3}
                >

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() =>
                            onView(marketplaceReturn)
                        }
                    >

                        View

                    </Button>

                    <Button
                        size="small"
                        variant="contained"
                        color="warning"
                        startIcon={<Edit />}
                        onClick={() =>
                            onEdit(marketplaceReturn)
                        }
                    >

                        Edit

                    </Button>

                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() =>
                            onDelete(marketplaceReturn)
                        }
                    >

                        Delete

                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

};

export default MarketplaceReturnCard;