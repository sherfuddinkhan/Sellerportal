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
  TableContainer,
  Paper,
  Chip,
  Button
} from "@mui/material";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "success";

    case "inactive":
      return "default";

    case "blocked":
      return "error";

    default:
      return "primary";
  }
};

const RecentCustomers = ({ customers }) => {

  return (

    <Card elevation={3}>

      <CardContent>

        <Typography
          variant="h6"
          gutterBottom
        >
          Recent Customers
        </Typography>

        <TableContainer component={Paper}>

          <Table size="small">

            <TableHead>

              <TableRow>

                <TableCell>Name</TableCell>

                <TableCell>Email</TableCell>

                <TableCell>Mobile</TableCell>

                <TableCell>City</TableCell>

                <TableCell>Registered</TableCell>

                <TableCell>Status</TableCell>

                <TableCell align="center">
                  Action
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {customers && customers.length > 0 ? (

                customers.map((customer) => (

                  <TableRow
                    key={customer.customerId}
                    hover
                  >

                    <TableCell>

                      {customer.customerName}

                    </TableCell>

                    <TableCell>

                      {customer.email}

                    </TableCell>

                    <TableCell>

                      {customer.mobile}

                    </TableCell>

                    <TableCell>

                      {customer.city}

                    </TableCell>

                    <TableCell>

                      {customer.createdDate}

                    </TableCell>

                    <TableCell>

                      <Chip
                        label={customer.status}
                        color={getStatusColor(customer.status)}
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
                    colSpan={7}
                    align="center"
                  >

                    No Customers Found

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

export default RecentCustomers;