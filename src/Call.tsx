import React, { useState } from "react";

import { Call as AgoraCall } from "./agora/Call";
import { Call as SkywayP2PCall } from "./skywayP2P/Call";

const Providers = {
  None: "None",
  Agora: "Agora",
  SkywayP2P: "SkywayP2P",
} as const;
type PROVIDER = typeof Providers[keyof typeof Providers];

const useVideoProvider = () => {
  const [provider, setProvider] = useState<PROVIDER>("None");

  const CallComponent = getCallComponent(provider);

  const CheckboxList: React.VFC = () => (
    <div>
      {(Object.keys(Providers) as Array<keyof typeof Providers>).map((p) => (
        <>
          <label>{p}</label>
          <input
            type="checkbox"
            onChange={() => setProvider(p)}
            checked={p === provider}
          />
        </>
      ))}
    </div>
  );

  return {
    provider,
    CheckboxList,
    CallComponent,
  };
};

const getCallComponent = (provider: PROVIDER) => {
  switch (provider) {
    case "Agora":
      return AgoraCall;
    case "SkywayP2P":
      return SkywayP2PCall;
    case "None":
      return () => <></>;
    default:
      const n: never = provider;
      throw new Error(n);
  }
};

export const Call: React.VFC = () => {
  const { CheckboxList, CallComponent } = useVideoProvider();

  return (
    <div>
      <CheckboxList />
      <div>{<CallComponent />}</div>
    </div>
  );
};
