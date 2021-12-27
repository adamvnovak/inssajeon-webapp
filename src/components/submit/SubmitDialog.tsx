import * as React from 'react';
//mui
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { Box, Divider } from '@mui/material';
import { Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

//components
import SubmitForm from './SubmitForm';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { borderColor } from '@mui/system';
import SubmitDialogProfile from './SubmitDialogProfile';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledSubmitDialog = styled(Dialog)(({ theme }) => ({
  [theme.breakpoints.down('tablet')]: {
    marginTop: theme.spacing(12),
  },
  //border:5,
}));

interface SubmitDialogProps {
  open: boolean;
  handleClose: VoidFunction
}

export default function SubmitDialog( {open, handleClose}: SubmitDialogProps ) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('tablet'));

  return (
    <StyledSubmitDialog 
      open={open} 
      onClose={handleClose} 
      TransitionComponent={Transition}
      fullWidth={true}
      maxWidth='tablet'
      fullScreen={fullScreen}
      scroll='paper'
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'center' }} >
        <Typography variant="h2" >
          새 단어 정의하기
        </Typography>
        <IconButton 
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          {fullScreen ? <KeyboardArrowDownIcon sx={{ fontSize: 35 }} /> : <CloseIcon sx={{ fontSize: 35 }} />}
        </IconButton>
      </DialogTitle>
      <Divider/>
      <DialogContent sx={{ p:3,pb:10 }}>
        <SubmitDialogProfile />
        <SubmitForm handleClose={handleClose}/>
      </DialogContent>
    </StyledSubmitDialog>
  )
}
