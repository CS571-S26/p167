import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

type ThemeContextType = [string, Dispatch<SetStateAction<string>>];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default ThemeContext;