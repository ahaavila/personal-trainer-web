import { useState } from 'react'
import type { ExerciseProgressPoint } from './types'

interface LoadProgressionChartProps {
  points: ExerciseProgressPoint[]
  exerciseName: string
}

function formatDateLabel(isoDate: string): string {
  try {
    const parts = isoDate.split('-')
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`
    }
    const d = new Date(isoDate)
    return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: '2-digit' }).format(d)
  } catch {
    return isoDate
  }
}

export function LoadProgressionChart({ points, exerciseName }: LoadProgressionChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!points || points.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#a7a095' }}>
        Sem dados de evolução disponíveis para este exercício.
      </div>
    )
  }

  const loads = points.map((p) => p.maxWeightKg)
  const minLoad = Math.min(...loads)
  const maxLoad = Math.max(...loads)

  // Bounds for Y-axis with breathing room
  const yMin = Math.max(0, Math.floor(minLoad * 0.85))
  const yMax = Math.max(yMin + 10, Math.ceil(maxLoad * 1.15))
  const yRange = yMax - yMin || 1

  // Chart dimensions in viewBox coordinates
  const width = 640
  const height = 240
  const paddingLeft = 55
  const paddingRight = 40
  const paddingTop = 30
  const paddingBottom = 40

  const plotWidth = width - paddingLeft - paddingRight
  const plotHeight = height - paddingTop - paddingBottom

  // Coordinates calculation
  const coords = points.map((p, i) => {
    const x = points.length === 1
      ? paddingLeft + plotWidth / 2
      : paddingLeft + (i / (points.length - 1)) * plotWidth
    const y = paddingTop + plotHeight - ((p.maxWeightKg - yMin) / yRange) * plotHeight
    return { x, y, point: p }
  })

  // Line path data
  const pathD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`
  }, '')

  // Area under curve path
  const firstX = coords[0].x
  const lastX = coords[coords.length - 1].x
  const bottomY = paddingTop + plotHeight
  const areaD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`

  // Y-axis grid ticks (3 ticks: min, mid, max)
  const yTicks = [
    yMin,
    Math.round(yMin + yRange / 2),
    yMax,
  ]

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        aria-label={`Gráfico de evolução de carga para ${exerciseName}`}
      >
        <defs>
          <linearGradient id="loadAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand-primary, #e2a83e)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--brand-primary, #e2a83e)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines and labels */}
        {yTicks.map((tickValue) => {
          const y = paddingTop + plotHeight - ((tickValue - yMin) / yRange) * plotHeight
          return (
            <g key={tickValue}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#2a2721"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill="#8f877b"
                fontSize="11"
                fontFamily="inherit"
              >
                {tickValue} kg
              </text>
            </g>
          )
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#loadAreaGradient)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--brand-primary, #e2a83e)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & X labels */}
        {coords.map((c, i) => {
          const isHovered = hoveredIndex === i
          const label = formatDateLabel(c.point.date)

          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* X-axis date label */}
              <text
                x={c.x}
                y={bottomY + 20}
                textAnchor="middle"
                fill={isHovered ? 'var(--brand-primary, #f2c265)' : '#8f877b'}
                fontSize="11"
                fontWeight={isHovered ? 'bold' : 'normal'}
                fontFamily="inherit"
              >
                {label}
              </text>

              {/* Point circle */}
              <circle
                cx={c.x}
                cy={c.y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? 'var(--brand-primary, #f2c265)' : '#0c0a08'}
                stroke="var(--brand-primary, #e2a83e)"
                strokeWidth={isHovered ? 3 : 2}
              />

              {/* Always visible or hover value text */}
              <text
                x={c.x}
                y={c.y - 10}
                textAnchor="middle"
                fill={isHovered ? '#f4f0e8' : 'var(--brand-primary, #e2a83e)'}
                fontSize="11"
                fontWeight="700"
                fontFamily="inherit"
              >
                {c.point.maxWeightKg} kg
              </text>
            </g>
          )
        })}
      </svg>

      {/* Tooltip detail when point is hovered */}
      {hoveredIndex !== null && coords[hoveredIndex] && (
        <div
          style={{
            marginTop: '0.75rem',
            padding: '0.6rem 1rem',
            background: '#191713',
            border: '1px solid #3d3525',
            borderRadius: '0.5rem',
            fontSize: '0.82rem',
            color: '#e6dfd5',
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span><strong>Data:</strong> {coords[hoveredIndex].point.date}</span>
          <span><strong>Carga:</strong> {coords[hoveredIndex].point.maxWeightKg} kg</span>
          <span><strong>Séries:</strong> {coords[hoveredIndex].point.setsCompleted}x ({coords[hoveredIndex].point.repsCompleted})</span>
        </div>
      )}
    </div>
  )
}
