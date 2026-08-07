import React from "react";
import {Paper,Grid,TextField,FormControl,InputLabel,Select,MenuItem,InputAdornment} from "@mui/material";
import {Search} from "@mui/icons-material";

const CustomerPaymentSearch = ({searchText,setSearchText,paymentModeFilter,setPaymentModeFilter}) => {
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
                        label="Search Payments"
                        placeholder="Search by Payment Number, Reference Number, Payment Mode or Remarks"
                        value={searchText}
                        onChange={(e) =>
                            setSearchText( e.target.value)
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
                            Payment Mode
                        </InputLabel>
                        <Select
                            value={paymentModeFilter}
                            label="Payment Mode"
                            onChange={(e) =>
                                setPaymentModeFilter(e.target.value)
                            }
                        >
                            <MenuItem value="All">
                                All
                            </MenuItem>
                            <MenuItem value="Cash">
                                Cash
                            </MenuItem>
                            <MenuItem value="Bank">
                                Bank
                            </MenuItem>
                            <MenuItem value="UPI">
                                UPI
                            </MenuItem>
                            <MenuItem value="Card">
                                Card
                            </MenuItem>
                            <MenuItem value="Cheque">
                                Cheque
                            </MenuItem>
                            <MenuItem value="Net Banking">
                                Net Banking
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Paper>
    );

};

export default CustomerPaymentSearch;