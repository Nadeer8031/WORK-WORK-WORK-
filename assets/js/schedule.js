        // Add visual weight to "Schedule" in nav links since we are on that page
        // Handled via static HTML above.
    

(function () {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    var icon = document.getElementById('mobile-menu-icon');
    var spacer = document.getElementById('mobile-menu-spacer');
    if (!btn || !menu) return;
    function openMenu() {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        btn.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = 'close';
        if (spacer) spacer.style.height = menu.scrollHeight + 'px';
    }
    function closeMenu() {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        btn.setAttribute('aria-expanded', 'false');
        if (icon) icon.textContent = 'menu';
        if (spacer) spacer.style.height = '0px';
    }
    btn.addEventListener('click', function () {
        var isHidden = menu.classList.contains('hidden');
        if (isHidden) {
            openMenu();
        } else {
            closeMenu();
        }
    });
    window.addEventListener('resize', function () {
        if (spacer && !menu.classList.contains('hidden')) {
            spacer.style.height = menu.scrollHeight + 'px';
        }
    });
})();

// ==========================================================================
// Medication Schedule: Add / Edit / Remove
// ==========================================================================
(function () {
    var STORAGE_KEY = 'auramed_medications';

    // ---------- STATE ----------
    /** @type {{id:number, name:string, dose:string, totalPills:number, availablePills:number, time:string}[]} */
    var medications = [];
    var nextMedicationId = 1;
    var currentRemoveId = null;

    // ---------- DOM REFS ----------
    var addBtn = document.getElementById('addMedicationBtn');
    var rowsBody = document.getElementById('medication-rows');
    var emptyRow = document.getElementById('medication-empty-row');

    var modalOverlay = document.getElementById('medicationModalOverlay');
    var modalTitle = document.getElementById('medicationModalTitle');
    var modalConfirm = document.getElementById('medicationModalConfirm');
    var modalClose = document.getElementById('medicationModalClose');
    var modalCancel = document.getElementById('medicationModalCancel');
    var form = document.getElementById('medicationForm');
    var formError = document.getElementById('medicationFormError');

    var fieldId = document.getElementById('medicationId');
    var fieldName = document.getElementById('medicationName');
    var fieldDose = document.getElementById('medicationDose');
    var fieldTotal = document.getElementById('medicationTotalPills');
    var fieldAvailable = document.getElementById('medicationAvailablePills');
    var fieldTime = document.getElementById('medicationTime');

    var removeOverlay = document.getElementById('removeMedicationOverlay');
    var removeText = document.getElementById('removeMedicationText');
    var removeConfirmBtn = document.getElementById('removeMedicationConfirm');
    var removeCancelBtn = document.getElementById('removeMedicationCancel');

    var timelineEntries = document.getElementById('timeline-entries');
    var timelineEmptyState = document.getElementById('timeline-empty-state');
    var refillCard = document.getElementById('refill-alert-card');
    var refillTitle = document.getElementById('refill-alert-title');
    var refillText = document.getElementById('refill-alert-text');

    // Bail out quietly if this page doesn't have the schedule markup.
    if (!addBtn || !rowsBody || !modalOverlay || !form) return;

    // ---------- PERSISTENCE ----------
    function loadMedications() {
        try {
            var raw = window.localStorage.getItem(STORAGE_KEY);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) medications = parsed;
            }
        } catch (e) {
            medications = [];
        }
        nextMedicationId = medications.reduce(function (max, m) {
            return Math.max(max, m.id + 1);
        }, 1);
    }

    function saveMedications() {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
        } catch (e) {
            /* localStorage unavailable — state still works for this session */
        }
    }

    // ---------- HELPERS ----------
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function formatTime(timeStr) {
        if (!timeStr) return '—';
        var parts = timeStr.split(':');
        var h = parseInt(parts[0], 10);
        var m = parts[1] || '00';
        var period = h >= 12 ? 'PM' : 'AM';
        var h12 = h % 12;
        if (h12 === 0) h12 = 12;
        return h12 + ':' + m + ' ' + period;
    }

    function getStatus(med) {
        var total = Number(med.totalPills) || 0;
        var available = Number(med.availablePills) || 0;
        if (available <= 0) {
            return { label: 'Empty', classes: 'bg-error-container text-on-error-container' };
        }
        if (total > 0 && available / total <= 0.2) {
            return { label: 'Low Stock', classes: 'bg-amber-100 text-amber-800' };
        }
        return { label: 'Active', classes: 'bg-green-100 text-green-800' };
    }

    // ---------- RENDER ----------
    function renderTable() {
        // Clear any previously rendered rows (keep the empty-state row in the DOM).
        Array.prototype.slice.call(rowsBody.children).forEach(function (row) {
            if (row !== emptyRow) row.remove();
        });

        if (medications.length === 0) {
            emptyRow.classList.remove('hidden');
            return;
        }
        emptyRow.classList.add('hidden');

        medications.forEach(function (med) {
            var status = getStatus(med);
            var tr = document.createElement('tr');
            tr.innerHTML =
                '<td class="px-6 py-4 font-body-md text-on-surface">' + escapeHtml(med.name) + '</td>' +
                '<td class="px-6 py-4 font-body-md text-on-surface-variant">' + escapeHtml(med.dose) + '</td>' +
                '<td class="px-6 py-4 font-body-md text-on-surface-variant">' + Number(med.availablePills) + ' / ' + Number(med.totalPills) + '</td>' +
                '<td class="px-6 py-4 font-body-md text-on-surface-variant">' + formatTime(med.time) + '</td>' +
                '<td class="px-6 py-4">' +
                    '<span class="inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm ' + status.classes + '">' + status.label + '</span>' +
                '</td>' +
                '<td class="px-6 py-4 text-right">' +
                    '<div class="flex items-center justify-end gap-2">' +
                        '<button type="button" class="edit-med-btn p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors" aria-label="Edit medication" data-id="' + med.id + '">' +
                            '<span class="material-symbols-outlined text-[20px]" data-icon="edit">edit</span>' +
                        '</button>' +
                        '<button type="button" class="remove-med-btn p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-surface-container-low transition-colors" aria-label="Remove medication" data-id="' + med.id + '">' +
                            '<span class="material-symbols-outlined text-[20px]" data-icon="delete">delete</span>' +
                        '</button>' +
                    '</div>' +
                '</td>';
            rowsBody.appendChild(tr);
        });

        rowsBody.querySelectorAll('.edit-med-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = parseInt(this.dataset.id, 10);
                var med = medications.find(function (m) { return m.id === id; });
                if (med) openEditModal(med);
            });
        });
        rowsBody.querySelectorAll('.remove-med-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = parseInt(this.dataset.id, 10);
                openRemoveConfirm(id);
            });
        });
    }

    function renderTimeline() {
        if (!timelineEntries || !timelineEmptyState) return;

        Array.prototype.slice.call(timelineEntries.children).forEach(function (el) {
            if (el !== timelineEmptyState) el.remove();
        });

        if (medications.length === 0) {
            timelineEmptyState.classList.remove('hidden');
            return;
        }
        timelineEmptyState.classList.add('hidden');

        var sorted = medications.slice().sort(function (a, b) {
            return (a.time || '').localeCompare(b.time || '');
        });

        sorted.forEach(function (med) {
            var entry = document.createElement('div');
            entry.className = 'flex items-start gap-3';
            entry.innerHTML =
                '<div class="mt-1.5 w-2.5 h-2.5 rounded-full bg-primary shrink-0"></div>' +
                '<div>' +
                    '<div class="font-label-md text-label-md text-on-surface">' + formatTime(med.time) + ' &middot; ' + escapeHtml(med.name) + '</div>' +
                    '<div class="font-label-sm text-label-sm text-on-secondary-fixed-variant">' + escapeHtml(med.dose) + '</div>' +
                '</div>';
            timelineEntries.appendChild(entry);
        });
    }

    function renderRefillAlert() {
        if (!refillCard || !refillTitle || !refillText) return;

        var lowStock = medications.filter(function (med) {
            var s = getStatus(med);
            return s.label === 'Low Stock' || s.label === 'Empty';
        });

        if (lowStock.length === 0) {
            refillTitle.textContent = 'No Refill Alerts';
            refillText.textContent = "You'll see a reminder here when a medication is running low.";
            return;
        }

        var first = lowStock[0];
        if (lowStock.length === 1) {
            refillTitle.textContent = 'Refill Needed';
            refillText.textContent = escapeHtml(first.name) + ' has ' + Number(first.availablePills) + ' pill(s) left. Consider reordering soon.';
        } else {
            refillTitle.textContent = 'Refills Needed';
            refillText.textContent = lowStock.length + ' medications are running low, including ' + escapeHtml(first.name) + '.';
        }
    }

    function renderAll() {
        renderTable();
        renderTimeline();
        renderRefillAlert();
    }

    // ---------- MODAL: ADD / EDIT ----------
    function clearFormError() {
        formError.classList.add('hidden');
        formError.textContent = '';
    }

    function showFormError(message) {
        formError.textContent = message;
        formError.classList.remove('hidden');
    }

    function openModal() {
        modalOverlay.classList.remove('hidden');
        modalOverlay.classList.add('flex');
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        modalOverlay.classList.remove('flex');
        clearFormError();
    }

    function openAddModal() {
        modalTitle.textContent = 'Add Medication';
        modalConfirm.textContent = 'Add Medication';
        form.dataset.mode = 'add';
        fieldId.value = '';
        fieldName.value = '';
        fieldDose.value = '';
        fieldTotal.value = '';
        fieldAvailable.value = '';
        fieldTime.value = '';
        clearFormError();
        openModal();
        fieldName.focus();
    }

    function openEditModal(med) {
        modalTitle.textContent = 'Edit Medication';
        modalConfirm.textContent = 'Save Changes';
        form.dataset.mode = 'edit';
        fieldId.value = med.id;
        fieldName.value = med.name;
        fieldDose.value = med.dose;
        fieldTotal.value = med.totalPills;
        fieldAvailable.value = med.availablePills;
        fieldTime.value = med.time;
        clearFormError();
        openModal();
        fieldName.focus();
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearFormError();

        var name = fieldName.value.trim();
        var dose = fieldDose.value.trim();
        var total = parseInt(fieldTotal.value, 10);
        var available = parseInt(fieldAvailable.value, 10);
        var time = fieldTime.value;

        if (!name || !dose || !time || isNaN(total) || isNaN(available)) {
            showFormError('Please fill in every field before saving.');
            return;
        }
        if (total < 0 || available < 0) {
            showFormError('Pill counts cannot be negative.');
            return;
        }
        if (available > total) {
            showFormError('Pills available cannot exceed total pills.');
            return;
        }

        if (form.dataset.mode === 'edit') {
            var id = parseInt(fieldId.value, 10);
            var med = medications.find(function (m) { return m.id === id; });
            if (med) {
                med.name = name;
                med.dose = dose;
                med.totalPills = total;
                med.availablePills = available;
                med.time = time;
            }
        } else {
            medications.push({
                id: nextMedicationId++,
                name: name,
                dose: dose,
                totalPills: total,
                availablePills: available,
                time: time
            });
        }

        saveMedications();
        renderAll();
        closeModal();
    });

    addBtn.addEventListener('click', openAddModal);
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function (e) {
        if (e.target === modalOverlay) closeModal();
    });

    // ---------- MODAL: REMOVE CONFIRM ----------
    function openRemoveConfirm(id) {
        var med = medications.find(function (m) { return m.id === id; });
        currentRemoveId = id;
        if (med && removeText) {
            removeText.textContent = 'Are you sure you want to remove "' + med.name + '" from your schedule?';
        }
        removeOverlay.classList.remove('hidden');
        removeOverlay.classList.add('flex');
    }

    function closeRemoveConfirm() {
        removeOverlay.classList.add('hidden');
        removeOverlay.classList.remove('flex');
        currentRemoveId = null;
    }

    removeConfirmBtn.addEventListener('click', function () {
        if (currentRemoveId === null) return;
        medications = medications.filter(function (m) { return m.id !== currentRemoveId; });
        saveMedications();
        renderAll();
        closeRemoveConfirm();
    });
    removeCancelBtn.addEventListener('click', closeRemoveConfirm);
    removeOverlay.addEventListener('click', function (e) {
        if (e.target === removeOverlay) closeRemoveConfirm();
    });

    // Escape key closes whichever modal is open.
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (!modalOverlay.classList.contains('hidden')) closeModal();
        if (!removeOverlay.classList.contains('hidden')) closeRemoveConfirm();
    });

    // ---------- INIT ----------
    loadMedications();
    renderAll();
})();
