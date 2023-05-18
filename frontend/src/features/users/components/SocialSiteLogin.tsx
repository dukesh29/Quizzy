import React from 'react';
import FacebookLogin, { ProfileSuccessResponse } from '@greatsumini/react-facebook-login';
import { FACEBOOK_CLIENT_ID } from '../../../constants';
import { setThunkError } from '../usersSlice';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import { useGoogleLogin } from '@react-oauth/google';
import { facebookLogin, googleLogin } from '../usersThunk';
import { useAppDispatch } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Props {
  isLogin?: boolean;
}

const SocialSiteLogin: React.FC<Props> = ({ isLogin }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notifyFailure = () =>
    toast.error('Что то пошло не так при входе через социальные сети!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  const handleGoogleIconClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await dispatch(googleLogin(tokenResponse.access_token)).unwrap();
      navigate('/');
    },
    onError: (errorResponse) => {
      if (isLogin) {
        dispatch(setThunkError(errorResponse.error));
      } else {
        notifyFailure();
      }
    },
  });

  const handleFacebookLogin = async (response: ProfileSuccessResponse) => {
    await dispatch(facebookLogin(response));
    navigate('/');
  };

  return (
    <>
      <FacebookLogin
        appId={FACEBOOK_CLIENT_ID}
        onFail={(response) => {
          if (isLogin) {
            dispatch(setThunkError(response.status));
          } else {
            notifyFailure();
          }
        }}
        onProfileSuccess={handleFacebookLogin}
        render={({ onClick }) => (
          <a onClick={onClick} className="social-login__icon">
            <FacebookIcon className="fb" />
          </a>
        )}
      />
      <a onClick={() => handleGoogleIconClick()} className="social-login__icon">
        <GoogleIcon className="gg" />
      </a>
    </>
  );
};

export default SocialSiteLogin;
