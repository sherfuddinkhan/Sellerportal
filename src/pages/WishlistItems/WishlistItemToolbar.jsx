import React from "react";

import {
    Box,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip
} from "@mui/material";

import {
    Add,
    ViewList,
    GridView,
    Refresh
} from "@mui/icons-material";

import WishlistItemSearch from "./WishlistItemSearch";


/* =========================================================
   WISHLIST ITEM TOOLBAR
========================================================= */

const WishlistItemToolbar = ({
    search = "",
    onSearch,
    onSearchSubmit,

    view = "table",
    onViewChange,

    onAdd,
    onRefresh,

    loading = false
}) => {


    /* =====================================================
       VIEW CHANGE
    ===================================================== */

    const handleViewChange = (_, newView) => {

        if (!newView) {
            return;
        }

        if (typeof onViewChange === "function") {
            onViewChange(newView);
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                mb: 3
            }}
        >

            {/* =================================================
               SEARCH
            ================================================= */}

            <Box
                sx={{
                    flex: 1,
                    minWidth: 250,
                    maxWidth: 500
                }}
            >

                <WishlistItemSearch
                    value={search}
                    onChange={onSearch}
                    onSearch={onSearchSubmit}
                />

            </Box>


            {/* =================================================
               ACTIONS
            ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap"
                }}
            >

                <Tooltip title="Refresh">

                    <span>

                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={onRefresh}
                            disabled={loading}
                        >
                            Refresh
                        </Button>

                    </span>

                </Tooltip>


                {/* =================================================
                   VIEW MODE
                ================================================= */}

                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleViewChange}
                    size="small"
                >

                    <ToggleButton value="table">
                        <Tooltip title="Table View">
                            <ViewList />
                        </Tooltip>
                    </ToggleButton>

                    <ToggleButton value="card">
                        <Tooltip title="Card View">
                            <GridView />
                        </Tooltip>
                    </ToggleButton>

                </ToggleButtonGroup>


                {/* =================================================
                   ADD
                ================================================= */}

                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAdd}
                >
                    Add Wishlist Item
                </Button>

            </Box>

        </Box>
    );
};


export default WishlistItemToolbar;