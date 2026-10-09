import React from "react";

import {
Grid,
Card,
CardContent,
Typography,
Box
} from "@mui/material";

import {
ReceiptLong,
AccountBalance,
Payments,
Percent
} from "@mui/icons-material";

/* =========================================================
FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
const amount = Number(value);
if (!Number.isFinite(amount)) {
    return "₹ 0.00";
}

return `₹ ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;
};

/* =========================================================
FORMAT NUMBER
========================================================= */

const formatNumber = (value) => {
const number = Number(value);
if (!Number.isFinite(number)) {
    return "0";
}

return number.toLocaleString("en-IN", {
    maximumFractionDigits: 2
});
};

/* =========================================================
GET NUMERIC VALUE
========================================================= */

const getNumericValue = (item, fields) => {
for (const field of fields) {
const value = item?.[field];
    if (
        value !== undefined &&
        value !== null &&
        value !== ""
    ) {
        const number = Number(value);

        if (Number.isFinite(number)) {
            return number;
        }
    }
}

return 0;
};

/* =========================================================
STATISTIC CARD
========================================================= */

const StatisticCard = ({
title,
value,
subtitle,
icon,
iconColor,
backgroundColor
}) => {
return (
<Card
elevation={2}
sx={{
height: "100%",
borderRadius: 2,
transition: "transform 0.2s ease, box-shadow 0.2s ease",
"&:hover": {
transform: "translateY(-3px)",
boxShadow: 5
}
}}
>
<CardContent sx={{ p: 2.5 }}> <Box
                 display="flex"
                 alignItems="center"
                 justifyContent="space-between"
                 gap={2}
             > <Box minWidth={0}> <Typography
                         variant="body2"
                         color="text.secondary"
                         gutterBottom
                     >
{title} </Typography>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{
                            overflowWrap: "anywhere"
                        }}
                    >
                        {value}
                    </Typography>

                    {subtitle && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mt: 0.75 }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        width: 52,
                        height: 52,
                        minWidth: 52,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: iconColor,
                        backgroundColor
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);
};

/* =========================================================
INVOICE TAX DETAIL STATISTICS
========================================================= */

const InvoiceTaxDetailStatistics = ({
data = [],
taxDetails,
loading = false
}) => {
const records = Array.isArray(data)
? data
: Array.isArray(taxDetails)
? taxDetails
: [];

const totalTaxDetails = records.length;

const totalTaxableAmount = records.reduce(
    (total, item) =>
        total +
        getNumericValue(item, [
            "taxableAmount",
            "TaxableAmount",
            "taxable_amount",
            "taxableValue",
            "TaxableValue"
        ]),
    0
);

const totalTaxAmount = records.reduce(
    (total, item) =>
        total +
        getNumericValue(item, [
            "taxAmount",
            "TaxAmount",
            "tax_amount",
            "totalTax",
            "TotalTax"
        ]),
    0
);

const averageTaxRate = totalTaxDetails > 0
    ? records.reduce(
        (total, item) =>
            total +
            getNumericValue(item, [
                "taxRate",
                "TaxRate",
                "tax_rate",
                "rate",
                "Rate"
            ]),
        0
    ) / totalTaxDetails
    : 0;

const statistics = [
    {
        title: "Total Tax Details",
        value: formatNumber(totalTaxDetails),
        subtitle: "Total tax detail records",
        icon: <ReceiptLong fontSize="large" />,
        iconColor: "#1976d2",
        backgroundColor: "#e3f2fd"
    },
    {
        title: "Total Taxable Amount",
        value: formatCurrency(totalTaxableAmount),
        subtitle: "Combined taxable value",
        icon: <AccountBalance fontSize="large" />,
        iconColor: "#2e7d32",
        backgroundColor: "#e8f5e9"
    },
    {
        title: "Total Tax Amount",
        value: formatCurrency(totalTaxAmount),
        subtitle: "Combined tax amount",
        icon: <Payments fontSize="large" />,
        iconColor: "#ed6c02",
        backgroundColor: "#fff3e0"
    },
    {
        title: "Average Tax Rate",
        value: `${formatNumber(averageTaxRate)}%`,
        subtitle: "Average rate across records",
        icon: <Percent fontSize="large" />,
        iconColor: "#9c27b0",
        backgroundColor: "#f3e5f5"
    }
];

if (loading) {
    return null;
}

return (
    <Grid container spacing={2}>
        {statistics.map((statistic) => (
            <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={statistic.title}
            >
                <StatisticCard
                    title={statistic.title}
                    value={statistic.value}
                    subtitle={statistic.subtitle}
                    icon={statistic.icon}
                    iconColor={statistic.iconColor}
                    backgroundColor={statistic.backgroundColor}
                />
            </Grid>
        ))}
    </Grid>
);
};

export default InvoiceTaxDetailStatistics;
