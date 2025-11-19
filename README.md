# ColorAIzer

Virtual hair color try-on application powered by AI. See how different hair colors look on you in real-time using your webcam.

## Features

- **Real-time hair color overlay** - Uses MediaPipe for hair segmentation
- **Custom color picker** - Choose any hair color with adjustable opacity
- **Capture & compare** - Take snapshots to compare before/after looks
- **Responsive design** - Works on desktop and mobile devices

## Tech Stack

- [Next.js 16](https://nextjs.org) - React framework
- [React 19](https://react.dev) - UI library
- [MediaPipe](https://developers.google.com/mediapipe) - Hair segmentation
- [Tailwind CSS 4](https://tailwindcss.com) - Styling
- [TypeScript](https://www.typescriptlang.org) - Type safety

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/coloraizer.git
cd coloraizer

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Usage

1. Allow camera access when prompted
2. Select a hair color using the color picker or preset swatches
3. Adjust the opacity slider to control color intensity
4. Click the capture button to take a snapshot
5. Compare the original and colored versions side by side

## Project Structure

```
coloraizer/
├── app/
│   ├── page.tsx        # Main application page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/
│   ├── WebcamView.tsx      # Webcam feed with hair segmentation
│   ├── ColorControls.tsx   # Color picker and opacity controls
│   └── ComparisonView.tsx  # Before/after comparison modal
└── public/
    └── ...                 # Static assets
```

## License

MIT
