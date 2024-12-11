import axios from "axios";
import type { UserApiEnv } from './types'

export const UserAPI = (ENV: UserApiEnv) => {
  const getUserInfo = (token: string) => {
    return axios.get(`/oauth/user`, {
      headers: {
        Authorization: token,
      },
      baseURL: ENV.SSO_URL,
    });
  };

  const authorizeToken = (code: string) =>
    axios.post(
      '/oauth/token',
      {},
      {
        baseURL: ENV.SSO_URL,
        params: {
          client_id: ENV.SSO_ID,
          client_secret: ENV.SSO_SECRET,
          code,
          redirect_uri: ENV.SSO_REDIRECT,
        },
      },
    );
  
  const getRedirectLink = () => {
    return `${ENV.SSO_URL}/oauth/authorize?client_id=${ENV.SSO_ID}&redirect_uri=${ENV.SSO_REDIRECT}`;
  }
  
  const redirectSSO = (blank = false) => {
    const target = blank ? '_blank' : '_self';
    window.open(getRedirectLink(), target)
  }

  return {
    getUserInfo,
    authorizeToken,
    redirectSSO,
    getRedirectLink,
  };
};