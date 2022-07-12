import { useMemo, useState, useEffect, useRef } from "react";
import BigNumber from "bignumber.js";
import { useWeb3 } from "./hook/useWeb3";
import { formatNumberString } from "./util/string";
import {
  ChakraProvider,
  Button,
  HStack,
  Box,
  Text,
  Center,
  Badge,
  Link,
  useToast,
  Container,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Code,
  CircularProgress,
} from "@chakra-ui/react";
import theme from "./theme";
// import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import { isPropertyAccessChain, textSpanOverlap } from "typescript";

function App() {
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // VARIABLES
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const {
    web3,
    address,
    accounts,
    connectKardiaChainExtension,
    connectMetamask,
    disconnect,
  } = useWeb3();
  const [balance, setBalance] = useState("");
  const [nodeInfo, setNodeInfo] = useState("");
  const [transCount, setTransCount] = useState("");

  const version = "1.02";
  const pageProperties = {
    appTitle: "KardiaChain Wallet App by Ramiware",
    disclaimer:
      "Note: Version " +
      version +
      " is meant to be used on the KardiaChain Mainnet or Testnet. Using it on other networks may produce unexpected results.",
    connectButtonTxt: "Connect Wallet",
    // imageUrl: "https://picsum.photos/400/300",
    // imageAlt: "Rear view of modern home with pool",
    instructions: "Connect your wallet to get started!",
    footer: "2022 Ramiware - KardiaChain Wallet App Version " + version,
  };

  const connectionError = {
    toastTitle: "Connect",
    toastMsg: "Unable to connect to wallet",
    toastStatus: "error" as const,
  };

  // Chakra Components
  const [popoverOpen, setPopoverOpen] = useState(false);
  const toast = useToast();
  const [toastTitle, setToastTitle] = useState("Connect");
  const [toastMsg, setToastMsg] = useState(
    "Welcome to Ramiware Wallet. Connect your wallet to start."
  );
  const [toastStatus, setToastStatus] = useState("success");
  const [displayToasterFlag, setDisplayToasterFlag] = useState(false);

  const isFirstRender = useRef(true);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // FUNCTIONS
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  // UseEffect
  //
  useEffect(() => {
    if (isFirstRender.current) {
      displayToasterConnected();
      isFirstRender.current = false;
      return;
    }
    console.log("1----------------");
    console.log("useEffect1 [title]: " + toastTitle);
    console.log("useEffect1 [msg]: " + toastMsg);
    console.log("useEffect1 [status]: " + toastStatus);
    console.log("useEffect1 [displayToasterFlag]: " + displayToasterFlag);
    console.log("useEffect1 [address]: " + address);

    if (displayToasterFlag && address.trim().length > 0) {
      handleGetBalance();
      displayToasterConnected();
    }

    if (displayToasterFlag && address.trim().length === 0)
      displayToasterError();
  }, [balance, address, toastTitle, toastMsg, toastStatus]);

  //
  // Connects to chosen wallet
  //
  const handleConnect = async (extension: "KardiaChain" | "Metamask") => {
    // displayToast(toastTitle, toastMsg, toastStatus);
    console.log("App: called handleConnect [extension]: " + extension);
    setBalance("");
    if (extension === "KardiaChain") {
      await connectKardiaChainExtension();

      setupToaster(
        "Connected",
        "Successfully connected to KardiaChain Wallet",
        "success"
      );
    } else if (extension === "Metamask") {
      await connectMetamask();

      setupToaster(
        "Connected",
        "Successfully connected to MetaMask Wallet",
        "success"
      );
    }
    setPopoverOpen(false);
  };

  //
  // Disconnects from wallet
  //
  const handleDisconnect = async () => {
    console.log("Disconnect");
    setNodeInfo("");
    setBalance("");
    setTransCount("");
    await disconnect();
  };

  //
  // Gets the balance of the active wallet
  //
  const handleGetBalance = async () => {
    if (!web3) return;
    const bal = await web3.eth.getBalance(address);
    setBalance(bal);

    let nodeInfo = await web3.eth.getNodeInfo();
    setNodeInfo(nodeInfo);

    let transCount = await web3.eth.getTransactionCount(address);
    setTransCount(transCount + "");
  };

  //
  // Display purposes: formats the balance
  //
  const parsedBalance = useMemo(() => {
    if (balance === "") return "";
    const balanceInKAI = new BigNumber(balance).dividedBy(10 ** 18).toFixed();
    return `${formatNumberString({
      numberString: balanceInKAI,
      suffix: " KAI",
    })}`;
  }, [balance]);

  //
  //
  //
  function setupToaster(_title: string, _msg: string, _status: string) {
    setToastTitle(_title);
    setToastMsg(_msg);
    setToastStatus(_status);
    setDisplayToasterFlag(true);
  }

  //
  //
  //
  const displayToasterError = async () => {
    toast({
      title: connectionError.toastTitle,
      description: connectionError.toastMsg, //`Time ${new Date()}`,
      status: connectionError.toastStatus, //toastStatus === "success" ? "success" : "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  //
  //
  //
  const displayToasterConnected = async () => {
    addToast();
    setDisplayToasterFlag(false);
  };

  //
  //
  //
  const addToast = () => {
    toast({
      title: toastTitle,
      description: toastMsg, //`Time ${new Date()}`,
      status: toastStatus === "success" ? "success" : "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  };

  //
  //
  //
  const openPopover = () => {
    setPopoverOpen(true);
  };

  return (
    <ChakraProvider theme={theme}>
      {/* <Box textAlign="center" fontSize="xl"> */}
      {/* <Grid minH="10vh" p={3}> */}
      <Center>
        <VStack>
          <Box marginTop={20}>
            <Text fontWeight={"semibold"} fontSize="xl">
              {pageProperties.appTitle}
            </Text>
          </Box>
          <Box
            m={10}
            // maxW="sm"
            minW="400px"
            borderWidth="0px"
            borderRadius="3xl"
            // overflow="hidden"
            bgColor="blackAlpha.400"
          >
            {/* Disclaimer / Logo */}
            <Center>
              <VStack>
                <Text
                  marginTop="2"
                  maxWidth="300px"
                  fontSize="xs"
                  fontStyle="italic"
                >
                  {pageProperties.disclaimer}
                </Text>
                <Logo
                  marginTop="5"
                  marginBottom="5"
                  h="30vmin"
                  pointerEvents="none"
                />
              </VStack>
            </Center>

            <Container>
              {address === "" && (
                <>
                  {/* Connect Buttons */}
                  <Box
                    textAlign="center"
                    mt="5"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    noOfLines={2}
                  >
                    <Popover returnFocusOnClose={false} isOpen={popoverOpen}>
                      <PopoverTrigger>
                        <Button
                          bgColor={"#047c24"}
                          onClick={() => openPopover()}
                        >
                          {pageProperties.connectButtonTxt}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent width="min-content">
                        <PopoverBody bgColor="green.900">
                          <Center>
                            <HStack spacing={2}>
                              <Button
                                bgColor="green.100"
                                color="green.900"
                                onClick={() => handleConnect("KardiaChain")}
                              >
                                KardiaChain
                              </Button>
                              <Button
                                bgColor="green.100"
                                color="green.900"
                                onClick={() => handleConnect("Metamask")}
                              >
                                Metamask
                              </Button>
                            </HStack>
                          </Center>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Box>
                  {/* Help Instructions */}
                  <Box p="6" alignItems="center">
                    <Center>
                      <HStack>
                        <Badge
                          borderRadius="full"
                          px="2"
                          colorScheme="whatsapp"
                        >
                          Help
                        </Badge>

                        <Box
                          textAlign="center"
                          color="gray.500"
                          fontWeight="semibold"
                          letterSpacing="wide"
                          fontSize="xs"
                          // textTransform="uppercase"
                          ml="2"
                        >
                          {pageProperties.instructions}
                        </Box>
                      </HStack>
                    </Center>
                    {/* </Box> */}
                  </Box>
                </>
              )}
              {address !== "" && (
                <>
                  <VStack>
                    <Box
                      borderWidth="0px"
                      borderRadius="xl"
                      overflow="hidden"
                      bgColor="green.900"
                      minWidth="350px"
                    >
                      <Container margin="1">
                        <Text>Connected Address:</Text>
                        <Code fontSize="xs">{address}</Code>
                      </Container>
                    </Box>

                    {parsedBalance !== "" && (
                      <>
                        <Box
                          borderWidth="0px"
                          borderRadius="xl"
                          overflow="hidden"
                          bgColor="green.800"
                          minWidth="350px"
                        >
                          <Container margin="1">
                            <Text>Node Info:</Text>
                            <Code fontSize="xs">{nodeInfo}</Code>
                          </Container>
                        </Box>

                        <Box
                          borderWidth="0px"
                          borderRadius="xl"
                          overflow="hidden"
                          bgColor="green.700"
                          minWidth="350px"
                        >
                          <Container margin="1">
                            <Text>Balance:</Text>
                            <Code fontSize="xs">{parsedBalance}</Code>
                          </Container>
                        </Box>
                        <Box
                          borderWidth="0px"
                          borderRadius="xl"
                          overflow="hidden"
                          bgColor="green.600"
                          minWidth="350px"
                        >
                          <Container margin="1">
                            <Text>Number of Transactions:</Text>
                            <Code fontSize="xs">{transCount}</Code>
                          </Container>
                        </Box>

                        <Container paddingTop="5" textAlign="center">
                          <Button
                            bgColor="red.500"
                            color="white"
                            onClick={() => handleDisconnect()}
                          >
                            Disconnect
                          </Button>
                        </Container>
                      </>
                    )}
                  </VStack>
                  {parsedBalance === "" && (
                    <>
                      <Center>
                        <CircularProgress
                          isIndeterminate
                          color="green.500"
                          thickness={"10px"}
                        />
                      </Center>
                    </>
                  )}
                </>
              )}
              {/* Download Links */}
              <Box p="6" alignContent="center">
                <Center>
                  <HStack spacing={2} direction="row">
                    {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
                    <Link
                      color="green.200"
                      href="https://metamask.io/"
                      fontSize="xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get MetaMask
                    </Link>
                    <Link
                      color="green.200"
                      href="https://chrome.google.com/webstore/detail/kardiachain-wallet/pdadjkfkgcafgbceimcpbkalnfnepbnk?hl=en"
                      fontSize="xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get KardiaChain Wallet
                    </Link>
                  </HStack>
                </Center>
              </Box>
            </Container>
          </Box>
          {/* Footer */}
          <Text fontSize="xs" padding="4">
            {pageProperties.footer}
          </Text>
        </VStack>
      </Center>
    </ChakraProvider>
  );
}

export default App;
