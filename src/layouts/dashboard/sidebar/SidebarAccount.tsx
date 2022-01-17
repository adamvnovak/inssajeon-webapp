// @mui
import { Avatar, Badge, Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_PATHS } from 'src/routing/paths';
import useAuth from '../../../hooks/useAuth';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

export default function SidebarAccount( ) {
  const {authedUser, logout} = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('autheduser change detected')
  }, [navigate])

  let handleLogout = async () => {
    await logout();
    //navigate(PAGE_PATHS.auth.login);
  }
  return (
    <Box sx={{pt: 3, pb: 2, px: 2.5,flexShrink: 0, }}>
        {authedUser ? 
          <RootStyle>
            <Box sx={{ml: 2, width: '100%',display:'flex', justifyContent:'space-between' }}>
              <Badge overlap="circular" badgeContent={0} color="error">
                <Avatar src={authedUser.nonauth.profile.picPath} alt={authedUser.nonauth.profile.username}/>
              </Badge>
              <Typography sx={{ml:2}} variant="subtitle1" noWrap>{authedUser.nonauth.profile.username}</Typography>
            </Box>
            <Button onClick={handleLogout}>
              <Typography variant="body2"  sx={{ color: 'text.secondary' }}>내 프로필</Typography>  
            </Button>
          </RootStyle>
          :
            <RootStyle>
              <Avatar src={""} alt={"guest"}/>
              <Box sx={{ml: 2, width: '100%',display:'flex', justifyContent:'space-between' }}>
                <Button onClick={() => navigate(PAGE_PATHS.auth.signup) }>
                  <Typography variant="h4" noWrap sx={{ color: 'text.secondary' }}>
                    가입하기
                  </Typography>  
                </Button>
              </Box>
            </RootStyle>
          }
    </Box>

  );
}
