/**
 * Enhanced Alarm List - Static HTML with Dynamic Functionality
 * Works with the static HTML structure to provide grouping and "off today" functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all group checkboxes
    const groupCheckboxes = document.querySelectorAll('.group-checkbox');
    
    // Get all individual "off today" checkboxes
    const offTodayCheckboxes = document.querySelectorAll('.off-today-checkbox');
    
    // Get all main toggle switches
    const mainToggles = document.querySelectorAll('.toggle-switch-container input[type="checkbox"]');

    // Add event listeners to group checkboxes
    groupCheckboxes.forEach((groupCheckbox, index) => {
        groupCheckbox.addEventListener('change', function() {
            handleGroupToggle(index, this.checked);
        });
    });

    // Add event listeners to individual "off today" checkboxes
    offTodayCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function() {
            handleOffTodayToggle(index, this.checked);
        });
    });

    // Add event listeners to main toggle switches
    mainToggles.forEach((toggle, index) => {
        toggle.addEventListener('change', function() {
            handleMainToggle(index, this.checked);
        });
    });

    console.log('Enhanced Alarm List initialized - static HTML with dynamic functionality');
});

/**
 * Handles group "off for today" toggle
 */
function handleGroupToggle(groupIndex, isChecked) {
    const groups = [
        { name: 'Morning', alarms: [0, 1] },     // indices 0,1 (07:00 AM, 08:30 AM)
        { name: 'Day', alarms: [2] },            // index 2 (10:00 AM)
        { name: 'Evening', alarms: [3, 4] }      // indices 3,4 (06:30 PM, 09:00 PM)
    ];

    const group = groups[groupIndex];
    const offTodayCheckboxes = document.querySelectorAll('.off-today-checkbox');
    const alarmItems = document.querySelectorAll('.alarm-item');

    // Toggle all alarms in this group
    group.alarms.forEach(alarmIndex => {
        const checkbox = offTodayCheckboxes[alarmIndex];
        const alarmItem = alarmItems[alarmIndex];
        
        if (isChecked) {
            // Mark as off for today
            checkbox.checked = true;
            checkbox.disabled = true;
            alarmItem.classList.add('off-for-today');
        } else {
            // Remove off for today
            checkbox.disabled = false;
            if (!checkbox.checked) {
                alarmItem.classList.remove('off-for-today');
            }
        }
    });

    console.log(`${group.name} group ${isChecked ? 'turned off' : 'turned on'} for today`);
}

/**
 * Handles individual alarm "off for today" toggle
 */
function handleOffTodayToggle(alarmIndex, isChecked) {
    const alarmItems = document.querySelectorAll('.alarm-item');
    const alarmItem = alarmItems[alarmIndex];
    const alarmTime = alarmItem.querySelector('.alarm-time').textContent;
    const alarmLabel = alarmItem.querySelector('.alarm-label').textContent;

    if (isChecked) {
        alarmItem.classList.add('off-for-today');
    } else {
        alarmItem.classList.remove('off-for-today');
    }

    console.log(`${alarmLabel} (${alarmTime}) ${isChecked ? 'off' : 'on'} for today`);
}

/**
 * Handles main alarm toggle (active/inactive)
 */
function handleMainToggle(alarmIndex, isActive) {
    const alarmItems = document.querySelectorAll('.alarm-item');
    const alarmItem = alarmItems[alarmIndex];
    const alarmTime = alarmItem.querySelector('.alarm-time').textContent;
    const alarmLabel = alarmItem.querySelector('.alarm-label').textContent;

    // The CSS handles the visual changes automatically via :has() selector
    console.log(`${alarmLabel} (${alarmTime}) ${isActive ? 'activated' : 'deactivated'}`);
}