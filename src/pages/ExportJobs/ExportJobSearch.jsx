import React from "react";

import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Search,
    Clear
} from "@mui/icons-material";


/* =========================================================
   COMPONENT
========================================================= */

const ExportJobsSearch = ({
    value = "",
    onChange,
    placeholder = "Search Export Jobs..."
}) => {


    /* =====================================================
       CHANGE
    ===================================================== */

    const handleChange = (event) => {

        if (
            typeof onChange ===
            "function"
        ) {

            onChange(
                event.target.value
            );

        }

    };


    /* =====================================================
       CLEAR
    ===================================================== */

    const handleClear = () => {

        if (
            typeof onChange ===
            "function"
        ) {

            onChange("");

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Box
            sx={{
                width: "100%",
                mb: 2
            }}
        >

            <TextField
                fullWidth
                size="small"
                value={value}
                onChange={
                    handleChange
                }
                placeholder={
                    placeholder
                }
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment
                            position="start"
                        >

                            <Search
                                fontSize="small"
                                color="action"
                            />

                        </InputAdornment>
                    ),

                    endAdornment:
                        value ? (

                            <InputAdornment
                                position="end"
                            >

                                <Tooltip
                                    title="Clear Search"
                                >

                                    <IconButton
                                        size="small"
                                        onClick={
                                            handleClear
                                        }
                                        edge="end"
                                    >

                                        <Clear
                                            fontSize="small"
                                        />

                                    </IconButton>

                                </Tooltip>

                            </InputAdornment>

                        ) : null
                }}
            />

        </Box>

    );

};


/* =========================================================
   EXPORT
========================================================= */

export default ExportJobsSearch;