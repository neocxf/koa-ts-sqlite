const url = `${process.env.HOST_URL || 'http://localhost:3000'}/users/reset-password-page?name=${process.env.user || 'neo'}&token=${process.env.randomVal || 'randomToken'}`
console.log(url)