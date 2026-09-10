import React from "react";

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack
} from "@mui/material";

const StockMovementFilters = ({
    movementType,
    setMovementType
}) => {

    return (
        <Stack
            direction={{
                xs: "column",
                sm: "row"
            }}
            spacing={2}
            sx={{ mt: 2 }}
        >

            <FormControl
                size="small"
                sx={{ minWidth: 200 }}
            >

                <InputLabel>
                    Movement Type
                </InputLabel>

                <Select
                    value={movementType}
                    label="Movement Type"
                    onChange={(event) =>
                        setMovementType(event.target.value)
                    }
                >

                    <MenuItem value="">
                        All
                    </MenuItem>

                    <MenuItem value="Purchase">
                        Purchase
                    </MenuItem>

                    <MenuItem value="Sale">
                        Sale
                    </MenuItem>

                    <MenuItem value="Transfer">
                        Transfer
                    </MenuItem>

                    <MenuItem value="Adjustment">
                        Adjustment
                    </MenuItem>

                    <MenuItem value="Return">
                        Return
                    </MenuItem>

                </Select>

            </FormControl>

        </Stack>
    );
};

export default StockMovementFilters;