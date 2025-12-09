// FNUF ULTIMATE FEAR - POPRAWIONY KOD
// ====================================

// GLOBALNE ZMIENNE
let gameState = {
    // Podstawowe
    currentVersion: 1,
    currentNight: 1,
    currentHour: 12,
    currentMinute: 0,
    power: 100,
    powerDrain: 0.2,
    isPowerOut: false,
    
    // Status gry
    gameActive: false,
    gamePaused: false,
    camerasActive: false,
    leftDoorClosed: false,
    rightDoorClosed: false,
    leftLightOn: false,
    rightLightOn: false,
    buzzerActive: false,
    jumpscareActive: false,
    nightCompleted: false,
    
    // Statystyki
    activeAnimatronics: 0,
    playerMoney: 0,
    gameTime: 0,
    
    // Ustawienia
    settings: {
        audio: {
            masterVolume: 70,
            musicVolume: 60,
            sfxVolume: 80
        },
        controls: {
            keybinds: {
                cameras: 'C',
                leftDoor: 'L',
                rightDoor: 'R',
                leftLight: 'Q',
                rightLight: 'E',
                buzzer: ' ',
                map: 'M',
                pause: 'P'
            }
        },
        hud: {
            mode: 'classic',
            size: 'medium',
            theme: 'green',
            opacity: 90,
            showHints: true,
            animations: true
        }
    }
};

// Animatroniki
const animatronics = {
    boltBear: {
        name: "Bolt Bear",
        position: 1,
        active: true,
        icon: "⚡",
        atLeftDoor: false,
        atRightDoor: false
    },
    sparkyFox: {
        name: "Sparky Fox",
        position: 4,
        active: true,
        icon: "🦊",
        atLeftDoor: false,
        atRightDoor: false
    }
};

// Lokacje kamer z opisami pomieszczeń
const cameraLocations = [
    { 
        id: 1, 
        name: "Scena Główna", 
        description: "Główna scena z animatronikami",
        roomType: "stage",
        hasAnimatronics: true,
        items: ["scena", "kurtyna", "reflektory"]
    },
    { 
        id: 2, 
        name: "Korytarz Główny", 
        description: "Główny korytarz prowadzący do biura",
        roomType: "hallway",
        hasLights: true,
        items: ["dywan", "obrazy", "doniczki"]
    },
    { 
        id: 3, 
        name: "Korytarz Lewy", 
        description: "Lewy korytarz przed biurem",
        roomType: "hallway",
        nearLeftDoor: true,
        items: ["schody", "tablica", "kamera"]
    },
    { 
        id: 4, 
        name: "Kuchnia", 
        description: "Kuchnia i jadalnia",
        roomType: "kitchen",
        hasUtensils: true,
        items: ["lodówka", "kuchenka", "stoły"]
    },
    { 
        id: 5, 
        name: "Pokój Zabaw", 
        description: "Pokój zabaw dla dzieci",
        roomType: "playroom",
        hasToys: true,
        items: ["zjeżdżalnia", "piłki", "konik"]
    },
    { 
        id: 6, 
        name: "Wentylacja A", 
        description: "System wentylacji - część A",
        roomType: "vent",
        isVent: true,
        items: ["kratki", "przewody", "filtr"]
    },
    { 
        id: 7, 
        name: "Przed Biurem", 
        description: "Obszar bezpośrednio przed biurem",
        roomType: "office_front",
        critical: true,
        items: ["krzesło", "biurko", "monitor"]
    },
    { 
        id: 8, 
        name: "Magazyn", 
        description: "Magazyn sprzętu i części zamiennych",
        roomType: "storage",
        hasBoxes: true,
        items: ["skrzynie", "narzędzia", "części"]
    },
    { 
        id: 9, 
        name: "Wentylacja B", 
        description: "System wentylacji - część B",
        roomType: "vent",
        isVent: true,
        items: ["silnik", "wentylator", "czujniki"]
    },
    { 
        id: 10, 
        name: "Za Biurem", 
        description: "Tajny obszar za biurem",
        roomType: "hidden",
        hidden: true,
        items: ["kable", "serwer", "archiwa"]
    },
    { 
        id: 11, 
        name: "Prawy Korytarz", 
        description: "Prawy korytarz przed biurem",
        roomType: "hallway",
        nearRightDoor: true,
        items: ["okno", "rośliny", "ławka"]
    },
    { 
        id: 12, 
        name: "Wejście", 
        description: "Główne wejście do kompleksu",
        roomType: "entrance",
        hasDoor: true,
        items: ["drzwi", "recepcja", "tablica"]
    }
];

// Zmienne globalne
let currentCamera = 1;
let gameTimer;
let animatronicTimer;
let powerOutTimer;
let audioContext;
let changingKeybind = null;
let changingButton = null;
let isStaticOn = false;

// Inicjalizacja gry
function initGame() {
    console.log("Inicjalizacja FNUF...");
    
    // Ukryj wszystkie ekrany oprócz menu
    hideAllScreens();
    showScreen('menu');
    
    // Załaduj ustawienia
    loadSettings();
    
    // Setup event listenerów
    setupEventListeners();
    
    // Inicjalizuj audio
    initAudio();
    
    // Generuj siatkę kamer
    generateCameraGrid();
    
    // Aktualizuj menu
    updateMenuUI();
    
    // Zakończ ładowanie
    document.getElementById('loading-screen').style.display = 'none';
    
    console.log("Gra gotowa!");
}

function hideAllScreens() {
    const screens = ['menu', 'settings-screen', 'game-screen-fnuf1', 'minigames-screen', 'credits-screen'];
    screens.forEach(screen => {
        const el = document.getElementById(screen);
        if (el) el.style.display = 'none';
    });
}

function showScreen(screenId) {
    hideAllScreens();
    
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.style.display = 'flex' || 'block';
        
        // Dodatkowe akcje dla ekranów
        switch(screenId) {
            case 'menu':
                updateMenuUI();
                break;
            case 'settings-screen':
                loadSettingsToUI();
                break;
            case 'credits-screen':
                // Nic nie trzeba robić
                break;
        }
    }
    
    playSound('menuSelect');
}

// EVENT LISTENERY - POPRAWIONE
function setupEventListeners() {
    console.log("Ustawianie event listenerów...");
    
    // Menu główne
    document.getElementById('new-game-btn').addEventListener('click', showNightSelect);
    document.getElementById('continue-btn').addEventListener('click', continueGame);
    document.getElementById('extras-btn').addEventListener('click', () => showScreen('minigames-screen'));
    document.getElementById('settings-btn').addEventListener('click', () => showScreen('settings-screen'));
    document.getElementById('credits-btn').addEventListener('click', () => showScreen('credits-screen'));
    
    // Wybór wersji
    document.querySelectorAll('.version-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.version-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            gameState.currentVersion = parseInt(this.getAttribute('data-version'));
        });
    });
    
    // Wybór nocy
    document.querySelectorAll('.night-card').forEach(card => {
        card.addEventListener('click', function() {
            const night = parseInt(this.getAttribute('data-night'));
            startNight(night);
        });
    });
    
    document.getElementById('night-select-back').addEventListener('click', () => {
        document.getElementById('night-select').classList.remove('active');
    });
    
    // Ustawienia
    document.getElementById('settings-back').addEventListener('click', () => showScreen('menu'));
    document.getElementById('apply-settings').addEventListener('click', applySettings);
    document.getElementById('cancel-settings').addEventListener('click', () => showScreen('menu'));
    document.getElementById('reset-controls').addEventListener('click', resetControls);
    document.getElementById('manual-save').addEventListener('click', manualSave);
    document.getElementById('delete-save').addEventListener('click', deleteSave);
    
    // Zakładki ustawień
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchSettingsTab(tabId);
        });
    });
    
    // Suwaki
    document.getElementById('master-volume').addEventListener('input', function() {
        document.getElementById('master-volume-value').textContent = this.value + '%';
        gameState.settings.audio.masterVolume = parseInt(this.value);
    });
    
    document.getElementById('music-volume').addEventListener('input', function() {
        document.getElementById('music-volume-value').textContent = this.value + '%';
        gameState.settings.audio.musicVolume = parseInt(this.value);
    });
    
    document.getElementById('sfx-volume').addEventListener('input', function() {
        document.getElementById('sfx-volume-value').textContent = this.value + '%';
        gameState.settings.audio.sfxVolume = parseInt(this.value);
    });
    
    // HUD ustawienia
    document.getElementById('hud-mode').addEventListener('change', function() {
        gameState.settings.hud.mode = this.value;
    });
    
    document.getElementById('hud-size').addEventListener('change', function() {
        gameState.settings.hud.size = this.value;
    });
    
    document.getElementById('hud-theme').addEventListener('change', function() {
        gameState.settings.hud.theme = this.value;
    });
    
    document.getElementById('hud-opacity').addEventListener('input', function() {
        document.getElementById('hud-opacity-value').textContent = this.value + '%';
        gameState.settings.hud.opacity = parseInt(this.value);
    });
    
    document.getElementById('show-hints').addEventListener('change', function() {
        gameState.settings.hud.showHints = this.checked;
    });
    
    document.getElementById('hud-animations').addEventListener('change', function() {
        gameState.settings.hud.animations = this.checked;
    });
    
    // Keybinds - POPRAWIONE
    document.querySelectorAll('.keybind-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            startKeybindChange(this);
        });
    });
    
    // Minigry
    document.getElementById('minigames-back').addEventListener('click', () => showScreen('menu'));
    document.querySelectorAll('.play-minigame-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const game = this.getAttribute('data-game');
            startMinigame(game);
        });
    });
    
    // Credits
    document.getElementById('credits-back').addEventListener('click', () => showScreen('menu'));
    
    // STEROWANIE W GRZE - POPRAWIONE
    // Drzwi lewe
    document.getElementById('left-door-button').addEventListener('click', toggleLeftDoor);
    document.getElementById('hud-left-door').addEventListener('click', toggleLeftDoor);
    
    // Drzwi prawe
    document.getElementById('right-door-button').addEventListener('click', toggleRightDoor);
    document.getElementById('hud-right-door').addEventListener('click', toggleRightDoor);
    
    // Światła
    document.getElementById('hud-left-light').addEventListener('click', toggleLeftLight);
    document.getElementById('hud-right-light').addEventListener('click', toggleRightLight);
    
    // Kamery
    document.getElementById('hud-cameras').addEventListener('click', toggleCameras);
    document.getElementById('prev-cam-btn').addEventListener('click', prevCamera);
    document.getElementById('next-cam-btn').addEventListener('click', nextCamera);
    document.getElementById('toggle-static-btn').addEventListener('click', toggleStatic);
    
    // Dzwonek
    document.getElementById('buzzer').addEventListener('click', useBuzzer);
    document.getElementById('hud-buzzer').addEventListener('click', useBuzzer);
    
    // Mapa
    document.getElementById('hud-map').addEventListener('click', showMap);
    
    // Pauza
    document.getElementById('hud-pause').addEventListener('click', togglePause);
    
    // Ustawienia w grze
    document.getElementById('hud-settings').addEventListener('click', () => {
        showScreen('settings-screen');
    });
    
    // Wyjście
    document.getElementById('hud-quit').addEventListener('click', () => {
        if (confirm('Czy na pewno chcesz wyjść do menu? Niezapisany postęp zostanie utracony.')) {
            endGame();
            showScreen('menu');
        }
    });
    
    // Ekran ukończenia nocy
    document.getElementById('next-night-btn').addEventListener('click', nextNight);
    document.getElementById('complete-menu-btn').addEventListener('click', () => {
        document.getElementById('night-complete-screen').style.display = 'none';
        showScreen('menu');
    });
    
    // Sterowanie klawiszami
    document.addEventListener('keydown', handleKeyDown);
    
    console.log("Event listenery ustawione!");
}

// ROZPOCZĘCIE GRY
function showNightSelect() {
    document.getElementById('night-select').classList.add('active');
}

function startNight(night) {
    console.log(`Rozpoczynanie nocy ${night}`);
    
    resetGameState();
    gameState.currentNight = night;
    gameState.gameActive = true;
    
    showScreen('game-screen-fnuf1');
    applyHUDsettings();
    
    startGameTimers();
    updateGameUI();
    
    playSound('menuSelect');
    showGameHint(`Rozpoczęto noc ${night}. Użyj kamer (C) aby monitorować animatroniki.`);
}

function continueGame() {
    const saved = localStorage.getItem('fnufSave');
    if (saved) {
        try {
            const save = JSON.parse(saved);
            gameState = { ...gameState, ...save };
            startNight(gameState.currentNight);
        } catch (e) {
            showNightSelect();
        }
    } else {
        showNightSelect();
    }
}

function resetGameState() {
    gameState.currentHour = 12;
    gameState.currentMinute = 0;
    gameState.power = 100;
    gameState.isPowerOut = false;
    gameState.gameActive = true;
    gameState.gamePaused = false;
    gameState.camerasActive = false;
    gameState.leftDoorClosed = false;
    gameState.rightDoorClosed = false;
    gameState.leftLightOn = false;
    gameState.rightLightOn = false;
    gameState.buzzerActive = false;
    gameState.jumpscareActive = false;
    gameState.nightCompleted = false;
    gameState.activeAnimatronics = 0;
    
    // Reset animatroników
    animatronics.boltBear.position = 1;
    animatronics.boltBear.atLeftDoor = false;
    animatronics.boltBear.atRightDoor = false;
    animatronics.sparkyFox.position = 4;
    animatronics.sparkyFox.atLeftDoor = false;
    animatronics.sparkyFox.atRightDoor = false;
    
    // Reset UI
    document.getElementById('camera-system').style.display = 'none';
    document.getElementById('monitor-overlay').style.opacity = '0';
    document.getElementById('power-out-warning').style.display = 'none';
    document.getElementById('jumpscare-screen').style.display = 'none';
    document.getElementById('night-complete-screen').style.display = 'none';
    
    updateDoorButtons();
    updateLightButtons();
}

// SYSTEM GRY
function startGameTimers() {
    clearAllTimers();
    
    // Timer gry
    gameTimer = setInterval(() => {
        if (gameState.gameActive && !gameState.gamePaused && !gameState.jumpscareActive) {
            updateGameTime();
            updatePower();
            updateGameUI();
            checkNightCompletion();
        }
    }, 1000);
    
    // Timer animatroników
    animatronicTimer = setInterval(() => {
        if (gameState.gameActive && !gameState.gamePaused && !gameState.jumpscareActive) {
            updateAnimatronics();
        }
    }, 3000);
}

function updateGameTime() {
    gameState.currentMinute++;
    gameState.gameTime++;
    
    if (gameState.currentMinute >= 60) {
        gameState.currentMinute = 0;
        gameState.currentHour++;
        
        if (gameState.currentHour >= 24) {
            gameState.currentHour = 0;
        }
    }
}

function updatePower() {
    if (gameState.isPowerOut) return;
    
    let drain = gameState.powerDrain;
    if (gameState.camerasActive) drain += 0.5;
    if (gameState.leftDoorClosed) drain += 1;
    if (gameState.rightDoorClosed) drain += 1;
    if (gameState.leftLightOn) drain += 0.3;
    if (gameState.rightLightOn) drain += 0.3;
    if (gameState.buzzerActive) drain += 2;
    
    gameState.power -= drain;
    
    if (gameState.power <= 0) {
        gameState.power = 0;
        gameState.isPowerOut = true;
        triggerPowerOut();
    }
}

function updateAnimatronics() {
    // Prosty system ruchu animatroników
    if (Math.random() < 0.3) {
        // Bolt Bear rusza się
        if (animatronics.boltBear.position === 3) {
            animatronics.boltBear.atLeftDoor = true;
            showAnimatronic('boltBear', 'left');
            if (gameState.leftDoorClosed) {
                playSound('doorClose');
            } else if (Math.random() < 0.2) {
                triggerJumpscare(animatronics.boltBear);
            }
        } else {
            animatronics.boltBear.position = Math.min(animatronics.boltBear.position + 1, 7);
            animatronics.boltBear.atLeftDoor = false;
            hideAnimatronic('boltBear');
        }
    }
    
    if (Math.random() < 0.25) {
        // Sparky Fox rusza się
        if (animatronics.sparkyFox.position === 11) {
            animatronics.sparkyFox.atRightDoor = true;
            showAnimatronic('sparkyFox', 'right');
            if (gameState.rightDoorClosed) {
                playSound('doorClose');
            } else if (Math.random() < 0.2) {
                triggerJumpscare(animatronics.sparkyFox);
            }
        } else {
            animatronics.sparkyFox.position = Math.min(animatronics.sparkyFox.position + 1, 11);
            animatronics.sparkyFox.atRightDoor = false;
            hideAnimatronic('sparkyFox');
        }
    }
    
    // Zaktualizuj liczbę aktywnych animatroników
    let activeCount = 0;
    if (animatronics.boltBear.position > 1 && animatronics.boltBear.position < 10) activeCount++;
    if (animatronics.sparkyFox.position > 4 && animatronics.sparkyFox.position < 12) activeCount++;
    gameState.activeAnimatronics = activeCount;
}

function showAnimatronic(animatronicName, side) {
    const display = document.getElementById(`${animatronicName}-display`);
    if (display) {
        display.style.display = 'flex';
        if (side === 'left') {
            display.style.left = '20%';
            display.style.right = 'auto';
        } else {
            display.style.right = '20%';
            display.style.left = 'auto';
        }
    }
}

function hideAnimatronic(animatronicName) {
    const display = document.getElementById(`${animatronicName}-display`);
    if (display) {
        display.style.display = 'none';
    }
}

// KONTROLA GRY - DZIAŁAJĄCE FUNKCJE
function toggleLeftDoor() {
    if (gameState.isPowerOut) {
        showGameHint("System drzwi nie działa - brak zasilania!");
        return;
    }
    
    gameState.leftDoorClosed = !gameState.leftDoorClosed;
    updateDoorButtons();
    updateDoorStatus();
    playSound('doorClose');
    
    if (gameState.leftDoorClosed) {
        showGameHint("Lewe drzwi zamknięte");
    } else {
        showGameHint("Lewe drzwi otwarte");
    }
}

function toggleRightDoor() {
    if (gameState.isPowerOut) {
        showGameHint("System drzwi nie działa - brak zasilania!");
        return;
    }
    
    gameState.rightDoorClosed = !gameState.rightDoorClosed;
    updateDoorButtons();
    updateDoorStatus();
    playSound('doorClose');
    
    if (gameState.rightDoorClosed) {
        showGameHint("Prawe drzwi zamknięte");
    } else {
        showGameHint("Prawe drzwi otwarte");
    }
}

function toggleLeftLight() {
    if (gameState.isPowerOut) {
        showGameHint("System oświetlenia nie działa - brak zasilania!");
        return;
    }
    
    gameState.leftLightOn = !gameState.leftLightOn;
    updateLightButtons();
    playSound('lightSwitch');
    
    const lightEl = document.getElementById('left-light');
    if (lightEl) {
        if (gameState.leftLightOn) {
            lightEl.classList.add('active');
            showGameHint("Lewe światło włączone");
        } else {
            lightEl.classList.remove('active');
            showGameHint("Lewe światło wyłączone");
        }
    }
}

function toggleRightLight() {
    if (gameState.isPowerOut) {
        showGameHint("System oświetlenia nie działa - brak zasilania!");
        return;
    }
    
    gameState.rightLightOn = !gameState.rightLightOn;
    updateLightButtons();
    playSound('lightSwitch');
    
    const lightEl = document.getElementById('right-light');
    if (lightEl) {
        if (gameState.rightLightOn) {
            lightEl.classList.add('active');
            showGameHint("Prawe światło włączone");
        } else {
            lightEl.classList.remove('active');
            showGameHint("Prawe światło wyłączone");
        }
    }
}

function toggleCameras() {
    if (gameState.isPowerOut) {
        showGameHint("System kamer nie działa - brak zasilania!");
        return;
    }
    
    gameState.camerasActive = !gameState.camerasActive;
    
    const cameraSystem = document.getElementById('camera-system');
    const monitorOverlay = document.getElementById('monitor-overlay');
    
    if (gameState.camerasActive) {
        cameraSystem.style.display = 'flex';
        monitorOverlay.style.opacity = '0.7';
        switchCamera(currentCamera);
        updateCameraDisplay();
        showGameHint("Kamery włączone");
    } else {
        cameraSystem.style.display = 'none';
        monitorOverlay.style.opacity = '0';
        showGameHint("Kamery wyłączone");
    }
    
    playSound('cameraSwitch');
}

function useBuzzer() {
    if (gameState.isPowerOut || gameState.buzzerActive) return;
    
    gameState.buzzerActive = true;
    playSound('buzzer');
    
    // Odstrasz animatroniki
    if (animatronics.boltBear.atLeftDoor) {
        animatronics.boltBear.position = 2;
        animatronics.boltBear.atLeftDoor = false;
        hideAnimatronic('boltBear');
    }
    
    if (animatronics.sparkyFox.atRightDoor) {
        animatronics.sparkyFox.position = 10;
        animatronics.sparkyFox.atRightDoor = false;
        hideAnimatronic('sparkyFox');
    }
    
    setTimeout(() => {
        gameState.buzzerActive = false;
    }, 2000);
    
    showGameHint("Dźwięk odstraszający użyty");
}

function showMap() {
    const map = `
    ┌─────────────────────────────────────┐
    │         MAPA KOMPLEKSU FNUF         │
    ├─────────────────────────────────────┤
    │ [WEJŚCIE] → [SCENA] → [KORYTARZ]    │
    │     ↓           ↓          ↓        │
    │ [MAGAZYN] ← [KUCHNIA] ← [POKÓJ ZABAW]│
    │     ↑           ↑          ↑        │
    │ [WENTYLACJA] → [BIURO] ← [KORYTARZ] │
    │     (A)                 (B)         │
    └─────────────────────────────────────┘
    
    Twoje biuro znajduje się w centrum.
    Używaj kamer (C) do monitorowania ruchów.
    `;
    
    alert(map);
}

function togglePause() {
    gameState.gamePaused = !gameState.gamePaused;
    
    const pauseBtn = document.getElementById('hud-pause');
    if (gameState.gamePaused) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i><span>WZNÓW</span><span class="small-hotkey">P</span>';
        showGameHint('GRA ZAPAUZOWANA');
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>PAUZA</span><span class="small-hotkey">P</span>';
        showGameHint('Gra wznowiona');
    }
    
    playSound('menuSelect');
}

// SYSTEM KAMER
function generateCameraGrid() {
    const grid = document.getElementById('camera-grid-container');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    cameraLocations.forEach(camera => {
        const camItem = document.createElement('div');
        camItem.className = 'camera-grid-item';
        camItem.setAttribute('data-camera', camera.id);
        
        camItem.innerHTML = `
            <div class="camera-number">CAM ${camera.id}</div>
            <div class="camera-location">${camera.name}</div>
        `;
        
        camItem.addEventListener('click', () => switchCamera(camera.id));
        grid.appendChild(camItem);
    });
}

function switchCamera(cameraId) {
    if (!gameState.camerasActive) return;
    
    currentCamera = cameraId;
    
    // Aktualizuj aktywne przyciski
    document.querySelectorAll('.camera-grid-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`.camera-grid-item[data-camera="${cameraId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Aktualizuj podgląd
    updateCameraFeed(cameraId);
    document.getElementById('active-cam-count').textContent = cameraId;
    
    playSound('cameraSwitch');
}

function updateCameraFeed(cameraId) {
    const camera = cameraLocations.find(c => c.id === cameraId);
    if (!camera) return;
    
    // Aktualizuj informacje
    document.getElementById('camera-name-display').textContent = `KAMERA ${cameraId}: ${camera.name}`;
    document.getElementById('camera-time-display').textContent = getTimeString();
    
    // Wyświetl pomieszczenie
    const roomDisplay = document.getElementById('camera-room-display');
    if (roomDisplay) {
        roomDisplay.innerHTML = generateRoomHTML(camera);
    }
    
    // Sprawdź animatroniki
    const animatronicsHere = [];
    if (animatronics.boltBear.position === cameraId) animatronicsHere.push(animatronics.boltBear);
    if (animatronics.sparkyFox.position === cameraId) animatronicsHere.push(animatronics.sparkyFox);
    
    // Aktualizuj status
    const statusText = document.getElementById('camera-status-text');
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (animatronicsHere.length > 0) {
        statusText.textContent = `${animatronicsHere.length} ANIMATRONIK`;
        statusIndicator.classList.remove('active');
        statusIndicator.classList.add('inactive');
        
        // Dodaj animatroniki do widoku
        animatronicsHere.forEach(anim => {
            const animElement = document.createElement('div');
            animElement.className = 'camera-animatronic';
            animElement.innerHTML = `<div class="anim-icon">${anim.icon}</div><div class="anim-name">${anim.name}</div>`;
            roomDisplay.appendChild(animElement);
        });
    } else {
        statusText.textContent = 'BRAK AKTYWNOŚCI';
        statusIndicator.classList.remove('inactive');
        statusIndicator.classList.add('active');
    }
}

function generateRoomHTML(camera) {
    let roomHTML = `<div class="room room-${camera.roomType}">`;
    
    // Dodaj elementy pomieszczenia w zależności od typu
    switch(camera.roomType) {
        case 'stage':
            roomHTML += `
                <div class="room-stage">
                    <div class="stage-curtain"></div>
                    <div class="stage-spotlights">
                        <div class="spotlight"></div>
                        <div class="spotlight"></div>
                        <div class="spotlight"></div>
                    </div>
                    <div class="stage-floor"></div>
                </div>
            `;
            break;
        case 'kitchen':
            roomHTML += `
                <div class="room-kitchen">
                    <div class="kitchen-counter"></div>
                    <div class="kitchen-fridge"></div>
                    <div class="kitchen-stove"></div>
                    <div class="kitchen-table"></div>
                    <div class="kitchen-utensils"></div>
                </div>
            `;
            break;
        case 'playroom':
            roomHTML += `
                <div class="room-playroom">
                    <div class="playroom-slide"></div>
                    <div class="playroom-ballpit"></div>
                    <div class="playroom-toys"></div>
                    <div class="playroom-poster"></div>
                </div>
            `;
            break;
        case 'storage':
            roomHTML += `
                <div class="room-storage">
                    <div class="storage-boxes">
                        <div class="box"></div>
                        <div class="box"></div>
                        <div class="box"></div>
                    </div>
                    <div class="storage-tools"></div>
                    <div class="storage-shelf"></div>
                </div>
            `;
            break;
        default:
            roomHTML += `
                <div class="room-default">
                    <div class="room-walls"></div>
                    <div class="room-floor"></div>
                    <div class="room-ceiling"></div>
                </div>
            `;
    }
    
    roomHTML += `</div>`;
    return roomHTML;
}

function prevCamera() {
    currentCamera = currentCamera > 1 ? currentCamera - 1 : 12;
    switchCamera(currentCamera);
}

function nextCamera() {
    currentCamera = currentCamera < 12 ? currentCamera + 1 : 1;
    switchCamera(currentCamera);
}

function toggleStatic() {
    isStaticOn = !isStaticOn;
    const staticOverlay = document.querySelector('.camera-static-overlay');
    if (staticOverlay) {
        staticOverlay.style.opacity = isStaticOn ? '0.5' : '0.3';
    }
}

function updateCameraDisplay() {
    if (gameState.camerasActive) {
        updateCameraFeed(currentCamera);
    }
}

// EVENTY GRY
function triggerPowerOut() {
    console.log("Awaria zasilania!");
    
    gameState.isPowerOut = true;
    document.getElementById('power-out-warning').style.display = 'flex';
    
    // Otwórz drzwi
    gameState.leftDoorClosed = false;
    gameState.rightDoorClosed = false;
    updateDoorButtons();
    
    // Wyłącz systemy
    gameState.camerasActive = false;
    gameState.leftLightOn = false;
    gameState.rightLightOn = false;
    document.getElementById('camera-system').style.display = 'none';
    document.getElementById('monitor-overlay').style.opacity = '0';
    updateLightButtons();
    
    playSound('powerOut');
    
    // Timer na atak
    let timer = 30;
    const timerElement = document.querySelector('.warning-timer');
    const timerInterval = setInterval(() => {
        timer--;
        if (timerElement) timerElement.textContent = timer;
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            if (gameState.isPowerOut && gameState.gameActive) {
                const anims = [animatronics.boltBear, animatronics.sparkyFox];
                const randomAnim = anims[Math.floor(Math.random() * anims.length)];
                triggerJumpscare(randomAnim);
            }
        }
    }, 1000);
    
    // Zatrzymaj timer po 30 sekundach
    powerOutTimer = setTimeout(() => {
        clearInterval(timerInterval);
    }, 30000);
}

function triggerJumpscare(animatronic) {
    if (gameState.jumpscareActive) return;
    
    gameState.jumpscareActive = true;
    gameState.gameActive = false;
    
    clearAllTimers();
    
    // Pokaż ekran jumpscare
    const jumpscareScreen = document.getElementById('jumpscare-screen');
    const jumpscareName = document.getElementById('jumpscare-name');
    const jumpscareIcon = document.getElementById('jumpscare-icon');
    
    jumpscareName.textContent = animatronic.name;
    jumpscareIcon.textContent = animatronic.icon;
    jumpscareScreen.style.display = 'flex';
    
    // Wstrząs ekranu
    if (gameState.settings.graphics.screenShake) {
        document.getElementById('game-screen-fnuf1').style.animation = 'jumpscareShake 0.5s linear infinite';
    }
    
    playSound('jumpscare');
    
    // Po 3 sekundach wróć do menu
    setTimeout(() => {
        jumpscareScreen.style.display = 'none';
        gameState.jumpscareActive = false;
        
        if (gameState.settings.graphics.screenShake) {
            document.getElementById('game-screen-fnuf1').style.animation = '';
        }
        
        saveGame();
        showScreen('menu');
        showGameHint(`Zostałeś zaatakowany przez ${animatronic.name}! Spróbuj ponownie.`);
    }, 3000);
}

function checkNightCompletion() {
    if (gameState.currentHour >= 6) {
        completeNight();
    }
}

function completeNight() {
    gameState.gameActive = false;
    gameState.nightCompleted = true;
    
    clearAllTimers();
    
    // Oblicz zarobki
    const basePay = 120.50;
    const nightBonus = gameState.currentNight * 25;
    const powerBonus = Math.max(0, gameState.power) * 0.5;
    const totalPay = basePay + nightBonus + powerBonus;
    
    gameState.playerMoney += totalPay;
    
    // Pokaż ekran ukończenia
    const completeScreen = document.getElementById('night-complete-screen');
    document.getElementById('complete-night').textContent = gameState.currentNight;
    document.getElementById('stat-earnings').textContent = totalPay.toFixed(2);
    document.getElementById('stat-energy').textContent = gameState.power.toFixed(1);
    document.getElementById('total-earnings').textContent = gameState.playerMoney.toFixed(2);
    
    completeScreen.style.display = 'flex';
    
    playSound('nightComplete');
    
    // Zapisz grę
    saveGame();
}

function nextNight() {
    gameState.currentNight++;
    document.getElementById('night-complete-screen').style.display = 'none';
    startNight(gameState.currentNight);
}

function endGame() {
    clearAllTimers();
    resetGameState();
}

// UI FUNCTIONS
function updateGameUI() {
    // Aktualizuj czas
    const timeString = getTimeString();
    document.querySelector('.digital-clock').textContent = timeString;
    document.getElementById('hud-time').textContent = timeString;
    
    // Aktualizuj energię
    const powerPercent = Math.max(0, Math.min(100, gameState.power));
    document.getElementById('hud-power').textContent = `${powerPercent.toFixed(1)}%`;
    document.getElementById('power-bar-fill').style.width = `${powerPercent}%`;
    
    if (powerPercent < 20) {
        document.getElementById('hud-power').classList.add('warning');
    } else {
        document.getElementById('hud-power').classList.remove('warning');
    }
    
    // Aktualizuj noc
    document.getElementById('hud-night').textContent = gameState.currentNight;
    document.querySelector('.night-counter').textContent = `NOC ${gameState.currentNight}`;
    
    // Aktualizuj animatroniki
    document.getElementById('hud-active').textContent = gameState.activeAnimatronics;
    
    // Aktualizuj status drzwi
    updateDoorStatus();
    
    // Aktualizuj kamery jeśli aktywne
    if (gameState.camerasActive) {
        updateCameraDisplay();
    }
}

function getTimeString() {
    const hourDisplay = gameState.currentHour === 0 ? 12 : 
                       gameState.currentHour > 12 ? gameState.currentHour - 12 : gameState.currentHour;
    const ampm = gameState.currentHour >= 12 ? "PM" : "AM";
    return `${hourDisplay}:${gameState.currentMinute.toString().padStart(2, '0')} ${ampm}`;
}

function updateDoorStatus() {
    const leftStatus = document.getElementById('left-door-status-text');
    const rightStatus = document.getElementById('right-door-status-text');
    const leftLight = document.getElementById('left-door-status-light');
    const rightLight = document.getElementById('right-door-status-light');
    
    if (gameState.leftDoorClosed) {
        if (leftStatus) leftStatus.textContent = "ZAMKNIĘTE";
        if (leftStatus) leftStatus.classList.add('closed');
        if (leftLight) leftLight.style.background = '#ff3300';
    } else {
        if (leftStatus) leftStatus.textContent = "OTWARTE";
        if (leftStatus) leftStatus.classList.remove('closed');
        if (leftLight) leftLight.style.background = '#0f0';
    }
    
    if (gameState.rightDoorClosed) {
        if (rightStatus) rightStatus.textContent = "ZAMKNIĘTE";
        if (rightStatus) rightStatus.classList.add('closed');
        if (rightLight) rightLight.style.background = '#ff3300';
    } else {
        if (rightStatus) rightStatus.textContent = "OTWARTE";
        if (rightStatus) rightStatus.classList.remove('closed');
        if (rightLight) rightLight.style.background = '#0f0';
    }
}

function updateDoorButtons() {
    const leftDoor = document.getElementById('left-door');
    const rightDoor = document.getElementById('right-door');
    const leftButton = document.getElementById('left-door-button');
    const rightButton = document.getElementById('right-door-button');
    
    if (gameState.leftDoorClosed) {
        if (leftDoor) leftDoor.classList.add('closed');
        if (leftButton) leftButton.classList.add('active');
    } else {
        if (leftDoor) leftDoor.classList.remove('closed');
        if (leftButton) leftButton.classList.remove('active');
    }
    
    if (gameState.rightDoorClosed) {
        if (rightDoor) rightDoor.classList.add('closed');
        if (rightButton) rightButton.classList.add('active');
    } else {
        if (rightDoor) rightDoor.classList.remove('closed');
        if (rightButton) rightButton.classList.remove('active');
    }
}

function updateLightButtons() {
    const leftButton = document.getElementById('hud-left-light');
    const rightButton = document.getElementById('hud-right-light');
    
    if (gameState.leftLightOn) {
        if (leftButton) leftButton.classList.add('active');
    } else {
        if (leftButton) leftButton.classList.remove('active');
    }
    
    if (gameState.rightLightOn) {
        if (rightButton) rightButton.classList.add('active');
    } else {
        if (rightButton) rightButton.classList.remove('active');
    }
}

function showGameHint(message) {
    if (!gameState.settings.hud.showHints) return;
    
    const hintText = document.getElementById('current-hint');
    if (hintText) {
        hintText.textContent = message;
        
        // Wyczyść po 3 sekundach
        setTimeout(() => {
            if (hintText.textContent === message) {
                hintText.textContent = 'Użyj C dla kamer, Q/E dla świateł, L/R dla drzwi';
            }
        }, 3000);
    }
}

// USTAWIENIA
function switchSettingsTab(tabId) {
    // Ukryj wszystkie zakładki
    document.querySelectorAll('.settings-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Pokaż wybraną zakładkę
    const tabContent = document.getElementById(`tab-${tabId}`);
    const tabButton = document.querySelector(`.settings-tab[data-tab="${tabId}"]`);
    
    if (tabContent) tabContent.classList.add('active');
    if (tabButton) tabButton.classList.add('active');
}

function loadSettingsToUI() {
    // Audio
    document.getElementById('master-volume').value = gameState.settings.audio.masterVolume;
    document.getElementById('master-volume-value').textContent = gameState.settings.audio.masterVolume + '%';
    
    document.getElementById('music-volume').value = gameState.settings.audio.musicVolume;
    document.getElementById('music-volume-value').textContent = gameState.settings.audio.musicVolume + '%';
    
    document.getElementById('sfx-volume').value = gameState.settings.audio.sfxVolume;
    document.getElementById('sfx-volume-value').textContent = gameState.settings.audio.sfxVolume + '%';
    
    // HUD
    document.getElementById('hud-mode').value = gameState.settings.hud.mode;
    document.getElementById('hud-size').value = gameState.settings.hud.size;
    document.getElementById('hud-theme').value = gameState.settings.hud.theme;
    document.getElementById('hud-opacity').value = gameState.settings.hud.opacity;
    document.getElementById('hud-opacity-value').textContent = gameState.settings.hud.opacity + '%';
    document.getElementById('show-hints').checked = gameState.settings.hud.showHints;
    document.getElementById('hud-animations').checked = gameState.settings.hud.animations;
    
    // Keybinds
    updateKeybindDisplay();
}

function updateKeybindDisplay() {
    const keybinds = gameState.settings.controls.keybinds;
    
    document.querySelector('.keybind-btn[data-action="cameras"]').textContent = keybinds.cameras;
    document.querySelector('.keybind-btn[data-action="leftDoor"]').textContent = keybinds.leftDoor;
    document.querySelector('.keybind-btn[data-action="rightDoor"]').textContent = keybinds.rightDoor;
    document.querySelector('.keybind-btn[data-action="leftLight"]').textContent = keybinds.leftLight;
    document.querySelector('.keybind-btn[data-action="rightLight"]').textContent = keybinds.rightLight;
    document.querySelector('.keybind-btn[data-action="buzzer"]').textContent = keybinds.buzzer === ' ' ? 'SPACJA' : keybinds.buzzer;
    document.querySelector('.keybind-btn[data-action="map"]').textContent = keybinds.map;
    document.querySelector('.keybind-btn[data-action="pause"]').textContent = keybinds.pause;
}

function startKeybindChange(button) {
    if (changingKeybind) return;
    
    const action = button.getAttribute('data-action');
    changingKeybind = action;
    changingButton = button;
    
    const oldText = button.textContent;
    button.textContent = '...';
    button.classList.add('changing');
    
    showGameHint(`Naciśnij klawisz dla akcji: ${action}`);
    
    // Tymczasowy event listener
    const keyHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        let key = e.key.toUpperCase();
        if (key === ' ') key = 'SPACJA';
        
        // Zapisz nowy keybind
        gameState.settings.controls.keybinds[action] = key;
        
        // Przywróć przycisk
        button.textContent = key;
        button.classList.remove('changing');
        
        // Wyczyść zmienne
        changingKeybind = null;
        changingButton = null;
        
        // Usuń event listener
        document.removeEventListener('keydown', keyHandler);
        
        showGameHint(`Keybind zmieniony: ${action} -> ${key}`);
    };
    
    document.addEventListener('keydown', keyHandler, { once: true });
    
    // Anuluj po 5 sekundach
    setTimeout(() => {
        if (changingKeybind === action) {
            document.removeEventListener('keydown', keyHandler);
            button.textContent = oldText;
            button.classList.remove('changing');
            changingKeybind = null;
            changingButton = null;
            showGameHint('Zmiana keybindu anulowana');
        }
    }, 5000);
}

function resetControls() {
    if (confirm('Czy na pewno chcesz przywrócić domyślne ustawienia sterowania?')) {
        gameState.settings.controls.keybinds = {
            cameras: 'C',
            leftDoor: 'L',
            rightDoor: 'R',
            leftLight: 'Q',
            rightLight: 'E',
            buzzer: ' ',
            map: 'M',
            pause: 'P'
        };
        
        updateKeybindDisplay();
        showGameHint('Sterowanie zresetowane do ustawień domyślnych');
    }
}

function applySettings() {
    // Zastosuj ustawienia HUD
    applyHUDsettings();
    
    // Zapisz ustawienia
    saveSettings();
    
    showGameHint('Ustawienia zastosowane i zapisane');
    showScreen('menu');
}

function applyHUDsettings() {
    const hud = document.getElementById('game-hud');
    if (!hud) return;
    
    // Usuń stare klasy
    hud.className = '';
    
    // Dodaj nowe klasy na podstawie ustawień
    hud.classList.add(`hud-mode-${gameState.settings.hud.mode}`);
    hud.classList.add(`hud-size-${gameState.settings.hud.size}`);
    hud.classList.add(`hud-theme-${gameState.settings.hud.theme}`);
    
    // Ustaw przezroczystość
    hud.style.opacity = `${gameState.settings.hud.opacity}%`;
    
    // Animacje
    if (gameState.settings.hud.animations) {
        hud.classList.add('animated');
    } else {
        hud.classList.remove('animated');
    }
}

// AUDIO
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log("Audio API nie dostępne");
    }
}

function playSound(soundName) {
    if (!audioContext || gameState.settings.audio.masterVolume === 0) return;
    
    const volume = gameState.settings.audio.sfxVolume / 100;
    if (volume <= 0) return;
    
    try {
        let oscillator, gainNode;
        
        switch(soundName) {
            case 'menuSelect':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1 * volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
                
            case 'cameraSwitch':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.05 * volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
                
            case 'doorClose':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1 * volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
                
            case 'lightSwitch':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.03 * volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.05);
                break;
                
            case 'buzzer':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.2 * volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
                
            case 'powerOut':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1);
                gainNode.gain.setValueAtTime(0.15 * volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 1);
                break;
                
            case 'jumpscare':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
                gainNode.gain.setValueAtTime(0.3 * volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
                
            case 'nightComplete':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2);
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4);
                gainNode.gain.setValueAtTime(0.1 * volume, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1 * volume, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1 * volume, audioContext.currentTime + 0.4);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.6);
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.6);
                break;
        }
    } catch (e) {
        console.error("Błąd dźwięku:", e);
    }
}

// ZAPIS I ŁADOWANIE
function saveSettings() {
    try {
        localStorage.setItem('fnufSettings', JSON.stringify(gameState.settings));
    } catch (e) {
        console.error("Błąd zapisu ustawień:", e);
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('fnufSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            gameState.settings = { ...gameState.settings, ...settings };
        }
    } catch (e) {
        console.error("Błąd ładowania ustawień:", e);
    }
}

function saveGame() {
    try {
        const saveData = {
            currentNight: gameState.currentNight,
            playerMoney: gameState.playerMoney,
            settings: gameState.settings
        };
        localStorage.setItem('fnufSave', JSON.stringify(saveData));
    } catch (e) {
        console.error("Błąd zapisu gry:", e);
    }
}

function manualSave() {
    saveGame();
    saveSettings();
    showGameHint('Gra zapisana pomyślnie');
}

function deleteSave() {
    if (confirm('Czy na pewno chcesz usunąć wszystkie zapisy gry?')) {
        localStorage.removeItem('fnufSave');
        localStorage.removeItem('fnufSettings');
        gameState.currentNight = 1;
        gameState.playerMoney = 0;
        showGameHint('Wszystkie zapisy gry zostały usunięte');
    }
}

// STEROWANIE KLAWIATURĄ
function handleKeyDown(e) {
    const key = e.key.toUpperCase();
    
    // Jeśli zmieniamy keybind
    if (changingKeybind) {
        return;
    }
    
    // Pobierz keybinds
    const keybinds = gameState.settings.controls.keybinds;
    
    // Sprawdź czy gra jest aktywna
    if (gameState.gameActive && !gameState.gamePaused && !gameState.jumpscareActive) {
        
        // Porównaj klawisz z keybindami
        if (key === keybinds.cameras) {
            toggleCameras();
            e.preventDefault();
        } else if (key === keybinds.leftDoor) {
            toggleLeftDoor();
            e.preventDefault();
        } else if (key === keybinds.rightDoor) {
            toggleRightDoor();
            e.preventDefault();
        } else if (key === keybinds.leftLight) {
            toggleLeftLight();
            e.preventDefault();
        } else if (key === keybinds.rightLight) {
            toggleRightLight();
            e.preventDefault();
        } else if (key === ' ' && keybinds.buzzer === ' ') {
            useBuzzer();
            e.preventDefault();
        } else if (key === keybinds.map) {
            showMap();
            e.preventDefault();
        } else if (key === keybinds.pause) {
            togglePause();
            e.preventDefault();
        }
        
        // Szybkie przełączanie kamer
        if (gameState.camerasActive) {
            const numKey = parseInt(key);
            if (!isNaN(numKey) && numKey >= 1 && numKey <= 9) {
                switchCamera(numKey);
                e.preventDefault();
            } else if (key === '0') {
                switchCamera(10);
                e.preventDefault();
            }
        }
    }
    
    // Esc zawsze pauzuje
    if (key === 'ESCAPE' && gameState.gameActive) {
        togglePause();
        e.preventDefault();
    }
}

// POMOCNICZE FUNKCJE
function clearAllTimers() {
    clearInterval(gameTimer);
    clearInterval(animatronicTimer);
    clearTimeout(powerOutTimer);
}

function updateMenuUI() {
    const hintText = document.getElementById('menu-hint-text');
    if (hintText) {
        hintText.textContent = 'Wybierz wersję gry i kliknij NOWA GRA aby rozpocząć';
    }
}

function startMinigame(gameType) {
    alert(`Minigra "${gameType}" w budowie!`);
    showScreen('menu');
}

// INICJALIZACJA
window.addEventListener('DOMContentLoaded', function() {
    console.log("=== FNUF ULTIMATE FEAR ===");
    console.log("Autor: MNGame Studio, Marek Narty (Marcus Schie)");
    console.log("Inspirowane dziełem Scotta Cawthona");
    
    initGame();
});

// Eksport dla debugowania
window.gameState = gameState;
window.animatronics = animatronics;
