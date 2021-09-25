const originalList = [
    "Bagavathi Pillai",
    "Caitlyn Kidd",
    "Calvin Swomley",
    "Cameron Castor",
    "Carson Colgate",
    "Colleen Fimister",
    "Desai Siddharth",
    "Eric Martin",
    "Florencia Ceballos",
    "Hannah Franz",
    "Irvin Ruiz",
    "Jack McNary",
    "Jackson Barker",
    "Jesse Draper",
    "Jessica Budd",
    "Jessica Kasper",
    "Joana Santoyo",
    "John Gallagher",
    "Jonathan Jackson",
    "Jose Yanez",
    "Katlyn Boches",
    "Laurel Thorburn",
    "Lucas Despain",
    "Madeline Donley",
    "Mariana Davie",
    "Matt Thurber",
    "Matthew Robinette",
    "Nick Ross",
    "Ryan Mcculloch",
    "Ryan Paragas",
    "Sarah Ramirez",
    "Stephen Alvarado",
    "Tevon Vara",
    "Valerii Bihun",
    "Zachary Elliott",
    "Zaymon Gonzalez",
]


const eraseBtn = document.getElementById('erase-board')
const eraseModalEl = document.getElementById('erase-board-modal')
const eraseConfirmEl = document.getElementById('erase-confirm')
const eraseDenyEl = document.getElementById('erase-deny')
const studentCountEl = document.getElementById('student-count')
const dateEl = document.getElementById('date')
const timeEl = document.getElementById('time')
const locationEl = document.getElementById('location')
const hideLocationEl = document.getElementById('hide-location')


const previouslySelectedOl = document.getElementById('previously-selected')
const nameContainer = document.getElementById('name-container')
const p1 = document.getElementById('p1')
const p2 = document.getElementById('p2')
const chalkBox = document.getElementById('chalk-box')
const instructions = document.getElementById('instructions')

let processingNextStudent = false
let displayedMinute
let idx = 0

const getLocation = () => Intl.DateTimeFormat().resolvedOptions().timeZone
const handleHideLocation = (e) => locationEl.textContent = !(e.target.checked) ? '- - -' : getLocation().split('/').join(' - ').split('_').join(' ') || getLocation()

const getPreviousStudents = () => JSON.parse(localStorage.getItem('previousStudentsList'))
const setPreviousStudents = (studentsArr) => localStorage.setItem('previousStudentsList', JSON.stringify(studentsArr))
const getNumberOfPreviousStudents = () => getPreviousStudents().length
const getPreviouslySelectedStudent = () => {
    const arr = getPreviousStudents()
    return {
        idx: arr.length,
        student: arr.pop()
    }
}

const getRemainingStudents = () => JSON.parse(localStorage.getItem('remainginStudentsList'))
const setRemainingStudents = (studentsArr) => localStorage.setItem('remainginStudentsList', JSON.stringify(studentsArr))
const addClassFadeOut = (element) = () => element.classList.add('fade-out')
const removeClassFadeOut = (element) => element.classList.remove('fade-out')

const addClassFadeIn = (element) = () => element.classList.add('fade-in')
const removeClassFadeIn = (element) => element.classList.remove('fade-in')
const toggleClassHidden = (element) => element.classList.toggle('hidden')
const setTextContent = (element, text) => element.textContent = text

const toggleModalDisplay = () => {
    toggleClassHidden(eraseModalEl)
    toggleClassHidden(nameContainer)
}

const resetPreviousStudents = () => {

    let idx = previouslySelectedOl.childNodes.length - 1
    let removePreviousStudentsInterval

    removePreviousStudentsInterval = setInterval(() => {
        const ol = document.getElementById('previously-selected')
        const node = ol?.childNodes[idx]
        node?.classList.add('fade-out')
        setTimeout(() => ol?.removeChild(node), 1000)
        idx--
        if (idx < 0) clearInterval(removePreviousStudentsInterval)
    }, 200)
    setPreviousStudents([])
}

const updateRemainingStudentsArr = (studentToRemove, allStudents) => {
    allStudents.splice(allStudents.indexOf(studentToRemove), 1)
    setRemainingStudents(allStudents.length > 0 ? allStudents : originalList)
}

const updatePreviousStudentsArr = (selectedStudent) => {
    if (!selectedStudent) return
    const previousStudents = getPreviousStudents() || []
    if (previousStudents.length === originalList.length) {
        resetPreviousStudents()
        return
    }
    previousStudents.push(selectedStudent)
    setPreviousStudents(previousStudents)
}


const eraseCurrentName = () => {
    nameContainer.classList.add('fade-out')

    setTimeout(() => {
        setTextContent(p1, '')
        setTextContent(p2, '')
        removeClassFadeOut(nameContainer)
    }, 900)
}

const updateDisplayedCount = (num) => {
    studentCountEl.innerText = `${num} of ${originalList.length}`
}

const displayNewName = (name) => {
    if (!name) return
    const nameArr = name.split(' ')

    const displaySingleName = (element, name) => {
        element.classList.add('fade-in')
        element.textContent = name
        setTimeout(() => removeClassFadeIn(element), 1000)
    }

    displaySingleName(p1, nameArr[0])
    setTimeout(() => displaySingleName(p2, nameArr[1]), 500)
    setTimeout(() => { processingNextStudent = false }, 500)
}

const handleDisplayChosenStudent = (student) => {
    const _student = student

    if (p1.textContent) {
        eraseCurrentName()
        setTimeout(() => displayNewName(_student), 1000)
        return
    }
    displayNewName(student)
}

const addSelectedStudentToDOM = (student, idx) => {
    if (idx === 0) return
    const liEl = document.createElement('li')
    const spanEl = document.createElement('span')
    const pEl = document.createElement('p')
    spanEl.textContent = idx + '.'
    liEl.classList.add('fade-in')
    pEl.classList.add('student')
    pEl.textContent = student
    liEl.append(spanEl)
    liEl.append(pEl)
    previouslySelectedOl.append(liEl)
    setTimeout(() => removeClassFadeIn(liEl), 1000)
}

const buildPreviousStudentsList = () => {
    let delayedDisplayInterval
    previouslySelectedOl.innerHTML = ''
    const students = getPreviousStudents() || []
    let idx = 0

    // students.map((student, idx) => setTimeout(() => addSelectedStudentToDOM(student, idx + 1), 100))
    delayedDisplayInterval = setInterval(() => {
        addSelectedStudentToDOM(students[idx], idx + 1)
        idx++
        if (idx === students.length) clearInterval(delayedDisplayInterval)
    }, 200)
    updateDisplayedCount(getPreviouslySelectedStudent().idx)
}

const handleDisplayPreviousStudents = () => {
    if (!(p1.textContent)) return
    const x = getPreviouslySelectedStudent()
    if (x.idx === -1) return
    addSelectedStudentToDOM(x.student, x.idx)
}

const pickRandomStudent = () => {
    if (processingNextStudent) return
    processingNextStudent = true

    const students = getRemainingStudents() || [...originalList]
    if (students.length === originalList.length) resetPreviousStudents()

    const chosenStudent = students[Math.floor(Math.random() * students.length)]

    handleDisplayPreviousStudents()
    handleDisplayChosenStudent(chosenStudent)
    updatePreviousStudentsArr(chosenStudent)
    updateRemainingStudentsArr(chosenStudent, students)
    setTimeout(() => updateDisplayedCount(getPreviouslySelectedStudent().idx), 2000)
}

const clearLocalStorage = () => {
    localStorage.removeItem('remainginStudentsList')
    resetPreviousStudents()
    toggleModalDisplay()
    eraseCurrentName()
    updateDisplayedCount('-')
}

const formatMinute = (min) => min <= 10 ? `0${min}` : min

const handleDay = (date) => {
    const day = Intl.DateTimeFormat().format().split('/')
    day[2] = day[2].substring(2, 4)
    dateEl.innerText = day.join(' / ')
}

const handleTime = (date) => {
    let amPm = 'am'
    let hour = date.getHours()
    if (hour >= 12) {
        amPm = 'pm'
        hour -= 12
    }
    if (hour === 0) hour = 12

    const min = formatMinute(date.getMinutes())
    const formattedTime = `${hour}: ${min} ${amPm}`

    timeEl.innerText = formattedTime
    displayedMinute = min
}

const updateDateTime = (date) => {
    handleDay(date)
    handleTime(date)
}

const checkDateTime = () => {
    const date = new Date()
    if (displayedMinute === formatMinute(date.getMinutes())) return
    console.log('updating minutes')
    updateDateTime(date)
}

const init = () => {
    buildPreviousStudentsList()
    setTimeout(() => chalkBox.classList.remove('hidden'), 1000)
}

chalkBox.addEventListener('click', pickRandomStudent)


eraseBtn.addEventListener('click', () => toggleModalDisplay(eraseModalEl, 'hidden'))
eraseDenyEl.addEventListener('click', () => toggleModalDisplay(eraseModalEl, 'hidden'))
eraseConfirmEl.addEventListener('click', clearLocalStorage)
hideLocationEl.addEventListener('click', (e) => handleHideLocation(e))

document.addEventListener('keyup', (e) => e.code === 'Space' && pickRandomStudent())

setInterval(checkDateTime, 1000)
setTimeout(() => {
    instructions.classList.add('fade-out')
    setTimeout(() => toggleClassHidden(instructions), 1000)
}, 5000)


getNumberOfPreviousStudents() && init()