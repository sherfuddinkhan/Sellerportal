// ============================================================
// InvoiceHeader.jsx
// Sales Invoice Header
//
// Layout:
// Company Information -> EXTREME LEFT
// Barcode             -> EXTREME LEFT
// QR Code             -> EXTREME RIGHT
// TAX INVOICE         -> CENTER
// ============================================================

import React from "react";

import {
    Box,
    Divider,
    Grid,
    Typography
} from "@mui/material";

import Barcode from "react-barcode";

import InvoiceBuyerQR from "./InvoiceBuyerQR";

// ============================================================
// COMPONENT
// ============================================================

const InvoiceHeader = ({
    invoice = {},
    seller = {},
    customer = {}
}) => {

    const invoiceNumber =
        invoice?.InvoiceNumber ||
        invoice?.invoiceNumber ||
        "-";

    // ========================================================
    // COMPANY INFORMATION
    // ========================================================

    const companyName =
        seller?.companyName ||
        seller?.CompanyName ||
        "YOUR COMPANY NAME";

    const address =
        seller?.companyAddress ||
        seller?.CompanyAddress ||
        "";

    const city =
        seller?.companyCity ||
        seller?.CompanyCity ||
        "";

    const state =
        seller?.companyState ||
        seller?.CompanyState ||
        "";

    const pinCode =
        seller?.companyPINCode ||
        seller?.CompanyPINCode ||
        "";

    const gstin =
        seller?.gstin ||
        seller?.GSTIN ||
        seller?.UserGSTIN ||
        invoice?.UserGSTIN ||
        invoice?.userGSTIN ||
        "";

    // ========================================================
    // LOCATION
    // ========================================================

    const locationParts = [
        address,
        city,
        state,
        pinCode
    ].filter(Boolean);

    // ========================================================
    // RENDER
    // ========================================================

    return (

        <Box
            className="invoice-header"
            sx={{
                width: "100%",
                boxSizing: "border-box",
                color: "#000"
            }}
        >

            {/* =================================================
                COMPANY INFORMATION
            ================================================= */}

            <Box
                sx={{
                    width: "100%",
                    textAlign: "left",
                    mb: "4mm"
                }}
            >

                <Typography
                    sx={{
                        fontSize: "20px",
                        fontWeight: 800,
                        lineHeight: 1.2,
                        textAlign: "left",
                        mb: 0.8
                    }}
                >
                    {companyName}
                </Typography>

                {locationParts.length > 0 && (

                    <Typography
                        sx={{
                            fontSize: "10px",
                            lineHeight: 1.5,
                            textAlign: "left"
                        }}
                    >
                        {locationParts.join(", ")}
                    </Typography>

                )}

                {gstin && (

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: "10px",
                            fontWeight: 700,
                            textAlign: "left"
                        }}
                    >
                        GSTIN: {gstin}
                    </Typography>

                )}

            </Box>

            {/* =================================================
                BARCODE LEFT / QR RIGHT
            ================================================= */}

            <Grid
                container
                sx={{
                    width: "100%",
                    margin: 0,
                    mb: "4mm",
                    alignItems: "flex-start"
                }}
            >

                {/* =================================================
                    EXTREME LEFT
                    BARCODE
                ================================================= */}

                <Grid
                    item
                    xs={6}
                    sx={{
                        width: "50%",
                        maxWidth: "50%",
                        flexBasis: "50%",
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        textAlign: "left",
                        boxSizing: "border-box"
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: "9px",
                            fontWeight: 700,
                            mb: 0.5,
                            textAlign: "left"
                        }}
                    >
                        Invoice Barcode
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            width: "100%",
                            textAlign: "left"
                        }}
                    >

                        <Barcode
                            value={String(invoiceNumber)}
                            format="CODE128"
                            width={1.25}
                            height={42}
                            displayValue={false}
                            margin={0}
                            background="#ffffff"
                        />

                    </Box>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: "9px",
                            fontWeight: 700,
                            letterSpacing: "0.4px",
                            textAlign: "left"
                        }}
                    >
                        {invoiceNumber}
                    </Typography>

                </Grid>

                {/* =================================================
                    EXTREME RIGHT
                    QR CODE
                ================================================= */}

                <Grid
                    item
                    xs={6}
                    sx={{
                        width: "50%",
                        maxWidth: "50%",
                        flexBasis: "50%",
                        padding: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "flex-start",
                        textAlign: "right",
                        boxSizing: "border-box"
                    }}
                >

                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "flex-start",
                            textAlign: "right"
                        }}
                    >

                        <InvoiceBuyerQR
                            invoice={invoice}
                            customer={customer}
                        />

                    </Box>

                </Grid>

            </Grid>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <Divider
                sx={{
                    borderColor: "#000",
                    width: "100%"
                }}
            />

            {/* =================================================
                TAX INVOICE
            ================================================= */}

            <Box
                sx={{
                    width: "100%",
                    textAlign: "center",
                    py: "2mm"
                }}
            >

                <Typography
                    sx={{
                        fontSize: "17px",
                        fontWeight: 800,
                        letterSpacing: "0.8px",
                        textAlign: "center"
                    }}
                >
                    TAX INVOICE
                </Typography>

            </Box>

            <Divider
                sx={{
                    borderColor: "#000",
                    width: "100%"
                }}
            />

        </Box>

    );
};

// ============================================================
// EXPORT
// ============================================================

export default InvoiceHeader;