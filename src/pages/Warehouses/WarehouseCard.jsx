import React from "react";
import {Card,CardContent,CardActions,Typography,Chip,Stack,Divider,IconButton,Tooltip} from "@mui/material";
import {Visibility,Edit,Delete,Warehouse} from "@mui/icons-material";
const WarehouseCard = ({
    warehouse,
    onView,
    onEdit,
    onDelete
}) => {
    if (!warehouse) return null;
    return (
        <Card
            elevation={3}
            sx={{
                height: "100%",
                borderRadius: 2,
                transition: "0.3s",
                "&:hover": {
                    boxShadow: 8,
                    transform: "translateY(-4px)"
                }
            }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Warehouse
                        color="primary"
                    />
                    <Chip
                        label={ warehouse.IsActive ? "Active" : "Inactive" }
                        color={ warehouse.IsActive ? "success" : "error"}
                        size="small"
                    />
                </Stack>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    {
                        warehouse.WarehouseName
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Code:</strong>{" "}
                    {
                        warehouse.WarehouseCode
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>City:</strong>{" "}
                    {
                        warehouse.City || "-"
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>State:</strong>{" "}
                    {
                        warehouse.State || "-"
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Country:</strong>{" "}
                    {
                        warehouse.Country || "-"
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Contact:</strong>{" "}
                    {
                        warehouse.ContactPerson || "-"
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Phone:</strong>{" "}
                    {
                        warehouse.Phone || "-"
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                >
                    <strong>Email:</strong>{" "}
                    {
                        warehouse.Email || "-"
                    }
                </Typography>
            </CardContent>
            <Divider />
            <CardActions
                sx={{
                    justifyContent:
                        "flex-end"
                }}
            >
                <Tooltip title="View">
                    <IconButton
                        color="primary"
                        onClick={() =>
                            onView(warehouse)
                        }
                    >
                        <Visibility />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                    <IconButton
                        color="warning"
                        onClick={() =>
                            onEdit(warehouse)
                        }
                    >
                        <Edit />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        color="error"
                        onClick={() =>
                            onDelete(warehouse)
                        }
                    >
                        <Delete />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default WarehouseCard;