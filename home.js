let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");
const dropdownParent = document.querySelector(".dropdown");
const dropdownBtn = document.querySelector(".dropdown-btn");


toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
  if (navigation.classList.contains("active") && dropdownParent) {
    dropdownParent.classList.remove("active");
  }
};
if (dropdownBtn) {
    dropdownBtn.addEventListener("click", function(event) {
        event.preventDefault();
        dropdownParent.classList.toggle("active");
    });
}


let navLinks = document.querySelectorAll(".navigation ul li a");

navLinks.forEach(link => {
    link.addEventListener("click", function(event) {

        if (this.classList.contains("dropdown-btn") || 
            this.classList.contains("reset-database-link") || 
            this.classList.contains("hard-reset-link")) {
            return; 
        }

        let href = this.getAttribute("href");

        if (href === "#") {
            event.preventDefault();
        }
        
  
        if (navigation.classList.contains("active")) {
            navigation.classList.remove("active");
            if(main) main.classList.remove("active");

            if (window.innerWidth > 991 && href !== "#") {
                event.preventDefault();
            }
        }
    });
});


const recordForm = document.getElementById("recordForm");
const recordTableBody = document.getElementById("recordTableBody");


function getAllWardData() {
    const wardKeys = ['ward_data_General', 'ward_data_ICU', 'ward_data_Maternity', 'ward_data_Paediatrics'];
    let allSlots = [];

    wardKeys.forEach(key => {
        const wardData = JSON.parse(localStorage.getItem(key));
        if (wardData) {
            allSlots = allSlots.concat(wardData);
        } else {

            const wardName = key.replace('ward_data_', '');
            for(let i=1; i<=4; i++) {
                allSlots.push({ id: i, ward: wardName, patient: null });
            }
        }
    });

    return allSlots;
}

function renderTable() {
    const recordTableBody = document.getElementById("recordTableBody");
    const totalReportsText = document.getElementById("total-reports");
    const totalSlotsText = document.getElementById("total-slots");
    
    if (!recordTableBody) return;
    
    recordTableBody.innerHTML = ""; 
    
    const statusPriority = {
        "critical": 1,
        "recovering": 2,
        "stable": 3,
        "discharged": 4
    };

    let allSlots = getAllWardData();

    const activePatients = allSlots.filter(slot => slot.patient !== null);
    const emptySlotsCount = allSlots.filter(slot => slot.patient === null).length;


    if (totalReportsText) {
        totalReportsText.innerText = activePatients.length;
    }
    if (totalSlotsText) {
        totalSlotsText.innerText = emptySlotsCount;
    }

    activePatients.sort((a, b) => {
        const statusA = a.patient.status.toLowerCase();
        const statusB = b.patient.status.toLowerCase();
        return (statusPriority[statusA] || 99) - (statusPriority[statusB] || 99);
    });

    activePatients.forEach(slot => {
        const p = slot.patient;
        const newRow = document.createElement("tr");
        
        newRow.innerHTML = `
            <td style="text-align: center; font-weight: 500;">${slot.ward}</td>
            <td style="text-align: left;">${p.name}</td>
            <td style="text-align: center;">${p.age}</td>
            <td style="text-align: center;"><span class="status ${p.status}">${p.status}</span></td>
        `;
        recordTableBody.appendChild(newRow);
    });
}

function resetDatabase() {
    localStorage.removeItem('medical_users');
    localStorage.removeItem('ward_data_General');
    localStorage.removeItem('ward_data_ICU');
    localStorage.removeItem('ward_data_Maternity');
    localStorage.removeItem('ward_data_Paediatrics');

    alert("Database cleared! Redirecting to login...");
    window.location.href = "/index.html";
}

renderTable();
function hardResetWards() {


    const wardNames = ['General', 'ICU', 'Maternity', 'Paediatrics'];
    wardNames.forEach(ward => {
        const emptyData = [
            { id: 1, ward: ward, patient: null },
            { id: 2, ward: ward, patient: null },
            { id: 3, ward: ward, patient: null },
            { id: 4, ward: ward, patient: null }
        ];
        localStorage.setItem(`ward_data_${ward}`, JSON.stringify(emptyData));
    });

    alert("Wards have been reset!");
    window.location.href = "/home.html";
}

document.addEventListener("DOMContentLoaded", () => {

    const currentUser = localStorage.getItem('currentUser') || 'User';
    const firstLetter = currentUser.charAt(0).toUpperCase();
    const avatarEl = document.getElementById('dynamic-avatar');
    
    if (avatarEl) {
        avatarEl.textContent = firstLetter;
    }


    const resetUserBtn = document.querySelector(".reset-database-link");
    const hardResetWardBtn = document.querySelector(".hard-reset-link");


    if (resetUserBtn) {
        resetUserBtn.addEventListener("click", function(event) {
            event.preventDefault();

            const isMobile = window.innerWidth <= 991;
            const isOpen = isMobile ? navigation.classList.contains("active") : !navigation.classList.contains("active");
        
            if (isOpen) {
                if (confirm("Are you sure you want to reset all users?")) {
                    resetDatabase();
                }
            }
        });
    }


    if (hardResetWardBtn) {
        hardResetWardBtn.addEventListener("click", function(event) {
            event.preventDefault();
            const isMobile = window.innerWidth <= 991;
            const isOpen = isMobile ? navigation.classList.contains("active") : !navigation.classList.contains("active");

            if (isOpen) {
                if (confirm("Are you sure you want to hard reset all wards? This cannot be undone.")) {
                    hardResetWards(); 
                }
            }
        });
    }
});

document.addEventListener("click", function (event) {

  const nav = document.querySelector(".navigation");
  const tgl = document.querySelector(".toggle");
  const mainCont = document.querySelector(".main");
  const dropdown = document.querySelector(".dropdown");

  if (!nav || !tgl) return;

  const isMobile = window.innerWidth <= 991;
  const isCurrentlyCollapsed = nav.classList.contains("active");

  const clickedInsideSidebar = nav.contains(event.target);
  const clickedToggle = tgl.contains(event.target);


  if (!isMobile && isCurrentlyCollapsed && clickedInsideSidebar && !clickedToggle) {
    nav.classList.remove("active");
    if (mainCont) mainCont.classList.remove("active");
  }

  const isVisuallyOpen = isMobile ? isCurrentlyCollapsed : !isCurrentlyCollapsed;

  if (isVisuallyOpen && !clickedInsideSidebar && !clickedToggle) {
    if (isMobile) {

      nav.classList.remove("active");
      if (mainCont) mainCont.classList.remove("active");
    } else {

      nav.classList.add("active");
      if (mainCont) mainCont.classList.add("active");
    }
    

    if (dropdown) {
      dropdown.classList.remove("active");
    }
  }
});