import React, { useEffect, useState } from "react";
import {Card,CardContent,Typography,CircularProgress,Alert} from "@mui/material";
import {ResponsiveContainer,BarChart,Bar,XAxis,YAxis,Tooltip,CartesianGrid,Legend} from "recharts";

const OrderChart = () => {

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {

        loadOrders();

    }, []);

    const loadOrders = async () => {

        try {

            setLoading(true);

            const response =
                await apiService.getOrderChart();

            setData(response.data);

        }
        catch (err) {

            console.error(err);

            setError("Unable to load Order Chart.");

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
                    Monthly Orders
                </Typography>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <BarChart
                        data={data}
                    >

                        <CartesianGrid
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="month"
                        />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        <Bar
                            dataKey="orders"
                            fill="#1976d2"
                        />

                    </BarChart>

                </ResponsiveContainer>

            </CardContent>

        </Card>

    );

};

export default OrderChart;