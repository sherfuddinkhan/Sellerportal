import React, {useCallback,useState} from "react";
import PropTypes from "prop-types";
import {Download,FileDownload} from "@mui/icons-material";
import {Button,Menu,MenuItem,ListItemIcon,ListItemText,Tooltip} from "@mui/material";

//======================================================
// ReturnReportExport
//======================================================

const ReturnReportExport = ({
  reports = [],
  filteredReports = [],
  loading = false,
  fileName = "return-report",
  onExport,
}) => {
  //====================================================
  // Menu State
  //====================================================
  const [anchorEl, setAnchorEl] = useState(null);
  //====================================================
  // Open Menu
  //====================================================
  const handleOpen = useCallback(
    (event) => {
      if (loading) {
        return;
      }
      setAnchorEl(
        event.currentTarget
      );
    },
    [loading]
  );

  //====================================================
  // Close Menu
  //====================================================

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  //====================================================
  // Export Handler
  //====================================================

  const handleExport = useCallback(
    (format, useFiltered) => {
      const data = useFiltered
        ? filteredReports
        : reports;

      if (
        typeof onExport ===
        "function"
      ) {
        onExport({
          format,
          data: Array.isArray(data)
            ? data
            : [],
          fileName,
        });
      }

      handleClose();
    },
    [ filteredReports,reports,fileName,onExport,handleClose]
  );
  //====================================================
  // Safe Record Count
  //====================================================
  const reportCount = Array.isArray(reports)? reports.length : 0;
  const filteredCount = Array.isArray(filteredReports) ? filteredReports.length : 0;
  //====================================================
  // Render
  //====================================================
  const menuOpen = Boolean(anchorEl);
  return (
    <>
      <Tooltip title="Export return reports">
        <span>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={handleOpen}
            disabled={ loading || reportCount === 0}
            aria-haspopup="menu"
            aria-expanded={ menuOpen ? "true" : undefined}
          >
            Export
          </Button>
        </span>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          disabled={
            filteredCount === 0
          }
          onClick={() =>
            handleExport(
              "csv",
              true
            )
          }
        >
          <ListItemIcon>
            <FileDownload fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Export Filtered CSV
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() =>
            handleExport(
              "csv",
              false
            )
          }
        >
          <ListItemIcon>
            <FileDownload fontSize="small" />
          </ListItemIcon>

          <ListItemText>
            Export All CSV
          </ListItemText>
        </MenuItem>

        <MenuItem
          disabled={
            filteredCount === 0
          }
          onClick={() =>
            handleExport(
              "excel",
              true
            )
          }
        >
          <ListItemIcon>
            <FileDownload fontSize="small" />
          </ListItemIcon>

          <ListItemText>
            Export Filtered Excel
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() =>
            handleExport(
              "excel",
              false
            )
          }
        >
          <ListItemIcon>
            <FileDownload fontSize="small" />
          </ListItemIcon>

          <ListItemText>
            Export All Excel
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

//======================================================
// PropTypes
//======================================================

ReturnReportExport.propTypes = {
  reports:
    PropTypes.array,

  filteredReports:
    PropTypes.array,

  loading:
    PropTypes.bool,

  fileName:
    PropTypes.string,

  onExport:
    PropTypes.func,
};

//======================================================
// Default Props
//======================================================

ReturnReportExport.defaultProps = {
  reports: [],

  filteredReports: [],

  loading: false,

  fileName:
    "return-report",

  onExport: null,
};


export default ReturnReportExport;

