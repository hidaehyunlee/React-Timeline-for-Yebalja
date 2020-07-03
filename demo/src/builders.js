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

// 월,주 같은 상단 행
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

//엘리먼트들이 프로그램(buildtrack) id에 따라 값을 갖고 생성되는게 아니라, 아래 두 함수 값을 받아서 랜덤으로 생성되는듯...
export const buildTrackStartGap = () => 6 //엘리먼트들이 몇 칸 띄고 생성될지 결정
export const buildElementGap = () => 5 //엘리먼트간 cell 간격

//엘리먼트 길이(스케줄)
export const buildElements = trackId => {
  const v = []
  let i = 1
  let month = buildTrackStartGap() //엘리먼트 시작월

  while (month < NUM_OF_MONTHS) {
    let monthSpan =  1 //엘리먼트 길이

    if (month + monthSpan > NUM_OF_MONTHS) { // 길이가 월*년 전체타임라인 넘어갈때 조정.
      monthSpan = NUM_OF_MONTHS - month
    }

    const start = addMonthsToYearAsDate(START_YEAR, month) //시작월을 시작날짜로 바꾸는 함수 필요.
    const end = addMonthsToYearAsDate(START_YEAR, month + monthSpan)
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

//프로그램(buildTrack) 별로 서브트랙 값을 다르게 가질 수 있도록 id 추가 필요할듯.
export const buildSubtrack = (trackId, subtrackId) => ({
  id: `track-${trackId}-${subtrackId}`,
  title: `${subtrackId}기`, //subtrack 타이틀만 id값으로 변경.
  elements: buildElements(subtrackId),
})

export const buildTrack = trackId => {
  const tracks = fill(Math.floor(Math.random() * MAX_NUM_OF_SUBTRACKS) + 1).map(i => buildSubtrack(trackId, i + 1))
  return {
    id: `track-${trackId}`,
    title: COURSE_NAMES[`${trackId}` - 1],
    elements: buildElements(trackId),
    tracks,
    // hasButton: true, //링크 추가가능
    // link: 'www.google.com',
    isOpen: false,
  }
}
