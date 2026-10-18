import {vi} from 'vitest';

/**
 * Captures what `downloadTsv` (file-saver underneath) would save: every call of the
 * returned mock is `(fileName, textContent)`, made synchronously with the save.
 * ES module exports cannot be spied on under Vitest, so the capture sits on the
 * browser APIs file-saver uses: it sets `<a>.download`, then `URL.createObjectURL`
 * for the Blob, and clicks the anchor later on a timer.
 * Call `restore()` when the test is done.
 */
export function captureDownloads() {
  const downloads = vi.fn<(fileName: string, text: string) => void>();
  const RealBlob = globalThis.Blob;
  const texts = new WeakMap<object, string>();
  const originalCreate = (URL as any).createObjectURL;
  const originalRevoke = (URL as any).revokeObjectURL;

  class CapturingBlob extends RealBlob {
    constructor(parts?: BlobPart[], options?: BlobPropertyBag) {
      super(parts, options);
      texts.set(this, (parts ?? []).map(String).join(''));
    }
  }

  let fileName = '';
  vi.stubGlobal('Blob', CapturingBlob);
  const downloadSetter = vi
    .spyOn(HTMLAnchorElement.prototype, 'download', 'set')
    .mockImplementation((name: string) => {
      fileName = name;
    });
  (URL as any).createObjectURL = vi.fn((blob: object) => {
    downloads(fileName, texts.get(blob) ?? '');
    return 'blob:stub';
  });
  (URL as any).revokeObjectURL = vi.fn();
  // file-saver clicks the anchor on a timer; there is nothing to navigate to here.
  const realDispatch = EventTarget.prototype.dispatchEvent;
  const dispatchSpy = vi
    .spyOn(EventTarget.prototype, 'dispatchEvent')
    .mockImplementation(function (this: EventTarget, event: Event) {
      if (this instanceof HTMLAnchorElement && event.type === 'click') {
        return true;
      }
      return realDispatch.call(this, event);
    });

  return {
    downloads,
    restore: () => {
      dispatchSpy.mockRestore();
      downloadSetter.mockRestore();
      vi.unstubAllGlobals();
      (URL as any).createObjectURL = originalCreate;
      (URL as any).revokeObjectURL = originalRevoke;
    },
  };
}
