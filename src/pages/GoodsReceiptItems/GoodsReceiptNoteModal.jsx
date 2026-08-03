import React, {
    useEffect,
    useState
} from "react";


import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem
} from "@mui/material";



const initialState = {

    GoodsReceiptNoteId: null,

    PurchaseOrderId: "",

    SellerId: "",

    SupplierId: "",

    GRNNumber: "",

    ReceiptDate: "",

    Status: "Pending",

    TotalAmount: "",

    Remarks: ""

};




const GoodsReceiptNoteModal = ({

    open,

    note,

    onClose,

    onSave

}) => {



    const [formData, setFormData] = useState(

        initialState

    );






    useEffect(() => {


        if(note) {


            setFormData({


                GoodsReceiptNoteId:

                    note.GoodsReceiptNoteId || null,


                PurchaseOrderId:

                    note.PurchaseOrderId || "",


                SellerId:

                    note.SellerId || "",


                SupplierId:

                    note.SupplierId || "",


                GRNNumber:

                    note.GRNNumber || "",


                ReceiptDate:

                    note.ReceiptDate

                    ?

                    note.ReceiptDate.substring(0,10)

                    :

                    "",


                Status:

                    note.Status || "Pending",


                TotalAmount:

                    note.TotalAmount || "",


                Remarks:

                    note.Remarks || ""


            });


        }

        else {


            setFormData(initialState);


        }


    }, [note, open]);







    const handleChange = (e) => {


        const {

            name,

            value

        } = e.target;



        setFormData(prev => ({


            ...prev,


            [name]: value



        }));


    };








    const handleSubmit = () => {



        onSave({


            ...formData,



            PurchaseOrderId:

                Number(

                    formData.PurchaseOrderId

                ),



            SellerId:

                Number(

                    formData.SellerId

                ),



            SupplierId:

                Number(

                    formData.SupplierId

                ),



            TotalAmount:

                Number(

                    formData.TotalAmount || 0

                )



        });


    };







    return (




        <Dialog



            open={open}



            onClose={onClose}



            fullWidth



            maxWidth="md"




        >



            <DialogTitle>



                {


                    formData.GoodsReceiptNoteId

                    ?

                    "Edit Goods Receipt Note"

                    :

                    "Add Goods Receipt Note"



                }



            </DialogTitle>







            <DialogContent dividers>




                <Grid

                    container

                    spacing={2}

                    mt={1}

                >







                    <Grid

                        item

                        xs={12}

                        md={6}

                    >



                        <TextField



                            fullWidth



                            label="Purchase Order ID"



                            name="PurchaseOrderId"



                            value={formData.PurchaseOrderId}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid

                        item

                        xs={12}

                        md={6}

                    >



                        <TextField



                            fullWidth



                            label="Seller ID"



                            name="SellerId"



                            value={formData.SellerId}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid

                        item

                        xs={12}

                        md={6}

                    >



                        <TextField



                            fullWidth



                            label="Supplier ID"



                            name="SupplierId"



                            value={formData.SupplierId}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid

                        item

                        xs={12}

                        md={6}

                    >



                        <TextField



                            fullWidth



                            label="GRN Number"



                            name="GRNNumber"



                            value={formData.GRNNumber}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid

                        item

                        xs={12}

                        md={6}

                    >



                        <TextField



                            fullWidth



                            type="date"



                            label="Receipt Date"



                            name="ReceiptDate"



                            value={formData.ReceiptDate}



                            onChange={handleChange}



                            InputLabelProps={{


                                shrink:true


                            }}



                        />



                    </Grid>









                    <Grid

                        item

                        xs={12}

                        md={6}

                    >



                        <TextField



                            select



                            fullWidth



                            label="Status"



                            name="Status"



                            value={formData.Status}



                            onChange={handleChange}



                        >



                            <MenuItem value="Pending">

                                Pending

                            </MenuItem>




                            <MenuItem value="Completed">

                                Completed

                            </MenuItem>




                            <MenuItem value="Cancelled">

                                Cancelled

                            </MenuItem>




                        </TextField>



                    </Grid>









                    <Grid

                        item

                        xs={12}

                        md={6}

                    >



                        <TextField



                            fullWidth



                            type="number"



                            label="Total Amount"



                            name="TotalAmount"



                            value={formData.TotalAmount}



                            onChange={handleChange}



                        />



                    </Grid>









                    <Grid

                        item

                        xs={12}

                    >



                        <TextField



                            fullWidth



                            multiline



                            rows={3}



                            label="Remarks"



                            name="Remarks"



                            value={formData.Remarks}



                            onChange={handleChange}



                        />



                    </Grid>








                </Grid>






            </DialogContent>







            <DialogActions>



                <Button

                    onClick={onClose}

                >

                    Cancel


                </Button>







                <Button



                    variant="contained"



                    onClick={handleSubmit}



                >

                    Save



                </Button>







            </DialogActions>






        </Dialog>


    );


};



export default GoodsReceiptNoteModal;