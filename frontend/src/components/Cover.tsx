import { useId, type ReactNode } from 'react'
import type { Story } from '../types'

/*
 * Original cover art, drawn as flat screenprint layers: a few inks, slightly
 * misregistered, with paper grain on top. Decorative — the title is always
 * also given as real text next to the cover.
 */

const ink = {
  midnight: '#18213D',
  midnightLight: '#26345E',
  forest: '#2E5B47',
  forestDark: '#22473A',
  forestLight: '#3F7259',
  sand: '#D9C9A8',
  sky: '#7E9AB5',
  skyDark: '#5F7C99',
  mist: '#B9CAD8',
  ivory: '#F2E9D8',
}

interface CoverStyle {
  background: string
  title: string[]
  titleColor: string
  eyebrowColor: string
  art: () => ReactNode
}

const covers: Record<string, CoverStyle> = {
  'new-student': {
    background: ink.forest,
    title: ['The New', 'Student'],
    titleColor: ink.ivory,
    eyebrowColor: ink.sand,
    art: NewStudentArt,
  },
  'science-fair': {
    background: ink.midnight,
    title: ['The Science', 'Fair'],
    titleColor: ink.ivory,
    eyebrowColor: ink.sand,
    art: ScienceFairArt,
  },
  'two-friends': {
    background: ink.mist,
    title: ['Two Friends', 'at the Park'],
    titleColor: ink.midnight,
    eyebrowColor: ink.forestDark,
    art: TwoFriendsArt,
  },
}

/** Covers a student can choose for their own reading (ids in data/covers.ts). The title is theirs. */
const ownCovers: Record<string, CoverStyle> = {
  paper: {
    background: '#FBF8F1',
    title: [],
    titleColor: ink.midnight,
    eyebrowColor: ink.forestDark,
    art: PaperArt,
  },
  leaves: {
    background: ink.forest,
    title: [],
    titleColor: ink.ivory,
    eyebrowColor: ink.sand,
    art: LeavesArt,
  },
  night: {
    background: ink.midnight,
    title: [],
    titleColor: ink.ivory,
    eyebrowColor: ink.mist,
    art: NightArt,
  },
  hills: {
    background: ink.mist,
    title: [],
    titleColor: ink.midnight,
    eyebrowColor: ink.forestDark,
    art: HillsArt,
  },
  waves: {
    background: ink.sky,
    title: [],
    titleColor: ink.midnight,
    eyebrowColor: ink.ivory,
    art: WavesArt,
  },
  bridge: {
    background: ink.sand,
    title: [],
    titleColor: ink.midnight,
    eyebrowColor: ink.forestDark,
    art: BridgeArt,
  },
}

/** Breaks a title into at most three short lines for the cover. */
function coverLines(title: string): string[] {
  const lines: string[] = []
  // File names often use _ or - between words; very long words are broken into pieces.
  const words = title.split(/[\s_-]+/).flatMap((word) => word.match(/.{1,12}/g) ?? [])
  for (const word of words) {
    const last = lines[lines.length - 1]
    if (last && `${last} ${word}`.length <= 12) lines[lines.length - 1] = `${last} ${word}`
    else lines.push(word)
  }
  return lines.length > 3 ? [...lines.slice(0, 2), `${lines[2]}…`] : lines
}

export function Cover({ story, className = '' }: { story: Story; className?: string }) {
  const grainId = `grain-${useId().replace(/:/g, '')}`
  const title = coverLines(story.title)
  const photo = story.coverImage
  const cover =
    covers[story.id] ??
    (photo
      ? { ...ownCovers.paper, title, art: () => <PhotoArt href={photo} lines={title.length} /> }
      : { ...(ownCovers[story.cover ?? 'paper'] ?? ownCovers.paper), title })
  const eyebrow = covers[story.id] ? `A ${story.category} story` : 'Your reading'

  return (
    <svg
      viewBox="0 0 300 450"
      aria-hidden="true"
      focusable="false"
      className={`block h-auto w-full ${className}`}
    >
      <defs>
        <filter id={grainId} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="300" height="450" fill={cover.background} />
      {cover.art()}
      <text
        x="26"
        y="46"
        fill={cover.eyebrowColor}
        fontFamily="Instrument Sans, sans-serif"
        fontSize="11"
        fontWeight="600"
        letterSpacing="2.4"
      >
        {eyebrow.toUpperCase()}
      </text>
      {cover.title.map((line, index) => (
        <text
          key={index}
          x="24"
          y={100 + index * 44}
          fill={cover.titleColor}
          fontFamily="Instrument Serif, serif"
          fontSize="46"
        >
          {line}
        </text>
      ))}
      <rect
        width="300"
        height="450"
        filter={`url(#${grainId})`}
        opacity="0.2"
        style={{ mixBlendMode: 'multiply' }}
      />
    </svg>
  )
}

function NewStudentArt() {
  return (
    <g>
      {/* The new school: a darker block with a grid of windows. */}
      <rect x="150" y="150" width="150" height="160" fill={ink.forestDark} />
      {[0, 1, 2, 3].map((col) =>
        [0, 1, 2].map((row) => (
          <rect
            key={`${col}-${row}`}
            x={166 + col * 32}
            y={166 + row * 30}
            width="16"
            height="18"
            fill={ink.ivory}
            opacity={col === 2 && row === 1 ? 0.75 : 0.18}
          />
        )),
      )}
      {/* Misregistered sky pass, then the sand-coloured bus. */}
      <rect x="-16" y="226" width="260" height="140" rx="18" fill={ink.sky} opacity="0.55" />
      <rect x="-20" y="230" width="260" height="140" rx="18" fill={ink.sand} />
      {[0, 1, 2, 3].map((index) => (
        <rect
          key={index}
          x={-4 + index * 52}
          y="250"
          width="40"
          height="44"
          rx="4"
          fill={ink.ivory}
        />
      ))}
      <circle cx="16" cy="276" r="8" fill={ink.midnight} opacity="0.8" />
      <circle cx="120" cy="278" r="7" fill={ink.midnight} opacity="0.8" />
      <rect x="-20" y="318" width="260" height="7" fill={ink.midnight} />
      <rect x="198" y="246" width="34" height="112" rx="3" fill={ink.midnight} />
      <line
        x1="215"
        y1="252"
        x2="215"
        y2="352"
        stroke={ink.ivory}
        strokeWidth="1.5"
        opacity="0.5"
      />
      {[48, 168].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="372" r="24" fill={ink.midnight} />
          <circle cx={cx} cy="372" r="8" fill={ink.ivory} />
        </g>
      ))}
      {/* The pavement. */}
      <rect x="0" y="392" width="300" height="58" fill={ink.ivory} />
      <ellipse cx="262" cy="396" rx="30" ry="5" fill={ink.forest} opacity="0.35" />
      {/* Maya, stepping off, holding her backpack strap a little tighter. */}
      <rect x="230" y="276" width="20" height="44" rx="6" fill={ink.sand} />
      <rect
        x="230"
        y="276"
        width="20"
        height="44"
        rx="6"
        fill="none"
        stroke={ink.midnight}
        strokeWidth="2"
      />
      <path d="M246 272 Q262 265 278 272 L287 340 L238 340 Z" fill={ink.sky} />
      <line
        x1="276"
        y1="282"
        x2="268"
        y2="316"
        stroke={ink.skyDark}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <line
        x1="252"
        y1="340"
        x2="250"
        y2="390"
        stroke={ink.midnight}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line
        x1="270"
        y1="340"
        x2="282"
        y2="388"
        stroke={ink.midnight}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx="262" cy="254" r="13" fill={ink.midnight} />
      <circle cx="252" cy="244" r="6" fill={ink.midnight} />
    </g>
  )
}

function ScienceFairArt() {
  const stars: [number, number, number][] = [
    [212, 62, 6],
    [262, 118, 4],
    [40, 178, 5],
    [236, 196, 3],
    [96, 196, 3],
    [276, 40, 3],
  ]
  return (
    <g>
      {stars.map(([x, y, r]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x} ${y - r * 2}L${x + r / 2} ${y - r / 2}L${x + r * 2} ${y}L${x + r / 2} ${y + r / 2}L${x} ${y + r * 2}L${x - r / 2} ${y + r / 2}L${x - r * 2} ${y}L${x - r / 2} ${y - r / 2}Z`}
          fill={ink.sand}
        />
      ))}
      {/* The volcano, lit on one side. */}
      <path d="M24 412 L126 214 L184 214 L284 412 Z" fill={ink.forestLight} />
      <path d="M155 214 L184 214 L284 412 L196 412 Z" fill={ink.forest} />
      {/* Foam: a sand pass printed slightly off, then ivory on top. */}
      <g fill={ink.sand} opacity="0.7" transform="translate(4 4)">
        <circle cx="155" cy="200" r="30" />
        <circle cx="126" cy="178" r="18" />
        <circle cx="186" cy="172" r="21" />
      </g>
      <g fill={ink.ivory}>
        <circle cx="155" cy="200" r="30" />
        <circle cx="126" cy="178" r="18" />
        <circle cx="186" cy="172" r="21" />
        <circle cx="156" cy="150" r="14" />
        <circle cx="132" cy="146" r="7" />
        <circle cx="180" cy="134" r="6" />
        <path d="M128 214 Q122 250 130 266 Q138 252 136 214 Z" />
        <path d="M176 214 Q186 246 180 284 Q172 252 168 214 Z" />
      </g>
      {/* A flask on the bench. */}
      <path
        d="M52 344 L52 372 L34 404 Q32 410 38 410 L84 410 Q90 410 88 404 L70 372 L70 344 Z"
        fill="none"
        stroke={ink.ivory}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M40 396 L82 396 L86 404 Q88 408 84 408 L38 408 Q34 408 36 404 Z" fill={ink.sand} />
      <rect x="0" y="410" width="300" height="40" fill={ink.midnightLight} />
      <rect x="0" y="410" width="300" height="4" fill={ink.sand} />
    </g>
  )
}

function TwoFriendsArt() {
  return (
    <g>
      <circle cx="58" cy="226" r="20" fill={ink.ivory} />
      {/* The hill and the pond. */}
      <path d="M0 360 Q120 330 300 352 L300 450 L0 450 Z" fill={ink.forestLight} />
      <ellipse cx="196" cy="426" rx="150" ry="26" fill={ink.midnight} />
      <path
        d="M108 424 h40 M196 432 h56 M226 418 h30"
        stroke={ink.ivory}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* The tree, with the frisbee caught in it, set below the title. */}
      <g transform="translate(0 56)">
        <rect x="198" y="170" width="18" height="140" fill={ink.midnight} />
        <path d="M207 250 L240 214" stroke={ink.midnight} strokeWidth="8" strokeLinecap="round" />
        <g fill={ink.forest}>
          <circle cx="207" cy="168" r="66" />
          <circle cx="152" cy="198" r="46" />
          <circle cx="262" cy="200" r="44" />
        </g>
        <g fill={ink.forestDark}>
          <circle cx="236" cy="190" r="38" />
          <circle cx="176" cy="222" r="24" />
        </g>
        <ellipse cx="226" cy="132" rx="24" ry="8" fill={ink.sand} transform="rotate(-14 226 132)" />
        <ellipse
          cx="226"
          cy="132"
          rx="24"
          ry="8"
          fill="none"
          stroke={ink.midnight}
          strokeWidth="2"
          transform="rotate(-14 226 132)"
        />
        {/* Priya climbing up to get it; Jess below, pointing. */}
        <circle cx="214" cy="262" r="9" fill={ink.ivory} />
        <path d="M206 272 L222 272 L224 306 L204 306 Z" fill={ink.ivory} />
        <line
          x1="222"
          y1="276"
          x2="234"
          y2="252"
          stroke={ink.ivory}
          strokeWidth="6"
          strokeLinecap="round"
        />
      </g>
      <circle cx="78" cy="318" r="10" fill={ink.midnight} />
      <path d="M68 330 L88 330 L92 372 L64 372 Z" fill={ink.midnight} />
      <line
        x1="86"
        y1="334"
        x2="122"
        y2="296"
        stroke={ink.midnight}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1="72"
        y1="372"
        x2="70"
        y2="396"
        stroke={ink.midnight}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1="84"
        y1="372"
        x2="88"
        y2="396"
        stroke={ink.midnight}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </g>
  )
}

function PaperArt() {
  return (
    <g>
      <rect
        x="0.75"
        y="0.75"
        width="298.5"
        height="448.5"
        fill="none"
        stroke="#BFB49F"
        strokeWidth="1.5"
      />
      {Array.from({ length: 6 }, (_, index) => (
        <line
          key={index}
          x1="26"
          x2="274"
          y1={300 + index * 22}
          y2={300 + index * 22}
          stroke="#DCD3C2"
          strokeWidth="1.5"
        />
      ))}
    </g>
  )
}

function LeavesArt() {
  const leaves: [number, number, number, string, number][] = [
    [70, 350, 74, ink.forestLight, -35],
    [210, 320, 80, ink.sand, 28],
    [140, 410, 82, ink.forestDark, -8],
    [255, 410, 62, ink.ivory, 40],
  ]
  return (
    <g>
      {leaves.map(([x, y, r, fill, angle]) => (
        <g key={`${x}-${y}`} transform={`rotate(${angle} ${x} ${y})`}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.4} fill={fill} />
          <line
            x1={x - r * 0.9}
            x2={x + r * 0.9}
            y1={y}
            y2={y}
            stroke={ink.midnight}
            strokeWidth="1.5"
            opacity="0.5"
          />
        </g>
      ))}
    </g>
  )
}

function NightArt() {
  const stars: [number, number][] = [
    [40, 230],
    [120, 250],
    [270, 220],
    [180, 230],
    [90, 300],
    [250, 320],
  ]
  return (
    <g>
      <circle cx="214" cy="292" r="40" fill={ink.sky} opacity="0.6" transform="translate(-5 4)" />
      <circle cx="214" cy="292" r="40" fill={ink.ivory} />
      {stars.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill={ink.ivory} />
      ))}
      <path d="M0 400 Q80 360 160 392 T300 380 L300 450 L0 450 Z" fill={ink.midnightLight} />
    </g>
  )
}

function HillsArt() {
  return (
    <g>
      <circle cx="232" cy="262" r="26" fill={ink.ivory} />
      <path d="M0 340 Q90 290 180 330 T300 318 L300 450 L0 450 Z" fill={ink.sky} />
      <path d="M0 380 Q110 340 210 372 T300 368 L300 450 L0 450 Z" fill={ink.forestLight} />
      <path d="M0 420 Q120 392 220 414 T300 410 L300 450 L0 450 Z" fill={ink.forest} />
    </g>
  )
}

function WavesArt() {
  return (
    <g fill="none" strokeLinecap="round">
      {[300, 330, 360, 390, 420].map((y, index) => (
        <path
          key={y}
          d={`M-10 ${y} Q30 ${y - 16} 70 ${y} T150 ${y} T230 ${y} T310 ${y}`}
          stroke={index % 2 ? ink.mist : ink.ivory}
          strokeWidth="5"
        />
      ))}
    </g>
  )
}

function BridgeArt() {
  return (
    <g>
      <rect x="0" y="380" width="300" height="70" fill={ink.skyDark} />
      <g stroke={ink.midnight} fill="none" strokeLinecap="round">
        <path d="M0 380 Q150 250 300 380" strokeWidth="6" />
        <path d="M0 380 H300" strokeWidth="4" />
        {[60, 105, 150, 195, 240].map((x) => (
          <line
            key={x}
            x1={x}
            x2={x}
            y1={380 - (1 - ((x - 150) / 150) ** 2) * 65}
            y2="380"
            strokeWidth="2"
          />
        ))}
      </g>
      <path
        d="M40 410 h50 M150 420 h60 M230 404 h40"
        stroke={ink.ivory}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </g>
  )
}

/** The student's own picture, with a paper label across the top so the title stays readable. */
function PhotoArt({ href, lines }: { href: string; lines: number }) {
  return (
    <g>
      <image
        href={href}
        x="0"
        y="0"
        width="300"
        height="450"
        preserveAspectRatio="xMidYMid slice"
      />
      <rect x="0" y="0" width="300" height={76 + lines * 44} fill="#FBF8F1" opacity="0.94" />
    </g>
  )
}
