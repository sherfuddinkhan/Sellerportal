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
    MenuItem,
    Divider,
    CircularProgress
} from "@mui/material";


/* =========================================================
   DEFAULT VALUES
========================================================= */

const DEFAULT_SELLER_ID = 6;
const DEFAULT_CUSTOMER_ID = 3;


/* =========================================================
   STATUS OPTIONS
========================================================= */

const STATUS_OPTIONS = [
    "Pending",
    "Confirmed",
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
    "Returned"
];


/* =========================================================
   CURRENT LOCAL DATETIME
========================================================= */

const getCurrentDateTimeLocal = () => {

    const now = new Date();

    const offset =
        now.getTimezoneOffset() * 60000;

    return new Date(
        now.getTime() - offset
    )
        .toISOString()
        .slice(0, 16);
};


/* =========================================================
   COMPONENT
========================================================= */

const CreateOrderStatusHistory = ({
    open,
    onClose,
    onSave,
    loading = false
}) => {

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState({
        sellerId: DEFAULT_SELLER_ID,
        customerId: DEFAULT_CUSTOMER_ID,
        orderId: "",
        status: "",
        remarks: "",
        changedOn: getCurrentDateTimeLocal()
    });


    /* =====================================================
       RESET FORM
    ===================================================== */

    useEffect(() => {

        if (!open) {
            return;
        }

        setFormData({
            sellerId: DEFAULT_SELLER_ID,
            customerId: DEFAULT_CUSTOMER_ID,
            orderId: "",
            status: "",
            remarks: "",
            changedOn: getCurrentDateTimeLocal()
        });

    }, [open]);


    /* =====================================================
       HANDLE CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

    };


    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = () => {

        const sellerId =
            Number(formData.sellerId);

        const customerId =
            Number(formData.customerId);

        const orderId =
            Number(formData.orderId);


        /* =================================================
           VALIDATION
        ================================================= */

        if (!sellerId) {
            return;
        }

        if (!customerId) {
            return;
        }

        if (!orderId) {
            return;
        }

        if (!formData.status) {
            return;
        }


        /* =================================================
           PAYLOAD
        ================================================= */

        const payload = {

            orderStatusHistoryId: 0,

            sellerId: sellerId,

            customerId: customerId,

            orderId: orderId,

            status: formData.status,

            remarks:
                formData.remarks?.trim() || "",

            changedOn:
                formData.changedOn
                    ? new Date(
                        formData.changedOn
                    ).toISOString()
                    : new Date().toISOString()
        };


        console.log(
            "CREATE ORDER STATUS HISTORY PAYLOAD:",
            payload
        );


        /* =================================================
           SAVE
        ================================================= */

        if (typeof onSave === "function") {

            onSave(payload);

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <Dialog
            open={open}
            onClose={
                loading
                    ? undefined
                    : onClose
            }
            fullWidth
            maxWidth="md"
        >

            <DialogTitle
                sx={{
                    fontWeight: 700
                }}
            >
                Create Order Status History
            </DialogTitle>

            <Divider />


            <DialogContent
                sx={{
                    mt: 2
                }}
            >

                <Grid
                    container
                    spacing={2}
                >

                    {/* =================================================
                        SELLER
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Seller ID"
                            name="sellerId"
                            type="number"
                            value={formData.sellerId}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* =================================================
                        CUSTOMER
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            label="Customer ID"
                            name="customerId"
                            type="number"
                            value={formData.customerId}
                            onChange={handleChange}
                        />

                    </Grid>


                    {/* =================================================
                        ORDER
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            label="Order ID"
                            name="orderId"
                            type="number"
                            value={formData.orderId}
                            onChange={handleChange}
                            inputProps={{
                                min: 1
                            }}
                        />

                    </Grid>


                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            required
                            select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            {STATUS_OPTIONS.map(
                                status => (

                                    <MenuItem
                                        key={status}
                                        value={status}
                                    >
                                        {status}
                                    </MenuItem>

                                )
                            )}

                        </TextField>

                    </Grid>


                    {/* =================================================
                        REMARKS
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                    >

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            placeholder="Enter remarks"
                        />

                    </Grid>


                    {/* =================================================
                        CHANGED ON
                    ================================================= */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <TextField
                            fullWidth
                            type="datetime-local"
                            label="Changed On"
                            name="changedOn"
                            value={formData.changedOn}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />

                    </Grid>

                </Grid>

            </DialogContent>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <DialogActions
                sx={{
                    px: 3,
                    pb: 2
                }}
            >

                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={loading}
                >
                    Cancel
                </Button>


                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                >

                    {loading ? (
                        <>
                            <CircularProgress
                                size={20}
                                sx={{
                                    mr: 1
                                }}
                            />

                            Saving...
                        </>
                    ) : (
                        "Create"
                    )}

                </Button>

            </DialogActions>

        </Dialog>
    );
};


export default CreateOrderStatusHistory;


