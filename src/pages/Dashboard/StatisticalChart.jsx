import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Box,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

import apiService from "../../services/apiService";

const StatisticalChart = () => {

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [chartType, setChartType] = useState("sales");

    const [chartData, setChartData] = useState([]);

    useEffect(() => {

        loadStatistics();

    }, []);

    const loadStatistics = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getDashboardStatistics();

            setChartData(response.data);

        }
        catch (err) {

            console.log(err);

            setError("Unable to load Statistics.");

        }
        finally {

            setLoading(false);

        }

    };

    const handleChartChange = (event, value) => {

        if (value !== null)

            setChartType(value);

    };

    if (loading)

        return (

            <Box textAlign="center" mt={4}>

                <CircularProgress />

            </Box>

        );

    if (error)

        return (

            <Alert severity="error">

                {error}

            </Alert>

        );

    return (

        <Card elevation={3}>

            <CardContent>

                <Box

                    display="flex"

                    justifyContent="space-between"

                    alignItems="center"

                    mb={3}

                >

                    <Typography

                        variant="h6"

                    >

                        Business Statistics

                    </Typography>

                    <ToggleButtonGroup

                        value={chartType}

                        exclusive

                        onChange={handleChartChange}

                        size="small"

                    >

                        <ToggleButton value="sales">

                            Sales

                        </ToggleButton>

                        <ToggleButton value="orders">

                            Orders

                        </ToggleButton>

                        <ToggleButton value="customers">

                            Customers

                        </ToggleButton>

                        <ToggleButton value="revenue">

                            Revenue

                        </ToggleButton>

                    </ToggleButtonGroup>

                </Box>

                <ResponsiveContainer

                    width="100%"

                    height={380}

                >

                    <LineChart

                        data={chartData}

                    >

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        {

                            chartType === "sales" &&

                            <Line

                                type="monotone"

                                dataKey="sales"

                                stroke="#1976d2"

                                strokeWidth={3}

                            />

                        }

                        {

                            chartType === "orders" &&

                            <Line

                                type="monotone"

                                dataKey="orders"

                                stroke="#43a047"

                                strokeWidth={3}

                            />

                        }

                        {

                            chartType === "customers" &&

                            <Line

                                type="monotone"

                                dataKey="customers"

                                stroke="#ef6c00"

                                strokeWidth={3}

                            />

                        }

                        {

                            chartType === "revenue" &&

                            <Line

                                type="monotone"

                                dataKey="revenue"

                                stroke="#8e24aa"

                                strokeWidth={3}

                            />

                        }

                    </LineChart>

                </ResponsiveContainer>

            </CardContent>

        </Card>

    );

};

export default StatisticalChart;