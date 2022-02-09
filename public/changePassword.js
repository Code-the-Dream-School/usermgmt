document.addEventListener('DOMContentLoaded', async ()=>{
    const oldPassword = document.getElementById('oldPassword')
    const password = document.getElementById('password')
    const password1 = document.getElementById('password1')
    const changePassword = document.getElementById('changePassword')
    const messages = document.getElementById('messages')
    const token = sessionStorage.getItem('token')
    if (!token) {
        messages.innerText='You are not logged in.  You must be logged in to use this function.'
    } else {
        changePassword.addEventListener('click', async ()=>{
            try {
                oldpw = oldPassword.value.strip()
                if (!oldpw) {
                    messages.innerText='Please enter your current password.'
                    return
                } 
                pw = password.value.strip()
                if (!pw) {
                    messages.innerText='Please enter your new password.'
                    return
                }
                pw1 = password1.value.strip()
                if (pw != pw1) {
                    messages.innerText='The the new passwords entered do not match.'
                    return
                }
                response = await fetch('/api/v1/users/changePassword',
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            password: pw,
                            oldPassword: oldpw
                        })
                    })
                data = await response.json()
                messages.innerText = data.message
            } catch (error) {
                console.log(error)
                alert(error.name + ': ' + error.message)
            }
        })
    }
})