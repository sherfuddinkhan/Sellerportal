import React from "react";

import {
    Box,
    Button,
    Stack,
    Typography,
    Tooltip
} from "@mui/material";

import {
    Add,
    Refresh
} from "@mui/icons-material";


const PurchaseReturnToolbar = ({
    onAdd,
    onRefresh
}) => {

    const handleAdd = () => {

        if (typeof onAdd === "function") {
            onAdd();
        }

    };


    const handleRefresh = () => {

        if (typeof onRefresh === "function") {
            onRefresh();
        }

    };


    return (

        <Box
            className="purchase-return-toolbar"
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: {
                    xs: "flex-start",
                    sm: "center"
                },
                flexDirection: {
                    xs: "column",
                    sm: "row"
                },
                flexWrap: "wrap",
                mb: 3,
                gap: 2
            }}
        >

            {/* ==========================================================
                TITLE
            ========================================================== */}

            <Box>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Purchase Returns
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    Manage Purchase Returns
                </Typography>

            </Box>


            {/* ==========================================================
                ACTIONS
            ========================================================== */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                spacing={1.5}
                width={{
                    xs: "100%",
                    sm: "auto"
                }}
            >

                {/* ======================================================
                    REFRESH
                ====================================================== */}

                <Tooltip title="Refresh">

                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        startIcon={<Refresh />}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>

                </Tooltip>


                {/* ======================================================
                    ADD
                ====================================================== */}

                <Tooltip title="Add Purchase Return">

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAdd}
                    >
                        Add Purchase Return
                    </Button>

                </Tooltip>

            </Stack>

        </Box>

    );

};


export default PurchaseReturnToolbar;