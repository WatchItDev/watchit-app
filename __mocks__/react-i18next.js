module.exports = {
  useTranslation: () => {
    return {
      t: (key) => key,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
};
