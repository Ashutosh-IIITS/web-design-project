document.addEventListener('DOMContentLoaded', function() {
    // Initialize student data
    if (!localStorage.getItem('students')) {
        const students = [ 
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
        
        const studentsWithDetails = students.map(student => {
            return {
                ...student,
                course: "B.Tech CSE",
                semester: 5
            };
        });
        
        localStorage.setItem('students', JSON.stringify(studentsWithDetails));
        console.log('Student data initialized successfully');
    }
    
    // For debugging - log the students data to console
    console.log('Students in localStorage:', JSON.parse(localStorage.getItem('students')));
    
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const role = document.getElementById('role').value;
            
            console.log('Login attempt:', { username, password, role });
            
            // Validate inputs
            if (!username || !password || !role) {
                alert('Please fill in all fields');
                return;
            }
            
            // Handle different role logins
            if (role === 'professor') {
                // Professor login
                if (username === 'professor' && password === 'professor123') {
                    // Store user info in localStorage
                    const user = {
                        username: username,
                        name: 'Professor',
                        role: 'professor'
                    };
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    
                    // Redirect to professor dashboard
                    window.location.href = 'professor-dashboard.html';
                } else {
                    alert('Invalid professor credentials');
                }
            } else if (role === 'student') {
                // Student login logic
                const students = JSON.parse(localStorage.getItem('students')) || [];
                console.log('Looking for student with roll number:', username);
                
                const student = students.find(s => s.rollNumber === username);
                console.log('Found student:', student);
                
                if (student) {
                    // Generate expected password: first 3 letters of name + last 2 digits of roll number
                    const namePrefix = student.name.substring(0, 3).toLowerCase();
                    const rollSuffix = student.rollNumber.slice(-2);
                    const expectedPassword = namePrefix + rollSuffix;
                    
                    console.log('Expected password:', expectedPassword);
                    
                    // For testing purposes, also allow a simple password
                    if (password === expectedPassword || password === 'student123') {
                        // Store user info in localStorage
                        const user = {
                            username: username,
                            name: student.name,
                            role: 'student',
                            course: student.course,
                            semester: student.semester
                        };
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        
                        // Redirect to student dashboard
                        window.location.href = 'student-dashboard.html';
                    } else {
                        alert('Invalid password. Hint: first 3 letters of your name + last 2 digits of your roll number (e.g., for Ashutosh Maurya with roll number 12413043, password would be "ash43")');
                    }
                } else {
                    alert('Student not found. Please check your roll number.');
                }
            } else if (role === 'admin') {
                // Admin login
                if (username === 'admin' && password === 'admin123') {
                    // Store user info in localStorage
                    const user = {
                        username: username,
                        name: 'Administrator',
                        role: 'admin'
                    };
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    
                    // Redirect to admin dashboard
                    window.location.href = 'admin-dashboard.html';
                } else {
                    alert('Invalid admin credentials');
                }
            } else if (role === 'cr') {
                // CR login logic
                if (username === 'cr' && password === 'cr123') {
                    // Store user info in localStorage
                    const user = {
                        username: username,
                        name: 'Class Representative',
                        role: 'cr'
                    };
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    
                    // Redirect to CR dashboard
                    window.location.href = 'cr-dashboard.html';
                } else {
                    alert('Invalid CR credentials');
                }
            }
        });
    } else {
        console.error('Login form not found on this page');
    }
});