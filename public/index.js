
document.addEventListener('DOMContentLoaded', async ()=>{
    const isLoggedIn = document.getElementById('isLoggedIn')
    const notLoggedIn = document.getElementById('notLoggedIn')
    const test = document.getElementById('test')
    const logoff = document.getElementById('logoff')
    const staleSession = document.getElementById('staleSession')
    const expiredSession = document.getElementById('expiredSession')
    const messages = document.getElementById('messages')
    const timeLeft = document.getElementById('timeLeft')
    const token = sessionStorage.getItem('token')
    const tokenExpiration = sessionStorage.getItem('tokenExpiration')
    const currentSecs = Math.floor(Date.now() / 1000)
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
        const timeToExpire = tokenExpiration - currentSecs
        const hours = Math.floor(timeToExpire/3600)
        let remainder = timeToExpire % 3600
        const minutes = Math.floor(remainder / 60)
        const seconds = timeToExpire % 60
        timeLeft.innerText = `Your session will remain valid for ${hours} hours, ${minutes} minutes, and ${seconds} seconds.`
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