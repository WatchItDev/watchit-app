// REACT IMPORTS
import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';

// MUI IMPORTS
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// THIRD PARTY IMPORTS
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

// ----------------------------------------------------------------------
// MAIN COMPONENT

const VideoModal = ({ videoId, open, handleClose }) => {
    const [key, setKey] = useState(0);

    const style = useMemo(() => ({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '1rem',
        maxHeight: '90%',
        overflow: 'hidden',
    }), []);

    const videoSrc = useMemo(() => ({
        type: 'video',
        sources: [
            {
                src: videoId,
                provider: 'youtube',
            },
        ],
    }), [videoId]);

    const handleModalClose = useCallback(() => {
        handleClose();
    }, [handleClose]);

    const handleRetry = () => {
        setKey(prevKey => prevKey + 1); // This will force a re-render of plyr if there is an error
    };

    useEffect(() => {
        const player = document.querySelector('.plyr__video-embed');
        if (player) {
            player.addEventListener('error', handleRetry);
        }
        return () => {
            if (player) {
                player.removeEventListener('error', handleRetry);
            }
        };
    }, [key]);

    return (
        <Modal
            open={open}
            onClose={handleModalClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={handleModalClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Box sx={{ position: 'relative', paddingTop: '56.25%', height: '90%' }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Plyr key={key} source={videoSrc} options={{ autoplay: true }} />
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

// ----------------------------------------------------------------------

export default memo(VideoModal);
