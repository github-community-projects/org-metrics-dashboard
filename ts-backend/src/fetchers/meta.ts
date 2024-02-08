// Fetchers for meta data about this run

import { Fetcher } from "..";

export const addMetaToResult: Fetcher = async (result) => {
  return {
    ...result,
    meta: {
      createdAt: new Date().toISOString(),
    },
  };
};
