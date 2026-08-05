interface IPackageUpdates {
  [packageName: string]: {
    files: {
      [origPath: string]: string;
    };
  };
}

export const packageUpdates: IPackageUpdates = {
  play: {
    files: {
      'play/keypress.py': 'play/keypress.py',
    },
  },
};
