import React from "react";
import PropTypes from "prop-types";
import {
  Add,
  FilterAlt,
  Refresh,
  RestartAlt,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

//======================================================
// ProfitLossReportToolbar
//======================================================

const ProfitLossReportToolbar = ({
  onAdd,
  onRefresh,
  onFilter,
  onReset,
  loading = false,
  title = "Profit & Loss Reports",
  showAdd = true,
  showRefresh = true,
  showFilter = true,
  showReset = true,
}) => {
  //====================================================
  // Add Handler
  //====================================================

  const handleAdd = () => {
    onAdd?.();
  };

  //====================================================
  // Refresh Handler
  //====================================================

  const handleRefresh = () => {
    onRefresh?.();
  };

  //====================================================
  // Filter Handler
  //====================================================

  const handleFilter = () => {
    onFilter?.();
  };

  //====================================================
  // Reset Handler
  //====================================================

  const handleReset = () => {
    onReset?.();
  };

  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="profit-loss-report-toolbar"
      variant="outlined"
      sx={{
        width: "100%",
        p: 1.5,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {/*==============================================
            Toolbar Title
        ==============================================*/}

        <Box
          sx={{
            minWidth: 180,
            flex: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
          >
            {title}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Revenue, expenses,
            costs and profitability
          </Typography>
        </Box>

        {/*==============================================
            Toolbar Actions
        ==============================================*/}

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
        >
          {showRefresh && (
            <Button
              size="small"
              variant="outlined"
              startIcon={
                <Refresh />
              }
              onClick={
                handleRefresh
              }
              disabled={loading}
            >
              Refresh
            </Button>
          )}

          {showFilter && (
            <Button
              size="small"
              variant="outlined"
              startIcon={
                <FilterAlt />
              }
              onClick={
                handleFilter
              }
              disabled={loading}
            >
              Filter
            </Button>
          )}

          {showReset && (
            <Button
              size="small"
              variant="text"
              startIcon={
                <RestartAlt />
              }
              onClick={
                handleReset
              }
              disabled={loading}
            >
              Reset
            </Button>
          )}

          {showAdd && (
            <Button
              size="small"
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
              disabled={loading}
            >
              Add Report
            </Button>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

ProfitLossReportToolbar.propTypes =
  {
    onAdd:
      PropTypes.func,

    onRefresh:
      PropTypes.func,

    onFilter:
      PropTypes.func,

    onReset:
      PropTypes.func,

    loading:
      PropTypes.bool,

    title:
      PropTypes.string,

    showAdd:
      PropTypes.bool,

    showRefresh:
      PropTypes.bool,

    showFilter:
      PropTypes.bool,

    showReset:
      PropTypes.bool,
  };

//======================================================
// Default Props
//======================================================

ProfitLossReportToolbar.defaultProps =
  {
    onAdd: () => {},

    onRefresh: () => {},

    onFilter: () => {},

    onReset: () => {},

    loading: false,

    title:
      "Profit & Loss Reports",

    showAdd: true,

    showRefresh: true,

    showFilter: true,

    showReset: true,
  };


export default ProfitLossReportToolbar;