import React from 'react';
import { Box } from '@mui/material';

export default function Futuristic3DBackground() {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                background: 'radial-gradient(circle at 60% 40%, #00e6ff33 0%, #0a0a0a 80%)',
                animation: 'bgPulse 8s infinite alternate',
                '@keyframes bgPulse': {
                    from: { filter: 'blur(0px)' },
                    to: { filter: 'blur(8px)' },
                },
            }}
        />
    );
} 