import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { Flex, Spinner, Text } from '@chakra-ui/react';
import {
  Navigate,
  useLocation,
  useParams,
  useNavigate,
} from 'react-router-dom';

import useAuth from '../auth/useAuth';
import { verifyCurrentUser } from '../api/client';

function VerifyAccount() {
  const { token } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useAuth();

  const verifyUserMutation = useMutation((token) => verifyCurrentUser(token), {
    onSuccess(verifiedUser) {
      setCurrentUser(verifiedUser);
      navigate('/dashboard?verify-success');
    },
  });

  useEffect(() => {
    if (currentUser && !currentUser.isVerified) {
      verifyUserMutation.mutate(token);
    }
  }, []);

  const verificationError = (error) => {
    if (error.errorCode === 'auth/invalid-verification-token')
      return 'The verification link is invalid or expired';
    return 'Something went wrong';
  };

  if (!currentUser) {
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(pathname)}`}
        replace
      />
    );
  }

  if (currentUser.isVerified) {
    return <Navigate to={'/dashboard'} replace />;
  }

  return (
    <Flex justifyContent="center" alignItems="center" h="100vh">
      {verifyUserMutation.isLoading && <Spinner />}
      {verifyUserMutation.isError && (
        <Text>{verificationError(verifyUserMutation.error)}</Text>
      )}
    </Flex>
  );
}
export default VerifyAccount;
