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
    Visibility,
    Edit,
    Delete,
    AssignmentReturn
} from "@mui/icons-material";

const PurchaseReturnCard = ({
    purchaseReturn,
    onView,
    onEdit,
    onDelete
}) => {

    const getStatusColor = (status) => {

        switch ((status || "").toLowerCase()) {

            case "completed":
                return "success";

            case "pending":
                return "warning";

            case "cancelled":
                return "error";

            default:
                return "default";

        }

    };

    return (

        <Card
            className="purchase-return-card"
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

                            {purchaseReturn.PurchaseReturnNumber}

                        </Typography>

                    </Box>

                    <Chip
                        label={
                            purchaseReturn.Status || "N/A"
                        }
                        color={
                            getStatusColor(
                                purchaseReturn.Status
                            )
                        }
                        size="small"
                    />

                </Box>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Purchase Return ID:</strong>{" "}

                    {purchaseReturn.PurchaseReturnId}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Purchase Order:</strong>{" "}

                    {purchaseReturn.PurchaseOrderId}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Goods Receipt Note:</strong>{" "}

                    {purchaseReturn.GoodsReceiptNoteId}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Supplier:</strong>{" "}

                    {purchaseReturn.SupplierId}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Return Date:</strong>{" "}

                    {

                        purchaseReturn.ReturnDate

                            ?

                            new Date(
                                purchaseReturn.ReturnDate
                            ).toLocaleDateString()

                            :

                            "-"

                    }

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Total Amount:</strong>{" "}

                    ₹
                    {Number(
                        purchaseReturn.TotalAmount || 0
                    ).toLocaleString()}

                </Typography>

                <Typography
                    variant="body2"
                    gutterBottom
                >

                    <strong>Reason:</strong>{" "}

                    {purchaseReturn.Reason || "-"}

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
                            onView(purchaseReturn)
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
                            onEdit(purchaseReturn)
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
                            onDelete(purchaseReturn)
                        }
                    >

                        Delete

                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

};

export default PurchaseReturnCard;