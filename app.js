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
        { code: 'GAS', name: 'Pierre Gasly' },
        { code: 'PER', name: 'Sergio Pérez' },
        { code: 'ANT', name: 'Kimi Antonelli' },
        { code: 'ALO', name: 'Fernando Alonso' },
        { code: 'LEC', name: 'Charles Leclerc' },
        { code: 'STR', name: 'Lance Stroll' },
        { code: 'ALB', name: 'Alexander Albon' },
        { code: 'HUL', name: 'Nico Hülkenberg' },
        { code: 'OCO', name: 'Esteban Ocon' },
        { code: 'NOR', name: 'Lando Norris' },
        { code: 'LAW', name: 'Liam Lawson' },
        { code: 'LIN', name: 'Arvid Lindblad' },
        { code: 'COL', name: 'Franco Colapinto' },
        { code: 'HAM', name: 'Lewis Hamilton' },
        { code: 'BOR', name: 'Gabriel Bortoleto' },
        { code: 'SAI', name: 'Carlos Sainz' },
        { code: 'HAD', name: 'Isack Hadjar' },
        { code: 'RUS', name: 'George Russell' },
        { code: 'BOT', name: 'Valtteri Bottas' },
        { code: 'PIA', name: 'Oscar Piastri' },
        { code: 'BEA', name: 'Oliver Bearman' }
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

    // Calendar Data from Logic
    const calendar = window.F1Logic ? window.F1Logic.CALENDAR : [];
    
    // Determine which race is upcoming based on limits
    const now = new Date();
    let nextRaceEncountered = false;

    const calendarList = document.getElementById('calendarList');
    if (calendarList) {
        calendarList.innerHTML = '';
        calendar.forEach(race => {
            const limitDate = new Date(race.limit);
            const isPast = now > limitDate;
            let classStatus = isPast ? 'completed' : (!nextRaceEncountered ? 'next' : 'upcoming');
            let label = classStatus === 'next' ? 'PRÓXIMA' : (classStatus === 'completed' ? 'FINALIZADO' : `Ronda ${race.id.replace('r','')}`);
            
            if (!isPast && !nextRaceEncountered) nextRaceEncountered = true;

            const card = document.createElement('div');
            card.className = `race-card ${classStatus}`;
            
            // Format date specifically as in the excel or standard format
            const dateStr = limitDate.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

            card.innerHTML = `
                <div class="race-header">
                    <h3>${race.name} ${race.isSprint ? '<span style="color:var(--f1-red); background:none; padding:0;">(Sprint)</span>' : ''}</h3>
                    <span>${label}</span>
                </div>
                <div class="race-date">
                    <i class="fa-regular fa-calendar"></i> Límite: ${dateStr} hs
                </div>
            `;
            calendarList.appendChild(card);
        });
    }

    // Populate Race Selector
    const raceSelector = document.getElementById('race-selector');
    const nextRaceLabel = document.getElementById('next-race-label');
    
    if (raceSelector && calendar.length > 0) {
        raceSelector.innerHTML = '';
        let selectedNext = false;
        
        calendar.forEach(race => {
            const limitDate = new Date(race.limit);
            const isPast = now > limitDate;
            
            const option = document.createElement('option');
            option.value = race.id;
            
            const dateStr = limitDate.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
            option.textContent = `${race.name} (Límite: ${dateStr})`;
            
            if (isPast) {
                option.disabled = true; // Cannot vote past races
                option.textContent += ' [CERRADO]';
            } else if (!selectedNext) {
                option.selected = true; // Auto select the immediate next race
                selectedNext = true;
                if(nextRaceLabel) nextRaceLabel.textContent = race.name;
            }
            
            raceSelector.appendChild(option);
        });
        
        raceSelector.addEventListener('change', () => {
            loadFormFromState();
        });

        // Selector for the Official Results view as well
        const resultRaceSelector = document.getElementById('results-race-selector');
        if (resultRaceSelector) {
            resultRaceSelector.innerHTML = raceSelector.innerHTML;
            resultRaceSelector.value = raceSelector.value;
        }
    }

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
        const selectsToReset = predictionForm.querySelectorAll('.driver-select:not(#race-selector)');
        selectsToReset.forEach(s => s.value = ''); // Reset driver selects

        if(window.F1Logic && raceSelector && raceSelector.value) {
            const currentPredictions = window.F1Logic.loadMyPredictions(raceSelector.value);
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
        // Fallback to raceSelector.value directly if FormData doesn't catch it on first load
        const selectedRaceId = formData.get('raceId') || (raceSelector ? raceSelector.value : null);
        
        if (!selectedRaceId) {
            alert('Debes seleccionar un evento.');
            return;
        }

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
            window.F1Logic.savePrediction(selectedRaceId, predictionData);
            const raceName = raceSelector.options[raceSelector.selectedIndex].text.split(' (')[0];
            alert('¡Predicciones guardadas localmente para ' + raceName + '!');
        }
        
        // Show Leaderboard
        navItems[0].click();
        window.F1Logic.updateLeaderboardUI();
    });

    // Official Results Submission
    const resultsForm = document.getElementById('results-form');
    if (resultsForm) {
        resultsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(resultsForm);
            const rRaceSelector = document.getElementById('results-race-selector');
            const selectedRaceId = formData.get('raceId') || (rRaceSelector ? rRaceSelector.value : null);
            
            if (!selectedRaceId) {
                alert('Debes seleccionar un evento.');
                return;
            }

            const officialData = {
                pole: formData.get('pole'),
                pos1: formData.get('pos1'),
                pos2: formData.get('pos2'),
                pos3: formData.get('pos3'),
                pos11: formData.get('pos11'),
                pos12: formData.get('pos12'),
                pos13: formData.get('pos13'),
                last: formData.get('last')
            };

            if (Object.values(officialData).includes('')) {
                alert("Por favor completá todas las posiciones para poder calcular los puntos de esta carrera.");
                return;
            }

            if (confirm("¿Estás seguro que estos son los resultados finales oficiales? Esto sobreescribirá el puntaje de esta fecha.")) {
                if (window.F1Logic) {
                    window.F1Logic.processRaceResults(selectedRaceId, officialData);
                    let raceName = selectedRaceId;
                    if (rRaceSelector.options.length > 0 && rRaceSelector.selectedIndex >= 0) {
                        raceName = rRaceSelector.options[rRaceSelector.selectedIndex].text.split(' (')[0];
                    }
                    alert('Resultados oficiales cargados para ' + raceName + '. ¡Puntos calculados!');
                    navItems[0].click(); // Go back to Leaderboard 
                }
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
