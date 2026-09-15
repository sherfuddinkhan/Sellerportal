import React from "react";
import {
    Box,
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

const formatDate = value => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-IN");
};

const InvoicePayment = ({
    invoice,
    payments = []
}) => {

    const paidAmount =
        Number(
            invoice?.PaidAmount ??
            invoice?.paidAmount ??
            0
        );

    const balanceAmount =
        Number(
            invoice?.BalanceAmount ??
            invoice?.balanceAmount ??
            0
        );

    return (
        <Box
            sx={{
                borderLeft: "1px solid #222",
                borderRight: "1px solid #222",
                borderBottom: "1px solid #222"
            }}
        >
            <Box sx={{ p: 1 }}>
                <Typography
                    variant="subtitle2"
                    fontWeight={800}
                >
                    PAYMENT DETAILS
                </Typography>
            </Box>

            <Grid container>

                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        p: 1.5,
                        borderTop: "1px solid #222",
                        borderRight: {
                            xs: "none",
                            md: "1px solid #222"
                        }
                    }}
                >
                    <Typography variant="body2">
                        Payment Mode:{" "}
                        <strong>
                            {invoice?.PaymentMode ||
                                "N/A"}
                        </strong>
                    </Typography>

                    <Typography variant="body2">
                        Payment Status:{" "}
                        <strong>
                            {invoice?.PaymentStatus ||
                                "N/A"}
                        </strong>
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        p: 1.5,
                        borderTop: "1px solid #222",
                        borderRight: {
                            xs: "none",
                            md: "1px solid #222"
                        }
                    }}
                >
                    <Typography variant="body2">
                        Paid Amount
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight={800}
                    >
                        ₹{money(paidAmount)}
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        p: 1.5,
                        borderTop: "1px solid #222"
                    }}
                >
                    <Typography variant="body2">
                        Balance Amount
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight={800}
                    >
                        ₹{money(balanceAmount)}
                    </Typography>
                </Grid>

            </Grid>

            {Array.isArray(payments) &&
                payments.length > 0 && (
                    <Box sx={{ p: 1.5 }}>
                        <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ mb: 1 }}
                        >
                            PAYMENT TRANSACTIONS
                        </Typography>

                        {payments.map(
                            (payment, index) => (
                                <Box
                                    key={
                                        payment?.SalesInvoicePaymentId ??
                                        payment?.salesInvoicePaymentId ??
                                        index
                                    }
                                    sx={{
                                        borderTop:
                                            "1px solid #ddd",
                                        py: 0.75
                                    }}
                                >
                                    <Typography variant="body2">
                                        {formatDate(
                                            payment?.PaymentDate ??
                                            payment?.paymentDate
                                        )}{" "}
                                        —{" "}
                                        {payment?.PaymentMode ??
                                            payment?.paymentMode ??
                                            "N/A"}{" "}
                                        — ₹
                                        {money(
                                            payment?.Amount ??
                                            payment?.amount
                                        )}
                                    </Typography>

                                    {(
                                        payment?.ReferenceNumber ??
                                        payment?.referenceNumber
                                    ) && (
                                        <Typography
                                            variant="caption"
                                        >
                                            Reference:{" "}
                                            {payment?.ReferenceNumber ??
                                                payment?.referenceNumber}
                                        </Typography>
                                    )}
                                </Box>
                            )
                        )}
                    </Box>
                )}
        </Box>
    );
};

export default InvoicePayment;