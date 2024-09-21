import config from "./config";

interface RequestOptions {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

interface ApiResponse {
  code: number;
  [key: string]: any; // Allow any additional properties
}

const request = async (options: RequestOptions): Promise<ApiResponse> => {
  const onSuccess = async (response: Response): Promise<ApiResponse> => {
    if (
      response.ok ||
      [400, 401, 404].includes(response.status)
    ) {
      try {
        const responseData = await response.json();
        return { code: response.status, ...responseData };
      } catch (e) {
        console.error("Error parsing JSON:", e);
        throw new Error(`Failed to parse response JSON.`);
      }
    } else {
      const errorText = await response.text(); // Get the raw text for debugging
      console.error(`Request failed with status ${response.status}: ${errorText}`);
      throw new Error(`Request failed with status ${response.status}`);
    }
  };

  const onError = (error: Error): Promise<never> => {
    console.error("Request Failed:", error.message);
    return Promise.reject(error);
  };

  try {
    const response = await fetch(
      config.NEXT_PUBLIC_BASE_URL + options.url,
      {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined, // Use `undefined` if `body` is not present
      }
    );

    return onSuccess(response);
  } catch (error: any) {
    return onError(error);
  }
};

export default request;
