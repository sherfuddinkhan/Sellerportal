import React from "react";

import {
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Stack,
    Divider
} from "@mui/material";


const ProductImageCard = ({

    image

}) => {



    return (


        <Card


            elevation={3}


            sx={{


                borderRadius:2,


                height:"100%"


            }}



        >




            <CardContent>





                <Stack


                    direction="row"


                    justifyContent="space-between"


                    alignItems="center"


                    mb={2}



                >




                    <Typography


                        variant="h6"


                        fontWeight="bold"



                    >



                        Image #

                        {

                            image.ProductImageId

                        }



                    </Typography>







                    <Chip



                        label={


                            image.IsActive

                                ?

                                "Active"

                                :

                                "Inactive"



                        }



                        color={


                            image.IsActive

                                ?

                                "success"

                                :

                                "error"



                        }



                        size="small"



                    />





                </Stack>







                <Divider


                    sx={{mb:2}}


                />







                <Grid


                    container


                    spacing={2}


                >






                    <Grid


                        item


                        xs={12}



                    >



                        <Typography


                            variant="caption"


                            color="text.secondary"



                        >



                            Image Preview



                        </Typography>







                        {

                            image.ImageUrl &&



                            <img



                                src={image.ImageUrl}



                                alt={image.ImageName}



                                style={{



                                    width:"100%",



                                    height:"160px",



                                    objectFit:"cover",



                                    borderRadius:"8px",



                                    marginTop:"8px"



                                }}



                            />

                        }





                    </Grid>







                    <Grid


                        item


                        xs={6}


                    >



                        <Typography


                            variant="caption"


                            color="text.secondary"



                        >



                            Product ID



                        </Typography>





                        <Typography>



                            {

                                image.ProductId || "-"

                            }



                        </Typography>




                    </Grid>







                    <Grid


                        item


                        xs={6}


                    >



                        <Typography


                            variant="caption"


                            color="text.secondary"



                        >



                            Image Type



                        </Typography>





                        <Typography>



                            {

                                image.ImageType || "-"

                            }



                        </Typography>




                    </Grid>







                    <Grid


                        item


                        xs={12}


                    >



                        <Typography


                            variant="caption"


                            color="text.secondary"



                        >



                            Image Name



                        </Typography>





                        <Typography>



                            {

                                image.ImageName || "-"

                            }



                        </Typography>




                    </Grid>







                    <Grid


                        item


                        xs={12}


                    >



                        <Typography


                            variant="caption"


                            color="text.secondary"



                        >



                            Image URL



                        </Typography>





                        <Typography

                            sx={{

                                wordBreak:"break-all"

                            }}



                        >



                            {

                                image.ImageUrl || "-"

                            }



                        </Typography>




                    </Grid>







                    <Grid


                        item


                        xs={6}


                    >



                        <Typography


                            variant="caption"


                            color="text.secondary"



                        >



                            Primary Image



                        </Typography>







                        <br />







                        <Chip



                            label={


                                image.IsPrimary

                                    ?

                                    "Yes"

                                    :

                                    "No"



                            }



                            color={


                                image.IsPrimary

                                    ?

                                    "success"

                                    :

                                    "default"



                            }



                            size="small"



                        />




                    </Grid>







                    <Grid


                        item


                        xs={6}


                    >



                        <Typography


                            variant="caption"


                            color="text.secondary"



                        >



                            Created Date



                        </Typography>





                        <Typography>



                            {

                                image.CreatedDate

                                    ?

                                    new Date(

                                        image.CreatedDate

                                    ).toLocaleString()

                                    :

                                    "-"



                            }



                        </Typography>




                    </Grid>







                </Grid>






            </CardContent>






        </Card>



    );

};



export default ProductImageCard;