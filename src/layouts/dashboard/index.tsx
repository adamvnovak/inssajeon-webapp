import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, DialogTitle, FormGroup, Fab, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
// hooks
import useCollapseSidebar from '../../hooks/useCollapseSidebar';
import useResponsive from 'src/hooks/useResponsive';
//components
import DialogAnimate from 'src/components/animate/DialogAnimate'
// config
import {
  SIDEBAR_WIDTH,
  NAVBAR_HEIGHT,
} from '../../config';
//
import Navbar from './navbar';
import Sidebar from './sidebar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('desktop')]: {
    marginRight: SIDEBAR_WIDTH,
  },
}));

const MainStyle = styled('main')(({ theme }) => ({
  flexGrow: 1,
  paddingTop: NAVBAR_HEIGHT + 10,
  paddingBottom: 0,
}));

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------


export default function DashboardLayout() {
  const { isCollapse } = useCollapseSidebar();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const isDesktop = useResponsive('up', 'desktop');

  const handleAddPost = () => {
    setIsOpenModal(true)
  };
  
  const handleCloseModal = () => {
    setIsOpenModal(false)
  };

  return (
    <RootStyle>
      {/* <Container maxWidth={isDesktop && 'tabletxdesktop'} sx={{position:'absolute'} width}> */}
        <Container maxWidth={'tablet'} >
          <Navbar onOpenSidebar={() => setOpen(true)} />
          <Sidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
          <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
            <DialogTitle>{'Add Post'}</DialogTitle>
            <FormGroup
            />
          </DialogAnimate>
          <MainStyle>
            <Outlet />
            <Box sx={{display: 'flex', flexDirection: 'row-reverse', position:'sticky', bottom: 30}}>
              <Fab  sx={{marginRight:5, }} color="primary" aria-label="입력하기" onClick={handleAddPost}>
                <EditIcon />
              </Fab>
            </Box>
          </MainStyle>
        {/* </Container> */}
      </Container>
    </RootStyle>
  );
}
