import React from "react";
import {Card,CardContent,Typography,Chip,Stack} from "@mui/material";

const CategoryCard = ({ category }) => {
    return (
        <Card>
            <CardContent>
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    {category.categoryName}
                </Typography>
                <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                >
                    {category.description || "-"}
                </Typography>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ mt: 2 }}
                >
                    <Chip
                        label={
                            category.isActive
                                ? "Active"
                                : "Inactive"
                        }
                        color={
                            category.isActive
                                ? "success"
                                : "error"
                        }
                    />
                    <Typography variant="caption">
                        {category.parentCategoryName || "Root"}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default CategoryCard;