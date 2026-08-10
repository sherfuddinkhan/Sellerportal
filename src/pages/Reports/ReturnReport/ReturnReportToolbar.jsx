
import React, {
  useCallback,
} from "react";

import PropTypes from "prop-types";

import {
  Add,
  FilterAltOff,
  Refresh,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Chip,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

//======================================================
// ReturnReportToolbar
//======================================================

const ReturnReportToolbar = ({
  loading = false,
  totalRecords = 0,
  onRefresh,
  onReset,
  onAdd,
}) => {
  //====================================================
  // Refresh Handler
  //====================================================

  const handleRefresh =
    useCallback(() => {
      if (
        loading ||
        !onRefresh
      ) {
        return;
      }

      onRefresh();
    }, [
      loading,
      onRefresh,
    ]);

  //====================================================
  // Reset Handler
  //====================================================

  const handleReset =
    useCallback(() => {
      if (
        loading ||
        !onReset
      ) {
        return;
      }

      onReset();
    }, [
      loading,
      onReset,
    ]);

  //====================================================
  // Add Handler
  //====================================================

  const handleAdd =
    useCallback(() => {
      if (
        loading ||
        !onAdd
      ) {
        return;
      }

      onAdd();
    }, [
      loading,
      onAdd,
    ]);

  //====================================================
  // Safe Record Count
  //====================================================

  const recordCount =
    Number(totalRecords) || 0;

  //====================================================
  // Part 1A Ends Here
  //====================================================

  return (
    <Box
      className="return-report-toolbar"
      sx={{
        width: "100%",
        mb: 2,
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
            Title / Count
        ==============================================*/}

        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flexWrap="wrap"
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Return Reports
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Manage returned orders
              and refund records
            </Typography>
          </Box>

          <Chip
            size="small"
            label={`${recordCount} ${
              recordCount === 1
                ? "Record"
                : "Records"
            }`}
            variant="outlined"
          />
        </Stack>

        {/*==============================================
            Toolbar Actions
        ==============================================*/}

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          justifyContent={{
            xs: "flex-start",
            sm: "flex-end",
          }}
        >
          <Tooltip title="Refresh reports">
            <span>
              <Button
                variant="outlined"
                size="small"
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
            </span>
          </Tooltip>

          <Tooltip title="Reset search and filters">
            <span>
              <Button
                variant="outlined"
                size="small"
                color="inherit"
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

          {onAdd && (
            <Tooltip title="Add return report">
              <span>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={
                    <Add />
                  }
                  onClick={
                    handleAdd
                  }
                  disabled={loading}
                >
                  Add Return
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

ReturnReportToolbar.propTypes = {
  loading:
    PropTypes.bool,

  totalRecords:
    PropTypes.number,

  onRefresh:
    PropTypes.func,

  onReset:
    PropTypes.func,

  onAdd:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

ReturnReportToolbar.defaultProps = {
  loading: false,

  totalRecords: 0,

  onRefresh: null,

  onReset: null,

  onAdd: null,
};

//======================================================
// Export
//======================================================

export default ReturnReportToolbar;

