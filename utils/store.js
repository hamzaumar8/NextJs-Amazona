import jsCookie from "js-cookie";
import { createContext, useReducer } from "react";

export const Store = createContext();
const initialState = {
  darkMode: jsCookie.get("darkMode") === "ON" ? true : false,
};
function reducer(state, action) {
  switch (action.type) {
    case "DARK_MODEE_ON":
      return { ...state, darkMode: true };
    case "DARK_MODEE_OFF":
      return { ...state, darkMode: false };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}