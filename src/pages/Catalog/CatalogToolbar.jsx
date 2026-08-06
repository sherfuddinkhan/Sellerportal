import React from "react";
import {
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import PublishIcon from "@mui/icons-material/Publish";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import TableRowsIcon from "@mui/icons-material/TableRows";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CatalogToolbar = ({
  selectedCount = 0,
  viewMode = "table",
  onAdd,
  onRefresh,
  onFilter,
  onImport,
  onExportExcel,
  onExportPDF,
  onPrint,
  onPublish,
  onUnpublish,
  onDeleteSelected,
  onToggleView,
}) => {
  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
        bgcolor: "background.paper",
        borderRadius: 2,
        mb: 2,
        px: 2,
        py: 1,
      }}
    >
      {/* Left Section */}
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="h6" fontWeight="bold">
          Product Catalog
        </Typography>

        {selectedCount > 0 && (
          <Typography color="primary">
            {selectedCount} Selected
          </Typography>
        )}
      </Box>

      {/* Right Section */}
      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          Add Catalog
        </Button>

        <Tooltip title="Refresh">
          <IconButton onClick={onRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Filter">
          <IconButton onClick={onFilter}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={onImport}
        >
          Import
        </Button>

        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={onExportExcel}
        >
          Excel
        </Button>

        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={onExportPDF}
        >
          PDF
        </Button>

        <Tooltip title="Print">
          <IconButton onClick={onPrint}>
            <PrintIcon />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Button
          color="success"
          variant="outlined"
          startIcon={<PublishIcon />}
          onClick={onPublish}
        >
          Publish
        </Button>

        <Button
          color="warning"
          variant="outlined"
          startIcon={<UnpublishedIcon />}
          onClick={onUnpublish}
        >
          Unpublish
        </Button>

        <Tooltip title="Delete Selected">
          <span>
            <IconButton
              color="error"
              disabled={selectedCount === 0}
              onClick={onDeleteSelected}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Divider orientation="vertical" flexItem />

        <Tooltip
          title={
            viewMode === "table"
              ? "Card View"
              : "Table View"
          }
        >
          <IconButton onClick={onToggleView}>
            {viewMode === "table" ? (
              <ViewModuleIcon />
            ) : (
              <TableRowsIcon />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Toolbar>
  );
};

export default CatalogToolbar;