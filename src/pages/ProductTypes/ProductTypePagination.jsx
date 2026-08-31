// =========================================================
// ProductTypePagination.jsx
// Product Type Pagination
// =========================================================

import React from "react";

import {
    TablePagination,
} from "@mui/material";


// =========================================================
// PRODUCT TYPE PAGINATION
// =========================================================

const ProductTypePagination = ({
    page = 0,
    rowsPerPage = 10,
    totalRecords = 0,
    onPageChange,
    onRowsPerPageChange,
}) => {

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <TablePagination

            component="div"

            page={page}

            rowsPerPage={rowsPerPage}

            count={totalRecords}

            rowsPerPageOptions={[
                5,
                10,
                20,
                50,
            ]}

            onPageChange={
                onPageChange
            }

            onRowsPerPageChange={
                onRowsPerPageChange
            }

            labelRowsPerPage="Rows per page:"

            showFirstButton

            showLastButton

        />

    );

};


// =========================================================
// EXPORT
// =========================================================

export default ProductTypePagination;
