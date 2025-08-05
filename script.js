/**
 * Alarm List App with Grouping System
 * 
 * This app organizes alarms into groups and provides functionality to:
 * - Toggle individual alarms "off for today" while keeping them active for future days
 * - Toggle entire groups "off for today" 
 * - Maintain a flexible structure for future enhancements
 */

// Data structure for alarm groups
// This structure is designed to be flexible for future features like editing, moving alarms between groups, etc.
const alarmData = {
    groups: [
        {
            id: 'wake-up',
            title: 'Wake Up Alarms',
            offForToday: false, // Group-level "off for today" state
            alarms: [
                {
                    id: 'alarm-1',
                    time: '06:00 AM',
                    label: 'Early Bird',
                    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], // Days this alarm is scheduled
                    isActive: true, // Whether alarm is generally active
                    offForToday: false // Whether alarm is off for today specifically
                },
                {
                    id: 'alarm-2',
                    time: '06:30 AM',
                    label: 'Regular Wake Up',
                    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    isActive: true,
                    offForToday: false
                },
                {
                    id: 'alarm-3',
                    time: '07:00 AM',
                    label: 'Weekend Sleep In',
                    days: ['Sat', 'Sun'],
                    isActive: true,
                    offForToday: false
                }
            ]
        },
        {
            id: 'work-reminders',
            title: 'Work Reminders',
            offForToday: false,
            alarms: [
                {
                    id: 'alarm-4',
                    time: '08:30 AM',
                    label: 'Team Meeting',
                    days: ['Mon', 'Wed', 'Fri'],
                    isActive: true,
                    offForToday: false
                },
                {
                    id: 'alarm-5',
                    time: '12:00 PM',
                    label: 'Lunch Break',
                    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    isActive: true,
                    offForToday: false
                }
            ]
        },
        {
            id: 'evening-routine',
            title: 'Evening Routine',
            offForToday: false,
            alarms: [
                {
                    id: 'alarm-6',
                    time: '06:30 PM',
                    label: 'Gym Time',
                    days: ['Mon', 'Wed', 'Fri'],
                    isActive: true,
                    offForToday: false
                },
                {
                    id: 'alarm-7',
                    time: '09:00 PM',
                    label: 'Wind Down',
                    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    isActive: true,
                    offForToday: false
                }
            ]
        }
    ]
};

/**
 * Renders the entire alarm list with groups and alarms
 */
function renderAlarmList() {
    const container = document.getElementById('alarmList');
    container.innerHTML = '';

    alarmData.groups.forEach(group => {
        // Create group container
        const groupElement = document.createElement('div');
        groupElement.className = 'alarm-group';
        
        // Create group header with checkbox
        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';
        
        // Group checkbox (for "off for today" functionality)
        const groupCheckbox = document.createElement('input');
        groupCheckbox.type = 'checkbox';
        groupCheckbox.id = `group-${group.id}`;
        groupCheckbox.className = 'group-checkbox';
        groupCheckbox.checked = group.offForToday;
        groupCheckbox.addEventListener('change', (e) => handleGroupToggle(group.id, e.target.checked));
        
        // Group title
        const groupTitle = document.createElement('h2');
        groupTitle.className = 'group-title';
        groupTitle.textContent = group.title;
        
        // Group status indicator
        const groupStatus = document.createElement('span');
        groupStatus.className = 'group-status';
        groupStatus.textContent = group.offForToday ? '(Off for today)' : '';
        
        groupHeader.appendChild(groupCheckbox);
        groupHeader.appendChild(groupTitle);
        groupHeader.appendChild(groupStatus);
        groupElement.appendChild(groupHeader);

        // Create alarm items for this group
        const alarmsContainer = document.createElement('div');
        alarmsContainer.className = 'alarms-container';
        
        group.alarms.forEach(alarm => {
            const alarmItem = createAlarmItem(alarm, group.offForToday);
            alarmsContainer.appendChild(alarmItem);
        });
        
        groupElement.appendChild(alarmsContainer);
        container.appendChild(groupElement);
    });
}

/**
 * Creates an individual alarm item element
 */
function createAlarmItem(alarm, groupOffForToday) {
    const alarmItem = document.createElement('div');
    alarmItem.className = 'alarm-item';
    
    // Add visual state classes
    if (alarm.offForToday || groupOffForToday) {
        alarmItem.classList.add('off-for-today');
    }
    if (!alarm.isActive) {
        alarmItem.classList.add('inactive');
    }

    // Alarm info section
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
    alarmDays.textContent = alarm.days.join(', ');
    
    alarmInfo.appendChild(alarmTime);
    alarmInfo.appendChild(alarmLabel);
    alarmInfo.appendChild(alarmDays);

    // Alarm controls section
    const alarmControls = document.createElement('div');
    alarmControls.className = 'alarm-controls';
    
    // "Off for today" checkbox
    const offTodayCheckbox = document.createElement('input');
    offTodayCheckbox.type = 'checkbox';
    offTodayCheckbox.id = `off-today-${alarm.id}`;
    offTodayCheckbox.className = 'off-today-checkbox';
    offTodayCheckbox.checked = alarm.offForToday;
    offTodayCheckbox.disabled = groupOffForToday; // Disable if group is off for today
    offTodayCheckbox.addEventListener('change', (e) => handleAlarmOffTodayToggle(alarm.id, e.target.checked));
    
    const offTodayLabel = document.createElement('label');
    offTodayLabel.htmlFor = `off-today-${alarm.id}`;
    offTodayLabel.className = 'off-today-label';
    offTodayLabel.textContent = 'Off today';
    
    // Active/inactive toggle switch
    const activeToggle = document.createElement('div');
    activeToggle.className = 'alarm-toggle';
    
    const activeCheckbox = document.createElement('input');
    activeCheckbox.type = 'checkbox';
    activeCheckbox.id = `active-${alarm.id}`;
    activeCheckbox.checked = alarm.isActive;
    activeCheckbox.addEventListener('change', (e) => handleAlarmActiveToggle(alarm.id, e.target.checked));
    
    const toggleSwitch = document.createElement('label');
    toggleSwitch.htmlFor = `active-${alarm.id}`;
    toggleSwitch.className = 'toggle-switch';
    
    activeToggle.appendChild(activeCheckbox);
    activeToggle.appendChild(toggleSwitch);
    
    alarmControls.appendChild(offTodayCheckbox);
    alarmControls.appendChild(offTodayLabel);
    alarmControls.appendChild(activeToggle);

    alarmItem.appendChild(alarmInfo);
    alarmItem.appendChild(alarmControls);
    
    return alarmItem;
}

/**
 * Handles toggling a group "off for today"
 * When a group is turned off for today, all its alarms are also considered off for today
 */
function handleGroupToggle(groupId, isOffForToday) {
    const group = alarmData.groups.find(g => g.id === groupId);
    if (group) {
        group.offForToday = isOffForToday;
        
        // If group is turned off for today, we don't need to change individual alarm states
        // The rendering logic will handle the visual representation
        // This preserves individual alarm "off for today" states for when the group is turned back on
        
        renderAlarmList(); // Re-render to update UI
        
        console.log(`Group "${group.title}" ${isOffForToday ? 'turned off' : 'turned on'} for today`);
    }
}

/**
 * Handles toggling an individual alarm "off for today"
 * This simulates the user marking an alarm as completed for today while keeping it active for future days
 */
function handleAlarmOffTodayToggle(alarmId, isOffForToday) {
    // Find the alarm across all groups
    let targetAlarm = null;
    let targetGroup = null;
    
    for (const group of alarmData.groups) {
        const alarm = group.alarms.find(a => a.id === alarmId);
        if (alarm) {
            targetAlarm = alarm;
            targetGroup = group;
            break;
        }
    }
    
    if (targetAlarm) {
        targetAlarm.offForToday = isOffForToday;
        renderAlarmList(); // Re-render to update UI
        
        console.log(`Alarm "${targetAlarm.label}" at ${targetAlarm.time} ${isOffForToday ? 'turned off' : 'turned on'} for today`);
    }
}

/**
 * Handles toggling an alarm's general active/inactive state
 * This is different from "off for today" - this affects whether the alarm is active at all
 */
function handleAlarmActiveToggle(alarmId, isActive) {
    // Find the alarm across all groups
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
        renderAlarmList(); // Re-render to update UI
        
        console.log(`Alarm "${targetAlarm.label}" at ${targetAlarm.time} ${isActive ? 'activated' : 'deactivated'}`);
    }
}

/**
 * Initialize the app when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    renderAlarmList();
    
    // Log initial state for demonstration
    console.log('Alarm List App initialized with grouping system');
    console.log('Data structure:', alarmData);
});

/**
 * Future Enhancement Areas (for reference):
 * 
 * 1. Group Management:
 *    - Add function to create new groups
 *    - Add function to rename groups
 *    - Add function to delete groups
 *    - Add drag-and-drop to move alarms between groups
 * 
 * 2. Alarm Management:
 *    - Add function to create new alarms
 *    - Add function to edit existing alarms
 *    - Add function to delete alarms
 *    - Add time picker for setting alarm times
 *    - Add day selector for choosing which days alarm is active
 * 
 * 3. Persistence:
 *    - Save/load alarm data to/from localStorage
 *    - Export/import alarm configurations
 * 
 * 4. Advanced Features:
 *    - Snooze functionality
 *    - Different alarm sounds per alarm/group
 *    - Smart grouping based on time or frequency
 *    - Calendar integration
 */