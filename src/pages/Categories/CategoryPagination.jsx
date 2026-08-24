import React from "react";
import {TablePagination} from "@mui/material";
const CategoryPagination = ({
    page,
    rowsPerPage,
    totalRecords,
    onPageChange,
    onRowsPerPageChange
}) => {
    return (
        <TablePagination
            component="div"
            page={page}
            rowsPerPage={rowsPerPage}
            count={totalRecords}
            rowsPerPageOptions={[5,10,20,50]}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
        />
    );
};

export default CategoryPagination;