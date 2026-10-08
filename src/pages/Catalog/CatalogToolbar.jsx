import React from "react";
import { Box, Button, IconButton, Tooltip, Divider, Badge } from "@mui/material";
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
  onAdd, onRefresh, onFilter, onImport, onExportExcel, onExportPDF, onPrint,
  onPublish, onUnpublish, onDeleteSelected, onToggleView, loading
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 1,
        bgcolor: "background.paper",
        borderRadius: 2,
        p: 1,
        width: "100%",
        border: "1px solid",
        borderColor: "divider"
      }}
    >
      {/* GROUP 1: ADD */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} disabled={loading}
          sx={{ bgcolor: "#1976d2", textTransform: "none", fontWeight: 700, borderRadius: 1.5, px: 2.5 }}>
          ADD CATALOG
        </Button>
        <Tooltip title="Refresh"><IconButton onClick={onRefresh} size="small" disabled={loading}><RefreshIcon /></IconButton></Tooltip>
        <Tooltip title="Filter"><IconButton onClick={onFilter} size="small"><FilterListIcon /></IconButton></Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: "none", md: "block" } }} />

      {/* GROUP 2: IMPORT/EXPORT */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={onImport} sx={{ textTransform: "none", borderRadius: 1.5 }}>IMPORT</Button>
        <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={onExportExcel} sx={{ textTransform: "none", borderRadius: 1.5 }}>EXCEL</Button>
        <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={onExportPDF} sx={{ textTransform: "none", borderRadius: 1.5 }}>PDF</Button>
        <IconButton onClick={onPrint} size="small"><PrintIcon /></IconButton>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, display: { xs: "none", md: "block" } }} />

      {/* GROUP 3: PUBLISH */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Button color="success" variant="outlined" startIcon={<PublishIcon />} onClick={onPublish} sx={{ textTransform: "none", borderRadius: 1.5 }}>PUBLISH</Button>
        <Button color="warning" variant="outlined" startIcon={<UnpublishedIcon />} onClick={onUnpublish} sx={{ textTransform: "none", borderRadius: 1.5 }}>UNPUBLISH</Button>
        <Tooltip title={selectedCount ? `Delete ${selectedCount}` : "Delete"}>
          <span><Badge badgeContent={selectedCount} color="error"><IconButton color="error" disabled={selectedCount === 0} onClick={onDeleteSelected}><DeleteIcon /></IconButton></Badge></span>
        </Tooltip>
      </Box>

      {/* GROUP 4: VIEW - RIGHT ALIGNED */}
      <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
        <Divider orientation="vertical" flexItem sx={{ mr: 1, display: { xs: "none", md: "block" } }} />
        <Tooltip title={viewMode === "table" ? "Card View" : "Table View"}>
          <IconButton onClick={onToggleView} size="small">
            {viewMode === "table" ? <ViewModuleIcon /> : <TableRowsIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default CatalogToolbar;