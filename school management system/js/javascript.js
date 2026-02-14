
let students = [];
let classes = [];
let attendance = [];


function loadFromLocalStorage() {
    
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
        students = JSON.parse(storedStudents);
    } else {
        students = [];
    }
    
    
    const storedClasses = localStorage.getItem('classes');
    if (storedClasses) {
        classes = JSON.parse(storedClasses);
    } else {
        classes = [];
    }
    
   
    const storedAttendance = localStorage.getItem('attendance');
    if (storedAttendance) {
        attendance = JSON.parse(storedAttendance);
    } else {
        attendance = [];
    }
}


function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('classes', JSON.stringify(classes));
    localStorage.setItem('attendance', JSON.stringify(attendance));
}


function initializeSampleData() {
    
    if (classes.length === 0) {
        classes = [
            { id: 1, name: 'Class 10', section: 'A' },
            { id: 2, name: 'Class 9', section: 'B' },
            { id: 3, name: 'Class 8', section: 'C' }
        ];
        saveToLocalStorage();
    }
    
    
    if (students.length === 0) {
        students = [
            { 
                id: Date.now() + 1, 
                name: 'Ali Khan', 
                fatherName: 'Ahmed Khan', 
                className: 'Class 10', 
                rollNumber: 101, 
                phone: '03001234567', 
                address: 'Karachi' 
            },
            { 
                id: Date.now() + 2, 
                name: 'Sara Ali', 
                fatherName: 'Ali Raza', 
                className: 'Class 9', 
                rollNumber: 201, 
                phone: '03007654321', 
                address: 'Lahore' 
            },
            { 
                id: Date.now() + 3, 
                name: 'Bilal Ahmed', 
                fatherName: 'Mohammad Ahmed', 
                className: 'Class 8', 
                rollNumber: 301, 
                phone: '03005555555', 
                address: 'Islamabad' 
            }
        ];
        saveToLocalStorage();
    }
}


loadFromLocalStorage();
initializeSampleData();


function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = type === 'success' ? '#10b981' : '#ef4444';
    toast.style.color = 'white';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}


function showMessage(elementId, message, type) {
    const msgDiv = document.getElementById(elementId);
    if (msgDiv) {
        msgDiv.textContent = message;
        msgDiv.className = `message ${type}`;
        msgDiv.style.display = 'block';
        
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 3000);
    }
}


function showSection(sectionId) {
    
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    
    document.getElementById(sectionId).classList.add('active');
    
   
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.textContent.includes(sectionId.charAt(0).toUpperCase() + sectionId.slice(1))) {
            item.classList.add('active');
        }
    });
    
    
    if (sectionId === 'dashboard') {
        updateDashboard();
    } else if (sectionId === 'students') {
        loadStudents();
        loadClassDropdowns();
    } else if (sectionId === 'classes') {
        loadClasses();
    } else if (sectionId === 'attendance') {
        loadAttendanceClasses();
        setDefaultDate();
    }
}


function updateDashboard() {
    document.getElementById('totalStudents').innerHTML = students.length;
    document.getElementById('totalClasses').innerHTML = classes.length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
    
    document.getElementById('todayAttendance').innerHTML = todayAttendance.length;
    document.getElementById('presentToday').innerHTML = presentCount;
}


document.addEventListener('DOMContentLoaded', function() {
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
           
            const studentName = document.getElementById('studentName').value;
            const fatherName = document.getElementById('fatherName').value;
            const studentClass = document.getElementById('studentClass').value;
            const rollNumber = document.getElementById('rollNumber').value;
            const studentPhone = document.getElementById('studentPhone').value;
            const studentAddress = document.getElementById('studentAddress').value;
            
            
            if (!studentName || !fatherName || !studentClass || !rollNumber || !studentPhone || !studentAddress) {
                showMessage('studentMessage', 'Please fill all fields!', 'error');
                return;
            }
            
           
            const existingStudent = students.find(s => 
                s.rollNumber == rollNumber && s.className === studentClass
            );
            
            if (existingStudent) {
                showMessage('studentMessage', '❌ Roll number already exists in this class!', 'error');
                return;
            }
            
            
            const newStudent = {
                id: Date.now(),
                name: studentName,
                fatherName: fatherName,
                className: studentClass,
                rollNumber: parseInt(rollNumber),
                phone: studentPhone,
                address: studentAddress
            };
            
          
            students.push(newStudent);
            
           
            saveToLocalStorage();
            
          
            showMessage('studentMessage', '✅ Student added successfully!', 'success');
            showToast('Student added successfully!');
            
            
            this.reset();
            
            
            loadStudents();
            
            
            updateDashboard();
        });
    }
});


function loadStudents() {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">📝 No students found. Add your first student!</td></tr>';
        return;
    }
    
    
    students.sort((a, b) => {
        if (a.className === b.className) {
            return a.rollNumber - b.rollNumber;
        }
        return a.className.localeCompare(b.className);
    });
    
    students.forEach(student => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td><strong>${student.rollNumber}</strong></td>
            <td>${student.name}</td>
            <td>${student.fatherName}</td>
            <td><span class="badge">${student.className}</span></td>
            <td>${student.phone}</td>
            <td>${student.address}</td>
            <td>
                <button class="btn-edit" onclick="editStudent(${student.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
    });
    
  
    const studentCount = document.getElementById('studentCount');
    if (studentCount) {
        studentCount.innerHTML = `${students.length} Students`;
    }
}


function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== id);
        saveToLocalStorage();
        loadStudents();
        updateDashboard();
        showToast('Student deleted successfully!');
    }
}


function editStudent(id) {
    const student = students.find(s => s.id === id);
    
    if (student) {
        document.getElementById('editStudentId').value = student.id;
        document.getElementById('editName').value = student.name;
        document.getElementById('editFatherName').value = student.fatherName;
        document.getElementById('editRollNumber').value = student.rollNumber;
        document.getElementById('editPhone').value = student.phone;
        document.getElementById('editAddress').value = student.address;
        
        loadEditClassDropdown();
        
        setTimeout(() => {
            document.getElementById('editClass').value = student.className;
        }, 100);
        
        document.getElementById('editModal').style.display = 'flex';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const editForm = document.getElementById('editStudentForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = parseInt(document.getElementById('editStudentId').value);
            const index = students.findIndex(s => s.id === id);
            
            if (index !== -1) {
                students[index] = {
                    ...students[index],
                    name: document.getElementById('editName').value,
                    fatherName: document.getElementById('editFatherName').value,
                    className: document.getElementById('editClass').value,
                    rollNumber: parseInt(document.getElementById('editRollNumber').value),
                    phone: document.getElementById('editPhone').value,
                    address: document.getElementById('editAddress').value
                };
                
                saveToLocalStorage();
                closeModal();
                loadStudents();
                showToast('Student updated successfully!');
            }
        });
    }
});


function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}


window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
}



document.addEventListener('DOMContentLoaded', function() {
    const classForm = document.getElementById('classForm');
    if (classForm) {
        classForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const className = document.getElementById('className').value;
            const classSection = document.getElementById('classSection').value || 'A';
            
            if (!className) {
                showMessage('classMessage', 'Please enter class name!', 'error');
                return;
            }
            
           
            const existingClass = classes.find(c => 
                c.name === className && c.section === classSection
            );
            
            if (existingClass) {
                showMessage('classMessage', '❌ Class already exists!', 'error');
                return;
            }
            
           
            classes.push({
                id: Date.now(),
                name: className,
                section: classSection
            });
            
            saveToLocalStorage();
            
            showMessage('classMessage', '✅ Class added successfully!', 'success');
            showToast('Class added successfully!');
            
            this.reset();
            loadClasses();
            loadClassDropdowns();
            loadAttendanceClasses();
            updateDashboard();
        });
    }
});


function loadClasses() {
    const tbody = document.getElementById('classTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (classes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 30px;">📚 No classes found. Add your first class!</td></tr>';
        return;
    }
    
    classes.forEach(cls => {
        const studentCount = students.filter(s => s.className === cls.name).length;
        const row = tbody.insertRow();
        row.innerHTML = `
            <td><strong>${cls.name}</strong></td>
            <td>${cls.section}</td>
            <td><span class="badge">${studentCount} students</span></td>
            <td>
                <button class="btn-delete" onclick="deleteClass(${cls.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
    });
    
    
    const classCount = document.getElementById('classCount');
    if (classCount) {
        classCount.innerHTML = `${classes.length} Classes`;
    }
}


function deleteClass(id) {
    const cls = classes.find(c => c.id === id);
    const studentCount = students.filter(s => s.className === cls.name).length;
    
    if (studentCount > 0) {
        alert(`❌ Cannot delete! ${studentCount} students are enrolled in this class.`);
        return;
    }
    
    if (confirm('Are you sure you want to delete this class?')) {
        classes = classes.filter(c => c.id !== id);
        saveToLocalStorage();
        loadClasses();
        loadClassDropdowns();
        loadAttendanceClasses();
        updateDashboard();
        showToast('Class deleted successfully!');
    }
}


function loadClassDropdowns() {
    const select = document.getElementById('studentClass');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Class</option>';
    
    classes.forEach(cls => {
        select.innerHTML += `<option value="${cls.name}">${cls.name} - ${cls.section}</option>`;
    });
}

function loadEditClassDropdown() {
    const select = document.getElementById('editClass');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Class</option>';
    
    classes.forEach(cls => {
        select.innerHTML += `<option value="${cls.name}">${cls.name} - ${cls.section}</option>`;
    });
}

function loadAttendanceClasses() {
    const select = document.getElementById('attendanceClass');
    if (!select) return;
    
    select.innerHTML = '<option value="">Select Class</option>';
    
    classes.forEach(cls => {
        select.innerHTML += `<option value="${cls.name}">${cls.name} - ${cls.section}</option>`;
    });
}


function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    const attendanceDate = document.getElementById('attendanceDate');
    if (attendanceDate) {
        attendanceDate.value = today;
    }
}

function loadStudentsForAttendance() {
    const className = document.getElementById('attendanceClass').value;
    const date = document.getElementById('attendanceDate').value;
    
    if (!className || !date) {
        alert('⚠️ Please select both class and date!');
        return;
    }
    
    const classStudents = students.filter(s => s.className === className);
    
    if (classStudents.length === 0) {
        alert('❌ No students found in this class!');
        return;
    }
    
    const tbody = document.getElementById('attendanceTableBody');
    tbody.innerHTML = '';
    
    classStudents.sort((a, b) => a.rollNumber - b.rollNumber).forEach(student => {
        const existing = attendance.find(a => a.studentId === student.id && a.date === date);
        const status = existing ? existing.status : 'Present';
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${student.rollNumber}</td>
            <td>${student.name}</td>
            <td>${student.fatherName}</td>
            <td>
                <label style="margin-right: 20px; cursor: pointer;">
                    <input type="radio" name="attendance_${student.id}" value="Present" ${status === 'Present' ? 'checked' : ''}> 
                    <span style="color: #10b981;">Present</span>
                </label>
                <label style="cursor: pointer;">
                    <input type="radio" name="attendance_${student.id}" value="Absent" ${status === 'Absent' ? 'checked' : ''}> 
                    <span style="color: #ef4444;">Absent</span>
                </label>
            </td>
        `;
    });
    
    document.getElementById('attendanceSection').style.display = 'block';
}

function markAllPresent() {
    const className = document.getElementById('attendanceClass').value;
    const classStudents = students.filter(s => s.className === className);
    
    classStudents.forEach(student => {
        const radios = document.getElementsByName(`attendance_${student.id}`);
        radios.forEach(radio => {
            if (radio.value === 'Present') {
                radio.checked = true;
            }
        });
    });
}

function markAllAbsent() {
    const className = document.getElementById('attendanceClass').value;
    const classStudents = students.filter(s => s.className === className);
    
    classStudents.forEach(student => {
        const radios = document.getElementsByName(`attendance_${student.id}`);
        radios.forEach(radio => {
            if (radio.value === 'Absent') {
                radio.checked = true;
            }
        });
    });
}

function saveAttendance() {
    const className = document.getElementById('attendanceClass').value;
    const date = document.getElementById('attendanceDate').value;
    
    if (!className || !date) {
        alert('Please select class and date!');
        return;
    }
    
    
    attendance = attendance.filter(a => !(a.date === date && a.className === className));
    
   
    const classStudents = students.filter(s => s.className === className);
    
    classStudents.forEach(student => {
        const radios = document.getElementsByName(`attendance_${student.id}`);
        let status = 'Present';
        
        radios.forEach(radio => {
            if (radio.checked) {
                status = radio.value;
            }
        });
        
        attendance.push({
            id: Date.now() + student.id,
            studentId: student.id,
            studentName: student.name,
            rollNumber: student.rollNumber,
            className: className,
            date: date,
            status: status
        });
    });
    
    
    saveToLocalStorage();
    
    showMessage('attendanceMessage', '✅ Attendance saved successfully!', 'success');
    showToast('Attendance saved successfully!');
    
    
    updateDashboard();
}


document.addEventListener('DOMContentLoaded', function() {
    
    updateDashboard();
    loadStudents();
    loadClasses();
    loadClassDropdowns();
    loadAttendanceClasses();
    setDefaultDate();
    
    console.log('✅ School Management System Ready!');
    console.log(`📊 Students: ${students.length}, Classes: ${classes.length}`);
});