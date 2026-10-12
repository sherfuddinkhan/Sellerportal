import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Tooltip, Chip, Box
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";

const getFieldValue = (item,...fields) => {
    for (const field of fields) {
        if (item?.[field]!== undefined && item?.[field]!== null && String(item?.[field]).trim()!== "") {
            return item[field];
        }
    }
    return "";
};

const SupplierAddressTable = ({ supplierAddresses = [], loading, onView, onEdit, onDelete }) => {

    if (!supplierAddresses?.length) {
        return <Paper sx={{ p: 3, textAlign: "center" }}>No supplier addresses found</Paper>;
    }

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                        <TableCell><b>ID</b></TableCell>
                        <TableCell><b>Supplier</b></TableCell>
                        <TableCell><b>Type</b></TableCell>
                        <TableCell><b>Address</b></TableCell>
                        <TableCell><b>City</b></TableCell>
                        <TableCell><b>State</b></TableCell>
                        <TableCell><b>Country</b></TableCell>
                        <TableCell><b>Pincode</b></TableCell>
                        <TableCell><b>Phone</b></TableCell>
                        <TableCell align="center"><b>Actions</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {supplierAddresses.map((row, index) => {
                        const id = getFieldValue(row, "supplierAddressId", "SupplierAddressId");
                        const supplierId = getFieldValue(row, "supplierId", "SupplierId");
                        const type = getFieldValue(row, "addressType", "AddressType");
                        const addressLine1 = getFieldValue(row, "addressLine1", "AddressLine1");
                        const city = getFieldValue(row, "city", "City");
                        const stateCode = getFieldValue(row, "stateCode", "StateCode");
                        const countryCode = getFieldValue(row, "countryCode", "CountryCode");
                        const pincode = getFieldValue(row, "pincode", "Pincode");
                        const phone = getFieldValue(row, "phone", "Phone");
                        const lat = getFieldValue(row, "latitude", "Latitude");
                        const lng = getFieldValue(row, "longitude", "Longitude");

                        return (
                            <TableRow key={id || index} hover>
                                <TableCell>{id}</TableCell>
                                <TableCell>{supplierId}</TableCell>
                                <TableCell><Chip label={type || "N/A"} size="small" color={type === "Billing"? "primary" : "default"} /></TableCell>
                                <TableCell sx={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={addressLine1}>{addressLine1}</TableCell>
                                <TableCell>{city}</TableCell>
                                <TableCell>{stateCode}</TableCell>
                                <TableCell>{countryCode}</TableCell>
                                <TableCell>{pincode}</TableCell>
                                <TableCell>{phone}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                                        <Tooltip title={`View ${lat},${lng}`}>
                                            <IconButton size="small" color="primary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log("VIEW", row); onView?.(row); }}>
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <IconButton size="small" color="secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); console.log("EDIT", row); onEdit?.(row); }}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete?.(row); }}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SupplierAddressTable;