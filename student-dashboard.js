document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is a student
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'student') {
        // Redirect to login if not logged in as student
        window.location.href = 'login.html';
        return;
    }

    // Display student info
    const studentInfo = document.getElementById('studentInfo');
    studentInfo.textContent = `${currentUser.name} (${currentUser.username})`;

    // Load attendance records
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    
    // Get students list
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const currentStudent = students.find(student => student.rollNumber === currentUser.username);
    
    if (!currentStudent) {
        console.error('Student record not found');
        return;
    }

    // Calculate attendance statistics
    const attendanceStats = calculateAttendanceStats(attendanceRecords, currentStudent.rollNumber);
    
    // Update dashboard stats
    updateDashboardStats(attendanceStats);
    
    // Setup calendar
    setupAttendanceCalendar(attendanceRecords, currentStudent.rollNumber);
    
    // Setup chart
    setupAttendanceChart(attendanceRecords, currentStudent.rollNumber);
    
    // Handle tab navigation
    setupTabNavigation();
});

function calculateAttendanceStats(attendanceRecords, rollNumber) {
    let totalClasses = 0;
    let present = 0;
    let absent = 0;
    
    // Calculate attendance
    Object.keys(attendanceRecords).forEach(date => {
        const record = attendanceRecords[date];
        if (record[rollNumber] !== undefined) {
            totalClasses++;
            if (record[rollNumber]) {
                present++;
            } else {
                absent++;
            }
        }
    });
    
    // Calculate percentage
    const percentage = totalClasses === 0 ? 0 : Math.round((present / totalClasses) * 100);
    
    // Determine status based on percentage
    let status = 'Good';
    let statusColor = '#2ecc71';
    
    if (percentage < 75) {
        status = 'Critical';
        statusColor = '#e74c3c';
    } else if (percentage < 85) {
        status = 'Warning';
        statusColor = '#f39c12';
    }
    
    return {
        totalClasses,
        present,
        absent,
        percentage,
        status,
        statusColor
    };
}

function updateDashboardStats(stats) {
    document.getElementById('overallAttendance').textContent = `${stats.present}/${stats.totalClasses}`;
    document.getElementById('attendancePercentage').textContent = `${stats.percentage}%`;
    document.getElementById('classesMissed').textContent = stats.absent;
    
    const statusIndicator = document.getElementById('statusIndicator');
    statusIndicator.textContent = stats.status;
    statusIndicator.style.backgroundColor = stats.statusColor;
    statusIndicator.style.color = 'white';
    statusIndicator.style.padding = '0.5rem 1rem';
    statusIndicator.style.borderRadius = '5px';
    statusIndicator.style.display = 'inline-block';
    
    // Set trends info
    const trendsInfo = document.getElementById('trendsInfo');
    if (stats.totalClasses === 0) {
        trendsInfo.textContent = 'No attendance records found yet.';
    } else if (stats.percentage < 75) {
        trendsInfo.textContent = 'Your attendance is below the required minimum of 75%. Please improve your attendance to avoid complications.';
        trendsInfo.style.color = '#e74c3c';
    } else if (stats.percentage < 85) {
        trendsInfo.textContent = 'Your attendance is above the minimum requirement, but try to attend more classes to be safe.';
        trendsInfo.style.color = '#f39c12';
    } else {
        trendsInfo.textContent = 'Great job! Your attendance is well above the required minimum.';
        trendsInfo.style.color = '#2ecc71';
    }
}

function setupAttendanceCalendar(attendanceRecords, rollNumber) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    
    function renderCalendar(month, year) {
        // Update month display
        currentMonthElement.textContent = `${months[month]} ${year}`;
        
        // Clear grid
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and total days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before first of month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day';
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Check if date has attendance record
            if (attendanceRecords[dateStr] && attendanceRecords[dateStr][rollNumber] !== undefined) {
                if (attendanceRecords[dateStr][rollNumber]) {
                    dayCell.classList.add('present');
                    dayCell.title = 'Present';
                } else {
                    dayCell.classList.add('absent');
                    dayCell.title = 'Absent';
                }
            }
            
            // Add date number
            const dateNumber = document.createElement('span');
            dateNumber.className = 'date-number';
            dateNumber.textContent = day;
            dayCell.appendChild(dateNumber);
            
            calendarGrid.appendChild(dayCell);
        }
        
        // Add styles
        calendarGrid.style.display = 'grid';
        calendarGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        calendarGrid.style.gap = '5px';
        calendarGrid.style.marginTop = '1rem';
        
        const dayElements = document.querySelectorAll('.day');
        dayElements.forEach(day => {
            day.style.height = '40px';
            day.style.display = 'flex';
            day.style.alignItems = 'center';
            day.style.justifyContent = 'center';
            day.style.borderRadius = '5px';
            day.style.backgroundColor = '#f8f9fa';
        });
        
        const presentDays = document.querySelectorAll('.day.present');
        presentDays.forEach(day => {
            day.style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
            day.style.color = '#27ae60';
            day.style.fontWeight = 'bold';
        });
        
        const absentDays = document.querySelectorAll('.day.absent');
        absentDays.forEach(day => {
            day.style.backgroundColor = 'rgba(231, 76, 60, 0.2)';
            day.style.color = '#c0392b';
            day.style.fontWeight = 'bold';
        });
        
        const dayHeaders = document.querySelectorAll('.day-header');
        dayHeaders.forEach(header => {
            header.style.fontWeight = 'bold';
            header.style.padding = '0.5rem 0';
            header.style.textAlign = 'center';
        });
    }
    
    // Initial render
    renderCalendar(currentMonth, currentYear);
    
    // Previous month button
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    // Next month button
    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
}

function setupAttendanceChart(attendanceRecords, rollNumber) {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // Get the last 10 attendance dates
    const dates = Object.keys(attendanceRecords)
        .filter(date => attendanceRecords[date][rollNumber] !== undefined)
        .sort((a, b) => new Date(a) - new Date(b))
        .slice(-10);
    
    const attendanceData = dates.map(date => ({
        date: date,
        status: attendanceRecords[date][rollNumber] ? 1 : 0
    }));
    
    // Format dates for display
    const formatDateLabel = (dateStr) => {
        const date = new Date(dateStr);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };
    
    const chartLabels = attendanceData.map(item => formatDateLabel(item.date));
    const chartData = attendanceData.map(item => item.status);
    
    // Create chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Attendance',
                data: chartData,
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: '#3498db',
                borderWidth: 2,
                pointBackgroundColor: chartData.map(value => value === 1 ? '#2ecc71' : '#e74c3c'),
                pointBorderColor: '#fff',
                pointRadius: 6,
                pointHoverRadius: 8,
                tension: 0.1,
                stepped: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            return value === 1 ? 'Present' : 'Absent';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw === 1 ? 'Present' : 'Absent';
                        }
                    }
                }
            }
        }
    });
}

function setupTabNavigation() {
    const navLinks = document.querySelectorAll('.dashboard-nav a');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show target section
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).style.display = 'block';
            
            // Smooth animation
            document.querySelector(targetId).style.animation = 'fadeIn 0.5s ease-out';
        });
    });
}

// Add event listener to the logout button
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.querySelector('.logout a');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent the default link behavior
            
            // Clear any stored session data
            localStorage.removeItem('studentData');
            localStorage.removeItem('currentUser');
            sessionStorage.clear();
            
            // Redirect to login page
            window.location.href = 'login.html';
        });
    }
});