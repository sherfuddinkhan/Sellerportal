// =========================================================
// ProductImageSearch.jsx
// Product Image Search & Filter
//
// FRONTEND ONLY
// No apiService
// No fetch
// No Axios
// No server.js calls
//
// ProductImageList.jsx provides the images.
// This component only handles search/filter UI.
// =========================================================

import React, {
    useMemo,
} from "react";

import {
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";


// =========================================================
// COMPONENT
// =========================================================

const ProductImageSearch = ({
    searchText,
    setSearchText,
    imageTypeFilter,
    setImageTypeFilter,
    images = [],
}) => {


    // =====================================================
    // GET AVAILABLE IMAGE TYPES
    // =====================================================

    const imageTypes = useMemo(() => {

        const types = images
            .map((item) =>
                item.ImageType ??
                item.imageType ??
                ""
            )
            .filter(
                (type) =>
                    String(type).trim() !== ""
            );


        return [
            ...new Set(types),
        ].sort();

    }, [images]);


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 3,
            }}
        >

            <Grid
                container
                spacing={2}
            >

                {/* =========================================
                    SEARCH
                ========================================= */}

                <Grid
                    item
                    xs={12}
                    md={8}
                >

                    <TextField

                        fullWidth

                        label="Search Product Images"

                        placeholder={
                            "Product ID, Image Name, URL..."
                        }

                        value={
                            searchText
                        }

                        onChange={(event) =>
                            setSearchText(
                                event.target.value
                            )
                        }

                        variant="outlined"

                    />

                </Grid>


                {/* =========================================
                    IMAGE TYPE FILTER
                ========================================= */}

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

                            value={
                                imageTypeFilter
                            }

                            label="Image Type"

                            onChange={(event) =>
                                setImageTypeFilter(
                                    event.target.value
                                )
                            }

                        >

                            {/* =================================
                                ALL
                            ================================= */}

                            <MenuItem value="">
                                All
                            </MenuItem>


                            {/* =================================
                                AVAILABLE TYPES
                            ================================= */}

                            {imageTypes.map(
                                (type) => (

                                    <MenuItem
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>

                </Grid>

            </Grid>

        </Paper>

    );

};


export default ProductImageSearch;
