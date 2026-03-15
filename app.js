document.addEventListener('DOMContentLoaded', () => {
    // Basic Routing for Bottom Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            views.forEach(view => view.classList.remove('active'));
            
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            window.scrollTo(0, 0);
        });
    });

    // Populate Drivers in Selects
    const drivers = [
        { code: 'VER', name: 'Max Verstappen' },
        { code: 'PER', name: 'Sergio Pérez' },
        { code: 'HAM', name: 'Lewis Hamilton' },
        { code: 'LEC', name: 'Charles Leclerc' },
        { code: 'NOR', name: 'Lando Norris' },
        { code: 'PIA', name: 'Oscar Piastri' },
        { code: 'RUS', name: 'George Russell' },
        { code: 'ALO', name: 'Fernando Alonso' },
        { code: 'STR', name: 'Lance Stroll' },
        { code: 'TSU', name: 'Yuki Tsunoda' },
        { code: 'LAW', name: 'Liam Lawson' },
        { code: 'ALB', name: 'Alexander Albon' },
        { code: 'COL', name: 'Franco Colapinto' }, 
        { code: 'OCO', name: 'Esteban Ocon' },
        { code: 'GAS', name: 'Pierre Gasly' },
        { code: 'HUL', name: 'Nico Hülkenberg' },
        { code: 'MAG', name: 'Kevin Magnussen' },
        { code: 'BOT', name: 'Valtteri Bottas' },
        { code: 'ZHO', name: 'Guanyu Zhou' }
    ];

    const selects = document.querySelectorAll('.driver-select[name]');
    
    selects.forEach(select => {
        const firstOption = select.querySelector('option');
        select.innerHTML = '';
        if(firstOption) select.appendChild(firstOption);

        const sortedDrivers = [...drivers].sort((a,b) => a.name.localeCompare(b.name));

        sortedDrivers.forEach(driver => {
            const option = document.createElement('option');
            option.value = driver.code;
            option.textContent = driver.name;
            select.appendChild(option);
        });
    });

    // Handle User Switcher
    const userSwitcher = document.getElementById('user-switcher');
    if (userSwitcher && window.F1Logic) {
        userSwitcher.value = window.F1Logic.getCurrentPlayer();
        userSwitcher.addEventListener('change', (e) => {
            window.F1Logic.setCurrentPlayer(e.target.value);
            loadFormFromState();
        });
    }

    // Form Submissions
    const predictionForm = document.getElementById('prediction-form');
    
    function loadFormFromState() {
        predictionForm.reset();
        if(window.F1Logic) {
            const currentPredictions = window.F1Logic.loadMyPredictions('race_1');
            if(currentPredictions) {
                Object.keys(currentPredictions).forEach(key => {
                    const select = predictionForm.querySelector(`[name="${key}"]`);
                    if(select) select.value = currentPredictions[key];
                });
            }
        }
    }
    loadFormFromState(); // Call immediately on load

    predictionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(predictionForm);
        const predictionData = {
            pole: formData.get('pole'),
            pos1: formData.get('pos1'),
            pos2: formData.get('pos2'),
            pos3: formData.get('pos3'),
            pos11: formData.get('pos11'),
            pos12: formData.get('pos12'),
            pos13: formData.get('pos13'),
            last: formData.get('last')
        };

        if (Object.values(predictionData).includes('')) {
            alert("Por favor completá todas las posiciones antes de guardar.");
            return;
        }

        if (window.F1Logic) {
            window.F1Logic.savePrediction('race_1', predictionData);
            alert('¡Predicciones guardadas localmente!');
        }
        
        // Show Leaderboard
        navItems[0].click();
        window.F1Logic.updateLeaderboardUI();
    });

    // Mock Admin Results
    const adminBtn = document.getElementById('generateResultsMock');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
             // Let's use standard mock results 
             const mockResults = {
                pole: 'VER', pos1: 'VER', pos2: 'LEC', pos3: 'NOR',
                pos11: 'COL', pos12: 'HUL', pos13: 'STR', last: 'ZHO'
             };
             if (window.F1Logic) {
                 window.F1Logic.processRaceResults('race_1', mockResults);
                 alert('Resultados oficiales cargados. Puntajes cálculados!');
                 navItems[0].click(); 
             }
        });
    }

    // Reset Data
    const resetBtn = document.getElementById('resetDataBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
             if(confirm("¿Seguro que querés barrer todos los datos locales?") && window.F1Logic) {
                 window.F1Logic.resetAllData();
             }
        });
    }

    // Init Leaderboard
    if (window.F1Logic) {
        window.F1Logic.updateLeaderboardUI();
    }
});
