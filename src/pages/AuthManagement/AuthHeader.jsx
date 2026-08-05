import React from "react";
import {AppBar,Avatar,Box,Stack,Toolbar,Typography} from "@mui/material";
import {Storefront} from "@mui/icons-material";
import "./AuthManagement.css";
const AuthHeader = ({title = "Seller Portal",subtitle = "Authentication Management",logo,showLogo = true}) => {
    return (
        <AppBar
            position="static"
            elevation={0}
            color="transparent"
            sx={{
                background: "transparent",
                boxShadow: "none"
            }}
        >
            <Toolbar
                sx={{
                    justifyContent: "center",
                    py: 2
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                >
                    {

                        showLogo && ( logo ?
                    <Avatar src={logo} alt="Logo"
                                    sx={{
                                        width: 60,
                                        height: 60
                                    }}
                                />
                                :
                                <Avatar
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        bgcolor: "primary.main"
                                    }}
                                >
                                    <Storefront
                                        fontSize="large"
                                    />

                                </Avatar>

                        )

                    }

                    <Box>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            color="primary"
                        >

                            {title}

                        </Typography>

                        {

                            subtitle &&

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >

                                {subtitle}

                            </Typography>

                        }

                    </Box>

                </Stack>

            </Toolbar>

        </AppBar>

    );

};

export default AuthHeader;