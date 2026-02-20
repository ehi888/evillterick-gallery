// ============================================================
// CONFIG — Edit this to add/remove artworks
// ============================================================
const CYCLE_SECONDS = 15; // how long each artwork stays on screen
const SHUFFLE = true;     // randomize order on each full loop

const artworks = [
  {
    image: "images/mona-lisa.jpg",
    title: "The Mona IT-sa",
    artist: "E.Vill-IT-Erick da Vinci, 1503",
    location: "Musee du Louvre, Paris"
  },
  {
    image: "images/pearl-earring.jpg",
    title: "Guy with a Pearl AirPod",
    artist: "E.Vill-IT-Erick Vermeer, 1665",
    location: "Mauritshuis, The Hague"
  },
  {
    image: "images/van-gogh.jpg",
    title: "Self-Portrait of a Help Desk Hero",
    artist: "E.Vill-IT-Erick van Gogh, 1889",
    location: "Musee d'Orsay, Paris"
  },
  {
    image: "images/the-scream.jpg",
    title: "The Scream (When WiFi Goes Down)",
    artist: "E.Vill-IT-Erick Munch, 1893",
    location: "National Gallery, Oslo"
  },
  {
    image: "images/napoleon.jpg",
    title: "E.Vill-IT-Erick Crossing the Server Room",
    artist: "Jacques-Louis David, 1801",
    location: "Chateau de Malmaison, Paris"
  },
  {
    image: "images/creation-of-adam.jpg",
    title: "The Creation of Admin Access",
    artist: "E.Vill-IT-Erickangelo, 1512",
    location: "Sistine Chapel, Vatican City"
  },
  {
    image: "images/son-of-man.jpg",
    title: "The Son of LAN",
    artist: "E.Vill-IT-Erick Magritte, 1964",
    location: "Private Collection"
  },
  {
    image: "images/warhol.jpg",
    title: "Have You Tried Turning It Off and On Again?",
    artist: "E.Vill-IT-Erick Warhol, 1962",
    location: "MoMA, New York"
  },
  {
    image: "images/american-gothic.jpg",
    title: "American IT Gothic",
    artist: "E.Vill-IT-Erick Wood, 1930",
    location: "Art Institute of Chicago"
  },
  {
    image: "images/frida.jpg",
    title: "Self-Portrait with Ethernet Cable",
    artist: "Frida E.Vill-IT-Erick, 1940",
    location: "Harry Ransom Center, Austin"
  },
  {
    image: "images/dogs-poker.jpg",
    title: "A Ticket in Need",
    artist: "C.M. E.Vill-IT-Erick, 1903",
    location: "The IT Break Room"
  },
  {
    image: "images/great-wave.jpg",
    title: "The Great Wave of Support Tickets",
    artist: "E.Vill-IT-Erick Hokusai, 1831",
    location: "Metropolitan Museum of Art, New York"
  },
  {
    image: "images/birth-of-venus.jpg",
    title: "The Birth of VPN Access",
    artist: "E.Vill-IT-Erick Botticelli, 1485",
    location: "Uffizi Gallery, Florence"
  },
  {
    image: "images/whistlers-mother.jpg",
    title: "E.Vill-IT-Erick's Mother(board)",
    artist: "James McNeill Whistler, 1871",
    location: "Musee d'Orsay, Paris"
  },
  {
    image: "images/persistence-of-memory.jpg",
    title: "The Persistence of Memory (Leaks)",
    artist: "Salvador E.Vill-IT-Erick, 1931",
    location: "MoMA, New York"
  }
];

// ============================================================
// ENGINE — No need to touch below
// ============================================================
let order = [...Array(artworks.length).keys()];
let currentIndex = -1;
let useSlideA = true;
let timer = null;

const slideA = document.getElementById("slide-a");
const slideB = document.getElementById("slide-b");
const caption = document.getElementById("caption");
const captionTitle = document.getElementById("caption-title");
const captionArtist = document.getElementById("caption-artist");
const captionLocation = document.getElementById("caption-location");
const progressBar = document.getElementById("progress-bar");

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
}

function startProgress() {
  progressBar.classList.remove("animating");
  progressBar.style.width = "0%";
  // force reflow
  progressBar.offsetWidth;
  progressBar.classList.add("animating");
  progressBar.style.transitionDuration = CYCLE_SECONDS + "s";
  progressBar.style.width = "100%";
}

async function showNext() {
  currentIndex++;

  // reshuffle at the start of each loop
  if (currentIndex >= order.length) {
    currentIndex = 0;
    if (SHUFFLE) shuffleArray(order);
  }

  const artwork = artworks[order[currentIndex]];

  // preload
  try {
    await preloadImage(artwork.image);
  } catch (e) {
    // skip missing images
    if (artworks.length > 1) {
      showNext();
      return;
    }
  }

  // crossfade
  const incoming = useSlideA ? slideA : slideB;
  const outgoing = useSlideA ? slideB : slideA;

  incoming.style.backgroundImage = `url('${artwork.image}')`;
  incoming.classList.add("active");
  outgoing.classList.remove("active");
  useSlideA = !useSlideA;

  // caption
  caption.classList.remove("visible");
  setTimeout(() => {
    captionTitle.textContent = artwork.title;
    captionArtist.textContent = artwork.artist;
    captionLocation.textContent = artwork.location;
    caption.classList.add("visible");
  }, 800);

  // preload next
  const nextIndex = (currentIndex + 1) % order.length;
  preloadImage(artworks[order[nextIndex]].image).catch(() => {});

  // progress bar
  startProgress();

  // schedule next
  clearTimeout(timer);
  timer = setTimeout(showNext, CYCLE_SECONDS * 1000);
}

// keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === " ") {
    clearTimeout(timer);
    showNext();
  }
  if (e.key === "ArrowLeft") {
    currentIndex = Math.max(-1, currentIndex - 2);
    clearTimeout(timer);
    showNext();
  }
});

// click to advance
document.addEventListener("click", () => {
  clearTimeout(timer);
  showNext();
});

// initial shuffle and start
if (SHUFFLE) shuffleArray(order);
showNext();
