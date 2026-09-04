import React from "react";
import PropTypes from "prop-types";

import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Typography,
} from "@mui/material";


// ======================================================
// ReviewPagination Component
// ======================================================

const ReviewPagination = ({
    page = 1,
    pageSize = 10,
    totalItems = 0,
    onPageChange,
    onPageSizeChange,
}) => {

    // ==================================================
    // Safe Values
    // ==================================================

    const safePage =
        Math.max(1, Number(page) || 1);

    const safePageSize =
        Math.max(1, Number(pageSize) || 10);

    const safeTotalItems =
        Math.max(0, Number(totalItems) || 0);


    // ==================================================
    // Calculations
    // ==================================================

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                safeTotalItems /
                safePageSize
            )
        );


    const startItem =
        safeTotalItems === 0
            ? 0
            : (
                (safePage - 1) *
                safePageSize
            ) + 1;


    const endItem =
        Math.min(
            safePage * safePageSize,
            safeTotalItems
        );


    // ==================================================
    // Page Change
    // ==================================================

    const handlePageChange = (
        event,
        value
    ) => {

        if (onPageChange) {
            onPageChange(value);
        }

    };


    // ==================================================
    // Page Size Change
    // ==================================================

    const handlePageSizeChange = (
        event
    ) => {

        const newSize =
            Number(event.target.value);

        if (
            onPageSizeChange &&
            Number.isFinite(newSize) &&
            newSize > 0
        ) {

            onPageSizeChange(newSize);

        }

    };


    // ==================================================
    // JSX
    // ==================================================

    return (

        <Box
            sx={{
                mt: 2,
                px: 2,
                py: 1.5,
                borderTop: "1px solid",
                borderColor: "divider",
            }}
        >

            <Stack
                direction={{
                    xs: "column",
                    md: "row",
                }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{
                    xs: "stretch",
                    md: "center",
                }}
            >

                {/* ======================================
                    Records Information
                ====================================== */}

                <Typography
                    variant="body2"
                    color="text.secondary"
                >

                    Showing{" "}

                    <strong>
                        {startItem}
                    </strong>

                    {" "}to{" "}

                    <strong>
                        {endItem}
                    </strong>

                    {" "}of{" "}

                    <strong>
                        {safeTotalItems}
                    </strong>

                    {" "}reviews

                </Typography>


                {/* ======================================
                    Pagination Controls
                ====================================== */}

                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="flex-end"
                    flexWrap="wrap"
                    useFlexGap
                >

                    {/* ==================================
                        Page Size
                    ================================== */}

                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 120,
                        }}
                    >

                        <InputLabel>
                            Rows
                        </InputLabel>

                        <Select
                            label="Rows"
                            value={safePageSize}
                            onChange={
                                handlePageSizeChange
                            }
                        >

                            {[10, 25, 50, 100].map(
                                (size) => (

                                    <MenuItem
                                        key={size}
                                        value={size}
                                    >
                                        {size} / page
                                    </MenuItem>

                                )
                            )}

                        </Select>

                    </FormControl>


                    {/* ==================================
                        Pagination
                    ================================== */}

                    <Pagination

                        page={Math.min(
                            safePage,
                            totalPages
                        )}

                        count={totalPages}

                        color="primary"

                        shape="rounded"

                        showFirstButton

                        showLastButton

                        siblingCount={1}

                        boundaryCount={1}

                        onChange={
                            handlePageChange
                        }

                    />

                </Stack>

            </Stack>

        </Box>
    );
};


// ======================================================
// PropTypes
// ======================================================

ReviewPagination.propTypes = {

    page:
        PropTypes.number,

    pageSize:
        PropTypes.number,

    totalItems:
        PropTypes.number,

    onPageChange:
        PropTypes.func,

    onPageSizeChange:
        PropTypes.func,

};


// ======================================================
// Default Props
// ======================================================

ReviewPagination.defaultProps = {

    page: 1,

    pageSize: 10,

    totalItems: 0,

    onPageChange: () => {},

    onPageSizeChange: () => {},

};


// ======================================================
// Export
// ======================================================

export default ReviewPagination;
