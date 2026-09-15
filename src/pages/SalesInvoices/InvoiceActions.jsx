import React from "react";
import {
    Box,
    Button,
    Stack
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Print
} from "@mui/icons-material";

const InvoiceActions = ({
    onBack,
    onEdit,
    onPrint,
    showEdit = true
}) => {

    return (
        <Box sx={{ mb: 2 }}>
            <Stack
                direction={{
                    xs: "column",
                    sm: "row"
                }}
                spacing={1}
            >
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={onBack}
                >
                    Back
                </Button>

                {showEdit && (
                    <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={onEdit}
                    >
                        Edit
                    </Button>
                )}

                <Button
                    variant="contained"
                    startIcon={<Print />}
                    onClick={onPrint}
                >
                    Print / Save PDF
                </Button>
            </Stack>
        </Box>
    );
};

export default InvoiceActions;