import React from "react";

import {
    Grid,
    Card,
    CardContent,
    Typography,
    Stack
} from "@mui/material";

import {
    Home,
    LocationOn,
    Star,
    Public
} from "@mui/icons-material";


const CustomerAddressStatistics = ({
    addresses = []
}) => {

    // ============================================================
    // NORMALIZE ADDRESS DATA
    // Supports PascalCase + camelCase
    // ============================================================

    const normalizedAddresses = addresses.map(
        (address = {}) => ({
            CustomerAddressId:
                address.CustomerAddressId ??
                address.customerAddressId ??
                0,

            CustomerId:
                address.CustomerId ??
                address.customerId ??
                0,

            AddressType:
                address.AddressType ??
                address.addressType ??
                "",

            City:
                address.City ??
                address.city ??
                "",

            IsDefault:
                address.IsDefault ??
                address.isDefault ??
                false
        })
    );


    // ============================================================
    // STATISTICS
    // ============================================================

    const totalAddresses =
        normalizedAddresses.length;


    const defaultAddresses =
        normalizedAddresses.filter(
            address => Boolean(address.IsDefault)
        ).length;


    const nonDefaultAddresses =
        totalAddresses - defaultAddresses;


    const citiesCovered =
        new Set(
            normalizedAddresses
                .map(address =>
                    address.City?.trim()
                )
                .filter(Boolean)
        ).size;


    // ============================================================
    // STATISTICS CARDS
    // ============================================================

    const statistics = [
        {
            title: "Total Addresses",
            value: totalAddresses,
            icon: (
                <Home
                    fontSize="large"
                />
            ),
            color: "primary"
        },
        {
            title: "Default Addresses",
            value: defaultAddresses,
            icon: (
                <Star
                    fontSize="large"
                />
            ),
            color: "success"
        },
        {
            title: "Other Addresses",
            value: nonDefaultAddresses,
            icon: (
                <LocationOn
                    fontSize="large"
                />
            ),
            color: "warning"
        },
        {
            title: "Cities Covered",
            value: citiesCovered,
            icon: (
                <Public
                    fontSize="large"
                />
            ),
            color: "info"
        }
    ];


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <Grid
            container
            spacing={3}
            sx={{
                mb: 3
            }}
        >

            {statistics.map(
                (item, index) => (

                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={3}
                        key={index}
                    >

                        <Card
                            elevation={3}
                            sx={{
                                borderRadius: 2,
                                height: "100%",
                                transition: "0.3s",

                                "&:hover": {
                                    transform:
                                        "translateY(-4px)",
                                    boxShadow: 6
                                }
                            }}
                        >

                            <CardContent>

                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >

                                    {/* =================================
                                        TEXT
                                    ================================= */}

                                    <div>

                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                        >
                                            {item.title}
                                        </Typography>

                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                        >
                                            {item.value}
                                        </Typography>

                                    </div>


                                    {/* =================================
                                        ICON
                                    ================================= */}

                                    <Stack
                                        color={`${item.color}.main`}
                                    >
                                        {item.icon}
                                    </Stack>

                                </Stack>

                            </CardContent>

                        </Card>

                    </Grid>

                )
            )}

        </Grid>
    );
};


export default CustomerAddressStatistics;