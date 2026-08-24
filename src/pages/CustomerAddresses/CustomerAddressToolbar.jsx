import React from "react";
import {Stack,Typography,Button} from "@mui/material";
import {Add, Refresh,Download} from "@mui/icons-material";

const CustomerAddressToolbar = ({
    onAdd,
    onRefresh,
    onExport
}) => {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                mb: 3,
                flexWrap: "wrap",
                gap: 2
            }}
        >
            <Typography
                variant="h5"
                fontWeight="bold"
            >
                Customer Addresses
            </Typography>
            <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
            >
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAdd}
                >
                    Add Address
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>
                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<Download />}
                    onClick={onExport}
                >
                    Export
                </Button>
            </Stack>
        </Stack>
    );
};
export default CustomerAddressToolbar;