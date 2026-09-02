import React from "react";

import {
    Box,
    Button
} from "@mui/material";

import {
    Add,
    Refresh,
    Download
} from "@mui/icons-material";


const WarehouseLocationToolbar = ({
    onAdd,
    onRefresh,
    onExport
}) => {

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                gap: 2,
                flexWrap: "wrap"
            }}
        >

            <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onAdd}
            >
                Add Location
            </Button>


            <Box
                sx={{
                    display: "flex",
                    gap: 1
                }}
            >

                <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>

                <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={onExport}
                >
                    Export
                </Button>

            </Box>

        </Box>
    );
};


export default WarehouseLocationToolbar;