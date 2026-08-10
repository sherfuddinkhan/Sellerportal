import React from "react";
import {Paper,Grid,TextField,FormControl,InputLabel,Select,MenuItem} from "@mui/material";

const ProductImageSearch = ({
    searchText,
    setSearchText,
    imageTypeFilter,
    setImageTypeFilter,
    images = []
}) => {

    const imageTypes = [
        ...new Set(
            images
                .map(item => item.ImageType)
                .filter(Boolean)
        )
    ];
    return (
        <Paper
            elevation={2}
            sx={{
                p:2,
                mb:3
            }}
        >
            <Grid
                container
                spacing={2}
            >
                <Grid
                    item
                    xs={12}
                    md={8}
                >
                    <TextField
                        fullWidth
                        label="Search Product Images"
                        placeholder="Product ID, Image Name, URL..."
                        value={searchText}
                        onChange={(e)=>
                            setSearchText(e.target.value)
                        }
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <FormControl
                        fullWidth
                    >
                        <InputLabel>
                            Image Type
                        </InputLabel>
                        <Select
                            value={imageTypeFilter}
                            label="Image Type"
                            onChange={(e)=>
                                setImageTypeFilter(e.target.value)
                            }
                        >
                            <MenuItem value="">
                                All
                            </MenuItem>
                            {
                                imageTypes.map(
                                    type => (
                                        <MenuItem
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </MenuItem>
                                    )
                                )
                            }
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Paper>
    );
};
export default ProductImageSearch;