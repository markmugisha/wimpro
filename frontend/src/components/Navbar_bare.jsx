import { Box, Flex, IconButton, Image, Spacer } from '@chakra-ui/react';
import { AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai';

import logo from '../assets/green_logo.png';
import { forwardRef } from 'react';
import useAuth from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { logOut } from '../api/client';

const Navbar = forwardRef(function Navbar({ onSidebarButtonClick }, ref) {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const logOutMutation = useMutation(() => logOut(), {
    onSuccess: () => {
      setCurrentUser(null);
      navigate('/login');
    },
  });

  const handleLogoutClick = () => {
    logOutMutation.mutate();
  };

  return (
    <Flex p={2}>
      <Box>
        <Image src={logo} w="35.5%" py={0} ml={5} />
      </Box>
      <Spacer />
    </Flex>
  );
});

export default Navbar;
