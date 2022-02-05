
console.log('got here')
document.addEventListener('DOMContentLoaded', () => {
    const token = document.getElementById('token')
    console.log(window.location.href)
    token.textContent = window.location.href
})