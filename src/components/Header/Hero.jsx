import { Box } from '@mui/material';
import { NOMBRE_CARRERA } from '../../config';
import React from 'react';

function Hero() {
    return (
        <Box
            px="1em"
            py="3em"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            color="white"
            sx={{
                background: `url(${import.meta.env.BASE_URL}banner.png)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <h2>Calculadora Plan 2023</h2>
            <h1>{ NOMBRE_CARRERA }</h1>
        </Box>
    )
}

export default React.memo(Hero);