import './App.css';
import {
  Alert,
  Box,
  Button,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faRightLong,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import { bulkData } from '../services/json-to-bulk';

export const App = () => {
  const [activeToast, setActiveToast] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [arrowAnimation, setArrowAnimation] = useState(false);

  const jsonRef = useRef(null);
  const bulkRef = useRef(null);

  const openToast = (msg, severity) => {
    setMessage(msg);
    setSeverity(severity);
    setActiveToast(true);
  };

  const closeToast = () => {
    setActiveToast(close);
    setTimeout(() => {
      setMessage('');
      setSeverity('');
    }, 500);
  };

  const clearJson = () => {
    jsonRef.current.value = '';
    bulkRef.current.value = '';
    jsonRef.current.focus();
  };

  const copyToClipboard = () => {
    if (bulkRef.current.value.length > 0) {
      navigator.clipboard.writeText(bulkRef.current?.value);
      bulkRef.current.select();
      openToast('Copiado al portapapeles con éxito.', 'success');
    } else {
      openToast('No hay valores por copiar.', 'error');
    }
  };

  const jsonToBulk = () => {
    if (jsonRef.current.value.length > 0) {
      try {
        const object = JSON.parse(jsonRef.current?.value);
        const bulkString = bulkData(object);
        bulkRef.current.value = bulkString;
        bulkRef.current.focus();
      } catch (error) {
        openToast('Verifique el formato del JSON.', 'error');
      }
    } else {
      openToast('Debe ingresar un JSON.', 'error');
    }
  };

  const onArrowAnimate = () => {
    setArrowAnimation(true);
  };

  const offArrowAnimate = () => {
    setArrowAnimation(false);
  };

  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'}>
        <Box display={'flex'} alignItems={'center'}>
          <Typography variant='h4' marginRight={'.5em'}>
            JSON
          </Typography>
          <Button color='error' variant='contained' onClick={clearJson}>
            <FontAwesomeIcon size='xl' icon={faTrashCan} />
          </Button>
        </Box>
        <Box display={'flex'} alignItems={'center'}>
          <Typography variant='h4' marginRight={'.5em'}>
            Bulk for Postman
          </Typography>
          <Button color='success' variant='contained' onClick={copyToClipboard}>
            <FontAwesomeIcon size='xl' icon={faCopy} />
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <Box sx={{ width: '45%' }}>
          <TextField
            InputProps={{ sx: { color: 'white' } }}
            inputRef={(input) => (jsonRef.current = input)}
            variant='filled'
            placeholder='{...}'
            multiline
            fullWidth
          ></TextField>
        </Box>
        <Button
          variant='contained'
          color='warning'
          onClick={jsonToBulk}
          onMouseOver={onArrowAnimate}
          onMouseOut={offArrowAnimate}
          sx={{ color: 'white', width: '10%', margin: '1em' }}
        >
          <FontAwesomeIcon
            size='2xl'
            icon={faRightLong}
            beat={arrowAnimation}
          />
        </Button>
        <Box sx={{ width: '45%' }}>
          <TextField
            InputProps={{ readOnly: true, sx: { color: 'white' } }}
            inputRef={(input) => (bulkRef.current = input)}
            variant='filled'
            multiline
            fullWidth
          ></TextField>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={activeToast}
        autoHideDuration={3000}
        onClose={closeToast}
      >
        <Alert onClose={closeToast} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
