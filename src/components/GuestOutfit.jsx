import { useId } from 'react'
import { getGuestColorName } from '../attire.js'
import { getGarmentMaskSource, getGuestRecolor, getSkinGuardSource, getSkinToneMatrix, SKIN_GUARD_SMOOTHING } from '../attireRecolor.js'

export default function GuestOutfit({ guest, outfit, decorative = false }) {
  const id = useId().replaceAll(':', '')
  const curves = getGuestRecolor(guest, outfit.choice)
  const width = guest.width ?? 640
  const description = decorative ? '' : `Wedding guest wearing ${getGuestColorName(outfit.choice, guest.gender)} ${guest.gender === 'male' ? 'formalwear' : 'a gown'}`
  if (!curves) return <img src={outfit.source} width={width} height="960" loading="lazy" decoding="async" draggable="false" alt={description} />

  return <svg viewBox={`0 0 ${width} 960`} width={width} height="960" role={decorative ? undefined : 'img'} aria-label={description || undefined} aria-hidden={decorative || undefined} focusable="false">
    <defs>
      <filter id={`${id}-color`} colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" x="0" y="0" width={width} height="960">
        <feImage href={getGarmentMaskSource(guest)} x="0" y="0" width={width} height="960" preserveAspectRatio="none" result="boundaries" />
        <feColorMatrix in="boundaries" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="garment" />
        <feImage href={getSkinGuardSource(guest)} x="0" y="0" width={width} height="960" preserveAspectRatio="none" result="skin-boundaries" />
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="skin-sample" />
        <feColorMatrix in="skin-sample" type="matrix" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  ${getSkinToneMatrix(guest).join(' ')}`} result="skin-tone" />
        <feComponentTransfer in="skin-tone" result="skin-tone">
          <feFuncA type="discrete" tableValues="0 1" />
        </feComponentTransfer>
        <feMorphology in="skin-tone" operator="erode" radius={SKIN_GUARD_SMOOTHING} result="skin-tone" />
        <feMorphology in="skin-tone" operator="dilate" radius={SKIN_GUARD_SMOOTHING} result="skin-tone" />
        <feComposite in="skin-tone" in2="skin-boundaries" operator="in" result="skin" />
        <feComponentTransfer in="SourceAlpha" result="skin-fringe">
          <feFuncA type="discrete" tableValues="1 1 1 1 1 1 1 0" />
        </feComponentTransfer>
        <feComposite in="skin-fringe" in2="skin-boundaries" operator="in" result="skin-fringe" />
        <feComposite in="skin" in2="skin-fringe" operator="arithmetic" k2="1" k3="1" result="skin" />
        <feComposite in="garment" in2="skin" operator="out" result="garment" />
        <feColorMatrix in="boundaries" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 1 0 0 0" result="fabric-repairs" />
        <feComposite in="garment" in2="fabric-repairs" operator="arithmetic" k2="1" k3="1" result="garment" />
        {/* Neutralize the old fabric hue so pink stitching cannot show through blue. */}
        <feColorMatrix in="SourceGraphic" type="saturate" values="0" result="neutral" />
        <feComponentTransfer in="neutral" result="tinted">
          <feFuncR type="table" tableValues={curves[0].join(' ')} />
          <feFuncG type="table" tableValues={curves[1].join(' ')} />
          <feFuncB type="table" tableValues={curves[2].join(' ')} />
        </feComponentTransfer>
        <feComposite in="tinted" in2="garment" operator="in" result="clothing" />
        <feComposite in="SourceGraphic" in2="garment" operator="out" result="details" />
        {/* Add complementary regions so the original alpha is preserved once. */}
        <feComposite in="clothing" in2="details" operator="arithmetic" k2="1" k3="1" />
      </filter>
    </defs>
    <image href={outfit.source} width={width} height="960" filter={`url(#${id}-color)`} />
  </svg>
}
