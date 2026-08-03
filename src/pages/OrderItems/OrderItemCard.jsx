import React from "react";


import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Stack,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material";


import {
    Inventory2,
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";



const OrderItemCard = ({

    item,

    onView,

    onEdit,

    onDelete

}) => {



    if (!item) return null;







    return (



        <Card



            elevation={3}



            sx={{



                height: "100%",



                borderRadius: 2,



                transition: "0.3s",



                "&:hover": {



                    transform:

                        "translateY(-4px)",



                    boxShadow: 8



                }



            }}



        >







            <CardContent>







                <Stack



                    direction="row"



                    justifyContent="space-between"



                    alignItems="center"



                    mb={2}



                >







                    <Inventory2



                        color="primary"



                        fontSize="large"



                    />







                </Stack>









                <Typography



                    variant="h6"



                    fontWeight="bold"



                    gutterBottom



                >





                    Order Item #

                    {

                        item.OrderItemId

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Order ID:</strong>{" "}



                    {

                        item.OrderId

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Product ID:</strong>{" "}



                    {

                        item.ProductId

                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Quantity:</strong>{" "}



                    {



                        Number(

                            item.Quantity || 0

                        )

                        .toFixed(2)



                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Unit Price:</strong>{" "}



                    ₹



                    {



                        Number(

                            item.UnitPrice || 0

                        )

                        .toLocaleString()



                    }





                </Typography>









                <Typography



                    variant="body2"



                    color="text.secondary"



                >





                    <strong>Total:</strong>{" "}



                    ₹



                    {



                        Number(

                            item.TotalAmount || 0

                        )

                        .toLocaleString()



                    }





                </Typography>







            </CardContent>









            <Divider />









            <CardActions



                sx={{



                    justifyContent:

                        "flex-end"



                }}



            >







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







            </CardActions>







        </Card>



    );

};



export default OrderItemCard;