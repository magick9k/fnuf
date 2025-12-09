// FNUF ULTIMATE FEAR COLLECTION - GŁÓWNY KOD
// ==========================================

// GLOBALNE ZMIENNE I KONFIGURACJA
// ================================

// Stan gry
const GameState = {
    // Podstawowe
    currentVersion: 1, // 1, 2 lub 3
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
    totalNightsCompleted: 0,
    jumpscaresSurvived: 0,
    
    // Ustawienia
    settings: {
        audio: {
            masterVolume: 70,
            musicVolume: 60,
            sfxVolume: 80,
            animatronicVolume: 90,
            muteJumpscares: false,
            staticEffects: true
        },
        graphics: {
            textureQuality: 'medium',
            lightingQuality: 'medium',
            renderQuality: 'medium',
            filmEffects: true,
            lensEffects: false,
            screenShake: true
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
            },
            minigameBinds: {
                left: 'ArrowLeft',
                right: 'ArrowRight',
                shoot: ' ',
                pause: 'Escape'
            },
            mouseControl: false
        },
        gameplay: {
            difficulty: 'normal',
            powerDrain: 'normal',
            audioWarnings: true,
            interfaceHints: true,
            nightTimer: true,
            autosave: 'night'
        }
    },
    
    // Postęp
    progress: {
        fnuf1: {
            nightsCompleted: 0,
            customNightBest: 0,
            jumpscares: 0,
            minigames: {}
        },
        fnuf2: {
            nightsCompleted: 0,
            customNightBest: 0,
            jumpscares: 0,
            minigames: {}
        },
        fnuf3: {
            nightsCompleted: 0,
            customNightBest: 0,
            jumpscares: 0,
            minigames: {}
        }
    }
};

// Animatroniki FNUF 1
const AnimatronicsFNUF1 = {
    boltBear: {
        name: "Bolt Bear",
        difficulty: 10,
        movementPattern: [1, 2, 3, 7, 10],
        aggression: 1.0,
        position: 1,
        active: true,
        jumpscareTime: 2.0,
        audioCues: ['growl1', 'growl2', 'roar'],
        model: 'boltBear'
    },
    sparkyFox: {
        name: "Sparky Fox",
        difficulty: 8,
        movementPattern: [4, 5, 6, 9, 10],
        aggression: 0.9,
        position: 4,
        active: true,
        jumpscareTime: 1.8,
        audioCues: ['chatter', 'laugh', 'screech'],
        model: 'sparkyFox'
    },
    chicaChick: {
        name: "Chica Chick",
        difficulty: 7,
        movementPattern: [8, 7, 3, 10],
        aggression: 0.8,
        position: 8,
        active: true,
        jumpscareTime: 2.2,
        audioCues: ['cluck', 'squawk', 'screech'],
        model: 'chicaChick'
    },
    fangPirate: {
        name: "Fang the Pirate",
        difficulty: 9,
        movementPattern: [11, 10, 7, 3, 2],
        aggression: 0.95,
        position: 11,
        active: true,
        jumpscareTime: 2.5,
        audioCues: ['laugh', 'growl', 'roar'],
        model: 'fangPirate'
    },
    goldenBolt: {
        name: "Golden Bolt",
        difficulty: 20,
        movementPattern: [0, 0, 0, 0, 0],
        aggression: 0.1,
        position: 0,
        active: false,
        jumpscareTime: 3.0,
        audioCues: ['static', 'whisper', 'scream'],
        model: 'goldenBolt'
    }
};

// Lokacje kamer FNUF 1
const CameraLocationsFNUF1 = [
    { id: 1, name: "Scena Główna", description: "Główna scena z animatronikami", hasPoster: true },
    { id: 2, name: "Korytarz Główny", description: "Główny korytarz prowadzący do biura", hasLight: true },
    { id: 3, name: "Korytarz Lewy", description: "Lewy korytarz przed biurem", nearLeftDoor: true },
    { id: 4, name: "Kuchnia", description: "Kuchnia i jadalnia", hasUtensils: true },
    { id: 5, name: "Pokój Zabaw", description: "Pokój zabaw dla dzieci", hasToys: true },
    { id: 6, name: "Wentylacja A", description: "System wentylacji - część A", isVent: true },
    { id: 7, name: "Przed Biurem", description: "Obszar bezpośrednio przed biurem", critical: true },
    { id: 8, name: "Magazyn", description: "Magazyn sprzętu i części zamiennych", hasBoxes: true },
    { id: 9, name: "Wentylacja B", description: "System wentylacji - część B", isVent: true },
    { id: 10, name: "Za Biurem", description: "Tajny obszar za biurem", hidden: true },
    { id: 11, name: "Prawy Korytarz", description: "Prawy korytarz przed biurem", nearRightDoor: true },
    { id: 12, name: "Wejście", description: "Główne wejście do kompleksu", hasDoor: true }
];

// Minigry
const Minigames = {
    ventRepair: {
        name: "Naprawa Wentylacji",
        description: "Napraw system wentylacji przed atakiem animatroników",
        controls: {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            action: ' ',
            pause: 'Escape'
        },
        highScore: 0,
        unlocked: false,
        requiredNight: 1
    },
    memoryMatch: {
        name: "Pamięć Animatroników",
        description: "Znajdź pary animatroników zanim czas się skończy",
        controls: {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            action: ' ',
            pause: 'Escape'
        },
        highScore: 0,
        unlocked: false,
        requiredNight: 2
    },
    cameraHack: {
        name: "Hakowanie Kamer",
        description: "Przełączaj kamery aby śledzić uciekające animatroniki",
        controls: {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            action: ' ',
            pause: 'Escape'
        },
        highScore: 0,
        unlocked: false,
        requiredNight: 3
    },
    powerGrid: {
        name: "Sieć Energii",
        description: "Połącz kable aby przywrócić zasilanie",
        controls: {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            action: ' ',
            pause: 'Escape'
        },
        highScore: 0,
        unlocked: false,
        requiredNight: 4
    }
};

// Zmienne globalne
let gameVersion = 1;
let activeAnimatronics = { ...AnimatronicsFNUF1 };
let currentCamera = 1;
let gameTimer;
let animatronicTimer;
let powerOutTimer;
let nightCompletionTimer;
let audioContext;
let minigameActive = false;
let minigameType = '';
let minigameScore = 0;
let minigameTime = 60;
let minigameLevel = 1;
let minigameInterval;
let cameraFeedInterval;
let loadingProgress = 0;

// THREE.js zmienne
let scene, camera, renderer, controls;
let officeScene, animatronicModels = {};
let minigameScene, minigameCamera, minigameRenderer;

// DOM Elementy
const screens = {
    loading: document.getElementById('loading-screen'),
    menu: document.getElementById('menu'),
    settings: document.getElementById('settings-screen'),
    game1: document.getElementById('game-screen-fnuf1'),
    game2: document.getElementById('game-screen-fnuf2'),
    game3: document.getElementById('game-screen-fnuf3'),
    minigames: document.getElementById('minigames-screen'),
    minigameCanvas: document.getElementById('minigame-canvas-container'),
    credits: document.getElementById('credits-screen')
};

// INICJALIZACJA GRY
// ==================

function initGame() {
    console.log('=== FNUF ULTIMATE FEAR COLLECTION ===');
    console.log('Inicjalizacja gry...');
    
    // Ukryj wszystkie ekrany oprócz loading
    Object.values(screens).forEach(screen => {
        if (screen && screen !== screens.loading) {
            screen.classList.remove('active');
            screen.style.display = 'none';
        }
    });
    
    // Rozpocznij ładowanie
    startLoading();
}

function startLoading() {
    console.log('Rozpoczynanie ładowania zasobów...');
    
    // Symulacja ładowania
    const loadingInterval = setInterval(() => {
        loadingProgress += Math.random() * 10;
        if (loadingProgress > 100) loadingProgress = 100;
        
        document.querySelector('.loading-progress').style.width = loadingProgress + '%';
        document.querySelector('.loading-text').textContent = 
            `Ładowanie zasobów gry... ${Math.floor(loadingProgress)}%`;
        
        if (loadingProgress >= 100) {
            clearInterval(loadingInterval);
            finishLoading();
        }
    }, 100);
    
    // Rzeczywiste ładowanie zasobów
    loadGameData();
    initAudio();
    initEventListeners();
}

function finishLoading() {
    console.log('Ładowanie zakończone!');
    
    // Ukryj ekran ładowania
    screens.loading.style.display = 'none';
    
    // Pokaż menu główne
    showScreen('menu');
    
    // Załaduj ustawienia
    loadSettings();
    
    // Zaktualizuj UI
    updateMenuUI();
    
    // Rozpocznij animację 3D w tle
    startMenuAnimations();
}

function loadGameData() {
    console.log('Ładowanie danych gry...');
    
    // Ładowanie postępu z localStorage
    const savedProgress = localStorage.getItem('fnufProgress');
    if (savedProgress) {
        try {
            const progress = JSON.parse(savedProgress);
            GameState.progress = { ...GameState.progress, ...progress };
            GameState.playerMoney = progress.playerMoney || 0;
            GameState.totalNightsCompleted = progress.totalNightsCompleted || 0;
            
            console.log('Postęp gry załadowany');
        } catch (e) {
            console.error('Błąd ładowania postępu:', e);
        }
    }
    
    // Aktualizuj odblokowane minigry
    updateUnlockedMinigames();
}

// SYSTEM AUDIO
// ============

function initAudio() {
    console.log('Inicjalizacja systemu audio...');
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('AudioContext utworzony');
    } catch (e) {
        console.error('Web Audio API nie jest wspierane:', e);
    }
}

function playSound(soundName, options = {}) {
    if (!audioContext || GameState.settings.audio.masterVolume === 0) return;
    
    const volume = GameState.settings.audio.sfxVolume / 100;
    if (volume <= 0) return;
    
    try {
        switch(soundName) {
            case 'menuSelect':
                playMenuSelect();
                break;
            case 'cameraSwitch':
                playCameraSwitch();
                break;
            case 'doorClose':
                playDoorClose();
                break;
            case 'lightSwitch':
                playLightSwitch();
                break;
            case 'buzzer':
                playBuzzer();
                break;
            case 'powerOut':
                playPowerOut();
                break;
            case 'jumpscare':
                if (!GameState.settings.audio.muteJumpscares) {
                    playJumpscare();
                }
                break;
            case 'nightComplete':
                playNightComplete();
                break;
            default:
                playBeep();
        }
    } catch (e) {
        console.error('Błąd odtwarzania dźwięku:', e);
    }
}

function playMenuSelect() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.1 * GameState.settings.audio.sfxVolume / 100, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

function playCameraSwitch() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.05 * GameState.settings.audio.sfxVolume / 100, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playDoorClose() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.1 * GameState.settings.audio.sfxVolume / 100, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

// EVENT LISTENERY
// ===============

function initEventListeners() {
    console.log('Inicjalizacja event listenerów...');
    
    // Menu główne
    document.getElementById('new-game-btn').addEventListener('click', showNightSelect);
    document.getElementById('continue-btn').addEventListener('click', continueGame);
    document.getElementById('extras-btn').addEventListener('click', showMinigames);
    document.getElementById('settings-btn').addEventListener('click', showSettings);
    document.getElementById('credits-btn').addEventListener('click', showCredits);
    
    // Wybór wersji
    document.querySelectorAll('.version-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const version = parseInt(this.getAttribute('data-version'));
            selectGameVersion(version);
        });
    });
    
    // Wybór nocy
    document.querySelectorAll('.night-card:not(.custom-night)').forEach(card => {
        card.addEventListener('click', function() {
            const night = parseInt(this.getAttribute('data-night'));
            startNight(night);
        });
    });
    
    document.getElementById('night-select-back').addEventListener('click', hideNightSelect);
    document.getElementById('custom-night-btn').addEventListener('click', toggleCustomNightPanel);
    document.getElementById('start-custom-night').addEventListener('click', startCustomNight);
    
    // Suwaki AI
    document.querySelectorAll('.ai-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const value = this.value;
            const animatronic = this.getAttribute('data-animatronic');
            const valueSpan = this.nextElementSibling;
            valueSpan.textContent = value;
            
            // Aktualizuj trudność animatronika
            if (activeAnimatronics[animatronic]) {
                activeAnimatronics[animatronic].difficulty = parseInt(value);
            }
        });
    });
    
    // Ustawienia
    document.getElementById('settings-back').addEventListener('click', hideSettings);
    document.getElementById('apply-settings').addEventListener('click', applySettings);
    document.getElementById('cancel-settings').addEventListener('click', hideSettings);
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
    
    // Suwaki głośności
    document.getElementById('master-volume').addEventListener('input', function() {
        document.getElementById('master-volume-value').textContent = this.value + '%';
    });
    
    document.getElementById('music-volume').addEventListener('input', function() {
        document.getElementById('music-volume-value').textContent = this.value + '%';
    });
    
    document.getElementById('sfx-volume').addEventListener('input', function() {
        document.getElementById('sfx-volume-value').textContent = this.value + '%';
    });
    
    document.getElementById('animatronic-volume').addEventListener('input', function() {
        document.getElementById('animatronic-volume-value').textContent = this.value + '%';
    });
    
    // Keybinds
    document.querySelectorAll('.keybind-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            startKeybindChange(action, this);
        });
    });
    
    // Minigry
    document.getElementById('minigames-back').addEventListener('click', hideMinigames);
    document.querySelectorAll('.play-minigame-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const game = this.getAttribute('data-game');
            startMinigame(game);
        });
    });
    
    document.getElementById('minigame-close').addEventListener('click', hideMinigame);
    document.getElementById('minigame-pause').addEventListener('click', toggleMinigamePause);
    
    // Credits
    document.getElementById('credits-back').addEventListener('click', hideCredits);
    
    // FNUF 2 i 3 back buttons
    document.getElementById('fnuf2-back')?.addEventListener('click', () => showScreen('menu'));
    document.getElementById('fnuf3-back')?.addEventListener('click', () => showScreen('menu'));
    
    // Sterowanie klawiszami
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    console.log('Event listenery zainicjalizowane');
}

// ZARZĄDZANIE EKRANAMI
// ====================

function showScreen(screenId) {
    console.log('Przełączanie na ekran:', screenId);
    
    // Ukryj wszystkie ekrany
    Object.values(screens).forEach(screen => {
        if (screen) {
            screen.classList.remove('active');
            screen.style.display = 'none';
        }
    });
    
    // Pokaż wybrany ekran
    const screen = screens[screenId];
    if (screen) {
        screen.classList.add('active');
        screen.style.display = 'flex' || 'block';
        
        // Dodatkowe akcje dla konkretnych ekranów
        switch(screenId) {
            case 'menu':
                updateMenuUI();
                startMenuAnimations();
                break;
            case 'game1':
                initGameScene();
                startGame();
                break;
            case 'minigames':
                updateMinigamesUI();
                break;
        }
    }
    
    playSound('menuSelect');
}

function selectGameVersion(version) {
    console.log('Wybrano wersję gry:', version);
    gameVersion = version;
    
    // Aktualizuj aktywne zakładki
    document.querySelectorAll('.version-tab').forEach(tab => {
        tab.classList.remove('active');
        if (parseInt(tab.getAttribute('data-version')) === version) {
            tab.classList.add('active');
        }
    });
    
    // Aktualizuj opisy
    document.querySelectorAll('.version-description').forEach(desc => {
        desc.classList.remove('active');
    });
    document.getElementById(`desc-${version}`).classList.add('active');
    
    // Aktualizuj kolorystykę w zależności od wersji
    updateColorsForVersion(version);
    
    playSound('menuSelect');
}

function updateColorsForVersion(version) {
    const root = document.documentElement;
    
    switch(version) {
        case 1:
            root.style.setProperty('--fnuf-primary', 'var(--fnuf1-primary)');
            root.style.setProperty('--fnuf-secondary', 'var(--fnuf1-secondary)');
            break;
        case 2:
            root.style.setProperty('--fnuf-primary', 'var(--fnuf2-primary)');
            root.style.setProperty('--fnuf-secondary', 'var(--fnuf2-secondary)');
            break;
        case 3:
            root.style.setProperty('--fnuf-primary', 'var(--fnuf3-primary)');
            root.style.setProperty('--fnuf-secondary', 'var(--fnuf3-secondary)');
            break;
    }
}

function showNightSelect() {
    console.log('Pokazywanie wyboru nocy');
    
    document.getElementById('night-select').classList.add('active');
    document.getElementById('custom-night-panel').classList.remove('active');
    
    playSound('menuSelect');
}

function hideNightSelect() {
    document.getElementById('night-select').classList.remove('active');
    playSound('menuSelect');
}

function toggleCustomNightPanel() {
    const panel = document.getElementById('custom-night-panel');
    panel.classList.toggle('active');
    playSound('menuSelect');
}

// ROZPOCZĘCIE GRY
// ===============

function startNight(night, isCustom = false) {
    console.log(`Rozpoczynanie nocy ${night}${isCustom ? ' (własna)' : ''}`);
    
    // Reset stanu gry
    resetGameState();
    
    // Ustaw parametry nocy
    GameState.currentNight = night;
    GameState.currentVersion = gameVersion;
    GameState.gameActive = true;
    
    // Ustaw trudność
    if (!isCustom) {
        setNightDifficulty(night);
    }
    
    // Pokaż odpowiedni ekran gry
    switch(gameVersion) {
        case 1:
            showScreen('game1');
            break;
        case 2:
            showScreen('game2');
            break;
        case 3:
            showScreen('game3');
            break;
    }
    
    // Rozpocznij grę
    startGameTimers();
    updateGameUI();
    
    playSound('menuSelect');
}

function startCustomNight() {
    console.log('Rozpoczynanie własnej nocy');
    
    // Zbierz ustawienia AI
    const aiSettings = {};
    document.querySelectorAll('.ai-slider').forEach(slider => {
        const animatronic = slider.getAttribute('data-animatronic');
        const value = parseInt(slider.value);
        aiSettings[animatronic] = value;
    });
    
    // Ustaw trudność animatroników
    Object.keys(aiSettings).forEach(key => {
        if (activeAnimatronics[key]) {
            activeAnimatronics[key].difficulty = aiSettings[key];
            activeAnimatronics[key].aggression = aiSettings[key] / 20;
        }
    });
    
    // Rozpocznij noc 6 z custom ustawieniami
    startNight(6, true);
}

function continueGame() {
    console.log('Kontynuowanie gry');
    
    // Załaduj ostatni zapisany postęp
    const lastPlayed = localStorage.getItem('fnufLastPlayed');
    if (lastPlayed) {
        try {
            const data = JSON.parse(lastPlayed);
            gameVersion = data.version || 1;
            startNight(data.night || 1);
        } catch (e) {
            console.error('Błąd ładowania ostatniej gry:', e);
            showNightSelect();
        }
    } else {
        showNightSelect();
    }
}

function resetGameState() {
    console.log('Resetowanie stanu gry');
    
    // Podstawowe wartości
    GameState.currentHour = 12;
    GameState.currentMinute = 0;
    GameState.power = 100;
    GameState.isPowerOut = false;
    GameState.gameActive = true;
    GameState.gamePaused = false;
    GameState.camerasActive = false;
    GameState.leftDoorClosed = false;
    GameState.rightDoorClosed = false;
    GameState.leftLightOn = false;
    GameState.rightLightOn = false;
    GameState.buzzerActive = false;
    GameState.jumpscareActive = false;
    GameState.nightCompleted = false;
    GameState.activeAnimatronics = 0;
    GameState.gameTime = 0;
    
    // Reset animatroników
    Object.keys(activeAnimatronics).forEach(key => {
        if (activeAnimatronics[key]) {
            activeAnimatronics[key].position = activeAnimatronics[key].movementPattern[0];
            activeAnimatronics[key].active = true;
        }
    });
    
    // Reset UI
    document.getElementById('camera-system').style.display = 'none';
    document.getElementById('monitor-overlay').style.opacity = '0';
    document.getElementById('power-out-warning').style.display = 'none';
    document.getElementById('jumpscare-screen').style.display = 'none';
    document.getElementById('night-complete-screen').style.display = 'none';
    
    // Wyłącz kamery i światła
    updateDoorButtons();
    updateLightButtons();
    updateCameraDisplay();
}

function setNightDifficulty(night) {
    console.log(`Ustawianie trudności dla nocy ${night}`);
    
    const difficultyMultiplier = 1 + (night - 1) * 0.2;
    
    Object.keys(activeAnimatronics).forEach(key => {
        if (activeAnimatronics[key]) {
            activeAnimatronics[key].aggression = Math.min(1, 
                activeAnimatronics[key].aggression * difficultyMultiplier);
            activeAnimatronics[key].difficulty = Math.floor(
                activeAnimatronics[key].difficulty * difficultyMultiplier
            );
        }
    });
    
    // Ustaw drenaż energii
    GameState.powerDrain = 0.2 + (night - 1) * 0.05;
    
    // Aktywuj Golden Bolt od 3 nocy
    if (night >= 3 && activeAnimatronics.goldenBolt) {
        activeAnimatronics.goldenBolt.active = true;
    }
}

// SYSTEM GRY
// ==========

function startGameTimers() {
    console.log('Uruchamianie timerów gry');
    
    // Zatrzymaj istniejące timery
    clearAllTimers();
    
    // Timer gry (czas i energia)
    gameTimer = setInterval(() => {
        if (GameState.gameActive && !GameState.gamePaused && !GameState.jumpscareActive) {
            updateGameTime();
            updatePower();
            updateGameUI();
            checkNightCompletion();
        }
    }, 1000); // 1 sekunda = 1 minuta w grze
    
    // Timer animatroników
    animatronicTimer = setInterval(() => {
        if (GameState.gameActive && !GameState.gamePaused && !GameState.jumpscareActive) {
            updateAnimatronics();
        }
    }, 3000); // Ruch animatroników co 3 sekundy
}

function updateGameTime() {
    GameState.currentMinute++;
    GameState.gameTime++;
    
    if (GameState.currentMinute >= 60) {
        GameState.currentMinute = 0;
        GameState.currentHour++;
        
        if (GameState.currentHour >= 24) {
            GameState.currentHour = 0;
        }
    }
}

function updatePower() {
    if (GameState.isPowerOut) return;
    
    let drain = GameState.powerDrain;
    
    // Dodatkowe zużycie przez aktywne systemy
    if (GameState.camerasActive) drain += 0.5;
    if (GameState.leftDoorClosed) drain += 1;
    if (GameState.rightDoorClosed) drain += 1;
    if (GameState.leftLightOn) drain += 0.3;
    if (GameState.rightLightOn) drain += 0.3;
    if (GameState.buzzerActive) drain += 2;
    
    GameState.power -= drain;
    
    if (GameState.power <= 0) {
        GameState.power = 0;
        GameState.isPowerOut = true;
        triggerPowerOut();
    }
}

function updateAnimatronics() {
    let activeCount = 0;
    
    Object.keys(activeAnimatronics).forEach(key => {
        const animatronic = activeAnimatronics[key];
        
        if (animatronic.active && !GameState.isPowerOut) {
            // Szansa na ruch
            const moveChance = Math.random();
            if (moveChance < (0.3 * animatronic.aggression)) {
                moveAnimatronic(animatronic);
            }
            
            // Sprawdź pozycję
            checkAnimatronicPosition(animatronic);
            
            activeCount++;
        }
    });
    
    GameState.activeAnimatronics = activeCount;
}

function moveAnimatronic(animatronic) {
    const pattern = animatronic.movementPattern;
    const currentIndex = pattern.indexOf(animatronic.position);
    let nextIndex;
    
    if (currentIndex === -1 || currentIndex === pattern.length - 1) {
        nextIndex = 0;
    } else {
        nextIndex = currentIndex + 1;
    }
    
    animatronic.position = pattern[nextIndex];
    
    // Specialne zachowanie dla Golden Bolt
    if (animatronic.name === "Golden Bolt" && animatronic.active) {
        if (Math.random() < 0.05) {
            animatronic.position = Math.floor(Math.random() * 11) + 1;
            
            if ((animatronic.position === 3 || animatronic.position === 11)) {
                if ((animatronic.position === 3 && !GameState.leftDoorClosed) || 
                    (animatronic.position === 11 && !GameState.rightDoorClosed)) {
                    triggerJumpscare(animatronic);
                }
            }
        } else {
            animatronic.position = 0;
        }
    }
}

function checkAnimatronicPosition(animatronic) {
    // Lewe drzwi
    if (animatronic.position === 3) {
        if (animatronic.name === "Bolt Bear") {
            showAnimatronicInOffice(animatronic, 'left');
            
            if (GameState.leftDoorClosed) {
                playSound('doorClose');
            }
        }
    }
    
    // Prawe drzwi
    if (animatronic.position === 11) {
        if (animatronic.name === "Sparky Fox") {
            showAnimatronicInOffice(animatronic, 'right');
            
            if (GameState.rightDoorClosed) {
                playSound('doorClose');
            }
        }
    }
    
    // Ukryj animatronika jeśli nie jest przy drzwiach
    if (animatronic.position !== 3 && animatronic.position !== 11) {
        hideAnimatronicInOffice(animatronic);
    }
    
    // Sprawdź atak
    checkAnimatronicAttack(animatronic);
}

function checkAnimatronicAttack(animatronic) {
    // Atak z pozycji 10 (za biurem)
    if (animatronic.position === 10) {
        const attackChance = Math.random();
        if (attackChance < (0.2 * animatronic.aggression)) {
            if (!GameState.leftDoorClosed && animatronic.name !== "Golden Bolt") {
                triggerJumpscare(animatronic);
            }
        }
    }
    
    // Atak z pozycji 7 (przed biurem)
    if (animatronic.position === 7) {
        const attackChance = Math.random();
        if (attackChance < (0.15 * animatronic.aggression)) {
            if (!GameState.rightDoorClosed && animatronic.name !== "Golden Bolt") {
                triggerJumpscare(animatronic);
            }
        }
    }
}

// EVENTY GRY
// ==========

function triggerPowerOut() {
    console.log('Awaria zasilania!');
    
    GameState.isPowerOut = true;
    
    // Pokaż ostrzeżenie
    document.getElementById('power-out-warning').style.display = 'flex';
    
    // Otwórz drzwi
    GameState.leftDoorClosed = false;
    GameState.rightDoorClosed = false;
    updateDoorButtons();
    
    // Wyłącz systemy
    GameState.camerasActive = false;
    GameState.leftLightOn = false;
    GameState.rightLightOn = false;
    document.getElementById('camera-system').style.display = 'none';
    document.getElementById('monitor-overlay').style.opacity = '0';
    updateLightButtons();
    
    playSound('powerOut');
    
    // Timer na atak
    powerOutTimer = setTimeout(() => {
        if (GameState.isPowerOut && GameState.gameActive) {
            const activeAnims = Object.values(activeAnimatronics).filter(a => a.active && a.position > 0);
            if (activeAnims.length > 0) {
                const randomAnim = activeAnims[Math.floor(Math.random() * activeAnims.length)];
                triggerJumpscare(randomAnim);
            }
        }
    }, 30000);
}

function triggerJumpscare(animatronic) {
    if (GameState.jumpscareActive) return;
    
    console.log(`Jumpscare: ${animatronic.name}`);
    
    GameState.jumpscareActive = true;
    GameState.gameActive = false;
    
    clearAllTimers();
    
    // Pokaż ekran jumpscare
    const jumpscareScreen = document.getElementById('jumpscare-screen');
    const jumpscareName = document.getElementById('jumpscare-name');
    
    jumpscareName.textContent = animatronic.name;
    jumpscareScreen.style.display = 'flex';
    
    // Wstrząs ekranu
    if (GameState.settings.graphics.screenShake) {
        document.getElementById(`game-screen-fnuf${gameVersion}`).style.animation = 'jumpscareShake 0.5s linear infinite';
    }
    
    playSound('jumpscare');
    
    // Zapisz statystyki
    GameState.progress[`fnuf${gameVersion}`].jumpscares++;
    
    // Po 3 sekundach wróć do menu
    setTimeout(() => {
        jumpscareScreen.style.display = 'none';
        GameState.jumpscareActive = false;
        
        if (GameState.settings.graphics.screenShake) {
            document.getElementById(`game-screen-fnuf${gameVersion}`).style.animation = '';
        }
        
        saveGameProgress();
        showScreen('menu');
        hideNightSelect();
        
        resetAnimatronics();
    }, 3000);
}

function checkNightCompletion() {
    if (GameState.currentHour >= 6) {
        completeNight();
    }
}

function completeNight() {
    console.log(`Ukończono noc ${GameState.currentNight}!`);
    
    GameState.gameActive = false;
    GameState.nightCompleted = true;
    
    clearAllTimers();
    
    // Oblicz zarobki
    const basePay = 120.50;
    const nightBonus = GameState.currentNight * 25;
    const powerBonus = Math.max(0, GameState.power) * 0.5;
    const totalPay = basePay + nightBonus + powerBonus;
    
    GameState.playerMoney += totalPay;
    
    // Aktualizuj postęp
    const progressKey = `fnuf${gameVersion}`;
    GameState.progress[progressKey].nightsCompleted = Math.max(
        GameState.progress[progressKey].nightsCompleted,
        GameState.currentNight
    );
    
    GameState.totalNightsCompleted = Math.max(
        GameState.totalNightsCompleted,
        GameState.currentNight
    );
    
    // Pokaż ekran ukończenia
    const completeScreen = document.getElementById('night-complete-screen');
    document.getElementById('complete-night').textContent = GameState.currentNight;
    document.getElementById('stat-earnings').textContent = totalPay.toFixed(2);
    document.getElementById('stat-energy').textContent = GameState.power.toFixed(1);
    document.getElementById('stat-attacks').textContent = GameState.jumpscaresSurvived;
    document.getElementById('stat-time').textContent = getTimeString();
    document.getElementById('total-earnings').textContent = GameState.playerMoney.toFixed(2);
    
    completeScreen.style.display = 'flex';
    
    playSound('nightComplete');
    
    // Zapisz postęp
    saveGameProgress();
    
    // Odblokuj minigry jeśli potrzeba
    updateUnlockedMinigames();
}

function nextNight() {
    GameState.currentNight++;
    document.getElementById('night-complete-screen').style.display = 'none';
    startNight(GameState.currentNight);
}

// UI FUNCTIONS
// ============

function updateGameUI() {
    // Aktualizuj czas
    const timeString = getTimeString();
    document.querySelector('.digital-clock').textContent = timeString;
    document.getElementById('hud-time').textContent = timeString;
    
    // Aktualizuj energię
    const powerPercent = Math.max(0, Math.min(100, GameState.power));
    document.getElementById('hud-power').textContent = `${powerPercent.toFixed(1)}%`;
    document.querySelector('.power-fill').style.width = `${powerPercent}%`;
    
    if (powerPercent < 20) {
        document.getElementById('hud-power').classList.add('warning');
    } else {
        document.getElementById('hud-power').classList.remove('warning');
    }
    
    // Aktualizuj noc
    document.getElementById('hud-night').textContent = GameState.currentNight;
    document.querySelector('.night-counter').textContent = `NOC ${GameState.currentNight}`;
    
    // Aktualizuj animatroniki
    document.getElementById('hud-active').textContent = GameState.activeAnimatronics;
    
    // Aktualizuj status drzwi
    updateDoorStatus();
    
    // Aktualizuj kamery jeśli aktywne
    if (GameState.camerasActive) {
        updateCameraDisplay();
    }
}

function getTimeString() {
    const hourDisplay = GameState.currentHour === 0 ? 12 : 
                       GameState.currentHour > 12 ? GameState.currentHour - 12 : GameState.currentHour;
    const ampm = GameState.currentHour >= 12 ? "PM" : "AM";
    return `${hourDisplay}:${GameState.currentMinute.toString().padStart(2, '0')} ${ampm}`;
}

function updateDoorStatus() {
    const leftStatus = document.querySelector('.left-door-control .status-value');
    const rightStatus = document.querySelector('.right-door-control .status-value');
    const leftLight = document.querySelector('.left-door-control .status-light');
    const rightLight = document.querySelector('.right-door-control .status-light');
    
    if (GameState.leftDoorClosed) {
        leftStatus.textContent = "ZAMKNIĘTE";
        leftStatus.classList.add('closed');
        leftLight.style.background = '#ff3300';
    } else {
        leftStatus.textContent = "OTWARTE";
        leftStatus.classList.remove('closed');
        leftLight.style.background = 'var(--fnuf1-primary)';
    }
    
    if (GameState.rightDoorClosed) {
        rightStatus.textContent = "ZAMKNIĘTE";
        rightStatus.classList.add('closed');
        rightLight.style.background = '#ff3300';
    } else {
        rightStatus.textContent = "OTWARTE";
        rightStatus.classList.remove('closed');
        rightLight.style.background = 'var(--fnuf1-primary)';
    }
}

function updateDoorButtons() {
    const leftDoor = document.getElementById('left-door-3d');
    const rightDoor = document.getElementById('right-door-3d');
    const leftButton = document.getElementById('left-button-3d');
    const rightButton = document.getElementById('right-button-3d');
    
    if (GameState.leftDoorClosed) {
        leftDoor?.classList.add('closed');
        leftButton?.classList.add('active');
    } else {
        leftDoor?.classList.remove('closed');
        leftButton?.classList.remove('active');
    }
    
    if (GameState.rightDoorClosed) {
        rightDoor?.classList.add('closed');
        rightButton?.classList.add('active');
    } else {
        rightDoor?.classList.remove('closed');
        rightButton?.classList.remove('active');
    }
}

function updateLightButtons() {
    const leftButton = document.getElementById('hud-left-light');
    const rightButton = document.getElementById('hud-right-light');
    
    if (GameState.leftLightOn) {
        leftButton?.classList.add('active');
    } else {
        leftButton?.classList.remove('active');
    }
    
    if (GameState.rightLightOn) {
        rightButton?.classList.add('active');
    } else {
        rightButton?.classList.remove('active');
    }
}

// KONTROLA GRY
// ============

function toggleCameras() {
    if (GameState.isPowerOut) {
        showGameHint("System kamer nie działa - brak zasilania!");
        return;
    }
    
    GameState.camerasActive = !GameState.camerasActive;
    
    const cameraSystem = document.getElementById('camera-system');
    const monitorOverlay = document.getElementById('monitor-overlay');
    
    if (GameState.camerasActive) {
        cameraSystem.style.display = 'flex';
        monitorOverlay.style.opacity = '0.7';
        
        // Aktywuj pierwszą kamerę
        switchCamera(1);
        updateCameraDisplay();
    } else {
        cameraSystem.style.display = 'none';
        monitorOverlay.style.opacity = '0';
    }
    
    playSound('cameraSwitch');
}

function toggleLeftDoor() {
    if (GameState.isPowerOut) {
        showGameHint("System drzwi nie działa - brak zasilania!");
        return;
    }
    
    GameState.leftDoorClosed = !GameState.leftDoorClosed;
    updateDoorButtons();
    updateDoorStatus();
    playSound('doorClose');
}

function toggleRightDoor() {
    if (GameState.isPowerOut) {
        showGameHint("System drzwi nie działa - brak zasilania!");
        return;
    }
    
    GameState.rightDoorClosed = !GameState.rightDoorClosed;
    updateDoorButtons();
    updateDoorStatus();
    playSound('doorClose');
}

function toggleLeftLight() {
    if (GameState.isPowerOut) {
        showGameHint("System oświetlenia nie działa - brak zasilania!");
        return;
    }
    
    GameState.leftLightOn = !GameState.leftLightOn;
    updateLightButtons();
    playSound('lightSwitch');
}

function toggleRightLight() {
    if (GameState.isPowerOut) {
        showGameHint("System oświetlenia nie działa - brak zasilania!");
        return;
    }
    
    GameState.rightLightOn = !GameState.rightLightOn;
    updateLightButtons();
    playSound('lightSwitch');
}

function useBuzzer() {
    if (GameState.isPowerOut || GameState.buzzerActive) return;
    
    GameState.buzzerActive = true;
    
    playSound('buzzer');
    
    // Odstrasz animatroniki przy drzwiach
    Object.values(activeAnimatronics).forEach(animatronic => {
        if ((animatronic.position === 3 || animatronic.position === 11) && animatronic.active) {
            const pattern = animatronic.movementPattern;
            const currentIndex = pattern.indexOf(animatronic.position);
            if (currentIndex > 0) {
                animatronic.position = pattern[currentIndex - 1];
                hideAnimatronicInOffice(animatronic);
            }
        }
    });
    
    setTimeout(() => {
        GameState.buzzerActive = false;
    }, 2000);
}

function showMap() {
    const mapMessage = `
    MAPA ULTIMATE FEAR ENTERTAINMENT COMPLEX:
    
    [Wejście] -- [Scena Główna] -- [Korytarz Główny]
         |               |               |
    [Pokój Zabaw] -- [Kuchnia] -- [Lewy Korytarz] -- [Przed Biurem]
         |               |               |               |
    [Wentylacja A] -- [Wentylacja B] -- [Za Biurem] -- [Biuro]
                                              |
                                        [Prawy Korytarz] -- [Magazyn]
    
    Twoje biuro znajduje się w centrum kompleksu. Używaj drzwi i świateł, aby zabezpieczyć wejścia.
    `;
    
    alert(mapMessage);
}

function togglePause() {
    GameState.gamePaused = !GameState.gamePaused;
    
    const pauseBtn = document.getElementById('hud-pause');
    const hintText = document.getElementById('current-hint');
    
    if (GameState.gamePaused) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i><span>WZNÓW</span><span class="small-hotkey">P</span>';
        hintText.textContent = 'GRA ZAPAUZOWANA - Naciśnij P aby wznowić';
    } else {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>PAUZA</span><span class="small-hotkey">P</span>';
        hintText.textContent = 'Naciśnij C aby otworzyć kamery';
    }
    
    playSound('menuSelect');
}

function showGameHint(message) {
    const hintText = document.getElementById('current-hint');
    hintText.textContent = message;
    
    setTimeout(() => {
        hintText.textContent = 'Naciśnij C aby otworzyć kamery';
    }, 3000);
}

// SYSTEM KAMER
// ============

function switchCamera(cameraId) {
    if (!GameState.camerasActive) return;
    
    currentCamera = cameraId;
    
    // Aktualizuj aktywne przyciski
    document.querySelectorAll('.camera-grid-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`.camera-grid-item[data-camera="${cameraId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Aktualizuj podgląd kamery
    updateCameraFeed(cameraId);
    playSound('cameraSwitch');
}

function updateCameraDisplay() {
    if (!GameState.camerasActive) return;
    
    // Generuj siatkę kamer jeśli nie istnieje
    if (!document.querySelector('.camera-grid-item')) {
        generateCameraGrid();
    }
    
    // Aktualizuj aktywną kamerę
    const activeButton = document.querySelector(`.camera-grid-item[data-camera="${currentCamera}"]`);
    if (activeButton && !activeButton.classList.contains('active')) {
        document.querySelectorAll('.camera-grid-item').forEach(item => {
            item.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    updateCameraFeed(currentCamera);
}

function generateCameraGrid() {
    const cameraGrid = document.querySelector('.camera-grid');
    if (!cameraGrid) return;
    
    cameraGrid.innerHTML = '';
    
    CameraLocationsFNUF1.forEach(camera => {
        const cameraItem = document.createElement('div');
        cameraItem.className = 'camera-grid-item';
        cameraItem.setAttribute('data-camera', camera.id);
        
        cameraItem.innerHTML = `
            <div class="camera-number">CAM ${camera.id}</div>
            <div class="camera-location">${camera.name}</div>
        `;
        
        cameraItem.addEventListener('click', () => switchCamera(camera.id));
        cameraGrid.appendChild(cameraItem);
    });
}

function updateCameraFeed(cameraId) {
    const camera = CameraLocationsFNUF1.find(c => c.id === cameraId);
    if (!camera) return;
    
    // Aktualizuj informacje o kamerze
    document.querySelector('.camera-name').textContent = `KAMERA ${cameraId}: ${camera.name}`;
    document.querySelector('.camera-time').textContent = getTimeString();
    
    // Sprawdź które animatroniki są w tej lokacji
    const animatronicsHere = Object.values(activeAnimatronics).filter(a => 
        a.active && a.position === cameraId
    );
    
    // Aktualizuj status
    const statusValue = document.querySelector('.camera-status span');
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (animatronicsHere.length > 0) {
        statusValue.textContent = `${animatronicsHere.length} WIDOCZNYCH`;
        statusIndicator.classList.remove('active');
        statusIndicator.classList.add('inactive');
    } else {
        statusValue.textContent = 'BRAK AKTYWNOŚCI';
        statusIndicator.classList.remove('inactive');
        statusIndicator.classList.add('active');
    }
}

// USTAWIENIA
// ==========

function showSettings() {
    showScreen('settings');
    loadSettingsToUI();
}

function hideSettings() {
    showScreen('menu');
}

function switchSettingsTab(tabId) {
    // Ukryj wszystkie zakładki
    document.querySelectorAll('.settings-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Pokaż wybraną zakładkę
    document.getElementById(`tab-${tabId}`).classList.add('active');
    document.querySelector(`.settings-tab[data-tab="${tabId}"]`).classList.add('active');
}

function loadSettingsToUI() {
    // Audio
    document.getElementById('master-volume').value = GameState.settings.audio.masterVolume;
    document.getElementById('master-volume-value').textContent = GameState.settings.audio.masterVolume + '%';
    
    document.getElementById('music-volume').value = GameState.settings.audio.musicVolume;
    document.getElementById('music-volume-value').textContent = GameState.settings.audio.musicVolume + '%';
    
    document.getElementById('sfx-volume').value = GameState.settings.audio.sfxVolume;
    document.getElementById('sfx-volume-value').textContent = GameState.settings.audio.sfxVolume + '%';
    
    document.getElementById('animatronic-volume').value = GameState.settings.audio.animatronicVolume;
    document.getElementById('animatronic-volume-value').textContent = GameState.settings.audio.animatronicVolume + '%';
    
    document.getElementById('mute-jumpscares').checked = GameState.settings.audio.muteJumpscares;
    document.getElementById('static-effects').checked = GameState.settings.audio.staticEffects;
    
    // Grafika
    document.getElementById('texture-quality').value = GameState.settings.graphics.textureQuality;
    document.getElementById('lighting-quality').value = GameState.settings.graphics.lightingQuality;
    document.getElementById('render-quality').value = GameState.settings.graphics.renderQuality;
    document.getElementById('film-effects').checked = GameState.settings.graphics.filmEffects;
    document.getElementById('lens-effects').checked = GameState.settings.graphics.lensEffects;
    document.getElementById('screen-shake').checked = GameState.settings.graphics.screenShake;
    
    // Sterowanie
    updateKeybindDisplay();
    document.getElementById('mouse-control').checked = GameState.settings.controls.mouseControl;
    
    // Rozgrywka
    document.getElementById('difficulty-level').value = GameState.settings.gameplay.difficulty;
    document.getElementById('power-drain').value = GameState.settings.gameplay.powerDrain;
    document.getElementById('audio-warnings').checked = GameState.settings.gameplay.audioWarnings;
    document.getElementById('interface-hints').checked = GameState.settings.gameplay.interfaceHints;
    document.getElementById('night-timer').checked = GameState.settings.gameplay.nightTimer;
    document.getElementById('autosave-frequency').value = GameState.settings.gameplay.autosave;
}

function updateKeybindDisplay() {
    // Główna gra
    document.querySelector('.keybind-btn[data-action="cameras"]').textContent = 
        GameState.settings.controls.keybinds.cameras;
    document.querySelector('.keybind-btn[data-action="leftDoor"]').textContent = 
        GameState.settings.controls.keybinds.leftDoor;
    document.querySelector('.keybind-btn[data-action="rightDoor"]').textContent = 
        GameState.settings.controls.keybinds.rightDoor;
    document.querySelector('.keybind-btn[data-action="leftLight"]').textContent = 
        GameState.settings.controls.keybinds.leftLight;
    document.querySelector('.keybind-btn[data-action="rightLight"]').textContent = 
        GameState.settings.controls.keybinds.rightLight;
    document.querySelector('.keybind-btn[data-action="buzzer"]').textContent = 
        GameState.settings.controls.keybinds.buzzer === ' ' ? 'SPACJA' : GameState.settings.controls.keybinds.buzzer;
    document.querySelector('.keybind-btn[data-action="map"]').textContent = 
        GameState.settings.controls.keybinds.map;
    document.querySelector('.keybind-btn[data-action="pause"]').textContent = 
        GameState.settings.controls.keybinds.pause;
    
    // Minigra
    document.getElementById('control-left').textContent = 
        GameState.settings.controls.minigameBinds.left === 'ArrowLeft' ? '←' : 
        GameState.settings.controls.minigameBinds.left;
    document.getElementById('control-right').textContent = 
        GameState.settings.controls.minigameBinds.right === 'ArrowRight' ? '→' : 
        GameState.settings.controls.minigameBinds.right;
    document.getElementById('control-action').textContent = 
        GameState.settings.controls.minigameBinds.shoot === ' ' ? 'SPACJA' : 
        GameState.settings.controls.minigameBinds.shoot;
}

function startKeybindChange(action, button) {
    const oldText = button.textContent;
    button.textContent = '...';
    button.classList.add('changing');
    
    const keyHandler = function(e) {
        e.preventDefault();
        
        let key = e.key.toUpperCase();
        if (key === ' ') key = 'SPACJA';
        
        // Zapisz nowy keybind
        if (action.startsWith('mini')) {
            // Minigra
            const miniAction = action.replace('mini', '').toLowerCase();
            GameState.settings.controls.minigameBinds[miniAction] = key;
        } else {
            // Główna gra
            GameState.settings.controls.keybinds[action] = key;
        }
        
        // Zaktualizuj wyświetlanie
        updateKeybindDisplay();
        
        // Wyczyść event listener
        document.removeEventListener('keydown', keyHandler);
        button.classList.remove('changing');
    };
    
    document.addEventListener('keydown', keyHandler);
    
    // Anuluj po 5 sekundach
    setTimeout(() => {
        document.removeEventListener('keydown', keyHandler);
        button.textContent = oldText;
        button.classList.remove('changing');
    }, 5000);
}

function resetControls() {
    if (confirm('Czy na pewno chcesz przywrócić domyślne ustawienia sterowania?')) {
        // Domyślne keybinds głównej gry
        GameState.settings.controls.keybinds = {
            cameras: 'C',
            leftDoor: 'L',
            rightDoor: 'R',
            leftLight: 'Q',
            rightLight: 'E',
            buzzer: ' ',
            map: 'M',
            pause: 'P'
        };
        
        // Domyślne keybinds minigry
        GameState.settings.controls.minigameBinds = {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            shoot: ' ',
            pause: 'Escape'
        };
        
        GameState.settings.controls.mouseControl = false;
        
        updateKeybindDisplay();
        showGameHint('Sterowanie zresetowane do ustawień domyślnych');
    }
}

function applySettings() {
    console.log('Zastosowywanie ustawień...');
    
    // Audio
    GameState.settings.audio.masterVolume = parseInt(document.getElementById('master-volume').value);
    GameState.settings.audio.musicVolume = parseInt(document.getElementById('music-volume').value);
    GameState.settings.audio.sfxVolume = parseInt(document.getElementById('sfx-volume').value);
    GameState.settings.audio.animatronicVolume = parseInt(document.getElementById('animatronic-volume').value);
    GameState.settings.audio.muteJumpscares = document.getElementById('mute-jumpscares').checked;
    GameState.settings.audio.staticEffects = document.getElementById('static-effects').checked;
    
    // Grafika
    GameState.settings.graphics.textureQuality = document.getElementById('texture-quality').value;
    GameState.settings.graphics.lightingQuality = document.getElementById('lighting-quality').value;
    GameState.settings.graphics.renderQuality = document.getElementById('render-quality').value;
    GameState.settings.graphics.filmEffects = document.getElementById('film-effects').checked;
    GameState.settings.graphics.lensEffects = document.getElementById('lens-effects').checked;
    GameState.settings.graphics.screenShake = document.getElementById('screen-shake').checked;
    
    // Sterowanie (już zaktualizowane przez keybind changes)
    GameState.settings.controls.mouseControl = document.getElementById('mouse-control').checked;
    
    // Rozgrywka
    GameState.settings.gameplay.difficulty = document.getElementById('difficulty-level').value;
    GameState.settings.gameplay.powerDrain = document.getElementById('power-drain').value;
    GameState.settings.gameplay.audioWarnings = document.getElementById('audio-warnings').checked;
    GameState.settings.gameplay.interfaceHints = document.getElementById('interface-hints').checked;
    GameState.settings.gameplay.nightTimer = document.getElementById('night-timer').checked;
    GameState.settings.gameplay.autosave = document.getElementById('autosave-frequency').value;
    
    // Zapisz ustawienia
    saveSettings();
    
    showGameHint('Ustawienia zastosowane i zapisane');
    hideSettings();
}

// MINIGRY
// =======

function showMinigames() {
    showScreen('minigames');
}

function hideMinigames() {
    showScreen('menu');
}

function updateMinigamesUI() {
    document.querySelectorAll('.minigame-card').forEach(card => {
        const game = card.getAttribute('data-game');
        const minigame = Minigames[game];
        
        if (minigame) {
            const stats = card.querySelector('.minigame-stats');
            const button = card.querySelector('.play-minigame-btn');
            
            // Sprawdź czy odblokowana
            const requiredNight = minigame.requiredNight;
            const currentNight = GameState.progress[`fnuf${gameVersion}`].nightsCompleted;
            
            if (currentNight >= requiredNight) {
                minigame.unlocked = true;
                card.style.opacity = '1';
                button.disabled = false;
                stats.querySelector('.stat:first-child').innerHTML = 
                    `<i class="fas fa-check"></i> ODBLOKOWANA`;
            } else {
                minigame.unlocked = false;
                card.style.opacity = '0.6';
                button.disabled = true;
                stats.querySelector('.stat:first-child').innerHTML = 
                    `<i class="fas fa-lock"></i> WYMAGANA NOC ${requiredNight}`;
            }
            
            // Aktualizuj wynik
            stats.querySelector('.stat:last-child').innerHTML = 
                `<i class="fas fa-trophy"></i> WYNIK: ${minigame.highScore}`;
        }
    });
}

function updateUnlockedMinigames() {
    Object.keys(Minigames).forEach(gameKey => {
        const minigame = Minigames[gameKey];
        const progress = GameState.progress[`fnuf${gameVersion}`];
        
        if (progress.nightsCompleted >= minigame.requiredNight) {
            minigame.unlocked = true;
        }
    });
}

function startMinigame(gameType) {
    console.log(`Rozpoczynanie minigry: ${gameType}`);
    
    minigameActive = true;
    minigameType = gameType;
    minigameScore = 0;
    minigameTime = 60;
    minigameLevel = 1;
    
    // Pokaż ekran minigry
    showScreen('minigameCanvas');
    
    // Ustaw tytuł i instrukcje
    const minigame = Minigames[gameType];
    document.getElementById('minigame-title').textContent = minigame.name;
    document.getElementById('minigame-desc').textContent = minigame.description;
    
    // Zaktualizuj UI
    updateMinigameUI();
    
    // Inicjalizuj Three.js dla minigry
    initMinigame3D(gameType);
    
    // Rozpocznij timer
    startMinigameTimer();
    
    playSound('menuSelect');
}

function hideMinigame() {
    minigameActive = false;
    clearInterval(minigameInterval);
    
    if (minigameRenderer) {
        minigameRenderer.dispose();
    }
    
    showScreen('minigames');
}

function initMinigame3D(gameType) {
    // Inicjalizacja Three.js scene dla minigry
    const canvas = document.getElementById('minigame-3d-canvas');
    
    // Utwórz scenę
    minigameScene = new THREE.Scene();
    minigameScene.background = new THREE.Color(0x001100);
    
    // Utwórz kamerę
    minigameCamera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
    minigameCamera.position.z = 15;
    
    // Utwórz renderer
    minigameRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    minigameRenderer.setSize(canvas.width, canvas.height);
    
    // Dodaj oświetlenie
    const ambientLight = new THREE.AmbientLight(0x404040);
    minigameScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 5);
    minigameScene.add(directionalLight);
    
    // Dodaj obiekty w zależności od typu minigry
    switch(gameType) {
        case 'ventRepair':
            createVentRepairGame();
            break;
        case 'memoryMatch':
            createMemoryMatchGame();
            break;
        case 'cameraHack':
            createCameraHackGame();
            break;
        case 'powerGrid':
            createPowerGridGame();
            break;
    }
    
    // Rozpocznij animację
    animateMinigame();
}

function createVentRepairGame() {
    // Tworzenie gry naprawy wentylacji
    // Prosta implementacja z przeszkodami do unikania
    
    // Podłoga
    const floorGeometry = new THREE.PlaneGeometry(50, 30);
    const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -5;
    minigameScene.add(floor);
    
    // Gracz
    const playerGeometry = new THREE.BoxGeometry(2, 2, 2);
    const playerMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 1;
    minigameScene.userData.player = player;
    minigameScene.add(player);
    
    // Przeszkody
    for (let i = 0; i < 10; i++) {
        const obstacleGeometry = new THREE.BoxGeometry(3, 3, 3);
        const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xff3300 });
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        
        obstacle.position.x = (Math.random() - 0.5) * 40;
        obstacle.position.z = -20 - i * 10;
        obstacle.position.y = 1.5;
        
        minigameScene.userData.obstacles = minigameScene.userData.obstacles || [];
        minigameScene.userData.obstacles.push(obstacle);
        minigameScene.add(obstacle);
    }
}

function animateMinigame() {
    if (!minigameActive) return;
    
    requestAnimationFrame(animateMinigame);
    
    // Logika gry w zależności od typu
    switch(minigameType) {
        case 'ventRepair':
            updateVentRepairGame();
            break;
        case 'memoryMatch':
            updateMemoryMatchGame();
            break;
        case 'cameraHack':
            updateCameraHackGame();
            break;
        case 'powerGrid':
            updatePowerGridGame();
            break;
    }
    
    minigameRenderer.render(minigameScene, minigameCamera);
}

function updateVentRepairGame() {
    const player = minigameScene.userData.player;
    const obstacles = minigameScene.userData.obstacles;
    
    if (!player || !obstacles) return;
    
    // Poruszaj przeszkodami do przodu
    obstacles.forEach(obstacle => {
        obstacle.position.z += 0.1 * minigameLevel;
        
        // Jeśli przeszkoda minęła gracza, zresetuj ją
        if (obstacle.position.z > 10) {
            obstacle.position.z = -50;
            obstacle.position.x = (Math.random() - 0.5) * 40;
            
            // Dodaj punkty
            minigameScore += 10 * minigameLevel;
            updateMinigameUI();
        }
        
        // Sprawdź kolizję
        const distance = Math.sqrt(
            Math.pow(player.position.x - obstacle.position.x, 2) +
            Math.pow(player.position.z - obstacle.position.z, 2)
        );
        
        if (distance < 2.5) {
            // Kolizja
            minigameTime -= 5;
            obstacle.position.z = -50;
            obstacle.position.x = (Math.random() - 0.5) * 40;
            updateMinigameUI();
        }
    });
}

function updateMinigameUI() {
    document.getElementById('mg-score').textContent = minigameScore;
    document.getElementById('mg-time').textContent = Math.max(0, minigameTime);
    document.getElementById('mg-level').textContent = minigameLevel;
}

function startMinigameTimer() {
    minigameInterval = setInterval(() => {
        if (!minigameActive) return;
        
        minigameTime--;
        updateMinigameUI();
        
        if (minigameTime <= 0) {
            endMinigame();
        }
        
        // Zwiększ poziom co 20 sekund
        if (minigameTime % 20 === 0 && minigameTime > 0) {
            minigameLevel++;
            updateMinigameUI();
        }
    }, 1000);
}

function toggleMinigamePause() {
    // Tymczasowa implementacja
    minigameActive = !minigameActive;
    
    const button = document.getElementById('minigame-pause');
    if (minigameActive) {
        button.innerHTML = '<i class="fas fa-pause"></i> PAUZA';
        startMinigameTimer();
    } else {
        button.innerHTML = '<i class="fas fa-play"></i> WZNÓW';
        clearInterval(minigameInterval);
    }
}

function endMinigame() {
    clearInterval(minigameInterval);
    minigameActive = false;
    
    // Zapisz wynik jeśli jest lepszy
    const minigame = Minigames[minigameType];
    if (minigameScore > minigame.highScore) {
        minigame.highScore = minigameScore;
        
        // Zapisz w localStorage
        const savedMinigames = JSON.parse(localStorage.getItem('fnufMinigames') || '{}');
        savedMinigames[minigameType] = minigameScore;
        localStorage.setItem('fnufMinigames', JSON.stringify(savedMinigames));
    }
    
    // Pokaż wynik
    alert(`Koniec gry!\nWynik: ${minigameScore}\nPoziom: ${minigameLevel}\nNajlepszy wynik: ${minigame.highScore}`);
    
    hideMinigame();
}

// CREDITS
// =======

function showCredits() {
    showScreen('credits');
}

function hideCredits() {
    showScreen('menu');
}

// ZAPIS I ŁADOWANIE
// =================

function saveSettings() {
    try {
        localStorage.setItem('fnufSettings', JSON.stringify(GameState.settings));
        console.log('Ustawienia zapisane');
    } catch (e) {
        console.error('Błąd zapisywania ustawień:', e);
    }
}

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('fnufSettings');
        if (savedSettings) {
            GameState.settings = JSON.parse(savedSettings);
            console.log('Ustawienia załadowane');
        }
    } catch (e) {
        console.error('Błąd ładowania ustawień:', e);
    }
}

function saveGameProgress() {
    try {
        // Zapisz ogólny postęp
        localStorage.setItem('fnufProgress', JSON.stringify({
            playerMoney: GameState.playerMoney,
            totalNightsCompleted: GameState.totalNightsCompleted,
            ...GameState.progress
        }));
        
        // Zapisz ostatnią grę
        localStorage.setItem('fnufLastPlayed', JSON.stringify({
            version: gameVersion,
            night: GameState.currentNight
        }));
        
        console.log('Postęp gry zapisany');
    } catch (e) {
        console.error('Błąd zapisywania postępu:', e);
    }
}

function manualSave() {
    saveGameProgress();
    saveSettings();
    showGameHint('Gra zapisana pomyślnie');
}

function deleteSave() {
    if (confirm('Czy na pewno chcesz usunąć wszystkie zapisy gry? Tej akcji nie można cofnąć!')) {
        localStorage.removeItem('fnufProgress');
        localStorage.removeItem('fnufSettings');
        localStorage.removeItem('fnufLastPlayed');
        localStorage.removeItem('fnufMinigames');
        
        // Reset stanu gry
        GameState.playerMoney = 0;
        GameState.totalNightsCompleted = 0;
        GameState.progress = {
            fnuf1: { nightsCompleted: 0, customNightBest: 0, jumpscares: 0, minigames: {} },
            fnuf2: { nightsCompleted: 0, customNightBest: 0, jumpscares: 0, minigames: {} },
            fnuf3: { nightsCompleted: 0, customNightBest: 0, jumpscares: 0, minigames: {} }
        };
        
        // Reset minigier
        Object.keys(Minigames).forEach(key => {
            Minigames[key].highScore = 0;
            Minigames[key].unlocked = false;
        });
        
        showGameHint('Wszystkie zapisy gry zostały usunięte');
    }
}

// ANIMACJE MENU
// =============

function startMenuAnimations() {
    // Animacja 3D modeli w tle
    const bolt3d = document.getElementById('bolt-3d');
    const fox3d = document.getElementById('fox-3d');
    
    if (bolt3d && fox3d) {
        let rotation = 0;
        
        function animateMenu() {
            rotation += 0.5;
            
            bolt3d.style.transform = `rotateY(${rotation}deg)`;
            fox3d.style.transform = `rotateY(${-rotation}deg)`;
            
            requestAnimationFrame(animateMenu);
        }
        
        animateMenu();
    }
}

function updateMenuUI() {
    // Aktualizuj informacje o postępie
    const progress = GameState.progress[`fnuf${gameVersion}`];
    const nightsCompleted = progress?.nightsCompleted || 0;
    
    // Aktualizuj podpowiedź
    const hintText = document.getElementById('menu-hint-text');
    if (nightsCompleted > 0) {
        hintText.textContent = `Ukończono ${nightsCompleted}/5 nocy w FNUF ${gameVersion}. Całkowity zarobek: $${GameState.playerMoney.toFixed(2)}`;
    } else {
        hintText.textContent = 'Wybierz wersję gry i kliknij NOWA GRA aby rozpocząć';
    }
}

// STEROWANIE KLAWIATURĄ
// =====================

function handleKeyDown(e) {
    const key = e.key.toUpperCase();
    
    // Minigra aktywna
    if (minigameActive) {
        handleMinigameKey(key, true);
        return;
    }
    
    // Gra aktywna
    if (GameState.gameActive && !GameState.gamePaused && !GameState.jumpscareActive) {
        // Pobierz keybinds z ustawień
        const keybinds = GameState.settings.controls.keybinds;
        
        // Sprawdź czy to keybind
        if (key === keybinds.cameras) {
            toggleCameras();
        } else if (key === keybinds.leftDoor) {
            toggleLeftDoor();
        } else if (key === keybinds.rightDoor) {
            toggleRightDoor();
        } else if (key === keybinds.leftLight) {
            toggleLeftLight();
        } else if (key === keybinds.rightLight) {
            toggleRightLight();
        } else if (key === ' ' && keybinds.buzzer === ' ') {
            useBuzzer();
        } else if (key === keybinds.map) {
            showMap();
        } else if (key === keybinds.pause) {
            togglePause();
        }
        
        // Szybkie przełączanie kamer (tylko gdy kamery aktywne)
        if (GameState.camerasActive) {
            const cameraKey = parseInt(key);
            if (!isNaN(cameraKey) && cameraKey >= 1 && cameraKey <= 9) {
                switchCamera(cameraKey);
            } else if (key === '0') {
                switchCamera(10);
            } else if (key === '-') {
                switchCamera(11);
            } else if (key === '=') {
                switchCamera(12);
            }
        }
    }
    
    // Easter egg: sekretny kod
    if (key === 'F') {
        checkSecretCode();
    }
}

function handleKeyUp(e) {
    const key = e.key.toUpperCase();
    
    if (minigameActive) {
        handleMinigameKey(key, false);
    }
}

function handleMinigameKey(key, isKeyDown) {
    const keybinds = GameState.settings.controls.minigameBinds;
    
    // Implementacja sterowania dla minigier
    // (w pełnej wersji byłaby bardziej zaawansowana)
}

// POMOCNICZE FUNKCJE
// ==================

function clearAllTimers() {
    clearInterval(gameTimer);
    clearInterval(animatronicTimer);
    clearTimeout(powerOutTimer);
    clearTimeout(nightCompletionTimer);
    clearInterval(minigameInterval);
    clearInterval(cameraFeedInterval);
}

function resetAnimatronics() {
    Object.keys(activeAnimatronics).forEach(key => {
        if (activeAnimatronics[key]) {
            activeAnimatronics[key].position = activeAnimatronics[key].movementPattern[0];
        }
    });
}

function showAnimatronicInOffice(animatronic, side) {
    const modelId = `${animatronic.model.toLowerCase().replace(/\s/g, '-')}-3d`;
    const model = document.getElementById(modelId);
    
    if (model) {
        model.style.display = 'block';
        
        if (side === 'left') {
            model.style.left = '15%';
            model.style.right = 'auto';
        } else {
            model.style.right = '15%';
            model.style.left = 'auto';
        }
    }
}

function hideAnimatronicInOffice(animatronic) {
    const modelId = `${animatronic.model.toLowerCase().replace(/\s/g, '-')}-3d`;
    const model = document.getElementById(modelId);
    
    if (model) {
        model.style.display = 'none';
    }
}

function checkSecretCode() {
    // Sekretny kod FNUF2023
    const secretCode = 'FNUF2023';
    const savedCode = localStorage.getItem('fnufSecretCode');
    
    if (savedCode === secretCode) {
        // Odblokuj specjalną noc
        const nightSelect = document.querySelector('.night-grid');
        if (!document.querySelector('.night-card[data-night="7"]')) {
            const specialNight = document.createElement('div');
            specialNight.className = 'night-card';
            specialNight.setAttribute('data-night', '7');
            specialNight.innerHTML = `
                <div class="night-number">7</div>
                <div class="night-difficulty">SEKRETNA</div>
                <div class="night-desc">Noc specjalna</div>
                <div class="night-badge"><i class="fas fa-crown"></i></div>
            `;
            
            specialNight.addEventListener('click', () => startNight(7));
            nightSelect.appendChild(specialNight);
            
            showGameHint('Odblokowano sekretną noc 7!');
            localStorage.removeItem('fnufSecretCode');
        }
    }
}

// INICJALIZACJA PO ZAŁADOWANIU STRONY
// ====================================

window.addEventListener('DOMContentLoaded', function() {
    console.log('=== FNUF ULTIMATE FEAR COLLECTION ===');
    console.log('Wersja: 1.0 | Build: 2023.12.09');
    console.log('Autor: Ultimate Fear Studio');
    
    // Rozpocznij inicjalizację gry
    initGame();
});

// Eksport do global scope dla debugowania
window.GameState = GameState;
window.AnimatronicsFNUF1 = AnimatronicsFNUF1;
window.Minigames = Minigames;
