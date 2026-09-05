import React, {
    useState
} from "react";

import {
    Box,
    Typography,
    Paper,
    Alert
} from "@mui/material";

import {
    useNavigate
} from "react-router-dom";

import axios from "axios";

import PurchaseReturnModal
    from "./PurchaseReturnModal";


const SERVER_URL = "http://localhost:5000";


const PurchaseReturnCreate = () => {

    const navigate = useNavigate();

    const [
        open,
        setOpen
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");


    /* =========================================================
       CREATE PURCHASE RETURN
    ========================================================= */

    const handleSave = async (data) => {

        try {

            setError("");

            await axios.post(
                `${SERVER_URL}/api/purchase-returns`,
                data
            );

            setOpen(false);

            navigate("/purchase-returns");

        } catch (error) {

            console.error(
                "CREATE PURCHASE RETURN ERROR:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to create purchase return."
            );

        }

    };


    /* =========================================================
       CLOSE
    ========================================================= */

    const handleClose = () => {

        setOpen(false);

        navigate("/purchase-returns");

    };


    return (

        <Box
            sx={{
                p: 3
            }}
        >

            <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                    mb: 2
                }}
            >
                Create Purchase Return
            </Typography>


            {error && (

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                >
                    {error}
                </Alert>

            )}


            <Paper
                elevation={2}
                sx={{
                    p: 3
                }}
            >

                <PurchaseReturnModal
                    open={open}
                    onClose={handleClose}
                    onSave={handleSave}
                    purchaseReturn={null}
                />

            </Paper>

        </Box>

    );

};


export default PurchaseReturnCreate;