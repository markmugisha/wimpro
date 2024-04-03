import { Link as RouterLink, NavLink as RouterNavLink } from 'react-router-dom';
import { Button, Link as ChakraLink } from '@chakra-ui/react';

function Link({ to, children }) {
  return (
    <ChakraLink
      as={RouterLink}
      to={to}
      color="blue.500"
      _visited={{ color: 'purple.600' }}
    >
      {children}
    </ChakraLink>
  );
}

// function NavLink({ to, children }) {
//   return (
//     <ChakraLink
//       as={RouterLink}
//       to={to}
//       display="block"
//       w="full"
//       p={2}
//       borderRadius={5}
//       _hover={{ textDecoration: 'none', color: 'black', bg: 'white' }}
//     >
//       <Flex alignItems='center' gap={2}>{children}</Flex>
//     </ChakraLink>
//   );
// }

function NavLink({ to, children, icon, onClose, ...rest }) {
  return (
    <Button
      as={RouterNavLink}
      to={to}
      end={true}
      leftIcon={icon}
      w="full"
      variant="ghost"
      justifyContent="flex-start"
      _hover={{ border: '1px solid #ffbf00' }}
      _activeLink={{
        border: '0.5px solid lightgreen',
        // borderTop: '0.5px solid lightgreen',
        fontWeight: 'semibold',
      }}
      onClick={onClose}
      fontWeight="normal"
      fontSize="md"
      {...rest}
    >
      {children}
    </Button>
  );
}

export { Link, NavLink };
