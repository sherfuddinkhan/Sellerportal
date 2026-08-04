import React from "react";

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    Tooltip
} from "@mui/material";

import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";

const DeliveryChallanTable = ({
    items,
    onView,
    onEdit,
    onDelete
}) => {

    const getStatusColor = (status) => {

        switch (status?.toLowerCase()) {

            case "delivered":
                return "success";

            case "pending":
                return "warning";

            case "in transit":
                return "info";

            case "cancelled":
                return "error";

            default:
                return "default";

        }

    };

    return (

        <TableContainer
            component={Paper}
            elevation={3}
            className="delivery-challan-table"
        >

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <b>ID</b>
                        </TableCell>

                        <TableCell>
                            <b>Sales Order</b>
                        </TableCell>

                        <TableCell>
                            <b>Challan No</b>
                        </TableCell>

                        <TableCell>
                            <b>Challan Date</b>
                        </TableCell>

                        <TableCell>
                            <b>Vehicle No</b>
                        </TableCell>

                        <TableCell>
                            <b>Driver Name</b>
                        </TableCell>

                        <TableCell>
                            <b>Driver Mobile</b>
                        </TableCell>

                        <TableCell>
                            <b>Transporter</b>
                        </TableCell>

                        <TableCell>
                            <b>Status</b>
                        </TableCell>

                        <TableCell>
                            <b>Remarks</b>
                        </TableCell>

                        <TableCell align="center">
                            <b>Actions</b>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {items.length > 0 ? (

                        items.map((item) => (

                            <TableRow
                                hover
                                key={item.DeliveryChallanId}
                            >

                                <TableCell>
                                    {item.DeliveryChallanId}
                                </TableCell>

                                <TableCell>
                                    {item.SalesOrderId}
                                </TableCell>

                                <TableCell>
                                    {item.ChallanNumber}
                                </TableCell>

                                <TableCell>
                                    {item.ChallanDate
                                        ? new Date(
                                              item.ChallanDate
                                          ).toLocaleDateString()
                                        : "-"}
                                </TableCell>

                                <TableCell>
                                    {item.VehicleNumber || "-"}
                                </TableCell>

                                <TableCell>
                                    {item.DriverName || "-"}
                                </TableCell>

                                <TableCell>
                                    {item.DriverMobile || "-"}
                                </TableCell>

                                <TableCell>
                                    {item.TransporterName || "-"}
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={
                                            item.Status || "N/A"
                                        }
                                        color={getStatusColor(
                                            item.Status
                                        )}
                                        size="small"
                                    />

                                </TableCell>

                                <TableCell>
                                    {item.Remarks || "-"}
                                </TableCell>

                                <TableCell align="center">

                                    <Tooltip title="View">

                                        <IconButton
                                            color="primary"
                                            onClick={() =>
                                                onView(item)
                                            }
                                        >

                                            <Visibility />

                                        </IconButton>

                                    </Tooltip>

                                    <Tooltip title="Edit">

                                        <IconButton
                                            color="warning"
                                            onClick={() =>
                                                onEdit(item)
                                            }
                                        >

                                            <Edit />

                                        </IconButton>

                                    </Tooltip>

                                    <Tooltip title="Delete">

                                        <IconButton
                                            color="error"
                                            onClick={() =>
                                                onDelete(item)
                                            }
                                        >

                                            <Delete />

                                        </IconButton>

                                    </Tooltip>

                                </TableCell>

                            </TableRow>

                        ))

                    ) : (

                        <TableRow>

                            <TableCell
                                colSpan={11}
                                align="center"
                            >

                                No Delivery Challans Found

                            </TableCell>

                        </TableRow>

                    )}

                </TableBody>

            </Table>

        </TableContainer>

    );

};

export default DeliveryChallanTable;