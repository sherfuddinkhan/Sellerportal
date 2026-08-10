import React from "react";
import {Card,CardContent,CardActions,Typography,Divider,Stack,Button} from "@mui/material";
import {Visibility,Edit,Delete} from "@mui/icons-material";

const formatCurrency = (value) =>
    `₹ ${Number(value || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
const GoodsReceiptNoteItemCard = ({
    item,
    onView,
    onEdit,
    onDelete
}) => {
    return (
        <Card
            className="goods-receipt-note-item-card"
            sx={{
                height:"100%",
                borderRadius:3
            }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    GRN Item #
                    {   item.GoodsReceiptNoteItemId}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Goods Receipt Note ID :
                    {" "}
                    { item.GoodsReceiptNoteId}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Product ID :
                    {" "}
                    { item.ProductId}
                </Typography>
                <Divider
                    sx={{
                        my:2
                    }}
                />
                <Stack
                    spacing={1}
                >
                    <Typography>
                        <strong>
                            Received Qty:
                        </strong>
                        {" "}
                        {item.ReceivedQuantity}
                    </Typography>
                    <Typography>
                        <strong>
                            Accepted Qty:
                        </strong>
                        {" "}
                        {item.AcceptedQuantity}
                    </Typography>
                    <Typography>
                        <strong>
                            Rejected Qty:
                        </strong>
                        {" "}
                        {item.RejectedQuantity}
                    </Typography>
                    <Typography>
                        <strong>
                            Unit Price:
                        </strong>
                        {" "}
                        {
                            formatCurrency(item.UnitPrice)
                        }
                    </Typography>
                    <Typography>
                        <strong>
                            Tax:
                        </strong>
                        {" "}
                        {
                            formatCurrency(item.TaxAmount)
                        }
                    </Typography>
                    <Typography
                        fontWeight="bold"
                    >
                        Total:
                        {" "}
                        {
                            formatCurrency(item.TotalAmount)
                        }
                    </Typography>
                </Stack>
            </CardContent>
            <CardActions
                sx={{
                    justifyContent:"space-between",
                    px:2,
                    pb:2
                }}
            >
                <Button
                    size="small"
                    startIcon={
                        <Visibility />
                    }
                    onClick={() =>
                      onView(item)
                    }
                >
                    View
                </Button>
                <Button
                    size="small"
                    color="warning"
                    startIcon={<Edit />
                    }
                    onClick={() =>
                        onEdit(item)
                    }
                >
                    Edit
                </Button>
                <Button
                    size="small"
                    color="error"
                    startIcon={
                        <Delete />
                    }
                    onClick={() =>
                        onDelete(item)
                    }
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
};
export default GoodsReceiptNoteItemCard;