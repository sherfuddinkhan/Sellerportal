import React from "react";

import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";


const InventoryAdjustmentsStatistics = ({
    statistics
}) => {

    return (

        <Grid
            container
            spacing={2}
            sx={{ mb: 2 }}
        >

            <Grid item xs={12} sm={6} md={3}>

                <Card>

                    <CardContent>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Total Adjustments
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={600}
                        >
                            {statistics?.total ?? 0}
                        </Typography>

                    </CardContent>

                </Card>

            </Grid>


            <Grid item xs={12} sm={6} md={3}>

                <Card>

                    <CardContent>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Increased
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={600}
                        >
                            {statistics?.increased ?? 0}
                        </Typography>

                    </CardContent>

                </Card>

            </Grid>


            <Grid item xs={12} sm={6} md={3}>

                <Card>

                    <CardContent>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Decreased
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={600}
                        >
                            {statistics?.decreased ?? 0}
                        </Typography>

                    </CardContent>

                </Card>

            </Grid>


            <Grid item xs={12} sm={6} md={3}>

                <Card>

                    <CardContent>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Total Quantity
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight={600}
                        >
                            {statistics?.totalQuantity ?? 0}
                        </Typography>

                    </CardContent>

                </Card>

            </Grid>

        </Grid>

    );

};

export default InventoryAdjustmentsStatistics;
