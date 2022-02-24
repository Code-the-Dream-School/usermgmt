document.addEventListener('DOMContentLoaded', async () => {
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    const password1 = document.getElementById('password1')
    const register = document.getElementById('register')
    const messages = document.getElementById('messages')
    register.addEventListener('click', async () => {
        try {
            pw = password.value.trim()
            pw1 = password1.value.trim()
            if (!pw) {
                messages.innerText = "Please enter a password."
            } else if (pw != pw1) {
                messages.innerText = "The passwords entered don't match."
            } else {
                response = await fetch('/api/v1/users/register',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email.value,
                            password: pw
                        })
                    })
                data = await response.json()
                messages.innerText = data.message
            }
        } catch (error) {
            console.log(error)
            alert(error.name + ': ' + error.message)
        }
    })
})