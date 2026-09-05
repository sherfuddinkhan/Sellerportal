import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Typography,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

import PurchaseReturnView
    from "./PurchaseReturnView";


const SERVER_URL = "http://localhost:5000";


const PurchaseReturnDetails = () => {

    const {
        id
    } = useParams();

    const navigate = useNavigate();


    const [
        purchaseReturn,
        setPurchaseReturn
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        open,
        setOpen
    ] = useState(true);


    /* =========================================================
       LOAD PURCHASE RETURN
    ========================================================= */

    useEffect(() => {

        const loadPurchaseReturn = async () => {

            try {

                setLoading(true);

                setError("");


                const purchaseReturnId =
                    Number(id);


                if (
                    !Number.isInteger(purchaseReturnId) ||
                    purchaseReturnId <= 0
                ) {

                    setError(
                        "Invalid Purchase Return ID."
                    );

                    setLoading(false);

                    return;
                }


                const response = await axios.get(
                    `${SERVER_URL}/api/purchase-returns/${purchaseReturnId}`
                );


                setPurchaseReturn(
                    response.data
                );

            } catch (error) {

                console.error(
                    "LOAD PURCHASE RETURN DETAILS ERROR:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Unable to load purchase return details."
                );

            } finally {

                setLoading(false);

            }

        };


        loadPurchaseReturn();

    }, [id]);


    /* =========================================================
       CLOSE
    ========================================================= */

    const handleClose = () => {

        setOpen(false);

        navigate("/purchase-returns");

    };


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <CircularProgress />

            </Box>

        );

    }


    /* =========================================================
       ERROR
    ========================================================= */

    if (error) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

                <Alert
                    severity="error"
                >
                    {error}
                </Alert>

            </Box>

        );

    }


    /* =========================================================
       NO DATA
    ========================================================= */

    if (!purchaseReturn) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

                <Alert
                    severity="warning"
                >
                    Purchase return not found.
                </Alert>

            </Box>

        );

    }


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
                Purchase Return Details
            </Typography>


            <PurchaseReturnView
                open={open}
                onClose={handleClose}
                purchaseReturn={
                    purchaseReturn
                }
            />

        </Box>

    );

};


export default PurchaseReturnDetails;