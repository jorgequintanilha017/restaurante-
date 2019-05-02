if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then(() => {
        console.log('Registration worked');
    })
    .catch(() => {
        console.log('Registration failed');
    });
}
