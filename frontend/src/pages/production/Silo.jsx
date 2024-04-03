import { useQuery } from 'react-query';
import { getSilos } from '../../api/client';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Divider,
} from '@chakra-ui/react';

function Silo() {
  const silosQuery = useQuery(['silos'], () => getSilos());

  return (
    <>
      <Box paddingLeft="20px" paddingTop="50px">
        <StatGroup>
          {silosQuery.isSuccess && // Added a conditional check for data before mapping
            silosQuery.data.map((silo, index) => (
              <Stat key={silo.id} mb={5}>
                {!silo.grainType &&
                  console.table({
                    silo,
                    index,
                    silosQueryData: silosQuery.data,
                  })}
                <Box
                  backgroundColor="background-color: #bbf0f3;
                  background-image: linear-gradient(315deg, #bbf0f3 0%, #f6d285 74%);"
                  // color="white"
                  marginRight="1px"
                  p="5px"
                  width="200px"
                  height="100px"
                  // border="solid 1px lightgreen"
                  // boxShadow="3px 3px 1px 1px lightgrey"
                  borderRadius="7px 7px 7px 0"
                >
                  <StatLabel
                    fontSize=".9rem"
                    fontWeight="semibold"
                    paddingLeft="20px"
                  >
                    {silo.grainType.name.toUpperCase()}
                  </StatLabel>
                  <Divider color="#fb8e19" />
                  <StatNumber
                    textAlign="center"
                    marginTop="25px"
                    fontSize="1rem"
                    fontWeight="light"
                  >
                    {Intl.NumberFormat().format(silo.total)} Kg
                  </StatNumber>
                </Box>
              </Stat>
            ))}
        </StatGroup>
      </Box>
    </>
  );
}

export default Silo;
