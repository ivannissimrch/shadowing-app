import { useReducer } from "react";

type ModalState = {
  errorMessage: string;
  isSubmitting: boolean;
};

type ModalAction =
  | { type: "CLEAR_ERROR" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; payload: string }
  | { type: "RESET" };

const initialState: ModalState = {
  errorMessage: "",
  isSubmitting: false,
};

function modalReducer(state: ModalState, action: ModalAction) {
  switch (action.type) {
    case "CLEAR_ERROR":
      return {
        ...state,
        errorMessage: "",
      };

    case "SET_ERROR":
      return {
        ...state,
        errorMessage: action.payload,
        isSubmitting: false,
      };

    case "SUBMIT_START":
      return {
        ...state,
        errorMessage: "",
        isSubmitting: true,
      };

    case "SUBMIT_SUCCESS":
      return {
        ...state,
        errorMessage: "",
        isSubmitting: false,
      };

    case "SUBMIT_ERROR":
      return {
        ...state,
        errorMessage: action.payload,
        isSubmitting: false,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export function useModalState() {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  function clearError() {
    dispatch({ type: "CLEAR_ERROR" });
  }
  function setError(message: string) {
    dispatch({ type: "SET_ERROR", payload: message });
  }
  function startSubmit() {
    dispatch({ type: "SUBMIT_START" });
  }
  function submitSuccess() {
    dispatch({ type: "SUBMIT_SUCCESS" });
  }
  function submitError(message: string) {
    dispatch({ type: "SUBMIT_ERROR", payload: message });
  }
  function reset() {
    dispatch({ type: "RESET" });
  }

  return {
    state,
    clearError,
    setError,
    startSubmit,
    submitSuccess,
    submitError,
    reset,
  };
}
