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
    Tooltip,
    CircularProgress,
    Typography,
    Box
} from "@mui/material";


import {
    Visibility,
    Edit,
    Delete
} from "@mui/icons-material";



const ProductImageTable = ({

    images = [],

    loading,

    onView,

    onEdit,

    onDelete

}) => {



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




    if (images.length === 0) {


        return (

            <Paper

                sx={{ p:4 }}

            >

                <Typography

                    align="center"

                    color="text.secondary"

                >

                    No Product Images Found

                </Typography>


            </Paper>

        );


    }





    return (


        <TableContainer


            component={Paper}


        >


            <Table>





                <TableHead>


                    <TableRow>




                        <TableCell>

                            Image ID

                        </TableCell>





                        <TableCell>

                            Product ID

                        </TableCell>





                        <TableCell>

                            Image Name

                        </TableCell>





                        <TableCell>

                            Image Type

                        </TableCell>





                        <TableCell>

                            URL

                        </TableCell>





                        <TableCell>

                            Primary

                        </TableCell>





                        <TableCell>

                            Active

                        </TableCell>





                        <TableCell align="center">

                            Actions

                        </TableCell>




                    </TableRow>



                </TableHead>






                <TableBody>




                    {


                        images.map((row)=>(



                            <TableRow


                                key={

                                    row.ProductImageId

                                }


                                hover


                            >






                                <TableCell>


                                    {

                                        row.ProductImageId

                                    }


                                </TableCell>






                                <TableCell>


                                    {

                                        row.ProductId

                                    }


                                </TableCell>






                                <TableCell>


                                    {

                                        row.ImageName ||

                                        "-"

                                    }


                                </TableCell>






                                <TableCell>


                                    {

                                        row.ImageType ||

                                        "-"

                                    }


                                </TableCell>






                                <TableCell>


                                    {

                                        row.ImageUrl ||

                                        "-"

                                    }


                                </TableCell>







                                <TableCell>



                                    <Chip



                                        label={


                                            row.IsPrimary

                                                ?

                                                "Yes"

                                                :

                                                "No"


                                        }



                                        color={


                                            row.IsPrimary

                                                ?

                                                "success"

                                                :

                                                "default"


                                        }



                                        size="small"



                                    />



                                </TableCell>







                                <TableCell>



                                    <Chip



                                        label={


                                            row.IsActive

                                                ?

                                                "Active"

                                                :

                                                "Inactive"


                                        }



                                        color={


                                            row.IsActive

                                                ?

                                                "success"

                                                :

                                                "error"


                                        }



                                        size="small"



                                    />



                                </TableCell>







                                <TableCell align="center">





                                    <Tooltip title="View">



                                        <IconButton


                                            color="primary"


                                            onClick={()=>

                                                onView(row)

                                            }


                                        >


                                            <Visibility />


                                        </IconButton>



                                    </Tooltip>







                                    <Tooltip title="Edit">



                                        <IconButton


                                            color="warning"


                                            onClick={()=>

                                                onEdit(row)

                                            }


                                        >


                                            <Edit />


                                        </IconButton>



                                    </Tooltip>







                                    <Tooltip title="Delete">



                                        <IconButton


                                            color="error"


                                            onClick={()=>

                                                onDelete(row)

                                            }


                                        >


                                            <Delete />


                                        </IconButton>



                                    </Tooltip>







                                </TableCell>







                            </TableRow>





                        ))


                    }





                </TableBody>





            </Table>




        </TableContainer>


    );

};



export default ProductImageTable;