const app = require('./app');
const config = require('./utils/config');
const { infoLog } = require('./utils/logger');

app.listen(config.PORT, () => {
    infoLog(`Server running on port ${config.PORT}`);
})