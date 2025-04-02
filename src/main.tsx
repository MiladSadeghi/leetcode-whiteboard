import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const TARGET_SELECTOR =
  "#editor > div.flex.h-8.items-center.justify-between.border-b.p-1.border-border-quaternary.dark\\:border-border-quaternary > div.flex.items-center.gap-1";

function waitForElement(selector: string): Promise<HTMLElement> {
  return new Promise((resolve) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el as HTMLElement);

    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        resolve(found as HTMLElement);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  });
}

async function mountApp() {
  const container = await waitForElement(TARGET_SELECTOR);

  const mountPoint = document.createElement("div");
  mountPoint.id = "white-board-btn";
  container.insertAdjacentElement("afterbegin", mountPoint);

  const root = createRoot(mountPoint);
  root.render(<App />);
}

mountApp();
