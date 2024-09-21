import { useEffect, useReducer, useState } from "react";

interface Action {
  type: "FETCH_INIT" | "FETCH_SUCCESS" | "FETCH_FAILURE";
  payload?: any;
}

// Reducer function to manage state changes based on different actions
const dataFetchReducer = (state: any, action: Action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return { ...state, isLoading: true, isError: false };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        error: action.payload,
      };
    default:
      throw new Error();
  }
};

// Custom hook for handling API requests and managing state
const useFetch = (
  initAction: (() => Promise<any>) | null,
  initialData = {}
) => {
  // State for the current API action and a function to update it
  const [action, setAction] = useState<(() => Promise<any>) | null>(initAction);

  // Use a reducer to manage the loading, error, and data states
  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: initAction ? true : false,
    isError: false,
    error: {},
    data: initialData,
  });

  useEffect(() => {
    let didCancel = false;

    // Function to fetch data from the API
    const fetchData = async () => {
      if (typeof action === "function") {  // Ensure action is a function before calling it
        dispatch({ type: "FETCH_INIT" });

        try {
          const result = await action();

          if (!didCancel) {
            // Handle different cases based on the API response code
            switch (result.code) {
              case 200:
              case 201:
              case 400:
              case 555:
                dispatch({
                  type: "FETCH_SUCCESS",
                  payload: result,
                });
                break;
              case 401:
              case 404:
              case -111:
              case -222:
                dispatch({ type: "FETCH_SUCCESS", payload: result });
                break;
              case -888:
                dispatch({ type: "FETCH_FAILURE", payload: result.message });
                break;
              default:
                dispatch({ type: "FETCH_FAILURE", payload: result });
            }
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE", payload: error });
          }
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, [action]);

  // Return the current state and a function to update the action
  return [state, setAction];
};

export default useFetch;
