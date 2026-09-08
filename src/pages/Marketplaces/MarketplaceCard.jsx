import React from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    Divider,
    IconButton,
    Tooltip,
    Stack
} from "@mui/material";

import {
    Store,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const MarketplaceCard = ({
    marketplace,
    onView,
    onEdit,
    onDelete
}) => {
    if (!marketplace) return null;

    const id =
        marketplace.marketplaceId ??
        marketplace.MarketplaceId;

    const name =
        marketplace.marketplaceName ??
        marketplace.MarketplaceName ??
        "-";

    const code =
        marketplace.marketplaceCode ??
        marketplace.MarketplaceCode ??
        "-";

    const active =
        marketplace.isActive ??
        marketplace.IsActive ??
        false;

    return (
        <Card
            elevation={3}
            sx={{
                height: "100%",
                borderRadius: 2,
                transition: "0.3s",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 8
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
                    <Store
                        color="primary"
                        fontSize="large"
                    />

                    <Chip
                        label={
                            active
                                ? "Active"
                                : "Inactive"
                        }
                        color={
                            active
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
                    {name}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>ID:</strong> {id}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    <strong>Code:</strong> {code}
                </Typography>
            </CardContent>

            <Divider />

            <CardActions
                sx={{ justifyContent: "flex-end" }}
            >
                <Tooltip title="View">
                    <IconButton
                        color="primary"
                        onClick={() => onView?.(id)}
                    >
                        <Visibility />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                    <IconButton
                        color="warning"
                        onClick={() => onEdit?.(id)}
                    >
                        <Edit />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                    <IconButton
                        color="error"
                        onClick={() => onDelete?.(id)}
                    >
                        <Delete />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default MarketplaceCard;