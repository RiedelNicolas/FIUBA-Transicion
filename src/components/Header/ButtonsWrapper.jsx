import { Box } from '@mui/material';
import React from 'react';
import Button from './Button';

function ButtonsWrapper(props) {
    const {limpiar, compartir, readOnly} = props;

    return (
        <Box
            p={2}
            bgcolor="#e19800"
            textAlign="center"
        >
            {readOnly ? 
            <Button
                text="Modo lectura"
                onClick={() => {}}
            />
            :
                <>
                    <Button
                        text="Limpiar todo"
                        onClick={limpiar}
                    />
                </>
            }
            <Button
                text="Compartir"
                onClick={compartir}
            />
        </Box>
    )
}

export default React.memo(ButtonsWrapper);