import React from "react";
import {
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Typography
} from "@mui/material";

const money = value =>
    Number(value || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

const SalesInvoiceCard = ({
    invoice,
    onClick
}) => {

    if (!invoice) {
        return null;
    }

    const id =
        invoice?.SalesInvoiceId ??
        invoice?.salesInvoiceId;

    const invoiceNumber =
        invoice?.InvoiceNumber ??
        invoice?.invoiceNumber ??
        "N/A";

    const customer =
        invoice?.CompanyName ??
        invoice?.companyName ??
        "N/A";

    const status =
        invoice?.Status ??
        invoice?.status ??
        "N/A";

    const paymentStatus =
        invoice?.PaymentStatus ??
        invoice?.paymentStatus ??
        "N/A";

    const total =
        invoice?.TotalAmount ??
        invoice?.totalAmount ??
        0;

    return (
        <Card
            onClick={() => onClick?.(invoice)}
            sx={{
                cursor: onClick
                    ? "pointer"
                    : "default",
                height: "100%"
            }}
        >
            <CardContent>

                <Grid
                    container
                    spacing={1}
                >
                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            {invoiceNumber}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Customer
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={600}
                        >
                            {customer}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                    >
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    <Grid
                        item
                        xs={6}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Total
                        </Typography>

                        <Typography
                            variant="body1"
                            fontWeight={700}
                        >
                            ₹{money(total)}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        xs={6}
                        sx={{
                            textAlign: "right"
                        }}
                    >
                        <Chip
                            size="small"
                            label={status}
                        />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Payment
                        </Typography>

                        <Typography variant="body2">
                            {paymentStatus}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                    >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            Invoice ID
                        </Typography>

                        <Typography variant="body2">
                            {id}
                        </Typography>
                    </Grid>

                </Grid>

            </CardContent>
        </Card>
    );
};

export default SalesInvoiceCard;