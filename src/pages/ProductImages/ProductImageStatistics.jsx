import React from "react";

import {
    Grid,
    Paper,
    Typography
} from "@mui/material";


const ProductImageStatistics = ({

    images = []

}) => {



    const totalImages =

        images.length;




    const activeImages =

        images.filter(

            item => item.IsActive

        ).length;




    const inactiveImages =

        totalImages - activeImages;




    const primaryImages =

        images.filter(

            item => item.IsPrimary

        ).length;




    const cards = [


        {

            title: "Total Images",

            value: totalImages

        },


        {

            title: "Active",

            value: activeImages

        },


        {

            title: "Inactive",

            value: inactiveImages

        },


        {

            title: "Primary Images",

            value: primaryImages

        }


    ];




    return (


        <Grid


            container


            spacing={2}


            sx={{ mb:3 }}


        >



            {


                cards.map(

                    (card,index)=>(


                        <Grid


                            item


                            xs={12}


                            sm={6}


                            md={3}


                            key={index}


                        >


                            <Paper


                                elevation={3}


                                sx={{


                                    p:2,


                                    textAlign:"center",


                                    borderRadius:2,


                                    height:"100%"


                                }}


                            >



                                <Typography


                                    variant="body2"


                                    color="text.secondary"


                                >


                                    {card.title}


                                </Typography>





                                <Typography


                                    variant="h5"


                                    fontWeight="bold"


                                    sx={{ mt:1 }}


                                >


                                    {card.value}


                                </Typography>



                            </Paper>



                        </Grid>



                    )


                )


            }



        </Grid>


    );

};



export default ProductImageStatistics;