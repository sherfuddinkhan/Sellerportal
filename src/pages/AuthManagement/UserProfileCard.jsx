import React from "react";

import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";

import {
    AccountCircle,
    Badge,
    Business,
    CalendarMonth,
    Email,
    Person,
    Phone,
    VerifiedUser
} from "@mui/icons-material";

const UserProfileCard = ({

    user = {}

}) => {

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return (

        <Card
            elevation={4}
            sx={{
                borderRadius: 3
            }}
        >

            <CardContent>

                <Stack
                    spacing={2}
                    alignItems="center"
                    mb={4}
                >

                    <Avatar
                        src={user.profileImage}
                        sx={{
                            width: 90,
                            height: 90,
                            bgcolor: "primary.main",
                            fontSize: 36
                        }}
                    >

                        {

                            fullName

                                ?

                                fullName.charAt(0).toUpperCase()

                                :

                                <AccountCircle />

                        }

                    </Avatar>

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >

                        {

                            fullName ||

                            "User"

                        }

                    </Typography>

                    <Chip

                        color="primary"

                        icon={<VerifiedUser />}

                        label={

                            user.role ||

                            "User"

                        }

                    />

                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={3}
                >

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Stack spacing={3}>

                            <Box
                                display="flex"
                                gap={2}
                            >

                                <Person color="primary" />

                                <Box>

                                    <Typography
                                        variant="subtitle2"
                                    >

                                        Username

                                    </Typography>

                                    <Typography>

                                        {

                                            user.username ||

                                            "-"

                                        }

                                    </Typography>

                                </Box>

                            </Box>

                            <Box
                                display="flex"
                                gap={2}
                            >

                                <Email color="primary" />

                                <Box>

                                    <Typography
                                        variant="subtitle2"
                                    >

                                        Email

                                    </Typography>

                                    <Typography>

                                        {

                                            user.email ||

                                            "-"

                                        }

                                    </Typography>

                                </Box>

                            </Box>

                            <Box
                                display="flex"
                                gap={2}
                            >

                                <Phone color="primary" />

                                <Box>

                                    <Typography
                                        variant="subtitle2"
                                    >

                                        Phone Number

                                    </Typography>

                                    <Typography>

                                        {

                                            user.phoneNumber ||

                                            "-"

                                        }

                                    </Typography>

                                </Box>

                            </Box>

                            <Box
                                display="flex"
                                gap={2}
                            >

                                <Business color="primary" />

                                <Box>

                                    <Typography
                                        variant="subtitle2"
                                    >

                                        Department

                                    </Typography>

                                    <Typography>

                                        {

                                            user.department ||

                                            "-"

                                        }

                                    </Typography>

                                </Box>

                            </Box>

                        </Stack>

                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >

                        <Stack spacing={3}>

                            <Box
                                display="flex"
                                gap={2}
                            >

                                <Badge color="primary" />

                                <Box>

                                    <Typography
                                        variant="subtitle2"
                                    >

                                        User Id

                                    </Typography>

                                    <Typography>

                                        {

                                            user.id ||

                                            user.userId ||

                                            "-"

                                        }

                                    </Typography>

                                </Box>

                            </Box>

                            <Box
                                display="flex"
                                gap={2}
                            >

                                <VerifiedUser
                                    color="primary"
                                />

                                <Box>

                                    <Typography
                                        variant="subtitle2"
                                    >

                                        Role

                                    </Typography>

                                    <Typography>

                                        {

                                            user.role ||

                                            "-"

                                        }

                                    </Typography>

                                </Box>

                            </Box>

                            <Box
                                display="flex"
                                gap={2}
                            >

                                <CalendarMonth
                                    color="primary"
                                />

                                <Box>

                                    <Typography
                                        variant="subtitle2"
                                    >

                                        Created Date

                                    </Typography>

                                    <Typography>

                                        {

                                            user.createdDate

                                                ?

                                                new Date(
                                                    user.createdDate
                                                ).toLocaleDateString()

                                                :

                                                "-"

                                        }

                                    </Typography>

                                </Box>

                            </Box>

                            <Box
                                display="flex"
                                gap={2}
                            >

                                <VerifiedUser
                                    color="primary"
                                />

                                <Box>

                                    <Typography
                                        variant="subtitle2"
                                    >

                                        Status

                                    </Typography>

                                    <Chip

                                        size="small"

                                        color={
                                            user.status === "Inactive"

                                                ?

                                                "error"

                                                :

                                                "success"
                                        }

                                        label={
                                            user.status ||

                                            "Active"
                                        }

                                    />

                                </Box>

                            </Box>

                        </Stack>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

};

export default UserProfileCard;