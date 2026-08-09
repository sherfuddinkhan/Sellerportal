import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import {Box,Stack,Button,IconButton,Tooltip,Typography,Divider,Menu,MenuItem,Badge,Chip,Avatar,TextField,InputAdornment} from "@mui/material";
import {Refresh,Search,FilterList,Download,Print,Delete,CheckCircle,Cancel,Reply,MoreVert,FileDownload,PictureAsPdf,TableChart,Star} from "@mui/icons-material";

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
];

const RATING_OPTIONS = [
  "All",
  "★★★★★",
  "★★★★",
  "★★★",
  "★★",
  "★",
];

const MARKETPLACE_OPTIONS = [
  "All",
  "Amazon",
  "Flipkart",
  "Meesho",
  "Shopify",
];

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

  //==================================================
  // Export Menu
  //==================================================

  const [exportAnchor, setExportAnchor] =
    useState(null);

  //==================================================
  // Filter Menu
  //==================================================

  const [filterAnchor, setFilterAnchor] =
    useState(null);

  //==================================================
  // Bulk Menu
  //==================================================

  const [bulkAnchor, setBulkAnchor] =
    useState(null);

  //==================================================
  // Current Filters
  //==================================================

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [ratingFilter, setRatingFilter] =
    useState("All");

  const [marketplaceFilter, setMarketplaceFilter] =
    useState("All");

  //==================================================
  // Selected Count
  //==================================================

  const selectedCount = useMemo(
    () => selectedRows.length,
    [selectedRows]
  );

  //==================================================
  // Menu Handlers
  //==================================================

  const openExportMenu = (event) =>
    setExportAnchor(event.currentTarget);

  const closeExportMenu = () =>
    setExportAnchor(null);

  const openFilterMenu = (event) =>
    setFilterAnchor(event.currentTarget);

  const closeFilterMenu = () =>
    setFilterAnchor(null);

  const openBulkMenu = (event) =>
    setBulkAnchor(event.currentTarget);

  const closeBulkMenu = () =>
    setBulkAnchor(null);
    //==================================================
  // Filter Handlers
  //==================================================

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    closeFilterMenu();

    if (onStatusFilter) {
      onStatusFilter(status);
    }
  };

  const handleRatingChange = (rating) => {
    setRatingFilter(rating);
    closeFilterMenu();

    if (onRatingFilter) {
      onRatingFilter(rating);
    }
  };

  const handleMarketplaceChange = (marketplace) => {
    setMarketplaceFilter(marketplace);
    closeFilterMenu();

    if (onMarketplaceFilter) {
      onMarketplaceFilter(marketplace);
    }
  };

  //==================================================
  // Bulk Actions
  //==================================================

  const handleApprove = () => {
    closeBulkMenu();

    if (onApproveSelected) {
      onApproveSelected(selectedRows);
    }
  };

  const handleReject = () => {
    closeBulkMenu();

    if (onRejectSelected) {
      onRejectSelected(selectedRows);
    }
  };

  const handleDelete = () => {
    closeBulkMenu();

    if (onDeleteSelected) {
      onDeleteSelected(selectedRows);
    }
  };

  //==================================================
  // Export
  //==================================================

  const handleExportExcel = () => {
    closeExportMenu();

    if (onExportExcel) {
      onExportExcel();
    }
  };

  const handleExportPdf = () => {
    closeExportMenu();

    if (onExportPdf) {
      onExportPdf();
    }
  };

  //==================================================
  // JSX
  //==================================================

  return (
    <Box mb={2}>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
      >

        {/* Left */}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          flexWrap="wrap"
        >

          <Typography variant="h5" fontWeight={700}>
            Reviews
          </Typography>

          <Chip
            color="primary"
            label={`${selectedCount} Selected`}
          />

        </Stack>

        {/* Right */}

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
        >

          <TextField
            size="small"
            placeholder="Search reviews..."
            value={searchText}
            onChange={onSearchChange}
            sx={{ minWidth: 260 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <Tooltip title="Refresh">

            <IconButton
              color="primary"
              disabled={loading}
              onClick={onRefresh}
            >
              <Refresh />
            </IconButton>

          </Tooltip>

          <Tooltip title="Filters">

            <IconButton
              onClick={openFilterMenu}
            >
              <FilterList />
            </IconButton>

          </Tooltip>

          <Tooltip title="Export">

            <IconButton
              onClick={openExportMenu}
            >
              <Download />
            </IconButton>

          </Tooltip>

          <Tooltip title="Print">

            <IconButton
              onClick={onPrint}
            >
              <Print />
            </IconButton>

          </Tooltip>

          <Badge
            badgeContent={selectedCount}
            color="error"
          >

            <Button
              variant="contained"
              endIcon={<MoreVert />}
              onClick={openBulkMenu}
              disabled={!selectedCount}
            >
              Bulk Actions
            </Button>

          </Badge>

        </Stack>

      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Export Menu */}

      <Menu
        anchorEl={exportAnchor}
        open={Boolean(exportAnchor)}
        onClose={closeExportMenu}
      >

        <MenuItem onClick={handleExportExcel}>
          <TableChart sx={{ mr: 1 }} />
          Export Excel
        </MenuItem>

        <MenuItem onClick={handleExportPdf}>
          <PictureAsPdf sx={{ mr: 1 }} />
          Export PDF
        </MenuItem>

      </Menu>

      {/* Filter Menu */}

      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={closeFilterMenu}
      >

        <Typography
          sx={{
            px: 2,
            pt: 1,
            fontWeight: 700,
          }}
        >
          Status
        </Typography>

        {STATUS_OPTIONS.map((item) => (

          <MenuItem
            key={item}
            selected={statusFilter === item}
            onClick={() => handleStatusChange(item)}
          >
            {item}
          </MenuItem>

        ))}

        <Divider />

        <Typography
          sx={{
            px: 2,
            pt: 1,
            fontWeight: 700,
          }}
        >
          Rating
        </Typography>

        {RATING_OPTIONS.map((item) => (

          <MenuItem
            key={item}
            selected={ratingFilter === item}
            onClick={() => handleRatingChange(item)}
          >
            <Star
              sx={{
                mr: 1,
                color: "#FFA000",
              }}
            />

            {item}
          </MenuItem>

        ))}

        <Divider />

        <Typography
          sx={{
            px: 2,
            pt: 1,
            fontWeight: 700,
          }}
        >
          Marketplace
        </Typography>

        {MARKETPLACE_OPTIONS.map((item) => (

          <MenuItem
            key={item}
            selected={marketplaceFilter === item}
            onClick={() => handleMarketplaceChange(item)}
          >
            {item}
          </MenuItem>

        ))}

      </Menu>

      {/* Bulk Menu */}

      <Menu
        anchorEl={bulkAnchor}
        open={Boolean(bulkAnchor)}
        onClose={closeBulkMenu}
      >

        <MenuItem onClick={handleApprove}>
          <CheckCircle
            color="success"
            sx={{ mr: 1 }}
          />
          Approve Selected
        </MenuItem>

        <MenuItem onClick={handleReject}>
          <Cancel
            color="warning"
            sx={{ mr: 1 }}
          />
          Reject Selected
        </MenuItem>

        <MenuItem onClick={handleDelete}>
          <Delete
            color="error"
            sx={{ mr: 1 }}
          />
          Delete Selected
        </MenuItem>

      </Menu>
            <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

//==================================================
// Prop Types
//==================================================

ReviewToolbar.propTypes = {
  // Search
  searchText: PropTypes.string,
  onSearchChange: PropTypes.func,

  // Selected Rows
  selectedRows: PropTypes.array,

  // Loading
  loading: PropTypes.bool,

  // Toolbar Actions
  onRefresh: PropTypes.func,
  onExportExcel: PropTypes.func,
  onExportPdf: PropTypes.func,
  onPrint: PropTypes.func,

  // Bulk Actions
  onApproveSelected: PropTypes.func,
  onRejectSelected: PropTypes.func,
  onDeleteSelected: PropTypes.func,

  // Filters
  onStatusFilter: PropTypes.func,
  onRatingFilter: PropTypes.func,
  onMarketplaceFilter: PropTypes.func,
};

//==================================================
// Default Props
//==================================================

ReviewToolbar.defaultProps = {
  searchText: "",
  selectedRows: [],
  loading: false,

  onSearchChange: () => {},

  onRefresh: () => {},
  onExportExcel: () => {},
  onExportPdf: () => {},
  onPrint: () => {},

  onApproveSelected: () => {},
  onRejectSelected: () => {},
  onDeleteSelected: () => {},

  onStatusFilter: () => {},
  onRatingFilter: () => {},
  onMarketplaceFilter: () => {},
};

//==================================================
// Export
//==================================================

export default ReviewToolbar;