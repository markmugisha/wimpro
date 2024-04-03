import { Box, Image, useBreakpointValue } from '@chakra-ui/react';
import white_logo from '../assets/white_logo.png';

const Logo = () => {
  const maxWidth = useBreakpointValue({ base: '40%', md: '20%' });

  return (
    <Box>
      <Image
        src={white_logo}
        alt="Logo"
        maxWidth={maxWidth}
        height="auto"
        objectFit="contain"
      />
    </Box>
  );
};

export default Logo;
