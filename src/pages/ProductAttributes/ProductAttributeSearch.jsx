// =========================================================
// ProductAttributeSearch.jsx
// Search and Filter Product Attributes
// =========================================================

import React from "react";

import {
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";


// =========================================================
// COMPONENT
// =========================================================

const ProductAttributeSearch = ({
    searchText,
    setSearchText,
    attributeTypeFilter,
    setAttributeTypeFilter,
    attributes = []
}) => {


    // =====================================================
    // GET UNIQUE ATTRIBUTE TYPES
    // =====================================================

    const attributeTypes = [
        ...new Set(

            attributes

                .map((item) =>
                    item.attributeType ??
                    item.AttributeType ??
                    ""
                )

                .filter(Boolean)

        )
    ];


    // =====================================================
    // HANDLE SEARCH
    // =====================================================

    const handleSearchChange = (event) => {

        setSearchText(
            event.target.value
        );
    };


    // =====================================================
    // HANDLE ATTRIBUTE TYPE FILTER
    // =====================================================

    const handleTypeChange = (event) => {

        setAttributeTypeFilter(
            event.target.value
        );
    };


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    const handleClearSearch = () => {

        setSearchText("");
        setAttributeTypeFilter("");
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <Paper
            elevation={2}
            sx={{
                p: 2,
                mb: 3
            }}
        >

            <Grid
                container
                spacing={2}
                alignItems="center"
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

                        label="Search Product Attributes"

                        placeholder={
                            "Product ID, Attribute Name, " +
                            "Type, Value..."
                        }

                        value={searchText}

                        onChange={
                            handleSearchChange
                        }

                        size="small"

                    />

                </Grid>


                {/* =========================================
                    ATTRIBUTE TYPE
                ========================================= */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <FormControl
                        fullWidth
                        size="small"
                    >

                        <InputLabel>
                            Attribute Type
                        </InputLabel>

                        <Select

                            value={
                                attributeTypeFilter
                            }

                            label="Attribute Type"

                            onChange={
                                handleTypeChange
                            }

                        >

                            <MenuItem value="">
                                All
                            </MenuItem>


                            {attributeTypes.map(
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


export default ProductAttributeSearch;
