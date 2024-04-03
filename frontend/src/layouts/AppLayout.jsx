import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Grid,
  GridItem,
  Show,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet, useSearchParams } from 'react-router-dom';

import Navbar from '../components/Navbar';
import useAuth from '../auth/useAuth';
import CheckEmail from '../pages/CheckEmail';
import { successToast } from '../toasts';

const drawerBreakPoint = 'lg';

function AppLayout({ navigation }) {
  const { currentUser } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchParams, setSearchParams] = useSearchParams();
  const btnRef = useRef();

  useEffect(() => {
    if (currentUser?.isVerified && searchParams.has('verify-success')) {
      toast(
        successToast(
          'Congratulations!',
          'Your account has been successfully verified'
        )
      );
      searchParams.delete('verify-success');
      setSearchParams(searchParams);
    }
  }, []);

  if (!currentUser.isVerified) {
    return <CheckEmail />;
  }

  return (
    <Box height="100vh">
      <Grid templateRows="auto 1fr 10vh" gap={1} height="100%">
        <GridItem
          borderBottom="1px solid lightgrey"
          boxShadow="2px 1px 1px 1px lightgrey"
        >
          <Navbar onSidebarButtonClick={onOpen} ref={btnRef} />
        </GridItem>
        <GridItem overflow='auto' position='relative'>
          <Flex height="100%">
            <Show below={drawerBreakPoint}>
              <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerCloseButton />

                  <DrawerBody>
                    <Sidebar onClose={onClose} navigation={navigation} />
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Show>
            <Show above={drawerBreakPoint}>
              <Box
                borderRight="1px solid lightgreen"
                paddingLeft="2rem"
                paddingTop="1.5rem"
                width="320px"
                marginRight="0.5rem"
                height="100%"
                position='absolute'
                bg='white'
                zIndex={1}
              >
                <Sidebar onClose={onClose} navigation={navigation} />
              </Box>
            </Show>
            <Box flex={1} marginLeft="0.5rem" height="100%" ml={{[drawerBreakPoint]:"320px"}} overflow='auto'>
              <Outlet />
            </Box>
          </Flex>
        </GridItem>
        <GridItem
          bg="#123524 "
          color="slategrey"
          fontSize="0.8rem"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          &copy;2023 Agripoint Initiatives Limited.
          &nbsp;&nbsp;&nbsp;&nbsp;Privacy Policy &nbsp;&nbsp;&nbsp;&nbsp;Terms
          of Service
        </GridItem>
      </Grid>
    </Box>
  );
}
export default AppLayout;
