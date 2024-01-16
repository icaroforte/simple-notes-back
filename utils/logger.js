const infoLog = (...params) => {
    console.log(...params);
};

const errorLog = (...params) => {
    console.error(...params);
};

module.exports = {
    infoLog, errorLog
}