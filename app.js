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

    // Driver Data with Numbers, Images and Team Colors (Updated for 2026 Prode)
    const drivers = [
        { code: 'VER', name: 'Max Verstappen', number: 1, team: 'Red Bull', color: '#3671C6', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png' },
        { code: 'LAW', name: 'Liam Lawson', number: 30, team: 'Red Bull', color: '#3671C6', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LIALAW01_Liam_Lawson/lialaw01.png' },
        { code: 'HAM', name: 'Lewis Hamilton', number: 44, team: 'Ferrari', color: '#E80020', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png' },
        { code: 'LEC', name: 'Charles Leclerc', number: 16, team: 'Ferrari', color: '#E80020', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png' },
        { code: 'NOR', name: 'Lando Norris', number: 4, team: 'McLaren', color: '#FF8000', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png' },
        { code: 'PIA', name: 'Oscar Piastri', number: 81, team: 'McLaren', color: '#FF8000', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png' },
        { code: 'RUS', name: 'George Russell', number: 63, team: 'Mercedes', color: '#27F4D2', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png' },
        { code: 'ANT', name: 'Kimi Antonelli', number: 12, team: 'Mercedes', color: '#27F4D2', image: 'https://upload.wikimedia.org/wikipedia/commons/2/29/FIA_F2_Austria_2024_Nr._4_Antonelli.jpg' },
        { code: 'ALO', name: 'Fernando Alonso', number: 14, team: 'Aston Martin', color: '#229971', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png' },
        { code: 'STR', name: 'Lance Stroll', number: 18, team: 'Aston Martin', color: '#229971', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png' },
        { code: 'GAS', name: 'Pierre Gasly', number: 10, team: 'Alpine', color: '#0093cc', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png' },
        { code: 'COL', name: 'Franco Colapinto', number: 43, team: 'Alpine', color: '#0093cc', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FRACOL01_Franco_Colapinto/fracol01.png' },
        { code: 'ALB', name: 'Alexander Albon', number: 23, team: 'Williams', color: '#64C4FF', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png' },
        { code: 'SAI', name: 'Carlos Sainz', number: 55, team: 'Williams', color: '#64C4FF', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png' },
        { code: 'HAD', name: 'Isack Hadjar', number: 6, team: 'RB', color: '#6692FF', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/I/ISAHAD01_Isack_Hadjar/isahad01.png' },
        { code: 'LIN', name: 'Arvid Lindblad', number: 8, team: 'RB', color: '#6692FF', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Arvid_Lindblad_at_the_2024_Spielberg_Formula_3_round.jpg/500px-Arvid_Lindblad_at_the_2024_Spielberg_Formula_3_round.jpg' },
        { code: 'HUL', name: 'Nico Hülkenberg', number: 27, team: 'Audi', color: '#F50537', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png' },
        { code: 'BOR', name: 'Gabriel Bortoleto', number: 5, team: 'Audi', color: '#F50537', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GABBOR01_Gabriel_Bortoleto/gabbor01.png' },
        { code: 'OCO', name: 'Esteban Ocon', number: 31, team: 'Haas', color: '#B6BABD', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png' },
        { code: 'BEA', name: 'Oliver Bearman', number: 87, team: 'Haas', color: '#B6BABD', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OLIBEA01_Oliver_Bearman/olibea01.png' },
        { code: 'PER', name: 'Sergio Pérez', number: 11, team: 'Reserva', color: '#888888', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png' },
        { code: 'BOT', name: 'Valtteri Bottas', number: 77, team: 'Reserva', color: '#888888', image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png' }
    ];

    const teamOrder = {
        'Red Bull': 1,
        'Ferrari': 2,
        'McLaren': 3,
        'Mercedes': 4,
        'Aston Martin': 5,
        'Alpine': 6,
        'Williams': 7,
        'RB': 8,
        'Audi': 9,
        'Haas': 10,
        'Reserva': 11
    };

    const sortedDrivers = [...drivers].sort((a,b) => {
        if (teamOrder[a.team] !== teamOrder[b.team]) {
            return teamOrder[a.team] - teamOrder[b.team];
        }
        return a.name.localeCompare(b.name);
    });

    // UI elements for modal
    let currentSelectTarget = null;
    let currentPickerVisualTarget = null;
    const modalOverlay = document.getElementById('driver-modal');
    const driverGrid = document.getElementById('modal-driver-grid');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Populate Modal Grid
    if (driverGrid) {
        sortedDrivers.forEach(driver => {
            const card = document.createElement('div');
            card.className = 'driver-grid-card';
            card.style.borderColor = driver.color;
            
            const imgHtml = driver.image ? `<img src="${driver.image}" alt="${driver.name}" onerror="this.src='https://ui-avatars.com/api/?name=${driver.name.replace(' ', '+')}&background=random&color=fff&rounded=true'">` : `<div class="no-img" style="background:${driver.color};">${driver.code}</div>`;
            
            card.innerHTML = `
                <div class="driver-number">${driver.number}</div>
                <div class="driver-img-container">${imgHtml}</div>
                <div class="driver-name">${driver.name}</div>
            `;
            
            card.addEventListener('click', () => {
                if (currentSelectTarget && currentPickerVisualTarget) {
                    currentSelectTarget.value = driver.code;
                    updatePickerVisual(currentSelectTarget, currentPickerVisualTarget);
                    closeModal();
                }
            });
            
            driverGrid.appendChild(card);
        });
    }

    function openDriverModal(selectElement, pickerVisual) {
        currentSelectTarget = selectElement;
        currentPickerVisualTarget = pickerVisual;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        currentSelectTarget = null;
        currentPickerVisualTarget = null;
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    function updatePickerVisual(selectElement, pickerVisual) {
        const val = selectElement.value;
        const pickerContent = pickerVisual.querySelector('.picker-content');
        
        if (!val) {
            pickerContent.innerHTML = '<span class="placeholder-text">Seleccionar Piloto...</span>';
            pickerVisual.style.borderColor = '#3a3a45';
            return;
        }

        const driver = drivers.find(d => d.code === val);
        if (driver) {
            const imgHtml = driver.image ? `<img src="${driver.image}" alt="${driver.code}" onerror="this.src='https://ui-avatars.com/api/?name=${driver.name.replace(' ', '+')}&background=random&color=fff&size=30&rounded=true'">` : `<div class="no-img-mini" style="background:${driver.color};">${val}</div>`;
            pickerContent.innerHTML = `
                <div class="selected-driver">
                    <div class="selected-num" style="color:${driver.color}">${driver.number}</div>
                    <div class="selected-img">${imgHtml}</div>
                    <div class="selected-name">${driver.name}</div>
                </div>
            `;
            pickerVisual.style.borderColor = driver.color;
        }
    }

    const selects = document.querySelectorAll('.driver-select[name]');
    selects.forEach(select => {
        if (select.id === 'race-selector' || select.id === 'results-race-selector') return;

        select.style.display = 'none';
        select.innerHTML = '<option value="">Seleccionar Piloto...</option>';
        sortedDrivers.forEach(driver => {
            const option = document.createElement('option');
            option.value = driver.code;
            option.textContent = driver.name;
            select.appendChild(option);
        });

        const pickerBtn = document.createElement('div');
        pickerBtn.className = 'driver-picker-btn';
        pickerBtn.innerHTML = `
            <div class="picker-content">
                <span class="placeholder-text">Seleccionar Piloto...</span>
            </div>
            <i class="fa-solid fa-chevron-down"></i>
        `;

        select.parentNode.insertBefore(pickerBtn, select);

        pickerBtn.addEventListener('click', () => {
            openDriverModal(select, pickerBtn);
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
        selectsToReset.forEach(s => {
            s.value = ''; // Reset driver selects
            if (typeof updatePickerVisual === 'function') {
                const pickerBtn = s.previousElementSibling;
                if (pickerBtn && pickerBtn.classList.contains('driver-picker-btn')) {
                    updatePickerVisual(s, pickerBtn);
                }
            }
        });

        if(window.F1Logic && raceSelector && raceSelector.value) {
            const currentPredictions = window.F1Logic.loadMyPredictions(raceSelector.value);
            if(currentPredictions) {
                Object.keys(currentPredictions).forEach(key => {
                    const select = predictionForm.querySelector(`[name="${key}"]`);
                    if(select) {
                        select.value = currentPredictions[key];
                        if (typeof updatePickerVisual === 'function') {
                            const pickerBtn = select.previousElementSibling;
                            if (pickerBtn && pickerBtn.classList.contains('driver-picker-btn')) {
                                updatePickerVisual(select, pickerBtn);
                            }
                        }
                    }
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
