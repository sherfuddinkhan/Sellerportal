import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  TableContainer,
  Paper
} from "@mui/material";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "success";

    case "pending":
      return "warning";

    case "cancelled":
      return "error";

    case "processing":
      return "info";

    default:
      return "default";
  }
};

const LatestOrders = ({ orders }) => {

  return (

    <Card elevation={3}>

      <CardContent>

        <Typography
          variant="h6"
          gutterBottom
        >
          Latest Orders
        </Typography>

        <TableContainer component={Paper}>

          <Table size="small">

            <TableHead>

              <TableRow>

                <TableCell>
                  Order No
                </TableCell>

                <TableCell>
                  Customer
                </TableCell>

                <TableCell>
                  Date
                </TableCell>

                <TableCell align="right">
                  Amount
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell align="center">
                  Action
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {orders && orders.length > 0 ? (

                orders.map((order) => (

                  <TableRow
                    key={order.orderId}
                    hover
                  >

                    <TableCell>

                      {order.orderNumber}

                    </TableCell>

                    <TableCell>

                      {order.customerName}

                    </TableCell>

                    <TableCell>

                      {order.orderDate}

                    </TableCell>

                    <TableCell align="right">

                      ₹ {Number(order.totalAmount).toLocaleString()}

                    </TableCell>

                    <TableCell>

                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />

                    </TableCell>

                    <TableCell align="center">

                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                      >
                        View
                      </Button>

                    </TableCell>

                  </TableRow>

                ))

              ) : (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    align="center"
                  >

                    No Orders Available

                  </TableCell>

                </TableRow>

              )}

            </TableBody>

          </Table>

        </TableContainer>

      </CardContent>

    </Card>

  );

};

export default LatestOrders;