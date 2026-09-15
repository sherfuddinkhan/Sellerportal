// ============================================================
// InvoiceBuyerQR.jsx
// Buyer Details QR Code
// ============================================================

import React from "react";

import {
    Box,
    Typography
} from "@mui/material";

import {
    QRCodeSVG
} from "qrcode.react";

// ============================================================
// COMPONENT
// ============================================================

const InvoiceBuyerQR = ({
    invoice = {},
    customer = {}
}) => {

    const customerId =
        customer?.customerId ??
        customer?.CustomerId ??
        invoice?.CustomerId ??
        invoice?.customerId ??
        "";

    const companyName =
        customer?.companyName ||
        customer?.CompanyName ||
        customer?.customerName ||
        invoice?.CompanyName ||
        invoice?.companyName ||
        "";

    const gstin =
        customer?.customerGSTIN ||
        customer?.CustomerGSTIN ||
        invoice?.CustomerGSTIN ||
        invoice?.customerGSTIN ||
        "";

    const mobile =
        customer?.mobileNo ||
        customer?.MobileNo ||
        invoice?.MobileNo ||
        invoice?.mobileNo ||
        "";

    const email =
        customer?.emailAddress ||
        customer?.EmailAddress ||
        invoice?.EmailAddress ||
        invoice?.emailAddress ||
        "";

    const address =
        customer?.companyAddress ||
        customer?.CompanyAddress ||
        invoice?.CompanyAddress ||
        invoice?.companyAddress ||
        "";

    const city =
        customer?.companyCity ||
        customer?.CompanyCity ||
        invoice?.CompanyCity ||
        invoice?.companyCity ||
        "";

    const state =
        customer?.companyState ||
        customer?.CompanyState ||
        invoice?.CompanyState ||
        invoice?.companyState ||
        "";

    const pinCode =
        customer?.companyPINCode ||
        customer?.CompanyPINCode ||
        invoice?.CompanyPINCode ||
        invoice?.companyPINCode ||
        "";

    // --------------------------------------------------------
    // QR DATA
    // --------------------------------------------------------

    const qrData = JSON.stringify({
        customerId,
        companyName,
        gstin,
        mobile,
        email,
        address,
        city,
        state,
        pinCode
    });

    return (
        <Box
            className="invoice-buyer-qr"
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}
        >

            <QRCodeSVG
                value={qrData}
                size={105}
                level="M"
                includeMargin={true}
            />

            <Typography
                sx={{
                    mt: 0.5,
                    fontSize: "8px",
                    fontWeight: 700,
                    textAlign: "center"
                }}
            >
                BUYER DETAILS
            </Typography>

        </Box>
    );
};

export default InvoiceBuyerQR;