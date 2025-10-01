import { it, expect } from "vitest";
import useAlertMessageStyles from "./useAlertMessageStyles";
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogActions,
  StyledButton,
  StyledFormControl,
} from "./useAlertMessageStyles";

it("should return the correct styles", () => {
  const styles = useAlertMessageStyles();
  expect(styles).toEqual({
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
    StyledFormControl,
  });
});
