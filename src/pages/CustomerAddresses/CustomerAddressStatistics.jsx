import React from "react";
import {Grid,Card,CardContent,Typography,Stack} from "@mui/material";
import {Home,LocationOn,Star,Public} from "@mui/icons-material";

const CustomerAddressStatistics = ({
    addresses = []
}) => {
    const totalAddresses = addresses.length;
    const defaultAddresses = addresses.filter(address => address.IsDefault).length;
    const nonDefaultAddresses = totalAddresses - defaultAddresses;
    const citiesCovered = new Set(addresses.map(item => item.City).filter(Boolean)).size;
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
    return (
        <Grid
            container
            spacing={3}
            sx={{ mb: 3 }}
        >
            {
                statistics.map((item, index) => (
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
                                    <div>
                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                        >
                                            {
                                                item.title
                                            }
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                        >
                                            {
                                                item.value
                                            }
                                        </Typography>
                                    </div>
                                    <Stack
                                        color={
                                            `${item.color}.main`
                                        }
                                    >
                                        {
                                            item.icon
                                        }
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            }
        </Grid>
    );
};

export default CustomerAddressStatistics;