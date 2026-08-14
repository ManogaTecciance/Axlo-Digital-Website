# Hero imagery

Both files here are **brand-toned placeholders**, generated so the hero mosaic
renders with nothing 404-ing. Replace each with the real asset using the same
filename — no code change is needed.

| File | Tile | Crop expects | Intended image |
| --- | --- | --- | --- |
| `hero-operations.jpg` | Wide tile, left | Landscape (16:9 desktop, 16:10 mobile) | The layered-system render: data flowing from one strand into a sequence of transparent processing panels |
| `hero-insight.jpg` | Quote card background | Portrait (~3:4) | Hands with the data-visualisation magazine spread |

## Cropping

Do **not** pre-crop to exact pixel dimensions. Each tile applies
`object-fit: cover` against its own aspect ratio, so the browser crops from the
centre and the row stays intact at every breakpoint. Export a sensibly-sized
master instead:

- `hero-operations.jpg`: ~2400 × 1350. The tile is roughly 2:1 at desktop and
  crops from the centre, so keep the flow-into-panels action in the middle
  band — the extreme top and bottom of a 16:9 source will be trimmed.
- `hero-insight.jpg`: ~1400 × 1900.

Progressive JPEG, quality ~80, sRGB, under about 400 KB each. Next.js re-encodes
to AVIF/WebP at request time, so the source only needs to be clean, not small.

## Colour treatment

The wide tile applies a **teal duotone** — `.tileWide::before` in
`Hero.module.css` lays `--kinetic-teal` over the image with `mix-blend-mode:
color` at 85%. That keeps the render's luminance and structure while replacing
its royal blue with the Axlo hue. Lower the `opacity` to let the original colour
through, or delete the rule to switch it off entirely.

`hero-insight.jpg` sits behind the positioning statement at 28% opacity under a
teal-to-midnight scrim, so its detail barely reads — pick the frame with the
strongest shapes rather than the most legible one.

## Alt text

Alt text is authored in `components/sections/Hero.tsx`. If you swap in a
different subject, update the `alt` value to match — the quote-card image is
decorative and intentionally carries an empty `alt`.
