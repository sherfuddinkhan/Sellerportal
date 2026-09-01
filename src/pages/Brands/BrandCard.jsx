import React from "react";
import {Card,CardContent,CardActions,Typography,Button,Chip,Stack,Box} from "@mui/material";
import {Visibility,Edit,Delete} from "@mui/icons-material";
const BrandCard = ({
    brand,
    onView,
    onEdit,
    onDelete
}) => {
    if (!brand) {
        return null;
    }
    return (
        <Card
            elevation={4}
            sx={{
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",

                "&:hover": {
                    boxShadow: 8,
                    transform: "translateY(-3px)"
                }
            }}
        >

            <CardContent
                sx={{
                    flexGrow: 1
                }}
            >
                {/* BRAND NAME */}
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    {brand.brandName || "-"}
                </Typography>
                {/* DESCRIPTION */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={2}
                >
                    {brand.description || "No Description"}
                </Typography>
                {/* STATUS */}
                <Box mt={3}>
                    <Chip
                        label={
                            brand.isActive
                                ? "Active"
                                : "Inactive"
                        }
                        color={
                            brand.isActive
                                ? "success"
                                : "error"
                        }
                        size="small"
                    />
                </Box>
                {/* CREATED DATE */}
                <Box mt={3}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Created
                    </Typography>
                    <Typography>
                        {
                            brand.createdDate
                                ? new Date(
                                    brand.createdDate
                                ).toLocaleDateString()
                                : "-"
                        }
                    </Typography>
                </Box>
            </CardContent>
            {/* ACTIONS */}
            <CardActions>
                <Stack
                    direction="row"
                    spacing={1}
                    width="100%"
                >
                    {/* VIEW */}
                    <Button
                        fullWidth
                        startIcon={
                            <Visibility />
                        }
                        variant="outlined"
                        onClick={() => {
                            console.log(
                                "View Brand:",
                                brand
                            );
                            onView(brand);
                        }}
                    >
                        View
                    </Button>
                    {/* EDIT */}
                    <Button
                        fullWidth
                        startIcon={
                            <Edit />
                        }
                        color="warning"
                        variant="outlined"
                        onClick={() => {
                            console.log(
                                "Edit Brand:",
                                brand
                            );
                            onEdit(brand);
                        }}
                    >
                        Edit
                    </Button>
                    {/* DELETE */}
                    <Button
                        fullWidth
                        startIcon={
                            <Delete />
                        }
                        color="error"
                        variant="outlined"
                        onClick={() => {
                            console.log(
                                "Delete Brand:",
                                brand
                            );

                            onDelete(brand);
                        }}
                    >
                        Delete
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
};


export default BrandCard;
