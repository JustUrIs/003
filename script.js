/**
 * Alarm List App with Groups and Day Logic
 * 
 * Features:
 * - Groups of alarms (Wake Up Alarms, Night Routine, etc.)
 * - Each alarm has active days (Mon, Wed, Fri, etc.)
 * - Simulated "today" logic - if today matches alarm's days, user can mark "already woke up"
 * - "Already woke up" only disables for today, tomorrow it's active again
 * - Add alarm modal functionality
 */

// Simulated "today" - change this to test different days
const TODAY = "Wed";

// Variable to store new alarm data (not saved yet)
let newAlarm = {};

// Alarm groups data structure - easy to scale and modify
const alarmGroups = [
    {
        id: "wake-up",
        title: "Wake Up Alarms",
        alarms: [
            {
                id: "wake-early",
                time: "06:00 AM",
                label: "Early Bird",
                activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                isEnabled: true,
                wokeUpToday: false
            },
            {
                id: "wake-regular",
                time: "07:00 AM", 
                label: "Weekdays",
                activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                isEnabled: true,
                wokeUpToday: false
            },
            {
                id: "wake-weekend",
                time: "08:30 AM",
                label: "Weekend Sleep-in", 
                activeDays: ["Sat", "Sun"],
                isEnabled: true,
                wokeUpToday: false
            }
        ]
    },
    {
        id: "work-reminders",
        title: "Work Reminders",
        alarms: [
            {
                id: "meeting",
                time: "09:00 AM",
                label: "Team Meeting",
                activeDays: ["Mon", "Wed", "Fri"],
                isEnabled: true,
                wokeUpToday: false
            },
            {
                id: "lunch",
                time: "12:00 PM",
                label: "Lunch Break",
                activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                isEnabled: false,
                wokeUpToday: false
            }
        ]
    },
    {
        id: "night-routine",
        title: "Night Routine",
        alarms: [
            {
                id: "gym",
                time: "06:30 PM",
                label: "Gym Time",
                activeDays: ["Mon", "Wed", "Fri"],
                isEnabled: true,
                wokeUpToday: false
            },
            {
                id: "wind-down",
                time: "09:00 PM",
                label: "Wind Down",
                activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                isEnabled: false,
                wokeUpToday: false
            }
        ]
    }
];

/**
 * Initialize the app when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    renderAlarmList();
    setupModalListeners();
    console.log(`App initialized. Today is simulated as: ${TODAY}`);
});

/**
 * Renders the complete alarm list with properly organized groups
 */
function renderAlarmList() {
    const container = document.getElementById('alarmList');
    container.innerHTML = '';

    alarmGroups.forEach(group => {
        // Create group container
        const groupContainer = document.createElement('div');
        groupContainer.className = 'alarm-group';

        // Add group title
        const groupTitle = document.createElement('div');
        groupTitle.className = 'group-title';
        groupTitle.textContent = group.title;
        groupContainer.appendChild(groupTitle);

        // Add each alarm in the group
        group.alarms.forEach(alarm => {
            const alarmElement = createAlarmElement(alarm);
            groupContainer.appendChild(alarmElement);
        });

        container.appendChild(groupContainer);
    });
}

/**
 * Creates a single alarm element
 */
function createAlarmElement(alarm) {
    const alarmItem = document.createElement('div');
    alarmItem.className = 'alarm-item';
    alarmItem.id = alarm.id;

    // Check if alarm should be shown as "off today"
    const isActiveToday = alarm.activeDays.includes(TODAY);
    const isOffToday = isActiveToday && alarm.wokeUpToday;
    
    if (isOffToday) {
        alarmItem.classList.add('off-today');
    }

    // Left side - alarm info
    const alarmInfo = document.createElement('div');
    alarmInfo.className = 'alarm-info';

    const alarmTime = document.createElement('div');
    alarmTime.className = 'alarm-time';
    alarmTime.textContent = alarm.time;

    const alarmLabel = document.createElement('div'); 
    alarmLabel.className = 'alarm-label';
    alarmLabel.textContent = alarm.label;

    const alarmDays = document.createElement('div');
    alarmDays.className = 'alarm-days';
    alarmDays.textContent = alarm.activeDays.join(' ');

    alarmInfo.appendChild(alarmTime);
    alarmInfo.appendChild(alarmLabel);
    alarmInfo.appendChild(alarmDays);

    // Right side - controls
    const alarmToggle = document.createElement('div');
    alarmToggle.className = 'alarm-toggle';

    // "Already woke up" checkbox - only show if active today
    if (isActiveToday) {
        const wokeUpCheckbox = document.createElement('input');
        wokeUpCheckbox.type = 'checkbox';
        wokeUpCheckbox.className = 'woke-up-checkbox';
        wokeUpCheckbox.checked = alarm.wokeUpToday;
        wokeUpCheckbox.title = 'Already woke up today';
        wokeUpCheckbox.addEventListener('change', (e) => handleWokeUpToggle(alarm.id, e.target.checked));
        alarmToggle.appendChild(wokeUpCheckbox);
    }

    // Main enable/disable toggle
    const toggleInput = document.createElement('input');
    toggleInput.type = 'checkbox';
    toggleInput.id = `toggle-${alarm.id}`;
    toggleInput.checked = alarm.isEnabled;
    toggleInput.addEventListener('change', (e) => handleAlarmToggle(alarm.id, e.target.checked));

    const toggleLabel = document.createElement('label');
    toggleLabel.htmlFor = `toggle-${alarm.id}`;
    toggleLabel.className = 'toggle-switch';

    alarmToggle.appendChild(toggleInput);
    alarmToggle.appendChild(toggleLabel);

    // Assemble the alarm item
    alarmItem.appendChild(alarmInfo);
    alarmItem.appendChild(alarmToggle);

    return alarmItem;
}

/**
 * Sets up modal event listeners
 */
function setupModalListeners() {
    const addAlarmBtn = document.getElementById('addAlarmBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('addAlarmModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const modalSave = document.getElementById('modalSave');

    // Open modal
    addAlarmBtn.addEventListener('click', openModal);

    // Close modal
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Save alarm
    modalSave.addEventListener('click', saveAlarm);
}

/**
 * Opens the add alarm modal
 */
function openModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('addAlarmModal');
    
    modalOverlay.classList.add('show');
    modal.classList.add('show');
    
    // Reset form
    resetModalForm();
    
    console.log('Add alarm modal opened');
}

/**
 * Closes the add alarm modal
 */
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('addAlarmModal');
    
    modalOverlay.classList.remove('show');
    modal.classList.remove('show');
    
    console.log('Add alarm modal closed');
}

/**
 * Resets the modal form to default values
 */
function resetModalForm() {
    document.getElementById('alarmTime').value = '07:00';
    document.getElementById('alarmLabel').value = '';
    document.getElementById('alarmGroup').value = '';
    
    // Uncheck all days
    const dayCheckboxes = document.querySelectorAll('.day-checkbox');
    dayCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

/**
 * Captures form data and stores it in newAlarm variable
 */
function saveAlarm() {
    // Get form values
    const time = document.getElementById('alarmTime').value;
    const label = document.getElementById('alarmLabel').value;
    const group = document.getElementById('alarmGroup').value;
    
    // Get selected days
    const selectedDays = [];
    const dayCheckboxes = document.querySelectorAll('.day-checkbox:checked');
    dayCheckboxes.forEach(checkbox => {
        selectedDays.push(checkbox.value);
    });
    
    // Convert 24h time to 12h format
    const timeFormatted = formatTime(time);
    
    // Store in newAlarm variable (not saving to actual data yet)
    newAlarm = {
        time: timeFormatted,
        label: label || 'New Alarm',
        activeDays: selectedDays,
        group: group || 'Ungrouped',
        isEnabled: true,
        wokeUpToday: false
    };
    
    console.log('New alarm data captured:', newAlarm);
    console.log('Selected days:', selectedDays);
    console.log('Group:', group || 'No group specified');
    
    // Close modal
    closeModal();
    
    // Show confirmation (temporary)
    alert(`Alarm data captured!\nTime: ${newAlarm.time}\nLabel: ${newAlarm.label}\nDays: ${selectedDays.join(', ')}\nGroup: ${newAlarm.group}\n\n(Not saved yet - just captured in 'newAlarm' variable)`);
}

/**
 * Converts 24h time format to 12h format
 */
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Handles "already woke up" checkbox toggle
 * This simulates marking an alarm as completed for today only
 */
function handleWokeUpToggle(alarmId, wokeUp) {
    // Find the alarm
    let targetAlarm = null;
    for (const group of alarmGroups) {
        targetAlarm = group.alarms.find(alarm => alarm.id === alarmId);
        if (targetAlarm) break;
    }

    if (targetAlarm) {
        targetAlarm.wokeUpToday = wokeUp;
        
        // Re-render to update visual state
        renderAlarmList();
        
        console.log(`${targetAlarm.label} (${targetAlarm.time}) marked as ${wokeUp ? 'completed' : 'not completed'} for today (${TODAY})`);
        
        if (wokeUp) {
            console.log(`This alarm will be active again tomorrow if ${TODAY} is in its schedule: [${targetAlarm.activeDays.join(', ')}]`);
        }
    }
}

/**
 * Handles main alarm enable/disable toggle
 */
function handleAlarmToggle(alarmId, isEnabled) {
    // Find the alarm
    let targetAlarm = null;
    for (const group of alarmGroups) {
        targetAlarm = group.alarms.find(alarm => alarm.id === alarmId);
        if (targetAlarm) break;
    }

    if (targetAlarm) {
        targetAlarm.isEnabled = isEnabled;
        
        console.log(`${targetAlarm.label} (${targetAlarm.time}) ${isEnabled ? 'enabled' : 'disabled'}`);
        
        // Re-render to update visual state
        renderAlarmList();
    }
}

/**
 * Utility function to check if an alarm should ring today
 * (for future use - combines enabled state, active days, and "woke up" status)
 */
function shouldAlarmRingToday(alarm) {
    return alarm.isEnabled && 
           alarm.activeDays.includes(TODAY) && 
           !alarm.wokeUpToday;
}

/**
 * Debug function to log current state
 * Call this from browser console: logCurrentState()
 */
window.logCurrentState = function() {
    console.log(`=== Current Alarm State (Today: ${TODAY}) ===`);
    alarmGroups.forEach(group => {
        console.log(`\n${group.title}:`);
        group.alarms.forEach(alarm => {
            const status = shouldAlarmRingToday(alarm) ? 'WILL RING' : 'SILENT';
            const reason = !alarm.isEnabled ? '(disabled)' : 
                          !alarm.activeDays.includes(TODAY) ? '(not scheduled today)' :
                          alarm.wokeUpToday ? '(already woke up)' : '';
            console.log(`  ${alarm.time} ${alarm.label} - ${status} ${reason}`);
        });
    });
};

/**
 * Debug function to see captured new alarm data
 * Call this from browser console: showNewAlarm()
 */
window.showNewAlarm = function() {
    console.log('Captured new alarm data:', newAlarm);
};
