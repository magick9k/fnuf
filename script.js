// FNUF ULTIMATE FEAR - POPRAWIONY I KOMPLETNY KOD
// ================================================

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
        graphics: {
            textureQuality: 'medium',
            screenShake: true,
            lightEffects: true
        },
        gameplay: {
            difficulty: 'normal',
            powerDrain: 'normal',
            animSpeed: 'normal'
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
        atRightDoor: false,
        aiLevel: 1,
        aggression: 1,
        inVent: false,
        lastMoveTime: 0
    },
    sparkyFox: {
        name: "Sparky Fox",
        position: 4,
        active: true,
        icon: "🦊",
        atLeftDoor: false,
        atRightDoor: false,
        aiLevel: 1,
        aggression: 1,
        inVent: false,
        lastMoveTime: 0
    },
    shockRabbit: {
        name: "Shock Rabbit",
        position: 7,
        active: false,
        icon: "🐰",
        atLeftDoor: false,
        atRightDoor: false,
        aiLevel: 0,
        aggression: 0,
        inVent: false,
        lastMoveTime: 0
    },
    zapChicken: {
        name: "Zap Chicken",
        position: 10,
        active: false,
        icon: "🐔",
        atLeftDoor: false,
        atRightDoor: false,
        aiLevel: 0,
        aggression: 0,
        inVent: false,
        lastMoveTime: 0
    },
    surgeWolf: {
        name: "Surge Wolf",
        position: 12,
        active: false,
        icon: "🐺",
        atLeftDoor: false,
        atRightDoor: false,
        aiLevel: 0,
        aggression: 0,
        inVent: false,
        lastMoveTime: 0
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
        items: ["scena", "kurtyna", "reflektory"],
        animatronics: []
    },
    { 
        id: 2, 
        name: "Korytarz Główny", 
        description: "Główny korytarz prowadzący do biura",
        roomType: "hallway",
        hasLights: true,
        items: ["dywan", "obrazy", "doniczki"],
        animatronics: []
    },
    { 
        id: 3, 
        name: "Korytarz Lewy", 
        description: "Lewy korytarz przed biurem",
        roomType: "hallway",
        nearLeftDoor: true,
        items: ["schody", "tablica", "kamera"],
        animatronics: []
    },
    { 
        id: 4, 
        name: "Kuchnia", 
        description: "Kuchnia i jadalnia",
        roomType: "kitchen",
        hasUtensils: true,
        items: ["lodówka", "kuchenka", "stoły"],
        animatronics: []
    },
    { 
        id: 5, 
        name: "Pokój Zabaw", 
        description: "Pokój zabaw dla dzieci",
        roomType: "playroom",
        hasToys: true,
        items: ["zjeżdżalnia", "piłki", "konik"],
        animatronics: []
    },
    { 
        id: 6, 
        name: "Wentylacja A", 
        description: "System wentylacji - część A",
        roomType: "vent",
        isVent: true,
        items: ["kratki", "przewody", "filtr"],
        animatronics: []
    },
    { 
        id: 7, 
        name: "Przed Biurem", 
        description: "Obszar bezpośrednio przed biurem",
        roomType: "office_front",
        critical: true,
        items: ["krzesło", "biurko", "monitor"],
        animatronics: []
    },
    { 
        id: 8, 
        name: "Magazyn", 
        description: "Magazyn sprzętu i części zamiennych",
        roomType: "storage",
        hasBoxes: true,
        items: ["skrzynie", "narzędzia", "części"],
        animatronics: []
    },
    { 
        id: 9, 
        name: "Wentylacja B", 
        description: "System wentylacji - część B",
        roomType: "vent",
        isVent: true,
        items: ["silnik", "wentylator", "czujniki"],
        animatronics: []
    },
    { 
        id: 10, 
        name: "Za Biurem", 
        description: "Tajny obszar za biurem",
        roomType: "hidden",
        hidden: true,
        items: ["kable", "serwer", "archiwa"],
        animatronics: []
    },
    { 
        id: 11, 
        name: "Prawy Korytarz", 
        description: "Prawy korytarz przed biurem",
        roomType: "hallway",
        nearRightDoor: true,
        items: ["okno", "rośliny", "ławka"],
        animatronics: []
    },
    { 
        id: 12, 
        name: "Wejście", 
        description: "Główne wejście do kompleksu",
        roomType: "entrance",
        hasDoor: true,
        items: ["drzwi", "recepcja", "tablica"],
        animatronics: []
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
let ventGameActive = false;
let ventGameTimer;
let ventRepairs = 0;
let ventTime = 60;
let ventPlayerPos = 10;
let ventAnimatronicPos = 90;
let ventGameInterval;

// Inicjalizacja gry
function initGame() {
    console.log("Inicjalizacja FNUF Ultimate Fear...");
    
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
    
    // Inicjalizuj minigrę wentylacji
    initVentGame();
    
    // Zakończ ładowanie
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
        console.log("Gra gotowa!");
    }, 2000);
}

function hideAllScreens() {
    const screens = ['menu', 'settings-screen', 'game-screen-fnuf1', 'minigames-screen', 'credits-screen', 'minigame-vent'];
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
            case 'game-screen-fnuf1':
                if (gameState.gameActive) {
                    updateGameUI();
                }
                break;
        }
    }
    
    playSound('menuSelect');
}

// EVENT LISTENERY
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
    document.querySelectorAll('.night-card:not(.custom)').forEach(card => {
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
    
    // Suwaki audio
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
    
    // Grafika
    document.getElementById('texture-quality').addEventListener('change', function() {
        gameState.settings.graphics.textureQuality = this.value;
    });
    
    document.getElementById('screen-shake').addEventListener('change', function() {
        gameState.settings.graphics.screenShake = this.checked;
    });
    
    document.getElementById('light-effects').addEventListener('change', function() {
        gameState.settings.graphics.lightEffects = this.checked;
    });
    
    // Gameplay
    document.getElementById('difficulty-level').addEventListener('change', function() {
        gameState.settings.gameplay.difficulty = this.value;
    });
    
    document.getElementById('power-drain').addEventListener('change', function() {
        gameState.settings.gameplay.powerDrain = this.value;
    });
    
    document.getElementById('anim-speed').addEventListener('change', function() {
        gameState.settings.gameplay.animSpeed = this.value;
    });
    
    // HUD ustawienia
    document.getElementById('hud-mode').addEventListener('change', function() {
        gameState.settings.hud.mode = this.value;
        if (gameState.gameActive) applyHUDsettings();
    });
    
    document.getElementById('hud-size').addEventListener('change', function() {
        gameState.settings.hud.size = this.value;
        if (gameState.gameActive) applyHUDsettings();
    });
    
    document.getElementById('hud-theme').addEventListener('change', function() {
        gameState.settings.hud.theme = this.value;
        if (gameState.gameActive) applyHUDsettings();
    });
    
    document.getElementById('hud-opacity').addEventListener('input', function() {
        document.getElementById('hud-opacity-value').textContent = this.value + '%';
        gameState.settings.hud.opacity = parseInt(this.value);
        if (gameState.gameActive) applyHUDsettings();
    });
    
    document.getElementById('show-hints').addEventListener('change', function() {
        gameState.settings.hud.showHints = this.checked;
    });
    
    document.getElementById('hud-animations').addEventListener('change', function() {
        gameState.settings.hud.animations = this.checked;
        if (gameState.gameActive) applyHUDsettings();
    });
    
    // Keybinds
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
    
    // STEROWANIE W GRZE
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
    
    // Minigra wentylacji
    document.getElementById('vent-back').addEventListener('click', () => showScreen('minigames-screen'));
    document.getElementById('vent-start').addEventListener('click', startVentGame);
    
    // Sterowanie minigrą
    document.querySelector('.move-left').addEventListener('click', () => moveVentPlayer(-10));
    document.querySelector('.move-right').addEventListener('click', () => moveVentPlayer(10));
    document.querySelector('.repair').addEventListener('click', repairVent);
    
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
    
    // Ustaw trudność na podstawie nocy
    setNightDifficulty(night);
    
    showScreen('game-screen-fnuf1');
    applyHUDsettings();
    
    startGameTimers();
    updateGameUI();
    updateWindowViews();
    
    playSound('menuSelect');
    showGameHint(`Rozpoczęto noc ${night}. Użyj kamer (C) aby monitorować animatroniki.`);
}

function setNightDifficulty(night) {
    // Ustaw poziom AI animatroników na podstawie nocy
    const baseAI = Math.min(10, night * 2);
    
    animatronics.boltBear.aiLevel = baseAI;
    animatronics.sparkyFox.aiLevel = baseAI;
    
    // Aktywuj więcej animatroników w kolejnych nocach
    if (night >= 2) animatronics.shockRabbit.active = true;
    if (night >= 3) animatronics.zapChicken.active = true;
    if (night >= 4) animatronics.surgeWolf.active = true;
    
    // Ustaw agresję
    animatronics.boltBear.aggression = Math.min(10, night);
    animatronics.sparkyFox.aggression = Math.min(10, night);
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
    animatronics.boltBear.inVent = false;
    animatronics.boltBear.lastMoveTime = 0;
    
    animatronics.sparkyFox.position = 4;
    animatronics.sparkyFox.atLeftDoor = false;
    animatronics.sparkyFox.atRightDoor = false;
    animatronics.sparkyFox.inVent = false;
    animatronics.sparkyFox.lastMoveTime = 0;
    
    animatronics.shockRabbit.position = 7;
    animatronics.shockRabbit.atLeftDoor = false;
    animatronics.shockRabbit.atRightDoor = false;
    animatronics.shockRabbit.inVent = false;
    animatronics.shockRabbit.lastMoveTime = 0;
    
    animatronics.zapChicken.position = 10;
    animatronics.zapChicken.atLeftDoor = false;
    animatronics.zapChicken.atRightDoor = false;
    animatronics.zapChicken.inVent = false;
    animatronics.zapChicken.lastMoveTime = 0;
    
    animatronics.surgeWolf.position = 12;
    animatronics.surgeWolf.atLeftDoor = false;
    animatronics.surgeWolf.atRightDoor = false;
    animatronics.surgeWolf.inVent = false;
    animatronics.surgeWolf.lastMoveTime = 0;
    
    // Reset UI
    document.getElementById('camera-system').style.display = 'none';
    document.getElementById('monitor-overlay').style.opacity = '0';
    document.getElementById('power-out-warning').style.display = 'none';
    document.getElementById('jumpscare-screen').style.display = 'none';
    document.getElementById('night-complete-screen').style.display = 'none';
    
    // Reset drzwi
    document.getElementById('left-door').classList.remove('closed');
    document.getElementById('right-door').classList.remove('closed');
    
    updateDoorButtons();
    updateLightButtons();
    updateWindowViews();
}

// SYSTEM GRY
function startGameTimers() {
    clearAllTimers();
    
    // Timer gry - 8 minut na pełną noc
    gameTimer = setInterval(() => {
        if (gameState.gameActive && !gameState.gamePaused && !gameState.jumpscareActive) {
            updateGameTime();
            updatePower();
            updateGameUI();
            updateWindowViews();
            checkNightCompletion();
        }
    }, 1000); // 1 sekunda rzeczywista
    
    // Timer animatroników - dostosowany do 8 minut gry
    const animSpeed = getAnimSpeed();
    animatronicTimer = setInterval(() => {
        if (gameState.gameActive && !gameState.gamePaused && !gameState.jumpscareActive) {
            updateAnimatronics();
        }
    }, animSpeed);
}

function getAnimSpeed() {
    switch(gameState.settings.gameplay.animSpeed) {
        case 'slow': return 5000; // 5 sekund
        case 'normal': return 3000; // 3 sekundy
        case 'fast': return 1500; // 1.5 sekundy
        default: return 3000;
    }
}

function updateGameTime() {
    // 8 minut (480 sekund) na pełną noc (12:00 AM - 6:00 AM)
    // 1 sekunda gry = 45 sekund czasu w grze
    gameState.currentMinute += 45;
    
    if (gameState.currentMinute >= 60) {
        gameState.currentMinute = 0;
        gameState.currentHour++;
        
        // Zawijanie po północy
        if (gameState.currentHour >= 24) {
            gameState.currentHour = 0;
        }
    }
    
    gameState.gameTime++;
}

function updatePower() {
    if (gameState.isPowerOut) return;
    
    let drain = gameState.powerDrain;
    
    // Modyfikuj drain na podstawie ustawień
    switch(gameState.settings.gameplay.powerDrain) {
        case 'low': drain *= 0.7; break;
        case 'high': drain *= 1.3; break;
    }
    
    // Dodatkowe zużycie energii
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
    const currentTime = Date.now();
    let activeCount = 0;
    
    // Sprawdź każdego animatronika
    for (const [key, anim] of Object.entries(animatronics)) {
        if (!anim.active) continue;
        
        // Oblicz szansę na ruch na podstawie AI level i agresji
        const moveChance = (anim.aiLevel * 0.05) + (anim.aggression * 0.03);
        
        if (Math.random() < moveChance) {
            // Animatronik się rusza
            anim.lastMoveTime = currentTime;
            
            // Decyduj o ruchu
            if (anim.position === 3) {
                // Przy lewych drzwiach
                anim.atLeftDoor = true;
                anim.atRightDoor = false;
                showAnimatronic(key, 'left');
                
                if (gameState.leftDoorClosed) {
                    playSound('doorClose');
                    // Szansa na odbicie się od drzwi
                    if (Math.random() < 0.3) {
                        anim.position = 2;
                        anim.atLeftDoor = false;
                        hideAnimatronic(key);
                    }
                } else if (Math.random() < 0.1 + (anim.aggression * 0.02)) {
                    // Szansa na atak
                    triggerJumpscare(anim);
                }
            } else if (anim.position === 11) {
                // Przy prawych drzwiach
                anim.atRightDoor = true;
                anim.atLeftDoor = false;
                showAnimatronic(key, 'right');
                
                if (gameState.rightDoorClosed) {
                    playSound('doorClose');
                    // Szansa na odbicie się od drzwi
                    if (Math.random() < 0.3) {
                        anim.position = 10;
                        anim.atRightDoor = false;
                        hideAnimatronic(key);
                    }
                } else if (Math.random() < 0.1 + (anim.aggression * 0.02)) {
                    // Szansa na atak
                    triggerJumpscare(anim);
                }
            } else {
                // Normalny ruch
                const moveDirection = Math.random() < 0.5 ? 1 : -1;
                anim.position = Math.max(1, Math.min(12, anim.position + moveDirection));
                anim.atLeftDoor = false;
                anim.atRightDoor = false;
                hideAnimatronic(key);
            }
        }
        
        // Policz aktywne animatroniki
        if (anim.position > 1 && anim.position < 12) activeCount++;
    }
    
    gameState.activeAnimatronics = activeCount;
    
    // Aktualizuj widok okien
    updateWindowViews();
    
    // Aktualizuj kamery jeśli aktywne
    if (gameState.camerasActive) {
        updateCameraDisplay();
    }
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

function updateWindowViews() {
    const leftWindow = document.getElementById('left-window-view');
    const rightWindow = document.getElementById('right-window-view');
    
    // Wyczyść okna
    leftWindow.innerHTML = '';
    rightWindow.innerHTML = '';
    
    // Sprawdź animatroniki przy drzwiach
    for (const [key, anim] of Object.entries(animatronics)) {
        if (!anim.active) continue;
        
        if (anim.atLeftDoor && leftWindow) {
            const animElement = document.createElement('div');
            animElement.className = 'window-animatronic';
            animElement.textContent = anim.icon;
            animElement.style.color = anim === animatronics.boltBear ? '#ff0' : '#f00';
            animElement.style.fontSize = '80px';
            leftWindow.appendChild(animElement);
            
            // Dodaj animację po chwili
            setTimeout(() => {
                animElement.classList.add('visible');
            }, 100);
        }
        
        if (anim.atRightDoor && rightWindow) {
            const animElement = document.createElement('div');
            animElement.className = 'window-animatronic';
            animElement.textContent = anim.icon;
            animElement.style.color = anim === animatronics.sparkyFox ? '#f0f' : '#f00';
            animElement.style.fontSize = '80px';
            rightWindow.appendChild(animElement);
            
            // Dodaj animację po chwili
            setTimeout(() => {
                animElement.classList.add('visible');
            }, 100);
        }
    }
}

// KONTROLA GRY
function toggleLeftDoor() {
    if (gameState.isPowerOut) {
        showGameHint("System drzwi nie działa - brak zasilania!");
        return;
    }
    
    gameState.leftDoorClosed = !gameState.leftDoorClosed;
    
    const leftDoor = document.getElementById('left-door');
    if (gameState.leftDoorClosed) {
        leftDoor.classList.add('closed');
        showGameHint("Lewe drzwi zamknięte");
    } else {
        leftDoor.classList.remove('closed');
        showGameHint("Lewe drzwi otwarte");
    }
    
    updateDoorButtons();
    updateDoorStatus();
    playSound('doorClose');
    
    // Aktualizuj widok okna
    updateWindowViews();
}

function toggleRightDoor() {
    if (gameState.isPowerOut) {
        showGameHint("System drzwi nie działa - brak zasilania!");
        return;
    }
    
    gameState.rightDoorClosed = !gameState.rightDoorClosed;
    
    const rightDoor = document.getElementById('right-door');
    if (gameState.rightDoorClosed) {
        rightDoor.classList.add('closed');
        showGameHint("Prawe drzwi zamknięte");
    } else {
        rightDoor.classList.remove('closed');
        showGameHint("Prawe drzwi otwarte");
    }
    
    updateDoorButtons();
    updateDoorStatus();
    playSound('doorClose');
    
    // Aktualizuj widok okna
    updateWindowViews();
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
    
    // Odstrasz animatroniki przy drzwiach
    for (const [key, anim] of Object.entries(animatronics)) {
        if (anim.atLeftDoor || anim.atRightDoor) {
            // Cofnij animatronika
            anim.position = anim.atLeftDoor ? 2 : 10;
            anim.atLeftDoor = false;
            anim.atRightDoor = false;
            hideAnimatronic(key);
            
            // Dodaj opóźnienie przed następnym ruchem
            anim.lastMoveTime = Date.now() + 5000;
        }
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
        item.classList.remove('has-animatronic');
    });
    
    const activeButton = document.querySelector(`.camera-grid-item[data-camera="${cameraId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Sprawdź czy są animatroniki w tym pomieszczeniu
    const animsInRoom = [];
    for (const [key, anim] of Object.entries(animatronics)) {
        if (anim.active && anim.position === cameraId && !anim.inVent) {
            animsInRoom.push(anim);
            if (activeButton) {
                activeButton.classList.add('has-animatronic');
            }
        }
    }
    
    // Aktualizuj podgląd
    updateCameraFeed(cameraId, animsInRoom);
    document.getElementById('active-cam-count').textContent = cameraId;
    
    playSound('cameraSwitch');
}

function updateCameraFeed(cameraId, animsInRoom = []) {
    const camera = cameraLocations.find(c => c.id === cameraId);
    if (!camera) return;
    
    // Aktualizuj informacje
    document.getElementById('camera-name-display').textContent = `KAMERA ${cameraId}: ${camera.name}`;
    document.getElementById('camera-time-display').textContent = getTimeString();
    
    // Wyświetl pomieszczenie
    const roomDisplay = document.getElementById('camera-room-display');
    if (roomDisplay) {
        roomDisplay.innerHTML = generateRoomHTML(camera, animsInRoom);
    }
    
    // Aktualizuj status
    const statusText = document.getElementById('camera-status-text');
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (animsInRoom.length > 0) {
        statusText.textContent = `${animsInRoom.length} ANIMATRONIK`;
        statusIndicator.classList.remove('active');
        statusIndicator.classList.add('inactive');
    } else {
        statusText.textContent = 'BRAK AKTYWNOŚCI';
        statusIndicator.classList.remove('inactive');
        statusIndicator.classList.add('active');
    }
}

function generateRoomHTML(camera, animsInRoom) {
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
                    <div class="stage-floor">
                        ${animsInRoom.map(anim => `
                            <div class="stage-animatronic visible" style="color: ${anim === animatronics.boltBear ? '#ff0' : '#f00'}">
                                ${anim.icon}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
        case 'kitchen':
            roomHTML += `
                <div class="room-kitchen">
                    <div class="kitchen-counter"></div>
                    <div class="kitchen-fridge"></div>
                    <div class="kitchen-stove">
                        <div class="stove-burner"></div>
                        <div class="stove-burner"></div>
                        <div class="stove-burner"></div>
                        <div class="stove-burner"></div>
                    </div>
                    ${animsInRoom.map(anim => `
                        <div class="stage-animatronic visible" style="position: absolute; bottom: 20%; left: 50%; transform: translateX(-50%); color: #f00">
                            ${anim.icon}
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        case 'storage':
            roomHTML += `
                <div class="room-storage">
                    <div class="storage-boxes">
                        <div class="storage-box"></div>
                        <div class="storage-box"></div>
                        <div class="storage-box"></div>
                    </div>
                    <div class="storage-shelf"></div>
                    ${animsInRoom.map(anim => `
                        <div class="stage-animatronic visible" style="position: absolute; top: 40%; left: 50%; transform: translateX(-50%); color: #f00">
                            ${anim.icon}
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        case 'vent':
            roomHTML += `
                <div class="room-vent">
                    <div class="vent-tunnel-view">
                        <div class="vent-grate"></div>
                    </div>
                    ${animsInRoom.map(anim => `
                        <div class="stage-animatronic visible" style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%); color: #0af">
                            ${anim.icon}
                        </div>
                    `).join('')}
                </div>
            `;
            break;
        default:
            roomHTML += `
                <div class="room-default" style="background: linear-gradient(0deg, #1a1a1a, #0a0a0a); width: 100%; height: 100%; position: relative;">
                    ${animsInRoom.map(anim => `
                        <div class="stage-animatronic visible" style="position: absolute; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%); color: #f00; font-size: 80px;">
                            ${anim.icon}
                        </div>
                    `).join('')}
                </div>
            `;
    }
    
    roomHTML += `</div>`;
    return roomHTML;
}

function updateCameraDisplay() {
    if (gameState.camerasActive) {
        const animsInRoom = [];
        for (const [key, anim] of Object.entries(animatronics)) {
            if (anim.active && anim.position === currentCamera && !anim.inVent) {
                animsInRoom.push(anim);
            }
        }
        updateCameraFeed(currentCamera, animsInRoom);
    }
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
    playSound('cameraSwitch');
}

// EVENTY GRY
function triggerPowerOut() {
    console.log("Awaria zasilania!");
    
    gameState.isPowerOut = true;
    const warningScreen = document.getElementById('power-out-warning');
    warningScreen.style.display = 'flex';
    
    // Otwórz drzwi
    gameState.leftDoorClosed = false;
    gameState.rightDoorClosed = false;
    document.getElementById('left-door').classList.remove('closed');
    document.getElementById('right-door').classList.remove('closed');
    updateDoorButtons();
    
    // Wyłącz systemy
    gameState.camerasActive = false;
    gameState.leftLightOn = false;
    gameState.rightLightOn = false;
    document.getElementById('camera-system').style.display = 'none';
    document.getElementById('monitor-overlay').style.opacity = '0';
    document.getElementById('left-light').classList.remove('active');
    document.getElementById('right-light').classList.remove('active');
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
                // Wybierz losowego animatronika do jumpscare
                const activeAnims = Object.values(animatronics).filter(anim => anim.active);
                if (activeAnims.length > 0) {
                    const randomAnim = activeAnims[Math.floor(Math.random() * activeAnims.length)];
                    triggerJumpscare(randomAnim);
                }
            }
        }
    }, 1000);
    
    // Zatrzymaj timer po 30 sekundach
    powerOutTimer = setTimeout(() => {
        clearInterval(timerInterval);
        if (warningScreen) {
            warningScreen.style.display = 'none';
        }
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
    jumpscareIcon.style.color = animatronic === animatronics.boltBear ? '#ff0' : '#f00';
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
    // Noc trwa od 12:00 AM do 6:00 AM (8 minut rzeczywistych)
    if (gameState.currentHour >= 6 && gameState.currentMinute >= 0) {
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
    
    // Aktualizuj przyciski drzwi
    updateDoorButtons();
    
    // Aktualizuj kamery jeśli aktywne
    if (gameState.camerasActive) {
        updateCameraDisplay();
    }
}

function getTimeString() {
    const hourDisplay = gameState.currentHour === 0 ? 12 : 
                       gameState.currentHour > 12 ? gameState.currentHour - 12 : gameState.currentHour;
    const ampm = gameState.currentHour >= 12 ? "AM" : "PM";
    return `${hourDisplay}:${gameState.currentMinute.toString().padStart(2, '0')} ${ampm}`;
}

function updateDoorStatus() {
    const leftStatus = document.getElementById('left-door-status-text');
    const rightStatus = document.getElementById('right-door-status-text');
    const leftLight = document.getElementById('left-door-status-light');
    const rightLight = document.getElementById('right-door-status-light');
    const leftControl = document.querySelector('.left-door-control');
    const rightControl = document.querySelector('.right-door-control');
    
    if (gameState.leftDoorClosed) {
        if (leftStatus) leftStatus.textContent = "ZAMKNIĘTE";
        if (leftStatus) leftStatus.style.color = '#f00';
        if (leftLight) leftLight.style.background = '#f00';
        if (leftLight) leftLight.style.boxShadow = '0 0 5px #f00';
        if (leftControl) leftControl.classList.add('closed');
    } else {
        if (leftStatus) leftStatus.textContent = "OTWARTE";
        if (leftStatus) leftStatus.style.color = '#0f0';
        if (leftLight) leftLight.style.background = '#0f0';
        if (leftLight) leftLight.style.boxShadow = '0 0 5px #0f0';
        if (leftControl) leftControl.classList.remove('closed');
    }
    
    if (gameState.rightDoorClosed) {
        if (rightStatus) rightStatus.textContent = "ZAMKNIĘTE";
        if (rightStatus) rightStatus.style.color = '#f00';
        if (rightLight) rightLight.style.background = '#f00';
        if (rightLight) rightLight.style.boxShadow = '0 0 5px #f00';
        if (rightControl) rightControl.classList.add('closed');
    } else {
        if (rightStatus) rightStatus.textContent = "OTWARTE";
        if (rightStatus) rightStatus.style.color = '#0f0';
        if (rightLight) rightLight.style.background = '#0f0';
        if (rightLight) rightLight.style.boxShadow = '0 0 5px #0f0';
        if (rightControl) rightControl.classList.remove('closed');
    }
}

function updateDoorButtons() {
    const leftButton = document.getElementById('hud-left-door');
    const rightButton = document.getElementById('hud-right-door');
    const leftPhysicalButton = document.getElementById('left-door-button');
    const rightPhysicalButton = document.getElementById('right-door-button');
    
    if (gameState.leftDoorClosed) {
        if (leftButton) leftButton.classList.add('active');
        if (leftPhysicalButton) leftPhysicalButton.classList.add('active');
    } else {
        if (leftButton) leftButton.classList.remove('active');
        if (leftPhysicalButton) leftPhysicalButton.classList.remove('active');
    }
    
    if (gameState.rightDoorClosed) {
        if (rightButton) rightButton.classList.add('active');
        if (rightPhysicalButton) rightPhysicalButton.classList.add('active');
    } else {
        if (rightButton) rightButton.classList.remove('active');
        if (rightPhysicalButton) rightPhysicalButton.classList.remove('active');
    }
}

function updateLightButtons() {
    const leftButton = document.getElementById('hud-left-light');
    const rightButton = document.getElementById('hud-right-light');
    const leftLight = document.getElementById('left-light');
    const rightLight = document.getElementById('right-light');
    
    if (gameState.leftLightOn) {
        if (leftButton) leftButton.classList.add('active');
        if (leftLight) leftLight.classList.add('active');
    } else {
        if (leftButton) leftButton.classList.remove('active');
        if (leftLight) leftLight.classList.remove('active');
    }
    
    if (gameState.rightLightOn) {
        if (rightButton) rightButton.classList.add('active');
        if (rightLight) rightLight.classList.add('active');
    } else {
        if (rightButton) rightButton.classList.remove('active');
        if (rightLight) rightLight.classList.remove('active');
    }
}

function showGameHint(message) {
    if (!gameState.settings.hud.showHints) return;
    
    const hintText = document.getElementById('current-hint');
    if (hintText) {
        hintText.textContent = message;
        
        // Wyczyść po 5 sekundach
        setTimeout(() => {
            if (hintText.textContent === message) {
                hintText.textContent = 'Użyj C dla kamer, Q/E dla świateł, L/R dla drzwi';
            }
        }, 5000);
    }
}

// MINIGRA: NAPRAWA WENTYLACJI
function initVentGame() {
    const tunnel = document.getElementById('vent-tunnel');
    if (!tunnel) return;
    
    // Wyczyść tunel
    tunnel.innerHTML = '';
    
    // Dodaj punkty napraw
    const repairPoints = document.querySelector('.repair-points');
    if (repairPoints) {
        repairPoints.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const point = document.createElement('div');
            point.className = 'repair-point';
            point.style.left = `${10 + (i * 8)}%`;
            point.innerHTML = '<i class="fas fa-bolt"></i>';
            point.addEventListener('click', () => repairVentPoint(point));
            repairPoints.appendChild(point);
        }
    }
}

function startMinigame(gameType) {
    switch(gameType) {
        case 'ventRepair':
            showScreen('minigame-vent');
            resetVentGame();
            break;
        default:
            alert(`Minigra "${gameType}" w budowie!`);
            showScreen('menu');
    }
}

function resetVentGame() {
    ventGameActive = false;
    ventRepairs = 0;
    ventTime = 60;
    ventPlayerPos = 10;
    ventAnimatronicPos = 90;
    
    document.getElementById('vent-time').textContent = ventTime;
    document.getElementById('vent-repairs').textContent = ventRepairs;
    document.getElementById('vent-threat').textContent = '3';
    
    const player = document.getElementById('vent-player');
    const animatronic = document.getElementById('vent-animatronic');
    
    if (player) player.style.left = `${ventPlayerPos}%`;
    if (animatronic) animatronic.style.left = `${ventAnimatronicPos}%`;
    
    // Zresetuj punkty napraw
    document.querySelectorAll('.repair-point').forEach(point => {
        point.classList.remove('repaired');
    });
}

function startVentGame() {
    ventGameActive = true;
    ventTime = 60;
    ventRepairs = 0;
    
    document.getElementById('vent-start').style.display = 'none';
    
    // Start timer
    ventGameInterval = setInterval(() => {
        if (!ventGameActive) return;
        
        ventTime--;
        document.getElementById('vent-time').textContent = ventTime;
        
        // Ruch animatronika
        ventAnimatronicPos -= 0.5;
        const animatronic = document.getElementById('vent-animatronic');
        if (animatronic) animatronic.style.left = `${ventAnimatronicPos}%`;
        
        // Sprawdź kolizję
        if (Math.abs(ventPlayerPos - ventAnimatronicPos) < 5) {
            endVentGame(false);
        }
        
        // Sprawdź czy czas się skończył
        if (ventTime <= 0) {
            endVentGame(ventRepairs >= 10);
        }
    }, 1000);
}

function moveVentPlayer(direction) {
    if (!ventGameActive) return;
    
    ventPlayerPos = Math.max(5, Math.min(95, ventPlayerPos + direction));
    const player = document.getElementById('vent-player');
    if (player) player.style.left = `${ventPlayerPos}%`;
    
    playSound('menuSelect');
}

function repairVent() {
    if (!ventGameActive) return;
    
    // Znajdź najbliższy punkt napraw
    const points = document.querySelectorAll('.repair-point:not(.repaired)');
    let closestPoint = null;
    let closestDistance = Infinity;
    
    points.forEach(point => {
        const pointPos = parseFloat(point.style.left);
        const distance = Math.abs(ventPlayerPos - pointPos);
        if (distance < closestDistance && distance < 8) {
            closestDistance = distance;
            closestPoint = point;
        }
    });
    
    if (closestPoint) {
        closestPoint.classList.add('repaired');
        ventRepairs++;
        document.getElementById('vent-repairs').textContent = ventRepairs;
        playSound('lightSwitch');
        
        if (ventRepairs >= 10) {
            endVentGame(true);
        }
    }
}

function repairVentPoint(point) {
    if (!ventGameActive || point.classList.contains('repaired')) return;
    
    point.classList.add('repaired');
    ventRepairs++;
    document.getElementById('vent-repairs').textContent = ventRepairs;
    playSound('lightSwitch');
    
    if (ventRepairs >= 10) {
        endVentGame(true);
    }
}

function endVentGame(success) {
    ventGameActive = false;
    clearInterval(ventGameInterval);
    
    if (success) {
        alert('Gratulacje! Naprawiłeś system wentylacji!\nZdobywasz bonus do następnej nocy!');
        // Dodaj bonus do następnej nocy
        gameState.playerMoney += 50;
    } else {
        alert('Nie udało się! Animatronik cię dopadł!');
    }
    
    showScreen('minigames-screen');
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
    
    // Grafika
    document.getElementById('texture-quality').value = gameState.settings.graphics.textureQuality;
    document.getElementById('screen-shake').checked = gameState.settings.graphics.screenShake;
    document.getElementById('light-effects').checked = gameState.settings.graphics.lightEffects;
    
    // Gameplay
    document.getElementById('difficulty-level').value = gameState.settings.gameplay.difficulty;
    document.getElementById('power-drain').value = gameState.settings.gameplay.powerDrain;
    document.getElementById('anim-speed').value = gameState.settings.gameplay.animSpeed;
    
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
    
    if (gameState.settings.hud.animations) {
        hud.classList.add('animated');
    }
    
    // Ustaw przezroczystość
    hud.style.opacity = `${gameState.settings.hud.opacity / 100}`;
}

// AUDIO
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log("AudioContext zainicjalizowany");
    } catch (e) {
        console.log("Audio API nie dostępne:", e);
    }
}

function playSound(soundName) {
    if (!audioContext || gameState.settings.audio.masterVolume === 0) return;
    
    const masterVolume = gameState.settings.audio.masterVolume / 100;
    const sfxVolume = gameState.settings.audio.sfxVolume / 100;
    const volume = masterVolume * sfxVolume;
    
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
        console.log("Gra zapisana");
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
    
    // Sterowanie minigrą wentylacji
    if (ventGameActive) {
        if (key === 'ARROWLEFT' || key === 'A') {
            moveVentPlayer(-10);
            e.preventDefault();
        } else if (key === 'ARROWRIGHT' || key === 'D') {
            moveVentPlayer(10);
            e.preventDefault();
        } else if (key === ' ' || key === 'ENTER') {
            repairVent();
            e.preventDefault();
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
    clearInterval(ventGameInterval);
}

function updateMenuUI() {
    const hintText = document.getElementById('menu-hint-text');
    if (hintText) {
        hintText.textContent = 'Wybierz wersję gry i kliknij NOWA GRA aby rozpocząć';
    }
}

function showCustomNight() {
    alert('Tryb własnej nocy będzie dostępny w przyszłej aktualizacji!');
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
window.cameraLocations = cameraLocations;
