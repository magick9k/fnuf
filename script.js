// GŁÓWNY KOD GRY FNUF
// ===================

// GLOBALNE ZMIENNE
// ----------------
let gameState = {
    // Podstawowe ustawienia
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
    
    // Ustawienia
    soundVolume: 70,
    soundEffects: true,
    backgroundMusic: true,
    screenShake: true,
    theme: 'green'
};

// Animatroniki
const animatronics = {
    boltBear: {
        name: "Bolt Bear",
        location: 1,
        aggression: 1,
        movementPattern: [1, 2, 3, 7, 10],
        active: true,
        position: 1,
        difficultyModifier: 1,
        icon: "⚡",
        jumpscareSound: "bear"
    },
    sparkyFox: {
        name: "Sparky Fox",
        location: 4,
        aggression: 0.8,
        movementPattern: [4, 5, 6, 9, 10],
        active: true,
        position: 4,
        difficultyModifier: 1,
        icon: "🦊",
        jumpscareSound: "fox"
    },
    chicaChick: {
        name: "Chica Chick",
        location: 8,
        aggression: 0.7,
        movementPattern: [8, 7, 3, 10],
        active: true,
        position: 8,
        difficultyModifier: 1,
        icon: "🐤",
        jumpscareSound: "chica"
    },
    fangPirate: {
        name: "Fang the Pirate",
        location: 11,
        aggression: 0.9,
        movementPattern: [11, 10, 7, 3, 2],
        active: true,
        position: 11,
        difficultyModifier: 1,
        icon: "🏴‍☠️",
        jumpscareSound: "pirate"
    },
    goldenBolt: {
        name: "Golden Bolt",
        location: 0,
        aggression: 0.1,
        movementPattern: [0, 0, 0, 0, 0],
        active: false,
        position: 0,
        difficultyModifier: 3,
        icon: "🌟",
        jumpscareSound: "golden"
    }
};

// Lokacje kamer
const cameraLocations = [
    { id: 1, name: "Scena Główna", description: "Główna scena z animatronikami" },
    { id: 2, name: "Korytarz Główny", description: "Główny korytarz prowadzący do biura" },
    { id: 3, name: "Korytarz Lewy", description: "Lewy korytarz przed biurem" },
    { id: 4, name: "Kuchnia", description: "Kuchnia i jadalnia" },
    { id: 5, name: "Pokój Zabaw", description: "Pokój zabaw dla dzieci" },
    { id: 6, name: "Wentylacja A", description: "System wentylacji - część A" },
    { id: 7, name: "Przed Biurem", description: "Obszar bezpośrednio przed biurem" },
    { id: 8, name: "Magazyn", description: "Magazyn sprzętu i części zamiennych" },
    { id: 9, name: "Wentylacja B", description: "System wentylacji - część B" },
    { id: 10, name: "Za Biurem", description: "Tajny obszar za biurem" },
    { id: 11, name: "Prawy Korytarz", description: "Prawy korytarz przed biurem" },
    { id: 12, name: "Wejście", description: "Główne wejście do kompleksu" }
];

// Zmienne dla minigry
let miniGameActive = false;
let miniGameCtx;
let miniGamePlayer = { x: 400, y: 450, width: 40, height: 40, speed: 6 };
let miniGameEnemies = [];
let miniGameProjectiles = [];
let miniGameScore = 0;
let miniGameLives = 3;
let miniGameLevel = 1;
let miniGameInterval;
let miniGameKeys = { left: false, right: false, space: false };

// Timery
let gameTimer;
let animatronicTimer;
let powerOutTimer;

// Audio context dla dźwięków
let audioContext;
let sounds = {};

// DOM Elements
const screens = {
    menu: document.getElementById('menu'),
    story: document.getElementById('story-screen'),
    miniGame: document.getElementById('mini-game-screen'),
    settings: document.getElementById('settings-screen'),
    game: document.getElementById('game-screen')
};

// INICJALIZACJA GRY
// -----------------
function initGame() {
    console.log("Inicjalizacja gry FNUF...");
    
    // Ładowanie postępu
    loadGameProgress();
    loadSettings();
    
    // Setup event listenerów
    setupEventListeners();
    
    // Setup audio
    initAudio();
    
    // Setup minigry
    initMiniGameCanvas();
    
    // Setup kamer
    createCameraButtons();
    
    // Easter eggi
    setupEasterEggs();
    
    // Ustawienie motywu
    applyTheme(gameState.theme);
    
    console.log("Inicjalizacja zakończona!");
}

// SETUP EVENT LISTENERÓW
// ----------------------
function setupEventListeners() {
    console.log("Ustawianie event listenerów...");
    
    // Menu główne
    document.getElementById('new-game-btn').addEventListener('click', showNightSelect);
    document.getElementById('continue-btn').addEventListener('click', continueGame);
    document.getElementById('story-btn').addEventListener('click', showStory);
    document.getElementById('mini-game-btn').addEventListener('click', showMiniGame);
    document.getElementById('settings-btn').addEventListener('click', showSettings);
    
    // Wybór nocy
    document.querySelectorAll('.night-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const night = parseInt(this.getAttribute('data-night'));
            startNight(night);
        });
    });
    
    document.getElementById('night-select-back').addEventListener('click', hideNightSelect);
    
    // Historia
    document.getElementById('close-story').addEventListener('click', hideStory);
    
    // Minigra
    document.getElementById('mini-game-back').addEventListener('click', hideMiniGame);
    document.getElementById('mini-game-start').addEventListener('click', startMiniGame);
    
    // Ustawienia
    document.getElementById('settings-back').addEventListener('click', hideSettings);
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('reset-progress').addEventListener('click', resetProgress);
    
    // Kontrolki ustawień
    document.getElementById('sound-volume').addEventListener('input', function() {
        document.getElementById('volume-value').textContent = this.value + '%';
        gameState.soundVolume = parseInt(this.value);
        updateAudioVolume();
    });
    
    document.getElementById('sound-effects').addEventListener('change', function() {
        gameState.soundEffects = this.checked;
    });
    
    document.getElementById('background-music').addEventListener('change', function() {
        gameState.backgroundMusic = this.checked;
    });
    
    document.getElementById('screen-shake').addEventListener('change', function() {
        gameState.screenShake = this.checked;
    });
    
    document.getElementById('theme-select').addEventListener('change', function() {
        gameState.theme = this.value;
        applyTheme(this.value);
    });
    
    // HUD i kontrola gry
    document.getElementById('cameras-btn').addEventListener('click', toggleCameras);
    document.getElementById('lights-left-btn').addEventListener('click', toggleLeftLight);
    document.getElementById('lights-right-btn').addEventListener('click', toggleRightLight);
    document.getElementById('map-btn').addEventListener('click', showMap);
    document.getElementById('pause-btn').addEventListener('click', togglePause);
    
    // Drzwi
    document.getElementById('left-door-button').addEventListener('click', toggleLeftDoor);
    document.getElementById('right-door-button').addEventListener('click', toggleRightDoor);
    
    // Dzwonek
    document.getElementById('buzzer').addEventListener('click', useBuzzer);
    
    // Ekran ukończenia nocy
    document.getElementById('next-night-btn').addEventListener('click', nextNight);
    document.getElementById('night-complete-menu').addEventListener('click', backToMenuFromComplete);
    
    // Sterowanie klawiszami
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    console.log("Event listenery ustawione!");
}

// OBSŁUGA KLAWISZY
// ----------------
function handleKeyDown(e) {
    const key = e.key.toUpperCase();
    
    // Jeśli minigra jest aktywna
    if (miniGameActive) {
        switch(key) {
            case 'ARROWLEFT':
                miniGameKeys.left = true;
                break;
            case 'ARROWRIGHT':
                miniGameKeys.right = true;
                break;
            case ' ':
                if (!miniGameKeys.space) {
                    miniGameKeys.space = true;
                    shootProjectile();
                }
                break;
        }
        return;
    }
    
    // Jeśli gra jest aktywna i nie jest zapauzowana
    if (gameState.gameActive && !gameState.gamePaused && !gameState.jumpscareActive) {
        switch(key) {
            case 'C':
                toggleCameras();
                break;
            case 'Q':
                toggleLeftLight();
                break;
            case 'E':
                toggleRightLight();
                break;
            case 'L':
                toggleLeftDoor();
                break;
            case 'R':
                toggleRightDoor();
                break;
            case ' ':
                useBuzzer();
                break;
            case 'M':
                showMap();
                break;
            case 'P':
                togglePause();
                break;
            case '1': case '2': case '3': case '4': case '5':
            case '6': case '7': case '8': case '9':
                const cameraId = parseInt(key);
                if (cameraId <= 9 && gameState.camerasActive) {
                    switchCamera(cameraId);
                }
                break;
            case '0':
                if (gameState.camerasActive) {
                    switchCamera(10);
                }
                break;
            case '-':
                if (gameState.camerasActive) {
                    switchCamera(11);
                }
                break;
            case '=':
                if (gameState.camerasActive) {
                    switchCamera(12);
                }
                break;
        }
    }
    
    // Sekretne kody (easter eggi)
    if (key === 'F') {
        // Sprawdź sekretny kod
        checkSecretCode();
    }
}

function handleKeyUp(e) {
    const key = e.key.toUpperCase();
    
    if (miniGameActive) {
        switch(key) {
            case 'ARROWLEFT':
                miniGameKeys.left = false;
                break;
            case 'ARROWRIGHT':
                miniGameKeys.right = false;
                break;
            case ' ':
                miniGameKeys.space = false;
                break;
        }
    }
}

// ZARZĄDZANIE EKRANAMI
// --------------------
function showScreen(screenId) {
    // Ukryj wszystkie ekrany
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });
    
    // Pokaż wybrany ekran
    const screen = screens[screenId];
    if (screen) {
        screen.classList.add('active');
        screen.style.display = 'flex';
    }
}

function showNightSelect() {
    document.getElementById('night-select').classList.add('active');
}

function hideNightSelect() {
    document.getElementById('night-select').classList.remove('active');
}

function showStory() {
    showScreen('story');
}

function hideStory() {
    showScreen('menu');
}

function showMiniGame() {
    showScreen('miniGame');
    resetMiniGame();
}

function hideMiniGame() {
    showScreen('menu');
    miniGameActive = false;
    if (miniGameInterval) clearInterval(miniGameInterval);
}

function showSettings() {
    showScreen('settings');
    // Załaduj aktualne ustawienia do formularza
    document.getElementById('sound-volume').value = gameState.soundVolume;
    document.getElementById('volume-value').textContent = gameState.soundVolume + '%';
    document.getElementById('sound-effects').checked = gameState.soundEffects;
    document.getElementById('background-music').checked = gameState.backgroundMusic;
    document.getElementById('screen-shake').checked = gameState.screenShake;
    document.getElementById('theme-select').value = gameState.theme;
}

function hideSettings() {
    showScreen('menu');
}

// ROZPOCZĘCIE GRY
// ---------------
function startNight(night) {
    console.log(`Rozpoczynanie nocy ${night}...`);
    
    // Reset stanu gry
    resetGameState();
    
    // Ustaw noc
    gameState.currentNight = night;
    gameState.currentHour = 12;
    gameState.currentMinute = 0;
    gameState.gameActive = true;
    
    // Ustaw trudność
    setDifficulty(night);
    
    // Pokaż ekran gry
    showScreen('game');
    
    // Aktualizuj UI
    updateUI();
    
    // Rozpocznij timery
    startGameTimer();
    startAnimatronicsAI();
    
    // Odtwórz dźwięk rozpoczęcia
    playSound('start');
    
    // Ustaw kalendarz
    document.getElementById('calendar-night').textContent = night;
    
    console.log(`Noc ${night} rozpoczęta!`);
}

function continueGame() {
    startNight(gameState.currentNight);
}

function resetGameState() {
    // Reset podstawowych wartości
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
    gameState.gameTime = 0;
    
    // Reset animatroników
    for (const key in animatronics) {
        animatronics[key].position = animatronics[key].movementPattern[0];
    }
    
    // Reset UI
    document.getElementById('camera-view').style.display = 'none';
    document.getElementById('monitor').style.opacity = '0';
    document.getElementById('power-warning').style.display = 'none';
    document.getElementById('jumpscare').style.display = 'none';
    document.getElementById('night-complete').style.display = 'none';
    
    // Reset drzwi i świateł
    updateDoorButtons();
    updateLightButtons();
}

function setDifficulty(night) {
    // Ustaw drenaż mocy
    gameState.powerDrain = 0.2 + (night * 0.05);
    
    // Aktywuj Golden Bolt od 3 nocy
    animatronics.goldenBolt.active = night >= 3;
    
    // Ustaw agresywność animatroników
    for (const key in animatronics) {
        if (animatronics[key].active) {
            animatronics[key].aggression = Math.min(1, 0.5 + (night * 0.1));
            animatronics[key].difficultyModifier = 1 + (night * 0.2);
        }
    }
}

// TIMERY GRY
// ----------
function startGameTimer() {
    // Zatrzymaj istniejący timer
    if (gameTimer) clearInterval(gameTimer);
    
    // Uruchom nowy timer
    gameTimer = setInterval(() => {
        if (gameState.gameActive && !gameState.gamePaused && !gameState.jumpscareActive) {
            // Aktualizuj czas
            gameState.currentMinute += 1;
            gameState.gameTime += 1;
            
            // Co minutę w grze
            if (gameState.currentMinute >= 60) {
                gameState.currentMinute = 0;
                gameState.currentHour += 1;
                
                // Jeśli osiągnięto 6 rano
                if (gameState.currentHour >= 6) {
                    completeNight();
                    return;
                }
            }
            
            // Zużycie energii
            if (!gameState.isPowerOut) {
                updatePower();
            }
            
            // Aktualizuj UI
            updateUI();
        }
    }, 1000); // 1 sekunda realnego czasu = 1 minuta w grze
}

function updatePower() {
    // Bazowe zużycie
    let powerDrain = gameState.powerDrain;
    
    // Dodatkowe zużycie przez aktywne systemy
    if (gameState.camerasActive) powerDrain += 0.5;
    if (gameState.leftDoorClosed) powerDrain += 1;
    if (gameState.rightDoorClosed) powerDrain += 1;
    if (gameState.leftLightOn) powerDrain += 0.3;
    if (gameState.rightLightOn) powerDrain += 0.3;
    if (gameState.buzzerActive) powerDrain += 2;
    
    // Zastosuj zużycie
    gameState.power -= powerDrain;
    
    // Sprawdź czy energia się skończyła
    if (gameState.power <= 0) {
        gameState.power = 0;
        gameState.isPowerOut = true;
        powerOut();
    }
}

function powerOut() {
    console.log("Awaria zasilania!");
    
    // Pokaż ostrzeżenie
    document.getElementById('power-warning').style.display = 'flex';
    
    // Otwórz wszystkie drzwi (systemy awaryjne)
    gameState.leftDoorClosed = false;
    gameState.rightDoorClosed = false;
    updateDoorButtons();
    
    // Wyłącz kamery i światła
    gameState.camerasActive = false;
    gameState.leftLightOn = false;
    gameState.rightLightOn = false;
    document.getElementById('camera-view').style.display = 'none';
    document.getElementById('monitor').style.opacity = '0';
    updateLightButtons();
    
    // Odtwórz dźwięk awarii
    playSound('powerout');
    
    // Ustaw timer na atak animatroników
    if (powerOutTimer) clearTimeout(powerOutTimer);
    powerOutTimer = setTimeout(() => {
        if (gameState.isPowerOut && gameState.gameActive) {
            // Wybierz losowego animatronika do ataku
            const activeAnimatronics = [];
            for (const key in animatronics) {
                if (animatronics[key].active && animatronics[key].position > 0) {
                    activeAnimatronics.push(animatronics[key]);
                }
            }
            
            if (activeAnimatronics.length > 0) {
                const randomAnimatronic = activeAnimatronics[Math.floor(Math.random() * activeAnimatronics.length)];
                triggerJumpscare(randomAnimatronic);
            }
        }
    }, 30000); // 30 sekund po awarii
}

// AI ANIMATRONIKÓW
// ----------------
function startAnimatronicsAI() {
    // Zatrzymaj istniejący timer
    if (animatronicTimer) clearInterval(animatronicTimer);
    
    // Uruchom nowy timer
    animatronicTimer = setInterval(() => {
        if (gameState.gameActive && !gameState.gamePaused && !gameState.jumpscareActive && !gameState.isPowerOut) {
            // Dla każdego aktywnego animatronika
            for (const key in animatronics) {
                const animatronic = animatronics[key];
                
                if (animatronic.active) {
                    // Szansa na ruch
                    const moveChance = Math.random();
                    if (moveChance < (0.3 * animatronic.aggression * animatronic.difficultyModifier)) {
                        moveAnimatronic(animatronic);
                    }
                    
                    // Sprawdź czy animatronik jest przy drzwiach
                    checkAnimatronicAtDoor(animatronic);
                }
            }
            
            // Aktualizuj liczbę aktywnych animatroników
            updateActiveAnimatronics();
        }
    }, 3000); // Co 3 sekundy
}

function moveAnimatronic(animatronic) {
    // Wybierz następną pozycję z wzorca ruchu
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
    if (animatronic === animatronics.goldenBolt && animatronic.active) {
        // Golden Bolt pojawia się tylko raz na noc, z małą szansą
        const appearChance = Math.random();
        if (appearChance < 0.05) {
            // Pojawia się w losowej lokacji
            animatronic.position = Math.floor(Math.random() * 11) + 1;
            
            // Jeśli pojawi się w lokacji 3 lub 11 (przy drzwiach), atakuje natychmiast
            if ((animatronic.position === 3 || animatronic.position === 11)) {
                // Sprawdź czy odpowiednie drzwi są otwarte
                if ((animatronic.position === 3 && !gameState.leftDoorClosed) || 
                    (animatronic.position === 11 && !gameState.rightDoorClosed)) {
                    triggerJumpscare(animatronic);
                }
            }
        } else {
            animatronic.position = 0; // Wraca do ukrycia
        }
    }
    
    // Sprawdź czy animatronik może zaatakować
    checkAnimatronicAttack(animatronic);
    
    // Aktualizuj wyświetlanie na kamerach
    updateCameraDisplay();
}

function checkAnimatronicAtDoor(animatronic) {
    // Lewe drzwi - pozycja 3
    if (animatronic.position === 3) {
        // Wyświetl animatronika przy lewych drzwiach
        const boltBearOffice = document.getElementById('bolt-bear-office');
        if (animatronic === animatronics.boltBear) {
            boltBearOffice.style.display = 'flex';
            boltBearOffice.style.left = '140px';
            boltBearOffice.style.bottom = '180px';
            
            // Odtwórz dźwięk, jeśli drzwi są zamknięte
            if (gameState.leftDoorClosed) {
                playSound('doorBang');
            }
        }
    }
    
    // Prawe drzwi - pozycja 11
    if (animatronic.position === 11) {
        // Wyświetl animatronika przy prawych drzwiach
        const sparkyFoxOffice = document.getElementById('sparky-fox-office');
        if (animatronic === animatronics.sparkyFox) {
            sparkyFoxOffice.style.display = 'flex';
            sparkyFoxOffice.style.right = '140px';
            sparkyFoxOffice.style.bottom = '180px';
            
            // Odtwórz dźwięk, jeśli drzwi są zamknięte
            if (gameState.rightDoorClosed) {
                playSound('doorBang');
            }
        }
    }
    
    // Jeśli animatronik nie jest przy drzwiach, ukryj go
    if (animatronic.position !== 3 && animatronic.position !== 11) {
        if (animatronic === animatronics.boltBear) {
            document.getElementById('bolt-bear-office').style.display = 'none';
        }
        if (animatronic === animatronics.sparkyFox) {
            document.getElementById('sparky-fox-office').style.display = 'none';
        }
    }
}

function checkAnimatronicAttack(animatronic) {
    // Jeśli animatronik jest w pozycji 10 (za biurem), ma szansę na atak
    if (animatronic.position === 10) {
        const attackChance = Math.random();
        if (attackChance < (0.2 * animatronic.aggression * animatronic.difficultyModifier)) {
            // Atak przez lewe drzwi
            if (!gameState.leftDoorClosed && animatronic !== animatronics.goldenBolt) {
                triggerJumpscare(animatronic);
            }
        }
    }
    
    // Jeśli animatronik jest w pozycji 7 (przed biurem), ma szansę na atak
    if (animatronic.position === 7) {
        const attackChance = Math.random();
        if (attackChance < (0.15 * animatronic.aggression * animatronic.difficultyModifier)) {
            // Atak przez prawe drzwi
            if (!gameState.rightDoorClosed && animatronic !== animatronics.goldenBolt) {
                triggerJumpscare(animatronic);
            }
        }
    }
}

function updateActiveAnimatronics() {
    let activeCount = 0;
    for (const key in animatronics) {
        if (animatronics[key].active && animatronics[key].position > 0) {
            activeCount++;
        }
    }
    gameState.activeAnimatronics = activeCount;
}

// JUMPSCARE
// ---------
function triggerJumpscare(animatronic) {
    if (gameState.jumpscareActive) return;
    
    console.log(`Jumpscare przez ${animatronic.name}!`);
    
    gameState.jumpscareActive = true;
    gameState.gameActive = false;
    
    // Zatrzymaj timery
    clearInterval(gameTimer);
    clearInterval(animatronicTimer);
    if (powerOutTimer) clearTimeout(powerOutTimer);
    
    // Pokaż ekran jumpscare
    const jumpscareDiv = document.getElementById('jumpscare');
    const jumpscareIcon = document.getElementById('jumpscare-icon');
    const jumpscareName = document.getElementById('jumpscare-name');
    
    jumpscareIcon.textContent = animatronic.icon;
    jumpscareName.textContent = animatronic.name;
    
    jumpscareDiv.style.display = 'flex';
    
    // Odtwórz dźwięk jumpscare
    playSound(animatronic.jumpscareSound);
    
    // Wstrząs ekranu
    if (gameState.screenShake) {
        document.getElementById('game-screen').style.animation = 'jumpscareShake 0.5s linear infinite';
    }
    
    // Po 3 sekundach wróć do menu
    setTimeout(() => {
        jumpscareDiv.style.display = 'none';
        gameState.jumpscareActive = false;
        
        // Zatrzymaj wstrząs
        document.getElementById('game-screen').style.animation = '';
        
        // Zapisz postęp gry
        saveGameProgress();
        
        // Wróć do menu
        showScreen('menu');
        hideNightSelect();
        
        // Reset animatroników
        resetAnimatronics();
    }, 3000);
}

function resetAnimatronics() {
    for (const key in animatronics) {
        animatronics[key].position = animatronics[key].movementPattern[0];
    }
}

// UKOŃCZENIE NOCY
// ---------------
function completeNight() {
    console.log(`Ukończono noc ${gameState.currentNight}!`);
    
    gameState.gameActive = false;
    gameState.nightCompleted = true;
    gameState.totalNightsCompleted = Math.max(gameState.totalNightsCompleted, gameState.currentNight);
    
    // Zatrzymaj timery
    clearInterval(gameTimer);
    clearInterval(animatronicTimer);
    if (powerOutTimer) clearTimeout(powerOutTimer);
    
    // Oblicz wynagrodzenie
    const basePay = 120.50;
    const nightBonus = gameState.currentNight * 25;
    const powerBonus = Math.max(0, gameState.power) * 0.5;
    const totalPay = basePay + nightBonus + powerBonus;
    
    gameState.playerMoney += totalPay;
    
    // Pokaż ekran ukończenia nocy
    const nightComplete = document.getElementById('night-complete');
    document.getElementById('completed-night').textContent = gameState.currentNight;
    document.getElementById('night-pay').textContent = totalPay.toFixed(2);
    document.getElementById('night-power').textContent = gameState.power.toFixed(1);
    document.getElementById('total-money').textContent = gameState.playerMoney.toFixed(2);
    
    nightComplete.style.display = 'flex';
    
    // Odtwórz dźwięk sukcesu
    playSound('success');
    
    // Zapisz postęp
    if (gameState.currentNight < 5) {
        gameState.currentNight++;
    }
    saveGameProgress();
}

function nextNight() {
    document.getElementById('night-complete').style.display = 'none';
    startNight(gameState.currentNight);
}

function backToMenuFromComplete() {
    document.getElementById('night-complete').style.display = 'none';
    showScreen('menu');
}

// KONTROLA GRY
// ------------
function toggleCameras() {
    if (gameState.isPowerOut) {
        showMessage("System kamer nie działa - brak zasilania!");
        return;
    }
    
    gameState.camerasActive = !gameState.camerasActive;
    
    if (gameState.camerasActive) {
        document.getElementById('camera-view').style.display = 'flex';
        document.getElementById('monitor').style.opacity = '0.7';
        
        // Aktywuj pierwszą kamerę
        switchCamera(1);
    } else {
        document.getElementById('camera-view').style.display = 'none';
        document.getElementById('monitor').style.opacity = '0';
    }
    
    playSound('camera');
}

function toggleLeftLight() {
    if (gameState.isPowerOut) {
        showMessage("System oświetlenia nie działa - brak zasilania!");
        return;
    }
    
    gameState.leftLightOn = !gameState.leftLightOn;
    updateLightButtons();
    playSound('light');
}

function toggleRightLight() {
    if (gameState.isPowerOut) {
        showMessage("System oświetlenia nie działa - brak zasilania!");
        return;
    }
    
    gameState.rightLightOn = !gameState.rightLightOn;
    updateLightButtons();
    playSound('light');
}

function toggleLeftDoor() {
    if (gameState.isPowerOut) {
        showMessage("System drzwi nie działa - brak zasilania!");
        return;
    }
    
    gameState.leftDoorClosed = !gameState.leftDoorClosed;
    updateDoorButtons();
    playSound('door');
}

function toggleRightDoor() {
    if (gameState.isPowerOut) {
        showMessage("System drzwi nie działa - brak zasilania!");
        return;
    }
    
    gameState.rightDoorClosed = !gameState.rightDoorClosed;
    updateDoorButtons();
    playSound('door');
}

function useBuzzer() {
    if (gameState.isPowerOut || gameState.buzzerActive) {
        return;
    }
    
    gameState.buzzerActive = true;
    
    // Odtwórz dźwięk odstraszający
    playSound('buzzer');
    
    // Odstrasz animatroniki w pobliżu drzwi
    for (const key in animatronics) {
        const animatronic = animatronics[key];
        if ((animatronic.position === 3 || animatronic.position === 11) && animatronic.active) {
            // Cofnij animatronika o jedną pozycję
            const pattern = animatronic.movementPattern;
            const currentIndex = pattern.indexOf(animatronic.position);
            if (currentIndex > 0) {
                animatronic.position = pattern[currentIndex - 1];
            }
            
            // Ukryj animatronika w biurze
            if (animatronic === animatronics.boltBear) {
                document.getElementById('bolt-bear-office').style.display = 'none';
            }
            if (animatronic === animatronics.sparkyFox) {
                document.getElementById('sparky-fox-office').style.display = 'none';
            }
        }
    }
    
    // Zresetuj dzwonek po 2 sekundach
    setTimeout(() => {
        gameState.buzzerActive = false;
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
    gameState.gamePaused = !gameState.gamePaused;
    
    if (gameState.gamePaused) {
        document.getElementById('pause-btn').innerHTML = '<i class="fas fa-play"></i><span class="btn-label">WZNÓW</span>';
        document.getElementById('hint-text').textContent = 'GRA ZAPAUZOWANA - Naciśnij P aby wznowić';
        playSound('pause');
    } else {
        document.getElementById('pause-btn').innerHTML = '<i class="fas fa-pause"></i><span class="btn-label">PAUZA</span>';
        document.getElementById('hint-text').textContent = 'Używaj klawiszy C (kamery), Q/E (światła), L/R (drzwi), Spacji (dźwięk)';
        playSound('unpause');
    }
}

// KAMERY
// ------
function createCameraButtons() {
    const camerasGrid = document.querySelector('.cameras-grid');
    camerasGrid.innerHTML = '';
    
    for (let i = 0; i < cameraLocations.length; i++) {
        const camera = cameraLocations[i];
        const button = document.createElement('button');
        button.className = 'camera-grid-btn';
        button.setAttribute('data-camera-id', camera.id);
        
        button.innerHTML = `
            <div class="camera-number">CAM ${camera.id}</div>
            <div class="camera-name">${camera.name}</div>
        `;
        
        button.addEventListener('click', () => {
            switchCamera(camera.id);
        });
        
        camerasGrid.appendChild(button);
    }
}

function switchCamera(cameraId) {
    if (!gameState.camerasActive) return;
    
    // Usuń klasę active ze wszystkich przycisków
    document.querySelectorAll('.camera-grid-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Dodaj klasę active do klikniętego przycisku
    const activeButton = document.querySelector(`.camera-grid-btn[data-camera-id="${cameraId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Pokaż podgląd kamery
    showCameraFeed(cameraId);
    playSound('cameraSwitch');
}

function showCameraFeed(cameraId) {
    const camera = cameraLocations.find(cam => cam.id === cameraId);
    if (!camera) return;
    
    // Aktualizuj nagłówek kamery
    document.querySelector('.camera-title').textContent = `KAMERA ${cameraId}: ${camera.name}`;
    
    // Aktualizuj czas
    const timeString = getTimeString();
    document.querySelector('.camera-time').textContent = timeString;
    
    // Sprawdź które animatroniki są w tej lokacji
    const animatronicsHere = [];
    for (const key in animatronics) {
        if (animatronics[key].position === cameraId) {
            animatronicsHere.push(animatronics[key]);
        }
    }
    
    // Aktualizuj status
    const statusValue = document.querySelector('.status-value');
    if (animatronicsHere.length > 0) {
        statusValue.textContent = `${animatronicsHere.length} WIDOCZNYCH`;
        statusValue.className = 'status-value inactive';
    } else {
        statusValue.textContent = 'BRAK AKTYWNOŚCI';
        statusValue.className = 'status-value active';
    }
}

function updateCameraDisplay() {
    if (!gameState.camerasActive) return;
    
    // Znajdź aktywną kamerę
    const activeButton = document.querySelector('.camera-grid-btn.active');
    if (activeButton) {
        const cameraId = parseInt(activeButton.getAttribute('data-camera-id'));
        showCameraFeed(cameraId);
    }
}

// UPDATE UI
// ---------
function updateUI() {
    // Aktualizuj czas
    const timeString = getTimeString();
    document.getElementById('clock').querySelector('.clock-time').textContent = timeString;
    document.getElementById('hud-time').textContent = timeString;
    
    // Aktualizuj moc
    const powerPercent = Math.max(0, Math.min(100, gameState.power));
    document.getElementById('hud-power').textContent = `${powerPercent.toFixed(1)}%`;
    
    if (powerPercent < 20) {
        document.getElementById('hud-power').className = 'stat-value warning';
    } else {
        document.getElementById('hud-power').className = 'stat-value';
    }
    
    // Aktualizuj noc
    document.getElementById('hud-night').textContent = gameState.currentNight;
    
    // Aktualizuj aktywne animatroniki
    document.getElementById('hud-active').textContent = gameState.activeAnimatronics;
    
    // Aktualizuj status drzwi
    updateDoorStatus();
    
    // Aktualizuj podgląd kamery jeśli aktywny
    updateCameraDisplay();
}

function getTimeString() {
    const hourDisplay = gameState.currentHour === 0 ? 12 : 
                       gameState.currentHour > 12 ? gameState.currentHour - 12 : gameState.currentHour;
    const ampm = gameState.currentHour >= 12 ? "PM" : "AM";
    return `${hourDisplay}:${gameState.currentMinute.toString().padStart(2, '0')} ${ampm}`;
}

function updateDoorStatus() {
    const leftDoorStatus = document.getElementById('left-door-status');
    const rightDoorStatus = document.getElementById('right-door-status');
    
    if (gameState.leftDoorClosed) {
        leftDoorStatus.textContent = "ZAMKNIĘTE";
        leftDoorStatus.className = "door-value closed";
    } else {
        leftDoorStatus.textContent = "OTWARTE";
        leftDoorStatus.className = "door-value";
    }
    
    if (gameState.rightDoorClosed) {
        rightDoorStatus.textContent = "ZAMKNIĘTE";
        rightDoorStatus.className = "door-value closed";
    } else {
        rightDoorStatus.textContent = "OTWARTE";
        rightDoorStatus.className = "door-value";
    }
}

function updateDoorButtons() {
    const leftDoor = document.getElementById('left-door');
    const rightDoor = document.getElementById('right-door');
    const leftButton = document.getElementById('left-door-button');
    const rightButton = document.getElementById('right-door-button');
    
    if (gameState.leftDoorClosed) {
        leftDoor.classList.add('closed');
        leftButton.classList.add('active');
    } else {
        leftDoor.classList.remove('closed');
        leftButton.classList.remove('active');
    }
    
    if (gameState.rightDoorClosed) {
        rightDoor.classList.add('closed');
        rightButton.classList.add('active');
    } else {
        rightDoor.classList.remove('closed');
        rightButton.classList.remove('active');
    }
}

function updateLightButtons() {
    const leftButton = document.getElementById('lights-left-btn');
    const rightButton = document.getElementById('lights-right-btn');
    
    if (gameState.leftLightOn) {
        leftButton.classList.add('active');
    } else {
        leftButton.classList.remove('active');
    }
    
    if (gameState.rightLightOn) {
        rightButton.classList.add('active');
    } else {
        rightButton.classList.remove('active');
    }
}

// MINIGRA
// -------
function initMiniGameCanvas() {
    const canvas = document.getElementById('mini-game-canvas');
    miniGameCtx = canvas.getContext('2d');
    
    // Setup sterowania
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

function startMiniGame() {
    console.log("Rozpoczynanie minigry...");
    
    // Reset stanu minigry
    resetMiniGame();
    
    // Ustaw flagę aktywności
    miniGameActive = true;
    
    // Rozpocznij pętlę gry
    if (miniGameInterval) clearInterval(miniGameInterval);
    miniGameInterval = setInterval(updateMiniGame, 1000/60);
    
    // Ukryj przycisk start
    document.getElementById('mini-game-start').style.display = 'none';
    
    console.log("Minigra rozpoczęta!");
}

function resetMiniGame() {
    // Reset zmiennych
    miniGamePlayer = { x: 400, y: 450, width: 40, height: 40, speed: 6 };
    miniGameEnemies = [];
    miniGameProjectiles = [];
    miniGameScore = 0;
    miniGameLives = 3;
    miniGameLevel = 1;
    miniGameKeys = { left: false, right: false, space: false };
    
    // Stwórz początkowe wrogie
    for (let i = 0; i < 5; i++) {
        miniGameEnemies.push({
            x: Math.random() * (800 - 40),
            y: Math.random() * 200,
            width: 40,
            height: 40,
            speed: 1 + Math.random() * 2,
            type: Math.floor(Math.random() * 3),
            health: 1
        });
    }
    
    // Aktualizuj UI
    updateMiniGameUI();
    
    // Pokaż przycisk start
    document.getElementById('mini-game-start').style.display = 'block';
}

function updateMiniGame() {
    if (!miniGameActive) return;
    
    // Czyść canvas
    miniGameCtx.clearRect(0, 0, 800, 500);
    
    // Porusz graczem
    if (miniGameKeys.left) {
        miniGamePlayer.x = Math.max(0, miniGamePlayer.x - miniGamePlayer.speed);
    }
    if (miniGameKeys.right) {
        miniGamePlayer.x = Math.min(760, miniGamePlayer.x + miniGamePlayer.speed);
    }
    
    // Porusz pociskami
    for (let i = miniGameProjectiles.length - 1; i >= 0; i--) {
        const projectile = miniGameProjectiles[i];
        projectile.y -= projectile.speed;
        
        // Sprawdź kolizje z wrogami
        for (let j = miniGameEnemies.length - 1; j >= 0; j--) {
            const enemy = miniGameEnemies[j];
            if (checkCollision(projectile, enemy)) {
                enemy.health--;
                if (enemy.health <= 0) {
                    miniGameScore += 10;
                    miniGameEnemies.splice(j, 1);
                }
                miniGameProjectiles.splice(i, 1);
                break;
            }
        }
        
        // Usuń pociski poza ekranem
        if (projectile.y < 0) {
            miniGameProjectiles.splice(i, 1);
        }
    }
    
    // Porusz wrogami
    for (let i = miniGameEnemies.length - 1; i >= 0; i--) {
        const enemy = miniGameEnemies[i];
        enemy.y += enemy.speed;
        
        // Jeśli wróg dotrze do dołu, odejmij życie
        if (enemy.y > 500) {
            miniGameLives--;
            miniGameEnemies.splice(i, 1);
            
            // Jeśli skończą się życia, zakończ minigrę
            if (miniGameLives <= 0) {
                endMiniGame();
                return;
            }
        }
        
        // Sprawdź kolizję z graczem
        if (checkCollision(miniGamePlayer, enemy)) {
            miniGameLives--;
            miniGameEnemies.splice(i, 1);
            
            if (miniGameLives <= 0) {
                endMiniGame();
                return;
            }
        }
    }
    
    // Dodaj nowych wrogów jeśli potrzeba
    if (miniGameEnemies.length < 5 + miniGameLevel * 2) {
        miniGameEnemies.push({
            x: Math.random() * (800 - 40),
            y: -40,
            width: 40,
            height: 40,
            speed: 1 + Math.random() * 2 + miniGameLevel * 0.2,
            type: Math.floor(Math.random() * 3),
            health: 1
        });
    }
    
    // Zwiększ poziom
    if (miniGameScore >= miniGameLevel * 100) {
        miniGameLevel++;
    }
    
    // Rysuj wszystko
    drawMiniGame();
    
    // Aktualizuj UI
    updateMiniGameUI();
}

function drawMiniGame() {
    // Tło
    miniGameCtx.fillStyle = '#001100';
    miniGameCtx.fillRect(0, 0, 800, 500);
    
    // Gracz (zielony kwadrat)
    miniGameCtx.fillStyle = '#0f0';
    miniGameCtx.fillRect(miniGamePlayer.x, miniGamePlayer.y, miniGamePlayer.width, miniGamePlayer.height);
    
    // Oczy gracza
    miniGameCtx.fillStyle = '#fff';
    miniGameCtx.fillRect(miniGamePlayer.x + 8, miniGamePlayer.y + 8, 8, 8);
    miniGameCtx.fillRect(miniGamePlayer.x + 24, miniGamePlayer.y + 8, 8, 8);
    
    // Pociski
    miniGameCtx.fillStyle = '#0ff';
    miniGameProjectiles.forEach(projectile => {
        miniGameCtx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    });
    
    // Wrogowie
    miniGameEnemies.forEach(enemy => {
        switch(enemy.type) {
            case 0:
                miniGameCtx.fillStyle = '#f00';
                break;
            case 1:
                miniGameCtx.fillStyle = '#900';
                break;
            case 2:
                miniGameCtx.fillStyle = '#c00';
                break;
        }
        
        miniGameCtx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Oczy wrogów
        miniGameCtx.fillStyle = '#fff';
        miniGameCtx.fillRect(enemy.x + 8, enemy.y + 8, 8, 8);
        miniGameCtx.fillRect(enemy.x + 24, enemy.y + 8, 8, 8);
    });
}

function shootProjectile() {
    miniGameProjectiles.push({
        x: miniGamePlayer.x + miniGamePlayer.width / 2 - 5,
        y: miniGamePlayer.y,
        width: 10,
        height: 20,
        speed: 10
    });
    
    playSound('shoot');
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function updateMiniGameUI() {
    document.getElementById('mini-game-score').textContent = miniGameScore;
    document.getElementById('mini-game-lives').textContent = miniGameLives;
    document.getElementById('mini-game-level').textContent = miniGameLevel;
}

function endMiniGame() {
    miniGameActive = false;
    clearInterval(miniGameInterval);
    
    // Rysuj ekran końcowy
    miniGameCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    miniGameCtx.fillRect(0, 0, 800, 500);
    
    miniGameCtx.fillStyle = '#0f0';
    miniGameCtx.font = '48px Courier New';
    miniGameCtx.textAlign = 'center';
    miniGameCtx.fillText('KONIEC GRY', 400, 150);
    
    miniGameCtx.font = '32px Courier New';
    miniGameCtx.fillText(`Wynik: ${miniGameScore}`, 400, 220);
    miniGameCtx.fillText(`Poziom: ${miniGameLevel}`, 400, 270);
    
    // Dodaj nagrodę za minigrę
    if (miniGameScore > 0) {
        const reward = miniGameScore * 0.1;
        gameState.playerMoney += reward;
        miniGameCtx.fillText(`Nagroda: $${reward.toFixed(2)}`, 400, 320);
        saveGameProgress();
    }
    
    miniGameCtx.font = '24px Courier New';
    miniGameCtx.fillText('Kliknij "Powrót do menu" aby kontynuować', 400, 400);
    
    // Pokaż przycisk start
    document.getElementById('mini-game-start').style.display = 'block';
    document.getElementById('mini-game-start').innerHTML = '<i class="fas fa-redo"></i> ZAGRAJ PONOWNIE';
}

// DŹWIĘKI
// -------
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log("AudioContext zainicjalizowany!");
    } catch (e) {
        console.error("Web Audio API nie jest wspierane w tej przeglądarce", e);
    }
}

function playSound(soundName) {
    if (!gameState.soundEffects || !audioContext) return;
    
    try {
        let oscillator, gainNode;
        
        switch(soundName) {
            case 'start':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
                
                gainNode.gain.setValueAtTime(0.1 * (gameState.soundVolume / 100), audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
                
            case 'camera':
            case 'cameraSwitch':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                
                gainNode.gain.setValueAtTime(0.05 * (gameState.soundVolume / 100), audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
                
            case 'light':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                
                gainNode.gain.setValueAtTime(0.03 * (gameState.soundVolume / 100), audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.05);
                break;
                
            case 'door':
            case 'doorBang':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                
                gainNode.gain.setValueAtTime(0.1 * (gameState.soundVolume / 100), audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
                
            case 'buzzer':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
                
                gainNode.gain.setValueAtTime(0.2 * (gameState.soundVolume / 100), audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
                
            case 'powerout':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 1);
                
                gainNode.gain.setValueAtTime(0.15 * (gameState.soundVolume / 100), audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 1);
                break;
                
            case 'bear':
            case 'fox':
            case 'chica':
            case 'pirate':
            case 'golden':
                // Jumpscare sounds
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.5);
                
                gainNode.gain.setValueAtTime(0.3 * (gameState.soundVolume / 100), audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
                break;
                
            case 'success':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E5
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.4); // G5
                
                gainNode.gain.setValueAtTime(0.1 * (gameState.soundVolume / 100), audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1 * (gameState.soundVolume / 100), audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.1 * (gameState.soundVolume / 100), audioContext.currentTime + 0.4);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.6);
                break;
                
            case 'pause':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime); // F4
                
                gainNode.gain.setValueAtTime(0.05 * (gameState.soundVolume / 100), audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
                
            case 'unpause':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                
                gainNode.gain.setValueAtTime(0.05 * (gameState.soundVolume / 100), audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
                
            case 'shoot':
                oscillator = audioContext.createOscillator();
                gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                
                gainNode.gain.setValueAtTime(0.03 * (gameState.soundVolume / 100), audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.1);
                break;
        }
    } catch (e) {
        console.error("Błąd odtwarzania dźwięku:", e);
    }
}

function updateAudioVolume() {
    // Ta funkcja mogłaby aktualizować głośność aktywnych dźwięków
    // W obecnej implementacji głośność jest ustawiana przy każdym odtworzeniu
}

// ZAPIS I ŁADOWANIE
// -----------------
function saveGameProgress() {
    const progress = {
        currentNight: gameState.currentNight,
        playerMoney: gameState.playerMoney,
        totalNightsCompleted: gameState.totalNightsCompleted,
        unlockedMinigames: gameState.totalNightsCompleted > 0
    };
    
    localStorage.setItem('fnufProgress', JSON.stringify(progress));
    console.log("Postęp gry zapisany!");
}

function loadGameProgress() {
    const savedProgress = localStorage.getItem('fnufProgress');
    if (savedProgress) {
        try {
            const progress = JSON.parse(savedProgress);
            gameState.currentNight = progress.currentNight || 1;
            gameState.playerMoney = progress.playerMoney || 0;
            gameState.totalNightsCompleted = progress.totalNightsCompleted || 0;
            
            // Jeśli odblokowano minigry, pokaż przycisk
            if (progress.unlockedMinigames) {
                document.getElementById('mini-game-btn').style.display = 'flex';
            }
            
            console.log("Postęp gry załadowany!");
        } catch (e) {
            console.error("Błąd ładowania postępu gry:", e);
        }
    }
}

function saveSettings() {
    const settings = {
        soundVolume: gameState.soundVolume,
        soundEffects: gameState.soundEffects,
        backgroundMusic: gameState.backgroundMusic,
        screenShake: gameState.screenShake,
        theme: gameState.theme
    };
    
    localStorage.setItem('fnufSettings', JSON.stringify(settings));
    showMessage("Ustawienia zapisane!");
    console.log("Ustawienia zapisane!");
}

function loadSettings() {
    const savedSettings = localStorage.getItem('fnufSettings');
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            gameState.soundVolume = settings.soundVolume || 70;
            gameState.soundEffects = settings.soundEffects !== undefined ? settings.soundEffects : true;
            gameState.backgroundMusic = settings.backgroundMusic !== undefined ? settings.backgroundMusic : true;
            gameState.screenShake = settings.screenShake !== undefined ? settings.screenShake : true;
            gameState.theme = settings.theme || 'green';
            
            console.log("Ustawienia załadowane!");
        } catch (e) {
            console.error("Błąd ładowania ustawień:", e);
        }
    }
}

function resetProgress() {
    if (confirm("Czy na pewno chcesz zresetować cały postęp gry? Ta akcja jest nieodwracalna!")) {
        localStorage.removeItem('fnufProgress');
        gameState.currentNight = 1;
        gameState.playerMoney = 0;
        gameState.totalNightsCompleted = 0;
        document.getElementById('mini-game-btn').style.display = 'none';
        showMessage("Postęp gry zresetowany!");
        console.log("Postęp gry zresetowany!");
    }
}

// EASTER EGGI
// -----------
function setupEasterEggs() {
    // Plakat - kliknięcie odkrywa tajny kod
    document.getElementById('poster').addEventListener('click', function() {
        if (gameState.gameActive && !gameState.gamePaused) {
            showMessage("Znalazłeś easter egga!\nTajny kod: FNUF2023\nUżyj tego kodu w menu głównym dla specjalnej nagrody!");
            playSound('success');
            
            // Odblokuj coś specjalnego
            localStorage.setItem('fnufSecretCode', 'FNUF2023');
        }
    });
    
    // Kubek - kliknięcie dodaje trochę energii
    document.getElementById('cup').addEventListener('click', function() {
        if (gameState.gameActive && !gameState.gamePaused && !gameState.isPowerOut) {
            gameState.power = Math.min(100, gameState.power + 5);
            updateUI();
            showMessage("Znaleziono kawę! +5% energii!");
            playSound('success');
        }
    });
}

function checkSecretCode() {
    // Sprawdź sekretny kod FNUF2023
    const secretCode = localStorage.getItem('fnufSecretCode');
    if (secretCode === 'FNUF2023') {
        // Odblokuj specjalną noc 6
        const nightSelect = document.querySelector('.night-buttons');
        if (!document.querySelector('.night-btn[data-night="6"]')) {
            const night6Btn = document.createElement('button');
            night6Btn.className = 'night-btn';
            night6Btn.setAttribute('data-night', '6');
            night6Btn.textContent = 'Noc 6';
            night6Btn.addEventListener('click', function() {
                const night = parseInt(this.getAttribute('data-night'));
                startNight(night);
            });
            nightSelect.appendChild(night6Btn);
            
            showMessage("Odblokowano specjalną noc 6!");
            localStorage.removeItem('fnufSecretCode'); // Usuń kod, aby nie można było go użyć ponownie
        }
    }
}

// POMOCNICZE FUNKCJE
// ------------------
function applyTheme(theme) {
    // Usuń wszystkie klasy tematyczne
    document.body.classList.remove('theme-green', 'theme-blue', 'theme-red', 'theme-purple');
    
    // Dodaj wybraną klasę
    document.body.classList.add(`theme-${theme}`);
    
    // Zastosuj kolory dla wybranego motywu
    let primaryColor, secondaryColor;
    
    switch(theme) {
        case 'blue':
            primaryColor = '#00aaff';
            secondaryColor = '#0088cc';
            break;
        case 'red':
            primaryColor = '#ff3300';
            secondaryColor = '#cc2200';
            break;
        case 'purple':
            primaryColor = '#aa00ff';
            secondaryColor = '#8800cc';
            break;
        default: // green
            primaryColor = '#00ff00';
            secondaryColor = '#00aa00';
    }
    
    // Tutaj można dodać bardziej zaawansowane zmiany kolorów w CSS
    // Dla uproszczenia zmieniamy tylko kilka podstawowych elementów
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
}

function showMessage(message) {
    // Prosta funkcja do wyświetlania wiadomości
    alert(message);
}

// INICJALIZACJA PO ZAŁADOWANIU STRONY
// ------------------------------------
window.addEventListener('DOMContentLoaded', function() {
    console.log("DOM załadowany, inicjalizacja gry...");
    
    // Dodaj klasy tematyczne do CSS
    const style = document.createElement('style');
    style.textContent = `
        .theme-blue .menu-btn:hover { background: linear-gradient(to bottom, #0066aa, #003366); }
        .theme-red .menu-btn:hover { background: linear-gradient(to bottom, #aa3300, #662200); }
        .theme-purple .menu-btn:hover { background: linear-gradient(to bottom, #6600aa, #330066); }
        
        .theme-blue #title { color: #00aaff; text-shadow: 0 0 20px #00aaff; }
        .theme-red #title { color: #ff3300; text-shadow: 0 0 20px #ff3300; }
        .theme-purple #title { color: #aa00ff; text-shadow: 0 0 20px #aa00ff; }
    `;
    document.head.appendChild(style);
    
    // Inicjalizuj grę
    initGame();
    
    // Dodaj efekt pisania do tytułu
    const title = document.getElementById('title');
    const subtitle = document.getElementById('subtitle');
    const originalTitle = title.textContent;
    const originalSubtitle = subtitle.textContent;
    
    title.textContent = '';
    subtitle.textContent = '';
    
    let i = 0;
    function typeWriterTitle() {
        if (i < originalTitle.length) {
            title.textContent += originalTitle.charAt(i);
            i++;
            setTimeout(typeWriterTitle, 100);
        } else {
            // Po zakończeniu pisania tytułu, zacznij pisać podtytuł
            i = 0;
            setTimeout(typeWriterSubtitle, 500);
        }
    }
    
    function typeWriterSubtitle() {
        if (i < originalSubtitle.length) {
            subtitle.textContent += originalSubtitle.charAt(i);
            i++;
            setTimeout(typeWriterSubtitle, 50);
        }
    }
    
    setTimeout(typeWriterTitle, 500);
    
    console.log("Gra FNUF gotowa do rozpoczęcia!");
});
