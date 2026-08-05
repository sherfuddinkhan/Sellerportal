import React from "react";
import {Box,Divider,Link,Stack,Typography} from "@mui/material";

const AuthFooter = ({companyName = "Seller Portal",version = "v1.0.0",year = new Date().getFullYear(),showLinks = true
}) => {
    return (
        <Box
            component="footer"
            sx={{
                mt: 5,
                pt: 3
            }}
        >
            <Divider sx={{ mb: 3 }} />
            <Stack
                spacing={2}
                alignItems="center"
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                >
                    © {year} {companyName}. All Rights Reserved.
                </Typography>
                {
                    showLinks &&
                    <Stack
                        direction="row"
                        spacing={3}
                    >
                        <Link
                            href="/privacy-policy"
                            underline="hover"
                            color="inherit"
                            variant="body2"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            underline="hover"
                            color="inherit"
                            variant="body2"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/support"
                            underline="hover"
                            color="inherit"
                            variant="body2"
                        >
                            Support
                        </Link>
                        <Link
                            href="/contact"
                            underline="hover"
                            color="inherit"
                            variant="body2"
                        >
                            Contact
                        </Link>
                    </Stack>
                }
                <Typography
                    variant="caption"
                    color="text.secondary"
                    align="center"
                >
                    Secure Authentication Management System

                </Typography>

                <Typography
                    variant="caption"
                    color="text.secondary"
                >

                    Version {version}

                </Typography>

            </Stack>

        </Box>

    );

};

export default AuthFooter;