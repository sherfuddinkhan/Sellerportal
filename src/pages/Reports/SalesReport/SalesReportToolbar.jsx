//======================================================
// SalesReportToolbar.jsx
// Part 1A
//======================================================

import React from "react";

import PropTypes from "prop-types";

import {
  Add,
  FilterAltOff,
  Refresh,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

//======================================================
// SalesReportToolbar
//======================================================

const SalesReportToolbar = ({
  loading = false,
  title = "Sales Report",
  subtitle = "",
  onRefresh,
  onReset,
  onAdd,
  showAdd = false,
  showRefresh = true,
  showReset = true,
}) => {
  //====================================================
  // Refresh Handler
  //====================================================

  const handleRefresh = () => {
    if (
      loading ||
      typeof onRefresh !==
        "function"
    ) {
      return;
    }

    onRefresh();
  };

  //====================================================
  // Reset Handler
  //====================================================

  const handleReset = () => {
    if (
      loading ||
      typeof onReset !==
        "function"
    ) {
      return;
    }

    onReset();
  };

  //====================================================
  // Add Handler
  //====================================================

  const handleAdd = () => {
    if (
      loading ||
      typeof onAdd !==
        "function"
    ) {
      return;
    }

    onAdd();
  };
  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="sales-report-toolbar"
      sx={{
        width: "100%",
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
        {/*==============================================
            Title
        ==============================================*/}

        <Box>
          <Typography
            variant="h6"
            fontWeight={700}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/*==============================================
            Actions
        ==============================================*/}

        <Stack
          className="sales-report-toolbar-actions"
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={{
            xs: "flex-start",
            sm: "flex-end",
          }}
          flexWrap="wrap"
        >
          {/*============================================
              Add
          =============================================*/}

          {showAdd && onAdd && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
              disabled={loading}
            >
              Add
            </Button>
          )}

          {/*============================================
              Reset
          =============================================*/}

          {showReset && onReset && (
            <Tooltip title="Reset filters">
              <span>
                <Button
                  variant="outlined"
                  startIcon={
                    <FilterAltOff />
                  }
                  onClick={
                    handleReset
                  }
                  disabled={loading}
                >
                  Reset
                </Button>
              </span>
            </Tooltip>
          )}

          {/*============================================
              Refresh
          =============================================*/}

          {showRefresh &&
            onRefresh && (
              <Tooltip title="Refresh sales reports">
                <span>
                  <Button
                    variant="outlined"
                    startIcon={
                      <Refresh />
                    }
                    onClick={
                      handleRefresh
                    }
                    disabled={
                      loading
                    }
                  >
                    Refresh
                  </Button>
                </span>
              </Tooltip>
            )}
        </Stack>
      </Stack>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

SalesReportToolbar.propTypes = {
  loading:
    PropTypes.bool,

  title:
    PropTypes.string,

  subtitle:
    PropTypes.string,

  onRefresh:
    PropTypes.func,

  onReset:
    PropTypes.func,

  onAdd:
    PropTypes.func,

  showAdd:
    PropTypes.bool,

  showRefresh:
    PropTypes.bool,

  showReset:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

SalesReportToolbar.defaultProps = {
  loading: false,

  title: "Sales Report",

  subtitle: "",

  onRefresh: null,

  onReset: null,

  onAdd: null,

  showAdd: false,

  showRefresh: true,

  showReset: true,
};

//======================================================
// Export
//======================================================

export default SalesReportToolbar;



