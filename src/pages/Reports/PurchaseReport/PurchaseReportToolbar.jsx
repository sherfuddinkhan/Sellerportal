import React, {
  useCallback,
} from "react";

import PropTypes from "prop-types";

import {
  Add,
  FilterAlt,
  Refresh,
} from "@mui/icons-material";

import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

//======================================================
// PurchaseReportToolbar
//======================================================

const PurchaseReportToolbar = ({
  loading = false,
  onCreate,
  onRefresh,
  onFilter,
  title = "Purchase Report",
  subtitle = "Manage and analyze purchase transactions",
  showCreate = true,
  showRefresh = true,
  showFilter = false,
}) => {
  //====================================================
  // Create Handler
  //====================================================

  const handleCreate = useCallback(() => {
    if (loading) {
      return;
    }

    onCreate?.();
  }, [
    loading,
    onCreate,
  ]);

  //====================================================
  // Refresh Handler
  //====================================================

  const handleRefresh = useCallback(() => {
    if (loading) {
      return;
    }

    onRefresh?.();
  }, [
    loading,
    onRefresh,
  ]);

  //====================================================
  // Filter Handler
  //====================================================

  const handleFilter = useCallback(() => {
    if (loading) {
      return;
    }

    onFilter?.();
  }, [
    loading,
    onFilter,
  ]);
  //====================================================
  // Render
  //====================================================

  return (
    <Paper
      className="purchase-report-toolbar"
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 2,
        p: {
          xs: 1.5,
          sm: 2,
        },
      }}
    >
      <Stack
        spacing={2}
      >
        {/*==============================================
            Toolbar Header
        ==============================================*/}

        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            justifyContent:
              "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
          }}
        >
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
                sx={{
                  mt: 0.5,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/*============================================
              Actions
          ============================================*/}

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
          >
            {showFilter && (
              <Button
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

            {showRefresh && (
              <Button
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

            {showCreate && (
              <Button
                variant="contained"
                startIcon={
                  <Add />
                }
                onClick={
                  handleCreate
                }
                disabled={loading}
              >
                Add Purchase
              </Button>
            )}
          </Stack>
        </Box>

        <Divider />

        {/*==============================================
            Status
        ==============================================*/}

        {loading && (
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Loading purchase report data...
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

PurchaseReportToolbar.propTypes = {
  loading:
    PropTypes.bool,

  onCreate:
    PropTypes.func,

  onRefresh:
    PropTypes.func,

  onFilter:
    PropTypes.func,

  title:
    PropTypes.string,

  subtitle:
    PropTypes.string,

  showCreate:
    PropTypes.bool,

  showRefresh:
    PropTypes.bool,

  showFilter:
    PropTypes.bool,
};

//======================================================
// Default Props
//======================================================

PurchaseReportToolbar.defaultProps = {
  loading: false,

  onCreate: () => {},

  onRefresh: () => {},

  onFilter: () => {},

  title: "Purchase Report",

  subtitle:
    "Manage and analyze purchase transactions",

  showCreate: true,

  showRefresh: true,

  showFilter: false,
};

//======================================================
// Export
//======================================================

export default PurchaseReportToolbar;

