import {
  Button,
  Center,
  Flex,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { AiOutlineRight } from 'react-icons/ai';
import checkEmail from '../assets/laptop-email.jpg';
import Navbar_bare from '../components/Navbar_bare';

function CheckEmail() {
  return (
    <>
      <GridItem
        borderBottom="1px solid lightgrey"
        boxShadow="2px 1px 1px 1px lightgrey"
      >
        <Navbar_bare />
      </GridItem>
      <SimpleGrid columns={{ base: 1, lg: 2 }} h="100vh" ml="50px">
        <Center marginRight="50px" marginLeft="50px">
          <Image src={checkEmail} />
        </Center>
        <Flex
          gap={5}
          flexDir="column"
          justifyContent={{ base: 'start', lg: 'center' }}
          alignItems={{ base: 'center', lg: 'flex-start' }}
        >
          <Heading fontSize="24px" color="green.900">
            Email Verification Required
          </Heading>
          <Text fontSize="larger" color="gray.600">
            Please click the link sent to your email for quick account
            verification.
          </Text>
          <Button
            variant="outline"
            size="md"
            color="gray.500"
            rightIcon={<AiOutlineRight />}
          >
            Resend link
          </Button>
        </Flex>
      </SimpleGrid>
    </>
  );
}
export default CheckEmail;
