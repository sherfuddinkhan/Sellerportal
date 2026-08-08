import React from "react";
import {Card,CardContent,CardActions,Typography,Chip,Stack,Divider,IconButton,Tooltip} from "@mui/material";
import {Visibility,Edit,Delete,LocationOn} from "@mui/icons-material";

const CustomerAddressCard = ({
    address,
    onView,
    onEdit,
    onDelete
}) => {
    if (!address) return null;
    return (
        <Card
            elevation={3}
            sx={{
                height: "100%",
                borderRadius: 2,
                transition: "0.3s",
                "&:hover": {
                    boxShadow: 8,
                    transform:
                        "translateY(-4px)"
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
                    <LocationOn
                        color="primary"
                        fontSize="large"
                    />
                    <Chip
                        label={
                            address.IsDefault
                                ? "Default"
                                : "Normal"
                        }
                        color={
                            address.IsDefault
                                ? "success"
                                : "default"
                        }
                        size="small"
                    />
                </Stack>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    {
                        address.AddressType
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Customer ID:</strong>{" "}
                    {
                        address.CustomerId
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Address:</strong>{" "}
                    {
                        address.AddressLine1 ||
                        "-"
                    }
                </Typography>
                {
                    address.AddressLine2 &&
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {
                            address.AddressLine2
                        }
                    </Typography>
                }
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>City:</strong>{" "}
                    {
                        address.City ||
                        "-"
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>State:</strong>{" "}
                    {
                        address.State ||
                        "-"
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Country:</strong>{" "}
                    {
                        address.Country ||
                        "-"
                    }
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Postal Code:</strong>{" "}
                    {
                        address.PostalCode ||
                        "-"
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
                            onView(address)
                        }
                    >
                        <Visibility />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                    <IconButton
                        color="warning"
                        onClick={() =>
                            onEdit(address)
                        }
                    >
                        <Edit />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        color="error"
                        onClick={() =>
                            onDelete(address)
                        }
                    >
                        <Delete />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};


export default CustomerAddressCard;