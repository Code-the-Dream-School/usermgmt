
document.addEventListener('DOMContentLoaded', async ()=>{
    const isLoggedIn = document.getElementById('isLoggedIn')
    const notLoggedIn = document.getElementById('notLoggedIn')
    const test = document.getElementById('test')
    const logoff = document.getElementById('logoff')
    const staleSession = document.getElementById('staleSession')
    const expiredSession = document.getElementById('expiredSession')
    const messages = document.getElementById('messages')
    const token = sessionStorage.getItem('token')
    const tokenExpiration = sessionStorage.getItem('tokenExpiration')
    const currentSecs = Date.now() / 1000
    let expired = false
    if (tokenExpiration && (currentSecs>tokenExpiration)) {
        expired=true
    }
    let loggedOn=true
    if (!token || expired) {
        loggedOn=false
    }
    let stale=false 
    if (token && (tokenExpiration - currentSecs < 3600)) {
        stale=true
    }
    if (loggedOn) {
        isLoggedIn.style.display = 'block'
        if (stale) {
            staleSession.innerText="You should logon again, as your session will expire in less than an hour."
        }
    } else {
        notLoggedIn.style.display = 'block'
        if (expired) {
            expiredSession.innerText="You were logged on, but your session has expired."
        }
    }
    if (loggedOn) {
        test.addEventListener('click', async ()=>{
            try {
                response = await fetch('/api/v1/users/test', {
                   headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                   }
                })
                data = await response.json()
                messages.innerText=data.message
            } catch (error) {
                console.log(error)
                alert(error.name + ': ' + error.message)
            }
        })
        logoff.addEventListener('click', ()=>{
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('tokenExpiration')
            sessionStorage.removeItem('email')
            isLoggedIn.style.display='none'
            notLoggedIn.style.display='block'
        })
    }
})