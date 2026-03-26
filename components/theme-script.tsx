/** Inline head script: set html.dark / html.light before paint (avoids flash). */
export function ThemeScript() {
  const code = `
(function () {
  try {
    var k = "humor-admin-theme";
    var d = document.documentElement;
    var t = localStorage.getItem(k);
    var dark = function () { d.classList.add("dark"); d.classList.remove("light"); };
    var light = function () { d.classList.add("light"); d.classList.remove("dark"); };
    if (t === "dark") dark();
    else if (t === "light") light();
    else {
      if (window.matchMedia("(prefers-color-scheme: light)").matches) light();
      else dark();
    }
  } catch (e) {}
})();`;
  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
