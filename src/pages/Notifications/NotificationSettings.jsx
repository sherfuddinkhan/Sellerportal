import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Divider,
    Switch,
    FormControlLabel,
    Button,
    Grid,
    Alert,
} from "@mui/material";

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
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
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (event) => {
        const { name, checked } = event.target;

        setSettings((prev) => ({
            ...prev,
            [name]: checked,
        }));

        setSaved(false);
    };

    const handleSave = () => {
        // Save to localStorage for now.
        // Replace this with an API call when your backend is ready.
        localStorage.setItem(
            "notificationSettings",
            JSON.stringify(settings)
        );

        setSaved(true);
    };

    const handleReset = () => {
        const defaultSettings = {
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

        setSettings(defaultSettings);
        localStorage.setItem(
            "notificationSettings",
            JSON.stringify(defaultSettings)
        );

        setSaved(false);
    };

    return (
        <Box sx={{ p: 3 }}>
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
                sx={{ mb: 3 }}
            >
                Manage how and when you receive notifications from the
                Seller Portal.
            </Typography>

            {saved && (
                <Alert
                    severity="success"
                    sx={{ mb: 3 }}
                    onClose={() => setSaved(false)}
                >
                    Notification settings saved successfully.
                </Alert>
            )}

            {/* Notification Channels */}
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
                    sx={{ mb: 2 }}
                >
                    Choose how you want to receive notifications.
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.emailNotifications}
                                    onChange={handleChange}
                                    name="emailNotifications"
                                />
                            }
                            label="Email Notifications"
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.smsNotifications}
                                    onChange={handleChange}
                                    name="smsNotifications"
                                />
                            }
                            label="SMS Notifications"
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.pushNotifications}
                                    onChange={handleChange}
                                    name="pushNotifications"
                                />
                            }
                            label="Push Notifications"
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Business Notifications */}
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
                    sx={{ mb: 2 }}
                >
                    Select the business events you want to be notified about.
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.orderNotifications}
                                    onChange={handleChange}
                                    name="orderNotifications"
                                />
                            }
                            label="Order Notifications"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.paymentNotifications}
                                    onChange={handleChange}
                                    name="paymentNotifications"
                                />
                            }
                            label="Payment Notifications"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.inventoryNotifications}
                                    onChange={handleChange}
                                    name="inventoryNotifications"
                                />
                            }
                            label="Inventory Notifications"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.lowStockNotifications}
                                    onChange={handleChange}
                                    name="lowStockNotifications"
                                />
                            }
                            label="Low Stock Notifications"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.customerNotifications}
                                    onChange={handleChange}
                                    name="customerNotifications"
                                />
                            }
                            label="Customer Notifications"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={settings.reportNotifications}
                                    onChange={handleChange}
                                    name="reportNotifications"
                                />
                            }
                            label="Report Notifications"
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Marketing */}
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
                    sx={{ mb: 2 }}
                >
                    Receive promotional offers, product updates and
                    marketplace announcements.
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <FormControlLabel
                    control={
                        <Switch
                            checked={settings.marketingNotifications}
                            onChange={handleChange}
                            name="marketingNotifications"
                        />
                    }
                    label="Marketing & Promotional Notifications"
                />
            </Paper>

            {/* Actions */}
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
                    onClick={handleReset}
                >
                    Reset
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                >
                    Save Settings
                </Button>
            </Box>
        </Box>
    );
};

export default NotificationSettings;