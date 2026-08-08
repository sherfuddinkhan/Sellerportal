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
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Refresh,
  Download,
  Print,
  Delete,
  CheckCircle,
  Block,
  MoreVert,
  FileDownload,
  PictureAsPdf,
  TableChart,
} from "@mui/icons-material";

//======================================================
// CustomerReportToolbar
//======================================================

const CustomerReportToolbar = ({
  searchText = "",

  selectedRows = [],

  loading = false,

  onRefresh,
  onExportExcel,
  onExportPdf,
  onPrint,

  onActivateSelected,
  onDeactivateSelected,
  onDeleteSelected,
}) => {

  //====================================================
  // Export Menu
  //====================================================

  const [exportAnchor, setExportAnchor] =
    useState(null);

  //====================================================
  // Bulk Action Menu
  //====================================================

  const [bulkAnchor, setBulkAnchor] =
    useState(null);

  //====================================================
  // Selected Count
  //====================================================

  const selectedCount = useMemo(
    () => selectedRows.length,
    [selectedRows]
  );

  //====================================================
  // Export Menu Handlers
  //====================================================

  const handleOpenExport = (event) => {
    setExportAnchor(event.currentTarget);
  };

  const handleCloseExport = () => {
    setExportAnchor(null);
  };

  //====================================================
  // Bulk Menu Handlers
  //====================================================

  const handleOpenBulk = (event) => {
    setBulkAnchor(event.currentTarget);
  };

  const handleCloseBulk = () => {
    setBulkAnchor(null);
  };

  //====================================================
  // Export Excel
  //====================================================

  const handleExportExcel = () => {

    handleCloseExport();

    if (onExportExcel) {
      onExportExcel();
    }
  };

  //====================================================
  // Export PDF
  //====================================================

  const handleExportPdf = () => {

    handleCloseExport();

    if (onExportPdf) {
      onExportPdf();
    }
  };

  //====================================================
  // Print
  //====================================================

  const handlePrint = () => {

    if (onPrint) {
      onPrint();
    }
  };

  //====================================================
  // Refresh
  //====================================================

  const handleRefresh = () => {

    if (onRefresh) {
      onRefresh();
    }
  };

  //====================================================
  // Bulk Activate
  //====================================================

  const handleActivateSelected = () => {

    handleCloseBulk();

    if (onActivateSelected) {
      onActivateSelected();
    }
  };

  //====================================================
  // Bulk Deactivate
  //====================================================

  const handleDeactivateSelected = () => {

    handleCloseBulk();

    if (onDeactivateSelected) {
      onDeactivateSelected();
    }
  };

  //====================================================
  // Bulk Delete
  //====================================================

  const handleDeleteSelected = () => {

    handleCloseBulk();

    if (onDeleteSelected) {
      onDeleteSelected();
    }
  };

  //====================================================
  // Component continues in Part 1B
  //====================================================
    //====================================================
  // Toolbar JSX
  //====================================================

  return (
    <Box
      className="customer-report-toolbar"
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        justifyContent="space-between"
      >

        {/*================================================
            Left Section
        =================================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
        >

          <Typography
            variant="h6"
            fontWeight={700}
          >
            Customer Reports
          </Typography>

          {searchText.trim() !== "" && (
            <Chip
              size="small"
              label={`Search: ${searchText}`}
              variant="outlined"
            />
          )}

          {selectedCount > 0 && (
            <Badge
              badgeContent={selectedCount}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  right: 4,
                  top: 4,
                },
              }}
            >
              <Chip
                size="small"
                label="Selected"
                color="primary"
                variant="outlined"
              />
            </Badge>
          )}

        </Stack>

        {/*================================================
            Right Section
        =================================================*/}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="flex-end"
          flexWrap="wrap"
        >

          {/*============================================
              Refresh
          ============================================*/}

          <Tooltip title="Refresh customer report">

            <span>

              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                color="primary"
              >
                <Refresh />
              </IconButton>

            </span>

          </Tooltip>

          {/*============================================
              Bulk Actions
          ============================================*/}

          <Tooltip
            title={
              selectedCount > 0
                ? "Bulk actions"
                : "Select customers first"
            }
          >

            <span>

              <Button
                variant="outlined"
                startIcon={<MoreVert />}
                onClick={handleOpenBulk}
                disabled={
                  loading ||
                  selectedCount === 0
                }
              >
                Bulk Actions
              </Button>

            </span>

          </Tooltip>

          <Menu
            anchorEl={bulkAnchor}
            open={Boolean(bulkAnchor)}
            onClose={handleCloseBulk}
          >

            <MenuItem
              onClick={handleActivateSelected}
            >
              <CheckCircle
                fontSize="small"
                color="success"
                sx={{ mr: 1 }}
              />

              Activate Selected
            </MenuItem>

            <MenuItem
              onClick={handleDeactivateSelected}
            >
              <Block
                fontSize="small"
                color="warning"
                sx={{ mr: 1 }}
              />

              Deactivate Selected
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={handleDeleteSelected}
              sx={{
                color: "error.main",
              }}
            >
              <Delete
                fontSize="small"
                sx={{ mr: 1 }}
              />

              Delete Selected
            </MenuItem>

          </Menu>

          {/*============================================
              Export
          ============================================*/}

          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleOpenExport}
            disabled={loading}
          >
            Export
          </Button>

          <Menu
            anchorEl={exportAnchor}
            open={Boolean(exportAnchor)}
            onClose={handleCloseExport}
          >

            <MenuItem
              onClick={handleExportExcel}
            >
              <TableChart
                fontSize="small"
                sx={{ mr: 1 }}
              />

              Export Excel
            </MenuItem>

            <MenuItem
              onClick={handleExportPdf}
            >
              <PictureAsPdf
                fontSize="small"
                sx={{ mr: 1 }}
              />

              Export PDF
            </MenuItem>

          </Menu>

          {/*============================================
              Print
          ============================================*/}

          <Tooltip title="Print customer report">

            <span>

              <IconButton
                onClick={handlePrint}
                disabled={loading}
                color="primary"
              >
                <Print />
              </IconButton>

            </span>

          </Tooltip>

        </Stack>

      </Stack>

    </Box>
  );
};

export default CustomerReportToolbar;