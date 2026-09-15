// ============================================================
// InvoiceDeliveryTerms.jsx
// Terms of Delivery
// ============================================================

import React from "react";

import {
    Box,
    Typography
} from "@mui/material";

// ============================================================
// COMPONENT
// ============================================================

const InvoiceDeliveryTerms = ({
    invoice = {}
}) => {

    const terms =
        invoice?.Transport ||
        invoice?.transport ||
        invoice?.DeliveryTerms ||
        invoice?.deliveryTerms ||
        invoice?.ModeOrTermsOfPayment ||
        invoice?.modeOrTermsOfPayment ||
        "-";

    return (
        <Box
            className="invoice-delivery-terms invoice-section"
            sx={{
                width: "100%",
                border: "1px solid #000",
                boxSizing: "border-box"
            }}
        >

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "42mm 1fr",
                    minHeight: "10mm",
                    alignItems: "stretch"
                }}
            >

                <Box
                    sx={{
                        px: 1,
                        py: 0.7,
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#f5f5f5",
                        borderRight: "1px solid #000"
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: "9px",
                            fontWeight: 700
                        }}
                    >
                        Terms of Delivery
                    </Typography>

                </Box>

                <Box
                    sx={{
                        px: 1,
                        py: 0.7,
                        display: "flex",
                        alignItems: "center"
                    }}
                >

                    <Typography
                        sx={{
                            fontSize: "9px",
                            lineHeight: 1.4
                        }}
                    >
                        {terms}
                    </Typography>

                </Box>

            </Box>

        </Box>
    );
};

export default InvoiceDeliveryTerms;