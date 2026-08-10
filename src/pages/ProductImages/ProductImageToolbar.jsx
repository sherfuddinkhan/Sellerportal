import React from "react";
import {Stack,Typography,Button} from "@mui/material";
import {Add,Refresh,Download} from "@mui/icons-material";


const ProductImageToolbar = ({
    onAdd,
    onRefresh,
    onExport
}) => {

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb:3 }}
        >
            <Typography
                variant="h5"
                fontWeight="bold"
            >
                Product Images
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
                    Add Image
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
export default ProductImageToolbar;