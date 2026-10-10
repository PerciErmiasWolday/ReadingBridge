import { useId, type CSSProperties } from 'react'

/*
 * The Library's hero illustration: an arched window at night, a bridge over
 * still water, and an open book in front of it — reading as a bridge. The
 * layers rise in one after another; reduced motion shows them at once.
 */

const layer = (delay: number): CSSProperties => ({
  animationDelay: `calc(var(--motion-duration) * ${delay})`,
  transformBox: 'fill-box',
  transformOrigin: 'center',
})

export function HeroArt({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const arch = `arch-${id}`
  const grain = `grain-${id}`

  return (
    <svg
      viewBox="0 0 520 640"
      aria-hidden="true"
      focusable="false"
      className={`group block h-auto w-full ${className}`}
    >
      <defs>
        <clipPath id={arch}>
          <path d="M60 640 V270 A200 200 0 0 1 460 270 V640 Z" />
        </clipPath>
        <filter id={grain} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* Leaves behind the window, left and right. */}
      <g className="rise" style={layer(4)}>
        <path d="M54 360 C10 330 4 270 30 236 C62 270 70 320 54 360 Z" fill="#2E5B47" />
        <path d="M70 430 C20 430 -6 392 0 360 C40 366 66 396 70 430 Z" fill="#3F7259" />
        <path d="M466 170 C500 130 520 120 520 120 C516 176 492 204 466 214 Z" fill="#2E5B47" />
        <path d="M30 236 L54 360" stroke="#18213D" strokeWidth="1.5" />
      </g>

      {/* The window frame, then the night inside it. */}
      <path
        d="M48 640 V270 A212 212 0 0 1 472 270 V640"
        fill="none"
        stroke="#18213D"
        strokeWidth="2"
      />
      <g clipPath={`url(#${arch})`}>
        <rect width="520" height="640" fill="#18213D" className="rise" style={layer(0)} />
        <g fill="#F2E9D8" className="rise" style={layer(1)}>
          <circle cx="150" cy="150" r="2" />
          <circle cx="210" cy="96" r="1.5" />
          <circle cx="300" cy="120" r="2" />
          <circle cx="120" cy="230" r="1.5" />
          <circle cx="420" cy="250" r="1.5" />
          <circle cx="250" cy="200" r="1.2" />
        </g>
        <g className="rise transition duration-700 group-hover:-translate-y-2" style={layer(2)}>
          <circle
            cx="352"
            cy="176"
            r="48"
            fill="#7E9AB5"
            opacity="0.6"
            transform="translate(-6 5)"
          />
          <circle cx="352" cy="176" r="48" fill="#F2E9D8" />
        </g>
        <path
          d="M60 420 Q160 360 260 400 T460 380 V640 H60 Z"
          fill="#2E5B47"
          className="rise"
          style={layer(2)}
        />
        <rect
          x="60"
          y="452"
          width="400"
          height="188"
          fill="#26345E"
          className="rise"
          style={layer(3)}
        />
        {/* The bridge and its reflection. */}
        <g className="rise" style={layer(3)} stroke="#F2E9D8" fill="none" strokeLinecap="round">
          <path d="M60 452 Q260 300 460 452" strokeWidth="7" />
          <path d="M60 452 H460" strokeWidth="4" />
          {[110, 160, 210, 260, 310, 360, 410].map((x) => (
            <line
              key={x}
              x1={x}
              x2={x}
              y1={452 - (1 - ((x - 260) / 200) ** 2) * 76}
              y2="452"
              strokeWidth="2"
            />
          ))}
          <path d="M60 452 Q260 590 460 452" strokeWidth="3" opacity="0.25" />
        </g>
        <g
          stroke="#F2E9D8"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
          className="rise"
          style={layer(4)}
        >
          <line x1="332" x2="372" y1="486" y2="486" />
          <line x1="340" x2="364" y1="502" y2="502" />
          <line x1="346" x2="358" y1="516" y2="516" />
        </g>
        <rect
          width="520"
          height="640"
          filter={`url(#${grain})`}
          opacity="0.18"
          style={{ mixBlendMode: 'multiply' }}
        />
      </g>

      {/* The open book in front, its pages curving like the bridge. */}
      <g className="rise" style={layer(5)}>
        <path
          d="M86 640 L92 566 Q180 540 260 578 Q340 540 428 566 L434 640 Z"
          fill="#18213D"
          opacity="0.25"
          transform="translate(0 6)"
        />
        <path d="M96 600 Q178 560 260 590 L260 640 Q178 612 96 640 Z" fill="#FBF8F1" />
        <path d="M424 600 Q342 560 260 590 L260 640 Q342 612 424 640 Z" fill="#F2E9D8" />
        <path
          d="M96 600 Q178 560 260 590 Q342 560 424 600"
          fill="none"
          stroke="#18213D"
          strokeWidth="2"
        />
        <g stroke="#18213D" strokeWidth="1.5" opacity="0.35" strokeLinecap="round">
          <path d="M120 604 Q180 584 240 600" fill="none" />
          <path d="M120 616 Q180 596 240 612" fill="none" />
          <path d="M280 600 Q340 584 400 604" fill="none" />
          <path d="M280 612 Q340 596 400 616" fill="none" />
        </g>
        <path d="M262 590 L274 590 L274 640 L268 632 L262 640 Z" fill="#2E5B47" />
      </g>
    </svg>
  )
}
