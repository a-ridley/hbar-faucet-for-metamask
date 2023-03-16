import { createContext, ReactNode, useState } from "react";

const defaultValue = {
  metamaskAccountAddress: '',
  setMetamaskAccountAddress: (newValue: string) => { },
}

export const GlobalAppContext = createContext(defaultValue)

export const GlobalAppContextProvider = (props: { children: ReactNode | undefined }) => {
  const [metamaskAccountAddress, setMetamaskAccountAddress] = useState('')

  return (
    <GlobalAppContext.Provider
      value={{
        metamaskAccountAddress,
        setMetamaskAccountAddress
      }}
    >
      {props.children}
    </GlobalAppContext.Provider>
  )
}
