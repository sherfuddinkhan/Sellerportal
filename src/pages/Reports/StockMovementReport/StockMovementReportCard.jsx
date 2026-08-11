//======================================================
// StockMovementReportCard.jsx
// Part 1A
//======================================================

import React from "react";

import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

//======================================================
// StockMovementReportCard
//======================================================

const StockMovementReportCard = ({
  children,
  title = "Stock Movement Report",
  subtitle = "",
  actions = null,
  loading = false,
  variant = "outlined",
  className = "",
}) => {
  //====================================================
  // Render
  //====================================================

  return (
    <Card
      variant={variant}
      className={[
        "stock-movement-report__card",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      sx={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <CardContent
        sx={{
          width: "100%",
          boxSizing: "border-box",
          "&:last-child": {
            pb: 2,
          },
        }}
      >

        {/*==============================================
            Header
        ===============================================*/}

        {(title ||
          subtitle ||
          actions) && (
          <>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              justifyContent="space-between"
              spacing={2}
              sx={{
                mb: 2,
              }}
            >

              {/*========================================
                  Title / Subtitle
              =========================================*/}

              <Box
                sx={{
                  minWidth: 0,
                  flex: 1,
                }}
              >
                {title && (
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    component="h2"
                    sx={{
                      lineHeight: 1.4,
                    }}
                  >
                    {title}
                  </Typography>
                )}

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

              {/*========================================
                  Actions
              =========================================*/}

              {actions && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "flex-end",
                    gap: 1,
                    flexWrap:
                      "wrap",
                    flexShrink: 0,
                  }}
                >
                  {actions}
                </Box>
              )}

            </Stack>

            <Divider
              sx={{
                mb: 2,
              }}
            />
          </>
        )}

        {/*==============================================
            Content
        ===============================================*/}

        <Box
          className="stock-movement-report__card-content"
          sx={{
            width: "100%",
            position: "relative",
          }}
        >

          {/*============================================
              Loading Overlay
          =============================================*/}

          {loading && (
            <Box
              sx={{
                position:
                  "absolute",
                inset: 0,
                zIndex: 2,
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                backgroundColor:
                  "rgba(255, 255, 255, 0.7)",
                pointerEvents:
                  "none",
              }}
            />
          )}

          {children}

        </Box>

      </CardContent>
    </Card>
  );
};

//======================================================
// PropTypes
//======================================================

StockMovementReportCard.propTypes = {
  children:
    PropTypes.node,

  title:
    PropTypes.string,

  subtitle:
    PropTypes.string,

  actions:
    PropTypes.node,

  loading:
    PropTypes.bool,

  variant:
    PropTypes.oneOf([
      "elevation",
      "outlined",
    ]),

  className:
    PropTypes.string,
};

//======================================================
// Default Props
//======================================================

StockMovementReportCard.defaultProps = {
  children: null,
  title: "Stock Movement Report",
  subtitle: "",
  actions: null,
  loading: false,
  variant: "outlined",
  className: "",
};

//======================================================
// Export
//======================================================

export default StockMovementReportCard;

//======================================================
// Part 1A Ends Here
//======================================================