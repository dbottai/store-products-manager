import axios from "axios";
import { useState, useCallback } from "react";

export const usePostApi = <BodyData, ResponseData>(
  query: string,
  headers?: HeadersInit
): {
  post: (data: BodyData) => Promise<void>;
  loading: boolean;
  error: string | null;
  responseData: ResponseData | null;
} => {
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const post = useCallback(
    async (data: BodyData) => {
      try {
        setLoading(true);
        const response = await axios({
          url: query,
          method: "POST",
          data: data,
        });
        const responseData = response?.data;
        setResponseData(responseData);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    },
    [query]
  );

  return { responseData, loading, error, post };
};
