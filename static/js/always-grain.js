(() => {
  // Run after the theme has done its DOM work.
  const run = () => {
    // 1) Ensure grain exists
    document.querySelectorAll(".background, #background-body").forEach((el) => {
      if (!el.querySelector(":scope > .grain")) {
        const grain = document.createElement("div");
        grain.className = "grain";
        el.appendChild(grain);
      }
    });

    // 2) Ensure clock exists (optional, remove this block if you only want grain)
    const bgBody = document.getElementById("background-body");
    if (bgBody && !document.getElementById("dwclock")) {
      bgBody.insertAdjacentHTML(
        "afterbegin",
        `<div id="dwclock">
          <div id="min"><div class="hand"></div></div>
          <div id="hour"><div class="hand"></div></div>
        </div>`
      );
    }

    // 3) Ensure the needed CSS exists (copied from theme behavior, but isolated here)
    if (!document.getElementById("always-grain-style")) {
      const style = document.createElement("style");
      style.id = "always-grain-style";
      style.textContent = `
        .grain{
          position:absolute;
          mix-blend-mode:difference;
          background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' version='1.1' width='256' height='256' viewBox='0 0 256 256'><defs><filter id='grain' x='0' y='0' width='1' height='1' filterUnits='objectBoundingBox' primitiveUnits='userSpaceOnUse' color-interpolation-filters='linearRGB'><feTurbulence type='turbulence' baseFrequency='.7' numOctaves='7' seed='42' stitchTiles='stitch' x='-1%' y='-1%' width='102%' height='102%' result='turbulence' id='feTurbulence2' /><feSpecularLighting surfaceScale='7' specularConstant='3' specularExponent='10' lighting-color='%23ffffff' x='-1%' y='-1%' width='102%' height='102%' in='turbulence' result='specularLighting' id='feSpecularLighting'><feDistantLight azimuth='3' elevation='163' id='feDistantLight' /></feSpecularLighting></filter></defs><rect width='320' height='320' fill='%23000000' id='blackbody' x='-32' y='-32' opacity='.03' /><rect width='320' height='320' fill='%23ffffff' filter='url(%23grain)' id='noise' x='-32' y='-32' opacity='.03' /></svg>");
          width:100%;
          height:100%;
          inset:0;
          pointer-events:none;
        }
        #dwclock{opacity:.33;margin:auto;width:100vmin;height:100vmin;filter:blur(2vmin) saturate(2)}
        #hour,#min{position:absolute;width:100vmin;height:100vmin}
        .hand{--min:40vmin;--hour:28vmin;--tsf:translateY(calc(50vmin - var(--min)));margin:0 auto auto;border-right:2vmin solid transparent;border-bottom:var(--min) solid #60f;border-left:2vmin solid transparent;border-radius:2vmin;background-image:linear-gradient(0deg,var(--bg) 0%,#60f 100%);width:3vmin;height:var(--min)}
        #hour .hand{--tsf:translateY(calc(50vmin - var(--hour)));border-bottom:var(--hour) solid #20f;background-image:linear-gradient(0deg,var(--bg) 0%,#20f 100%);height:var(--hour)}
      `;
      document.head.appendChild(style);
    }

    // 4) Keep the hands moving (independent from the theme's `date` variable)
    const updateClock = () => {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const hour = now.getHours();

      const minutesDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
      const hourDegrees = (hour / 12) * 360 + (minutes / 60) * 30;

      const minHand = document.querySelector("#min");
      const hourHand = document.querySelector("#hour");
      if (minHand) minHand.style.transform = `rotate(${minutesDegrees}deg)`;
      if (hourHand) hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    };

    updateClock();
    window.setInterval(updateClock, 10_000);
  };

  // Ensure we run after the theme scripts and after DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(run, 0));
  } else {
    setTimeout(run, 0);
  }
})();
