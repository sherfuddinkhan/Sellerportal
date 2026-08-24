import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Avatar,
  Box,
  Chip,
  Paper
} from "@mui/material";

const TopSellingProducts = ({ products }) => {

  return (

    <Card elevation={3}>

      <CardContent>

        <Typography
          variant="h6"
          gutterBottom
        >
          Top Selling Products
        </Typography>

        <TableContainer component={Paper}>

          <Table size="small">

            <TableHead>

              <TableRow>

                <TableCell>Image</TableCell>

                <TableCell>Product</TableCell>

                <TableCell>Category</TableCell>

                <TableCell align="right">
                  Sold
                </TableCell>

                <TableCell align="right">
                  Revenue
                </TableCell>

                <TableCell>
                  Stock
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {products && products.length > 0 ? (

                products.map((item) => (

                  <TableRow
                    key={item.productId}
                    hover
                  >

                    <TableCell>

                      <Avatar
                        src={item.imageUrl}
                        alt={item.productName}
                      />

                    </TableCell>

                    <TableCell>

                      <Typography
                        fontWeight="bold"
                      >
                        {item.productName}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.sku}
                      </Typography>

                    </TableCell>

                    <TableCell>

                      {item.category}

                    </TableCell>

                    <TableCell align="right">

                      {item.unitsSold}

                    </TableCell>

                    <TableCell align="right">

                      ₹ {Number(item.revenue).toLocaleString()}

                    </TableCell>

                    <TableCell>

                      <Box>

                        <Chip
                          label={`${item.stock} Units`}
                          color={
                            item.stock > 20
                              ? "success"
                              : item.stock > 5
                              ? "warning"
                              : "error"
                          }
                          size="small"
                        />

                        <LinearProgress
                          sx={{
                            mt: 1,
                            height: 8,
                            borderRadius: 4
                          }}
                          variant="determinate"
                          value={item.stockPercentage}
                        />

                      </Box>

                    </TableCell>

                  </TableRow>

                ))

              ) : (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    align="center"
                  >

                    No Top Selling Products

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

export default TopSellingProducts;