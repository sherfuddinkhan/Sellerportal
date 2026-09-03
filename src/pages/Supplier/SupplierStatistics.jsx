import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";

const SupplierStatistics = ({
    suppliers
}) => {

    const totalSuppliers =
        suppliers?.length || 0;

    const sellers = new Set(
        (suppliers || [])
            .map((supplier) => supplier.sellerId)
            .filter(Boolean)
    ).size;

    const activeSuppliers =
        (suppliers || []).filter(
            (supplier) =>
                supplier.isActive === true ||
                supplier.status === "Active"
        ).length;

    return (

        <Grid
            container
            spacing={2}
            mb={2}
        >

            <Grid item xs={12} sm={6} md={4}>

                <Card>

                    <CardContent>

                        <Typography
                            color="text.secondary"
                        >
                            Total Suppliers
                        </Typography>

                        <Typography
                            variant="h4"
                        >
                            {totalSuppliers}
                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

            <Grid item xs={12} sm={6} md={4}>

                <Card>

                    <CardContent>

                        <Typography
                            color="text.secondary"
                        >
                            Sellers
                        </Typography>

                        <Typography
                            variant="h4"
                        >
                            {sellers}
                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

            <Grid item xs={12} sm={6} md={4}>

                <Card>

                    <CardContent>

                        <Typography
                            color="text.secondary"
                        >
                            Active Suppliers
                        </Typography>

                        <Typography
                            variant="h4"
                        >
                            {activeSuppliers}
                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

        </Grid>
    );
};

export default SupplierStatistics;