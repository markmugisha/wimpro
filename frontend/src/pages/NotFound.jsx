import { Box, Flex, Heading } from '@chakra-ui/react';
import { Link } from '../components/Link';

function NotFound() {
  return (
    <Flex
      h="100vh"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Heading>Not Found</Heading>
      <Box>
        <Link to="login">Log into your account</Link>, or{' '}
        <Link to="create-organization">create an organization.</Link>.
      </Box>
    </Flex>
  );
}
export default NotFound;
