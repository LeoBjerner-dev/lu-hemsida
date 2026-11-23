// Resizes the original photos in photos-src/ and writes mobile-sized WebP files
// to src/assets/photos/. Run with: npm run photos
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC_DIR = path.resolve('photos-src')
const OUT_DIR = path.resolve('src/assets/photos')

// Largest width each photo is ever shown at on a phone, times two for retina screens.
const MAX_WIDTH = {
  hero: 480,
  pizza: 360,
  selfie: 360,
  noche: 360,
  flores: 460,
}

await mkdir(OUT_DIR, { recursive: true })

const files = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))

for (const file of files) {
  const name = path.parse(file).name
  const width = MAX_WIDTH[name] ?? 480
  const out = path.join(OUT_DIR, `${name}.webp`)
  const info = await sharp(path.join(SRC_DIR, file))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(out)
  console.log(`${file} -> ${path.relative(process.cwd(), out)} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} kB)`)
}
