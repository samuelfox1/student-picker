const originalList = [
    "Bagavathi Pillai",
    "Blaine Donovan",
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
    "Rachid Aderdour",
    "Ryan Mcculloch",
    "Ryan Paragas",
    "Sarah Ramirez",
    "Stephen Alvarado",
    "Tevon Vara",
    "Valerii Bihun",
    "Zachary Elliott",
    "Zaymon Gonzalez",
]
const eraseButton = document.getElementById('erase-board')
const eraseModal = document.getElementById('erase-board-modal')
const eraseConfirm = document.getElementById('erase-confirm')
const eraseDeny = document.getElementById('erase-deny')

const previouslySelectedOl = document.querySelector('#previously-selected ol')
const nameContainer = document.getElementById('name-container')
const p1 = document.getElementById('p1')
const p2 = document.getElementById('p2')
const chalkBox = document.getElementById('chalk-box')
let processingNextStudent = false
let idx = 0


const toggleModalDisplay = () => {
    eraseModal.classList.toggle('hidden')
    nameContainer.classList.toggle('hidden')
}

const getPreviousStudents = () => JSON.parse(localStorage.getItem('previousStudentsList'))
const setPreviousStudents = (studentsArr) => localStorage.setItem('previousStudentsList', JSON.stringify(studentsArr))
const getPreviouslySelectedStudent = () => {
    const arr = getPreviousStudents()
    return {
        idx: arr.length - 1,
        student: arr.pop()
    }
}


const getRemainingStudents = () => JSON.parse(localStorage.getItem('remainginStudentsList'))
const setRemainingStudents = (studentsArr) => localStorage.setItem('remainginStudentsList', JSON.stringify(studentsArr))

const resetPreviousStudents = () => {
    previouslySelectedOl.innerHTML = ''
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
        console.log(previousStudents.length, originalList.length)
        resetPreviousStudents()
        return
    }
    previousStudents.push(selectedStudent)
    setPreviousStudents(previousStudents)
}

const addClassFadeOut = (element) = () => element.classList.add('fade-out')
const removeClassFadeOut = (element) => element.classList.remove('fade-out')

const addClassFadeIn = (element) = () => element.classList.add('fade-in')
const removeClassFadeIn = (element) => element.classList.remove('fade-in')

const setTextContent = (element, text) => element.textContent = text

const eraseCurrentName = () => {
    nameContainer.classList.add('fade-out')

    setTimeout(() => {
        setTextContent(p1, '')
        setTextContent(p2, '')
        removeClassFadeOut(nameContainer)
    }, 900)
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

    setTimeout(() => processingNextStudent = false, 500)
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
}

const buildPreviousStudentsList = () => {
    previouslySelectedOl.innerHTML = ''
    const students = getPreviousStudents() || []
    students.map((student, idx) => addSelectedStudentToDOM(student, idx))
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
}


const clearLocalStorage = () => {
    localStorage.removeItem('remainginStudentsList')
    resetPreviousStudents()
    toggleModalDisplay()
    eraseCurrentName()
}

const init = () => {
    buildPreviousStudentsList()
    setTimeout(() => chalkBox.classList.remove('hidden'), 1000)
}


chalkBox.addEventListener('click', pickRandomStudent)
eraseButton.addEventListener('click', () => toggleModalDisplay(eraseModal, 'hidden'))
eraseDeny.addEventListener('click', () => toggleModalDisplay(eraseModal, 'hidden'))
eraseConfirm.addEventListener('click', clearLocalStorage)
init()