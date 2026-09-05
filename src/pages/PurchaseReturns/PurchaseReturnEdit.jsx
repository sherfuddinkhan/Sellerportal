import React, {
    useEffect,
    useState
} from "react";

import {
    Box,
    Typography,
    Paper,
    Alert,
    CircularProgress
} from "@mui/material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import axios from "axios";

import PurchaseReturnModal
    from "./PurchaseReturnModal";


const SERVER_URL = "http://localhost:5000";


const PurchaseReturnEdit = () => {

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
        saving,
        setSaving
    ] = useState(false);

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
                    "LOAD PURCHASE RETURN ERROR:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    "Unable to load purchase return."
                );

            } finally {

                setLoading(false);

            }

        };


        loadPurchaseReturn();

    }, [id]);


    /* =========================================================
       UPDATE PURCHASE RETURN
    ========================================================= */

    const handleSave = async (data) => {

        try {

            setSaving(true);

            setError("");


            const purchaseReturnId =
                Number(id);


            await axios.put(
                `${SERVER_URL}/api/purchase-returns/${purchaseReturnId}`,
                {
                    ...data,
                    PurchaseReturnId:
                        purchaseReturnId
                }
            );


            setOpen(false);

            navigate("/purchase-returns");

        } catch (error) {

            console.error(
                "UPDATE PURCHASE RETURN ERROR:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to update purchase return."
            );

        } finally {

            setSaving(false);

        }

    };


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
                    p: 3,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 300
                }}
            >

                <CircularProgress />

            </Box>

        );

    }


    /* =========================================================
       ERROR
    ========================================================= */

    if (error && !purchaseReturn) {

        return (

            <Box
                sx={{
                    p: 3
                }}
            >

                <Alert
                    severity="error"
                    sx={{
                        mb: 2
                    }}
                >
                    {error}
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
                Edit Purchase Return
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
                    purchaseReturn={
                        purchaseReturn
                    }
                />

            </Paper>

            {saving && (

                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor:
                            "rgba(255,255,255,0.5)",
                        zIndex: 2000
                    }}
                >

                    <CircularProgress />

                </Box>

            )}

        </Box>

    );

};


export default PurchaseReturnEdit;