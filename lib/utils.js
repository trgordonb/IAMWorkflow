const customRound = (num) => (Math.round((num + Number.EPSILON) * 100) / 100).toLocaleString()

module.exports = {
    customRound
}