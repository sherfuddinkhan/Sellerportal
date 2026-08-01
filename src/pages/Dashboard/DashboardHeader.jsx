import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

const DashboardHeader = ({
  title = "Dashboard",
  subtitle = "Marketplace Seller Portal",
  onRefresh,
  onExport
}) => {

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap"
      }}
    >
      <Box>

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          {title}
        </Typography>

        <Typography
          color="text.secondary"
          mt={1}
        >
          {subtitle}
        </Typography>

        <Typography
          variant="body2"
          color="primary"
          mt={1}
        >
          {currentDate}
        </Typography>

      </Box>

      <Stack
        direction="row"
        spacing={2}
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
        >
          Refresh
        </Button>

        <Button
          variant="outlined"
          color="success"
          startIcon={<DownloadIcon />}
          onClick={onExport}
        >
          Export
        </Button>

      </Stack>
    </Box>
  );
};

export default DashboardHeader;