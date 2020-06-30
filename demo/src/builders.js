import {
  START_YEAR,
  NUM_OF_YEARS,
  MONTH_NAMES,
  MONTHS_PER_YEAR,
  QUARTERS_PER_YEAR,
  MONTHS_PER_QUARTER,
  NUM_OF_MONTHS,
  MAX_TRACK_START_GAP,
  MAX_ELEMENT_GAP,
  MAX_MONTH_SPAN,
  MIN_MONTH_SPAN,
  MAX_NUM_OF_SUBTRACKS,
  COURSE_NAMES,
} from './constants'

import { fill, hexToRgb, colourIsLight, addMonthsToYear, addMonthsToYearAsDate, nextColor, randomTitle } from './utils'

//분기  -> 우리는 월로 바꿔야함
export const buildQuarterCells = () => {
  const v = []
  for (let i = 0; i < QUARTERS_PER_YEAR * NUM_OF_YEARS; i += 1) {
    const quarter = (i % 4) + 1
    const startMonth = i * MONTHS_PER_QUARTER
    const s = addMonthsToYear(START_YEAR, startMonth)
    const e = addMonthsToYear(START_YEAR, startMonth + MONTHS_PER_QUARTER)
    v.push({
      id: `${s.year}-q${quarter}`,
      title: `${s.year} ${quarter}분기`,
      start: new Date(`${s.year}-${s.month}-01`),
      end: new Date(`${e.year}-${e.month}-01`),
    })
  }
  return v
}

//월 -> 우리는 주로 바꿔야함
export const buildMonthCells = () => {
  const v = []
  for (let i = 0; i < MONTHS_PER_YEAR * NUM_OF_YEARS; i += 1) {
    const startMonth = i
    const start = addMonthsToYearAsDate(START_YEAR, startMonth)
    const end = addMonthsToYearAsDate(START_YEAR, startMonth + 1)
    v.push({
      id: `m${startMonth}`,
      title: MONTH_NAMES[i % 12],
      start,
      end,
    })
  }
  return v
}

// 월/주 같은 상단 행
export const buildTimebar = () => [
  {
    id: 'quarters',
    title: '분기',
    cells: buildQuarterCells(),
    style: {},
  },
  {
    id: 'months',
    title: '월',
    cells: buildMonthCells(),
    useAsGrid: true,
    style: {},
  },
]

//엘리먼트 속성 (이름, 배경색 등)
export const buildElement = ({ trackId, start, end, i }) => {
  const bgColor = nextColor()
  const color = colourIsLight(...hexToRgb(bgColor)) ? '#000000' : '#ffffff'
  return {
    id: `t-${trackId}-el-${i}`,
    title: randomTitle(), //utils에 정의되어있음. 우리는 모집단계별로 넣어야함
    start,
    end,
    style: {
      backgroundColor: `#${bgColor}`,
      color,
      borderRadius: '4px',
      boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
      textTransform: 'capitalize',
    },
  }
}

export const buildTrackStartGap = () => 6 //엘리먼트 언제 시작할지.
export const buildElementGap = () => 5 //엘리먼트간 간격

//엘리먼트 길이(스케줄)
export const buildElements = trackId => {
  const v = []
  let i = 1
  let month = buildTrackStartGap() //엘리먼트 시작월

  while (month < NUM_OF_MONTHS) {
    let monthSpan =  1 //엘리먼트 길이

    if (month + monthSpan > NUM_OF_MONTHS) { // 길이가 월*년 전체타임라인 넘어갈때
      monthSpan = NUM_OF_MONTHS - month
    }

    const start = addMonthsToYearAsDate(START_YEAR, month) //
    const end = addMonthsToYearAsDate(START_YEAR, month + monthSpan) //
    v.push(
      buildElement({
        trackId,
        start,
        end,
        i,
      })
    )
    const gap = buildElementGap()
    month += monthSpan + gap
    i += 1
  }

  return v
}

export const buildSubtrack = (trackId, subtrackId) => ({
  id: `track-${trackId}-${subtrackId}`,
  title: `${subtrackId}기`,
  elements: buildElements(subtrackId),
})

export const buildTrack = trackId => {
  const tracks = fill(Math.floor(Math.random() * MAX_NUM_OF_SUBTRACKS) + 1).map(i => buildSubtrack(trackId, i + 1))
  return {
    id: `track-${trackId}`,
    title: COURSE_NAMES[`${trackId}` - 1],
    elements: buildElements(trackId),
    tracks,
    // hasButton: true,
    // link: 'www.google.com',
    isOpen: false,
  }
}
