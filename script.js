const pieces = document.querySelectorAll('.piece');
const zones = document.querySelectorAll('.drop-zone');
const checkButton = document.getElementById('check-button');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const closePopup = document.getElementById('close-popup');

// دعم السحب والإفلات باستخدام الماوس واللمس
pieces.forEach(piece => {
  piece.addEventListener('dragstart', dragStart);
  piece.addEventListener('dragend', dragEnd);
  piece.addEventListener('touchstart', touchStart);
  piece.addEventListener('touchmove', touchMove);
  piece.addEventListener('touchend', touchEnd);
});

zones.forEach(zone => {
  zone.addEventListener('dragover', dragOver);
  zone.addEventListener('drop', dropPiece);
  zone.addEventListener('touchmove', allowTouchMove);
  zone.addEventListener('touchend', dropPieceOnTouch);
});

let draggedPiece = null;
let touchOffset = { x: 0, y: 0 };

function dragStart() {
  draggedPiece = this;
}

function dragEnd() {
  draggedPiece = null;
}

function dragOver(e) {
  e.preventDefault();
}

function dropPiece() {
  if (!this.hasChildNodes()) {
    this.appendChild(draggedPiece);
  }
}

function touchStart(e) {
  draggedPiece = this;
  const touch = e.touches[0];
  touchOffset.x = touch.clientX - this.getBoundingClientRect().left;
  touchOffset.y = touch.clientY - this.getBoundingClientRect().top;
  e.preventDefault();
}

function touchMove(e) {
  const touch = e.touches[0];
  draggedPiece.style.position = 'absolute';
  draggedPiece.style.left = `${touch.clientX - touchOffset.x}px`;
  draggedPiece.style.top = `${touch.clientY - touchOffset.y}px`;
  e.preventDefault();
}

function touchEnd(e) {
  draggedPiece.style.position = 'static';

  const pieceRect = draggedPiece.getBoundingClientRect();
  let closestZone = null;
  let closestDistance = Infinity;

  zones.forEach(zone => {
    const zoneRect = zone.getBoundingClientRect();
    const distance = Math.hypot(
      pieceRect.left - zoneRect.left,
      pieceRect.top - zoneRect.top
    );

    if (distance < closestDistance && !zone.hasChildNodes()) {
      closestDistance = distance;
      closestZone = zone;
    }
  });

  if (closestZone) {
    closestZone.appendChild(draggedPiece);
  }
  
  draggedPiece = null;
}

function allowTouchMove(e) {
  e.preventDefault();
}

function dropPieceOnTouch(e) {
  if (draggedPiece) {
    const touch = e.changedTouches[0];
    const zoneRect = this.getBoundingClientRect();

    if (touch.clientX > zoneRect.left && touch.clientX < zoneRect.right && 
        touch.clientY > zoneRect.top && touch.clientY < zoneRect.bottom) {
      if (!this.hasChildNodes()) {
        this.appendChild(draggedPiece);
      }
    }
  }
}

// تحقق من صحة تجميع البازل
checkButton.addEventListener('click', () => {
  let correct = true;

  zones.forEach((zone, index) => {
    const piece = zone.querySelector('img');
    if (piece && piece.id !== `piece-${index + 1}`) {
      correct = false;
    }
  });

  if (correct) {
    showPopup("You won! 🏆<br>Get ready for the 'Learn How to Learn' session!<br>Prepare for cinema surprises! 🎬");
  } else {
    showPopup("Try again! 😔");
  }
});

function showPopup(message) {
  popupMessage.innerHTML = message;
  popup.classList.remove('hidden');
}

closePopup.addEventListener('click', () => {
  popup.classList.add('hidden');
});
