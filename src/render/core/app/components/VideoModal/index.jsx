import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

const VideoModal = ({ videoId, open, handleClose }) => {
    const style = {
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
    };

    const videoSrc = {
        type: 'video',
        sources: [
            {
                src: videoId,
                provider: 'youtube',
            },
        ],
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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
                        <Plyr source={videoSrc} options={{ autoplay: open }} />
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default VideoModal;