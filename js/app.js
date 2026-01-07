// Simple frontend interactions and sample job data
const jobs = [
  { id: 'j1', title: 'Field Sales Executive', role: 'sales', city: 'mumbai', exp: '1-2 yrs', salary: '₹12k-18k' },
  { id: 'j2', title: 'Customer Care Representative', role: 'customer-care', city: 'remote', exp: '0-1 yrs', salary: '₹8k-12k' },
  { id: 'j3', title: 'Inside Sales - B2B', role: 'sales', city: 'delhi', exp: '2-4 yrs', salary: '₹20k-30k' }
]

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear()
  renderJobs(jobs)

  // Filters
  document.getElementById('filterRole').addEventListener('change', applyFilters)
  document.getElementById('filterCity').addEventListener('change', applyFilters)
  document.getElementById('searchJobs').addEventListener('input', applyFilters)

  // Modal
  const applyModal = document.getElementById('applyModal')
  const ctaApplyBtn = document.getElementById('ctaApply')
  if (ctaApplyBtn) ctaApplyBtn.addEventListener('click', () => openModal())
  const applyPageBtn = document.getElementById('applyBtn')
  if (applyPageBtn) applyPageBtn.addEventListener('click', () => openModal())
  const modalCloseBtn = document.querySelector('.modal-close')
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal)

  document.getElementById('jobsList').addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) return
    const jobId = btn.dataset.job
    if (btn.classList.contains('apply')) openModal(jobId)
  })

  document.getElementById('applyForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const fullName = (formData.get('fullName') || '').trim()
    const email = (formData.get('email') || '').trim()
    const phone = (formData.get('phone') || '').trim()
    const experience = (formData.get('experience') || '').trim()
    const jobId = formData.get('jobId') || null

    // basic validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const phoneOk = /^[0-9 +()-]{7,20}$/.test(phone)
    if (!fullName || !emailOk || !phoneOk || !experience) {
      alert('Please enter a valid name, email and phone number.')
      return
    }

    const resumeFile = form.querySelector('input[name="resume"]').files[0]
    const app = { id: 'app_' + Date.now(), fullName, email, phone, experience, jobId, createdAt: new Date().toISOString() }

    if (resumeFile) {
      app.resumeName = resumeFile.name
      app.resumeType = resumeFile.type
      app.resumeSize = resumeFile.size
      try {
        app.resumeDataUrl = await readFileAsDataURL(resumeFile)
      } catch (err) {
        console.warn('Failed to read resume', err)
      }
    }

    saveApplication(app)

    form.hidden = true
    document.getElementById('applySuccess').hidden = false
  })

  document.getElementById('applyDone').addEventListener('click', () => {
    closeModal();
    document.getElementById('applyForm').hidden = false
    document.getElementById('applySuccess').hidden = true
    document.getElementById('applyForm').reset()
  })

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle')
  const mainNav = document.getElementById('mainNav')
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true'
      navToggle.setAttribute('aria-expanded', String(!expanded))
      const shouldShow = !expanded
      mainNav.setAttribute('aria-hidden', String(!shouldShow))
      if (shouldShow) mainNav.scrollTop = 0
    })
  }

  // close modal when clicking outside content
  const modal = document.getElementById('applyModal')
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })

  // Contact form (client-side)
  const contactForm = document.getElementById('contactForm')
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const fd = new FormData(contactForm)
      const msg = { id: 'msg_' + Date.now(), name: fd.get('name'), email: fd.get('email'), message: fd.get('message'), createdAt: new Date().toISOString() }
      saveContactMessage(msg)
      contactForm.reset()
      alert('Message received! We will contact you soon.')
    })
  }

  // Admin actions: export/clear
  const exportBtn = document.getElementById('exportApps')
  const clearBtn = document.getElementById('clearApps')
  if (exportBtn) exportBtn.addEventListener('click', () => exportApplications())
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all stored applications and messages from this browser?')) return
    localStorage.removeItem('marketyog_applications')
    localStorage.removeItem('marketyog_messages')
    alert('Cleared stored applications and messages.')
  })

  // Helper functions for storage and file export
  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader()
      r.onload = () => resolve(r.result)
      r.onerror = reject
      r.readAsDataURL(file)
    })
  }

  function saveApplication(app) {
    const key = 'marketyog_applications'
    const list = JSON.parse(localStorage.getItem(key) || '[]')
    list.push(app)
    localStorage.setItem(key, JSON.stringify(list))
  }

  function saveContactMessage(msg) {
    const key = 'marketyog_messages'
    const list = JSON.parse(localStorage.getItem(key) || '[]')
    list.push(msg)
    localStorage.setItem(key, JSON.stringify(list))
  }

  function exportApplications() {
    const apps = JSON.parse(localStorage.getItem('marketyog_applications') || '[]')
    const msgs = JSON.parse(localStorage.getItem('marketyog_messages') || '[]')
    const payload = { exportedAt: new Date().toISOString(), applications: apps, messages: msgs }
    downloadJSON('marketyog_export_' + Date.now() + '.json', payload)
  }

  function downloadJSON(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // Language toggle (simple)
  document.getElementById('langToggle').addEventListener('click', () => {
    const btn = document.getElementById('langToggle')
    if (btn.textContent.trim() === 'हिंदी') {
      translateToHindi()
      btn.textContent = 'EN'
    } else {
      translateToEnglish()
      btn.textContent = 'हिंदी'
    }
  })
})

function renderJobs(list) {
  const el = document.getElementById('jobsList')
  el.innerHTML = ''
  list.forEach(j => {
    const card = document.createElement('article')
    card.className = 'job-card'
    card.innerHTML = `
      <h3>${escapeHtml(j.title)}</h3>
      <div class="job-meta">${j.role} • ${j.city} • ${j.exp}</div>
      <p>Salary: ${j.salary}</p>
      <div class="job-actions">
        <button class="btn apply" data-job="${j.id}">Apply</button>
        <button class="btn ghost" onclick="viewDetails('${j.id}')">Details</button>
      </div>
    `
    el.appendChild(card)
    // small entrance animation
    requestAnimationFrame(() => card.classList.add('fade-in'))
  })
}

function applyFilters() {
  const role = document.getElementById('filterRole').value
  const city = document.getElementById('filterCity').value
  const q = document.getElementById('searchJobs').value.trim().toLowerCase()
  const filtered = jobs.filter(j => {
    return (role === 'all' || j.role === role) && (city === 'all' || j.city === city) && (q === '' || (j.title + ' ' + j.role).toLowerCase().includes(q))
  })
  renderJobs(filtered)
}

function openModal(jobId) {
  const modal = document.getElementById('applyModal')
  modal.setAttribute('aria-hidden', 'false')
  const titleEl = document.getElementById('modalTitle')
  if (jobId) {
    document.querySelector('input[name="jobId"]').value = jobId
    const job = jobs.find(j => j.id === jobId)
    if (job && titleEl) titleEl.textContent = `Apply — ${job.title}`
  } else if (titleEl) {
    titleEl.textContent = 'Apply for this job'
  }
  // focus first input
  setTimeout(() => {
    const first = document.querySelector('#applyForm input[name="fullName"]')
    if (first) first.focus()
  }, 150)
}

function closeModal() {
  const modal = document.getElementById('applyModal')
  modal.setAttribute('aria-hidden', 'true')
}

function viewDetails(id) {
  const job = jobs.find(j => j.id === id)
  if (!job) return alert('Job not found')
  alert(`${job.title}\n\nRole: ${job.role}\nCity: ${job.city}\nExperience: ${job.exp}\nSalary: ${job.salary}`)
}

function translateToHindi() {
  document.getElementById('heroTitle').textContent = 'MarketYog — Aapki Placement Partner'
  document.getElementById('heroSubtitle').textContent = 'Hum short-list karte hain aur pehli interview lete hain, phir aapko bhejte hain.'
  document.querySelector('h2').textContent = 'Kaise Kaam Karta Hai'
}
function translateToEnglish() {
  document.getElementById('heroTitle').textContent = 'MarketYog — Your Placement Partner'
  document.getElementById('heroSubtitle').textContent = 'We screen, interview, and send ready-to-work Sales & Customer Care agents.'
  document.querySelector('h2').textContent = 'How MarketYog Works'
}

// small helper
function escapeHtml(str){return String(str).replace(/[&"'<>]/g,function(a){return{'&':'&amp;','"':'&quot;','\'':'&#39;','<':'&lt;','>':'&gt;'}[a]})}
