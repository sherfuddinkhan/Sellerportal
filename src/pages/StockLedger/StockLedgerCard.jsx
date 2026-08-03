import React from "react";


import {

    Card,

    CardContent,

    CardActions,

    Typography,

    Divider,

    Stack,

    Button,

    Chip

} from "@mui/material";


import {

    Visibility,

    Edit,

    Delete

} from "@mui/icons-material";



const formatNumber = (value) => {



    return Number(

        value || 0

    ).toFixed(2);



};







const formatDate = (date) => {



    if(!date)

        return "-";



    return new Date(date).toLocaleDateString();



};







const StockLedgerCard = ({

    ledger,

    onView,

    onEdit,

    onDelete

}) => {



    return (



        <Card



            className="stock-ledger-card"



            sx={{



                height:"100%",



                borderRadius:3



            }}



        >







            <CardContent>





                <Stack



                    spacing={1.5}



                >







                    <Typography



                        variant="h6"



                        fontWeight="bold"



                    >



                        Stock Ledger #

                        {

                            ledger.StockLedgerId

                        }



                    </Typography>









                    <Chip



                        label={

                            ledger.TransactionType || "-"

                        }



                        size="small"



                        color={



                            ledger.TransactionType

                            ?.toUpperCase()

                            === "PURCHASE"

                            ?

                            "success"



                            :



                            ledger.TransactionType

                            ?.toUpperCase()

                            === "SALE"

                            ?

                            "error"



                            :

                            "default"



                        }



                    />









                    <Divider />









                    <Typography>



                        <strong>

                            Seller ID:

                        </strong>



                        {" "}

                        {

                            ledger.SellerId

                        }



                    </Typography>









                    <Typography>



                        <strong>

                            Product ID:

                        </strong>



                        {" "}

                        {

                            ledger.ProductId

                        }



                    </Typography>









                    <Typography>



                        <strong>

                            Warehouse ID:

                        </strong>



                        {" "}

                        {

                            ledger.WarehouseId

                        }



                    </Typography>









                    <Typography>



                        <strong>

                            Reference:

                        </strong>



                        {" "}

                        {

                            ledger.ReferenceNumber || "-"

                        }



                    </Typography>









                    <Typography>



                        <strong>

                            Quantity:

                        </strong>



                        {" "}

                        {

                            formatNumber(

                                ledger.Quantity

                            )

                        }



                    </Typography>









                    <Typography>



                        <strong>

                            Balance:

                        </strong>



                        {" "}

                        {

                            formatNumber(

                                ledger.BalanceQuantity

                            )

                        }



                    </Typography>









                    <Typography>



                        <strong>

                            Date:

                        </strong>



                        {" "}

                        {

                            formatDate(

                                ledger.TransactionDate

                            )

                        }



                    </Typography>









                    <Typography>



                        <strong>

                            Remarks:

                        </strong>



                        {" "}

                        {

                            ledger.Remarks || "-"

                        }



                    </Typography>







                </Stack>







            </CardContent>









            <CardActions



                sx={{



                    justifyContent:"space-between",



                    px:2,



                    pb:2



                }}



            >







                <Button



                    size="small"



                    startIcon={

                        <Visibility />

                    }



                    onClick={()=>



                        onView(ledger)



                    }



                >



                    View



                </Button>









                <Button



                    size="small"



                    color="warning"



                    startIcon={

                        <Edit />

                    }



                    onClick={()=>



                        onEdit(ledger)



                    }



                >



                    Edit



                </Button>









                <Button



                    size="small"



                    color="error"



                    startIcon={

                        <Delete />

                    }



                    onClick={()=>



                        onDelete(ledger)



                    }



                >



                    Delete



                </Button>







            </CardActions>







        </Card>



    );


};



export default StockLedgerCard;