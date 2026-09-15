import React from "react";
import {
    Box,
    Typography,
    Divider
} from "@mui/material";

const getValue = (object, ...keys) => {
    for (const key of keys) {
        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null &&
            String(object[key]).trim() !== ""
        ) {
            return object[key];
        }
    }

    return "";
};

const InvoiceHeader = ({
    invoice,
    seller = {},
    printMode = false
}) => {

    const sellerName =
        getValue(
            seller,
            "CompanyName",
            "companyName",
            "TradeName",
            "tradeName",
            "LegalName",
            "legalName",
            "Name",
            "name"
        ) || "YOUR COMPANY NAME";

    const sellerAddress =
        getValue(
            seller,
            "CompanyAddress",
            "companyAddress",
            "Address",
            "address"
        );

    const sellerCity =
        getValue(
            seller,
            "CompanyCity",
            "companyCity",
            "City",
            "city"
        );

    const sellerState =
        getValue(
            seller,
            "CompanyState",
            "companyState",
            "State",
            "state"
        );

    const sellerPin =
        getValue(
            seller,
            "CompanyPINCode",
            "companyPINCode",
            "PINCode",
            "pinCode",
            "PostalCode",
            "postalCode"
        );

    const sellerGSTIN =
        getValue(
            seller,
            "GSTIN",
            "Gstin",
            "gstin",
            "GSTNumber",
            "gstNumber"
        ) ||
        invoice?.UserGSTIN ||
        "";

    const sellerMobile =
        getValue(
            seller,
            "MobileNo",
            "mobileNo",
            "Mobile",
            "mobile",
            "Phone",
            "phone",
            "PhoneNo",
            "phoneNo"
        );

    const sellerEmail =
        getValue(
            seller,
            "EmailAddress",
            "emailAddress",
            "Email",
            "email"
        );

    return (
        <Box
            sx={{
                border: "1px solid #222",
                backgroundColor: "#fff"
            }}
            className={
                printMode
                    ? "invoice-print-header"
                    : "invoice-header"
            }
        >
            <Box
                sx={{
                    textAlign: "center",
                    px: 2,
                    py: 2
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                        textTransform: "uppercase"
                    }}
                >
                    {sellerName}
                </Typography>

                {sellerAddress && (
                    <Typography variant="body2">
                        {sellerAddress}
                    </Typography>
                )}

                {(sellerCity ||
                    sellerState ||
                    sellerPin) && (
                    <Typography variant="body2">
                        {[sellerCity, sellerState, sellerPin]
                            .filter(Boolean)
                            .join(" - ")}
                    </Typography>
                )}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        mt: 0.5
                    }}
                >
                    {sellerMobile && (
                        <Typography variant="body2">
                            Mobile: {sellerMobile}
                        </Typography>
                    )}

                    {sellerEmail && (
                        <Typography variant="body2">
                            Email: {sellerEmail}
                        </Typography>
                    )}

                    {sellerGSTIN && (
                        <Typography variant="body2">
                            GSTIN: {sellerGSTIN}
                        </Typography>
                    )}
                </Box>
            </Box>

            <Divider sx={{ borderColor: "#222" }} />

            <Box
                sx={{
                    textAlign: "center",
                    py: 1
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={800}
                >
                    TAX INVOICE
                </Typography>
            </Box>
        </Box>
    );
};

export default InvoiceHeader;