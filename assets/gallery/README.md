# Gallery Photos

Drop JPG files into the matching subfolder, then list them in
`public/data/gallery.json`.

## Folder structure

```
gallery/
├── beach/      # Sea, sand, beach loungers, sunsets
├── pools/      # Main pool, beach pool, kids splash, jacuzzi
├── dining/     # Al Kasr, The Gazebo, La Cucina, bars
├── rooms/      # Standard, deluxe, suites, balconies
├── spa/        # Treatment rooms, jacuzzi, sauna
└── grounds/    # Lobby, gardens, palm trees, fountains
```

## How to add photos

1. **Resize** images to ~1600px wide, ~80% JPG quality (keeps file size
   small while preserving sharpness on retina screens).
2. **Drop** them into the right subfolder (e.g.
   `gallery/beach/sunrise-01.jpg`).
3. **List** each file in `public/data/gallery.json` under its category's
   `photos` array:

   ```json
   "photos": [
     {
       "src": "assets/gallery/beach/sunrise-01.jpg",
       "caption": { "en": "Sunrise on the private beach", "ar": "...", "de": "...", "ru": "..." }
     }
   ]
   ```

4. `caption` can be a plain string if you don't want translations.
5. Commit and push — they appear automatically.

## Image guidelines

- **Width:** 1600px (good on phones + tablets, sharp on retina)
- **Quality:** 75–85% JPG
- **File size target:** under 250 KB each
- **Aspect ratio:** mix landscape (16:9 or 3:2) and portrait — the grid
  adapts to both.
- **No people identifiable** unless you have explicit permission.
