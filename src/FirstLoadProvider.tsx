import React, { createContext, useState } from "react";

export const FirstLoadContext = createContext<[Boolean, React.Dispatch<React.SetStateAction<Boolean>>]>([
  null!,
  () => null!,
]);

const FirstLoadProvider = ({ children }: React.PropsWithChildren) => {
  const [FirstLoad, setFirstLoad] = useState<Boolean>(true);

  return <FirstLoadContext.Provider value={[FirstLoad, setFirstLoad]}>{children}</FirstLoadContext.Provider>;
};

export default FirstLoadProvider;
