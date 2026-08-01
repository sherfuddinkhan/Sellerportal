import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert
} from "@mui/material";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from "recharts";

import apiService from "../../services/apiService";

const COLORS = [
    "#4CAF50",
    "#FF9800",
    "#F44336",
    "#2196F3"
];

const InventoryChart = () => {

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        loadInventoryChart();

    }, []);

    const loadInventoryChart = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getInventoryChart();

            const chartData = [

                {
                    name: "Available",
                    value: response.data.availableStock
                },

                {
                    name: "Reserved",
                    value: response.data.reservedStock
                },

                {
                    name: "Low Stock",
                    value: response.data.lowStock
                },

                {
                    name: "Out Of Stock",
                    value: response.data.outOfStock
                }

            ];

            setData(chartData);

        }
        catch (err) {

            console.error(err);

            setError("Unable to load inventory chart.");

        }
        finally {

            setLoading(false);

        }

    };

    if (loading)
        return <CircularProgress />;

    if (error)
        return <Alert severity="error">{error}</Alert>;

    return (

        <Card>

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    Inventory Status
                </Typography>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <PieChart>

                        <Pie

                            data={data}

                            dataKey="value"

                            nameKey="name"

                            cx="50%"

                            cy="50%"

                            outerRadius={120}

                            label

                        >

                            {

                                data.map((entry, index) => (

                                    <Cell

                                        key={index}

                                        fill={
                                            COLORS[
                                                index %
                                                    COLORS.length
                                            ]
                                        }

                                    />

                                ))

                            }

                        </Pie>

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </CardContent>

        </Card>

    );

};

export default InventoryChart;