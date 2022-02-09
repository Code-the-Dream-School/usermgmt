document.addEventListener('DOMContentLoaded', async () => {
    const messages = document.getElementById("messages")
    const token = window.location.href.split('/').pop()
    try {
        const response = await fetch(`/api/v1/users/validateOneTimeToken`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })
        const data = await response.json()
        if (response.status === 200) {
            messages.innerHTML = `<p>Your link has been validated, so you can now reset the password for ${data.email}.  If you don't \
            want to reset the password, click on the Home or Logon link.</p>`
            const resetpw = document.getElementById('resetpw')
            resetpw.style.display = "block"
            const reset = document.getElementById('reset')
            reset.addEventListener('click', async () => {
                const password = document.getElementById('password')
                const password1 = document.getElementById('password1')
                pw = password.value.trim()
                pw1 = password1.value.trim()
                if (!pw) {
                    messages.innerHTML='<p>Please enter a password.</p>'
                } else if (pw != pw1) {
                    messages.innerHTML='<p>The passwords entered do not match.</p>'
                } else {
                    const response = await fetch(`/api/v1/users/resetPassword`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({password: pw})
                    })
                    const data = await response.json()
                    if (response.status === 200) {
                        resetpw.style.display='none'
                        messages.innerHTML=`<p>The password for ${req.data.email} has been changed.  You can now logon.</p>`
                    } else {
                        messages.innerText=data.message
                    }
                }
            })
        } else if (response.status=== 400) {
            messages.innerHTML = '<p>The link did not work. It may have expired. You can request\
 another email to reset the password for your account by putting in your email address below.<p>'
            requestVerify = document.getElementById('requestVerify')
            requestVerify.style.display = "block"
            requestEmail = document.getElementById("requestEmail")
            email = document.getElementById("email")
            requestEmail.addEventListener('click', async () => {
                if (email.value.trim()) {
                    const response = await fetch(`/api/v1/users/sendEmailValidatePrompt`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: email.value.trim()
                            })
                        })
                    const data = await response.json()
                    if (response.status != 200) {
                        messages.innerHTML='<p>That email was not found.  Try again or go to the home link and register.</p>'
                    } else {
                        messages.innerHTML='<p>The email has been sent.  Check your inbox and your spam folder\
                        for an email with subject line Verify Email (User Management).</p>'
                    }
                }
            })
        } else {
            messages.innerText="This is an invalid link."
        }
    } catch (error) {
        console.log(error);
        alert(error);
    }
})