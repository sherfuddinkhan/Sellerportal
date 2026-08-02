import React from "react";

import {
    Box,
    Button,
    Typography,
    Stack
} from "@mui/material";

import {
    Add,
    Refresh,
    Download
} from "@mui/icons-material";

const ProductPriceToolbar = ({

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

                flexWrap: "wrap",

                gap: 2

            }}

        >

            <Typography

                variant="h4"

                fontWeight="bold"

            >

                Product Prices

            </Typography>

            <Stack

                direction="row"

                spacing={2}

            >

                <Button

                    variant="contained"

                    startIcon={<Add />}

                    onClick={onAdd}

                >

                    Add Price

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

                    startIcon={<Download />}

                    onClick={onExport}

                >

                    Export

                </Button>

            </Stack>

        </Box>

    );

};

export default ProductPriceToolbar;