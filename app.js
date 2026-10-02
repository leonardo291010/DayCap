const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const photoPreview = document.getElementById('photo-preview');
const snapBtn = document.getElementById('snap-btn');

// Avvia la fotocamera
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' }, // Cambia in 'environment' per usare la fotocamera posteriore su smartphone
      audio: false
    });
    video.srcObject = stream;
  } catch (err) {
    console.error("Errore nell'accesso alla fotocamera:", err);
    alert("Impossibile accedere alla fotocamera. Assicurati di aver concesso i permessi!");
  }
}

// Scatta la foto
snapBtn.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  
  // Imposta le dimensioni del canvas uguali a quelle del video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Disegna l'frame attuale del video sul canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Converte il canvas in un'immagine PNG
  const imageDataUrl = canvas.toDataURL('image/png');
  
  // Mostra l'immagine catturata e nasconde il video live
  photoPreview.src = imageDataUrl;
  photoPreview.style.display = 'block';
  video.style.display = 'none';
  
  snapBtn.innerText = "Foto Scattata!";
  snapBtn.disabled = true;
});

// Inizializza all'avvio della pagina
initCamera();