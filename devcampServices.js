const moment = require('moment')
const axios = require('axios')

const baseUrl = 'http://localhost:3001/palestras'

const getPalestrasDia = async data => {
    const url = `${baseUrl}?data=${data}`
    const res = await axios.get(url)
    return res.data
}

const getPalestra = async termo => {
    const url = `${baseUrl}?tema_like=${termo}`
    const res = await axios.get(url)
    return res.data
}

module.exports = {
    getPalestrasDia,
    getPalestra
}