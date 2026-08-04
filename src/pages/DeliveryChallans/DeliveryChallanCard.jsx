import React from "react";

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete,
    LocalShipping,
    DirectionsCar,
    Person,
    Business
} from "@mui/icons-material";

const DeliveryChallanCard = ({
    deliveryChallan,
    onView,
    onEdit,
    onDelete
}) => {

    const getStatusColor = (status) => {

        switch (status?.toLowerCase()) {

            case "delivered":
                return "success";

            case "pending":
                return "warning";

            case "in transit":
                return "info";

            case "cancelled":
                return "error";

            default:
                return "default";

        }

    };

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString();

    };

    return (

        <Card
            elevation={3}
            className="delivery-challan-card"
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >

            <CardContent sx={{ flexGrow: 1 }}>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        {deliveryChallan.ChallanNumber}
                    </Typography>

                    <Chip
                        label={deliveryChallan.Status || "N/A"}
                        color={getStatusColor(deliveryChallan.Status)}
                        size="small"
                    />

                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="body2" gutterBottom>

                    <strong>Delivery Challan ID:</strong>{" "}
                    {deliveryChallan.DeliveryChallanId}

                </Typography>

                <Typography variant="body2" gutterBottom>

                    <strong>Sales Order ID:</strong>{" "}
                    {deliveryChallan.SalesOrderId}

                </Typography>

                <Typography variant="body2" gutterBottom>

                    <strong>Challan Date:</strong>{" "}
                    {formatDate(deliveryChallan.ChallanDate)}

                </Typography>

                <Box
                    display="flex"
                    alignItems="center"
                    mt={2}
                >

                    <DirectionsCar
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="body2"
                        sx={{ ml: 1 }}
                    >
                        {deliveryChallan.VehicleNumber || "-"}
                    </Typography>

                </Box>

                <Box
                    display="flex"
                    alignItems="center"
                    mt={1}
                >

                    <Person
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="body2"
                        sx={{ ml: 1 }}
                    >
                        {deliveryChallan.DriverName || "-"}
                    </Typography>

                </Box>

                <Box
                    display="flex"
                    alignItems="center"
                    mt={1}
                >

                    <Business
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="body2"
                        sx={{ ml: 1 }}
                    >
                        {deliveryChallan.TransporterName || "-"}
                    </Typography>

                </Box>

                <Box
                    display="flex"
                    alignItems="center"
                    mt={1}
                >

                    <LocalShipping
                        fontSize="small"
                        color="action"
                    />

                    <Typography
                        variant="body2"
                        sx={{ ml: 1 }}
                    >
                        {deliveryChallan.DriverMobile || "-"}
                    </Typography>

                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    <strong>Remarks:</strong>{" "}

                    {deliveryChallan.Remarks || "-"}

                </Typography>

            </CardContent>

            <CardActions
                sx={{
                    justifyContent: "flex-end"
                }}
            >

                <Tooltip title="View">

                    <IconButton
                        color="primary"
                        onClick={() =>
                            onView(deliveryChallan)
                        }
                    >

                        <Visibility />

                    </IconButton>

                </Tooltip>

                <Tooltip title="Edit">

                    <IconButton
                        color="warning"
                        onClick={() =>
                            onEdit(deliveryChallan)
                        }
                    >

                        <Edit />

                    </IconButton>

                </Tooltip>

                <Tooltip title="Delete">

                    <IconButton
                        color="error"
                        onClick={() =>
                            onDelete(deliveryChallan)
                        }
                    >

                        <Delete />

                    </IconButton>

                </Tooltip>

            </CardActions>

        </Card>

    );

};

export default DeliveryChallanCard;