import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getSettings, saveSettings } from '../utils/Utils';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial',
    },
});

const SettingsFormImpl = (props: {}) => {
    const [formData, setFormData] = useState<SettingsModel>({ scriptHubPath: '' });

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            ...getSettings("settings.json")
        }));
    }, []);

    const handleScriptHubPathChange = (event: { target: any; }) => {
        setFormData((prevData) => ({
            ...prevData,
            scriptHubPath: event.target.value
        }));
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        saveSettings(formData, "settings.json");
    };

    return (
        <>
            <ThemeProvider theme={theme}>
                <Container maxWidth="sm">
                    <Paper className="settings-card" elevation={3} sx={{ p: 4, mt: 4 }}>
                        <Typography variant="h5" gutterBottom>Settings</Typography>
                        <Box className="settings-form" component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="ScriptHub"
                                name="scriptHub"
                                value={formData.scriptHubPath}
                                onChange={handleScriptHubPathChange}
                                fullWidth
                                required
                            />
                            <Button type="submit" variant="contained" color="primary">Save Settings</Button>
                        </Box>
                    </Paper>
                </Container>
            </ThemeProvider>
        </>
    );
}

export const SettingsForm = SettingsFormImpl;
