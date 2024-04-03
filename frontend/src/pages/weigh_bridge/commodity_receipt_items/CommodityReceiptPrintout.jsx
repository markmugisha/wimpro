import {
  Box,
  Container,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Stack,
  Input,
  Button,
  Flex,
} from '@chakra-ui/react';

const coStyles = {
  width: '100%',
  variant: 'outline',
  focusBorderColor: 'white',
  focusShadow: 'none',
  css: {
    border: '0px',
    outline: 'none',
  },
};

function CommodityReceiptPrintout({ commodityReceipt }) {
  return (
    <Container m="0" p="50px" maxW="6xl">
      <Flex marginBottom="1rem" justifyContent={'left'}>
        <Box textAlign="left">
          <Text sx={coStyles}>Aponye U Limited</Text>
          <Text sx={coStyles}>Dealers in Agri produce</Text>
          <Text sx={coStyles}>Plot 6 Wankulukuku - Kitebi Road</Text>
          <Text sx={coStyles}>aponye@gmail.com</Text>
        </Box>
      </Flex>

      <Stack>
        <TableContainer borderWidth="1px" borderColor="gray.800">
          <Table size="sm">
            <Tbody>
              <Tr>
                <Td
                  colSpan="8"
                  fontSize="1.5rem"
                  fontWeight="semibold"
                  textAlign="center"
                  borderColor="gray.500"
                >
                  COMMODITY RECEIPT
                </Td>
              </Tr>
              <Tr>
                <Td colSpan="8" v borderColor="gray.500"></Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" colSpan="1" borderColor="gray.500">
                  Supplier:
                </Td>
                <Td colSpan="7" borderColor="gray.500">
                  {commodityReceipt.receivedProduct.supplier.name}{' '}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" borderColor="gray.500">
                  LotID:
                </Td>
                <Td borderColor="gray.500">{commodityReceipt.lotId}</Td>
                <Td fontWeight="semibold" borderColor="gray.500">
                  Date:
                </Td>
                <Td borderColor="gray.500">{commodityReceipt.dateCreated}</Td>
                <Td fontWeight="semibold" borderColor="gray.500">
                  Store/Branch:
                </Td>
                <Td borderColor="gray.500">get branch</Td>
                <Td borderColor="gray.500"></Td>
                <Td borderColor="gray.500"></Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" borderColor="gray.500">
                  Issued by:
                </Td>
                <Td colSpan="3" borderColor="gray.500">
                  username
                </Td>
                <Td fontWeight="semibold" borderColor="gray.500">
                  Produce Type:
                </Td>
                <Td borderColor="gray.500">
                  {commodityReceipt.receivedProduct.grainType.name}
                </Td>
                <Td fontWeight="semibold" borderColor="gray.500">
                  Vehicle No.:
                </Td>
                <Td borderColor="gray.500">get no.</Td>
              </Tr>
              <Tr>
                <Td colSpan="8" borderColor="gray.500"></Td>
              </Tr>
              <Tr>
                <Td borderColor="gray.500"></Td>
                <Td fontWeight="semibold" colSpan="3" borderColor="gray.500">
                  WEIGHTS
                </Td>
                <Td borderColor="gray.500"></Td>
                <Td fontWeight="semibold" colSpan="3" borderColor="gray.500">
                  DEDUCTIONS
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" borderColor="gray.500">
                  Weight 1 (Kgs):
                </Td>
                <Td borderColor="gray.500">{commodityReceipt.firstMass}</Td>
                <Td fontWeight="semibold" borderColor="gray.500">
                  Date:
                </Td>
                <Td borderColor="gray.500">first mass date</Td>
                <Td borderColor="gray.500"></Td>
                <Td colSpan="3" borderColor="gray.500">
                  {commodityReceipt.deductions}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" borderColor="gray.500">
                  Weight 2 (Kgs):
                </Td>
                <Td borderColor="gray.500">{commodityReceipt.secondMass}</Td>
                <Td fontWeight="semibold" borderColor="gray.500">
                  Date:
                </Td>
                <Td borderColor="gray.500">2nd mass date if any</Td>
                <Td borderColor="gray.500"></Td>
                <Td borderColor="gray.500"></Td>
                <Td borderColor="gray.500"></Td>
                <Td borderColor="gray.500"></Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" borderColor="gray.500">
                  Gross Weight (Kgs):
                </Td>
                <Td colSpan="2" borderColor="gray.500">
                  {commodityReceipt.grossWeight}
                </Td>
                {/* <Td>25.4</Td> */}
                <Td borderColor="gray.500"></Td>
                <Td fontWeight="semibold" borderColor="gray.500">
                  Net Weight (Kgs):
                </Td>
                <Td colSpan="3" borderColor="gray.500">
                  {commodityReceipt.netWeight}
                </Td>
              </Tr>
              <Tr>
                <Td colSpan="8" borderColor="gray.500"></Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" isNumeric borderColor="gray.500">
                  Notes:
                </Td>
                <Td colSpan="7" borderColor="gray.500">
                  <Input></Input>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Flex justifyContent="center">
          <Button
            height="40px"
            maxW="sm"
            width="300px"
            borderRadius="2px 10px 0 10PX"
            boxShadow="5px 5px 5px 1px lightgrey"
            backgroundColor="green.500"
            color="white"
            fontWeight="light"
            onClick={() => window.print()}
          >
            Print Receipt
          </Button>
        </Flex>
      </Stack>

      {/* <Text sx={styles.text}>
          {commodityReceipt.receivedProduct.qaDatum.moistureContent}
        </Text> */}
    </Container>
  );
}
export default CommodityReceiptPrintout;
