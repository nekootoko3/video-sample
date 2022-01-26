import { useCallback, useState } from "react";

import { Call as AgoraCall } from "./agora/Call";

type Provider = "None" | "Agora" | "Skyway";

const useVideoProvider = () => {
  const [provider, setProvider] = useState<Provider>("None");

  const selectAgora = useCallback(() => {
    setProvider("Agora");
  }, []);
  const selectSkyway = useCallback(() => {
    setProvider("Skyway");
  }, []);

  const CallComponent = getCallComponent(provider);

  return {
    provider,
    CallComponent,
    selectAgora,
    selectSkyway,
  };
};

const getCallComponent = (provider: Provider) => {
  switch (provider) {
    case "Agora":
      return AgoraCall;
    case "Skyway":
      return null;
    case "None":
      return null;
    default:
      const n: never = provider;
      throw new Error(n);
  }
};

export const Call: React.VFC = () => {
  const { provider, CallComponent, selectSkyway, selectAgora } =
    useVideoProvider();

  return (
    <div>
      <div>
        <input
          type="checkbox"
          onChange={selectAgora}
          checked={provider === "Agora"}
        />
        <input
          type="checkbox"
          onChange={selectSkyway}
          checked={provider === "Skyway"}
        />
      </div>
      <div>{CallComponent && <CallComponent />}</div>
    </div>
  );
};
