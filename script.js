/**
 * Enhanced Alarm List - Original Design with Subtle Grouping
 * Maintains the exact original alarms and design, just adds grouping functionality
 */

// Alarm data structured exactly like the original but with subtle groups
const alarmData = {
    groups: [
        {
            id: 'morning',
            title: 'Morning',
            offForToday: false,
            alarms: [
                {
                    id: 'alarm1',
                    time: '07:00 AM',
                    label: 'Weekdays',
                    isActive: true,
                    offForToday: false
                },
                {
                    id: 'alarm2',
                    time: '08:30 AM',
                    label: 'Work Meeting',
                    isActive: true,
                    offForToday: false
                }
            ]
        },
        {
            id: 'day',
            title: 'Day',
            offForToday: false,
            alarms: [
                {
                    id: 'alarm3',
                    time: '10:00 AM',
                    label: 'Coffee Break',
                    isActive: false,
                    offForToday: false
                }
            ]
        },
        {
            id: 'evening',
            title: 'Evening',
            offForToday: false,
            alarms: [
                {
                    id: 'alarm4',
                    time: '06:30 PM',
                    label: 'Gym Time',
                    isActive: true,
                    offForToday: false
                },
                {
                    id: 'alarm5',
                    time: '09:00 PM',
                    label: 'Wind Down',
                    isActive: false,
                    offForToday: false
                }
            ]
        }
    ]
};

/**
 * Renders alarm list maintaining original design but with subtle groups
 */
function renderAlarmList() {
    const container = document.getElementById('alarmList');
    container.innerHTML = '';

    alarmData.groups.forEach(group => {
        // Create subtle group header (minimal design)
        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';
        
        const groupTitle = document.createElement('div');
        groupTitle.className = 'group-title';
        groupTitle.textContent = group.title;
        
        // Small group checkbox for "off today" functionality
        const groupCheckbox = document.createElement('input');
        groupCheckbox.type = 'checkbox';
        groupCheckbox.className = 'group-checkbox';
        groupCheckbox.checked = group.offForToday;
        groupCheckbox.title = `Mark all ${group.title.toLowerCase()} alarms off for today`;
        groupCheckbox.addEventListener('change', (e) => handleGroupToggle(group.id, e.target.checked));
        
        groupHeader.appendChild(groupTitle);
        groupHeader.appendChild(groupCheckbox);
        container.appendChild(groupHeader);
        
        // Add alarms for this group
        group.alarms.forEach(alarm => {
            const alarmItem = createAlarmItem(alarm, group.offForToday);
            container.appendChild(alarmItem);
        });
    });
}

/**
 * Creates alarm item exactly like the original design
 */
function createAlarmItem(alarm, groupOffForToday) {
    // Main alarm item container
    const alarmItem = document.createElement('div');
    alarmItem.className = 'alarm-item';
    
    // Apply visual states
    if (alarm.offForToday || groupOffForToday) {
        alarmItem.classList.add('off-for-today');
    }

    // Left side - alarm info (exactly like original)
    const alarmTime = document.createElement('div');
    alarmTime.className = 'alarm-time';
    alarmTime.textContent = alarm.time;
    
    const alarmLabel = document.createElement('div');
    alarmLabel.className = 'alarm-label';
    alarmLabel.textContent = alarm.label;

    // Right side - controls 
    const alarmToggle = document.createElement('div');
    alarmToggle.className = 'alarm-toggle';
    
    // Small "off today" checkbox (subtle, minimal)
    const offTodayCheckbox = document.createElement('input');
    offTodayCheckbox.type = 'checkbox';
    offTodayCheckbox.className = 'off-today-checkbox';
    offTodayCheckbox.checked = alarm.offForToday;
    offTodayCheckbox.disabled = groupOffForToday;
    offTodayCheckbox.title = 'Off for today';
    offTodayCheckbox.addEventListener('change', (e) => handleAlarmOffTodayToggle(alarm.id, e.target.checked));
    
    // Main toggle switch (exactly like original)
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'toggle-switch-container';
    
    const mainToggle = document.createElement('input');
    mainToggle.type = 'checkbox';
    mainToggle.id = alarm.id;
    mainToggle.checked = alarm.isActive;
    mainToggle.addEventListener('change', (e) => handleAlarmActiveToggle(alarm.id, e.target.checked));
    
    const toggleSwitch = document.createElement('label');
    toggleSwitch.htmlFor = alarm.id;
    toggleSwitch.className = 'toggle-switch';
    
    toggleContainer.appendChild(mainToggle);
    toggleContainer.appendChild(toggleSwitch);
    
    alarmToggle.appendChild(offTodayCheckbox);
    alarmToggle.appendChild(toggleContainer);

    // Assemble the alarm item
    alarmItem.appendChild(alarmTime);
    alarmItem.appendChild(alarmLabel);
    alarmItem.appendChild(alarmToggle);
    
    return alarmItem;
}

/**
 * Handles group "off for today" toggle
 */
function handleGroupToggle(groupId, isOffForToday) {
    const group = alarmData.groups.find(g => g.id === groupId);
    if (group) {
        group.offForToday = isOffForToday;
        renderAlarmList();
        
        console.log(`${group.title} group ${isOffForToday ? 'turned off' : 'turned on'} for today`);
    }
}

/**
 * Handles individual alarm "off for today" toggle
 */
function handleAlarmOffTodayToggle(alarmId, isOffForToday) {
    let targetAlarm = null;
    
    for (const group of alarmData.groups) {
        const alarm = group.alarms.find(a => a.id === alarmId);
        if (alarm) {
            targetAlarm = alarm;
            break;
        }
    }
    
    if (targetAlarm) {
        targetAlarm.offForToday = isOffForToday;
        renderAlarmList();
        
        console.log(`${targetAlarm.label} (${targetAlarm.time}) ${isOffForToday ? 'off' : 'on'} for today`);
    }
}

/**
 * Handles main alarm active/inactive toggle
 */
function handleAlarmActiveToggle(alarmId, isActive) {
    let targetAlarm = null;
    
    for (const group of alarmData.groups) {
        const alarm = group.alarms.find(a => a.id === alarmId);
        if (alarm) {
            targetAlarm = alarm;
            break;
        }
    }
    
    if (targetAlarm) {
        targetAlarm.isActive = isActive;
        renderAlarmList();
        
        console.log(`${targetAlarm.label} (${targetAlarm.time}) ${isActive ? 'activated' : 'deactivated'}`);
    }
}

/**
 * Initialize the app
 */
document.addEventListener('DOMContentLoaded', function() {
    renderAlarmList();
    console.log('Enhanced Alarm List initialized - original alarms with grouping');
});