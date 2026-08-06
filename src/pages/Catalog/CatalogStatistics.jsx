import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarIcon from "@mui/icons-material/Star";
import LayersIcon from "@mui/icons-material/Layers";

const StatCard = ({
  title,
  value,
  icon,
  color,
}) => (
  <Card
    elevation={3}
    sx={{
      borderRadius: 3,
      height: "100%",
    }}
  >
    <CardContent>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>

          <Typography
            variant="h4"
            fontWeight="bold"
            mt={1}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            bgcolor: `${color}.light`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {React.cloneElement(icon, {
            sx: {
              fontSize: 34,
              color: `${color}.main`,
            },
          })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const CatalogStatistics = ({
  statistics = {},
}) => {
  const {
    totalCatalogs = 0,
    activeCatalogs = 0,
    featuredCatalogs = 0,
    totalCategories = 0,
    visibleCatalogs = 0,
    totalVariants = 0,
  } = statistics;

  return (
    <Grid
      container
      spacing={2}
      mb={3}
    >
      <Grid item xs={12} sm={6} md={2}>
        <StatCard
          title="Total Catalogs"
          value={totalCatalogs}
          icon={<Inventory2Icon />}
          color="primary"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <StatCard
          title="Active"
          value={activeCatalogs}
          icon={<CheckCircleIcon />}
          color="success"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <StatCard
          title="Categories"
          value={totalCategories}
          icon={<CategoryIcon />}
          color="warning"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <StatCard
          title="Visible"
          value={visibleCatalogs}
          icon={<VisibilityIcon />}
          color="info"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <StatCard
          title="Featured"
          value={featuredCatalogs}
          icon={<StarIcon />}
          color="secondary"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <StatCard
          title="Variants"
          value={totalVariants}
          icon={<LayersIcon />}
          color="error"
        />
      </Grid>
    </Grid>
  );
};

export default CatalogStatistics;