import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
} from '@chakra-ui/react';
import { Link } from '../components/Link';
// import maizeVideo from '../assets/videos/maize_video.mp4';
import wimage2 from '../assets/images/wimage2.jpg';
import Navbar_bare from '../components/Navbar_bare';

function Home() {
  return (
    <Box height="100vh">
      <Grid templateRows="auto 1fr 10vh" gap={1} height="100%">
        <GridItem
          borderBottom="1px solid green"
          boxShadow="2px 1px 1px 1px lightgrey"
        >
          <Navbar_bare />
        </GridItem>

        <GridItem>
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap={10}
            maxHeight="90vh"
            mt="3rem"
            padding="30px"
          >
            <GridItem w="100%" maxH="90vh">
              <Center>
                <Text
                  fontSize="1.5rem"
                  fontWeight="extrabold"
                  textAlign="center"
                  width="25rem"
                >
                  Integrate your Warehouse and Inventory Management
                </Text>
              </Center>
              <Center>
                <Text
                  fontSize="1rem"
                  color="gray.500"
                  // fontWeight="extrabold"
                  textAlign="center"
                  width="25rem"
                >
                  Welcome to a world of transformation and optimization, where
                  integrated warehouse and inventory management hold the key to
                  streamlining your operations and simplifying your success. Our
                  innovative platform empowers your business like never before,
                  elevating efficiency and unlocking true potential. Experience
                  the seamless synergy of inventory management and warehouse
                  optimization.
                </Text>
              </Center>
              <Flex mt="20px" justifyContent="center" alignContent="center">
                <Link to="login">
                  <Button
                    type="button"
                    width="90px"
                    borderRadius="20px"
                    boxShadow="5px 5px 5px 1px lightgrey"
                    backgroundColor="green.500"
                    color="white"
                    fontWeight="light"
                    _hover={{
                      backgroundColor: 'gray.50',
                      color: '#7b3f00',
                      transition: 'all .4s ease-in-out',
                    }}
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="create-organization">
                  <Button
                    ml="20px"
                    type="button"
                    width="190px"
                    borderRadius="20px"
                    boxShadow="5px 5px 5px 1px lightgrey"
                    backgroundColor="green.500"
                    color="white"
                    fontWeight="light"
                    _hover={{
                      backgroundColor: 'gray.50',
                      color: '#7b3f00',
                      transition: 'all .4s ease-in-out',
                    }}
                  >
                    Create Organization
                  </Button>
                </Link>
              </Flex>
            </GridItem>

            <GridItem w="100%" maxH="90vh" pl="20">
              <Image
                src={wimage2}
                boxSize="sm"
                width="auto"
                _hover={{
                  opacity: 0.8,
                  // transition: 'all .6s ease-in-out',
                  WebkitAnimation: 'shine .75s',
                  animation: 'shine .75s',
                }}
              />
            </GridItem>
          </Grid>
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
export default Home;
