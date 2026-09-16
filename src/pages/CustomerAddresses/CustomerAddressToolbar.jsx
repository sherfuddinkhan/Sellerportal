import React from "react";

import {
    Stack,
    Typography,
    Button
} from "@mui/material";

import {
    Add,
    Refresh,
    Download
} from "@mui/icons-material";


const CustomerAddressToolbar = ({
    onAdd,
    onRefresh,
    onExport
}) => {

    return (

        <Stack
            direction={{
                xs: "column",
                sm: "row"
            }}
            justifyContent="space-between"
            alignItems={{
                xs: "stretch",
                sm: "center"
            }}
            sx={{
                mb: 3,
                gap: 2
            }}
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <Typography
                variant="h5"
                fontWeight="bold"
            >
                Customer Addresses
            </Typography>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <Stack
                direction="row"
                spacing={2}
                sx={{
                    flexWrap: "wrap",
                    gap: 1
                }}
            >

                {/* ADD ADDRESS */}

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAdd}
                    disabled={!onAdd}
                >
                    Add Address
                </Button>


                {/* REFRESH */}

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                    disabled={!onRefresh}
                >
                    Refresh
                </Button>


                {/* EXPORT */}

                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<Download />}
                    onClick={onExport}
                    disabled={!onExport}
                >
                    Export
                </Button>

            </Stack>

        </Stack>
    );
};


export default CustomerAddressToolbar;