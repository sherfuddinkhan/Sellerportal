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


const ProductAttributeSearch = ({

    searchText,

    setSearchText,

    attributeTypeFilter,

    setAttributeTypeFilter,

    attributes = []

}) => {



    const attributeTypes = [

        ...new Set(

            attributes

                .map(

                    item => item.AttributeType

                )

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

                        label="Search Product Attributes"

                        placeholder="Attribute Name, Type, Value..."

                        value={searchText}

                        onChange={(e)=>

                            setSearchText(

                                e.target.value

                            )

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

                            Attribute Type

                        </InputLabel>

                        <Select

                            value={attributeTypeFilter}

                            label="Attribute Type"

                            onChange={(e)=>

                                setAttributeTypeFilter(

                                    e.target.value

                                )

                            }

                        >

                            <MenuItem value="">

                                All

                            </MenuItem>

                            {

                                attributeTypes.map(type => (

                                    <MenuItem

                                        key={type}

                                        value={type}

                                    >

                                        {type}

                                    </MenuItem>

                                ))

                            }

                        </Select>

                    </FormControl>

                </Grid>

            </Grid>

        </Paper>

    );

};

export default ProductAttributeSearch;