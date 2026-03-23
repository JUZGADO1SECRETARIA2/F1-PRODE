document.addEventListener('DOMContentLoaded', () => {
    // Basic Routing for Bottom Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => {
                nav.classList.remove('active', 'scale-95', 'bg-gradient-to-b', 'from-[#FFB4A8]', 'to-[#FF5540]', 'text-[#131313]');
                nav.classList.add('text-[#E5E2E1]/60');
            });

            // Re-apply active class logic
            const targetId = item.getAttribute('data-target');
            views.forEach(view => view.classList.add('hidden'));
            document.getElementById(targetId).classList.remove('hidden');

            // Handle Nav Item active state
            if (targetId === 'view-predictions') {
                 item.classList.add('scale-95', 'bg-gradient-to-b', 'from-[#FFB4A8]', 'to-[#FF5540]', 'text-[#131313]');
                 item.classList.remove('text-[#E5E2E1]/60');
            } else {
                 item.classList.add('active');
                 item.classList.remove('text-[#E5E2E1]/60');
                 item.classList.add('text-[#FFB4A8]');
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Driver Data (Updated with Individual SoyMotor Portraits)
    const drivers = [
        { code: 'NOR', name: 'Lando Norris', number: 4, team: 'McLaren', color: '#FF8700', image: 'assets/norris.png' },
        { code: 'PIA', name: 'Oscar Piastri', number: 81, team: 'McLaren', color: '#FF8700', image: 'assets/piastri.png' },
        { code: 'RUS', name: 'George Russell', number: 63, team: 'Mercedes', color: '#27F4D2', image: 'assets/russell.png' },
        { code: 'ANT', name: 'Kimi Antonelli', number: 12, team: 'Mercedes', color: '#27F4D2', image: 'assets/antonelli.png' },
        
        { code: 'VER', name: 'Max Verstappen', number: 1, team: 'Red Bull', color: '#3671C6', image: 'assets/verstappen.png' },
        { code: 'HAD', name: 'Isack Hadjar', number: 88, team: 'Red Bull', color: '#3671C6', image: 'assets/hadjar.png' },
        { code: 'LEC', name: 'Charles Leclerc', number: 16, team: 'Ferrari', color: '#E80020', image: 'assets/leclerc.png' },
        { code: 'HAM', name: 'Lewis Hamilton', number: 44, team: 'Ferrari', color: '#E80020', image: 'assets/hamilton.png' },

        { code: 'ALB', name: 'Alex Albon', number: 23, team: 'Williams', color: '#64C4FF', image: 'assets/albon.png' },
        { code: 'SAI', name: 'Carlos Sainz', number: 55, team: 'Williams', color: '#64C4FF', image: 'assets/sainz.png' },
        { code: 'LAW', name: 'Liam Lawson', number: 30, team: 'RB', color: '#6692FF', image: 'assets/lawson.png' },
        { code: 'LIN', name: 'Arvid Lindblad', number: 3, team: 'RB', color: '#6692FF', image: 'assets/lindblad.png' },

        { code: 'ALO', name: 'Fernando Alonso', number: 14, team: 'Aston Martin', color: '#229971', image: 'assets/alonso.png' },
        { code: 'STR', name: 'Lance Stroll', number: 18, team: 'Aston Martin', color: '#229971', image: 'assets/stroll.png' },
        { code: 'BEA', name: 'Oliver Bearman', number: 87, team: 'Haas', color: '#B6BABD', image: 'assets/bearman.png' },
        { code: 'OCO', name: 'Esteban Ocon', number: 31, team: 'Haas', color: '#B6BABD', image: 'assets/ocon.png' },

        { code: 'HUL', name: 'Nico Hülkenberg', number: 27, team: 'Audi', color: '#00FF00', image: 'assets/hulkenberg.png' },
        { code: 'BOR', name: 'Gabriel Bortoleto', number: 5, team: 'Audi', color: '#00FF00', image: 'assets/bortoleto.png' },
        { code: 'GAS', name: 'Pierre Gasly', number: 10, team: 'Alpine', color: '#0093cc', image: 'assets/gasly.png' },
        { code: 'COL', name: 'Franco Colapinto', number: 43, team: 'Alpine', color: '#0093cc', image: 'assets/colapinto.png' },

        { code: 'BOT', name: 'Valtteri Bottas', number: 77, team: 'Cadillac', color: '#7E684C', image: 'assets/bottas.png' },
        { code: 'PER', name: 'Sergio Pérez', number: 11, team: 'Cadillac', color: '#7E684C', image: 'assets/perez.png' }
    ];

    const teamOrder = {
        'Red Bull Racing': 1, 'Ferrari': 2, 'McLaren': 3, 'Mercedes': 4, 'Aston Martin': 5,
        'Alpine': 6, 'Williams': 7, 'RB': 8, 'Audi': 9, 'Haas': 10, 'Reserva': 11
    };

    const sortedDrivers = [...drivers].sort((a,b) => {
        if (teamOrder[a.team] !== teamOrder[b.team]) return teamOrder[a.team] - teamOrder[b.team];
        return a.name.localeCompare(b.name);
    });

    // Modal UI elements
    let currentTrigger = null;
    const modalOverlay = document.getElementById('driver-modal');
    const driverGrid = document.getElementById('modal-driver-grid');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Populate Modal Grid
    if (driverGrid) {
        sortedDrivers.forEach(driver => {
            const card = document.createElement('div');
            card.className = 'driver-grid-card group';
            card.style.color = driver.color;
            
            // If using the composite grid, we use object-position
            const imgStyle = driver.gridPos ? `style="object-position: ${driver.gridPos}; object-fit: cover; width: 200%; height: auto;"` : '';
            const containerClass = driver.gridPos ? 'driver-img-container-rect' : 'driver-img-container';

            const lastName = driver.name.split(' ').pop();
            card.innerHTML = `
                <div class="${containerClass} shadow-lg mb-2 overflow-hidden border border-white/10 rounded-lg">
                    <img src="${driver.image}" alt="${driver.name}" ${imgStyle} onerror="this.src='https://ui-avatars.com/api/?name=${driver.name.replace(' ', '+')}&background=random&color=fff&rounded=true'">
                </div>
                <div class="font-headline font-black text-xl italic uppercase text-on-surface tracking-wide leading-none mb-1 drop-shadow-md">${lastName}</div>
                <div class="text-[10px] font-bold text-primary uppercase tracking-widest opacity-90">${driver.team}</div>
            `;
            
            card.addEventListener('click', () => {
                if (currentTrigger) {
                    const input = currentTrigger.querySelector('input[type="hidden"]');
                    input.value = driver.code;
                    updatePickerVisual(currentTrigger, driver);
                    closeModal();
                }
            });
            driverGrid.appendChild(card);
        });
    }

    function openDriverModal(trigger) {
        currentTrigger = trigger;
        modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = '';
        currentTrigger = null;
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    function updatePickerVisual(trigger, driver) {
        const pickerContent = trigger.querySelector('.picker-content');
        const posLabel = trigger.getAttribute('data-pick');

        if (!driver) return;

        // Apply Premium Design to the selected slot
        trigger.classList.remove('border-dashed', 'border-outline-variant/30', 'border-primary/30');
        trigger.classList.add('border-solid', 'border-primary/50', 'bg-surface-container-high', 'relative');
        
        // Hide original picker content and show premium card
        pickerContent.classList.add('hidden');
        
        // Remove old details if any
        const oldCard = trigger.querySelector('.selected-driver-card');
        if (oldCard) oldCard.remove();

        const card = document.createElement('div');
        card.className = 'selected-driver-card absolute inset-0 w-full h-full animate-in fade-in duration-500';
        
        const imgStyle = driver.gridPos ? `style="object-position: ${driver.gridPos}; object-fit: cover; width: 400% !important; height: auto !important; display: block;"` : '';

        const lastName = driver.name.split(' ').pop();
        card.innerHTML = `
            <img src="${driver.image}" alt="${driver.name}" ${imgStyle} class="w-full h-full">
            <div class="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent"></div>
            <div class="selected-driver-info absolute bottom-0 left-0 w-full text-left p-4">
                <div class="font-headline text-2xl font-black italic uppercase text-white leading-none mb-1 drop-shadow-lg">${lastName}</div>
                <div class="text-[10px] font-bold text-primary uppercase tracking-[0.2em] drop-shadow-md">${driver.team}</div>
            </div>
            <div class="absolute top-4 right-4 bg-primary text-on-primary font-black px-3 py-1 rounded-lg italic text-sm shadow-lg z-10">${posLabel.toUpperCase()}</div>
            <button id="clear-pick-${posLabel}" type="button" class="absolute top-4 left-4 bg-surface-container-highest/60 backdrop-blur-md p-1.5 rounded-md hover:bg-error-container hover:text-white transition-all z-10">
                <span class="material-symbols-outlined text-xs" data-icon="close">close</span>
            </button>
        `;
        
        trigger.appendChild(card);
        
        // Handle clear selection
        card.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            const input = trigger.querySelector('input[type="hidden"]');
            input.value = '';
            
            trigger.classList.add('border-dashed');
            trigger.classList.remove('border-solid', 'border-primary/50', 'bg-surface-container-high');
            card.remove();
            pickerContent.classList.remove('hidden');
        });
    }

    // Initialize Triggers
    const triggers = document.querySelectorAll('.driver-picker-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => openDriverModal(trigger));
    });

    // Populate normal selects in Result view
    const selects = document.querySelectorAll('#view-results .driver-select');
    selects.forEach(select => {
        if (select.id === 'results-race-selector') return;
        select.innerHTML = '<option value="">Seleccionar Piloto...</option>';
        sortedDrivers.forEach(driver => {
            const option = document.createElement('option');
            option.value = driver.code;
            option.textContent = driver.name;
            select.appendChild(option);
        });
    });

    // Logic Integration
    const calendar = window.F1Logic ? window.F1Logic.CALENDAR : [];
    const now = new Date();
    
    // Populate Calendar
    const calendarList = document.getElementById('calendarList');
    if (calendarList) {
        calendarList.innerHTML = '';
        let nextFound = false;
        
        calendar.forEach((race, index) => {
            const limitDate = new Date(race.limit);
            const isPast = now > limitDate;
            let isNext = false;
            
            if (!isPast && !nextFound) {
                isNext = true;
                nextFound = true;
            }

            const roundNum = race.round || (index + 1);
            let status = isNext ? 'next' : (isPast ? 'completed' : 'upcoming');

            const card = document.createElement('div');
            card.className = `race-card ${status}`;
            const dateStr = limitDate.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
            
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="text-xs font-bold text-primary tracking-widest uppercase mb-1 block">Ronda ${roundNum}</span>
                        <h3 class="font-headline text-2xl font-black italic uppercase -mt-1">${race.name} ${race.isSprint ? '<span class="text-error text-xs uppercase tracking-widest ml-1">(Sprint)</span>' : ''}</h3>
                        <p class="text-on-surface-variant text-sm flex items-center gap-2 mt-1">
                            <span class="material-symbols-outlined text-sm" data-icon="calendar_month">calendar_month</span>
                            ${dateStr} hs
                        </p>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-[10px] font-black italic px-2 py-1 rounded bg-surface-container-highest uppercase text-primary">${isNext ? 'PROXIMA' : (isPast ? 'FINALIZADA' : 'RONDA')}</span>
                    ${isPast ? '<span class="text-xs text-on-surface-variant opacity-50">Cerrado</span>' : '<button class="text-xs font-bold text-primary uppercase tracking-widest hover:underline" onclick="document.querySelector(\'[data-target=view-predictions]\').click()">Votar</button>'}
                </div>
            `;
            calendarList.appendChild(card);
        });
    }

    // Race Selector Load
    const raceSelector = document.getElementById('race-selector');
    const nextRaceLabel = document.getElementById('next-race-label');
    if (raceSelector) {
        calendar.forEach(race => {
            const opt = document.createElement('option');
            opt.value = race.id;
            opt.textContent = race.name + (now > new Date(race.limit) ? ' [CERRADO]' : '');
            if (now > new Date(race.limit)) opt.disabled = true;
            raceSelector.appendChild(opt);
        });
        
        // Select next race
        const next = calendar.find(r => new Date(r.limit) > now);
        if (next) {
            raceSelector.value = next.id;
            if(nextRaceLabel) nextRaceLabel.textContent = next.name;
        }

        raceSelector.addEventListener('change', () => {
            if(nextRaceLabel) nextRaceLabel.textContent = raceSelector.options[raceSelector.selectedIndex].text.split(' [')[0];
            loadFormFromState();
        });

        const resRaceSel = document.getElementById('results-race-selector');
        if (resRaceSel) {
            resRaceSel.innerHTML = raceSelector.innerHTML;
            resRaceSel.value = raceSelector.value;
        }
    }

    // User Switcher
    const userSwitcher = document.getElementById('user-switcher');
    if (userSwitcher && window.F1Logic) {
        userSwitcher.value = window.F1Logic.getCurrentPlayer();
        userSwitcher.addEventListener('change', (e) => {
            window.F1Logic.setCurrentPlayer(e.target.value);
            loadFormFromState();
        });
    }

    function loadFormFromState() {
        const raceId = raceSelector.value;
        if (!raceId || !window.F1Logic) return;

        triggers.forEach(t => {
            const input = t.querySelector('input[type="hidden"]');
            input.value = '';
            const pc = t.querySelector('.picker-content');
            const pos = t.getAttribute('data-pick');
            t.classList.add('border-dashed');
            t.classList.remove('border-solid', 'border-primary/50', 'bg-surface-container-high');
            
            if (pos === 'pole') {
                pc.innerHTML = `<span class="material-symbols-outlined text-4xl text-primary/40" data-icon="add_circle">add_circle</span><span class="font-headline font-bold uppercase text-on-surface-variant">Seleccionar Piloto</span>`;
            } else if (pos === 'last') {
                pc.innerHTML = `<span class="material-symbols-outlined text-2xl text-on-surface-variant/40" data-icon="add_circle">add_circle</span><span class="font-headline font-bold uppercase text-on-surface-variant text-sm">Fin del Pelotón</span>`;
            } else {
                pc.innerHTML = `<span class="material-symbols-outlined text-3xl text-on-surface-variant/40" data-icon="add_circle">add_circle</span><span class="font-headline font-bold uppercase text-on-surface-variant">Seleccionar ${pos.toUpperCase()}</span>`;
            }
        });

        const data = window.F1Logic.loadMyPredictions(raceId);
        if (data) {
            Object.keys(data).forEach(key => {
                const trigger = document.querySelector(`.driver-picker-trigger[data-pick="${key}"]`);
                if (trigger) {
                    const driver = drivers.find(d => d.code === data[key]);
                    if (driver) {
                        trigger.querySelector('input[type="hidden"]').value = driver.code;
                        updatePickerVisual(trigger, driver);
                    }
                }
            });
        }
    }
    loadFormFromState();

    // Submission
    const predictionForm = document.getElementById('prediction-form');
    predictionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const raceId = raceSelector.value;
        const formData = new FormData(predictionForm);
        const data = {};
        let missing = false;

        ['pole', 'pos1', 'pos2', 'pos3', 'pos11', 'pos12', 'pos13', 'last'].forEach(k => {
            const val = formData.get(k);
            data[k] = val;
            if (!val) missing = true;
        });

        if (missing) {
            alert('Por favor completa todas las posiciones antes de guardar.');
            return;
        }

        window.F1Logic.savePrediction(raceId, data);
        alert('¡Predicciones guardadas exitosamente!');
        document.querySelector('[data-target="view-leaderboard"]').click();
    });

    // Results Submission
    const resultsForm = document.getElementById('results-form');
    if (resultsForm) {
        resultsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const raceId = document.getElementById('results-race-selector').value;
            const formData = new FormData(resultsForm);
            const data = {};
            let missing = false;

            ['pole', 'pos1', 'pos2', 'pos3', 'pos11', 'pos12', 'pos13', 'last'].forEach(k => {
                const val = formData.get(k);
                data[k] = val;
                if (!val) missing = true;
            });

            if (missing) {
                alert('Faltan resultados por completar.');
                return;
            }

            if (confirm('¿Confirmar resultados oficiales? Esto recalculará los puntos.')) {
                window.F1Logic.processRaceResults(raceId, data);
                alert('Puntos calculados correctamente.');
                document.querySelector('[data-target="view-leaderboard"]').click();
            }
        });
    }

    // Reset Data
    document.getElementById('resetDataBtn')?.addEventListener('click', () => {
        if(confirm('¿Estás seguro que quieres borrar todos los datos locales?')) window.F1Logic.resetAllData();
    });

    // Init Leaderboard
    if (window.F1Logic) window.F1Logic.updateLeaderboardUI();
});
