import React from "react";
import apiService from "../../services/apiService";
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from "@mui/material";

const BrandFilters = ({
    value,
    onChange
}) => {

    return (

        <Box mb={3}>

            <Grid container spacing={2}>

                <Grid item xs={12} sm={6} md={3}>

                    <FormControl fullWidth>

                        <InputLabel>Status</InputLabel>

                        <Select
                            value={value}
                            label="Status"
                            onChange={(e) => onChange(e.target.value)}
                        >

                            <MenuItem value="All">
                                All
                            </MenuItem>

                            <MenuItem value="Active">
                                Active
                            </MenuItem>

                            <MenuItem value="Inactive">
                                Inactive
                            </MenuItem>

                        </Select>

                    </FormControl>

                </Grid>

            </Grid>

        </Box>

    );

};

export default BrandFilters;