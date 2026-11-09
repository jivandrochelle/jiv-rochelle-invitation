import { ATTIRE_PALETTES, getGuestNativeFamily } from './attire.js'
import { PRECISE_FABRIC_CONTOURS } from './attireFabricContours.js'
import { CUTOUT_FABRIC_REPAIRS } from './attireCutoutRepairs.js'

// Garment boundaries on the original first-shade portraits. The cutouts keep
// skin, jewelry, handbags, and the cream wrap in their original colors.
export const GARMENT_AREAS = {
  'right-female-2': {
    outline: [[250,165],[315,164],[332,168],[335,175],[342,180],[346,185],[350,190],[353,195],[355,200],[357,205],[365,208],[370,210],[379,213],[384,215],[393,220],[401,225],[407,230],[411,235],[415,240],[420,245],[422,240],[425,235],[428,230],[431,225],[433,220],[437,215],[442,210],[441,205],[440,200],[439,195],[436,190],[434,185],[433,180],[430,175],[427,170],[520,165],[600,960],[170,960]],
    cutouts: [
      [[303,218],[306,215],[312,214],[317,216],[320,219],[322,225],[323,229],[327,231],[328,233],[332,234],[336,236],[337,238],[335,242],[336,250],[336,258],[335,270],[333,280],[330,294],[327,310],[329,326],[345,343],[364,363],[382,380],[402,398],[419,414],[427,427],[430,439],[427,445],[423,450],[415,453],[407,450],[402,444],[398,432],[391,422],[374,409],[356,397],[340,383],[324,369],[310,354],[298,340],[293,329],[293,315],[295,297],[296,285],[298,275],[299,265],[299,250],[299,238],[301,230],[302,223]],
      [[452,264],[459,259],[465,257],[470,267],[471,270],[472,280],[478,290],[480,300],[480,310],[483,320],[484,330],[482,340],[481,350],[478,360],[473,370],[466,380],[458,390],[454,400],[448,410],[443,420],[438,430],[432,440],[422,451],[414,451],[412,441],[415,431],[416,421],[421,411],[427,400],[434,390],[439,380],[443,370],[446,360],[447,350],[449,340],[450,330],[449,320],[444,310],[443,300],[443,290],[443,280],[447,270]],
    ],
  },
  'right-female-1': {
    outline: [[276,212],[290,215],[306,222],[323,233],[338,242],[351,226],[368,216],[383,209],[393,225],[391,249],[380,271],[377,293],[378,307],[386,326],[398,346],[410,377],[425,416],[430,461],[445,540],[480,700],[560,960],[75,960],[129,780],[160,680],[182,590],[204,519],[221,450],[232,403],[254,363],[268,337],[278,318],[281,308],[279,294],[271,275],[261,258],[259,244],[262,227]],
    cutouts: [
      [[260,327],[272,329],[278,335],[285,340],[294,345],[301,350],[308,355],[318,360],[321,365],[334,370],[341,375],[347,380],[354,385],[360,392],[366,402],[370,412],[367,422],[358,421],[350,412],[344,402],[337,394],[329,388],[320,381],[311,377],[302,373],[291,368],[280,363],[269,358],[258,353],[247,348],[239,344],[246,337],[254,331]],
      [[391,327],[402,330],[412,340],[407,354],[399,372],[390,390],[381,407],[371,421],[361,424],[355,418],[356,409],[364,397],[372,384],[380,366],[385,349],[385,337]],
      [[315,407],[323,405],[391,394],[399,397],[405,424],[408,440],[403,447],[332,457],[321,453],[318,440]],
      [[297,356],[308,355],[317,360],[319,368],[311,382],[302,382],[296,377],[292,369]],
      [[210,264],[228,278],[250,287],[265,302],[275,318],[277,328],[268,337],[252,346],[240,359],[234,382],[228,406],[223,433],[218,459],[213,479],[219,491],[223,504],[219,518],[211,531],[207,550],[197,573],[189,582],[170,585],[155,525],[165,443],[184,375],[186,350],[186,312],[189,290],[201,269]],
      [[404,281],[396,287],[387,299],[382,311],[381,323],[384,331],[395,327],[405,332],[412,340],[413,353],[416,370],[419,390],[419,410],[422,430],[425,450],[428,470],[433,490],[434,503],[428,513],[424,522],[437,513],[447,491],[449,464],[444,438],[438,415],[438,388],[440,360],[441,338],[430,312],[429,286]],
    ],
    extra: [
      [[259.5,173],[262.5,177],[265.2,181],[266.7,185],[269.3,189],[270.6,193],[271.7,197],[273.5,201],[275.1,205],[276.5,209],[277.3,213],[280.3,213],[279.5,209],[278.1,205],[276.5,201],[274.7,197],[273.6,193],[272.3,189],[269.7,185],[268.2,181],[265.5,177],[262.5,173]],
      [[373,165],[378,165],[381,178],[383,194],[387,211],[382,214],[380,198],[377,182]],
    ],
  },
  'left-female-1': {
    outline: [[180,160],[270,160],[271,164],[271,167],[272,170],[276,173],[277,176],[280,179],[282,182],[286,185],[287,188],[294,192],[302,196],[302,200],[310,204],[316,208],[322,212],[326,216],[330,220],[334,224],[338,228],[340,232],[347,235],[358,217],[370,201],[376,186],[378,176],[450,170],[560,960],[100,960]],
    cutouts: [
      [[253,249],[257,248],[261,250],[265,253],[268,258],[269,264],[267,272],[268,281],[274,288],[271,299],[267,310],[266,319],[275,335],[288,351],[295,370],[303,380],[309,388],[316,398],[319,405],[324,411],[330,418],[337,423],[345,431],[352,439],[358,448],[363,457],[359,465],[351,472],[344,472],[337,466],[330,455],[322,443],[314,434],[308,425],[301,420],[300,416],[296,408],[290,398],[282,387],[273,377],[264,366],[255,354],[246,342],[239,331],[235,321],[235,305],[234,290],[234,279],[244,276],[248,272],[252,268],[255,263],[257,258]],
      [[375,278],[378,276],[384,276],[388,280],[392,284],[396,287],[400,287],[405,288],[407,291],[407,303],[409,319],[407,340],[395,361],[386,382],[379,402],[370,423],[362,444],[354,460],[347,462],[341,450],[340,437],[347,423],[355,405],[364,384],[370,363],[376,340],[379,320],[376,308],[375,295]],
      [[298,450],[304,447],[348,436],[365,429],[373,438],[383,467],[384,476],[375,480],[321,500],[313,499],[310,489]],
      [[302,403],[308,400],[315,398],[321,401],[322,406],[318,410],[310,414],[305,418],[299,417],[297,412]],
    ],
  },
  'right-male-1': {
    outline: [[294,160],[312,158],[321,176],[318,202],[329,260],[313,311],[298,264],[297,196],[301,176]],
    cutouts: [],
    extra: [[[310,375],[322,391],[313,404],[310,398]]],
  },
  'left-male-1': {
    outline: [[298,128],[302,150],[313,167],[330,141],[348,123],[351,140],[332,193],[319,242],[320,291],[337,371],[314,377],[270,374],[276,305],[280,248],[278,180],[277,146]],
    cutouts: [],
    extra: [[[211,463],[232,468],[231,480],[210,475]], [[372,414],[400,434],[395,445],[369,425]]],
  },
  'left-male-2': {
    outline: [[284,133],[309,150],[319,177],[330,146],[342,128],[351,160],[343,206],[351,292],[346,353],[358,377],[281,379],[289,352],[289,297],[282,205],[275,165]],
    cutouts: [],
    extra: [[[208,432],[230,424],[237,435],[216,448]], [[405,430],[422,439],[418,450],[400,438]]],
  },
}

export const polygonPath = points => `M${points.map(point => point.join(',')).join('L')}Z`
export const getFabricPolygons = guest => PRECISE_FABRIC_CONTOURS[guest.id] ?? [GARMENT_AREAS[guest.id].outline, ...(GARMENT_AREAS[guest.id].extra ?? [])]
export const getFabricRepairPolygons = guest => CUTOUT_FABRIC_REPAIRS[guest.id] ?? []

export function getGarmentMaskSource(guest) {
  const width = guest.width ?? 640
  const area = GARMENT_AREAS[guest.id]
  const fabric = getFabricPolygons(guest).map(points => `<path d="${polygonPath(points)}" fill="red"/>`).join('')
  const details = area.cutouts.map(points => `<path d="${polygonPath(points)}" fill="black"/>`).join('')
  // Red carries normal coverage; green marks source-confirmed fabric that an
  // intentionally generous skin/accessory cutout previously left untouched.
  const repairPath = getFabricRepairPolygons(guest).map(polygonPath).join('')
  const repairs = repairPath ? `<path d="${repairPath}" fill="yellow" fill-rule="evenodd"/>` : ''
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="960" viewBox="0 0 ${width} 960"><rect width="100%" height="100%" fill="black"/>${fabric}${details}${repairs}</svg>`)}`
}

// Extend protection around the arm outlines, then distinguish warm skin from
// pink fabric using a softly averaged source color. This catches fingertips
// and embroidered skin edges that fall just outside a traced polygon.
export const SKIN_GUARD_RADIUS = 14
export const SKIN_TONE_MATRIX = [-32, 96, -64, 0, 1]
export const getSkinToneMatrix = guest => guest.gender === 'female' ? SKIN_TONE_MATRIX : [8, 0, -8, 0, -.3]
export const SKIN_GUARD_SMOOTHING = 2
export const SKIN_FRINGE_ALPHA = 7 / 8
export const SKIN_GUARDS = {
  'right-female-2': { starts: [280, 295] },
  'right-female-1': { starts: [328, 330] },
  'left-female-1': { starts: [315, 325] },
  'right-male-1': { rects: [[160,475,70,90],[385,420,45,55],[270,110,75,55]] },
  'left-male-1': { rects: [[195,462,50,100],[365,412,50,65],[265,110,90,65]] },
  'left-male-2': { rects: [[195,425,50,60],[395,425,45,60],[265,115,90,65]] },
}

export function getSkinGuardSource(guest) {
  const width = guest.width ?? 640
  const guard = SKIN_GUARDS[guest.id]
  const paths = guest.gender === 'female'
    ? GARMENT_AREAS[guest.id].cutouts.slice(0, 2).map((points, index) => `<defs><clipPath id="arm-${index}"><rect x="0" y="${guard.starts[index]}" width="${width}" height="960"/></clipPath></defs><path d="${polygonPath(points)}" fill="white" stroke="white" stroke-width="${SKIN_GUARD_RADIUS * 2}" stroke-linejoin="round" stroke-linecap="round" clip-path="url(#arm-${index})"/>`).join('')
    : guard.rects.map(([x,y,w,h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="white"/>`).join('')
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="960" viewBox="0 0 ${width} 960">${paths}</svg>`)}`
}

const rgb = hex => [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16) / 255)

// A piecewise color curve keeps dark stitching dark and highlights white while
// mapping the original fabric color to the selected swatch, in sRGB space.
export function colorChannelTable(source, target) {
  return Array.from({ length: 33 }, (_, index) => {
    const value = index / 32
    return value <= source
      ? value * target / source
      : target + (value - source) * (1 - target) / (1 - source)
  })
}

export function getGuestRecolor(guest, choice) {
  const family = getGuestNativeFamily(guest)
  if (!choice || choice.family === family) return null
  const source = rgb(ATTIRE_PALETTES.find(palette => palette.family === family).colors[0][1])
  const target = rgb(choice.color)
  const luminance = source[0] * .2126 + source[1] * .7152 + source[2] * .0722
  return target.map(channel => colorChannelTable(luminance, channel))
}
