const startButton = document.getElementById('startCamera');
const localVideo = document.getElementById('localVideo');
const linkDisplay = document.getElementById('linkDisplay');
const viewLink = document.getElementById('viewLink');

let peer;
let localStream;

startButton.addEventListener('click', async () => {
  try {
    // Request camera access
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    localVideo.srcObject = localStream;
    localVideo.style.display = 'block';

    // Generate unique peer ID (use a library like uuid in production)
    const peerId = 'user-' + Math.random().toString(36).substr(2, 9);

    // Initialize PeerJS as caller
    peer = new Peer(peerId, {
      host: window.location.hostname,
      port: window.location.port || 443,
      path: '/peerjs',
      secure: window.location.protocol === 'https:'
    });

    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      // Display the view link for the owner
      const viewUrl = `${window.location.origin}/view?id=${id}`;
      viewLink.href = viewUrl;
      viewLink.textContent = viewUrl;
      linkDisplay.style.display = 'block';
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      alert('Connection error. Try again.');
    });

    // Note: No call is made here; the owner will connect from the viewer page.

  } catch (error) {
    console.error('Camera access denied or error:', error);
    alert('Camera access required. Please allow and try again.');
  }
});

// Stop stream when page unloads
window.addEventListener('beforeunload', () => {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }
  if (peer) {
    peer.destroy();
  }
});
