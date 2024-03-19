/* eslint-disable filenames/match-regex */
import { useEffect, useState } from 'react';

export const useSSR = () => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return isSSR;
};
