import React from "react";
import {Grid} from "@mui/material";
import CategoryCard from "./CategoryCard";

const CategoryView = ({ categories }) => {
    return (
        <Grid container spacing={2}>
            {
                categories.map(category => (
                    <Grid
                        item
                        xs={12}
                        md={4}
                        key={category.categoryId}
                    >
                        <CategoryCard
                            category={category}
                        />
                    </Grid>
                ))
            }
        </Grid>
    );
};

export default CategoryView;