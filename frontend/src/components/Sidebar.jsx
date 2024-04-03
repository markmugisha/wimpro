import { Box, Flex, Image, List, ListItem } from '@chakra-ui/react';
import { NavLink } from './Link';

import Flowervase from '../assets/images/flower-vaze.jpg';

function Sidebar({ onClose, navigation }) {
  return (
    <Flex flexDirection="column" gap={12}>
      <List spacing={4} mx={5}>
        {navigation.map(({ text, path, icon }) => (
          <ListItem key={path}>
            <NavLink
              to={path}
              icon={icon}
              fontFamily="Inter, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
              fontWeight="normal"
              fontSize="1rem"
              variant="none"
              justifyContent="flex-start"
              _hover={{ borderBottom: '1px solid #ffbf00' }}
              onClose={onClose}
            >
              {text}
            </NavLink>
          </ListItem>
        ))}
      </List>
      <Box
        w="200px"
        h="auto"
        position="relative"
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin="20px auto"
      >
        <Image
          src={Flowervase}
          alt="flower vase"
          w="70%"
          h="70%"
          objectFit="contain"
        />
      </Box>
    </Flex>
  );
}
export default Sidebar;
