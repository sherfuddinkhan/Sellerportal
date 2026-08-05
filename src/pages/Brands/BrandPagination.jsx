import React from "react";
import apiService from "../../services/apiService";
import {Box,TablePagination} from "@mui/material";
const BrandPagination = ({
    page = 0,
    rowsPerPage = 10,
    totalRecords = 0,
    onPageChange = () => {},
    onRowsPerPageChange = () => {}
}) => {

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2
            }}
        >
            <TablePagination
                component="div"
                count={totalRecords}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />

        </Box>

    );

};

export default BrandPagination;