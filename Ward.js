
function openAISupport() {
    if (window.chatbase) {
        window.chatbase("open");
    }
}

function setupChatbaseCloseListener() {
    const checkChatbase = setInterval(() => {
        if (window.chatbase && typeof window.chatbase === 'function') {
            window.chatbase("listen", {
                onClose: () => {
                    console.log("Chatbox closed - running reset code.")
                    
                    if (typeof window.chatbase.resetChat === 'function') {
                        window.chatbase.resetChat();
                    } else {
              
                        window.chatbase("reset"); 
                    }
                },
            });
            clearInterval(checkChatbase); 
        }
    }, 500); 
}

window.addEventListener('message', function(event) {
    if (typeof event.data === 'string' && event.data.toLowerCase().includes('close')) {
        console.log("Chatbox minimized - running reset code.");
        if (window.chatbase && typeof window.chatbase.resetChat === 'function') {
            window.chatbase.resetChat();
        } else if (window.chatbase) {
            window.chatbase("reset");
        }
    }
});



let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");
const dropdownParent = document.querySelector(".dropdown");
const dropdownBtn = document.querySelector(".dropdown-btn");


if (toggle) {
    toggle.onclick = function () {
      navigation.classList.toggle("active");
      if(main) main.classList.toggle("active");

      if (navigation.classList.contains("active") && dropdownParent) {
        dropdownParent.classList.remove("active");
      }
    };
}


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



let currentWard = "General"; 
const path = window.location.pathname.toLowerCase();

if (path.includes("icu")) {
    currentWard = "ICU";
} else if (path.includes("maternity")) {
    currentWard = "Maternity";
} else if (path.includes("pae")) {
    currentWard = "Paediatrics";
}


const storageKey = `ward_data_${currentWard}`;

let wardSlots = JSON.parse(localStorage.getItem(storageKey));

if (!wardSlots) {
    wardSlots = [
        { id: 1, ward: currentWard, patient:null},
        { id: 2, ward: currentWard, patient:  null  },
        { id: 3, ward: currentWard, patient: null },
        { id: 4, ward: currentWard, patient: null } 
    ];
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem(storageKey, JSON.stringify(wardSlots));
}

const patientList = document.getElementById('patient-list');
const patientCountText = document.getElementById('patient-count');
const modalOverlay = document.getElementById('modal-overlay');
const patientForm = document.getElementById('patient-form');
const closeBtn = document.getElementById('close-modal-btn');
const modalTitle = document.getElementById('modal-title');

function init() {
    renderPatients();
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function renderPatients() {
    if (!patientList) return; 

    let activePatients = wardSlots.filter(slot => slot.patient !== null).length;
    if (patientCountText) {
        patientCountText.innerText = `${activePatients} patient${activePatients !== 1 ? "s" : ""} in the ${currentWard} ward`;
    }

    patientList.innerHTML = wardSlots.map((slot, index) => {
        if (slot.patient !== null) {
            let p = slot.patient;
            return `
                <div class="patient-card group bg-white hover:shadow-lg transition-all duration-300 border border-slate-200 rounded-xl overflow-hidden" 
                     style="animation-delay: ${index * 0.08}s">
                    <div class="p-6">
                        <div class="flex items-center justify-between">
                            <div class="flex flex-col gap-1">
                                <div class="flex items-center gap-3">
                                    <div class="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                                        <span class="text-[#2a2185] font-bold text-xs">#${slot.id}</span>
                                    </div>
                                    <h3 class="text-lg font-bold text-slate-900">${p.name}</h3>
                                </div>
                                <div class="flex items-center gap-1.5 text-slate-500 text-sm ml-11">
                                    <i data-lucide="calendar" class="h-3.5 w-3.5"></i>
                                    <span>${p.age} years old</span>
                                </div>
                            </div>

                            <div class="flex items-center gap-4">
                                <span class="status-${p.status} border px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    ${p.status}
                                </span>
                                <div class="flex gap-1">
                                    <button onclick="openModal(${slot.id})" class="p-2 hover:bg-slate-100 rounded-md text-slate-400 hover:text-blue-600">
                                        <i data-lucide="pencil" class="h-4 w-4"></i>
                                    </button>
                                    <button onclick="removePatient(${slot.id})" class="p-2 hover:bg-red-50 rounded-md text-slate-400 hover:text-red-600">
                                        <i data-lucide="trash-2" class="h-4 w-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                    
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="patient-card group border-2 border-dashed border-slate-300 hover:border-[#2a2185] bg-slate-50 hover:bg-white transition-all duration-300 rounded-xl overflow-hidden cursor-pointer flex items-center justify-center py-10" 
                     onclick="openModal(${slot.id})" style="animation-delay: ${index * 0.08}s">
                    <div class="text-center text-slate-400 group-hover:text-[#2a2185] transition-colors">
                        <i data-lucide="plus-circle" class="h-10 w-10 mx-auto mb-2"></i>
                        <p class="text-sm font-medium">Add Patient to Slot ${slot.id}</p>
                    </div>
                </div>
            `;
        }
    }).join('');
    
    if(typeof lucide !== 'undefined') lucide.createIcons();
}

function openModal(slotId) {
    const slot = wardSlots.find(s => s.id === slotId);
    if (!slot) return;

    document.getElementById('form-id').value = slot.id;

    if (slot.patient) {
        modalTitle.innerText = "Edit Patient";
        document.getElementById('form-name').value = slot.patient.name;
        document.getElementById('form-age').value = slot.patient.age;
        document.getElementById('form-status').value = slot.patient.status;
        
 
        const condField = document.getElementById('form-condition');
        const progField = document.getElementById('form-progress');
        condField.value = slot.patient.condition;
        progField.value = slot.patient.progress || "";


        setTimeout(() => {
            autoExpand(condField);
            autoExpand(progField);
        }, 0);
    } else {
        modalTitle.innerText = `Add Patient to ${currentWard}`;
        patientForm.reset();
        document.getElementById('form-status').value = "stable"; 
    }

    modalOverlay.classList.remove('hidden');
}

function removePatient(slotId) {
    const slotIndex = wardSlots.findIndex(s => s.id === slotId);
    if (slotIndex !== -1) {
        wardSlots[slotIndex].patient = null;
        saveToStorage(); 
        renderPatients();
    }
}

function autoExpand(field) {
 
    field.style.height = 'inherit';

    const computed = window.getComputedStyle(field);

    const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                 + field.scrollHeight
                 + parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    field.style.height = height + 'px';
}

function closeModal() {
    if(modalOverlay) modalOverlay.classList.add('hidden');
}

if(closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

if (patientForm) {
    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const slotId = parseInt(document.getElementById('form-id').value);
        const submitBtn = document.getElementById('submit-btn');
        
        submitBtn.disabled = true;
        submitBtn.innerText = "Saving...";

        setTimeout(() => {
            const slotIndex = wardSlots.findIndex(s => s.id === slotId);
            if (slotIndex !== -1) {
                wardSlots[slotIndex].ward = currentWard; 
                wardSlots[slotIndex].patient = {
                    name: document.getElementById('form-name').value,
                    age: parseInt(document.getElementById('form-age').value),
                    condition: document.getElementById('form-condition').value,
                    status: document.getElementById('form-status').value
                };
            }

            saveToStorage(); 
            renderPatients();
            closeModal();
            
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<i data-lucide="save" class="h-4 w-4"></i> Save Changes`;
            if(typeof lucide !== 'undefined') lucide.createIcons();
        }, 400);
    });
}



function resetDatabase() {
    
  
    localStorage.removeItem('medical_users');
        
    localStorage.removeItem('ward_data_General');
    localStorage.removeItem('ward_data_ICU');
    localStorage.removeItem('ward_data_Maternity');
    localStorage.removeItem('ward_data_Paediatrics');
        
      
    alert("Database cleared! Redirecting to login...");
    window.location.href = "./index.html";
    
}

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
    window.location.href = "./home.html";
}


window.onload = function() {
    init();
    setupChatbaseCloseListener();
};

document.addEventListener("DOMContentLoaded", () => {
   
    const currentUser = localStorage.getItem('currentUser') || 'User';
    const firstLetter = currentUser.charAt(0).toUpperCase();
    const avatarEl = document.getElementById('dynamic-avatar');
    if (avatarEl) {
        avatarEl.textContent = firstLetter;
    }

    const resetUserBtn = document.querySelector(".reset-database-link");
    const hardResetWardBtn = document.querySelector(".hard-reset-link");
    const navBar = document.querySelector(".navigation");


    if (resetUserBtn) {
        resetUserBtn.addEventListener("click", function(event) {
            event.preventDefault();
            const isMobile = window.innerWidth <= 991;
            const isOpen = isMobile ? navBar.classList.contains("active") : !navBar.classList.contains("active");

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
            const isOpen = isMobile ? navBar.classList.contains("active") : !navBar.classList.contains("active");

            if (isOpen) {
                if (confirm("Are you sure you want to hard reset all wards?")) {
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
