import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";


const ShoppingCartList = () => {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const customerId = localStorage.getItem("customerId");


  useEffect(() => {
    loadCart();
  }, []);


  const loadCart = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:5000/api/cart/${customerId}`
      );

      setCartItems(response.data || []);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to load shopping cart"
      );

    } finally {

      setLoading(false);

    }
  };



  const updateQuantity = async (item, quantity) => {

    if (quantity <= 0) {
      return;
    }

    try {

      await axios.put(
        `http://localhost:5000/api/cart/${item.cartItemId}`,
        {
          quantity: quantity
        }
      );

      loadCart();

    } catch (err) {

      setError("Unable to update quantity");

    }

  };



  const removeItem = async (cartItemId) => {

    try {

      await axios.delete(
        `http://localhost:5000/api/cart/${cartItemId}`
      );

      loadCart();

    } catch (err) {

      setError("Unable to remove item");

    }

  };



  const calculateTotal = () => {

    return cartItems.reduce(
      (total, item) =>
        total +
        (item.price * item.quantity),
      0
    );

  };



  if (loading) {

    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={5}
      >
        <CircularProgress />
      </Box>
    );

  }



  return (

    <Box p={3}>

      <Card>

        <CardContent>


          <Typography
            variant="h5"
            mb={3}
          >
            Shopping Cart
          </Typography>


          {
            error &&
            (
              <Alert severity="error">
                {error}
              </Alert>
            )
          }



          {
            cartItems.length === 0 ?

            (

              <Typography>
                Your cart is empty
              </Typography>

            )

            :

            (

              <>

              <TableContainer component={Paper}>

                <Table>


                  <TableHead>

                    <TableRow>

                      <TableCell>
                        Product
                      </TableCell>

                      <TableCell>
                        Price
                      </TableCell>

                      <TableCell>
                        Quantity
                      </TableCell>

                      <TableCell>
                        Total
                      </TableCell>

                      <TableCell>
                        Action
                      </TableCell>


                    </TableRow>

                  </TableHead>



                  <TableBody>


                    {
                      cartItems.map((item)=>(


                        <TableRow
                          key={item.cartItemId}
                        >


                          <TableCell>

                            {item.productName}

                          </TableCell>



                          <TableCell>

                            ₹ {item.price}

                          </TableCell>



                          <TableCell>


                            <IconButton
                              onClick={() =>
                                updateQuantity(
                                  item,
                                  item.quantity - 1
                                )
                              }
                            >

                              <RemoveIcon/>

                            </IconButton>



                            {item.quantity}



                            <IconButton
                              onClick={() =>
                                updateQuantity(
                                  item,
                                  item.quantity + 1
                                )
                              }
                            >

                              <AddIcon/>

                            </IconButton>


                          </TableCell>




                          <TableCell>

                            ₹ {item.price * item.quantity}

                          </TableCell>




                          <TableCell>


                            <IconButton
                              color="error"
                              onClick={() =>
                                removeItem(
                                  item.cartItemId
                                )
                              }
                            >

                              <DeleteIcon/>

                            </IconButton>


                          </TableCell>



                        </TableRow>


                      ))
                    }



                  </TableBody>


                </Table>


              </TableContainer>




              <Box
                mt={3}
                display="flex"
                justifyContent="space-between"
              >

                <Typography variant="h6">

                  Total:
                  ₹ {calculateTotal()}

                </Typography>


                <Button
                  variant="contained"
                  color="primary"
                >
                  Proceed To Checkout
                </Button>


              </Box>


              </>

            )

          }



        </CardContent>


      </Card>


    </Box>

  );

};


export default ShoppingCartList;