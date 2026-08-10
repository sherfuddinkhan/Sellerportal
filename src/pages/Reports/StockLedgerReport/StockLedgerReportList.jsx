//======================================================
// StockLedgerReportList.jsx
// Part 1A
//======================================================

import React, {
  useCallback,
  useMemo,
} from "react";

import PropTypes from "prop-types";

import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import StockLedgerReportCard from "./StockLedgerReportCard";

//======================================================
// StockLedgerReportList
//======================================================

const StockLedgerReportList = ({
  reports = [],
  loading = false,
  error = "",
  onView,
  onEdit,
  onDelete,
  onSelect,
  selectedId = null,
}) => {
  //====================================================
  // Normalize Reports
  //====================================================

  const reportList = useMemo(() => {
    if (!Array.isArray(reports)) {
      return [];
    }

    return reports.filter(
      (report) =>
        report &&
        typeof report === "object"
    );
  }, [reports]);

  //====================================================
  // Report ID
  //====================================================

  const getReportId = useCallback(
    (report, index) => {
      return (
        report?.id ??
        report?.reportId ??
        report?.stockLedgerId ??
        report?.stockLedgerReportId ??
        `stock-ledger-${index}`
      );
    },
    []
  );

  //====================================================
  // View Handler
  //====================================================

  const handleView = useCallback(
    (report) => {
      if (
        typeof onView ===
        "function"
      ) {
        onView(report);
      }
    },
    [onView]
  );

  //====================================================
  // Select Handler
  //====================================================

  const handleSelect = useCallback(
    (report) => {
      if (
        typeof onSelect ===
        "function"
      ) {
        onSelect(report);
        return;
      }

      handleView(report);
    },
    [
      onSelect,
      handleView,
    ]
  );

  //====================================================
  // Loading State
  //====================================================

  if (loading && reportList.length === 0) {
    return (
      <Box
        className="stock-ledger-report-list"
        sx={{
          width: "100%",
          minHeight: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          spacing={1.5}
          alignItems="center"
        >
          <CircularProgress
            size={32}
          />

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Loading stock ledger reports...
          </Typography>
        </Stack>
      </Box>
    );
  }

  //====================================================
  // Error State
  //====================================================

  if (
    error &&
    reportList.length === 0
  ) {
    return (
      <Box
        className="stock-ledger-report-list"
        sx={{
          width: "100%",
          p: 2,
        }}
      >
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  //====================================================
  // Empty State
  //====================================================

  if (reportList.length === 0) {
    return (
      <Box
        className="stock-ledger-report-list"
        sx={{
          width: "100%",
          minHeight: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          boxSizing: "border-box",
        }}
      >
        <Stack
          spacing={1.5}
          alignItems="center"
          textAlign="center"
        >
          <Inventory2OutlinedIcon
            sx={{
              fontSize: 48,
              opacity: 0.45,
            }}
          />

          <Typography
            variant="h6"
            fontWeight={600}
          >
            No stock ledger records
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            No stock movement records
            match the current search
            and filter criteria.
          </Typography>
        </Stack>
      </Box>
    );
  }

  //====================================================
  // Render
  //====================================================

  return (
    <Box
      className="stock-ledger-report-list"
      sx={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Stack
        spacing={0}
        divider={
          <Divider
            flexItem
            sx={{
              my: 1,
            }}
          />
        }
      >
        {reportList.map(
          (report, index) => {
            const reportId =
              getReportId(
                report,
                index
              );

            const isSelected =
              selectedId !== null &&
              String(
                selectedId
              ) ===
                String(
                  reportId
                );

            return (
              <StockLedgerReportCard
                key={String(
                  reportId
                )}
                report={report}
                selected={
                  isSelected
                }
                loading={loading}
                onClick={() =>
                  handleSelect(
                    report
                  )
                }
              />
            );
          }
        )}
      </Stack>
    </Box>
  );
};

//======================================================
// PropTypes
//======================================================

StockLedgerReportList.propTypes = {
  reports:
    PropTypes.arrayOf(
      PropTypes.object
    ),

  loading:
    PropTypes.bool,

  error:
    PropTypes.string,

  onView:
    PropTypes.func,

  onEdit:
    PropTypes.func,

  onDelete:
    PropTypes.func,

  onSelect:
    PropTypes.func,

  selectedId:
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
};

//======================================================
// Default Props
//======================================================

StockLedgerReportList.defaultProps = {
  reports: [],

  loading: false,

  error: "",

  onView: null,

  onEdit: null,

  onDelete: null,

  onSelect: null,

  selectedId: null,
};

//======================================================
// Export
//======================================================

export default StockLedgerReportList;


