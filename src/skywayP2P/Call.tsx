import { useCallback, useEffect, useRef, useState } from "react";
import Peer from "skyway-js";

export const Call: React.VFC = () => {
  const [apiKey, setApiKey] = useState("");
  const [peer, setPeer] = useState<Peer>();
  const [localId, setLocalId] = useState("");
  const [peerId, setPeerId] = useState("");
  const [localStream, setLocalStream] = useState<MediaStream>();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const onClickCreatePeer = useCallback(() => {
    const newPeer = new Peer({
      key: apiKey,
      debug: 3,
    });
    newPeer.on("open", () => {
      setLocalId(newPeer.id);
    });
    newPeer.on("error", console.error);
    setPeer(newPeer);
  }, [apiKey]);

  const onClickCall = () => {
    if (!peer || !peer.open) return;

    const mediaConnection = peer.call(peerId, localStream);

    mediaConnection.on("stream", async (stream) => {
      if (!remoteVideoRef.current) return;

      remoteVideoRef.current.srcObject = stream;
      await remoteVideoRef.current.play().catch(console.error);
    });

    mediaConnection.once("close", () => {
      const remoteVideo = remoteVideoRef.current;
      if (!remoteVideo) return;
      if (!(remoteVideo.srcObject instanceof MediaStream)) return;

      remoteVideo.srcObject.getTracks().forEach((track) => {
        track.stop();
      });

      if (!remoteVideoRef.current) return;
      remoteVideoRef.current.srcObject = null;
    });

    if (closeButtonRef.current) {
      closeButtonRef.current.addEventListener("click", () => {
        mediaConnection.close(true);
      });
    }
  };

  useEffect(() => {
    const handleLocalStream = async () => {
      if (!localVideoRef.current) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play();
      } catch (e) {
        console.error(e);
      }
    };

    handleLocalStream();
  }, []);

  useEffect(() => {
    if (peer && peer.id) {
      setLocalId(peer.id);
    }
  }, [peer]);

  useEffect(() => {
    if (!peer) return;

    const remoteVideo = remoteVideoRef.current;

    peer.on("call", (mediaConnection) => {
      if (!localStream) return;

      mediaConnection.answer(localStream);

      mediaConnection.on("stream", async (stream) => {
        if (!remoteVideoRef.current) return;

        remoteVideoRef.current.srcObject = stream;
        await remoteVideoRef.current.play().catch(console.error);
      });

      mediaConnection.once("close", () => {
        if (!(remoteVideo?.srcObject instanceof MediaStream)) return;

        remoteVideo.srcObject.getTracks().forEach((track) => {
          track.stop();
        });
        remoteVideo.srcObject = null;
      });

      if (closeButtonRef.current) {
        closeButtonRef.current.addEventListener("click", () => {
          mediaConnection.close(true);
        });
      }
    });
  }, [localStream, peer]);

  return (
    <div>
      <video width="400px" autoPlay muted playsInline ref={localVideoRef} />
      <video width="400px" autoPlay muted playsInline ref={remoteVideoRef} />
      <div>
        <input
          value={apiKey}
          placeholder="skyway Api Key"
          onChange={(e) => {
            setApiKey(e.currentTarget.value);
          }}
        />
        <button onClick={onClickCreatePeer}>Create peer</button>
      </div>
      <p>
        Your ID: <span>{localId}</span>
      </p>
      <input
        value={peerId}
        placeholder="Remote Peer ID"
        onChange={(e) => {
          setPeerId(e.currentTarget.value);
        }}
      />

      <button onClick={onClickCall}>Call</button>
      <button ref={closeButtonRef}>Close</button>
    </div>
  );
};
