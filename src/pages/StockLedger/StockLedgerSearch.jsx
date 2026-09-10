import React, {
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Snackbar,
    Alert
} from "@mui/material";



const SERVER_URL =
    "http://localhost:5000";


const StockLedgerSearch = () => {

    const [
        searchText,
        setSearchText
    ] = useState("");

    const [
        results,
        setResults
    ] = useState([]);

    const [
        loading,
        setLoading
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");


    // =========================================================
    // SEARCH
    // =========================================================

    const handleSearch = async () => {

        const search =
            searchText.trim();


        if (!search) {

            setError(
                "Please enter a search value."
            );

            return;

        }


        try {

            setLoading(true);
            setError("");


            console.log(
                "STOCK LEDGER SEARCH"
            );

            console.log(
                "SEARCH:",
                search
            );


            const response =
                await axios.get(
                    `${SERVER_URL}/api/stock-ledgers`,
                    {
                        params: {
                            search
                        },

                        headers: {
                            Accept:
                                "application/json"
                        }
                    }
                );


            console.log(
                "STOCK LEDGER SEARCH RESPONSE"
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
                "STOCK LEDGER SEARCH ERROR",
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
                "Failed to search stock ledger."
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

        setSearchText("");

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
                        Search Stock Ledger
                    </Typography>


                    <StockLedgerSearch

                        searchText={
                            searchText
                        }

                        setSearchText={
                            setSearchText
                        }

                        onSearch={
                            handleSearch
                        }

                        onClear={
                            handleClear
                        }

                    />


                    {loading && (

                        <Typography
                            sx={{
                                mt: 3
                            }}
                        >
                            Searching stock ledger...
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
                                    Search Results:
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
                        searchText.trim() &&
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


export default StockLedgerSearch;