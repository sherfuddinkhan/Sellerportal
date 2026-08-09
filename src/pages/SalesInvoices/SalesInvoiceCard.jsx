import React from "react";
import {Card,CardContent,CardActions,Typography,Stack,Chip,Divider,Button} from "@mui/material";
import {Visibility,Edit,Delete} from "@mui/icons-material";
const formatCurrency = (value) =>`₹ ${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => value ? new Date(value).toLocaleDateString(): "-";
const getStatusColor = (status) => {
    switch ((status || "").toLowerCase()) {
        case "paid":
        case "completed":
            return "success";
        case "pending":
            return "warning";
        case "partially paid":
        case "partial":
            return "info";
        case "cancelled":
        case "rejected":
            return "error";
        default:
            return "default";
    }
};

const SalesInvoiceCard = ({
    item,
    onView,
    onEdit,
    onDelete
}) => {

    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 2
            }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    {item.InvoiceNumber}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Invoice ID : {item.SalesInvoiceId}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Sales Order : {item.SalesOrderId}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Date : {formatDate(item.InvoiceDate)}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                    <Typography variant="body2">
                        <strong>Sub Total:</strong>{" "}
                        {formatCurrency(item.SubTotal)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Discount:</strong>{" "}
                        {formatCurrency(item.DiscountAmount)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Tax:</strong>{" "}
                        {formatCurrency(item.TaxAmount)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Total:</strong>{" "}
                        {formatCurrency(item.TotalAmount)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Paid:</strong>{" "}
                        {formatCurrency(item.PaidAmount)}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Balance:</strong>{" "}
                        {formatCurrency(item.BalanceAmount)}
                    </Typography>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                >
                    <Chip
                        label={
                            item.PaymentStatus || "-"
                        }
                        color={getStatusColor(
                            item.PaymentStatus
                        )}
                        size="small"
                    />
                    <Chip
                        label={
                            item.Status || "-"
                        }
                        color={getStatusColor(
                            item.Status
                        )}
                        size="small"
                    />
                </Stack>
                {item.Remarks && (
                    <Typography
                        variant="body2"
                        sx={{ mt: 2 }}
                    >
                        <strong>Remarks:</strong>{" "}
                        {item.Remarks}
                    </Typography>
                )}
            </CardContent>
            <CardActions
                sx={{
                    justifyContent: "space-between",
                    px: 2,
                    pb: 2
                }}
            >
                <Button
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => onView(item)}
                >
                    View
                </Button>
                <Button
                    size="small"
                    color="warning"
                    startIcon={<Edit />}
                    onClick={() => onEdit(item)}
                >
                    Edit
                </Button>
                <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => onDelete(item)}
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};

export default SalesInvoiceCard;