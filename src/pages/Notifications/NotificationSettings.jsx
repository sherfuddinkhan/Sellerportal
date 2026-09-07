// =========================================================
// NotificationSettings.jsx
// =========================================================

import React, { useEffect, useState } from "react";

import axios from "axios";

import {
    Alert,
    Box,
    Paper,
    Typography,
    Divider,
    Switch,
    FormControlLabel,
    Button,
    Grid,
    CircularProgress,
} from "@mui/material";

import {
    Save,
    RestartAlt,
} from "@mui/icons-material";

// =========================================================
// SERVER CONFIGURATION
// =========================================================

const SERVER_URL = "http://localhost:5000";

const NOTIFICATION_SETTINGS_URL =
    `${SERVER_URL}/api/NotificationSettings`;

// =========================================================
// DEFAULT SETTINGS
// =========================================================

const DEFAULT_SETTINGS = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    orderNotifications: true,
    paymentNotifications: true,
    inventoryNotifications: true,
    lowStockNotifications: true,
    customerNotifications: false,
    reportNotifications: false,

    marketingNotifications: false,
};

// =========================================================
// COMPONENT
// =========================================================

const NotificationSettings = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [settings, setSettings] =
        useState(DEFAULT_SETTINGS);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [saved, setSaved] =
        useState(false);

    const [error, setError] =
        useState("");

    // =========================================================
    // LOAD SETTINGS
    // =========================================================

    useEffect(() => {

        const loadSettings = async () => {

            try {

                setLoading(true);
                setError("");

                /*
                 * Try backend first.
                 *
                 * If NotificationSettings endpoint is not
                 * available yet, fall back to localStorage.
                 */

                try {

                    const response = await axios.get(
                        NOTIFICATION_SETTINGS_URL
                    );

                    const data = response.data;

                    if (data) {

                        setSettings({
                            ...DEFAULT_SETTINGS,
                            ...data,
                        });

                        return;
                    }

                } catch (apiError) {

                    console.warn(
                        "Notification settings API unavailable. Using localStorage.",
                        apiError
                    );
                }

                // =================================================
                // LOCAL STORAGE FALLBACK
                // =================================================

                const stored =
                    localStorage.getItem(
                        "notificationSettings"
                    );

                if (stored) {

                    try {

                        const parsed =
                            JSON.parse(stored);

                        setSettings({
                            ...DEFAULT_SETTINGS,
                            ...parsed,
                        });

                    } catch (parseError) {

                        console.error(
                            "INVALID NOTIFICATION SETTINGS:",
                            parseError
                        );

                        setSettings(
                            DEFAULT_SETTINGS
                        );
                    }

                } else {

                    setSettings(
                        DEFAULT_SETTINGS
                    );
                }

            } catch (err) {

                console.error(
                    "LOAD NOTIFICATION SETTINGS ERROR:",
                    err
                );

                setError(
                    "Unable to load notification settings."
                );

            } finally {

                setLoading(false);
            }
        };

        loadSettings();

    }, []);

    // =========================================================
    // HANDLE SWITCH
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            checked,
        } = event.target;

        setSettings((previous) => ({
            ...previous,
            [name]: checked,
        }));

        setSaved(false);
        setError("");
    };

    // =========================================================
    // SAVE SETTINGS
    // =========================================================

    const handleSave = async () => {

        try {

            setSaving(true);
            setSaved(false);
            setError("");

            /*
             * Try saving through backend.
             */

            try {

                await axios.put(
                    NOTIFICATION_SETTINGS_URL,
                    settings
                );

            } catch (apiError) {

                /*
                 * Backend endpoint may not exist yet.
                 * Keep localStorage fallback.
                 */

                console.warn(
                    "Notification settings API unavailable. Saving locally.",
                    apiError
                );

                localStorage.setItem(
                    "notificationSettings",
                    JSON.stringify(settings)
                );
            }

            /*
             * Always keep local copy.
             * This also makes the page work before
             * the backend settings API is implemented.
             */

            localStorage.setItem(
                "notificationSettings",
                JSON.stringify(settings)
            );

            setSaved(true);

        } catch (err) {

            console.error(
                "SAVE NOTIFICATION SETTINGS ERROR:",
                err
            );

            setError(
                "Unable to save notification settings."
            );

        } finally {

            setSaving(false);
        }
    };

    // =========================================================
    // RESET
    // =========================================================

    const handleReset = () => {

        setSettings({
            ...DEFAULT_SETTINGS,
        });

        localStorage.setItem(
            "notificationSettings",
            JSON.stringify(
                DEFAULT_SETTINGS
            )
        );

        setSaved(false);
        setError("");
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >

                <CircularProgress />

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Loading notification settings...
                </Typography>

            </Box>
        );
    }

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <Box
            sx={{
                p: 3,
                width: "100%",
            }}
        >

            {/* =================================================
                PAGE HEADER
               ================================================= */}

            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                Notification Settings
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mb: 3,
                }}
            >
                Manage how and when you receive
                notifications from the Seller Portal.
            </Typography>

            {/* =================================================
                ERROR
               ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                    }}
                    onClose={() =>
                        setError("")
                    }
                >
                    {error}
                </Alert>
            )}

            {/* =================================================
                SUCCESS
               ================================================= */}

            {saved && (
                <Alert
                    severity="success"
                    sx={{
                        mb: 3,
                    }}
                    onClose={() =>
                        setSaved(false)
                    }
                >
                    Notification settings saved
                    successfully.
                </Alert>
            )}

            {/* =================================================
                NOTIFICATION CHANNELS
               ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    Notification Channels
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                    }}
                >
                    Choose how you want to receive
                    notifications.
                </Typography>

                <Divider
                    sx={{
                        mb: 2,
                    }}
                />

                <Grid
                    container
                    spacing={2}
                >

                    {/* EMAIL */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.emailNotifications
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    name="emailNotifications"
                                />
                            }
                            label="Email Notifications"
                        />
                    </Grid>

                    {/* SMS */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.smsNotifications
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    name="smsNotifications"
                                />
                            }
                            label="SMS Notifications"
                        />
                    </Grid>

                    {/* PUSH */}

                    <Grid
                        item
                        xs={12}
                        md={4}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.pushNotifications
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    name="pushNotifications"
                                />
                            }
                            label="Push Notifications"
                        />
                    </Grid>

                </Grid>

            </Paper>

            {/* =================================================
                BUSINESS NOTIFICATIONS
               ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    Business Notifications
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                    }}
                >
                    Select the business events you want
                    to be notified about.
                </Typography>

                <Divider
                    sx={{
                        mb: 2,
                    }}
                />

                <Grid
                    container
                    spacing={2}
                >

                    {/* ORDERS */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.orderNotifications
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    name="orderNotifications"
                                />
                            }
                            label="Order Notifications"
                        />
                    </Grid>

                    {/* PAYMENTS */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.paymentNotifications
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    name="paymentNotifications"
                                />
                            }
                            label="Payment Notifications"
                        />
                    </Grid>

                    {/* INVENTORY */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.inventoryNotifications
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    name="inventoryNotifications"
                                />
                            }
                            label="Inventory Notifications"
                        />
                    </Grid>

                    {/* LOW STOCK */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.lowStockNotifications
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    name="lowStockNotifications"
                                />
                            }
                            label="Low Stock Notifications"
                        />
                    </Grid>

                    {/* CUSTOMER */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.customerNotifications
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    name="customerNotifications"
                                />
                            }
                            label="Customer Notifications"
                        />
                    </Grid>

                    {/* REPORT */}

                    <Grid
                        item
                        xs={12}
                        md={6}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={
                                        settings.reportNotifications
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    name="reportNotifications"
                                />
                            }
                            label="Report Notifications"
                        />
                    </Grid>

                </Grid>

            </Paper>

            {/* =================================================
                MARKETING
               ================================================= */}

            <Paper
                elevation={2}
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                }}
            >

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    Marketing Notifications
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 2,
                    }}
                >
                    Receive promotional offers, product
                    updates and marketplace announcements.
                </Typography>

                <Divider
                    sx={{
                        mb: 2,
                    }}
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={
                                settings.marketingNotifications
                            }
                            onChange={
                                handleChange
                            }
                            name="marketingNotifications"
                        />
                    }
                    label="Marketing & Promotional Notifications"
                />

            </Paper>

            {/* =================================================
                ACTIONS
               ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                }}
            >

                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={
                        <RestartAlt />
                    }
                    onClick={
                        handleReset
                    }
                    disabled={saving}
                >
                    Reset
                </Button>

                <Button
                    variant="contained"
                    startIcon={
                        saving
                            ? <CircularProgress
                                size={18}
                                color="inherit"
                            />
                            : <Save />
                    }
                    onClick={
                        handleSave
                    }
                    disabled={saving}
                >
                    {saving
                        ? "Saving..."
                        : "Save Settings"}
                </Button>

            </Box>

        </Box>
    );
};

export default NotificationSettings;
