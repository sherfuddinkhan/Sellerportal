import React, {useState} from "react";

import axios from "axios";

import {Box,Card,CardContent,Typography,Snackbar,Alert} from "@mui/material";
import StockLedgerFilters from "./StockLedgerFilters";
const SERVER_URL = "http://localhost:5000";


const StockLedgerFilters = () => {

    const [
        transactionType,
        setTransactionType
    ] = useState("");

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");

    const [
        results,
        setResults
    ] = useState([]);


    // =========================================================
    // APPLY FILTER
    // =========================================================

    const handleApply = async () => {

        try {

            setLoading(true);
            setError("");

            const params = {};

            if (
                transactionType &&
                transactionType.trim() !== ""
            ) {

                params.transactionType =
                    transactionType;

            }


            console.log(
                "STOCK LEDGER FILTER REQUEST"
            );

            console.log(
                "PARAMS:",
                params
            );


            const response =
                await axios.get(
                    `${SERVER_URL}/api/stock-ledgers`,
                    {
                        params,
                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );


            console.log(
                "STOCK LEDGER FILTER RESPONSE"
            );

            console.log(
                "STATUS:",
                response.status
            );

            console.log(
                "DATA:",
                response.data
            );


            const data =
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.items || [];


            setResults(data);

        }
        catch (err) {

            console.error(
                "STOCK LEDGER FILTER ERROR",
                err
            );

            console.error(
                "STATUS:",
                err.response?.status
            );

            console.error(
                "DATA:",
                err.response?.data
            );


            setError(
                err.response?.data?.message ||
                "Failed to filter stock ledger."
            );

        }
        finally {

            setLoading(false);

        }

    };


    // =========================================================
    // CLEAR
    // =========================================================

    const handleClear = () => {

        setTransactionType("");

        setResults([]);

        setError("");

    };


    return (

        <Box
            sx={{
                p: 3
            }}
        >

            <Card>

                <CardContent>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            mb: 3
                        }}
                    >
                        Stock Ledger Filters
                    </Typography>


                    <StockLedgerFilters

                        transactionType={
                            transactionType
                        }

                        setTransactionType={
                            setTransactionType
                        }

                        onApply={
                            handleApply
                        }

                        onClear={
                            handleClear
                        }

                    />


                    {/* =================================================
                        RESULT
                    ================================================= */}

                    {loading && (

                        <Typography>
                            Loading stock ledger...
                        </Typography>

                    )}


                    {!loading &&
                        results.length > 0 && (

                            <Box sx={{ mt: 3 }}>

                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 2
                                    }}
                                >
                                    Filter Results:
                                    {" "}
                                    {results.length}
                                </Typography>


                                <pre
                                    style={{
                                        overflowX:
                                            "auto"
                                    }}
                                >
                                    {JSON.stringify(
                                        results,
                                        null,
                                        2
                                    )}
                                </pre>

                            </Box>

                        )}


                    {!loading &&
                        transactionType &&
                        results.length === 0 && (

                            <Typography
                                sx={{
                                    mt: 3
                                }}
                            >
                                No stock ledger
                                records found.
                            </Typography>

                        )}

                </CardContent>

            </Card>


            <Snackbar
                open={Boolean(error)}
                autoHideDuration={5000}
                onClose={() =>
                    setError("")
                }
            >

                <Alert
                    severity="error"
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>

            </Snackbar>

        </Box>

    );

};


export default StockLedgerFilters;