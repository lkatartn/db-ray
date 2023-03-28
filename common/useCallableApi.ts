import { useState, useCallback } from "react";

export const useCallableApi = <Input, Result>(url: string) => {
  const [result, setResult] = useState<Result | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const call = useCallback(
    async (input: Input) => {
      setLoading(true);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });
        const result = await response.json();
        setResult(result);
        setLoading(false);
        return result;
      } catch (error) {
        setError(error as Error);
        setLoading(false);
        throw error;
      }
    },
    [url]
  );

  return { result, error, loading, call };
};
