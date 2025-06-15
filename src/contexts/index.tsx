import { ReactNode } from "react";
import { UserProvider } from "./user";

type ContextsProps = {
  children: ReactNode;
};

export function Contexts({ children }: ContextsProps) {
  return <UserProvider>{children}</UserProvider>;
}
