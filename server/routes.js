const { applyFilter, getSpecificDoc, getHelpText } = require('./commands');

module.exports = ({ command, token, text }) => {
  return new Promise((resolve, reject) => {
    if (token !== process.env.TOKEN) {
      return reject('invalid token');
    }
    if (command === '/lion-bot') {
      if (text === 'help') {
        return resolve(getHelpText());
      }

      if (text === 'filtered') {
        return resolve(getSpecificDoc().then(applyFilter));
      }

      const matches = /filtered.(\d+)/i.exec(text);
      if (matches) {
        const ind = +matches[1];
        return resolve(getSpecificDoc(ind).then(applyFilter));
      }

      const indMatch = /(\d+)/g.exec(text)
      if (indMatch) {
        const ind = +indMatch[1];
        return resolve(getSpecificDoc(ind));
      }

      return resolve(getSpecificDoc());
    }
    reject('invalid command');
  });
};
