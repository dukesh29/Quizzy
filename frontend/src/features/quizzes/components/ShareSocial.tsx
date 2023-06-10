import React from 'react';
import { Button, Tooltip, Popover, Box } from '@mui/material';
import { TelegramShareButton, WhatsappShareButton, WhatsappIcon, TelegramIcon } from 'react-share';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface Props {
  url: string;
  title: string;
}

const ShareButton: React.FC<Props> = ({ url, title }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <Tooltip disableFocusListener title="Поделиться с друзьями">
        <Button
          size="small"
          sx={{ color: '#776BCC', border: '1px solid #776BCC' }}
          onClick={handleClick}
        >
          <ShareIcon color="inherit" />
        </Button>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 1, display: 'flex', gap: '5px' }}>
          <TelegramShareButton url={url} title={title} className="Demo__some-network__share-button">
            <TelegramIcon size={32} round />
          </TelegramShareButton>
          <WhatsappShareButton
            url={url}
            title={title}
            separator="   "
            className="Demo__some-network__share-button"
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
          <ContentCopyIcon
            sx={{
              fontSize: 31,
              color: '#776BCC',
              '&:hover': {
                border: '1px solid #776BCC',
              },
            }}
            onClick={() => navigator.clipboard.writeText(url)}
            color="inherit"
          />
        </Box>
      </Popover>
    </>
  );
};

export default ShareButton;
