import React from "react";


import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Divider,
    Stack,
    Button
} from "@mui/material";


import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";



const formatCurrency = (value) =>

    `₹ ${Number(value || 0).toLocaleString(undefined, {

        minimumFractionDigits: 2,

        maximumFractionDigits: 2

    })}`;



const GoodsReceiptNoteCard = ({

    note,

    onView,

    onEdit,

    onDelete

}) => {



    return (



        <Card

            className="goods-receipt-note-card"

            sx={{

                height:"100%",

                borderRadius:3

            }}

        >




            <CardContent>





                <Typography

                    variant="h6"

                    fontWeight="bold"

                    gutterBottom

                >


                    {

                        note.GRNNumber

                    }



                </Typography>







                <Typography

                    variant="body2"

                    color="text.secondary"

                >



                    GRN ID :

                    {" "}


                    {

                        note.GoodsReceiptNoteId

                    }



                </Typography>







                <Typography

                    variant="body2"

                    color="text.secondary"

                >



                    Purchase Order ID :

                    {" "}


                    {

                        note.PurchaseOrderId

                    }



                </Typography>








                <Typography

                    variant="body2"

                    color="text.secondary"

                >



                    Supplier ID :

                    {" "}


                    {

                        note.SupplierId

                    }



                </Typography>







                <Divider

                    sx={{

                        my:2

                    }}

                />







                <Stack

                    spacing={1}

                >





                    <Typography>


                        <strong>

                            Receipt Date:

                        </strong>


                        {" "}



                        {

                            note.ReceiptDate

                            ?

                            new Date(

                                note.ReceiptDate

                            ).toLocaleDateString()

                            :

                            "-"

                        }



                    </Typography>








                    <Typography>


                        <strong>

                            Status:

                        </strong>


                        {" "}



                        {

                            note.Status

                        }



                    </Typography>








                    <Typography

                        fontWeight="bold"

                    >


                        Total Amount:

                        {" "}



                        {

                            formatCurrency(

                                note.TotalAmount

                            )

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


                    onClick={() =>

                        onView(note)

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


                    onClick={() =>

                        onEdit(note)

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


                    onClick={() =>

                        onDelete(note)

                    }


                >


                    Delete


                </Button>






            </CardActions>






        </Card>


    );


};



export default GoodsReceiptNoteCard;