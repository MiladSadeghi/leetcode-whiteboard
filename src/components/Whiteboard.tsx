import ReactDOM from "react-dom";
import { Tldraw } from "tldraw";
import root from "react-shadow";
import styles from "tldraw/tldraw.css?raw";
import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { WhiteboardDimensions } from "../types/general";

const Whiteboard = ({ onClose }: { onClose: () => void }) => {
  const STORAGE_KEY = "whiteboard-position-size";
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<WhiteboardDimensions | null>(
    () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }
      return null;
    }
  );
  //   const boundsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const shadowRoot = (
      shadowRef.current as unknown as { shadowRoot: ShadowRoot }
    )?.shadowRoot;
    if (!shadowRoot) return;

    const forwardEvent = (e: Event) => {
      if (e instanceof KeyboardEvent) {
        const cloned = new KeyboardEvent(e.type, e);
        document.dispatchEvent(cloned);
      }
    };

    shadowRoot.addEventListener("keydown", forwardEvent);
    shadowRoot.addEventListener("keyup", forwardEvent);

    return () => {
      shadowRoot.removeEventListener("keydown", forwardEvent);
      shadowRoot.removeEventListener("keyup", forwardEvent);
    };
  }, []);

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    if (!dimensions) return;
    const updated = { ...dimensions, x: data.x, y: data.y };
    setDimensions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleResizeStop = (
    _e: any,
    _direction: any,
    ref: HTMLElement,
    _delta: any,
    position: { x: number; y: number }
  ) => {
    const updated = {
      width: ref.offsetWidth,
      height: ref.offsetHeight,
      x: position.x,
      y: position.y,
    };
    setDimensions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const content = (
    <root.div
      ref={shadowRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <style type="text/css">{styles}</style>

      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <Rnd
          default={{
            x: dimensions?.x ?? 100,
            y: dimensions?.y ?? 100,
            width: dimensions?.width ?? 1024,
            height: dimensions?.height ?? 768,
          }}
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
          bounds={"parent"}
          dragHandleClassName="whiteboard-drag"
          style={{
            border: "1px solid #606060",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#1e1e1e",
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            willChange: "transform",
            pointerEvents: "auto",
          }}
        >
          <div
            className="whiteboard-drag"
            style={{
              padding: "6px 8px",
              background: "#333333",
              display: "flex",
              justifyContent: "end",
              cursor: "move",
              userSelect: "none",
            }}
          >
            <button
              style={{
                background: "none",
                outline: "none",
                border: "none",
                cursor: "pointer",
              }}
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="tldraw__editor" style={{ flex: 1 }}>
            <Tldraw persistenceKey="milad-sadeghi" />
          </div>
        </Rnd>
      </div>
    </root.div>
  );

  return ReactDOM.createPortal(content, document.body);
};

export default Whiteboard;
