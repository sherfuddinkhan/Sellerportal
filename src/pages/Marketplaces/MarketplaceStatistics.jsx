
import React from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";

const MarketplaceStatistics = ({
    marketplaces = []
}) => {
    const active = marketplaces.filter(
        (item) =>
            item.isActive ??
            item.IsActive ??
            false
    ).length;

    const inactive =
        marketplaces.length - active;

    return (
        <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography
                            color="text.secondary"
                        >
                            Total Marketplaces
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {marketplaces.length}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography
                            color="text.secondary"
                        >
                            Active
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="success.main"
                        >
                            {active}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography
                            color="text.secondary"
                        >
                            Inactive
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            {inactive}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default MarketplaceStatistics;