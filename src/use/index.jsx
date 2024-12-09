import { use } from "react";
import ThemeContext from "./ThemeContext";

function UseUse({ children }) {
  if (children == null) {
    return null;
  }

  // This would not work with useContext
  // because of the early return.
  const theme = use(ThemeContext);
  return <h1 style={{ color: theme.color }}>{children}</h1>;
}
