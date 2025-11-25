const API_URL = 'http://localhost:3000/api/users'; 


const fetchUsersAndRender = () => {
    if (document.getElementById('userListBody')) {
        fetchUsers();
    }
}


const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phoneNumber').value.trim();
        const address = document.getElementById('address').value.trim();
        const dob = document.getElementById('notes').value;

       
        if (fullName.length < 3) {
            alert("Full Name must be at least 3 characters.");
            return;
        }

        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Enter a valid email address.");
            return;
        }

        
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phone)) {
            alert("Phone Number must be exactly 10 digits.");
            return;
        }

        
        
        if (address.length < 5) {
            alert("Address must be at least 5 characters long.");
            return;
        }

        
        
        if (!dob) {
            alert("Please select a Date of Birth.");
            return;
        }

        
        
        let selected = new Date(dob);
        let today = new Date();
        if (selected > today) {
            alert("Date of Birth cannot be in the future.");
            return;
        }
        // -----------------------------------------------------------

        const formData = new FormData(registrationForm);
        const userData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert('User registered successfully!');
                registrationForm.reset();
            } else if (response.status === 400) {
                const error = await response.json();
                alert(`Registration failed: ${error.message}`);
            } else {
                alert('An unexpected error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server. Check if the backend is running on port 3000.');
        }
    });
}


const userListBody = document.getElementById('userListBody');


async function fetchUsers() {
    if (!userListBody) return; 

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();

        userListBody.innerHTML = ''; 
        users.forEach(user => {
            const row = userListBody.insertRow();
            row.id = user.id; 

            
            row.insertCell().textContent = user.fullName;
            row.insertCell().textContent = user.email;
            row.insertCell().textContent = user.phoneNumber;
            row.insertCell().textContent = user.address;
            row.insertCell().textContent = user.notes || 'N/A';
            
            
            const actionsCell = row.insertCell();
            
            
            const updateBtn = document.createElement('button');
            updateBtn.className = 'update-btn';
            updateBtn.textContent = 'Update';
            updateBtn.onclick = () => openUpdateModal(user);
            
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteUser(user.id);

            actionsCell.appendChild(updateBtn);
            actionsCell.appendChild(deleteBtn);
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        userListBody.innerHTML = `<tr><td colspan="6">Failed to load users. Is the backend server running?</td></tr>`;
    }
}


async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('User deleted successfully!');
            fetchUsers(); 
        } else {
            alert('Failed to delete user.');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to connect to the server.');
    }
}


const modal = document.getElementById('updateModal');
const closeBtn = document.getElementsByClassName('close')[0];
const updateForm = document.getElementById('updateForm');


function openUpdateModal(user) {
    document.getElementById('updateUserId').value = user.id;
    document.getElementById('updateFullName').value = user.fullName;
    document.getElementById('updateEmail').value = user.email;
    document.getElementById('updatePhoneNumber').value = user.phoneNumber;
    document.getElementById('updateAddress').value = user.address;
    document.getElementById('updateNotes').value = user.notes || ''; 

    modal.style.display = 'block';
}


closeBtn.onclick = function() { modal.style.display = 'none'; }
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}


if (updateForm) {
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('updateUserId').value;
        const formData = new FormData(updateForm);
        const userData = Object.fromEntries(formData.entries());
        delete userData.updateUserId; 

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert('User updated successfully!');
                modal.style.display = 'none';
                fetchUsers();
            } else {
                const error = await response.json();
                alert(`Update failed: ${error.message}`);
            }
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to connect to the server.');
        }
    });
}


window.onload = fetchUsersAndRender;
