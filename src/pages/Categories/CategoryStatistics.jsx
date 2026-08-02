import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Stack
} from "@mui/material";

import {
    Category,
    CheckCircle,
    Cancel,
    FiberNew
} from "@mui/icons-material";

const StatisticCard = ({
    title,
    value,
    icon,
    color
}) => {

    return (

        <Card
            elevation={3}
        >

            <CardContent>

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                >

                    <div>

                        <Typography

                            variant="body2"

                            color="text.secondary"

                        >

                            {title}

                        </Typography>

                        <Typography

                            variant="h4"

                            fontWeight="bold"

                        >

                            {value}

                        </Typography>

                    </div>

                    <div
                        style={{
                            color: color
                        }}
                    >

                        {icon}

                    </div>

                </Stack>

            </CardContent>

        </Card>

    );

};

const CategoryStatistics = ({
    categories = []
}) => {

    const totalCategories = categories.length;

    const activeCategories =
        categories.filter(x => x.isActive).length;

    const inactiveCategories =
        categories.filter(x => !x.isActive).length;

    const recentCategories =
        categories.filter(x => {

            if (!x.createdDate)
                return false;

            const created =
                new Date(x.createdDate);

            const today =
                new Date();

            const diff =
                (today - created) /
                (1000 * 60 * 60 * 24);

            return diff <= 30;

        }).length;

    return (

        <Grid
            container
            spacing={2}
        >

            <Grid item xs={12} sm={6} md={3}>

                <StatisticCard

                    title="Total Categories"

                    value={totalCategories}

                    icon={<Category fontSize="large" />}

                    color="#1976d2"

                />

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <StatisticCard

                    title="Active"

                    value={activeCategories}

                    icon={<CheckCircle fontSize="large" />}

                    color="#2e7d32"

                />

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <StatisticCard

                    title="Inactive"

                    value={inactiveCategories}

                    icon={<Cancel fontSize="large" />}

                    color="#d32f2f"

                />

            </Grid>

            <Grid item xs={12} sm={6} md={3}>

                <StatisticCard

                    title="Added This Month"

                    value={recentCategories}

                    icon={<FiberNew fontSize="large" />}

                    color="#ed6c02"

                />

            </Grid>

        </Grid>

    );

};

export default CategoryStatistics;