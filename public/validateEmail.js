document.addEventListener('DOMContentLoaded', async () => {
    const messages = document.getElementById("messages")
    const requestVerify = document.getElementById('requestVerify')
    const token = window.location.href.split('/').pop()
    try {
        const response = await fetch(`/api/v1/users/validateEmail`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })
        const data = await response.json()
        if (response.status === 200) {
            messages.innerHTML = `<p>The account for ${data.email} has been validated, so you can logon.</p>`
        } else if (response.status===400) {
            messages.innerHTML = '<p>The link did not work. It may have expired. You can request\
 another email to verify your account by putting in your email address below.<p>'
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
            messages.innerText="Bad link."
        }
    } catch (error) {
        console.log(error);
        alert(error);
    }
})