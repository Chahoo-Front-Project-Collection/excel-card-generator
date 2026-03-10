import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export async function captureElement(
  el: HTMLElement,
  fontEmbed: boolean,
): Promise<string> {
  return toPng(el, {
    pixelRatio: 2,
    cacheBust: true,
    ...(fontEmbed ? {} : { fontEmbedCSS: "" }),
    // fontEmbedCSS: "",
  });
}

export async function downloadSingleCard(
  el: HTMLElement,
  filename: string,
  fontEmbed: boolean,
) {
  const dataUrl = await captureElement(el, fontEmbed);
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export async function downloadAllCards(
  getEl: (index: number) => HTMLElement | null,
  total: number,
  onProgress: (current: number, total: number) => void,
  getFilename: (index: number) => string,
) {
  const zip = new JSZip();

  for (let i = 0; i < total; i++) {
    const el = getEl(i);
    if (!el) continue;

    const dataUrl = await captureElement(el, true);
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
    const filename = getFilename(i);
    zip.file(filename, base64, {
      base64: true,
    });

    onProgress(i + 1, total);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "cards.zip");
}
