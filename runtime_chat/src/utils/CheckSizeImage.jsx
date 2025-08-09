 export function getImageAspectType(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const ratio = img.width / img.height;

      if (ratio > 1.05) {
          resolve("HORIZONTAL");
      } else if (ratio < 0.95) {
          resolve("VERTICAL");
      } else {
        resolve("SQUARE");
      }
    };
    img.onerror = () => reject(new Error("Cannot load image"));
  });
}