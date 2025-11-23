import { useReducer } from "react";

type FormModalState<TFields> = {
  fields: TFields;
  errors: {
    form?: string;
    fields?: Partial<Record<keyof TFields, string>>;
  };
  isSubmitting: boolean;
  isDirty: boolean;
};

type FormModalAction<TFields> =
  | { type: "FIELD_CHANGE"; field: keyof TFields; value: string }
  | { type: "SET_FORM_ERROR"; message: string }
  | { type: "CLEAR_ERRORS" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; message: string }
  | { type: "RESET" };

function formModalReducer<TFields>(
  state: FormModalState<TFields>,
  action: FormModalAction<TFields>
): FormModalState<TFields> {
  switch (action.type) {
    case "FIELD_CHANGE":
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: action.value,
        },
        isDirty: true,
        errors: {
          ...state.errors,
          form: undefined,
        },
      };

    case "SET_FORM_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          form: action.message,
        },
        isSubmitting: false,
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        errors: {},
      };

    case "SUBMIT_START":
      return {
        ...state,
        isSubmitting: true,
        errors: {},
      };

    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
        errors: {},
      };

    case "SUBMIT_ERROR":
      return {
        ...state,
        isSubmitting: false,
        errors: {
          form: action.message,
        },
      };

    case "RESET":
      return {
        fields: state.fields,
        errors: {},
        isSubmitting: false,
        isDirty: false,
      };

    default:
      return state;
  }
}

export function useFormModal<TFields extends Record<string, string>>(
  initialFields: TFields
) {
  const initialState: FormModalState<TFields> = {
    fields: initialFields,
    errors: {},
    isSubmitting: false,
    isDirty: false,
  };

  const [state, dispatch] = useReducer(formModalReducer<TFields>, initialState);

  function setField(field: keyof TFields, value: string) {
    dispatch({ type: "FIELD_CHANGE", field, value });
  }

  function setFormError(message: string) {
    dispatch({ type: "SET_FORM_ERROR", message });
  }

  function clearErrors() {
    dispatch({ type: "CLEAR_ERRORS" });
  }

  function startSubmit() {
    dispatch({ type: "SUBMIT_START" });
  }

  function submitSuccess() {
    dispatch({ type: "SUBMIT_SUCCESS" });
  }

  function submitError(message: string) {
    dispatch({ type: "SUBMIT_ERROR", message });
  }

  function reset() {
    dispatch({ type: "RESET" });
  }

  return {
    fields: state.fields,
    errors: state.errors,
    isSubmitting: state.isSubmitting,
    isDirty: state.isDirty,
    setField,
    setFormError,
    clearErrors,
    startSubmit,
    submitSuccess,
    submitError,
    reset,
  };
}
