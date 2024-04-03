import { createContext, useState } from 'react';
import { useQuery } from 'react-query';
import { getCurrentUser } from '../api/client';
import { Flex, Spinner, Text } from '@chakra-ui/react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const currentUserQuery = useQuery(['current-user'], () => getCurrentUser(), {
    staleTime: Infinity,
    onSuccess(user) {
      user && setCurrentUser(user);
    },
  });

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {currentUserQuery.isLoading && (
        <Flex h="100vh" justifyContent="center" alignItems="center">
          <Spinner />
        </Flex>
      )}
      {currentUserQuery.isSuccess && children}
      {currentUserQuery.isError && (
        <Flex h="100vh" justifyContent="center" alignItems="center">
          <Text>Something went wrong</Text>
        </Flex>
      )}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export { AuthContext };
