import React from "react";

import {
Grid,
Card,
CardContent,
Typography
} from "@mui/material";

import {
Inventory2,
Numbers,
CurrencyRupee,
ReceiptLong
} from "@mui/icons-material";

/* =========================================================
FORMAT NUMBER
========================================================= */

const formatNumber = (value, decimals = 0) => {

```
const number = Number(value);

if (!Number.isFinite(number)) {
    return decimals > 0
        ? Number(0).toFixed(decimals)
        : "0";
}

return number.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
});
```

};

/* =========================================================
FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
const number = Number(value);

if (!Number.isFinite(number)) {
    return "₹ 0.00";
}

return `₹ ${number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
})}`;
};

/* =========================================================
PURCHASE ORDER ITEM STATISTICS
========================================================= */

const PurchaseOrderItemStatistics = ({
statistics = {}
}) => {
const totalItems = Number(statistics.totalItems) || 0;
const totalQuantity = Number(statistics.totalQuantity) || 0;
const totalAmount = Number(statistics.totalAmount) || 0;
const totalTax = Number(statistics.totalTax) || 0;


/* =====================================================
   STATISTIC CARDS
===================================================== */

const cards = [
    {
        title: "Total Items",
        value: formatNumber(totalItems),
        icon: <Inventory2 />
    },
    {
        title: "Total Quantity",
        value: formatNumber(totalQuantity, 2),
        icon: <Numbers />
    },
    {
        title: "Total Amount",
        value: formatCurrency(totalAmount),
        icon: <CurrencyRupee />
    },
    {
        title: "Total Tax",
        value: formatCurrency(totalTax),
        icon: <ReceiptLong />
    }
];


/* =====================================================
   RENDER
===================================================== */

return (
    <Grid
        container
        spacing={2}
        mb={3}
    >

        {cards.map((card, index) => (

            <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
            >

                <Card
                    className="purchase-order-item-stat-card"
                    sx={{
                        height: "100%",
                        borderRadius: 3
                    }}
                >

                    <CardContent>

                        <Typography
                            color="text.secondary"
                            variant="body2"
                            display="flex"
                            alignItems="center"
                            gap={1}
                        >

                            {card.icon}

                            {card.title}

                        </Typography>


                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            mt={1}
                        >

                            {card.value}

                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

        ))}

    </Grid>
);


};

export default PurchaseOrderItemStatistics;
