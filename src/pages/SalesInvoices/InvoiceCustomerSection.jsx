import React from "react";
import {
    Box,
    Grid,
    Typography
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

const InvoiceCustomerSection = ({
    invoice,
    customer = {},
    printMode = false
}) => {

    const customerName =
        getValue(
            customer,
            "CustomerName",
            "customerName",
            "Name",
            "name",
            "CompanyName",
            "companyName"
        ) ||
        getValue(invoice, "CompanyName", "companyName") ||
        "N/A";

    const tradeName =
        getValue(
            customer,
            "TradeName",
            "tradeName"
        );

    const legalName =
        getValue(
            customer,
            "LegalName",
            "legalName"
        );

    const mobile =
        getValue(
            customer,
            "MobileNo",
            "mobileNo",
            "Mobile",
            "mobile",
            "Phone",
            "phone"
        ) ||
        invoice?.MobileNo ||
        "";

    const email =
        getValue(
            customer,
            "EmailAddress",
            "emailAddress",
            "Email",
            "email"
        ) ||
        invoice?.EmailAddress ||
        "";

    const address =
        getValue(
            customer,
            "CompanyAddress",
            "companyAddress",
            "Address",
            "address"
        ) ||
        invoice?.CompanyAddress ||
        "";

    const city =
        getValue(
            customer,
            "CompanyCity",
            "companyCity",
            "City",
            "city"
        ) ||
        invoice?.CompanyCity ||
        "";

    const state =
        getValue(
            customer,
            "CompanyState",
            "companyState",
            "State",
            "state"
        ) ||
        invoice?.CompanyState ||
        "";

    const pinCode =
        getValue(
            customer,
            "CompanyPINCode",
            "companyPINCode",
            "PINCode",
            "pinCode",
            "PostalCode",
            "postalCode"
        ) ||
        invoice?.CompanyPINCode ||
        "";

    const gstin =
        getValue(
            customer,
            "CustomerGSTIN",
            "customerGSTIN",
            "GSTIN",
            "Gstin",
            "gstin"
        ) ||
        invoice?.CustomerGSTIN ||
        "";

    return (
        <Box
            sx={{
                borderLeft: "1px solid #222",
                borderRight: "1px solid #222",
                borderBottom: "1px solid #222",
                backgroundColor: "#fff"
            }}
            className={
                printMode
                    ? "invoice-customer-section"
                    : ""
            }
        >
            <Grid container>

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
                        sx={{ mb: 1 }}
                    >
                        BILL TO / CUSTOMER
                    </Typography>

                    <Typography
                        variant="body2"
                        fontWeight={700}
                    >
                        {customerName}
                    </Typography>

                    {tradeName &&
                        tradeName !== customerName && (
                            <Typography variant="body2">
                                Trade Name: {tradeName}
                            </Typography>
                        )}

                    {legalName &&
                        legalName !== customerName && (
                            <Typography variant="body2">
                                Legal Name: {legalName}
                            </Typography>
                        )}

                    {address && (
                        <Typography variant="body2">
                            {address}
                        </Typography>
                    )}

                    {(city ||
                        state ||
                        pinCode) && (
                        <Typography variant="body2">
                            {[city, state, pinCode]
                                .filter(Boolean)
                                .join(" - ")}
                        </Typography>
                    )}

                    {mobile && (
                        <Typography variant="body2">
                            Mobile: {mobile}
                        </Typography>
                    )}

                    {email && (
                        <Typography variant="body2">
                            Email: {email}
                        </Typography>
                    )}

                    {gstin && (
                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            GSTIN: {gstin}
                        </Typography>
                    )}
                </Grid>

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
                        sx={{ mb: 1 }}
                    >
                        SUPPLY DETAILS
                    </Typography>

                    <Typography variant="body2">
                        Supply Type:{" "}
                        {invoice?.SupplyType || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        Place of Supply:{" "}
                        {invoice?.PlaceOfSupply || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        State Code:{" "}
                        {invoice?.StateCode || "N/A"}
                    </Typography>

                    <Typography variant="body2">
                        Reverse Charge:{" "}
                        {invoice?.ReverseCharge
                            ? "Yes"
                            : "No"}
                    </Typography>
                </Grid>

            </Grid>
        </Box>
    );
};

export default InvoiceCustomerSection;