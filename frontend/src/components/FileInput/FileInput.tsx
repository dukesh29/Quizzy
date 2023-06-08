import React, { useRef, useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  error?: boolean;
  value?: File | null;
  isRegister?: boolean;
}

const FileInput: React.FC<Props> = ({ onChange, name, label, error, value, isRegister }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState('');
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFilename(e.target.files[0].name);
    } else {
      setFilename('');
    }
    onChange(e);
  };

  const activateInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <input
        style={{ display: 'none' }}
        type="file"
        name={name}
        onChange={onFileChange}
        ref={inputRef}
        accept=".jpg, .jpeg, .png"
      />
      <Grid container direction="row" spacing={2} alignItems="center">
        <Grid item xs>
          <TextField
            error={error}
            fullWidth
            disabled
            label={label}
            value={value || filename}
            onClick={activateInput}
            color="secondary"
          />
        </Grid>
        <Grid item>
          <Button
            variant="text"
            sx={{ color: isRegister ? 'white' : '#776BCC' }}
            onClick={activateInput}
          >
            <SendIcon />
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FileInput;
