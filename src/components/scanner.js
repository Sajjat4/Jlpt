const SAVED_SCANS_KEY = 'jlpt-scanner-saved-texts';

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');


export function createScanner(root) {
  if (!root) {
    return;
  }

  let selectedImage = null;
  let stream = null;
  const savedScans = readSavedScans();

  root.innerHTML = `
    <div class="scanner-grid">
      <article class="glass-card scanner-panel">
        <div class="control-row">
          <label class="field-label" for="ocrLanguage">OCR language</label>
          <select id="ocrLanguage" class="select-field">
            <option value="jpn" selected>Japanese</option>
            <option value="eng">English</option>
            <option value="ben">Bengali</option>
            <option value="jpn+eng">Japanese + English</option>
          </select>
        </div>

        <div class="scan-stage">
          <video id="cameraPreview" class="camera-preview" playsinline muted hidden></video>
          <canvas id="captureCanvas" hidden></canvas>
          <img id="imagePreview" class="image-preview" alt="Selected scan preview" hidden />
          <div id="emptyPreview" class="empty-preview">
            <span>📷</span>
            <strong>Camera or image upload</strong>
            <small>Use a clear, well-lit photo for the best OCR result.</small>
          </div>
        </div>

        <div class="button-grid">
          <button class="button primary" id="startCamera" type="button">Open camera</button>
          <button class="button secondary" id="capturePhoto" type="button" disabled>Capture</button>
          <label class="button secondary file-button" for="imageUpload">Upload image</label>
          <input id="imageUpload" class="sr-only" type="file" accept="image/*" />
          <button class="button accent" id="runOcr" type="button" disabled>Scan text</button>
        </div>
        <p id="ocrStatus" class="status-text" role="status">Ready to scan.</p>
      </article>

      <article class="glass-card result-panel">
        <div class="card-title-row">
          <div>
            <p class="eyebrow">Result</p>
            <h3>Scanned text</h3>
          </div>
          <span id="confidenceBadge" class="pill">OCR</span>
        </div>
        <textarea id="scanResult" class="result-textarea" placeholder="Recognized text will appear here..."></textarea>
        <div class="button-grid compact">
          <button class="button secondary" id="copyText" type="button">Copy</button>
          <button class="button secondary" id="saveText" type="button">Save</button>
          <button class="button secondary" id="downloadText" type="button">Download .txt</button>
        </div>
      </article>
    </div>

    <article class="glass-card saved-panel">
      <div class="card-title-row">
        <div>
          <p class="eyebrow">Saved</p>
          <h3>Saved OCR notes</h3>
        </div>
        <button class="text-button" id="clearSaved" type="button">Clear all</button>
      </div>
      <div id="savedScans" class="saved-list"></div>
    </article>
  `;

  const cameraPreview = root.querySelector('#cameraPreview');
  const captureCanvas = root.querySelector('#captureCanvas');
  const imagePreview = root.querySelector('#imagePreview');
  const emptyPreview = root.querySelector('#emptyPreview');
  const imageUpload = root.querySelector('#imageUpload');
  const startCameraButton = root.querySelector('#startCamera');
  const captureButton = root.querySelector('#capturePhoto');
  const runOcrButton = root.querySelector('#runOcr');
  const scanResult = root.querySelector('#scanResult');
  const statusText = root.querySelector('#ocrStatus');
  const languageSelect = root.querySelector('#ocrLanguage');
  const confidenceBadge = root.querySelector('#confidenceBadge');
  const copyButton = root.querySelector('#copyText');
  const saveButton = root.querySelector('#saveText');
  const downloadButton = root.querySelector('#downloadText');
  const savedScansList = root.querySelector('#savedScans');
  const clearSavedButton = root.querySelector('#clearSaved');

  function readSavedScans() {
    try {
      const storedScans = window.localStorage?.getItem(SAVED_SCANS_KEY);
      const parsedScans = JSON.parse(storedScans || '[]');

      if (!Array.isArray(parsedScans)) {
        return [];
      }

      return parsedScans
        .filter((scan) => typeof scan?.text === 'string')
        .map((scan) => ({
          text: scan.text,
          createdAt: typeof scan.createdAt === 'string' ? scan.createdAt : 'Saved scan',
        }));
    } catch {
      return [];
    }
  }

  function persistSavedScans() {
    try {
      window.localStorage?.setItem(SAVED_SCANS_KEY, JSON.stringify(savedScans));
      return true;
    } catch {
      statusText.textContent = 'Saved notes are unavailable in this browser session.';
      return false;
    }
  }

  function renderSavedScans() {
    savedScansList.innerHTML = savedScans.length
      ? savedScans.map((item, index) => `
        <button class="saved-item" type="button" data-scan-index="${index}">
          <strong>${escapeHtml(item.createdAt)}</strong>
          <span>${escapeHtml(item.text.slice(0, 120))}</span>
        </button>
      `).join('')
      : '<p class="empty-copy">No saved OCR notes yet.</p>';
  }

  function setSelectedImage(dataUrl) {
    selectedImage = dataUrl;
    imagePreview.src = dataUrl;
    imagePreview.hidden = false;
    emptyPreview.hidden = true;
    runOcrButton.disabled = false;
  }

  async function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    cameraPreview.hidden = true;
    captureButton.disabled = true;
  }

  startCameraButton.addEventListener('click', async () => {
    if (!window.navigator.mediaDevices?.getUserMedia) {
      statusText.textContent = 'Camera is not available in this browser. Try image upload instead.';
      return;
    }

    statusText.textContent = 'Opening camera...';
    try {
      stream = await window.navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      cameraPreview.srcObject = stream;
      cameraPreview.hidden = false;
      imagePreview.hidden = true;
      emptyPreview.hidden = true;
      await cameraPreview.play();
      captureButton.disabled = false;
      statusText.textContent = 'Camera ready. Tap Capture when the text is clear.';
    } catch {
      statusText.textContent = 'Camera permission was blocked or unavailable. Try uploading an image.';
    }
  });

  captureButton.addEventListener('click', async () => {
    captureCanvas.width = cameraPreview.videoWidth;
    captureCanvas.height = cameraPreview.videoHeight;
    captureCanvas.getContext('2d').drawImage(cameraPreview, 0, 0);
    setSelectedImage(captureCanvas.toDataURL('image/png'));
    statusText.textContent = 'Photo captured. Ready for OCR.';
    await stopCamera();
  });

  imageUpload.addEventListener('change', () => {
    const file = imageUpload.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setSelectedImage(reader.result);
      statusText.textContent = `${file.name} loaded. Ready for OCR.`;
    });
    reader.readAsDataURL(file);
  });

  runOcrButton.addEventListener('click', async () => {
    if (!selectedImage) return;

    runOcrButton.disabled = true;
    statusText.textContent = 'Scanning text with Tesseract.js...';
    if (!window.Tesseract) {
      statusText.textContent = 'OCR library is still loading or unavailable. Please refresh and try again.';
      runOcrButton.disabled = false;
      return;
    }

    try {
      const result = await window.Tesseract.recognize(selectedImage, languageSelect.value, {
        logger: (progress) => {
          if (progress.status === 'recognizing text') {
            statusText.textContent = `Recognizing text... ${Math.round(progress.progress * 100)}%`;
          }
        },
      });

      scanResult.value = result.data.text.trim();
      confidenceBadge.textContent = `${Math.round(result.data.confidence || 0)}% confidence`;
      statusText.textContent = scanResult.value ? 'Scan complete.' : 'Scan complete, but no text was detected.';
    } catch {
      statusText.textContent = 'OCR failed. Try a clearer image or a different language setting.';
    } finally {
      runOcrButton.disabled = false;
    }
  });

  copyButton.addEventListener('click', async () => {
    try {
      if (window.navigator.clipboard) {
        await window.navigator.clipboard.writeText(scanResult.value);
        statusText.textContent = 'Copied scanned text to clipboard.';
        return;
      }

      scanResult.select();
      document.execCommand('copy');
      statusText.textContent = 'Copied scanned text to clipboard.';
    } catch {
      statusText.textContent = 'Copy failed. Select the text and copy it manually.';
    }
  });

  saveButton.addEventListener('click', () => {
    const text = scanResult.value.trim();
    if (!text) {
      statusText.textContent = 'Nothing to save yet.';
      return;
    }

    savedScans.unshift({ text, createdAt: new Date().toLocaleString() });
    if (persistSavedScans()) {
      renderSavedScans();
      statusText.textContent = 'Saved OCR text locally.';
    }
  });

  downloadButton.addEventListener('click', () => {
    const blob = new Blob([scanResult.value], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.download = 'jlpt-scan.txt';
    link.click();
    URL.revokeObjectURL(objectUrl);
  });

  savedScansList.addEventListener('click', (event) => {
    const item = event.target.closest('[data-scan-index]');
    if (!item) return;
    const savedScan = savedScans[Number(item.dataset.scanIndex)];
    if (!savedScan) return;
    scanResult.value = savedScan.text;
  });

  clearSavedButton.addEventListener('click', () => {
    savedScans.length = 0;
    if (persistSavedScans()) {
      renderSavedScans();
    }
  });

  renderSavedScans();
}
