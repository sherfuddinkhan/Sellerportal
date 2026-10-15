import React from "react";

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";


const InventoryAdjustmentsFilters = ({
    filters,
    onChange,
    onReset
}) => {

    const handleChange = (
        field,
        value
    ) => {

        onChange({
            ...filters,
            [field]: value
        });

    };


    return (

        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mb: 2
            }}
        >

            <FormControl
                size="small"
                sx={{
                    minWidth: 180
                }}
            >

                <InputLabel>
                    Adjustment Type
                </InputLabel>

                <Select
                    value={
                        filters?.adjustmentType || ""
                    }
                    label="Adjustment Type"
                    onChange={(event) =>
                        handleChange(
                            "adjustmentType",
                            event.target.value
                        )
                    }
                >

                    <MenuItem value="">
                        All Types
                    </MenuItem>

                    <MenuItem value="INCREASE">
                        Increase
                    </MenuItem>

                    <MenuItem value="DECREASE">
                        Decrease
                    </MenuItem>

                </Select>

            </FormControl>


            <FormControl
                size="small"
                sx={{
                    minWidth: 160
                }}
            >

                <InputLabel>
                    Status
                </InputLabel>

                <Select
                    value={
                        filters?.status || ""
                    }
                    label="Status"
                    onChange={(event) =>
                        handleChange(
                            "status",
                            event.target.value
                        )
                    }
                >

                    <MenuItem value="">
                        All Statuses
                    </MenuItem>

                    <MenuItem value="PENDING">
                        Pending
                    </MenuItem>

                    <MenuItem value="APPROVED">
                        Approved
                    </MenuItem>

                    <MenuItem value="COMPLETED">
                        Completed
                    </MenuItem>

                    <MenuItem value="CANCELLED">
                        Cancelled
                    </MenuItem>

                </Select>

            </FormControl>


            <Button
                variant="outlined"
                onClick={onReset}
            >
                Reset Filters
            </Button>

        </Box>

    );

};

export default InventoryAdjustmentsFilters;
