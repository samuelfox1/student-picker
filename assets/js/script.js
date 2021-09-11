const originalList = [
    "Bagavathi perumal",
    "Blaine Donovan",
    "Caitlyn Kidd",
    "Calvin Swomley",
    "Cameron Castor",
    "Carson Colgate",
    "Desai Siddharth",
    "Florencia Ceballos",
    "Hannah Franz",
    "Irvin Ruiz",
    "Jackson Barker",
    "Jesse Draper",
    "Jessica Kasper",
    "Joana Santoyo",
    "John Gallagher",
    "Jonathan Jackson",
    "Jose Yanez",
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

const h2 = document.querySelector('h2')
const button = document.querySelector('button')

const getStugents = () => JSON.parse(localStorage.getItem('studentsList'))
const setStudents = (studentsArr) => localStorage.setItem('studentsList', JSON.stringify(studentsArr))

const updateStudents = (studentToRemove, allStudents) => {
    const indexOfStudent = allStudents.indexOf(studentToRemove)
    allStudents.splice(indexOfStudent, 1)
    setStudents(allStudents.length > 0 ? allStudents : originalList)
}

const pickRandomStudent = () => {
    const students = getStugents() || originalList
    const randomNum = Math.floor(Math.random() * students.length)
    const randomStudent = students[randomNum]

    h2.innerText = randomStudent
    updateStudents(randomStudent, students)
}

button.addEventListener('click', pickRandomStudent)