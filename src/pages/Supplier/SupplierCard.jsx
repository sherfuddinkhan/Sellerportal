import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Box,
    Divider
} from "@mui/material";

const SupplierCard = ({ supplier }) => {

    if (!supplier) {

        return (
            <Card>
                <CardContent>
                    <Typography color="text.secondary">
                        No supplier selected.
                    </Typography>
                </CardContent>
            </Card>
        );

    }

    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: 500,
                mx: "auto"
            }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        mb: 2
                    }}
                >
                    {supplier.supplierName || "Supplier"}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 1.5 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Supplier ID
                    </Typography>

                    <Typography>
                        {supplier.supplierId ?? "-"}
                    </Typography>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Seller ID
                    </Typography>

                    <Typography>
                        {supplier.sellerId ?? "-"}
                    </Typography>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Contact Person
                    </Typography>

                    <Typography>
                        {supplier.contactPerson ?? "-"}
                    </Typography>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Phone
                    </Typography>

                    <Typography>
                        {supplier.phone ?? "-"}
                    </Typography>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Email
                    </Typography>

                    <Typography>
                        {supplier.email ?? "-"}
                    </Typography>
                </Box>

                <Box>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        GST Number
                    </Typography>

                    <Typography>
                        {supplier.gstNumber ?? "-"}
                    </Typography>
                </Box>

            </CardContent>

        </Card>
    );
};

export default SupplierCard;