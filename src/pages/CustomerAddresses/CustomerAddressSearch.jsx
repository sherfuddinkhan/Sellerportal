import React from "react";
import {Paper,Grid,TextField,FormControl,InputLabel,Select,MenuItem,InputAdornment} from "@mui/material";
import {Search} from "@mui/icons-material";

const CustomerAddressSearch = ({
    searchText,
    setSearchText,
    addressTypeFilter,
    setAddressTypeFilter
}) => {
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
            >
                <Grid
                    item
                    xs={12}
                    md={8}
                >
                    <TextField
                        fullWidth
                        label="Search Addresses"
                        placeholder="Search by Address Type, Address, City, State, Country or Postal Code"
                        value={searchText}
                        onChange={(e) =>
                            setSearchText(e.target.value)
                        }
                        InputProps={{
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                >
                                    <Search />
                                </InputAdornment>
                            )
                        }}
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
                            Address Type
                        </InputLabel>
                        <Select
                            value={addressTypeFilter}
                            label="Address Type"
                            onChange={(e) =>
                                setAddressTypeFilter(e.target.value)
                            }
                        >
                            <MenuItem value="All">
                                All
                            </MenuItem>
                            <MenuItem value="Billing">
                                Billing
                            </MenuItem>
                            <MenuItem value="Shipping">
                                Shipping
                            </MenuItem>
                            <MenuItem value="Office">
                                Office
                            </MenuItem>
                            <MenuItem value="Home">
                                Home
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Paper>
    );
};


export default CustomerAddressSearch;