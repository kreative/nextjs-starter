interface MakeRequestProps {
  method: string;
  url: string;
  key: string;
  body?: any;
}

export async function makeRequest({ method, url, key, body }: MakeRequestProps): Promise<any> {
  // Set up request headers with "Kreative-Id-Key"
  const headers: HeadersInit = {
    "Kreative-Id-Key": key,
  };

  // Include 'Content-Type' if body is provided and is an object
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Set up request options
  const options: RequestInit = {
    method,
    headers,
  };

  // Include the body if provided
  if (body) {
    if (typeof body === "object" && !(body instanceof FormData)) {
      options.body = JSON.stringify(body);
    } else {
      options.body = body;
    }
  }

  try {
    const response = await fetch(url, options);

    // Handle HTTP errors
    if (!response.ok) {
      // Parse error details from the response
      let errorData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        errorData = await response.text();
      }

      let errorMessage = `HTTP error! status: ${response.status}`;

      switch (response.status) {
        case 400:
          errorMessage = "Bad Request";
          break;
        case 401:
          errorMessage = "Unauthorized";
          break;
        case 402:
          errorMessage = "Payment Required";
          break;
        case 403:
          errorMessage = "Forbidden";
          break;
        case 404:
          errorMessage = "Not Found";
          break;
        case 500:
          errorMessage = "Internal Server Error";
          break;
        // Add more cases as needed
        default:
          errorMessage = `HTTP error! status: ${response.status}`;
          break;
      }

      // Create an error object with status and message
      const error = new Error(errorMessage) as any;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Parse and return the response data
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
      const data = await response.text();
      return data;
    }
  } catch (error) {
    // Handle network errors or unexpected exceptions
    console.error("Fetch error:", error);
    throw error;
  }
}
