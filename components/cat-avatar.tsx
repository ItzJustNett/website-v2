"use client"

const CAT_IMAGES: Record<number, string> = {
  0: "/orange.png",
  1: "/gray.png",
  2: "/black.png",
}

type ItemPosition = "head" | "face" | "neck" | "side"

const ITEM_POSITIONS: Record<string, ItemPosition> = {
  hat: "head",
  cap: "head",
  crown: "head",
  "top-hat": "head",
  "party-hat": "head",
  "wizard-hat": "head",
  "pirate-hat": "head",
  "santa-hat": "head",
  "chef-hat": "head",
  beret: "head",
  headphones: "head",

  sunglasses: "face",
  glasses: "face",
  monocle: "face",
  moustache: "face",
  goggles: "face",

  "bow-tie": "neck",
  tie: "neck",
  scarf: "neck",
  collar: "neck",
  necklace: "neck",
  badge: "neck",

  butterfly: "side",
  flower: "side",
  bow: "side",
  bandana: "side",
}

const ITEM_IMAGES: Record<string, string> = {
  sunglasses: "/sunglasses.png",
}

// Per-cat style overrides for image items: [catId][itemId] → { scale, offsetY }
const IMAGE_CAT_OVERRIDES: Record<number, Record<string, { scale: number; offsetY: number; offsetX?: number; rotate?: number }>> = {
  0: { // orange cat
    sunglasses: { scale: 3, offsetY: -90, offsetX: -2, rotate: 3 },
  },
  1: { // gray cat
    sunglasses: { scale: 3, offsetY: -90, offsetX: 2 },
  },
  2: { // black cat
    sunglasses: { scale: 3, offsetY: -90, offsetX: -2 },
  },
}

const ITEM_EMOJIS: Record<string, string> = {
  cap: "\u{1F9E2}",
  moustache: "\u{1F978}",
  butterfly: "\u{1F98B}",
  "bow-tie": "\u{1F380}",
  crown: "\u{1F451}",
  glasses: "\u{1F913}",
  "party-hat": "\u{1F389}",
  scarf: "\u{1F9E3}",
  bandana: "\u{1F3F4}\u200D\u2620\uFE0F",
  flower: "\u{1F338}",
  bow: "\u{1F380}",
  "top-hat": "\u{1F3A9}",
  hat: "\u{1F3A9}",
  headphones: "\u{1F3A7}",
  "wizard-hat": "\u2728",
  "pirate-hat": "\u{1F3F4}\u200D\u2620\uFE0F",
  "santa-hat": "\u{1F385}",
  "chef-hat": "\u{1F468}\u200D\u{1F373}",
  beret: "\u{1F3A8}",
  necklace: "\u{1F48E}",
  monocle: "\u{1F9D0}",
  tie: "\u{1F454}",
  collar: "\u{1F537}",
  badge: "\u2B50",
  goggles: "\u{1F97D}",
}

const POSITION_STYLES: Record<ItemPosition, string> = {
  head: "top-[2%] left-1/2 -translate-x-1/2",
  face: "top-[30%] left-1/2 -translate-x-1/2",
  neck: "bottom-[15%] left-1/2 -translate-x-1/2",
  side: "top-[10%] right-[5%]",
}

interface CatAvatarProps {
  catId: number
  equippedItems?: string[]
  size?: number
}

export function CatAvatar({ catId, equippedItems = [], size = 192 }: CatAvatarProps) {
  const imgSrc = CAT_IMAGES[catId] || CAT_IMAGES[0]
  const emojiSize = Math.max(size * 0.22, 24)

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <img
        src={imgSrc}
        alt="Your cat"
        className="w-full h-full object-contain"
      />
      {equippedItems.map((itemId) => {
        const image = ITEM_IMAGES[itemId]
        const emoji = ITEM_EMOJIS[itemId]
        const position = ITEM_POSITIONS[itemId] || "head"
        if (!image && !emoji) return null
        return (
          <div
            key={itemId}
            className={`absolute ${POSITION_STYLES[position]} pointer-events-none select-none`}
          >
            {image ? (() => {
              const overrides = IMAGE_CAT_OVERRIDES[catId]?.[itemId]
              const scale = overrides?.scale ?? 1
              const offsetY = overrides?.offsetY ?? 0
              const offsetX = overrides?.offsetX ?? 0
              const rotate = overrides?.rotate ?? 0
              const imgSize = emojiSize * 1.5 * scale
              return (
                <img
                  src={image}
                  alt={itemId}
                  style={{ width: imgSize, height: imgSize, marginTop: offsetY, marginLeft: offsetX, transform: rotate ? `rotate(${rotate}deg)` : undefined }}
                  className="object-contain"
                />
              )
            })() : (
              <span style={{ fontSize: emojiSize }} role="img" aria-label={itemId}>
                {emoji}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
