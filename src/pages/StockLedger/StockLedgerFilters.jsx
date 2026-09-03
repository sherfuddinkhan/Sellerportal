
// =========================================================
// StockLedgerFilters.jsx
// =========================================================

import React from "react";

import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from "@mui/material";

import {
    FilterAlt,
    Clear
} from "@mui/icons-material";


const StockLedgerFilters = ({
    transactionType,
    setTransactionType,
    onApply,
    onClear
}) => {

    const handleTransactionTypeChange = (event) => {

        setTransactionType(
            event.target.value
        );

    };


    const handleClear = () => {

        setTransactionType("");

        onClear?.();

    };


    return (

        <Box
            className="stock-ledger-filters"
            sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 3
            }}
        >

            {/* =====================================================
                TRANSACTION TYPE
            ====================================================== */}

            <FormControl
                size="small"
                sx={{
                    minWidth: 200
                }}
            >

                <InputLabel>
                    Transaction Type
                </InputLabel>

                <Select
                    value={
                        transactionType || ""
                    }
                    label="Transaction Type"
                    onChange={
                        handleTransactionTypeChange
                    }
                >

                    <MenuItem value="">
                        All Transactions
                    </MenuItem>

                    <MenuItem value="Purchase">
                        Purchase
                    </MenuItem>

                    <MenuItem value="Sale">
                        Sale
                    </MenuItem>

                    <MenuItem value="Return">
                        Return
                    </MenuItem>

                    <MenuItem value="Adjustment">
                        Adjustment
                    </MenuItem>

                    <MenuItem value="Transfer">
                        Transfer
                    </MenuItem>

                </Select>

            </FormControl>


            {/* =====================================================
                APPLY
            ====================================================== */}

            <Button
                variant="contained"
                startIcon={<FilterAlt />}
                onClick={() => onApply?.()}
            >
                Apply Filter
            </Button>


            {/* =====================================================
                CLEAR
            ====================================================== */}

            <Button
                variant="outlined"
                color="secondary"
                startIcon={<Clear />}
                onClick={handleClear}
            >
                Clear
            </Button>

        </Box>

    );

};


export default StockLedgerFilters;

