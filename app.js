document.addEventListener('DOMContentLoaded', () => {
  const homeView = document.getElementById('home-view');
  const cameraView = document.getElementById('camera-view');
  const openCameraBtn = document.getElementById('open-camera-btn');
  const backBtn = document.getElementById('back-btn');
  const snapBtn = document.getElementById('snap-btn');

  const video = document.getElementById('webcam');
  const canvas = document.getElementById('canvas');
  const gallery = document.getElementById('gallery');
  const emptyState = document.getElementById('empty-state');

  let stream = null;

  // Apri Fotocamera
  openCameraBtn.addEventListener('click', async () => {
    homeView.style.display = 'none';
    cameraView.style.display = 'block';

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      video.srcObject = stream;
    } catch (err) {
      console.error("Errore fotocamera:", err);
      alert("Impossibile accedere alla fotocamera. Verifica i permessi del browser.");
      closeCamera();
    }
  });

  // Chiudi Fotocamera
  function closeCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    cameraView.style.display = 'none';
    homeView.style.display = 'block';
  }

  backBtn.addEventListener('click', closeCamera);

  // Scatta Foto
  snapBtn.addEventListener('click', () => {
    if (!video.videoWidth) return;

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/png');

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    addPhotoToGallery(imageDataUrl, timeString);
    closeCamera();
  });

  // Aggiungi alla Galleria Home
  function addPhotoToGallery(imageSrc, time) {
    if (emptyState) {
      emptyState.style.display = 'none';
    }

    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <img src="${imageSrc}" alt="Foto delle ${time}" />
      <div class="photo-time">Ore ${time}</div>
    `;

    gallery.prepend(card);
  }
});