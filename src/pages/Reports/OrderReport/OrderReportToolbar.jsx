
import React, {
  useCallback,
} from "react";

import PropTypes from "prop-types";

import {
  Add,
  Refresh,
} from "@mui/icons-material";

import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

//======================================================
// OrderReportToolbar
//======================================================

const OrderReportToolbar = ({
  loading = false,
  onAdd,
  onRefresh,
  title = "Order Reports",
  subtitle = "View and manage order report information",
}) => {
  //====================================================
  // Add Handler
  //====================================================

  const handleAdd = useCallback(() => {
    if (
      typeof onAdd === "function"
    ) {
      onAdd();
    }
  }, [onAdd]);

  //====================================================
  // Refresh Handler
  //====================================================

  const handleRefresh =
    useCallback(() => {
      if (
        typeof onRefresh ===
        "function"
      ) {
        onRefresh();
      }
    }, [onRefresh]);
  //====================================================
  // Part 1A Ends Here
  //====================================================

  //====================================================
  // Render
  //====================================================

  return (
    <Paper
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
            Title Section
        =================================================*/}

        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            {subtitle}
          </Typography>
        </Box>

        {/*================================================
            Action Buttons
        =================================================*/}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1}
        >
          <Tooltip title="Refresh order reports">
            <span>
              <Button
                variant="outlined"
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={18}
                    />
                  ) : (
                    <Refresh />
                  )
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

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            disabled={loading}
          >
            Add Order
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

//======================================================
// PropTypes
//======================================================

OrderReportToolbar.propTypes = {
  loading:
    PropTypes.bool,

  onAdd:
    PropTypes.func,

  onRefresh:
    PropTypes.func,

  title:
    PropTypes.string,

  subtitle:
    PropTypes.string,
};

//======================================================
// Default Props
//======================================================

OrderReportToolbar.defaultProps = {
  loading: false,

  onAdd: () => {},

  onRefresh: () => {},

  title: "Order Reports",

  subtitle:
    "View and manage order report information",
};

//======================================================
// Export
//======================================================

export default OrderReportToolbar;


