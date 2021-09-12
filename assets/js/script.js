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

const nameContainer = document.getElementById('name-container')
const p1 = document.getElementById('p1')
const p2 = document.getElementById('p2')
const chalkBox = document.getElementById('chalk-box')
let processingNextStudent = false
// const toggleButtonDisabled = () => (
//     chalkBox.hasAttribute('disabled')
//         ? chalkBox.removeAttribute('disabled')
//         : chalkBox.setAttribute('disabled', true)
// )
const getStugents = () => JSON.parse(localStorage.getItem('studentsList'))
const setStudents = (studentsArr) => localStorage.setItem('studentsList', JSON.stringify(studentsArr))
const getCurrentStudent = () => localStorage.getItem('currentStudent')
const setCurrentStudent = (student) => localStorage.setItem('currentStudent', student)

const updateStudentsArr = (studentToRemove, allStudents) => {
    allStudents.splice(allStudents.indexOf(studentToRemove), 1)
    setStudents(allStudents.length > 0 ? allStudents : originalList)
}

const addClassFadeOut = (element) = () => element.classList.add('fade-out')
const removeClassFadeOut = (element) => element.classList.remove('fade-out')

const addClassFadeIn = (element) = () => element.classList.add('fade-in')
const removeClassFadeIn = (element) => element.classList.remove('fade-in')

const setTextContent = (element, text) => element.textContent = text

const hideCurrentName = () => {
    nameContainer.classList.add('fade-out')

    setTimeout(() => {
        setTextContent(p1, '')
        setTextContent(p2, '')
        removeClassFadeOut(nameContainer)
    }, 900)
}

const displayNewName = (name) => {
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

const handleDisplayProcess = (student) => {
    const _student = student

    if (p1.textContent) {
        hideCurrentName()
        setTimeout(() => displayNewName(_student), 1000)
        return
    }
    displayNewName(student)
}

const pickRandomStudent = () => {
    if (processingNextStudent) return
    processingNextStudent = true

    const students = getStugents() || originalList
    const randomStudent = students[Math.floor(Math.random() * students.length)]

    handleDisplayProcess(randomStudent)
    setCurrentStudent(randomStudent)
    updateStudentsArr(randomStudent, students)
}

const init = () => {
    setTimeout(() => chalkBox.classList.remove('hidden'), 1000)
    handleDisplayProcess(getCurrentStudent())
}

chalkBox.addEventListener('click', pickRandomStudent)

init()