import { clock, effect, frameLoop, init, surface } from "vgpu";
import logoShader from "./logo-orbit.wgsl";

function mountLogoSpinner(host: HTMLElement, reduceMotion: boolean) {
  const logo = host.querySelector<HTMLImageElement>(".logo-mark img");
  if (!logo) return () => {};

  let rotation = 0;
  let velocity = 0;
  let previousPointerAngle = 0;
  let previousTimestamp = 0;
  let dragging = false;
  let inertiaFrame = 0;

  const pointerAngle = (event: PointerEvent) => {
    const bounds = logo.getBoundingClientRect();
    return Math.atan2(
      event.clientY - (bounds.top + bounds.height / 2),
      event.clientX - (bounds.left + bounds.width / 2),
    );
  };

  const applyRotation = () => {
    logo.style.transform = `rotate(${rotation}deg)`;
  };

  const stopInertia = () => {
    cancelAnimationFrame(inertiaFrame);
    inertiaFrame = 0;
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    stopInertia();
    dragging = true;
    velocity = 0;
    previousPointerAngle = pointerAngle(event);
    previousTimestamp = event.timeStamp;
    logo.dataset.dragging = "true";
    logo.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!dragging) return;
    const nextPointerAngle = pointerAngle(event);
    let delta = nextPointerAngle - previousPointerAngle;
    if (delta > Math.PI) delta -= Math.PI * 2;
    if (delta < -Math.PI) delta += Math.PI * 2;

    const deltaDegrees = delta * (180 / Math.PI);
    const deltaTime = Math.max(event.timeStamp - previousTimestamp, 1);
    const instantaneousVelocity = Math.max(
      -1.2,
      Math.min(1.2, deltaDegrees / deltaTime),
    );
    rotation += deltaDegrees;
    velocity = velocity * 0.65 + instantaneousVelocity * 0.35;
    previousPointerAngle = nextPointerAngle;
    previousTimestamp = event.timeStamp;
    applyRotation();
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!dragging) return;
    dragging = false;
    delete logo.dataset.dragging;
    if (logo.hasPointerCapture(event.pointerId)) {
      logo.releasePointerCapture(event.pointerId);
    }
    if (reduceMotion || Math.abs(velocity) < 0.002) return;

    let previousFrame = performance.now();
    const spin = (timestamp: number) => {
      const deltaTime = Math.min(timestamp - previousFrame, 32);
      previousFrame = timestamp;
      rotation += velocity * deltaTime;
      velocity *= Math.pow(0.94, deltaTime / 16.67);
      applyRotation();

      if (Math.abs(velocity) >= 0.002) {
        inertiaFrame = requestAnimationFrame(spin);
      }
    };
    inertiaFrame = requestAnimationFrame(spin);
  };

  logo.draggable = false;
  logo.addEventListener("pointerdown", onPointerDown);
  logo.addEventListener("pointermove", onPointerMove);
  logo.addEventListener("pointerup", onPointerUp);
  logo.addEventListener("pointercancel", onPointerUp);

  return () => {
    stopInertia();
    logo.removeEventListener("pointerdown", onPointerDown);
    logo.removeEventListener("pointermove", onPointerMove);
    logo.removeEventListener("pointerup", onPointerUp);
    logo.removeEventListener("pointercancel", onPointerUp);
  };
}

export async function mountLogoOrbit(host: HTMLElement) {
  const canvas = host.querySelector("canvas");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const stopSpinner = mountLogoSpinner(host, reduceMotion);

  if (!(canvas instanceof HTMLCanvasElement) || !("gpu" in navigator)) {
    return stopSpinner;
  }

  try {
    const gpu = await init();
    const canvasSurface = surface(gpu, canvas, { dpr: [1, 2] });
    const logoEffect = effect(gpu, logoShader, {
      label: "logo-background",
      set: {
        params: {
          time: 0,
          motion: reduceMotion ? 0 : 1,
          pointer: [0, 0],
          resolution: canvasSurface.size,
          theme: document.documentElement.classList.contains("dark") ? 0 : 1,
        },
      },
    });

    canvasSurface.onResize(() => {
      logoEffect.set({ params: { resolution: canvasSurface.size } });
    });

    const themeObserver = new MutationObserver(() => {
      logoEffect.set({
        params: {
          theme: document.documentElement.classList.contains("dark") ? 0 : 1,
        },
      });
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      logoEffect.set({
        params: {
          pointer: [
            ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
            ((event.clientY - bounds.top) / bounds.height) * 2 - 1,
          ],
        },
      });
    };
    const onPointerLeave = () => {
      logoEffect.set({ params: { pointer: [0, 0] } });
    };

    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    host.dataset.ready = "true";

    const timer = clock(gpu);
    const loop = frameLoop(
      gpu,
      (frame) => {
        logoEffect.set({ params: { time: timer.time } });
        frame.pass(canvasSurface, logoEffect);
      },
      { fps: reduceMotion ? 1 : 30 },
    );

    return () => {
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      themeObserver.disconnect();
      stopSpinner();
      loop.stop();
      gpu.dispose();
    };
  } catch {
    host.dataset.ready = "false";
    return stopSpinner;
  }
}
