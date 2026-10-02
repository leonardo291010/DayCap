document.addEventListener('DOMContentLoaded', () => {
  // Elementi
  const tabItems = document.querySelectorAll('.tab-bar .tab-item[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');
  const cameraView = document.getElementById('camera-view');
  const navCameraBtn = document.getElementById('nav-camera-btn');
  const backBtn = document.getElementById('back-btn');
  const snapBtn = document.getElementById('snap-btn');

  const video = document.getElementById('webcam');
  const canvas = document.getElementById('canvas');
  const gallery = document.getElementById('gallery');
  const emptyState = document.getElementById('empty-state');
  const slotBadge = document.getElementById('current-slot-badge');

  let stream = null;

  // CALCOLO DELLO SLOT ORARIO ATTUALE (es: "2026-10-02-17" per le ore 17:00-17:59)
  function getCurrentHourSlot() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}`;
  }

  // AGGIORNA INTERFACCIA ED EVENTUALI BLOCCHI ORARI
  function checkHourlySlot() {
    const currentHour = new Date().getHours();
    slotBadge.innerText = `Slot: ${currentHour}:00 - ${currentHour}:59`;

    const lastCapturedSlot = localStorage.getItem('daycap_last_slot');
    const currentSlot = getCurrentHourSlot();

    if (lastCapturedSlot === currentSlot) {
      navCameraBtn.classList.add('disabled');
      navCameraBtn.style.opacity = "0.4";
    } else {
      navCameraBtn.classList.remove('disabled');
      navCameraBtn.style.opacity = "1";
    }
  }

  // NAVIGAZIONE TAB
  tabItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');

      // Chiudi eventuale fotocamera aperta
      closeCamera();

      tabItems.forEach(i => i.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });

  // APRI FOTOCAMERA
  navCameraBtn.addEventListener('click', async () => {
    const lastCapturedSlot = localStorage.getItem('daycap_last_slot');
    const currentSlot = getCurrentHourSlot();

    if (lastCapturedSlot === currentSlot) {
      alert("Hai già scattato la tua foto per questa ora! Torna nella prossima fascia oraria. 😉");
      return;
    }

    // Nascondi le schede e mostra la fotocamera
    tabContents.forEach(c => c.classList.remove('active'));
    cameraView.style.display = 'block';

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      video.srcObject = stream;
    } catch (err) {
      alert("Impossibile accedere alla fotocamera.");
      closeCamera();
    }
  });

  // CHIUDI FOTOCAMERA
  function closeCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    cameraView.style.display = 'none';
    // Torna alla tab home
    document.getElementById('tab-home').classList.add('active');
  }

  backBtn.addEventListener('click', closeCamera);

  // SCATTA E SALVA
  snapBtn.addEventListener('click', () => {
    if (!video.videoWidth) return;

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/png');
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Salva lo slot orario per bloccare ulteriori scatti nell'ora corrente
    localStorage.setItem('daycap_last_slot', getCurrentHourSlot());

    addPhotoToGallery(imageDataUrl, timeString);
    closeCamera();
    checkHourlySlot();
  });

  // INSERISCI FOTO NELLA HOME
  function addPhotoToGallery(imageSrc, time) {
    if (emptyState) emptyState.style.display = 'none';

    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <img src="${imageSrc}" alt="Foto delle ${time}" />
      <div class="photo-time">Ore ${time}</div>
    `;

    gallery.prepend(card);
  }

  // Inizializza al caricamento
  checkHourlySlot();
});