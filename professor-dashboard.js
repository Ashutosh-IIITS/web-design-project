document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is a professor
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'professor') {
        // Redirect to login if not logged in as professor
        window.location.href = 'login.html';
        return;
    }

    // Display professor info
    const professorInfo = document.getElementById('professorInfo');
    professorInfo.textContent = `Welcome, ${currentUser.name}`;

    // Load students list
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    // Load attendance records
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || {};
    
    // Initialize date picker with current date
    const attendanceDateInput = document.getElementById('attendanceDate');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    attendanceDateInput.value = formattedDate;
    
    // Populate student list for attendance marking
    populateStudentList(students);
    
    // Update statistics
    updateStatistics(students, attendanceRecords);
    
    // Update attendance records table
    updateAttendanceRecords(students, attendanceRecords);
    
    // Add event listeners
    setupEventListeners(students, attendanceRecords);
});

function populateStudentList(students) {
    const studentList = document.getElementById('studentAttendanceList');
    studentList.innerHTML = '';
    
    if (students.length === 0) {
        studentList.innerHTML = '<p class="no-data">No students found. Please add students first.</p>';
        return;
    }
    
    students.sort((a, b) => a.rollNumber - b.rollNumber).forEach(student => {
        const studentItem = document.createElement('div');
        studentItem.className = 'student-item';
        studentItem.innerHTML = `
            <div class="student-info">
                <span class="roll-number">${student.rollNumber}</span>
                <span class="student-name">${student.name}</span>
            </div>
            <div class="attendance-actions">
                <button class="present-btn" data-roll="${student.rollNumber}">Present</button>
                <button class="absent-btn" data-roll="${student.rollNumber}">Absent</button>
            </div>
        `;
        studentList.appendChild(studentItem);
    });
    
    // Add search functionality
    const searchInput = document.getElementById('searchStudent');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        document.querySelectorAll('.student-item').forEach(item => {
            const rollNumber = item.querySelector('.roll-number').textContent;
            const name = item.querySelector('.student-name').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || rollNumber.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

function setupEventListeners(students, attendanceRecords) {
    // Mark all present button
    document.getElementById('markAllPresent').addEventListener('click', function() {
        document.querySelectorAll('.student-item').forEach(item => {
            const presentBtn = item.querySelector('.present-btn');
            presentBtn.classList.add('active');
            item.querySelector('.absent-btn').classList.remove('active');
        });
    });
    
    // Mark all absent button
    document.getElementById('markAllAbsent').addEventListener('click', function() {
        document.querySelectorAll('.student-item').forEach(item => {
            const absentBtn = item.querySelector('.absent-btn');
            absentBtn.classList.add('active');
            item.querySelector('.present-btn').classList.remove('active');
        });
    });
    
    // Reset attendance button
    document.getElementById('resetAttendance').addEventListener('click', function() {
        document.querySelectorAll('.student-item').forEach(item => {
            item.querySelector('.present-btn').classList.remove('active');
            item.querySelector('.absent-btn').classList.remove('active');
        });
    });
    
    // Individual attendance buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('present-btn')) {
            e.target.classList.add('active');
            e.target.parentNode.querySelector('.absent-btn').classList.remove('active');
        } else if (e.target.classList.contains('absent-btn')) {
            e.target.classList.add('active');
            e.target.parentNode.querySelector('.present-btn').classList.remove('active');
        }
    });
    
    // Save attendance button
    document.getElementById('saveAttendance').addEventListener('click', function() {
        const date = document.getElementById('attendanceDate').value;
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        const dayAttendance = {};
        
        document.querySelectorAll('.student-item').forEach(item => {
            const rollNumber = item.querySelector('.roll-number').textContent;
            const isPresentActive = item.querySelector('.present-btn').classList.contains('active');
            const isAbsentActive = item.querySelector('.absent-btn').classList.contains('active');
            
            if (isPresentActive || isAbsentActive) {
                dayAttendance[rollNumber] = isPresentActive;
            }
        });
        
        if (Object.keys(dayAttendance).length === 0) {
            alert('No attendance marked');
            return;
        }
        
        // Update attendance records
        attendanceRecords[date] = dayAttendance;
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        
        // Update statistics and records
        updateStatistics(students, attendanceRecords);
        updateAttendanceRecords(students, attendanceRecords);
        
        alert('Attendance saved successfully');
    });
    
    // Filter records button
    document.getElementById('filterRecords').addEventListener('click', function() {
        updateAttendanceRecords(students, attendanceRecords);
    });
    
    // Export records button
    document.getElementById('exportRecords').addEventListener('click', function() {
        exportToExcel(students, attendanceRecords);
    });
}

function updateStatistics(students, attendanceRecords) {
    // Calculate class strength
    document.getElementById('classStrength').textContent = students.length;
    
    // Calculate average attendance
    let totalAttendancePercentage = 0;
    let lowAttendanceCount = 0;
    
    students.forEach(student => {
        const percentage = calculateAttendancePercentage(student, attendanceRecords);
        totalAttendancePercentage += percentage;
        
        if (percentage < 75) {
            lowAttendanceCount++;
        }
    });
    
    const averageAttendance = students.length > 0 ? Math.round(totalAttendancePercentage / students.length) : 0;
    document.getElementById('averageAttendance').textContent = `${averageAttendance}%`;
    document.getElementById('lowAttendance').textContent = lowAttendanceCount;
    
    // Create attendance chart
    createAttendanceChart(students, attendanceRecords);
}

function calculateAttendancePercentage(student, attendanceRecords) {
    let totalClasses = 0;
    let presentClasses = 0;
    
    Object.keys(attendanceRecords).forEach(date => {
        const record = attendanceRecords[date];
        if (record[student.rollNumber] !== undefined) {
            totalClasses++;
            if (record[student.rollNumber]) {
                presentClasses++;
            }
        }
    });
    
    return totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
}

function updateAttendanceRecords(students, attendanceRecords) {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    const recordsBody = document.getElementById('attendanceRecordsBody');
    recordsBody.innerHTML = '';
    
    if (students.length === 0) {
        recordsBody.innerHTML = '<tr><td colspan="7">No students found</td></tr>';
        return;
    }
    
    students.sort((a, b) => a.rollNumber - b.rollNumber).forEach(student => {
        let totalClasses = 0;
        let presentClasses = 0;
        
        Object.keys(attendanceRecords).forEach(date => {
            // Apply date filter if set
            if ((startDate && date < startDate) || (endDate && date > endDate)) {
                return;
            }
            
            const record = attendanceRecords[date];
            if (record[student.rollNumber] !== undefined) {
                totalClasses++;
                if (record[student.rollNumber]) {
                    presentClasses++;
                }
            }
        });
        
        const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
        let status = 'Good';
        let statusClass = 'status-good';
        
        if (percentage < 75) {
            status = 'Critical';
            statusClass = 'status-critical';
        } else if (percentage < 85) {
            status = 'Warning';
            statusClass = 'status-warning';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.rollNumber}</td>
            <td>${student.name}</td>
            <td>${totalClasses}</td>
            <td>${presentClasses}</td>
            <td>${totalClasses - presentClasses}</td>
            <td>${percentage}%</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
        `;
        recordsBody.appendChild(row);
    });
}

function createAttendanceChart(students, attendanceRecords) {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // Get attendance distribution
    const ranges = {
        '90-100%': 0,
        '75-89%': 0,
        '50-74%': 0,
        'Below 50%': 0
    };
    
    students.forEach(student => {
        const percentage = calculateAttendancePercentage(student, attendanceRecords);
        
        if (percentage >= 90) {
            ranges['90-100%']++;
        } else if (percentage >= 75) {
            ranges['75-89%']++;
        } else if (percentage >= 50) {
            ranges['50-74%']++;
        } else {
            ranges['Below 50%']++;
        }
    });
    
    // Check if chart already exists and destroy it
    if (window.attendanceChart) {
        window.attendanceChart.destroy();
    }
    
    // Create new chart
    window.attendanceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(ranges),
            datasets: [{
                data: Object.values(ranges),
                backgroundColor: [
                    '#27ae60',
                    '#2ecc71',
                    '#f39c12',
                    '#e74c3c'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Attendance Distribution'
                }
            }
        }
    });
}

function exportToExcel(students, attendanceRecords) {
    // This is a simplified version - in a real app, you'd use a library like SheetJS
    alert('Export functionality would generate an Excel file in a real application.');
}