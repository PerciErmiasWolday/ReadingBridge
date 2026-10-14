import { useId, type CSSProperties } from 'react'

/*
 * The Library's hero illustration: an arched window with a thick cream frame, a bridge over still
 * water at night, an open book in front, and leaf branches on either side. Drawn in the app's
 * palette only. With motion on, the layers rise in one after another.
 */

const ink = {
  midnight: '#18213D',
  midnightLight: '#26345E',
  water: '#22305A',
  forest: '#2E5B47',
  forestDark: '#22473A',
  forestLight: '#3F7259',
  sky: '#7E9AB5',
  ivory: '#F2E9D8',
  frame: '#F6EEDF',
  backdrop: '#EBE2D0',
  line: '#DCD3C2',
}

const layer = (delay: number): CSSProperties => ({
  animationDelay: `calc(var(--motion-duration) * ${delay})`,
})

/** A branch: a curved stem with leaves along it, alternating sides. */
function Branch({ stem, leaves }: { stem: string; leaves: [number, number, number, number][] }) {
  return (
    <g>
      <path d={stem} fill="none" stroke={ink.forestDark} strokeWidth="3" strokeLinecap="round" />
      {leaves.map(([x, y, size, angle]) => (
        <g key={`${x}-${y}`} transform={`rotate(${angle} ${x} ${y})`}>
          <path
            d={`M${x} ${y} q${size * 0.5} ${-size * 0.45} ${size} 0 q${-size * 0.5} ${size * 0.45} ${-size} 0 Z`}
            fill={ink.forest}
          />
          <path
            d={`M${x} ${y} h${size * 0.9}`}
            stroke={ink.forestDark}
            strokeWidth="1.2"
            opacity="0.7"
          />
        </g>
      ))}
    </g>
  )
}

export function HeroArt({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  const windowClip = `window-${id}`
  const grain = `grain-${id}`
  const hangers = [270, 310, 350, 390, 430, 470, 510]

  return (
    <svg
      viewBox="0 30 760 610"
      aria-hidden="true"
      focusable="false"
      className={`block h-auto w-full ${className}`}
    >
      <defs>
        <clipPath id={windowClip}>
          <path d="M226 608 V268 A154 154 0 0 1 534 268 V608 Z" />
        </clipPath>
        <filter id={grain} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      {/* Soft arch-shaped backdrop behind everything. */}
      <path
        d="M120 640 V300 A260 260 0 0 1 640 300 V640 Z"
        fill={ink.backdrop}
        className="rise"
        style={layer(0)}
      />

      {/* Leaf branches either side of the window. */}
      <g className="rise" style={layer(4)}>
        <Branch
          stem="M214 604 C186 520 158 430 144 310"
          leaves={[
            [144, 316, 74, -75],
            [168, 372, 82, -155],
            [152, 418, 84, -35],
            [184, 470, 84, -165],
            [170, 520, 80, -25],
            [200, 566, 72, -170],
          ]}
        />
        <Branch
          stem="M546 604 C584 540 616 470 650 404"
          leaves={[
            [648, 410, 74, -60],
            [618, 446, 80, 25],
            [612, 498, 82, -45],
            [578, 532, 76, 30],
            [566, 580, 68, -35],
          ]}
        />
      </g>

      {/* The thick cream frame, then the night inside the window. */}
      <path
        d="M200 612 V262 A180 180 0 0 1 560 262 V612 Z"
        fill={ink.frame}
        stroke={ink.line}
        strokeWidth="1.5"
      />
      <g clipPath={`url(#${windowClip})`}>
        <rect width="760" height="640" fill={ink.midnight} />
        <g fill={ink.ivory} className="rise" style={layer(1)}>
          {[
            [300, 180],
            [340, 240],
            [420, 280],
            [490, 300],
            [270, 270],
            [380, 200],
            [470, 170],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" />
          ))}
          <path d="M318 214 l3 -9 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 Z" />
          <path d="M498 252 l2 -7 l2 7 l7 2 l-7 2 l-2 7 l-2 -7 l-7 -2 Z" />
        </g>
        <g className="rise" style={layer(2)}>
          <circle
            cx="452"
            cy="232"
            r="42"
            fill={ink.sky}
            opacity="0.5"
            transform="translate(-6 5)"
          />
          <circle cx="452" cy="232" r="42" fill={ink.ivory} />
        </g>
        <path
          d="M226 400 Q300 360 370 388 T534 372 V608 H226 Z"
          fill={ink.midnightLight}
          className="rise"
          style={layer(2)}
        />
        <path
          d="M226 430 Q310 392 400 420 T534 410 V608 H226 Z"
          fill={ink.forest}
          className="rise"
          style={layer(3)}
        />
        <path
          d="M226 446 Q300 430 380 444 T534 440 V608 H226 Z"
          fill={ink.forestLight}
          opacity="0.55"
        />
        <rect
          x="226"
          y="476"
          width="308"
          height="132"
          fill={ink.water}
          className="rise"
          style={layer(3)}
        />
        {/* The bridge and its reflection. */}
        <g stroke={ink.ivory} fill="none" strokeLinecap="round" className="rise" style={layer(3)}>
          <path d="M226 476 Q380 360 534 476" strokeWidth="6" />
          <path d="M226 476 H534" strokeWidth="4" />
          {hangers.map((x) => (
            <line
              key={x}
              x1={x}
              x2={x}
              y1={476 - (1 - ((x - 380) / 154) ** 2) * 58}
              y2="476"
              strokeWidth="2"
            />
          ))}
          <path d="M226 476 Q380 560 534 476" strokeWidth="2" opacity="0.25" />
          <path d="M398 520 h46 M410 534 h26 M416 546 h14" strokeWidth="2.5" opacity="0.8" />
        </g>
        <rect
          width="760"
          height="640"
          filter={`url(#${grain})`}
          opacity="0.18"
          style={{ mixBlendMode: 'multiply' }}
        />
      </g>

      {/* The open book in front of the window, its pages curving like the bridge. */}
      <g className="rise" style={layer(5)}>
        <path
          d="M250 640 L258 586 Q320 560 380 594 Q440 560 502 586 L510 640 Z"
          fill={ink.midnight}
          opacity="0.2"
          transform="translate(0 4)"
        />
        <path d="M264 606 Q322 574 380 600 L380 640 Q322 618 264 640 Z" fill="#FBF8F1" />
        <path d="M496 606 Q438 574 380 600 L380 640 Q438 618 496 640 Z" fill={ink.ivory} />
        <path
          d="M264 606 Q322 574 380 600 Q438 574 496 606"
          fill="none"
          stroke={ink.midnight}
          strokeWidth="2"
        />
        <g stroke={ink.midnight} strokeWidth="1.4" opacity="0.3" fill="none" strokeLinecap="round">
          <path d="M282 610 Q322 594 364 606" />
          <path d="M282 622 Q322 606 364 618" />
          <path d="M396 606 Q438 594 478 610" />
          <path d="M396 618 Q438 606 478 622" />
        </g>
        <path d="M374 600 L386 600 L386 640 L380 632 L374 640 Z" fill={ink.forest} />
      </g>
    </svg>
  )
}
