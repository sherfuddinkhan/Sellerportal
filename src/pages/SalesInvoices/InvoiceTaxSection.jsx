import React from "react";
import {
    Box,
    Grid,
    Typography
} from "@mui/material";

const money = value =>
    Number(value || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

const InvoiceTaxSection = ({
    items = []
}) => {

    const rows = Array.isArray(items)
        ? items
        : [];

    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    let cgstRate = 0;
    let sgstRate = 0;
    let igstRate = 0;

    rows.forEach(item => {

        cgst += Number(
            item?.CgstAmount ??
            item?.cgstAmount ??
            0
        );

        sgst += Number(
            item?.SgstAmount ??
            item?.sgstAmount ??
            0
        );

        igst += Number(
            item?.IgstAmount ??
            item?.igstAmount ??
            0
        );

        cgstRate = Math.max(
            cgstRate,
            Number(
                item?.CgstPer ??
                item?.cgstPer ??
                0
            )
        );

        sgstRate = Math.max(
            sgstRate,
            Number(
                item?.SgstPer ??
                item?.sgstPer ??
                0
            )
        );

        igstRate = Math.max(
            igstRate,
            Number(
                item?.IgstPer ??
                item?.igstPer ??
                0
            )
        );
    });

    return (
        <Box
            sx={{
                borderLeft: "1px solid #222",
                borderRight: "1px solid #222",
                borderBottom: "1px solid #222"
            }}
        >
            <Box sx={{ p: 1 }}>
                <Typography
                    variant="subtitle2"
                    fontWeight={800}
                >
                    TAX DETAILS
                </Typography>
            </Box>

            <Grid container>

                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        p: 1.5,
                        borderTop: "1px solid #222",
                        borderRight: {
                            xs: "none",
                            md: "1px solid #222"
                        }
                    }}
                >
                    <Typography
                        variant="body2"
                        fontWeight={700}
                    >
                        CGST
                    </Typography>

                    <Typography variant="body2">
                        Rate: {cgstRate}%
                    </Typography>

                    <Typography variant="body2">
                        Amount: ₹{money(cgst)}
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        p: 1.5,
                        borderTop: "1px solid #222",
                        borderRight: {
                            xs: "none",
                            md: "1px solid #222"
                        }
                    }}
                >
                    <Typography
                        variant="body2"
                        fontWeight={700}
                    >
                        SGST
                    </Typography>

                    <Typography variant="body2">
                        Rate: {sgstRate}%
                    </Typography>

                    <Typography variant="body2">
                        Amount: ₹{money(sgst)}
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                        p: 1.5,
                        borderTop: "1px solid #222"
                    }}
                >
                    <Typography
                        variant="body2"
                        fontWeight={700}
                    >
                        IGST
                    </Typography>

                    <Typography variant="body2">
                        Rate: {igstRate}%
                    </Typography>

                    <Typography variant="body2">
                        Amount: ₹{money(igst)}
                    </Typography>
                </Grid>

            </Grid>
        </Box>
    );
};

export default InvoiceTaxSection;