import React from "react";

import {
    Box,
    Button
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";


const InventoryAdjustmentsToolbar = ({
    onAdd,
    onRefresh
}) => {

    return (

        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                mb: 2
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    gap: 1
                }}
            >

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAdd}
                >
                    Add Adjustment
                </Button>


                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={onRefresh}
                >
                    Refresh
                </Button>

            </Box>

        </Box>

    );

};

export default InventoryAdjustmentsToolbar;
