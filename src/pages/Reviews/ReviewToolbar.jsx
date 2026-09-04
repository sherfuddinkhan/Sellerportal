import React, {
    useMemo,
    useState,
} from "react";

import PropTypes from "prop-types";

import {
    Badge,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";

import {
    Cancel,
    CheckCircle,
    Delete,
    Download,
    FilterList,
    MoreVert,
    PictureAsPdf,
    Print,
    Refresh,
    Search,
    Star,
    TableChart,
} from "@mui/icons-material";


// ======================================================
// Status Options
// ======================================================

const STATUS_OPTIONS = [
    {
        label: "All",
        value: "All",
    },
    {
        label: "Pending",
        value: "Pending",
    },
    {
        label: "Approved",
        value: "Approved",
    },
    {
        label: "Rejected",
        value: "Rejected",
    },
];


// ======================================================
// Rating Options
// ======================================================

const RATING_OPTIONS = [
    {
        label: "All Ratings",
        value: "All",
    },
    {
        label: "5 Stars",
        value: "5",
    },
    {
        label: "4 Stars",
        value: "4",
    },
    {
        label: "3 Stars",
        value: "3",
    },
    {
        label: "2 Stars",
        value: "2",
    },
    {
        label: "1 Star",
        value: "1",
    },
];


// ======================================================
// Marketplace Options
// ======================================================

const MARKETPLACE_OPTIONS = [
    {
        label: "All Marketplaces",
        value: "All",
    },
    {
        label: "Amazon",
        value: "Amazon",
    },
    {
        label: "Flipkart",
        value: "Flipkart",
    },
    {
        label: "Meesho",
        value: "Meesho",
    },
    {
        label: "Shopify",
        value: "Shopify",
    },
    {
        label: "Myntra",
        value: "Myntra",
    },
];


// ======================================================
// ReviewToolbar Component
// ======================================================

const ReviewToolbar = ({
    searchText,
    onSearchChange,

    selectedRows = [],

    loading = false,

    onRefresh,
    onExportExcel,
    onExportPdf,
    onPrint,

    onApproveSelected,
    onRejectSelected,
    onDeleteSelected,

    onStatusFilter,
    onRatingFilter,
    onMarketplaceFilter,
}) => {


    // ==================================================
    // Export Menu State
    // ==================================================

    const [
        exportAnchor,
        setExportAnchor,
    ] = useState(null);


    // ==================================================
    // Filter Menu State
    // ==================================================

    const [
        filterAnchor,
        setFilterAnchor,
    ] = useState(null);


    // ==================================================
    // Bulk Action Menu State
    // ==================================================

    const [
        bulkAnchor,
        setBulkAnchor,
    ] = useState(null);


    // ==================================================
    // Filter State
    // ==================================================

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("All");


    const [
        ratingFilter,
        setRatingFilter,
    ] = useState("All");


    const [
        marketplaceFilter,
        setMarketplaceFilter,
    ] = useState("All");


    // ==================================================
    // Selected Count
    // ==================================================

    const selectedCount = useMemo(
        () =>
            Array.isArray(selectedRows)
                ? selectedRows.length
                : 0,
        [selectedRows]
    );


    // ==================================================
    // Export Menu Handlers
    // ==================================================

    const openExportMenu = (
        event
    ) => {

        setExportAnchor(
            event.currentTarget
        );

    };


    const closeExportMenu = () => {

        setExportAnchor(null);

    };


    // ==================================================
    // Filter Menu Handlers
    // ==================================================

    const openFilterMenu = (
        event
    ) => {

        setFilterAnchor(
            event.currentTarget
        );

    };


    const closeFilterMenu = () => {

        setFilterAnchor(null);

    };


    // ==================================================
    // Bulk Menu Handlers
    // ==================================================

    const openBulkMenu = (
        event
    ) => {

        setBulkAnchor(
            event.currentTarget
        );

    };


    const closeBulkMenu = () => {

        setBulkAnchor(null);

    };


    // ==================================================
    // Status Filter
    // ==================================================

    const handleStatusChange = (
        status
    ) => {

        setStatusFilter(
            status
        );

        closeFilterMenu();


        if (onStatusFilter) {

            onStatusFilter(
                status
            );

        }

    };


    // ==================================================
    // Rating Filter
    // ==================================================

    const handleRatingChange = (
        rating
    ) => {

        setRatingFilter(
            rating
        );

        closeFilterMenu();


        if (onRatingFilter) {

            onRatingFilter(
                rating
            );

        }

    };


    // ==================================================
    // Marketplace Filter
    // ==================================================

    const handleMarketplaceChange = (
        marketplace
    ) => {

        setMarketplaceFilter(
            marketplace
        );

        closeFilterMenu();


        if (onMarketplaceFilter) {

            onMarketplaceFilter(
                marketplace
            );

        }

    };


    // ==================================================
    // Bulk Approve
    // ==================================================

    const handleApprove = () => {

        closeBulkMenu();


        if (
            selectedCount > 0 &&
            onApproveSelected
        ) {

            onApproveSelected(
                selectedRows
            );

        }

    };


    // ==================================================
    // Bulk Reject
    // ==================================================

    const handleReject = () => {

        closeBulkMenu();


        if (
            selectedCount > 0 &&
            onRejectSelected
        ) {

            onRejectSelected(
                selectedRows
            );

        }

    };


    // ==================================================
    // Bulk Delete
    // ==================================================

    const handleDelete = () => {

        closeBulkMenu();


        if (
            selectedCount > 0 &&
            onDeleteSelected
        ) {

            onDeleteSelected(
                selectedRows
            );

        }

    };


    // ==================================================
    // Export Excel
    // ==================================================

    const handleExportExcel = () => {

        closeExportMenu();


        if (onExportExcel) {

            onExportExcel();

        }

    };


    // ==================================================
    // Export PDF
    // ==================================================

    const handleExportPdf = () => {

        closeExportMenu();


        if (onExportPdf) {

            onExportPdf();

        }

    };


    // ==================================================
    // Print
    // ==================================================

    const handlePrint = () => {

        if (onPrint) {

            onPrint();

        }

    };


    // ==================================================
    // Refresh
    // ==================================================

    const handleRefresh = () => {

        if (
            !loading &&
            onRefresh
        ) {

            onRefresh();

        }

    };


    // ==================================================
    // JSX
    // ==================================================

    return (

        <Box
            sx={{
                mb: 2,
            }}
        >

            {/* ==================================================
                Main Toolbar
            ================================================== */}

            <Stack
                direction={{
                    xs: "column",
                    md: "row",
                }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{
                    xs: "stretch",
                    md: "center",
                }}
            >

                {/* ==================================================
                    Left Section
                ================================================== */}

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                >

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        Reviews
                    </Typography>


                    <Chip
                        size="small"
                        color="primary"
                        label={
                            `${selectedCount} Selected`
                        }
                    />

                </Stack>


                {/* ==================================================
                    Right Section
                ================================================== */}

                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    alignItems={{
                        xs: "stretch",
                        sm: "center",
                    }}
                >

                    {/* ==============================================
                        Search
                    ============================================== */}

                    <TextField
                        size="small"
                        placeholder="Search reviews..."
                        value={
                            searchText || ""
                        }
                        onChange={
                            onSearchChange
                        }
                        sx={{
                            minWidth: {
                                xs: "100%",
                                sm: 260,
                            },
                        }}
                        InputProps={{
                            startAdornment: (

                                <InputAdornment
                                    position="start"
                                >

                                    <Search />

                                </InputAdornment>

                            ),
                        }}
                    />


                    {/* ==============================================
                        Refresh
                    ============================================== */}

                    <Tooltip
                        title="Refresh Reviews"
                    >

                        <span>

                            <IconButton
                                color="primary"
                                disabled={loading}
                                onClick={
                                    handleRefresh
                                }
                            >

                                <Refresh />

                            </IconButton>

                        </span>

                    </Tooltip>


                    {/* ==============================================
                        Filters
                    ============================================== */}

                    <Tooltip
                        title="Review Filters"
                    >

                        <IconButton
                            onClick={
                                openFilterMenu
                            }
                        >

                            <FilterList />

                        </IconButton>

                    </Tooltip>


                    {/* ==============================================
                        Export
                    ============================================== */}

                    <Tooltip
                        title="Export Reviews"
                    >

                        <IconButton
                            onClick={
                                openExportMenu
                            }
                        >

                            <Download />

                        </IconButton>

                    </Tooltip>


                    {/* ==============================================
                        Print
                    ============================================== */}

                    <Tooltip
                        title="Print Reviews"
                    >

                        <IconButton
                            onClick={
                                handlePrint
                            }
                        >

                            <Print />

                        </IconButton>

                    </Tooltip>


                    {/* ==============================================
                        Bulk Actions
                    ============================================== */}

                    <Badge
                        badgeContent={
                            selectedCount
                        }
                        color="error"
                        invisible={
                            selectedCount === 0
                        }
                    >

                        <Button
                            variant="contained"
                            endIcon={
                                <MoreVert />
                            }
                            onClick={
                                openBulkMenu
                            }
                            disabled={
                                selectedCount === 0 ||
                                loading
                            }
                        >
                            Bulk Actions
                        </Button>

                    </Badge>

                </Stack>

            </Stack>


            {/* ==================================================
                Divider
            ================================================== */}

            <Divider
                sx={{
                    my: 2,
                }}
            />


            {/* ==================================================
                Export Menu
            ================================================== */}

            <Menu
                anchorEl={
                    exportAnchor
                }
                open={
                    Boolean(
                        exportAnchor
                    )
                }
                onClose={
                    closeExportMenu
                }
            >

                <MenuItem
                    onClick={
                        handleExportExcel
                    }
                >

                    <TableChart
                        sx={{
                            mr: 1,
                        }}
                    />

                    Export Excel

                </MenuItem>


                <MenuItem
                    onClick={
                        handleExportPdf
                    }
                >

                    <PictureAsPdf
                        sx={{
                            mr: 1,
                        }}
                    />

                    Export PDF

                </MenuItem>

            </Menu>


            {/* ==================================================
                Filter Menu
            ================================================== */}

            <Menu
                anchorEl={
                    filterAnchor
                }
                open={
                    Boolean(
                        filterAnchor
                    )
                }
                onClose={
                    closeFilterMenu
                }
                PaperProps={{
                    sx: {
                        minWidth: 240,
                        maxHeight: 500,
                    },
                }}
            >

                {/* ==============================================
                    Status
                ============================================== */}

                <Typography
                    variant="subtitle2"
                    sx={{
                        px: 2,
                        pt: 1,
                        pb: 0.5,
                        fontWeight: 700,
                    }}
                >
                    Status
                </Typography>


                {STATUS_OPTIONS.map(
                    (option) => (

                        <MenuItem
                            key={
                                option.value
                            }
                            selected={
                                statusFilter ===
                                option.value
                            }
                            onClick={() =>
                                handleStatusChange(
                                    option.value
                                )
                            }
                        >
                            {option.label}
                        </MenuItem>

                    )
                )}


                <Divider />


                {/* ==============================================
                    Rating
                ============================================== */}

                <Typography
                    variant="subtitle2"
                    sx={{
                        px: 2,
                        pt: 1,
                        pb: 0.5,
                        fontWeight: 700,
                    }}
                >
                    Rating
                </Typography>


                {RATING_OPTIONS.map(
                    (option) => (

                        <MenuItem
                            key={
                                option.value
                            }
                            selected={
                                ratingFilter ===
                                option.value
                            }
                            onClick={() =>
                                handleRatingChange(
                                    option.value
                                )
                            }
                        >

                            <Star
                                sx={{
                                    mr: 1,
                                    fontSize: 18,
                                    color:
                                        "warning.main",
                                }}
                            />

                            {option.label}

                        </MenuItem>

                    )
                )}


                <Divider />


                {/* ==============================================
                    Marketplace
                ============================================== */}

                <Typography
                    variant="subtitle2"
                    sx={{
                        px: 2,
                        pt: 1,
                        pb: 0.5,
                        fontWeight: 700,
                    }}
                >
                    Marketplace
                </Typography>


                {MARKETPLACE_OPTIONS.map(
                    (option) => (

                        <MenuItem
                            key={
                                option.value
                            }
                            selected={
                                marketplaceFilter ===
                                option.value
                            }
                            onClick={() =>
                                handleMarketplaceChange(
                                    option.value
                                )
                            }
                        >
                            {option.label}
                        </MenuItem>

                    )
                )}

            </Menu>


            {/* ==================================================
                Bulk Action Menu
            ================================================== */}

            <Menu
                anchorEl={
                    bulkAnchor
                }
                open={
                    Boolean(
                        bulkAnchor
                    )
                }
                onClose={
                    closeBulkMenu
                }
            >

                {/* ==============================================
                    Approve
                ============================================== */}

                <MenuItem
                    onClick={
                        handleApprove
                    }
                    disabled={
                        selectedCount === 0
                    }
                >

                    <CheckCircle
                        color="success"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Approve Selected

                </MenuItem>


                {/* ==============================================
                    Reject
                ============================================== */}

                <MenuItem
                    onClick={
                        handleReject
                    }
                    disabled={
                        selectedCount === 0
                    }
                >

                    <Cancel
                        color="warning"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Reject Selected

                </MenuItem>


                {/* ==============================================
                    Delete
                ============================================== */}

                <MenuItem
                    onClick={
                        handleDelete
                    }
                    disabled={
                        selectedCount === 0
                    }
                >

                    <Delete
                        color="error"
                        sx={{
                            mr: 1,
                        }}
                    />

                    Delete Selected

                </MenuItem>

            </Menu>


            {/* ==================================================
                Bottom Divider
            ================================================== */}

            <Divider
                sx={{
                    mt: 2,
                }}
            />

        </Box>
    );
};


// ======================================================
// PropTypes
// ======================================================

ReviewToolbar.propTypes = {

    // ==================================================
    // Search
    // ==================================================

    searchText:
        PropTypes.string,

    onSearchChange:
        PropTypes.func,


    // ==================================================
    // Selected Rows
    // ==================================================

    selectedRows:
        PropTypes.array,


    // ==================================================
    // Loading
    // ==================================================

    loading:
        PropTypes.bool,


    // ==================================================
    // Toolbar Actions
    // ==================================================

    onRefresh:
        PropTypes.func,

    onExportExcel:
        PropTypes.func,

    onExportPdf:
        PropTypes.func,

    onPrint:
        PropTypes.func,


    // ==================================================
    // Bulk Actions
    // ==================================================

    onApproveSelected:
        PropTypes.func,

    onRejectSelected:
        PropTypes.func,

    onDeleteSelected:
        PropTypes.func,


    // ==================================================
    // Filters
    // ==================================================

    onStatusFilter:
        PropTypes.func,

    onRatingFilter:
        PropTypes.func,

    onMarketplaceFilter:
        PropTypes.func,

};


// ======================================================
// Default Props
// ======================================================

ReviewToolbar.defaultProps = {

    searchText: "",

    selectedRows: [],

    loading: false,


    onSearchChange:
        () => {},


    onRefresh:
        () => {},

    onExportExcel:
        () => {},

    onExportPdf:
        () => {},

    onPrint:
        () => {},


    onApproveSelected:
        () => {},

    onRejectSelected:
        () => {},

    onDeleteSelected:
        () => {},


    onStatusFilter:
        () => {},

    onRatingFilter:
        () => {},

    onMarketplaceFilter:
        () => {},

};


// ======================================================
// Export
// ======================================================

export default ReviewToolbar;
