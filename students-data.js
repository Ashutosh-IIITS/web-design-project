// Student data initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check if students data already exists in localStorage
    if (!localStorage.getItem('students')) {
        // Define the list of students
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
        
        // Add course and semester information to each student
        const studentsWithDetails = students.map(student => {
            return {
                ...student,
                course: "B.Tech CSE",
                semester: 5
            };
        });
        
        // Store in localStorage
        localStorage.setItem('students', JSON.stringify(studentsWithDetails));
        console.log('Student data initialized successfully');
    } else {
        console.log('Student data already exists in localStorage');
    }
});