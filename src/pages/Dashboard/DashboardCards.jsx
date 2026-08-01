import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const StatisticsCards = ({ summary }) => {

  if (!summary) return null;

  const cards = [

    {
      title: "Products",
      value: summary.totalProducts,
      icon: <Inventory2Icon fontSize="large" />,
      color: "#1976d2"
    },

    {
      title: "Brands",
      value: summary.totalBrands,
      icon: <LocalOfferIcon fontSize="large" />,
      color: "#2e7d32"
    },

    {
      title: "Categories",
      value: summary.totalCategories,
      icon: <CategoryIcon fontSize="large" />,
      color: "#ed6c02"
    },

    {
      title: "Customers",
      value: summary.totalCustomers,
      icon: <PeopleIcon fontSize="large" />,
      color: "#9c27b0"
    },

    {
      title: "Orders",
      value: summary.totalOrders,
      icon: <ShoppingCartIcon fontSize="large" />,
      color: "#0288d1"
    },

    {
      title: "Revenue",
      value: `₹ ${summary.totalRevenue?.toLocaleString()}`,
      icon: <CurrencyRupeeIcon fontSize="large" />,
      color: "#388e3c"
    },

    {
      title: "Pending Orders",
      value: summary.pendingOrders,
      icon: <PendingActionsIcon fontSize="large" />,
      color: "#f57c00"
    },

    {
      title: "Low Stock",
      value: summary.lowStockProducts,
      icon: <WarningAmberIcon fontSize="large" />,
      color: "#d32f2f"
    }

  ];

  return (

    <Grid
      container
      spacing={3}
      mb={3}
    >

      {cards.map((card, index) => (

        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          key={index}
        >

          <Card
            elevation={4}
            sx={{
              borderLeft: `6px solid ${card.color}`,
              borderRadius: 3
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
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    mt={1}
                  >
                    {card.value}
                  </Typography>

                </Box>

                <Box
                  sx={{
                    color: card.color
                  }}
                >
                  {card.icon}
                </Box>

              </Box>

            </CardContent>

          </Card>

        </Grid>

      ))}

    </Grid>

  );
};

export default StatisticsCards;