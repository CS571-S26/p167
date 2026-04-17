import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

type TranslationContextType = [boolean, Dispatch<SetStateAction<boolean>>];

const ThemeContext = createContext<TranslationContextType | undefined>(undefined);

export default ThemeContext;