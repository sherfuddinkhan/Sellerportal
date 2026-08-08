import React from "react";
import {FormControl,InputLabel,Select,MenuItem} from "@mui/material";
const CategoryFilters = ({statusFilter,setStatusFilter
}) => {
    return (
        <FormControl
            fullWidth
            size="small"
        >
            <InputLabel>
                Status
            </InputLabel>
            <Select
                value={statusFilter}
                label="Status"
                onChange={(e) =>
                    setStatusFilter(e.target.value)
                }
            >
                <MenuItem value="All">
                    All
                </MenuItem>
                <MenuItem value="Active">
                    Active
                </MenuItem>
                <MenuItem value="Inactive">
                    Inactive
                </MenuItem>
            </Select>
        </FormControl>
    );
};
export default CategoryFilters;