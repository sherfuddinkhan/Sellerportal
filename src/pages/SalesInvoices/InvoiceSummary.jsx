import React from "react";

import {
    Box,
    Grid,
    Typography
} from "@mui/material";


// =====================================================
// MONEY FORMATTER
// =====================================================

const money = (value) =>
    Number(value || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );


// =====================================================
// INVOICE SUMMARY
// =====================================================

const InvoiceSummary = ({
    invoice,
    charges = []
}) => {

    // =================================================
    // AMOUNTS
    // =================================================

    const subTotal =
        Number(
            invoice?.SubTotal ??
            invoice?.subTotal ??
            0
        );

    const discount =
        Number(
            invoice?.DiscountAmount ??
            invoice?.discountAmount ??
            0
        );

    const tax =
        Number(
            invoice?.TaxAmount ??
            invoice?.taxAmount ??
            0
        );

    const total =
        Number(
            invoice?.TotalAmount ??
            invoice?.totalAmount ??
            0
        );

    const paid =
        Number(
            invoice?.PaidAmount ??
            invoice?.paidAmount ??
            0
        );

    const balance =
        Number(
            invoice?.BalanceAmount ??
            invoice?.balanceAmount ??
            Math.max(total - paid, 0)
        );


    // =================================================
    // ADDITIONAL CHARGES
    // =================================================

    const additionalCharges =
        (
            Array.isArray(charges)
                ? charges
                : []
        ).reduce(
            (sum, item) =>
                sum +
                Number(
                    item?.TotalAmount ??
                    item?.totalAmount ??
                    0
                ),
            0
        );


    // =================================================
    // RENDER
    // =================================================

    return (
        <Box
            sx={{
                borderLeft: "1px solid #222",
                borderRight: "1px solid #222",
                borderBottom: "1px solid #222"
            }}
        >

            <Grid container>

                {/* =====================================
                    AMOUNT IN WORDS
                ===================================== */}

                <Grid
                    item
                    xs={12}
                    md={7}
                    sx={{
                        p: 1.5,
                        borderRight: {
                            xs: "none",
                            md: "1px solid #222"
                        }
                    }}
                >

                    <Typography
                        variant="subtitle2"
                        fontWeight={800}
                        sx={{
                            mb: 1
                        }}
                    >
                        AMOUNT IN WORDS
                    </Typography>

                    <Typography variant="body2">

                        Total Invoice Amount:{" "}

                        <strong>
                            ₹{money(total)}
                        </strong>

                    </Typography>

                    <Typography
                        variant="caption"
                        display="block"
                        sx={{
                            mt: 1
                        }}
                    >
                        Amount in words can be generated
                        here when required.
                    </Typography>

                </Grid>


                {/* =====================================
                    INVOICE SUMMARY
                ===================================== */}

                <Grid
                    item
                    xs={12}
                    md={5}
                    sx={{
                        p: 1.5
                    }}
                >

                    <Typography
                        variant="subtitle2"
                        fontWeight={800}
                        sx={{
                            mb: 1
                        }}
                    >
                        INVOICE SUMMARY
                    </Typography>


                    {/* SUB TOTAL */}

                    <SummaryRow
                        label="Sub Total"
                        value={subTotal}
                    />


                    {/* DISCOUNT */}

                    <SummaryRow
                        label="Discount"
                        value={discount}
                    />


                    {/* TAX */}

                    <SummaryRow
                        label="Tax"
                        value={tax}
                    />


                    {/* ADDITIONAL CHARGES */}

                    {additionalCharges > 0 && (

                        <SummaryRow
                            label="Additional Charges"
                            value={additionalCharges}
                        />

                    )}


                    {/* GRAND TOTAL */}

                    <Box
                        sx={{
                            borderTop: "2px solid #222",
                            mt: 1,
                            pt: 1
                        }}
                    >

                        <SummaryRow
                            label="GRAND TOTAL"
                            value={total}
                            bold
                        />

                    </Box>


                    {/* PAID */}

                    <SummaryRow
                        label="Paid Amount"
                        value={paid}
                    />


                    {/* BALANCE */}

                    <SummaryRow
                        label="Balance"
                        value={balance}
                        bold
                    />

                </Grid>

            </Grid>

        </Box>
    );
};


// =====================================================
// SUMMARY ROW
// =====================================================

const SummaryRow = ({
    label,
    value,
    bold = false
}) => {

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.5
            }}
        >

            <Typography
                variant="body2"
                fontWeight={
                    bold
                        ? 800
                        : 400
                }
            >
                {label}
            </Typography>


            <Typography
                variant="body2"
                fontWeight={
                    bold
                        ? 800
                        : 400
                }
            >
                ₹{money(value)}
            </Typography>

        </Box>
    );
};


export default InvoiceSummary;