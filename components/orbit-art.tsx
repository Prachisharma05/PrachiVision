export function OrbitArt() {
  return <div className="orbit-art" aria-hidden="true">
    <div className="orbit-halo" />
    <svg viewBox="0 0 500 500" fill="none">
      <defs><linearGradient id="orbit-line" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse"><stop stopColor="#95caff" /><stop offset="1" stopColor="#b69aff" /></linearGradient><radialGradient id="core"><stop stopColor="#dcdaff" /><stop offset=".25" stopColor="#91baff" /><stop offset="1" stopColor="#6351b8" stopOpacity="0" /></radialGradient></defs>
      <circle cx="250" cy="250" r="196" stroke="#8da9e5" strokeOpacity=".13" strokeDasharray="2 9" />
      <circle cx="250" cy="250" r="152" stroke="#8da9e5" strokeOpacity=".15" />
      <ellipse cx="250" cy="250" rx="215" ry="83" transform="rotate(-32 250 250)" stroke="url(#orbit-line)" strokeOpacity=".5" />
      <ellipse cx="250" cy="250" rx="185" ry="72" transform="rotate(43 250 250)" stroke="url(#orbit-line)" strokeOpacity=".28" />
      <path d="M250 40V460M40 250H460" stroke="#8da9e5" strokeOpacity=".08" />
      <circle cx="250" cy="250" r="64" fill="url(#core)" />
      <circle cx="250" cy="250" r="6" fill="#e0ddff" />
      <g className="orbit-node"><circle cx="110" cy="220" r="4" fill="#95caff" /><circle cx="110" cy="220" r="10" stroke="#95caff" strokeOpacity=".25" /></g>
      <circle cx="389" cy="204" r="4" fill="#b69aff" /><circle cx="320" cy="385" r="3" fill="#95caff" />
    </svg>
    <span className="orbit-label label-perception">01 / Perception</span>
    <span className="orbit-label label-language">02 / Language</span>
    <span className="orbit-label label-learning">03 / Learning</span>
    <span className="orbit-caption">A connected field of curiosity</span>
  </div>;
}
