export function convertSvgToPng(svgDataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    // If it's already a PNG, return immediately
    if (svgDataUrl.startsWith('data:image/png')) {
      return resolve(svgDataUrl);
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width || 640;
        canvas.height = img.height || 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0d1117';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL('image/png');
          resolve(pngUrl);
        } else {
          resolve(svgDataUrl);
        }
      } catch (e) {
        resolve(svgDataUrl);
      }
    };

    img.onerror = () => {
      resolve(svgDataUrl);
    };

    img.src = svgDataUrl;
  });
}
