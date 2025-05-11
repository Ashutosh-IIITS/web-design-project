// Clear all existing data immediately
localStorage.clear();
let students = [
    { rollNumber: "12413001", name: "Saransh Umrao" },
    { rollNumber: "12413002", name: "Rudra Pratap Singh Rana" },
    { rollNumber: "12413003", name: "Samarth Srivastava" },
    { rollNumber: "12413004", name: "Ayush Kumar" },
    { rollNumber: "12413005", name: "Divyanshu Singh Chauhan" },
    { rollNumber: "12413006", name: "Shivansh Khandelwal" },
    { rollNumber: "12413007", name: "Madhav Arora" },
    { rollNumber: "12413008", name: "Mohd Farhan" },
    { rollNumber: "12413009", name: "Mannu" },
    { rollNumber: "12413010", name: "Vyom Dubey" },
    { rollNumber: "12413011", name: "Saksham Mawari" },
    { rollNumber: "12413012", name: "Abhishek Kumar" },
    { rollNumber: "12413013", name: "Dev Gupta" },
    { rollNumber: "12413014", name: "Vaibhav Chauhan" },
    { rollNumber: "12413015", name: "Bhavuk Diwakar" },
    { rollNumber: "12413016", name: "Abhi Mishra" },
    { rollNumber: "12413017", name: "Sirigiri Venkateswara Aditya" },
    { rollNumber: "12413018", name: "Amar Kumawat" },
    { rollNumber: "12413019", name: "Satyam Vohra" },
    { rollNumber: "12413020", name: "Manasvee Jain" },
    { rollNumber: "12413021", name: "Bhupendra Singh Jakhar" },
    { rollNumber: "12413022", name: "Suraj Tiwari" },
    { rollNumber: "12413023", name: "Aditya Pandey" },
    { rollNumber: "12413024", name: "Hitesh Kumar" },
    { rollNumber: "12413025", name: "Gautam" },
    { rollNumber: "12413026", name: "Ranveer" },
    { rollNumber: "12413027", name: "Jitesh Kumar" },
    { rollNumber: "12413028", name: "Manik" },
    { rollNumber: "12413029", name: "Saksham" },
    { rollNumber: "12413030", name: "Divyanshu Kumar" },
    { rollNumber: "12413031", name: "Shashwat Singh" },
    { rollNumber: "12413032", name: "Kushagra Agrawal" },
    { rollNumber: "12413033", name: "Aryaveer" },
    { rollNumber: "12413034", name: "Vedant Jaiswal" },
    { rollNumber: "12413035", name: "Vishvesh Mishra" },
    { rollNumber: "12413036", name: "Tejas Singh Bhati" },
    { rollNumber: "12413037", name: "Anshuman Shukla" },
    { rollNumber: "12413038", name: "Yomendra Singh Dhruwe" },
    { rollNumber: "12413039", name: "Ankit Vishwakarma" },
    { rollNumber: "12413040", name: "Avi Trivedi" },
    { rollNumber: "12413041", name: "Ananya Singh" },
    { rollNumber: "12413042", name: "Nayan Prakash" },
    { rollNumber: "12413043", name: "Ashutosh Maurya" },
    { rollNumber: "12413044", name: "Chirag Mali" },
    { rollNumber: "12413045", name: "Vijendra Mahawar" },
    { rollNumber: "12413046", name: "Ayush Ranjan" },
    { rollNumber: "12413047", name: "Purav" },
    { rollNumber: "12413048", name: "Ritesh Kumar" },
    { rollNumber: "12413049", name: "Ankit Meena" },
    { rollNumber: "12413050", name: "Aditya Jarwal" },
    { rollNumber: "12413051", name: "Abhishek Kumar" },
    { rollNumber: "12413052", name: "Aleru Raj Kumar" }
];
let attendanceRecords = {};

// DOM Elements
const studentForm = document.getElementById('studentForm');
const studentNameInput = document.getElementById('studentName');
const rollNumberInput = document.getElementById('rollNumber');
const studentList = document.getElementById('studentList');
const attendanceDate = document.getElementById('attendanceDate');
const saveAttendanceBtn = document.getElementById('saveAttendance');
const attendanceRecordsDiv = document.getElementById('attendanceRecords');
const topPerformersDiv = document.getElementById('topPerformers');
const exportCSVBtn = document.getElementById('exportCSV');
const clearRecordsBtn = document.getElementById('clearRecords');
const quickRollNumberInput = document.getElementById('quickRollNumber');
const studentNameDisplay = document.getElementById('studentNameDisplay');

// Set today's date as default
attendanceDate.valueAsDate = new Date();

// Format date to dd/mm/yyyy
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Calculate attendance percentage for a student
function calculateAttendancePercentage(student) {
    if (Object.keys(attendanceRecords).length === 0) return 0;
    
    let present = 0;
    let total = 0;
    
    Object.values(attendanceRecords).forEach(record => {
        if (record[student.rollNumber] !== undefined) {
            total++;
            if (record[student.rollNumber]) present++;
        }
    });
    
    return total === 0 ? 0 : Math.round((present / total) * 100);
}

// Update top performers display
function updateTopPerformers() {
    const sortedStudents = [...students].sort((a, b) => 
        calculateAttendancePercentage(b) - calculateAttendancePercentage(a)
    ).slice(0, 3);

    topPerformersDiv.innerHTML = sortedStudents.map((student, index) => `
        <div class="top-performer-card">
            <div class="rank">#${index + 1}</div>
            <div class="name">${student.name}</div>
            <div class="roll-number">${student.rollNumber}</div>
            <div class="percentage">${calculateAttendancePercentage(student)}%</div>
        </div>
    `).join('');
}

// Add student form submission
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = studentNameInput.value.trim();
    const rollNumber = rollNumberInput.value.trim();
    
    // Validate that roll number contains only numbers
    if (!/^\d+$/.test(rollNumber)) {
        alert('Roll number must contain only numbers');
        return;
    }
    
    if (name && rollNumber && !students.some(s => s.rollNumber === rollNumber)) {
        students.push({ name, rollNumber });
        localStorage.setItem('students', JSON.stringify(students));
        studentNameInput.value = '';
        rollNumberInput.value = '';
        updateStudentList();
        updateTopPerformers();
    } else if (students.some(s => s.rollNumber === rollNumber)) {
        alert('This roll number is already registered');
    }
});

// Update student list display
function updateStudentList() {
    studentList.innerHTML = '';
    students.sort((a, b) => a.rollNumber - b.rollNumber).forEach((student, index) => {
        const div = document.createElement('div');
        div.className = 'student-item';
        div.innerHTML = `
            <div class="serial-number" title="Serial Number">${index + 1}</div>
            <div class="roll-number" title="${student.rollNumber}">${student.rollNumber}</div>
            <div class="student-name" title="${student.name}">${student.name}</div>
            <input type="checkbox" id="${student.rollNumber}" name="attendance">
        `;
        
        // Add click event listener to the entire row
        div.addEventListener('click', (e) => {
            // Don't toggle if clicking the checkbox directly
            if (e.target.type === 'checkbox') return;
            
            const checkbox = div.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            
            // Update visual state
            div.classList.remove('present', 'absent');
            div.classList.add(checkbox.checked ? 'present' : 'absent');
        });
        
        studentList.appendChild(div);
    });
}

// Save attendance
saveAttendanceBtn.addEventListener('click', () => {
    const date = attendanceDate.value;
    if (!date) {
        alert('Please select a date');
        return;
    }

    // Check if attendance for this date already exists
    if (attendanceRecords[date]) {
        alert('Attendance for this date has already been saved and cannot be modified.');
        return;
    }

    const attendance = {};
    students.forEach(student => {
        const checkbox = document.getElementById(student.rollNumber);
        attendance[student.rollNumber] = checkbox.checked;
    });

    attendanceRecords[date] = attendance;
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    updateAttendanceRecords();
    updateTopPerformers();
    alert('Attendance saved successfully!');
});

// Update attendance records display
function updateAttendanceRecords() {
    const sortedStudents = students.sort((a, b) => a.rollNumber - b.rollNumber);
    const sortedDates = Object.keys(attendanceRecords).sort((a, b) => new Date(b) - new Date(a));
    
    // Calculate total present for each date
    const totalPresent = {};
    sortedDates.forEach(date => {
        totalPresent[date] = Object.values(attendanceRecords[date]).filter(present => present).length;
    });

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>S.No</th>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Attendance %</th>
                ${sortedDates.map(date => `<th>${formatDate(date)}</th>`).join('')}
            </tr>
        </thead>
        <tbody>
            ${sortedStudents.map((student, index) => {
                const attendancePercentage = calculateAttendancePercentage(student);
                const colorClass = attendancePercentage >= 75 ? 'attendance-high' : 
                                 attendancePercentage >= 50 ? 'attendance-medium' : 
                                 'attendance-low';
                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${student.rollNumber}</td>
                        <td>${student.name}</td>
                        <td class="percentage-column ${colorClass}">${attendancePercentage}%</td>
                        ${sortedDates.map(date => `
                            <td>${attendanceRecords[date][student.rollNumber] ? '✓' : '✗'}</td>
                        `).join('')}
                    </tr>
                `;
            }).join('')}
            <tr class="total-row">
                <td colspan="3"><strong>Total Present</strong></td>
                <td>-</td>
                ${sortedDates.map(date => `
                    <td><strong>${totalPresent[date]}/${students.length}</strong></td>
                `).join('')}
            </tr>
        </tbody>
    `;
    attendanceRecordsDiv.innerHTML = '';
    attendanceRecordsDiv.appendChild(table);
}

// Export to CSV
exportCSVBtn.addEventListener('click', () => {
    const sortedStudents = students.sort((a, b) => a.rollNumber - b.rollNumber);
    const csvContent = [
        ['S.No', 'Roll Number', 'Name', 'Attendance %', ...Object.keys(attendanceRecords)
            .sort((a, b) => new Date(b) - new Date(a))
            .map(date => formatDate(date))],
        ...sortedStudents.map((student, index) => [
            index + 1,
            student.rollNumber,
            student.name,
            `${calculateAttendancePercentage(student)}%`,
            ...Object.keys(attendanceRecords)
                .sort((a, b) => new Date(b) - new Date(a))
                .map(date => attendanceRecords[date][student.rollNumber] ? 'Present' : 'Absent')
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'attendance_records.csv';
    link.click();
});

// Clear records
clearRecordsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all attendance records?')) {
        attendanceRecords = {};
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        updateAttendanceRecords();
        updateTopPerformers();
        alert('Attendance records cleared successfully!');
    }
});

// Quick attendance by roll number or serial number
quickRollNumberInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = quickRollNumberInput.value.trim();
        let student;

        // Check if input is a serial number (1-52)
        if (/^\d{1,2}$/.test(input) && parseInt(input) >= 1 && parseInt(input) <= 52) {
            const serialNumber = parseInt(input);
            student = students[serialNumber - 1]; // Arrays are 0-based, so subtract 1
        } else {
            // Try as roll number
            student = students.find(s => s.rollNumber === input);
        }
        
        if (student) {
            const checkbox = document.getElementById(student.rollNumber);
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                studentNameDisplay.textContent = `${student.name} (S.No: ${students.indexOf(student) + 1}) marked as ${checkbox.checked ? 'PRESENT' : 'ABSENT'}`;
                studentNameDisplay.className = checkbox.checked ? 'present' : 'absent';
                
                // Clear the input after 2 seconds
                setTimeout(() => {
                    quickRollNumberInput.value = '';
                    studentNameDisplay.textContent = '';
                }, 2000);
            }
        } else {
            studentNameDisplay.textContent = 'Student not found! Enter S.No (1-52) or Roll Number';
            studentNameDisplay.className = 'absent';
            
            // Clear the message after 2 seconds
            setTimeout(() => {
                studentNameDisplay.textContent = '';
                quickRollNumberInput.value = '';
            }, 2000);
        }
    }
});

// Initial setup
updateStudentList();
updateAttendanceRecords();
updateTopPerformers();