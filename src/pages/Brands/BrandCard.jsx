import React from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Chip,
    Stack,
    Box
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const BrandCard = ({
    brand,
    onView,
    onEdit,
    onDelete
}) => {

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

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >

                    {brand.brandName}

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={2}
                >

                    {brand.description || "No Description"}

                </Typography>

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
                    />

                </Box>

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

            <CardActions>

                <Stack
                    direction="row"
                    spacing={1}
                    width="100%"
                >

                    <Button

                        fullWidth

                        startIcon={<Visibility />}

                        variant="outlined"

                        onClick={() => onView(brand)}

                    >

                        View

                    </Button>

                    <Button

                        fullWidth

                        startIcon={<Edit />}

                        color="warning"

                        variant="outlined"

                        onClick={() => onEdit(brand)}

                    >

                        Edit

                    </Button>

                    <Button

                        fullWidth

                        startIcon={<Delete />}

                        color="error"

                        variant="outlined"

                        onClick={() => onDelete(brand)}

                    >

                        Delete

                    </Button>

                </Stack>

            </CardActions>

        </Card>

    );

};

export default BrandCard;