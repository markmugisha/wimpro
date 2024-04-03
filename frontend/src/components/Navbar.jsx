import { forwardRef } from 'react';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
} from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { AiOutlineMenu } from 'react-icons/ai';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import useAuth from '../auth/useAuth';
import { logOut } from '../api/client';
import logo from '../assets/green_logo.png';

const roleToHeaderDisplay = {
  sys_admin: 'System Admin',
  receiving: 'Receiving Station',
  weigh_bridge: 'Weigh Bridge',
  quality_assessment: 'Quality Assessment',
  production: 'Production Management',
  store_management: 'Store Management',
  picking_packing: 'Picking & Packing',
  shipping: 'Shipping',
  sales: 'Order Processing',
  sales_management: 'Sales',
};

const Navbar = forwardRef(function Navbar({ onSidebarButtonClick }, ref) {
  const { setCurrentUser, currentUser } = useAuth();
  const navigate = useNavigate();

  const logOutMutation = useMutation(() => logOut(), {
    onSuccess() {
      setCurrentUser(null);
      navigate('/');
    },
  });

  const handleLogoutClick = () => {
    logOutMutation.mutate();
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <Flex p={2} alignItems="center">
      <Box>
        <Image src={logo} w="35.5%" py={0} ml={5} onClick={handleLogoClick} />
      </Box>
      <Heading fontSize="1.2rem" fontWeight="semibold" color="gray.600">
        {roleToHeaderDisplay[currentUser.roles[0].code] ||
          currentUser.roles[0].name}
      </Heading>
      <Spacer />
      <IconButton
        ref={ref}
        icon={<AiOutlineMenu />}
        onClick={onSidebarButtonClick}
        variant="ghost"
        display={{ lg: 'none' }}
        size="md"
        color="black"
        _hover={{}}
        _active={{}}
      />
      <Menu>
        <MenuButton
          as={Avatar}
          color="white"
          backgroundColor="gray.200"
          size="sm"
          cursor="pointer"
          _hover={{ backgroundColor: 'green.200' }}
          _active={{}}
        ></MenuButton>
        <MenuList boxShadow="5px 5px 3px 1px lightgrey">
          <MenuItem fontSize="0.9rem" onClick={handleLogoutClick}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
});

export default Navbar;
