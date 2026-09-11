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
    items = [],
    onView,
    onEdit,
    onDelete
}) => {


    // ==========================================================
    // STATUS COLOR
    // ==========================================================

    const getStatusColor = (status) => {

        switch (
            String(status || "").toLowerCase()
        ) {

            case "delivered":
                return "success";

            case "pending":
                return "warning";

            case "in transit":
                return "info";

            case "dispatched":
                return "info";

            case "cancelled":
                return "error";

            default:
                return "default";
        }
    };


    // ==========================================================
    // DATE FORMAT
    // ==========================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    };


    // ==========================================================
    // TABLE
    // ==========================================================

    return (

        <TableContainer
            component={Paper}
            elevation={3}
            className="delivery-challan-table"
        >

            <Table
                stickyHeader
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <TableHead>

                    <TableRow>

                        <TableCell>
                            <b>ID</b>
                        </TableCell>

                        <TableCell>
                            <b>Sales Order</b>
                        </TableCell>

                        <TableCell>
                            <b>Seller ID</b>
                        </TableCell>

                        <TableCell>
                            <b>Customer ID</b>
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


                {/* ==================================================
                    BODY
                ================================================== */}

                <TableBody>

                    {items.length > 0 ? (

                        items.map((item) => (

                            <TableRow
                                hover
                                key={
                                    item.deliveryChallanId
                                }
                            >

                                {/* ID */}

                                <TableCell>
                                    {
                                        item.deliveryChallanId
                                    }
                                </TableCell>


                                {/* SALES ORDER */}

                                <TableCell>
                                    {
                                        item.salesOrderId
                                    }
                                </TableCell>


                                {/* SELLER */}

                                <TableCell>
                                    {
                                        item.sellerId
                                    }
                                </TableCell>


                                {/* CUSTOMER */}

                                <TableCell>
                                    {
                                        item.customerId ??
                                        "-"
                                    }
                                </TableCell>


                                {/* CHALLAN NUMBER */}

                                <TableCell>

                                    <b>
                                        {
                                            item.challanNumber ||
                                            "-"
                                        }
                                    </b>

                                </TableCell>


                                {/* CHALLAN DATE */}

                                <TableCell>
                                    {
                                        formatDate(
                                            item.challanDate
                                        )
                                    }
                                </TableCell>


                                {/* VEHICLE */}

                                <TableCell>
                                    {
                                        item.vehicleNumber ||
                                        "-"
                                    }
                                </TableCell>


                                {/* DRIVER */}

                                <TableCell>
                                    {
                                        item.driverName ||
                                        "-"
                                    }
                                </TableCell>


                                {/* DRIVER MOBILE */}

                                <TableCell>
                                    {
                                        item.driverMobile ||
                                        "-"
                                    }
                                </TableCell>


                                {/* TRANSPORTER */}

                                <TableCell>
                                    {
                                        item.transporterName ||
                                        "-"
                                    }
                                </TableCell>


                                {/* STATUS */}

                                <TableCell>

                                    <Chip
                                        label={
                                            item.status ||
                                            "N/A"
                                        }

                                        color={
                                            getStatusColor(
                                                item.status
                                            )
                                        }

                                        size="small"
                                    />

                                </TableCell>


                                {/* REMARKS */}

                                <TableCell>

                                    {
                                        item.remarks ||
                                        "-"
                                    }

                                </TableCell>


                                {/* ACTIONS */}

                                <TableCell align="center">

                                    {/* VIEW */}

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


                                    {/* EDIT */}

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


                                    {/* DELETE */}

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
                                colSpan={13}
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
