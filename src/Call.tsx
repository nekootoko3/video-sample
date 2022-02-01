import { useCallback, useState } from "react";

import { Call as AgoraCall } from "./agora/Call";
import { Call as SkywayP2PCall } from "./skywayP2P/Call";

type Provider = "None" | "Agora" | "SkywayP2P";

const useVideoProvider = () => {
  const [provider, setProvider] = useState<Provider>("None");

  const selectAgora = useCallback(() => {
    setProvider("Agora");
  }, []);
  const selectSkyway = useCallback(() => {
    setProvider("SkywayP2P");
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
    case "SkywayP2P":
      return SkywayP2PCall;
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
          checked={provider === "SkywayP2P"}
        />
      </div>
      <div>{CallComponent && <CallComponent />}</div>
    </div>
  );
};
