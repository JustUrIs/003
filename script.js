/**
 * Alarm List App with Groups and Day Logic
 * 
 * Features:
 * - Groups of alarms (Wake Up Alarms, Night Routine, etc.)
 * - Each alarm has active days (Mon, Wed, Fri, etc.)
 * - Simulated "today" logic - if today matches alarm's days, user can mark "already woke up"
 * - "Already woke up" only disables for today, tomorrow it's active again
 */

// Simulated "today" - change this to test different days
const TODAY = "Wed";

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
    console.log(`App initialized. Today is simulated as: ${TODAY}`);
});

/**
 * Renders the complete alarm list with groups
 */
function renderAlarmList() {
    const container = document.getElementById('alarmList');
    container.innerHTML = '';

    alarmGroups.forEach(group => {
        // Add group title
        const groupTitle = document.createElement('div');
        groupTitle.className = 'group-title';
        groupTitle.textContent = group.title;
        container.appendChild(groupTitle);

        // Add each alarm in the group
        group.alarms.forEach(alarm => {
            const alarmElement = createAlarmElement(alarm);
            container.appendChild(alarmElement);
        });
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
