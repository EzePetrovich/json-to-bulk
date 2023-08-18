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
  faUpLong,
} from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import { bulkData } from '../services/json-to-bulk';

export const App = () => {
  const [activeToast, setActiveToast] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [arrowAnimation, setArrowAnimation] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    jsonRef.current.value = null;
    bulkRef.current.value = null;
    jsonRef.current.focus();
  };

  const copyToClipboard = () => {
    if (bulkRef.current.value.length > 0) {
      navigator.clipboard.writeText(bulkRef.current?.value);
      bulkRef.current.select();
      document.execCommand('copy');
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

  document.body.onscroll = () => {
    if (
      !showScrollTop &&
      window.scrollY > Math.floor(document.documentElement.scrollHeight / 2) !=
        showScrollTop
    ) {
      setShowScrollTop(
        window.scrollY > Math.floor(document.documentElement.scrollHeight / 2)
      );
    } else if (showScrollTop) {
      if (
        window.scrollY < Math.floor(document.documentElement.scrollHeight / 3)
      ) {
        setShowScrollTop(window.scrollY < 100);
      }
    }
  };

  return (
    <>
      <Box
        display={'flex'}
        position={'sticky'}
        bgcolor={'#222'}
        top={0}
        zIndex={99}
        justifyContent={'space-between'}
        padding={'1em'}
        boxShadow={'0 3px 10px #111'}
      >
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
          marginTop: '1em',
          marginBottom: '.5em',
        }}
      >
        <TextField
          InputProps={{
            sx: {
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
          inputRef={(input) => (jsonRef.current = input)}
          variant='filled'
          placeholder='{...}'
          multiline
          fullWidth
        ></TextField>
        <Button
          sx={{ margin: '.5em 1em', width: '15%' }}
          variant='contained'
          color='warning'
          size='medium'
          onClick={jsonToBulk}
          onMouseOver={onArrowAnimate}
          onMouseOut={offArrowAnimate}
        >
          <FontAwesomeIcon
            icon={faRightLong}
            size='2xl'
            beat={arrowAnimation}
          />
        </Button>
        <TextField
          InputProps={{ readOnly: true, sx: { color: 'white' } }}
          inputRef={(input) => (bulkRef.current = input)}
          variant='filled'
          multiline
          fullWidth
        ></TextField>
      </Box>
      <Box
        display={showScrollTop ? 'flex' : 'none'}
        position={'sticky'}
        bottom={0}
        zIndex={99}
        justifyContent={'center'}
        padding={'1em'}
      >
        <Button
          color='primary'
          variant='contained'
          sx={{ width: '30%' }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <FontAwesomeIcon size='2xl' icon={faUpLong} bounce={true} />
        </Button>
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
